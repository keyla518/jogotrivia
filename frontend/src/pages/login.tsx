import "./Login.css";
import navio from "../assets/navio.png";
import aviao from "../assets/avião.png";
import linha from "../assets/linha.png";
import setavoltar from "../assets/setavoltar.svg";


export default function Login() {
  return (
    <div className="login-container">

      {/* Botão voltar */}
      <button className="btn-back">
        <img src={setavoltar} alt="Volver" />
      </button>


      {/* Painel esquerdo */}
      <div className="left-panel">
        <img src={navio} className="navio-img" />

        <div className="fact-box">
          <h2>Sabias que...?</h2>
          <p className="pagrafo_img">Portugal foi a primeira potência marítima europeia.</p>
        </div>
      </div>

      {/* Linha vertical + avião */}
      <div className="divider">
        <img src={linha} className="linha" />
        <img src={aviao} className="aviao" />
      </div>

      {/* Formulário */}
      <div className="right-panel">
        <h1>Iniciar sessão</h1>

        <label>Email</label>
        <input type="email" />

        <label>Palavra passe</label>
        <input type="password" />

        <button className="btn-confirm">Confirmar</button>
      </div>
    </div>
  );
}
