import { useState } from "react";
import "./Ajuda.css";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../components/Button";

const perguntas = [
  {
    pergunta: "Respostas certas duplicadas?",
    resposta: "Não. Cada resposta correta é contabilizada apenas uma vez."
  },
  {
    pergunta: "Onde posso alterar meu perfil?",
    resposta: "Você pode alterar seu perfil na área de configurações do jogador."
  },
  
  {
    pergunta: "Qual a ordem do jogo?",
    resposta: "O jogo segue níveis progressivos de sul a norte do país."
  },
  {
    pergunta: "Consigo alterar o idioma?",
    resposta: "Estamos trabalhando nisso. O idioma padrão é o português."
  },
  {
    pergunta: "Não consegue utilizar as pistas?",
    resposta: "Verifique se ainda tem moedas disponíveis."
  }
];

export default function Ajuda() {
  const [aberto, setAberto] = useState<number | null>(null);
  const navigate = useNavigate();

  const toggle = (index: number) => {
    setAberto(aberto === index ? null : index);
  };

  return (

    <div className="ajuda-container">
      <div className="back-button-container">
        <BackButton onClick={() => navigate("/menu")}/>
          
      </div>
     
      <h1 className="titulo">MENTE CRUZADA</h1>
      <h2 >Perguntas Frequentes</h2>
      

      <div className="acordion-container"></div>
        
        <div className="accordion">
          {perguntas.map((item, index) => (
            <div key={index} className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => toggle(index)}
                aria-expanded={aberto === index}
              >
                <span className="pergunta-texto">{item.pergunta}</span>
                <span className={`seta ${aberto === index ? "aberto" : ""}`}>
                  ▼
                </span>
              </button>
              <div className={`accordion-content ${aberto === index ? "aberto" : ""}`}>
                <div className="resposta-texto">
                  {item.resposta}
                </div>
              </div>
            </div>
          ))}
        </div>
    
      </div>
      
  );
}