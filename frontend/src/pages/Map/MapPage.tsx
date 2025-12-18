import React, { useEffect, useState } from "react";
import Map from "../../components/map/Map";
import type { Regiao } from "../../types/mapa";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axiosConfig";

const MapPage: React.FC = () => {
  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [justUnlocked, setJustUnlocked] = useState(false); // solo animación
  const [canContinue, setCanContinue] = useState(false);   // control real
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProgresso = async () => {
      try {
        const { data } = await api.get("/mapa/progresso");
        setRegioes(data.regioes);
      } catch (err) {
        console.error("Erro ao obter progresso do mapa", err);
      }
    };

    fetchProgresso();

    // Venimos del juego tras desbloquear una región
    if (location.state?.justUnlocked) {
      setCanContinue(true);   // 👈 NO desaparece
      setJustUnlocked(true);  // 👈 solo animación

      const reset = setTimeout(() => {
        setJustUnlocked(false);
      }, 2000);

      return () => clearTimeout(reset);
    }
  }, [location.state]);

  const handleLevelClick = (regiao: Regiao) => {
    if (regiao.status !== "current") return;
    navigate("/game", { state: { regiaoID: regiao.id } });
  };

  const handleContinue = () => {
    const novaRegiao = regioes.find(r => r.status === "current");
    if (novaRegiao) {
      navigate("/game", { state: { regiaoID: novaRegiao.id } });
    }
  };

  return (
    <div className="map-page">
      <h1>🌍 Mapa de Portugal</h1>

      <Map
        regioes={regioes}
        onLevelClick={handleLevelClick}
        justUnlocked={justUnlocked}
      />

      {canContinue && (
        <button className="continue-button" onClick={handleContinue}>
          ▶️ Continuar
        </button>
      )}
    </div>
  );
};

export default MapPage;
