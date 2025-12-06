import { useState } from 'react'
import jogoLogo from './assets/logo 2.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>MENTE CRUZADA</h1>
      <div>
        <img src={jogoLogo} alt="Logo do jogo" />
      </div>
      <div className="btn-home">
        <button className="btn-login">INICIAR SESSÃO</button>
        <button className="btn-register">REGISTAR-SE</button>
      </div>
    </>
  )
}

export default App
