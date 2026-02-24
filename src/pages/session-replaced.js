import React from "react";
import { Link } from "gatsby";

export default function SessionReplaced() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <h1>Sesión finalizada</h1>
        <p>
          Se inició sesión con esta cuenta en otro dispositivo o navegador.
          Por seguridad, cerramos esta sesión automáticamente.
        </p>
        <Link to="/">Volver</Link>
      </div>
    </div>
  );
}