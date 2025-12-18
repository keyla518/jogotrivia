import React from "react";
import type { Regiao } from "../../types/mapa"; //status se for preciso
import "./map.css"; 

interface MapProps {
  regioes: Regiao[];
  onLevelClick?: (regiao: Regiao) => void;
  justUnlocked?: boolean; // para animar avatar ao desbloquear
}

const Map: React.FC<MapProps> = ({ regioes, onLevelClick, justUnlocked }) => {
  return (
    <div className="map-container">
      {regioes.map((regiao, index) => {
        let className = "";
        switch (regiao.status) {
          case "locked":
            className = "level locked";
            break;
          case "current":
            className = "level current";
            break;
          case "completed":
            className = "level completed";
            break;
        }

        return (
          <div
            key={regiao.id}
            className={className}
            style={{ left: `${index * 100}px`, top: "50px" }} 
            onClick={() => {
              if (regiao.status === "current" && onLevelClick) {
                onLevelClick(regiao);
              }
            }}
          >
            {/* Avatar animado */}
            {regiao.status === "current" && justUnlocked && (
              <div className="avatar">🧍</div>
            )}
            <span className="level-label">{regiao.nome || `Região ${regiao.id}`}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Map;
