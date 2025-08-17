# scripts/make_south125.py
import os, zipfile, warnings
import geopandas as gpd
from shapely.ops import unary_union, linemerge, split
from shapely.geometry import Point, box, Polygon
import shapely
import osmnx as ox

OUTPUT_PATH = os.path.join("public", "data", "manhattan-south125.geojson")
ZIP_CANDIDATES = ["nybb_25b.zip", os.path.expanduser("~/Downloads/nybb_25b.zip")]
OSM_PLACE = "Manhattan, New York, USA"

# Tuning
CUT_BUFFER_METERS = 8          # widen the cut line a bit for robustness
SIMPLIFY_TOL_METERS = 6        # light simplify for client perf (set 0 to disable)
WORK_CRS = 2263                # NY State Plane (ft/US) would be 2263; meters CRS 6539 also fine
# If 2263 on your system is feet, we convert buffer/simplify meters->feet ~3.28084
M_TO_FT = 3.28084

def find_zip():
    for z in ZIP_CANDIDATES:
        zp = z if os.path.isabs(z) else os.path.join(os.getcwd(), z)
        if os.path.isfile(zp): return zp
    return None

def ensure_unzipped(zip_path, out_dir):
    if not os.path.isdir(out_dir):
        with zipfile.ZipFile(zip_path) as zf: zf.extractall(out_dir)
    return out_dir

def find_shp(dirpath):
    for root, _, files in os.walk(dirpath):
        for f in files:
            if f.lower().endswith(".shp"):
                return os.path.join(root, f)
    return None

def load_manhattan(shp_path):
    gdf = gpd.read_file(shp_path)
    name_col = "BoroName" if "BoroName" in gdf.columns else ("Borough" if "Borough" in gdf.columns else None)
    if not name_col: raise SystemExit(f"No borough name column in: {list(gdf.columns)}")
    manhattan = gdf[gdf[name_col].str.contains("Manhattan", case=False, na=False)].to_crs(4326)
    if manhattan.empty: raise SystemExit("Manhattan not found in shapefile.")
    poly = unary_union(manhattan.geometry.values)
    if not poly.is_valid: poly = poly.buffer(0)
    return gpd.GeoSeries([poly], crs=4326)

def fetch_125th_centerline(place):
    # OSMnx ≥ 2.0
    g = ox.features_from_place(place, tags={"highway": True})
    lines = g[g.geometry.geom_type.isin(["LineString","MultiLineString"])].copy()
    if lines.empty: raise SystemExit("No highway lines returned from OSM.")

    name_cols = [c for c in ["name","alt_name","official_name"] if c in lines.columns]
    def matches(row):
        for c in name_cols:
            v = row.get(c)
            if isinstance(v, str):
                s = v.lower()
                if "125th" in s or "martin luther king" in s:
                    return True
        return False

    lines = lines[lines.apply(matches, axis=1)]
    if lines.empty: raise SystemExit("Could not find 125th St in OSM names.")
    merged = linemerge(unary_union(lines.geometry.values))
    if merged.geom_type != "LineString":
        merged = max(list(merged.geoms), key=lambda g: g.length)
    return gpd.GeoSeries([merged], crs=4326)

def south_of_line(manhattan_4326: gpd.GeoSeries, line_4326: gpd.GeoSeries) -> Polygon:
    """Robust: split an expanded bbox with the line, take the southern half, then intersect with Manhattan."""
    # Reproject to a planar CRS for stable buffering/splitting
    man = manhattan_4326.to_crs(WORK_CRS)
    ln  = line_4326.to_crs(WORK_CRS)

    # Expanded bounding box around Manhattan
    minx, miny, maxx, maxy = man.total_bounds
    pad = max(maxx-minx, maxy-miny) * 0.2  # generous padding
    bbox = box(minx - pad, miny - pad, maxx + pad, maxy + pad)

    # Buffer the line a hair to ensure it fully cuts the bbox (units depend on WORK_CRS)
    # If 2263 is in feet, convert meters → feet
    buf = CUT_BUFFER_METERS * (M_TO_FT if WORK_CRS == 2263 else 1.0)
    cut_band = ln.iloc[0].buffer(buf)

    # Split the bbox with the buffered line; take the piece whose centroid is SOUTH of the line’s centroid
    pieces = split(bbox, cut_band)
    if not hasattr(pieces, "geoms"):
        raise SystemExit("Split failed — line may not cross the bbox.")

    line_y = ln.iloc[0].centroid.y
    lower_pieces = [p for p in pieces.geoms if p.centroid.y < line_y]
    if not lower_pieces:
        # fallback: choose piece with lowest top edge
        lower_pieces = list(pieces.geoms)
    south_box_part = min(lower_pieces, key=lambda p: p.bounds[3])

    # Intersect with Manhattan to get the true south-of-125th footprint
    south = man.iloc[0].intersection(south_box_part)
    south = shapely.make_valid(south)

    # Optional simplify in WORK_CRS
    tol = SIMPLIFY_TOL_METERS * (M_TO_FT if WORK_CRS == 2263 else 1.0)
    if SIMPLIFY_TOL_METERS > 0:
        south = south.simplify(tol, preserve_topology=True)

    # Return to WGS84
    south_gs = gpd.GeoSeries([south], crs=WORK_CRS).to_crs(4326)
    poly = south_gs.iloc[0]
    # Ensure single Polygon (not Multi)
    if poly.geom_type == "MultiPolygon":
        poly = max(list(poly.geoms), key=lambda g: g.area)
    # Strip holes (optional)
    if isinstance(poly, Polygon):
        poly = Polygon(poly.exterior)
    return poly

def main():
    root = os.getcwd()
    out_path = os.path.join(root, OUTPUT_PATH)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    zip_path = find_zip()
    if not zip_path: raise SystemExit("Place nybb_25b.zip in project root or ~/Downloads.")
    shp_dir = ensure_unzipped(zip_path, os.path.join(root, "nybb_25b_unzipped"))
    shp_path = find_shp(shp_dir)
    if not shp_path: raise SystemExit("No .shp found in nybb_25b_unzipped")

    print(f"Reading Manhattan from: {shp_path}")
    man = load_manhattan(shp_path)          # GeoSeries (4326)
    line = fetch_125th_centerline(OSM_PLACE)  # GeoSeries (4326)

    south_poly = south_of_line(man, line)
    minx, miny, maxx, maxy = south_poly.bounds
    print(f"Bounds lat: {miny:.4f}..{maxy:.4f}  (max should be ~≤ 40.81)")

    gpd.GeoDataFrame([{"name": "Manhattan south of 125th (cut via bbox)", "geometry": south_poly}],
                     crs="EPSG:4326").to_file(out_path, driver="GeoJSON")
    print("✅ Wrote:", out_path)

if __name__ == "__main__":
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", category=UserWarning)
        main()
