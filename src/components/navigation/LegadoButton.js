import styled from 'styled-components';
import { useLocation } from "@reach/router";
import { useState } from "react";
import { Alert } from "@mui/material";
import { useCorreccion } from "../../context/LegadoContext";


export const LegadoButton = () => {
  const [showAlertCorreccion, setShowAlertCorreccion] = useState(false);
  const { isCorreccion, setIsCorreccion } = useCorreccion();
  const location = useLocation();

  const mostrarExtra = [
    "/circulo-base/petalo-3/4/2/5/",
    "/circulo-base/petalo-3/4/2/5/1/",
    "/circulo-base/petalo-3/4/2/5/2/",
    "/circulo-base/petalo-3/4/2/5/3/"
  ].includes(location.pathname);

  const handleCorreccion = () => {
    let history = localStorage.getItem("history");
    if (!history) history = [];
    else history = JSON.parse(history);

    setIsCorreccion(prev => !prev); // Toggle ramificación 
    setShowAlertCorreccion(true); 
    setTimeout(() => { setShowAlertCorreccion(false); }, 1000); 
    history.push("correccion") 
    
    localStorage.setItem("history", JSON.stringify(history))
  };

  return (
    <PageContainer>
      <Container>
        <LoadButtons >

          {mostrarExtra && (
            <LoadB
              src="/images/simbolos/correccion2.png"
              alt="Legado"
              title="Legado"
              onClick={handleCorreccion}
            />
          )}

        </LoadButtons>

      </Container>

      {isCorreccion && <ContainerAlert>
        <Alert severity="info">
          Trabajando Legado
        </Alert>
      </ContainerAlert>}


      {showAlertCorreccion && <ContainerAlert>
        <Alert
          severity="success"> Trabajando Legado
        </Alert>
      </ContainerAlert>}

    </PageContainer>

    // ,cambiar la fuente de sanando , reparando, reviviendo letra mas grande
    // al llegar a 3"2#2"5  
  );
};
/** crear legado similar a la ramificacion, agregar cuadro de texto , agregar todo al menu hamburguesa , cambiar texto alt+c , cambiar titulo circulo base, agregar blurreo */

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContainerAlert = styled.div`
  position: fixed;
  right: 20px;
  top: 20px;
  z-index: 999;
`;


const Container = styled.div`
 position: absolute;
 bottom: 20px;
 left: 20px;

 
`;


const LoadButtons = styled.div`
  position: fixed;      /* 📌 fijo a la pantalla */
  bottom: 20px;
  left: 7px; /* 👈 se abre a la derecha del toggle */

  display: flex;
  flex-direction: row-reverse; /* 👈 en fila horizontal */
  gap: 10px;

`;

const LoadB = styled.img`
  width: 3vw;
  height: 3vw;
  cursor: pointer;
  background-color: white;
  padding: 1px;
  margin: 5px;
  border-radius: 50%;
  transition: box-shadow 0.3s ease;

  max-width: 55px;   /* nunca más grande que el original */
  max-height: 55px;

  min-width: 20px;   /* nunca más grande que el original */
  min-height: 20px;

  &:hover {
    box-shadow:
      0 0 10px white,
      0 0 10px white,
      0 0 10px white,
      0 0 10px #ffffff,
      0 0 10px #ffffff;
  }
`;

