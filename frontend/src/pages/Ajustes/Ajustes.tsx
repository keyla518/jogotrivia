import "./Ajustes.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, BackButton} from "../../components/Button";

type AjustesProps = { sonsAtivos: boolean; setSonsAtivos: (value: boolean) => void; };
export default function Ajustes({ sonsAtivos, setSonsAtivos }: AjustesProps) {

  const navigate = useNavigate();

  const [dark, setDark] = useState(() => {
    // Carrega o tema salvo (se existir)
    return localStorage.getItem("theme") === "dark";
  });

  // Aplica o tema sempre que "dark" mudar
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="ajustes-container">
      <div className="back-button-container">
              <BackButton onClick={() => navigate("/menu")}/>
                
            </div>

      <h1 className="titulo">MENTE CRUZADA</h1>
      <h2 >Configurações</h2>

      <div className="ajustes-lista">
        <div className="ajuste-item">
          <span>Ativar modo escuro</span>
          <input
            type="checkbox"
            checked={dark}
            onChange={() => setDark(!dark)}
          />
        </div>

        <div className="ajuste-item">
            <span>Ativar sons</span>
            <input
              type="checkbox"
              checked={sonsAtivos}
              onChange={(e) => setSonsAtivos(e.target.checked)}
            />
        </div>


        {/* <div className="ajuste-item">
          <span>Idioma</span>
          <select>
            <option>Português</option>
            <option>Inglês</option>
          </select>
        </div>

        <div className="ajuste-item">
          <span>Mostrar dicas automáticas</span>
          <input type="checkbox" />
        </div> */}

        <div >
          <Button variant="cancel" size="small">Repor definições</Button>
        </div>
      </div>
    </div>
  );
}
