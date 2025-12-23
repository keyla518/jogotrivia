import { useEffect, useState, useCallback } from "react";
import { fetchNextQuestion, verifyAnswer, useHint } from "../../api/game";
import { useNavigate, useLocation } from "react-router-dom";
import "./Game.css";

type Opcoes = Record<string, string | null>;

type PerguntaData = {
  pergunta: {
    id: number;
    texto: string;
    opcoes: Opcoes;
  };
  regiao: string;
  categoria: string;
  message?: string;
};

type Usuario = {
  moedas: number;
  pontos: number;
};

type LocationState = {
  regiaoID?: number;
};

export default function Game() {
  const [pergunta, setPergunta] = useState<PerguntaData | null>(null);
  const [resposta, setResposta] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackTipo, setFeedbackTipo] = useState<"success" | "error" | "">("");
  const [opcoesDesabilitadas, setOpcoesDesabilitadas] = useState<string[]>([]);
  const [usuario, setUsuario] = useState<Usuario>({ moedas: 0, pontos: 0 });
  const [tentativa, setTentativa] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const regiaoID = state?.regiaoID;
    

  const carregarPergunta = useCallback(async (regiaoIDParam?: number) => {

    setFeedback("");
    setFeedbackTipo("");
    setResposta("");
    setOpcoesDesabilitadas([]);
    setTentativa(1);
    setIsLoading(true);

    try {
      const res = await fetchNextQuestion({ regiaoID: regiaoIDParam });

      // Verificar si el juego está completo
      if (res.data.message && !res.data.pergunta) {

        setGameCompleted(true);
        setFeedback(res.data.message);
        setFeedbackTipo("success");
        setIsLoading(false);
        return;
      }

      setPergunta(res.data);
    } catch (err: any) {
      console.error("Erro ao carregar pergunta:", err);
      setFeedback("Erro ao carregar a pergunta. Tenta novamente.");
      setFeedbackTipo("error");
    } finally {
      setIsLoading(false);
    }
  },[]);

  // Carregar datos do usuario (moedas e pontos)
  const carregarUsuario = useCallback(async () => {
    try {
      const res = await fetch('/api/usuario/dados', { 
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      setUsuario({ moedas: data.moedas, pontos: data.pontos });
    }
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
    }
  },[]);

  
  useEffect(() => {
    carregarPergunta(regiaoID);
    carregarUsuario();
  }, [regiaoID, carregarPergunta, carregarUsuario]); 

  const enviarResposta = async () => {
    if (!resposta) {
      setFeedback("⚠️ Seleciona uma opção antes de responder!");
      setFeedbackTipo("error");
      return;
    }

    if (!pergunta) return;

    setIsLoading(true);

    try {
      const res = await verifyAnswer({
        perguntaID: pergunta.pergunta.id,
        resposta,
      });


      // Backend retorna: { correta: boolean, message: string, moedasGanhas?, pontosGanhos?, tentativa? }
      const { correta, message, moedasGanhas, pontosGanhos, tentativa: tentativaAtual } = res.data;

      if (correta) {
        setFeedbackTipo("success");
        setFeedback(message || "✅ Resposta correta!");

        const regionCompleted =
          message?.includes("Região concluída") ||
          message?.includes("Próxima região desbloqueada");

        const finishedAll =
          message?.includes("Terminaste TODAS");

        if (finishedAll) {
          setGameCompleted(true);
          return;
        }

        if (regionCompleted) {
          // MAPA
          setTimeout(() => {
            navigate("/map", { state: { justUnlocked: true } });
          }, 1500);
          return;
        }

        // Atualizar moedas e pontos se foram ganhos
        if (moedasGanhas !== undefined && pontosGanhos !== undefined) {
          setUsuario(prev => ({
            moedas: prev.moedas + moedasGanhas,
            pontos: prev.pontos + pontosGanhos
          }));
        }

        // Esperar 2 segundos antes de carregar a próxima pergunta
        setTimeout(() => {
          carregarPergunta(regiaoID);
        }, 2000);
      } else {
        // Resposta incorreta
        setFeedbackTipo("error");
        setFeedback(message || "❌ Resposta incorreta! Tenta de novo!");

        setTimeout(() => {
          setFeedback("");
          setFeedbackTipo("");
        }, 1500);


        
        // Usar a tentativa do backend
        setTentativa(tentativaAtual || tentativa + 1);
        setResposta("");
      }

    } catch (err: any) {
      console.error("Erro ao verificar resposta:", err);
      setFeedback(err.response?.data?.error || "Erro ao verificar resposta");
      setFeedbackTipo("error");
    } finally {
      setIsLoading(false);
    }
  };

  const usarPista = async () => {
    if (!pergunta || isLoading || opcoesDesabilitadas.length > 0) return;

    setIsLoading(true);

    try {
      const res = await useHint({ perguntaID: pergunta.pergunta.id });
      console.log("PISTA DO BACKEND:", res.data);

      // Backend retorna: { message, moedasRestantes, opcoesEliminadas, opcoesRestantes }
      const { opcoesEliminadas, moedasRestantes, opcoesRestantes } = res.data;

      // Atualizar opciones deshabilitadas
      setOpcoesDesabilitadas(opcoesEliminadas);

      // Atualizar moedas do usuário
      if (moedasRestantes !== undefined) {
        setUsuario(prev => ({ ...prev, moedas: moedasRestantes }));
      }

      // Atualizar as opções na pergunta (remover as eliminadas)
      if (opcoesRestantes) {
        setPergunta(prev => prev ? {
          ...prev,
          pergunta: {
            ...prev.pergunta,
            opcoes: opcoesRestantes
          }
        } : null);
      }

      setFeedback("💡 Pista usada! 2 opções eliminadas (-5 moedas)");
      setFeedbackTipo("success");

      // Limpar feedback após 3 segundos
      setTimeout(() => {
        setFeedback("");
        setFeedbackTipo("");
      }, 3000);

    } catch (err: any) {
      console.error("Erro ao usar pista:", err);
      setFeedback(err.response?.data?.error || "Erro ao usar pista");
      setFeedbackTipo("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !pergunta) {
    return (
      <div className="game-container loading">
        <div className="loader"></div>
        <p>A carregar pergunta...</p>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="game-container completed">
        <div className="completion-card">
          <h1>🎉 Parabéns!</h1>
          <p>{feedback}</p>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Moedas totais:</span>
              <span className="stat-value">{usuario.moedas} 🪙</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pontos totais:</span>
              <span className="stat-value">{usuario.pontos} ⭐</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pergunta) {
    return (
      <div className="game-container error">
        <p>Erro ao carregar a pergunta</p>
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* Header com informações do jogo */}
      <div className="game-header">
        <div className="region-info">
          <h2 className="region-name">{pergunta.regiao}</h2>
          <span className="category-badge">{pergunta.categoria}</span>
        </div>
        <div className="user-stats">
          <div className="stat">
            <span className="stat-icon">🪙</span>
            <span className="stat-number">{usuario.moedas}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">⭐</span>
            <span className="stat-number">{usuario.pontos}</span>
          </div>
        </div>
      </div>


      {/* Pergunta */}
      <div className="question-card">
        <div className="attempt-indicator">
          Tentativa: {tentativa}
        </div>
        <p className="question-text">{pergunta.pergunta.texto}</p>
      </div>

      {/* Opções de resposta */}
      <div className="options-container">
        {Object.entries(pergunta.pergunta.opcoes).map(([letra, texto]) =>
          texto ? (
            <button
              key={letra}
              className={`option-button ${resposta === letra ? "selected" : ""} ${
                opcoesDesabilitadas.includes(letra) ? "disabled" : ""
              }`}
              onClick={() => !opcoesDesabilitadas.includes(letra) && !isLoading && setResposta(letra)}
              disabled={opcoesDesabilitadas.includes(letra) || isLoading}
            >
              <span className="option-letter">{letra}</span>
              <span className="option-text">{texto}</span>
            </button>
          ) : null
        )}
      </div>

      {/* Botões de ação */}
      <div className="action-buttons">
        <button
          className="btn-submit"
          onClick={enviarResposta}
          disabled={isLoading || !resposta}
        >
          {isLoading ? "A verificar..." : "Responder"}
        </button>

        <button
          className="btn-hint"
          onClick={usarPista}
          disabled={isLoading || usuario.moedas < 5 || opcoesDesabilitadas.length > 0}
          title={usuario.moedas < 5 ? "Moedas insuficientes (necessário: 5)" : "Eliminar 2 opções incorretas"}
        >
          💡 Pista (-5 🪙)
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`feedback ${feedbackTipo}`}>
          {feedback}
        </div>
      )}
    </div>
  );
}