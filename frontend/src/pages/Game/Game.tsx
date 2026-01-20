import { useEffect, useState, useCallback } from "react";
import { fetchNextQuestion, verifyAnswer, useHint } from "../../api/game";
import { useNavigate } from "react-router-dom";
import "./Game.css";
import bgMusic from "../../assets/bg.mp3";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/wrong.wav";
import { useRef } from "react";
import { getProfile } from "../../api/user"; 
import { BackButton, Button } from "../../components/Button";

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

type GameProps = { sonsAtivos: boolean; };

export default function Game({ sonsAtivos }: GameProps) {
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
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const [respostaStatus, setRespostaStatus] = useState<"correct" | "incorrect" | "">("");


  useEffect(() => {
    const audio = new Audio(bgMusic);
    audio.loop = true;
    audio.volume = 0.4;

    audio.play().catch(() => {
      console.warn("Autoplay bloqueado — tocará após interação.");
    });

    bgAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const carregarPergunta = useCallback(async () => {
    setFeedback("");
    setFeedbackTipo("");
    setResposta("");
    setOpcoesDesabilitadas([]);
    setTentativa(1);
    setRespostaStatus("");
    setIsLoading(true);

    try {
      // Não passamos regiaoID - o backend pega automaticamente a região atual do usuário
      const res = await fetchNextQuestion({});

      // Verificar se o jogo está completo
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
  }, []);

  const playCorrect = () => {
  if (!sonsAtivos) return;
  const audio = new Audio(correctSound);
  audio.volume = 0.7;
  audio.play();
};

  const playWrong = () => {
  if (!sonsAtivos) return;
  const audio = new Audio(wrongSound);
  audio.volume = 0.7;
  audio.play();
};

  // Carregar dados do usuário (moedas e pontos)
  const carregarUsuario = useCallback(async () => {
    try {
      const res = await getProfile(); // ← Usa a função correta
      
      if (res.data.usuario) {
        setUsuario({ 
          moedas: res.data.usuario.moedas, 
          pontos: res.data.usuario.pontos 
        });
      }
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
    }
  }, []);

  useEffect(() => {
    carregarPergunta();
    carregarUsuario();
  }, [carregarPergunta, carregarUsuario]); 

    const handleSelectOption = async (letra: string) => {
      if (opcoesDesabilitadas.includes(letra) || isLoading) return;
      
      setResposta(letra);
      
      setTimeout(async () => {
        await enviarResposta(letra);
      }, 300);
    };

    const enviarResposta = async (respostaSelecionada: string) => {
    

    if (!pergunta) return;

    setIsLoading(true);

    try {
      const res = await verifyAnswer({
        perguntaID: pergunta.pergunta.id,
        resposta: respostaSelecionada,
      });

      const { 
        correta, 
        message, 
        moedasGanhas, 
        pontosGanhos, 
        tentativa: tentativaAtual,
        moedasAtuais,  
        pontosAtuais   
      } = res.data;

      if (correta) {
        playCorrect();
        setFeedbackTipo("success");
        setRespostaStatus("correct");
        const recompensaMsg = moedasGanhas && pontosGanhos 
    ? ` (+${moedasGanhas} 🪙, +${pontosGanhos} ⭐)`
    : '';
        setFeedback((message || "✅ Resposta correta!") + recompensaMsg);

        if (moedasAtuais !== undefined && pontosAtuais !== undefined) {
          setUsuario({
            moedas: moedasAtuais,
            pontos: pontosAtuais
          });
        }

        const finishedAll = message?.includes("Terminaste TODAS");
        if (finishedAll) {
          setGameCompleted(true);
 
          return;
        }

        const regionCompleted = message?.includes("Região concluída");
        if (regionCompleted) {
          setTimeout(() => {
            navigate("/mapa", { 
              state: { mensagem: "🎉 Parabéns! Nova região desbloqueada!" } 
            });
          }, 2000);
          return;
        }

        setTimeout(() => {
          carregarPergunta();
        }, 2000);
        
      } else {
        playWrong();
        setFeedbackTipo("error");
        setRespostaStatus("incorrect");
        setFeedback(message || "❌ Resposta incorreta!");

        setTimeout(() => {
          setFeedback("");
          setFeedbackTipo("");
        }, 1500);

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

      // Backend retorna: { message, moedasRestantes, opcoesEliminadas, opcoesRestantes }
      const { opcoesEliminadas, moedasRestantes, opcoesRestantes } = res.data;

      // Atualizar opções desabilitadas
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

      setFeedback("Pista usada! 2 opções eliminadas (-5 moedas)");
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
          <h1> Parabéns!</h1>
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
                <div className="back-button-container">
                  <BackButton onClick={() => navigate("/menu")}/>
                    
                </div>
        </div>
      </div>
    );
  }

  if (!pergunta) {
    return (
      <div className="game-container error">
        <p>Erro ao carregar a pergunta</p>
              <div className="back-button-container">
        <BackButton onClick={() => navigate("/menu")}/>  
      </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="back-button-container">
                <BackButton onClick={() => navigate("/menu")}/>
      </div>

      {/* Header com informações do jogo */}
      <div className="game-header">
        {/* Botão voltar ao mapa */}
                <span className="category-badge">{pergunta.categoria}</span>

        <div className="region-info">
          <h2 className="region-name">{pergunta.regiao}</h2>
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
              className={`option-button 
                ${resposta === letra ? "selected" : ""}
                ${opcoesDesabilitadas.includes(letra) ? "disabled" : ""}
                ${resposta === letra && respostaStatus === "correct" ? "correct" : ""}
                ${resposta === letra && respostaStatus === "incorrect" ? "incorrect" : ""}
  `}
              onClick={() => handleSelectOption(letra)}
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

        <Button
          variant="primary" size="small"
          onClick={usarPista}
          disabled={isLoading || usuario.moedas < 5 || opcoesDesabilitadas.length > 0}
          title={usuario.moedas < 5 ? "Moedas insuficientes (necessário: 5)" : "Eliminar 2 opções incorretas"}
        >
           Dica (-5) 
        </Button>
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
