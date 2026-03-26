import { useEffect, useState, useMemo } from 'react';

const TRACK_FILES: Record<string, string> = {
  "Sakhir": "bh-2004.geojson",
  "Jeddah": "sa-2021.geojson",
  "Melbourne": "au-1953.geojson",
  "Suzuka": "jp-1962.geojson",
  "Shanghai": "cn-2004.geojson",
  "Miami": "us-2022.geojson",
  "Imola": "it-1953.geojson",
  "Monaco": "mc-1929.geojson",
  "Montréal": "ca-1978.geojson",
  "Barcelona": "es-1991.geojson",
  "Spielberg": "at-1969.geojson",
  "Silverstone": "gb-1948.geojson",
  "Budapest": "hu-1986.geojson",
  "Spa-Francorchamps": "be-1925.geojson",
  "Zandvoort": "nl-1948.geojson",
  "Monza": "it-1922.geojson",
  "Baku": "az-2016.geojson",
  "Singapore": "sg-2008.geojson",
  "Austin": "us-2012.geojson",
  "Mexico City": "mx-1959.geojson",
  "São Paulo": "br-1940.geojson",
  "Las Vegas": "us-2023.geojson",
  "Lusail": "qa-2021.geojson",
  "Yas Marina": "ae-2009.geojson"
};

interface Point { x: number; y: number; }

interface TrackMapProps {
  locationName?: string; 
  selectedDrivers?: any[]; // Neu: Wir empfangen die echten Fahrer-Daten
}

export default function TrackMap({ locationName, selectedDrivers = [] }: TrackMapProps) {
  const [trackPoints, setTrackPoints] = useState<Point[]>([]);
  const [hoveredDriver, setHoveredDriver] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locationName) return;

    const fetchGeoJson = async () => {
      try {
        setLoading(true);
        const fileName = TRACK_FILES[locationName] || "cn-2004.geojson";
        const response = await fetch(`https://raw.githubusercontent.com/bacinger/f1-circuits/master/circuits/${fileName}`);
        const data = await response.json();
        
        let coords = [];
        if (data.type === 'FeatureCollection') {
          coords = data.features[0].geometry.coordinates;
        } else if (data.type === 'Feature') {
          coords = data.geometry.coordinates;
        }

        if (Array.isArray(coords[0]) && Array.isArray(coords[0][0])) {
          coords = coords[0];
        }

        const points = coords.map((c: number[]) => ({ x: c[0], y: c[1] }));
        setTrackPoints(points);
      } catch (err) {
        console.error(`Fehler beim Laden der Strecke für ${locationName}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoJson();
  }, [locationName]);

  const viewBoxInfo = useMemo(() => {
    if (trackPoints.length === 0) return null;

    const xValues = trackPoints.map(p => p.x);
    const yValues = trackPoints.map(p => p.y);

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const width = maxX - minX;
    const height = maxY - minY;

    const paddingX = width * 0.1;
    const paddingY = height * 0.1;

    return {
      viewBoxString: `${minX - paddingX} ${minY - paddingY} ${width + paddingX * 2} ${height + paddingY * 2}`,
      width: width
    };
  }, [trackPoints]);

  if (loading || !viewBoxInfo) {
    return (
      <div className="flex h-full min-h-[380px] w-full flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/80 p-6">
        <div className="h-11 w-11 animate-spin rounded-full border border-slate-700 border-t-red-500" />
        <p className="mt-4 text-xs tracking-widest text-slate-500 uppercase">
          {locationName ? `Lade Strecke für ${locationName}...` : 'Warte auf Session-Daten...'}
        </p>
      </div>
    );
  }

  const trackPath = trackPoints.map(p => `${p.x},${p.y}`).join(' ');

 const mapCars = selectedDrivers.map((driver) => {
    // Ein kleiner Mathe-Trick: Startnummer * 37 % 100 ergibt immer denselben, gut verteilten Prozentwert (0.00 bis 0.99)
    const consistentPercentage = (driver.driver_number * 37 % 100) / 100;
    const pointIndex = Math.floor(trackPoints.length * consistentPercentage);
    const trackPoint = trackPoints[pointIndex] || { x: 0, y: 0 };
    
    return {
      num: driver.driver_number,
      color: driver.team_colour?.startsWith('#') ? driver.team_colour : `#${driver.team_colour || 'ffffff'}`,
      x: trackPoint.x,
      y: trackPoint.y
    };
  });

  const sortedCars = [...mapCars].sort((a, b) => {
    if (a.num === hoveredDriver) return 1;
    if (b.num === hoveredDriver) return -1;
    return 0;
  });

  const strokeWidth = viewBoxInfo.width * 0.015;
  const baseRadius = viewBoxInfo.width * 0.02;

return (
    <div className="flex w-full flex-col items-center rounded-xl border border-slate-800 bg-slate-950/80 p-6">
      <svg
        viewBox={viewBoxInfo.viewBoxString}
        className="h-full w-full max-h-[600px]"
        // overflow-visible verhindert, dass SVG-Filter die Größe der gesamten Box neu berechnen
        style={{ transform: 'scaleY(-1)', overflow: 'visible' }} 
      >
        <polyline
          points={trackPath}
          fill="none"
          stroke="#475569"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {sortedCars.map((car) => {
          const isHovered = hoveredDriver === car.num;

          return (
            <g
              key={car.num}
              transform={`translate(${car.x}, ${car.y})`}
              onMouseEnter={() => setHoveredDriver(car.num)}
              onMouseLeave={() => setHoveredDriver(null)}
              className="cursor-pointer"
            >
              <circle
                r={isHovered ? baseRadius * 1.5 : baseRadius}
                fill={car.color}
                stroke={isHovered ? "white" : "rgba(255,255,255,0.2)"}
                strokeWidth={isHovered ? strokeWidth * 0.3 : strokeWidth * 0.2}
                className="transition-all duration-200 ease-in-out"
              />

              {isHovered && (
                <>
                  {/* Der pulsierende Hintergrundkreis MUSS pointer-events: none haben */}
                  <circle 
                    r={baseRadius * 3} 
                    fill={car.color} 
                    className="animate-pulse" 
                    opacity="0.3" 
                    style={{ pointerEvents: 'none' }} 
                  />
                  
                  {/* Text-Element OHNE SVG-filter Attribut, das war der Verursacher des Layout-Sprungs! */}
                  <text
                    fill="white"
                    fontSize={baseRadius * 1.5}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    // Wir nutzen stattdessen einen reinen CSS-Schatten, das ist viel stabiler in SVGs
                    style={{ 
                      transform: 'scaleY(-1)', 
                      pointerEvents: 'none',
                      textShadow: '0px 0px 10px rgba(0,0,0,0.9)'
                    }} 
                  >
                    {car.num}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}