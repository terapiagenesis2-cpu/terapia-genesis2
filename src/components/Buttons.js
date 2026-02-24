import styled from 'styled-components';
import ResponsiveText from "./apis/ResponsiveText";
import NavigationButtons from "./navigation/NavigationButtons";
import {navigate} from "gatsby";
import {useEffect, useState} from "react";
import createAndSendPDF from "./apis/pdf-email";
import {Alert} from "@mui/material";
import { useRamificacion } from "../context/RamificacionContext"; // Ajustá la ruta si es necesario
import {LegadoButton} from "./navigation/LegadoButton";


const Buttons = ({petalos,bigButtonTitle,circuloBase,onClick, noNumber}) => {

    const [showAlertRamificar, setShowAlertRamificar] = useState(false);
    const [showAlertBorrar, setShowAlertBorrar] = useState(false);
    const [showAlertCorreccion, setShowAlertCorreccion] = useState(false);
    const { isRamificando, setIsRamificando } = useRamificacion();
    const [open, setOpen] = useState(false);

    const handleRamificar = () => {
        let history = localStorage.getItem("history");
        if (!history) history = [];
        else history = JSON.parse(history);

        setIsRamificando(prev => !prev); // Toggle ramificación
        setShowAlertRamificar(true);
        setTimeout(() => setShowAlertRamificar(false), 4000);

        const ramificarCount = history.filter(item => item === "ramificar").length;

        if (ramificarCount % 2 === 0 && history[history.length - 2]?.title !== "ramificar") {
            const linkPetaloDosAtras = history[history.length - 2]
                .replace('/circulo-base/', '')
                .replace(/^\//, '');

            const petaloDosAtras = findPetalo(petalos, linkPetaloDosAtras.split(':')[0] || linkPetaloDosAtras);

            if (petaloDosAtras && petaloDosAtras.title.length === 1) {
                history.splice(history.length - 3, 0, "ramificar");
            } else {
                history.splice(history.length - 2, 0, "ramificar");
            }
        } else {
            if (history.length === 0 || history[history.length - 1] !== "ramificar")
                history.push("ramificar");
        }

        localStorage.setItem("history", JSON.stringify(history));
    };

    const handleBorrar = () =>{
        let history = localStorage.getItem("history");
        if (!history) history = [];
        else history = JSON.parse(history);

        setShowAlertBorrar(true);
        history.pop()
        setTimeout(() => {
            setShowAlertBorrar(false);
        }, 4000);
                        
        localStorage.setItem("history", JSON.stringify(history));
    };
    
    const handlePDF = () =>{
        createAndSendPDF().then(r => console.log("PDF CREADO CORRECTAMENTE"))
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
             if (event.altKey) {
                let history = localStorage.getItem("history");

                if (!history) history = [];
                else history = JSON.parse(history);
                if (event.key === 'Control')
                    createAndSendPDF().then(r => console.log("PDF CREADO CORRECTAMENTE"))
                else if (event.key === 'c' || event.key === 'C') {    
                    setShowAlertCorreccion(true);
                    setTimeout(() => {
                        setShowAlertCorreccion(false);
                    }, 4000);
                    history.push("correccion")
                    localStorage.setItem("history", JSON.stringify(history))
                }
                else if (event.key === 'r' || event.key === 'R' || event.key === 'b' || event.key === 'B') {
                    if (event.key === 'r' || event.key === 'R') {
                        handleRamificar();
                    } else if (event.key === 'b' || event.key === 'B') {
                        handleBorrar();
                    }

                    
                } else if (event.key === 'Backspace')
                    navigate("/")
                else if (event.key === 'o' || event.key === 'O')
                    navigate("/intro-text");
            }
            else {
                switch (event.key) {
                    case 'ArrowLeft':
                        navigate(-1);
                        break;
                    case 'ArrowRight':
                        navigate(+1);
                        break;
                    case 'Enter':
                        navigate("/circulo-base");
                        break;
                    default:
                        if (/^[0-9]$/.test(event.key))
                            onClick(parseInt(event.key));
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClick, showAlertBorrar, showAlertRamificar, setShowAlertRamificar, setShowAlertBorrar, petalos]);


        return (
        <PageContainer>
            <ButtonsContainerCenter>
                {isRamificando && <ContainerAlert>
                    <Alert severity="info">
                        Ramificando
                    </Alert> 
                </ContainerAlert>}

                {showAlertRamificar && <ContainerAlert>
                    <Alert severity="success">
                        Ramificacion
                    </Alert>
                </ContainerAlert>}

                {showAlertBorrar && <ContainerAlert>
                    <Alert severity="success">
                        Punto borrado de la sesion
                    </Alert>
                </ContainerAlert>}

                {showAlertCorreccion && <ContainerAlert>
                    <Alert severity="success">
                        Correccion
                    </Alert>
                </ContainerAlert>}
                <CircleExt>
                    <Circle onClick={() => navigate("/circulo-base")}>
                        <CircleInner>
                            <ResponsiveText scale={0.55} color={"#e1e4ff"}>
                            {bigButtonTitle}
                            </ResponsiveText>
                        </CircleInner>
                    </Circle>
                </CircleExt>
                <ButtonsContainer>
                    {circuloBase && petalos.map((petalo) => (
                <PetaloWrapper
                    key={petalo.index}
                    angle={(petalo.index / (noNumber ? petalos.length+2 : 11)) * 360}
                    onClick={() => onClick(petalo.index + 1)}
                >
                    <PetaloInner bordercolor={getColorWithText(petalo.colorBorder)}>
                    <ResponsiveText scale={0.8} color="#ffffff">
                        {noNumber ? petalo.title : petalo.index + 1}
                    </ResponsiveText>
                    </PetaloInner>
                </PetaloWrapper>
                ))}

                {!circuloBase && Array.of(0,1,2,3,4,5,6,7,8,9).map((number) => (
                <PetaloWrapper
                    key={number}
                    angle={(number / 10) * 360}
                    onClick={() => onClick(number)}
                >
                    <PetaloInner bordercolor={getColorWithNumber(number)}>
                    <ResponsiveText scale={0.8} color="#ffffff">
                        {number}
                    </ResponsiveText>
                    </PetaloInner>
                </PetaloWrapper>
                ))}

                </ButtonsContainer>
                <NavigationButtons/>
            </ButtonsContainerCenter>
            <div style={{ flexGrow: 0.5 }} />
            <BottomRightBox >
                <Toggle onClick={() => setOpen(!open)}>
                    <ToggleIcon
                        src={open ? "/images/simbolos/cancelar2.png" : "/images/simbolos/opciones2.png"} 
                        alt="menu toggle" 
                        
                    />
                </Toggle>
                                            
                <LoadButtons $open={open}>
                    <LoadB src="/images/simbolos/ramificacion.png" alt="Ramificacion" title="Ramificar" onClick={handleRamificar} />
                    <LoadB src="/images/simbolos/descarga2.png" alt="GuardarPDF" title="Guardar como PDF" onClick={handlePDF} />
                    <LoadB src="/images/simbolos/borrado.png" alt="Borrar Ultimo" title="Borrar Ultimo" onClick={handleBorrar} />
                    <LoadB src="/images/simbolos/oraciones2.png" alt="Oraciones" title="Oraciones" onClick={() => navigate("/intro-text")} />
                    <LoadB src="/images/simbolos/inicio2.png" alt="Inicio" title="Inicio" onClick={() => navigate('/')} />
                    <LoadB src="/images/simbolos/legado.png" alt="Legado" title="Volver al Legado" onClick={() => navigate("/circulo-base/petalo-3/2/2/5/")} />
                </LoadButtons>
            </BottomRightBox>
            
            <LegadoButton/>
        </PageContainer>
    );
};

const findPetalo = (petalos, linkName) => {
    for (let petalo of petalos) {
        if (petalo.linkName === linkName) {
            return petalo;
        }
        if (petalo.subPetalos) {
            const encontrado = findPetalo(petalo.subPetalos, linkName);
            if (encontrado) return encontrado;
        }
    }
    return null;
};

const ContainerAlert = styled.div`
  position: fixed;
  left: 20px;
  top: 20px;
  z-index: 999;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;


const BottomRightBox = styled.div`
  position: fixed;      /* 📌 fijo a la pantalla */
  bottom: 20px;
  right: 20px;          /* mejor usar px para que no se mueva con zoom */
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column; /* apilar LoadButtons arriba y toggle abajo */
  align-items: flex-end;  /* alineado a la derecha */
  gap: 10px;
  z-index: 1000;            
`;

const Toggle = styled.button`
  width: 3vw;
  height: 3vw;
  cursor: pointer;
  background-color: white;
  padding: 1px;
  margin: 0vw;
  border-radius: 50%;
  transition: box-shadow 0.3s ease;
  border: none;
  margin-bottom: 7px;
  
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

  
  display: flex;
  align-items: center;
  justify-content: center;

`;
const ToggleIcon = styled.img`
  width: 3vw;
  height: 3vw;
  

  max-width: 55px;   /* nunca más grande que el original */
  max-height: 55px;
  min-width: 20px;   /* nunca más grande que el original */
  min-height: 20px;

`;

const LoadButtons = styled.div`
 position: absolute;
 bottom: 0;
 right: 70px; /* ✅ typo corregido */

 display: flex;
 flex-direction: row-reverse; /* ✅ los ítems se alinean de derecha a izquierda */
 gap: 10px;

 opacity: ${props => props.$open ? 1 : 0};
 transform: ${props => props.$open ? "translateX(10px)" : "translateX(0)"};
 pointer-events: ${props => props.$open ? "auto" : "none"};
 transition: opacity 0.3s ease, transform 0.3s ease;

 
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

const ButtonsContainerCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  
  @media (min-height: 600px) and (max-width: 539px) {
    margin-top: -70px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;


const getColorWithText = (text) => {
    switch (text) {
        case "red":
            return "#c21212";
        case "yellow":
            return "#ced750";
        case "blue":
            return "#5052d7";
        case "green":
            return "#026908";
        case "orange":
            return "#d78850";
        case "purple":
            return "#a050d7";
        case "brown":
            return "#4f4421";
        case "greenLight":
            return "#50d757";
        case "blueLight":
            return "#5682be";
        case "yellowLight":
            return "#d7c450";
        case "redLight":
            return "#d75050";
        default:
            return "#ecc2e1";
    }
};

const getColorWithNumber = (number) => {
    switch (number) {
        case 1:
            return "#c21212";
        case 2:
            return "#ced750";
        case 3:
            return "#5052d7";
        case 4:
            return "#026908";
        case 5:
            return "#d78850";
        case 6:
            return "#a050d7";
        case 7:
            return "#4f4421";
        case 8:
            return "#50d757";
        case 9:
            return "#5682be";
        default:
            return "#ecc2e1";
    }
};


let pi = 3.141592653589793;

const PetaloWrapper = styled.div`
  position: absolute;
  user-select: none;
  cursor: pointer;

  width: 85px;
  height: 85px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-image: url("/images/circle_small_metal_blue_ring_and_center.png
");
  background-size: cover;
  background-position: center;

  box-shadow: 0 12px 16px rgba(0, 0, 0, .75);

  transition: transform .18s ease, filter .18s ease;

  &:hover {
    transform: scale(1.08);
    filter: brightness(1.12);
  }

  ${props => {
    const px = 230;
    const top = (-85 / 2) + calculatePositionCos(props.angle, px);
    const sin = (-85 / 2) + calculatePositionSin(props.angle, px);
    return `
      top: ${top}px;
      left: ${sin}px;
    `;
  }}
`;
/* 🔵 círculo interior con degradé del color */
const PetaloInner = styled.div`
  width: 68%;
  height: 68%;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
 
  

  background: radial-gradient(
    circle at 30% 30%,
    ${props => props.bordercolor}66,
    ${props => props.bordercolor}dd 55%,
    ${props => props.bordercolor}ff 80%,
    #000000aa 100%
  );

  box-shadow: inset 0 0 8px rgba(0,0,0,.75);
`;

function calculatePositionCos(angle, px) {
    return Math.cos((angle * pi) / 180) * px;
}

function calculatePositionSin(angle, px) {
    return Math.sin((angle * pi) / 180) * px;
}

const CircleExt = styled.div`
  position: absolute;
  user-select: none;
  cursor: pointer;

  border-radius: 50%;
  width: 220px;
  height: 220px;

  display: flex;
  align-items: center;
  justify-content: center;

  /* Ahora el contenedor es transparente, el aro lo dibuja ::before */
  background: transparent;
  box-shadow: none;

  /* 🔵 Aro exterior más fino con el mismo degradé */
  &::before {
    content: "";
    position: absolute;
    inset: 10px;  /* ⬅️ cuanto más grande, más fino queda el aro */
    border-radius: 50%;

    background: radial-gradient(
      circle at 30% 30%,
      #232744,
      #050712 80%
    );

   
  }

  @media (max-width: 370px) {
    width: 90px;
    height: 90px;
  }
  @media (max-width: 410px) and (min-width: 370px) {
    width: 120px;
    height: 120px;
  }
  @media (max-width: 465px) and (min-width: 410px) {
    width: 140px;
    height: 140px;
  }
  @media (max-width: 540px) and (min-width: 465px) {
    width: 160px;
    height: 160px;
  }
  @media (max-width: 620px) and (min-width: 540px) {
    width: 180px;
    height: 180px;
  }
`;
const Circle = styled.div`
  position: relative;
  border-radius: 50%;
  width: 78%;   /* ⬅️ antes 82% → ahora más chico */
  height: 78%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;

  /* 🔵 aro intermedio azul oscuro + negro */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;

    background: conic-gradient(
      from 215deg,
      #1f233a 0deg,              /* azul oscuro */
      #0a0c16 35deg,             /* sombra fría */
      #111426 110deg,            /* zona oscura */
      #05060c 200deg,            /* casi negro */
      #0a0c16 280deg,            /* vuelve a azul oscuro */
      #1f233a 360deg
    );

    /* ⬅️ un poco más fino (menor grosor) */
    mask: radial-gradient(
      farthest-side,
      transparent calc(100% - 11px),
      #000 calc(100% - 2px)
    );
    -webkit-mask: radial-gradient(
      farthest-side,
      transparent calc(100% - 11px),
      #000 calc(100% - 2px)
    );

    box-shadow:
      0 0 5px rgba(7, 7, 7, 0.62),
      inset 0 0 5px rgba(0, 0, 0, 0.66);
  }
`;


const CircleInner = styled.div`
  position: relative;
  z-index: 2;

  width: 76%;
  height: 76%;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  /* Núcleo oscuro, casi plano como la foto */
  background: radial-gradient(
    circle at 32% 32%,
    #262943,
    #0b0c16 80%
  );

  box-shadow:
    inset 0 0 18px rgba(0, 0, 0, 0.9);

  color: #e1e4ff;
  font-weight: 700;
  letter-spacing: 1px;

  /* 🔵 Aro blanco/negro alrededor del núcleo */
  &::before {
    content: "";
    position: absolute;
    inset: -8px;           /* grosor del aro */
    border-radius: 50%;

    /* tramo blanco de luz + tramo oscuro, como la foto */
    background: conic-gradient(
      from 215deg,
      rgba(245,245,250,0.95) 0deg,
      rgba(245,245,250,0.95) 40deg,
      rgba(210,212,220,0.8) 60deg,
      rgba(40,40,50,1) 150deg,
      rgba(10,10,16,1) 240deg,
      rgba(210,212,220,0.8) 300deg,
      rgba(245,245,250,0.95) 360deg
    );

    /* lo vuelvo aro (hueco en el centro) */
    mask: radial-gradient(
      farthest-side,
      transparent calc(100% - 7px),
      #000 calc(100% - 2px)
    );
    -webkit-mask: radial-gradient(
      farthest-side,
      transparent calc(100% - 7px),
      #000 calc(100% - 2px)
    );

    box-shadow:
      0 0 6px rgba(0, 0, 0, 0.7),
      inset 0 0 4px rgba(0, 0, 0, 0.7);
  }

  /* hover solo en el centro, sin mover el círculo */
  transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: scale(1.03);
    filter: brightness(1.04);
    box-shadow:
      inset 0 0 22px rgba(0, 0, 0, 0.92);
  }
`;
export default Buttons;