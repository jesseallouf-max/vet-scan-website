import { useEffect, useRef, useState } from "react";

// Map configuration  
const MAP_HEIGHT = "h-[380px] sm:h-[440px] md:h-[520px] lg:h-[600px]";
const CENTER = { lat: 40.758, lng: -73.985 };
const ZOOM = 12;

// Neighborhood pins
const neighborhoods = [
  { name: "Upper East Side",  lat: 40.7736, lng: -73.9566 },
  { name: "Upper West Side",  lat: 40.7870, lng: -73.9754 },
  { name: "Midtown East",     lat: 40.7549, lng: -73.9680 },
  { name: "Midtown West",     lat: 40.7590, lng: -73.9916 },
  { name: "Gramercy",         lat: 40.7376, lng: -73.9827 },
  { name: "Chelsea",          lat: 40.7465, lng: -74.0014 },
  { name: "West Village",     lat: 40.7336, lng: -74.0027 },
  { name: "East Village",     lat: 40.7265, lng: -73.9815 },
  { name: "SoHo",             lat: 40.7233, lng: -74.0030 },
  { name: "Lower East Side",  lat: 40.7150, lng: -73.9843 },
  { name: "Tribeca",          lat: 40.7163, lng: -74.0086 },
  { name: "Financial District", lat: 40.7075, lng: -74.0113 },
];

// Static Maps URL for preview
function staticMapUrl(key: string) {
  const base = "https://maps.googleapis.com/maps/api/staticmap";
  const size = "size=1200x700&scale=2";
  const center = `center=${CENTER.lat},${CENTER.lng}&zoom=${ZOOM}`;
  const styles = [
    "style=element:geometry|color:0x1a1a1a",
    "style=element:labels.text.fill|color:0xe2e8f0",
    "style=element:labels.text.stroke|visibility:off",
    "style=feature:poi|visibility:off",
    "style=feature:transit|visibility:off",
    "style=feature:road|element:geometry|color:0x2d3748",
    "style=feature:water|color:0x2c5282",
  ].join("&");
  const markers = neighborhoods
    .map((n) => `markers=color:0x0f766e%7Clabel:%7C${n.lat},${n.lng}`)
    .join("&");
  return `${base}?${size}&${center}&${styles}&${markers}&key=${encodeURIComponent(key)}`;
}

declare global {
  interface Window {
    google?: any;
    gm_authFailure?: () => void;
  }
}

export default function Coverage() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const desktopContainerRef = useRef(null);
  const desktopMapRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [desktopInView, setDesktopInView] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => setHydrated(true), []);

  // IntersectionObserver for mobile
  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { rootMargin: "200px 0px 200px 0px", threshold: 0.05 }
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  // IntersectionObserver for desktop
  useEffect(() => {
    if (!desktopContainerRef.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setDesktopInView(true)),
      { rootMargin: "200px 0px 200px 0px", threshold: 0.05 }
    );
    io.observe(desktopContainerRef.current);
    return () => io.disconnect();
  }, []);

  // Shared function to create pins
  const createPins = (map: any, google: any) => {
    // Add CSS for pins (only once)
    if (!document.querySelector('#vs-pin-styles')) {
      const css = `
        .vs-pin {
          display: inline-flex;
          align-items: center;
          background: #0f766e;
          color: #ffffff;
          border-radius: 16px;
          padding: 8px 16px;
          font-weight: 600;
          font-size: 13px;
          line-height: 1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid rgba(255,255,255,0.9);
          user-select: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .vs-pin:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0,0,0,0.4);
          background: #0d9488;
        }
      `;
      const style = document.createElement("style");
      style.id = 'vs-pin-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }

    // Add pins
    const canAdvanced = Boolean(google.maps?.marker?.AdvancedMarkerElement);
    
    if (canAdvanced) {
      neighborhoods.forEach((n) => {
        const el = document.createElement("div");
        el.className = "vs-pin";
        el.textContent = n.name;
        
        new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: n.lat, lng: n.lng },
          content: el,
          title: n.name,
          zIndex: 1000,
        });
      });
    } else {
      neighborhoods.forEach((n) => {
        new google.maps.Marker({
          map,
          position: { lat: n.lat, lng: n.lng },
          title: n.name,
          zIndex: 1000,
          label: {
            text: n.name,
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: "600",
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#0f766e",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 8,
          },
        });
      });
    }
  };

  // Shared function to add GeoJSON
  const addGeoJSON = async (map: any) => {
    try {
      const resp = await fetch("/data/manhattan-south125.geojson", { cache: "force-cache" });
      if (resp.ok) {
        const geojson = await resp.json();
        map.data.addGeoJson(geojson);
        map.data.setStyle({
          fillColor: "#0f766e",
          strokeColor: "#0f766e", 
          strokeWeight: 2,
          fillOpacity: 0.25,
          clickable: false,
          visible: true,
          zIndex: 100,
        });
      }
    } catch (e) {
      console.warn("[Coverage] GeoJSON fetch error", e);
    }
  };

  // Initialize mobile map
  useEffect(() => {
    if (!inView || !apiKey || !mapRef.current) return;
    let cancelled = false;

    const load = async () => {
      const g = await importGoogle(apiKey);
      if (cancelled || !g || !mapRef.current) return;

      const map = new g.maps.Map(mapRef.current, {
        center: CENTER,
        zoom: ZOOM,
        mapTypeId: "roadmap", 
        disableDefaultUI: true,
        mapId: "f0a9fe7733803250ab418506",
      });

      await addGeoJSON(map);
      createPins(map, g);
    };

    load();
    return () => { cancelled = true; };
  }, [inView, apiKey]);

  // Initialize desktop map
  useEffect(() => {
    if (!desktopInView || !apiKey || !desktopMapRef.current) return;
    let cancelled = false;

    const load = async () => {
      const g = await importGoogle(apiKey);
      if (cancelled || !g || !desktopMapRef.current) return;

      const map = new g.maps.Map(desktopMapRef.current, {
        center: CENTER,
        zoom: ZOOM,
        mapTypeId: "roadmap", 
        disableDefaultUI: true,
        mapId: "f0a9fe7733803250ab418506",
      });

      await addGeoJSON(map);
      createPins(map, g);
    };

    load();
    return () => { cancelled = true; };
  }, [desktopInView, apiKey]);

  const hasKey = Boolean(apiKey);
  const staticUrl = hasKey && apiKey ? staticMapUrl(apiKey) : null;

  const handleOutsideZoneClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="coverage" className="section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title outside the card - left aligned */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            I've Got Manhattan Covered
          </h2>
        </div>
        
        <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div className="p-6 sm:p-8">
            <p className="text-lg text-gray-600">
              From the Upper East Side to the Financial District, expert ultrasound right to your clinic. 
              <button 
                onClick={handleOutsideZoneClick}
                className="text-teal-700 font-semibold hover:text-teal-800 hover:underline cursor-pointer ml-1"
              >
                Outside Manhattan? Let's chat!
              </button>
            </p>
          </div>

          {/* Mobile: Full width map only */}
          <div className="lg:hidden">
            <div className={`relative ${MAP_HEIGHT}`} ref={containerRef}>
              <div className="absolute inset-0">
                {(!hydrated || !inView || !hasKey) && (
                  <div className="h-full w-full">
                    {staticUrl ? (
                      <img
                        src={staticUrl}
                        alt="Manhattan coverage map"
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <img
                        src="/images/map-fallback.jpg"
                        alt="Map fallback"
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                )}
                <div ref={mapRef} className="h-full w-full" />
              </div>
            </div>
          </div>

          {/* Desktop: Map left, neighborhoods right */}
          <div className="hidden lg:block lg:p-8" ref={desktopContainerRef}>
            <div className="grid grid-cols-3 gap-8">
              {/* Map - 2 columns */}
              <div className="col-span-2">
                <div className="relative h-[520px]">
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    {(!hydrated || !desktopInView || !hasKey) && (
                      <div className="h-full w-full">
                        {staticUrl ? (
                          <img
                            src={staticUrl}
                            alt="Manhattan coverage map"
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <img
                            src="/images/map-fallback.jpg"
                            alt="Map fallback"
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </div>
                    )}
                    <div ref={desktopMapRef} className="h-full w-full" />
                  </div>
                </div>
              </div>

              {/* Neighborhoods list - 1 column */}
              <div className="col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 h-[520px] overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📍 Neighborhoods Served
                  </h3>
                  <div className="space-y-3">
                    {neighborhoods.map((neighborhood) => (
                      <div 
                        key={neighborhood.name}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition-colors duration-200"
                      >
                        <div className="w-2 h-2 bg-teal-600 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 font-medium">{neighborhood.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(244,238,226, 0.3)', borderColor: '#0f766e', borderWidth: '1px' }}>
                    <p className="text-sm" style={{ color: '#0f766e' }}>
                      <span className="font-semibold">Need coverage elsewhere?</span><br />
                      For clinics outside Manhattan, happy to discuss convenient arrangements. 
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom text */}
          <div className="p-4 text-sm text-gray-600 border-t border-gray-100">
            <span className="lg:hidden">Service area: Manhattan south of 125th Street</span>
            <span className="hidden lg:inline">Service area: Manhattan south of 125th Street</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Google Maps loader (UNCHANGED)
async function importGoogle(apiKey: string) {
  if (typeof window === "undefined") return null;
  if (window.google?.maps) return window.google;

  window.gm_authFailure = () => {
    console.error("[Google Maps] Auth failure");
  };

  const lib = "marker";
  const url = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=${lib}&v=weekly`;

  const existing = document.querySelector('script[data-gmaps="1"]');
  if (!existing) {
    const s = document.createElement("script");
    s.src = url;
    s.async = true;
    s.defer = true;
    s.setAttribute("data-gmaps", "1");
    document.head.appendChild(s);
  }

  await new Promise((resolve, reject) => {
    const started = Date.now();
    const check = () => {
      if (window.google?.maps) return resolve(undefined);
      if (Date.now() - started > 10000) return reject(new Error("Timeout"));
      requestAnimationFrame(check);
    };
    check();
  });

  return window.google;
}
