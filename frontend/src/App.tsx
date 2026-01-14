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


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<Game />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/ajustes" element={<Ajustes/>} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/ajuda" element={<Ajuda/>} />
        <Route path="/mapa" element={<MapaPage />} />
        <Route path="/backoffice/perguntas" element={<RequireAdmin><Perguntas /></RequireAdmin>} />
        <Route path="/backoffice/utilizadores" element={<RequireAdmin><Utilizadores /></RequireAdmin>} />
      </Routes>
    </BrowserRouter>
  );
}
