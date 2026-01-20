import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Game from "./pages/Game/Game";
import Profile from "./pages/Profile/Profile";
import Menu from "./pages/Menu/Menu";
import Ajustes from "./pages/Ajustes/Ajustes";
import Ajuda from "./pages/Ajuda/Ajuda";
import Perguntas from "./pages/Backoffice/Perguntas/Perguntas";
import Utilizadores from "./pages/Backoffice/Utilizadores/Utilizadores";
import RequireAdmin from "./components/RequireAdmin";
import { MapaPage } from "./pages/Map/MapaPage";
import { useState } from "react";


export default function App() { const [sonsAtivos, setSonsAtivos] = useState(true);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Passar sonsAtivos para o Game */}
        <Route path="/game" element={<Game sonsAtivos={sonsAtivos} />} />
        <Route path="/menu" element={<Menu />} />

        {/* Passar sonsAtivos e setSonsAtivos para Ajustes */}
        <Route path="/ajustes" element={<Ajustes sonsAtivos={sonsAtivos} setSonsAtivos={setSonsAtivos} />}
        />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/ajuda" element={<Ajuda/>} />
        <Route path="/mapa" element={<MapaPage />} />
        <Route path="/backoffice/perguntas" element={<RequireAdmin><Perguntas /></RequireAdmin>} />
        <Route path="/backoffice/utilizadores" element={<RequireAdmin><Utilizadores /></RequireAdmin>} />
      </Routes>
    </BrowserRouter>
  );
}
