import "./Profile.css";

export default function Perfil() {
  return (
    <div className="perfil-container">
      <h1 className="titulo">MENTE CRUZADA</h1>

      <div className="perfil-card">
        <div className="foto-perfil">
          <div className="foto-placeholder"><i className="fa-regular fa-user"></i></div>
          <p className="alterar-foto"><a href="#">Alterar foto do perfil</a></p>
        </div>

        <div className="info">
            <div className="info-box">
              <i className="fa-regular fa-envelope"></i> koliveira@ipvc.pt
            </div>
            <div className="info-box">
              <i className="fa-regular fa-user"></i> koliveira
            </div>
            <div className="info-box">
              <i className="fa-regular fa-star"></i> 38 pontos
            </div>
        </div>
      </div>
    </div>
  );
}
