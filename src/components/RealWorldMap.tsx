import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { COUNTRIES_GII_DATA, getGIIColor } from '../data/globeData';
import { CountryGII } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  RotateCcw,
  Layers,
  MapPin,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface RealWorldMapProps {
  selectedCountry: CountryGII | null;
  onSelectCountry: (country: CountryGII) => void;
}

export const RealWorldMap: React.FC<RealWorldMapProps> = ({
  selectedCountry,
  onSelectCountry,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());

  // Check for Mapbox Access Token in environment
  const mapboxToken = (import.meta.env.VITE_MAPBOX_TOKEN as string) || '';

  // Curated Map Styles (Mapbox + Fallback open basemaps)
  const mapStyles = [
    {
      id: 'mapbox-streets',
      name: 'Mapbox Streets (HD)',
      isMapbox: true,
      mapboxStyleId: 'streets-v12',
      fallbackUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    {
      id: 'mapbox-satellite',
      name: 'Mapbox Satellite Imagery',
      isMapbox: true,
      mapboxStyleId: 'satellite-streets-v12',
      fallbackUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; <a href="https://www.esri.com/">Esri</a>',
    },
    {
      id: 'mapbox-light',
      name: 'Mapbox Light / Minimal',
      isMapbox: true,
      mapboxStyleId: 'light-v11',
      fallbackUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; <a href="https://www.esri.com/">Esri</a>',
    },
    {
      id: 'mapbox-dark',
      name: 'Mapbox Dark Matter',
      isMapbox: true,
      mapboxStyleId: 'dark-v11',
      fallbackUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; <a href="https://www.esri.com/">Esri</a>',
    },
    {
      id: 'osm-humanitarian',
      name: 'Humanitarian (Atlas)',
      isMapbox: false,
      fallbackUrl: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://hot.openstreetmap.org/">HOT</a>',
    },
  ];

  const { isDark } = useTheme();
  const [activeStyleId, setActiveStyleId] = useState<string>(() => isDark ? 'mapbox-dark' : 'mapbox-streets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  useEffect(() => {
    if (isDark) {
      if (activeStyleId === 'mapbox-streets' || activeStyleId === 'mapbox-light') {
        setActiveStyleId('mapbox-dark');
      }
    } else {
      if (activeStyleId === 'mapbox-dark') {
        setActiveStyleId('mapbox-streets');
      }
    }
  }, [isDark]);

  const regions = ['All', 'Europe', 'Americas', 'Asia', 'Africa', 'Middle East', 'Oceania'];

  const getTileUrl = (style: typeof mapStyles[0]) => {
    if (style.isMapbox && mapboxToken.trim()) {
      return `https://api.mapbox.com/styles/v1/mapbox/${style.mapboxStyleId}/tiles/512/{z}/{x}/{y}@2x?access_token=${mapboxToken.trim()}`;
    }
    return style.fallbackUrl;
  };

  const WORLD_BOUNDS = L.latLngBounds([-85, -180], [85, 180]);
  const HOME_CENTER: L.LatLngTuple = [20, 10];
  const tileErrorsRef = useRef(0);

  const buildTileLayer = (style: typeof mapStyles[0]) => {
    const useMapbox = style.isMapbox && !!mapboxToken.trim();
    const layer = L.tileLayer(getTileUrl(style), {
      attribution: style.attribution,
      subdomains: 'abcd',
      maxZoom: 18,
      noWrap: true, // never repeat the world horizontally
      bounds: WORLD_BOUNDS,
      // Mapbox raster tiles are 512px -> need tileSize 512 and zoomOffset -1
      tileSize: useMapbox ? 512 : 256,
      zoomOffset: useMapbox ? -1 : 0,
    });

    // If Mapbox rejects the token (401/403, URL restrictions), fall back to open tiles
    if (useMapbox) {
      tileErrorsRef.current = 0;
      layer.on('tileerror', () => {
        tileErrorsRef.current += 1;
        if (tileErrorsRef.current === 6 && mapInstanceRef.current) {
          console.warn('Mapbox tiles failed to load - falling back to open basemap.');
          mapInstanceRef.current.removeLayer(layer);
          const fb = L.tileLayer(style.fallbackUrl, {
            attribution: style.attribution,
            subdomains: 'abcd',
            maxZoom: 18,
            noWrap: true,
            bounds: WORLD_BOUNDS,
          }).addTo(mapInstanceRef.current);
          tileLayerRef.current = fb;
        }
      });
    }
    return layer;
  };

  // Smallest zoom at which the world fills the container (no grey/empty or repeated areas)
  const fitMinZoom = (map: L.Map) => {
    map.invalidateSize();
    const z = map.getBoundsZoom(WORLD_BOUNDS, true);
    map.setMinZoom(z);
    if (map.getZoom() < z) map.setZoom(z);
    return z;
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const map = L.map(mapContainerRef.current, {
      center: HOME_CENTER,
      zoom: 2,
      maxZoom: 18,
      zoomControl: true,
      scrollWheelZoom: true,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      worldCopyJump: false,
      maxBounds: WORLD_BOUNDS,        // can't pan off the edge of the world
      maxBoundsViscosity: 1.0,        // hard wall, no rubber-banding
    });

    mapInstanceRef.current = map;

    const currentStyle = mapStyles.find((s) => s.id === activeStyleId) || mapStyles[0];
    tileLayerRef.current = buildTileLayer(currentStyle).addTo(map);

    const minZ = fitMinZoom(map);
    map.setView(HOME_CENTER, minZ, { animate: false });

    const onResize = () => fitMinZoom(map);
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(mapContainerRef.current);

    renderCountryMarkers(map);

    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const currentStyle = mapStyles.find((s) => s.id === activeStyleId) || mapStyles[0];
    const newLayer = buildTileLayer(currentStyle).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [activeStyleId, mapboxToken]);

  // Render country circle markers with GII heatmap colors
  const renderCountryMarkers = (map: L.Map) => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    COUNTRIES_GII_DATA.forEach((country) => {
      const color = getGIIColor(country.gii);

      const marker = L.circleMarker([country.lat, country.lng], {
        radius: 8,
        fillColor: color,
        color: '#FFFFFF',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.85,
      });

      marker.bindTooltip(
        `<div style="font-family: sans-serif; font-size: 12px; line-height: 1.3;">
          <strong style="color: #0D192E;">${country.name}</strong> 
          <span style="color: #64748B;">(#${country.rank})</span><br/>
          <span style="color: ${color}; font-weight: bold;">GII: ${country.gii.toFixed(3)}</span>
          <span style="color: #94A3B8;"> · ${country.region}</span>
        </div>`,
        { direction: 'top', offset: [0, -6], opacity: 0.95 }
      );

      marker.on('click', () => {
        onSelectCountry(country);
        map.flyTo([country.lat, country.lng], 4.5, {
          duration: 1.2,
          easeLinearity: 0.25,
        });
      });

      marker.addTo(map);
      markersRef.current.set(country.id, marker);
    });
  };

  // Fly to selected country when changed externally
  useEffect(() => {
    if (!selectedCountry || !mapInstanceRef.current) return;

    const marker = markersRef.current.get(selectedCountry.id);
    if (marker) {
      markersRef.current.forEach((m) => {
        m.setStyle({ radius: 8, weight: 1.5 });
      });
      marker.setStyle({ radius: 12, weight: 3 });
    }
  }, [selectedCountry]);

  const handleSelectRegion = (reg: string) => {
    setSelectedRegion(reg);
    if (!mapInstanceRef.current) return;

    if (reg === 'All') {
      mapInstanceRef.current.flyTo(HOME_CENTER, mapInstanceRef.current.getMinZoom(), { duration: 1.2 });
      return;
    }

    const regionCountries = COUNTRIES_GII_DATA.filter(
      (c) => c.region.toLowerCase() === reg.toLowerCase()
    );

    if (regionCountries.length > 0) {
      const bounds = L.latLngBounds(
        regionCountries.map((c) => [c.lat, c.lng] as [number, number])
      );
      mapInstanceRef.current.flyToBounds(bounds, { padding: [40, 40], maxZoom: 5, duration: 1.2 });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    const match = COUNTRIES_GII_DATA.find((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

    if (match) {
      onSelectCountry(match);
      mapInstanceRef.current.flyTo([match.lat, match.lng], 5, { duration: 1.2 });
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(HOME_CENTER, mapInstanceRef.current.getMinZoom(), { duration: 1.2 });
      setSelectedRegion('All');
      setSearchQuery('');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Filter & Search Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Region Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {regions.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => handleSelectRegion(reg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedRegion === reg
                  ? 'bg-[#0D192E] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-black'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* Search & Style Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country & Enter..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB] w-44 sm:w-56"
            />
          </form>

          {/* Style Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
            <select
              value={activeStyleId}
              onChange={(e) => setActiveStyleId(e.target.value)}
              className="text-xs bg-transparent text-slate-700 outline-none cursor-pointer"
              title="Switch Map Style"
            >
              {mapStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={handleResetView}
            className="p-2 text-slate-600 hover:text-black hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            title="Reset to Full World View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Real Interactive Mapbox World Map Container */}
      <div className="relative w-full h-[580px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Active Country Card Overlay in Top-Left */}
        {selectedCountry && (
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md border border-slate-200/90 p-4 rounded-2xl shadow-xl max-w-sm animate-fade-in pointer-events-auto">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#2563EB] font-semibold">
                  {selectedCountry.region} Region
                </span>
                <h3 className="font-serif font-bold text-lg text-[#0D192E]">
                  {selectedCountry.name}
                </h3>
              </div>
              <span className="font-mono text-xs font-bold bg-[#0D192E] text-white px-2.5 py-1 rounded-xl">
                Rank #{selectedCountry.rank}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-slate-500">GII Score:</span>
              <span
                className="font-mono font-bold text-sm"
                style={{ color: getGIIColor(selectedCountry.gii) }}
              >
                {selectedCountry.gii.toFixed(3)}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 font-medium">
                {selectedCountry.gii < 0.1
                  ? 'Very High Equality'
                  : selectedCountry.gii < 0.35
                  ? 'Moderate Gap'
                  : 'High Inequality'}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
              {selectedCountry.explanation}
            </p>
          </div>
        )}

        {/* Mapbox Engine Badge in Top-Right */}
        <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-xs flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Mapbox Cartography Engine</span>
        </div>

        {/* Floating Controls Helper in Bottom-Left */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-sm pointer-events-none">
          <MapPin className="w-4 h-4 text-[#2563EB]" />
          <span>Click any marker to inspect country metrics & zoom in</span>
        </div>
      </div>

      {/* Color Scale Legend */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Gender Inequality Index (GII) Color Scale</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Lower score = Higher gender equality
          </span>
        </div>

        {/* Color Gradient Strip */}
        <div className="w-full h-3 rounded-full bg-gradient-to-r from-[#2563EB] via-[#FDBA74] to-[#EF4444] shadow-inner" />

        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5 font-mono">
          <span className="flex items-center gap-1 text-[#2563EB] font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
            Very High Equality (0.01 – 0.10)
          </span>
          <span className="flex items-center gap-1 text-amber-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Moderate Gap (0.15 – 0.35)
          </span>
          <span className="flex items-center gap-1 text-rose-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            High Inequality (0.40 – 0.77)
          </span>
        </div>
      </div>
    </div>
  );
};
