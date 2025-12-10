import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Game from "./pages/Game/Game";
import Profile from "./pages/Profile/Profile";
import Menu from "./pages/Menu/Menu";
// import Ajustes from "./pages/Ajustes/Ajustes";
// import Ajuda from "./pages/Ajuda/Ajuda";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<Game />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/ajustes" element={<div>Ajustes</div>} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/ajuda" element={<div>Ajuda</div>} />
      </Routes>
    </BrowserRouter>
  );
}
