// PortugalMap.tsx
import React from "react";
import { motion } from "framer-motion";
import { regions } from "./regions";
import type { Region } from "./regions";


type PortugalMapProps = {
  currentRegion: string | null;
  completedRegions?: string[];
  onRegionClick?: (regionId: string) => void;
};

const PortugalMap: React.FC<PortugalMapProps> = ({
  currentRegion,
  completedRegions = [],
  onRegionClick,
}) => {
  // Coordenadas del avión según currentRegion
  const planePosition = currentRegion
    ? (() => {
        const region = regions.find(r => r.id === currentRegion);
        return region ? { x: region.labelX, y: region.labelY } : { x: 0, y: 0 };
      })()
    : { x: 0, y: 0 };

  return (
    <svg
      viewBox="0 0 1237 1950" // Ajusta según tu canvas de Figma
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
    >
      {regions.map((region: Region) =>
        region.paths.map((pathD, index) => (
          <path
            key={`${region.id}-${index}`}
            d={pathD}
            fill={completedRegions?.includes(region.id) ? "#4caf50" : region.color}
            stroke="#333"
            strokeWidth={2}
            onClick={() => onRegionClick?.(region.id)}
          />
        ))
      )}

      {/* Avión animado */}
      <motion.circle
        cx={planePosition.x}
        cy={planePosition.y}
        r={20} // radio del avión
        fill="#ff0000"
        animate={{ cx: planePosition.x, cy: planePosition.y }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  );
};

export default PortugalMap;
