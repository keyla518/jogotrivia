// src/pages/Ajuda.jsx
import { useState } from "react";
import "./Ajuda.css";

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
    pergunta: "Onde posso ver minha estatística?",
    resposta: "As estatísticas ficam disponíveis no menu do jogador."
  },
  {
    pergunta: "Qual a ordem do jogo?",
    resposta: "O jogo segue níveis progressivos de sul a norte do país."
  },
  {
    pergunta: "Consigo alterar o idioma?",
    resposta: "Não, estamos trabalhando nisso. O idioma padrão é o português."
  },
  {
    pergunta: "Não consegue utilizar as pistas?",
    resposta: "Verifique se ainda possui pistas disponíveis."
  }
];

export default function Ajuda() {
  const [aberto, setAberto] = useState<number | null>(null);

    const toggle = (index: number) => {
      setAberto(aberto === index ? null : index);
    };

  return (
    <div className="ajuda-container">
      <h1 className="titulo">MENTE CRUZADA</h1>
      <h2 className="subtitulo">Ajuda?</h2>

      <div className="accordion">
        {perguntas.map((item, index) => (
          <div key={index} className="accordion-item">
            <button
              className="accordion-header"
              onClick={() => toggle(index)}
            >
              {item.pergunta}
              <span className={`seta ${aberto === index ? "aberto" : ""}`}>
                ▼
              </span>
            </button>

            {aberto === index && (
              <div className="accordion-content">
                {item.resposta}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
