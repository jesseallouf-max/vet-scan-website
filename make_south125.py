# scripts/make_south125.py
import os
import sys
import zipfile
import warnings

import geopandas as gpd
from shapely.ops import unary_union, linemerge, split
from shapely.geometry import Point
import shapely
import osmnx as ox

# ---- Config you may tweak ----
OUTPUT_PATH = os.path.join("public", "data", "manhattan-south125.geojson")
ZIP_CANDIDATES = [
    "nybb_25b.zip",                      # project root
    os.path.expanduser("~/Downloads/nybb_25b.zip"),  # Downloads
]
OSM_PLACE = "Manhattan, New York, USA"
# A small buffer (in degrees) around the cut line to guarantee the split; ~8-10 meters.
CUT_BUFFER = 0.0001
# Simplify the resulting polygon a touch for client perf (meters-ish in degrees).
SIMPLIFY_TOL = 0.00008  # ~8-9 m; set to 0 to disable
# --------------------------------

def find_zip():
    for z in ZIP_CANDIDATES:
        zp = z if os.path.isabs(z) else os.path.join(os.getcwd(), z)
        if os.path.isfile(zp):
            return zp
    return None

def ensure_unzipped(zip_path, out_dir):
    if os.path.isdir(out_dir):
        return out_dir
    with zipfile.ZipFile(zip_path) as zf:
        zf.extractall(out_dir)
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
    if not name_col:
        raise SystemExit(f"Could not find borough name column in: {list(gdf.columns)}")
    manhattan = gdf[gdf[name_col].str.contains("Manhattan", case=False, na=False)].to_crs(4326)
    if manhattan.empty:
        raise SystemExit("Could not find Manhattan in the shapefile.")
    poly = unary_union(manhattan.geometry.values)
    # Fix invalid geometries if any
    if not poly.is_valid:
        poly = poly.buffer(0)
    return poly

def fetch_125th_centerline(place):
    # Pull all highways, filter by name/alt_name containing 125th or MLK Blvd alias
    print("Fetching OSM geometries for 125th Street…")
    g = ox.geometries_from_place(place, tags={"highway": True})
    # Normalize columns
    cols = set(g.columns)
    name_cols = [c for c in ["name", "alt_name", "official_name"] if c in cols]

    if not name_cols:
        raise SystemExit("OSM data missing name columns; unexpected.")

    g_lines = g[g.geometry.geom_type.isin(["LineString", "MultiLineString"])].copy()
    if g_lines.empty:
        raise SystemExit("No line geometries returned from OSM.")

    def matches_125th(row):
        for c in name_cols:
            val = row.get(c)
            if not isinstance(val, str):
                continue
            v = val.lower()
            if "125th" in v or "martin luther king" in v:
                return True
        return False

    g_lines = g_lines[g_lines.apply(matches_125th, axis=1)]
    if g_lines.empty:
        raise SystemExit("Could not find 125th Street lines in OSM (name filter returned empty).")

    merged = linemerge(unary_union(g_lines.geometry.values))
    # If multiple segments remain, keep the longest
    if merged.geom_type != "LineString":
        merged = max(list(merged.geoms), key=lambda geom: geom.length)
    return merged

def split_south(man_poly, cut_line):
    # Buffer the line slightly to ensure a clean split across tiny gaps
    line_buf = cut_line.buffer(CUT_BUFFER)
    try:
        pieces = split(man_poly, line_buf)
    except Exception as e:
        # As a fallback, try splitting with the raw line
        warnings.warn(f"Split with buffer failed ({e}); retrying with raw line.")
        pieces = split(man_poly, cut_line)

    polys = []
    if hasattr(pieces, "geoms"):
        polys = [g for g in pieces.geoms if g.geom_type == "Polygon"]
    elif pieces.geom_type == "Polygon":
        polys = [pieces]

    if not polys:
        raise SystemExit("Split produced no polygons; the cut line may not intersect Manhattan.")

    # Choose the polygon that contains Times Square (definitely south of 125th)
    times_sq = Point(-73.9855, 40.7580)
    south = next((p for p in polys if p.contains(times_sq)), None)
    if south is None:
        # Fallback: pick polygon with the lowest max latitude
        south = sorted(polys, key=lambda p: p.bounds[3])[0]
    return south

def main():
    root = os.getcwd()
    out_path = os.path.join(root, OUTPUT_PATH)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    zip_path = find_zip()
    if not zip_path:
        raise SystemExit("Could not find nybb_25b.zip in project root or ~/Downloads.")

    shp_dir = ensure_unzipped(zip_path, os.path.join(root, "nybb_25b_unzipped"))
    shp_path = find_shp(shp_dir)
    if not shp_path:
        raise SystemExit("No .shp found under nybb_25b_unzipped")

    print(f"Reading Manhattan from: {shp_path}")
    man_poly = load_manhattan(shp_path)

    cut_line = fetch_125th_centerline(OSM_PLACE)

    south_poly = split_south(man_poly, cut_line)

    # Optional simplification for client perf
    if SIMPLIFY_TOL and SIMPLIFY_TOL > 0:
        south_poly = south_poly.simplify(SIMPLIFY_TOL, preserve_topology=True)

    gpd.GeoDataFrame(
        [{"name": "Manhattan south of 125th (OSM-clipped)", "geometry": south_poly}],
        crs="EPSG:4326",
    ).to_file(out_path, driver="GeoJSON")

    print("✅ Wrote:", out_path)

if __name__ == "__main__":
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", category=UserWarning)
        main()
