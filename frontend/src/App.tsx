import { useState } from 'react'
import jogoLogo from './assets/logo 2.png'
import { useNavigate } from "react-router-dom";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // 👉 Aqui é o lugar correto
  const navigate = useNavigate()

  return (
    <>
      <h1>MENTE CRUZADA</h1>
      <div>
        <img src={jogoLogo} alt="Logo do jogo" />
      </div>
      <div className="btn-home">
        <button className="btn-login" onClick={() => navigate('/login')}>
          INICIAR SESSÃO
        </button>

        <button className="btn-register">
          REGISTAR-SE
        </button>
      </div>
    </>
  )
}

export default App
