import { useMemo, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface TrackMapProps {
  trackData: Point[];       
  carPositions: any[];    
}

export default function TrackMap({ trackData, carPositions }: TrackMapProps) {
  const [hoveredDriver, setHoveredDriver] = useState<number | null>(null);

  // Automatische Berechnung der perfekten Größe (Bounding Box)
  const viewBox = useMemo(() => {
    if (!trackData || trackData.length === 0) return "0 0 100 100";

    const xValues = trackData.map(p => p.x);
    const yValues = trackData.map(p => p.y);

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const width = maxX - minX;
    const height = maxY - minY;

    const paddingX = width * 0.1;
    const paddingY = height * 0.1;

    return `${minX - paddingX} ${minY - paddingY} ${width + paddingX * 2} ${height + paddingY * 2}`;
  }, [trackData]);

  if (!trackData || trackData.length === 0) {
    return (
      <div className="flex h-full min-h-[380px] items-center justify-center">
        <div className="h-11 w-11 animate-spin rounded-full border border-slate-700 border-t-red-500" />
      </div>
    );
  }

  const trackPath = trackData.map(p => `${p.x},${p.y}`).join(' ');
  const safeCarPositions = carPositions || [];

  // Autos sortieren, damit das gehoverte Auto ganz oben liegt
  const sortedCars = [...safeCarPositions].sort((a, b) => {
    if (a.driver_number === hoveredDriver) return 1;
    if (b.driver_number === hoveredDriver) return -1;
    return 0;
  });

  return (
    <div className="flex w-full flex-col items-center rounded-xl border border-slate-800 bg-slate-950/80 p-4">
      <svg
        viewBox={viewBox}
        className="h-full w-full max-h-[600px] rounded-lg border border-slate-800 bg-slate-900"
        style={{ transform: 'scaleY(-1)' }} 
      >
        {/* Die Strecke */}
        <polyline
          points={trackPath}
          fill="none"
          stroke="#475569" 
          strokeWidth={Math.max((viewBox.split(' ')[2] as any) * 0.012, 50)} 
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Die Autos */}
        {sortedCars.map((car, index) => {
          const isHovered = hoveredDriver === car.driver_number;
          const baseRadius = Math.max((viewBox.split(' ')[2] as any) * 0.02, 120); 
          
          return (
            <g 
              key={index} 
              transform={`translate(${car.x}, ${car.y})`}
              onMouseEnter={() => setHoveredDriver(car.driver_number)}
              onMouseLeave={() => setHoveredDriver(null)}
              className="cursor-pointer"
            >
              <circle 
                r={isHovered ? baseRadius * 1.8 : baseRadius} 
                fill={car.color}
                stroke={isHovered ? "white" : "rgba(255,255,255,0.2)"}
                strokeWidth={isHovered ? baseRadius * 0.2 : baseRadius * 0.1}
                className="transition-all duration-200 ease-in-out"
              />
              
              {isHovered && (
                <text 
                  fill="white" 
                  fontSize={baseRadius * 1.4} 
                  fontWeight="bold" 
                  textAnchor="middle" 
                  dominantBaseline="central" 
                  style={{ transform: 'scaleY(-1)' }} 
                  filter="drop-shadow(0px 0px 80px rgba(0,0,0,0.8))"
                >
                  {car.driver_number}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}