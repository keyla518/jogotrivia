import { useEffect, useState } from "react";
import { fetchNextQuestion, verifyAnswer, useHint } from "../api/game";

export default function Game() {
  const [pergunta, setPergunta] = useState<any>(null);
  const [resposta, setResposta] = useState("");

  const carregarPergunta = async () => {
    const res = await fetchNextQuestion();
    setPergunta(res.data);
  };

  useEffect(() => {
    carregarPergunta();
  }, []);

  const enviarResposta = async () => {
    await verifyAnswer({
      perguntaID: pergunta.pergunta.id,
      resposta,
    });
    carregarPergunta();
  };

  if (!pergunta) return <p>Carregando...</p>;

  return (
    <div className="p-4">
      <h2>{pergunta.regiao} - {pergunta.categoria}</h2>
      <p className="mt-4 mb-4">{pergunta.pergunta.texto}</p>

      {Object.entries(pergunta.pergunta.opcoes).map(([letra, texto]) =>
        texto ? (
          <button
            key={letra}
            className="block w-full border p-2 mb-2"
            onClick={() => setResposta(letra)}
          >
            {letra}) {texto}
          </button>
        ) : null
      )}

      <button className="bg-green-600 text-white p-2 mt-4" onClick={enviarResposta}>
        Responder
      </button>
    </div>
  );
}
