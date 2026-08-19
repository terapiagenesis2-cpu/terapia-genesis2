import ResponsiveText from "../apis/ResponsiveText";
import {useEffect, useState} from "react";
import {navigate} from "gatsby";
import {NavigationButtonsInLine} from "../navigation/NavigationButtons";
import QuantumRaizButton from '../navigation/Btn-quantum';
import styled from "styled-components";
import ResponsiveImage from "../apis/ResponsiveImage";
import {Background} from "../Commons";
import LoginCheck from "../login/LoginCheck";
import createAndSendPDF from "../apis/pdf-email";
import {Alert, TextField} from "@mui/material";
import {petalos} from "../../../static/data";
import { useRamificacion } from "../../context/RamificacionContext"; // Ajustá la ruta si es necesario
import { useCorreccion } from "../../context/LegadoContext";
import { useLocation } from "@reach/router";
import { LegadoButton  } from "../navigation/LegadoButton";
import SidePanel from "../navigation/SidePanel";

const FinalPageTemplate = ({ pageContext }) => {

  const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);
  const [showAlertRamificar, setShowAlertRamificar] = useState(false);
  const [showAlertBorrar, setShowAlertBorrar] = useState(false);
  const [showAlertCorreccion, setShowAlertCorreccion] = useState(false);
  const { isRamificando, setIsRamificando } = useRamificacion();
  const { isCorreccion, setIsCorreccion } = useCorreccion();
  const location = useLocation();

  // Estado del panel lateral (reemplaza el antiguo open del menú flotante)
  const [panelOpen, setPanelOpen] = useState(false);

  // Corrección solo visible en estas rutas (igual que LegadoButton)
  const mostrarCorreccion = [
    "/circulo-base/petalo-3/2/2/5/",
    "/circulo-base/petalo-3/2/2/5/1/",
    "/circulo-base/petalo-3/2/2/5/2/",
    "/circulo-base/petalo-3/2/2/5/3/"
  ].includes(location.pathname);

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
    const handlePDF = () => createAndSendPDF().then(() => console.log("PDF CREADO CORRECTAMENTE"));
    const irAOracionesSinBorrar = () => navigate("/intro-text5D");
    const iniciarSesionNueva = () => {
        localStorage.removeItem("paciente");
        localStorage.removeItem("dob");
        localStorage.removeItem("problems");
        localStorage.setItem("history", JSON.stringify([]));
        navigate("/intro-text5D");
    };
    const volverAlLegado = () => navigate("/circulo-base/petalo-3/2/2/5/");
    const handleCorreccion = () => {
        let history = localStorage.getItem("history");
        if (!history) history = [];
        else history = JSON.parse(history);
        setIsCorreccion(prev => !prev);
        setShowAlertCorreccion(true);
        setTimeout(() => setShowAlertCorreccion(false), 1000);
        history.push("correccion");
        localStorage.setItem("history", JSON.stringify(history));
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isTextFieldFocused) return

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
             else if (event.key === 'Enter')
                 navigate("/circulo-base")
             else if (event.key === 'ArrowLeft')
                navigate(-1)
            else if (event.key === 'ArrowRight')
                navigate(+1)
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isTextFieldFocused, showAlertBorrar, showAlertRamificar, setShowAlertRamificar, setShowAlertBorrar]);



    const {desc, titleText, image, titlePage, imageBody, separation, fieldText, linkName, subPetalos} = pageContext
    
    // ✅ Chequea si el TextField debe mostrarse: propio o algún hijo
    // Función recursiva que verifica si un pétalo o cualquiera de sus subPetalos
    // tiene 'fieldText' habilitado. Devuelve true si encuentra alguno, false si no.
    // Parámetro:
    //   petalo -> objeto pétalo que puede tener 'fieldText' y un array de 'subPetalos'.
    const hasFieldTextRecursive = (petalo) => {
        if (!petalo) return false; // Si el pétalo no existe, devolvemos false
        if (petalo.fieldText) return true; // Si el pétalo actual tiene fieldText, devolvemos true
        if (petalo.subPetalos) {
            // Revisamos recursivamente todos los subPetalos
            return petalo.subPetalos.some(p => hasFieldTextRecursive(p));
        }
        return false; // Si no hay fieldText ni subPetalos, devolvemos false
    };

    const hasFieldText = hasFieldTextRecursive(pageContext);

    const imagePath = "/images/" + image + ".webp";
    const imageBodyPath = "/images/simbolos/" + imageBody;

    const color = getColorWithFuente(linkName);
    let textSeparate;
    let textComponents;
    if (separation) {
        textSeparate = desc.split(". ");
        textComponents = textSeparate.map((sentence, index) => {
            return <div>
                <ResponsiveText key={index} scale={0.5} color={color}>
                    {sentence.replace(".", "")}
                </ResponsiveText>
            </div>
        });
    }
    return <LoginCheck>
        <PageContainer>
            <Background style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${imagePath})`
            }}>
                <Content>
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
                    
                    <BlurredBox>
                        <ResponsiveText scale={0.9} color={color}>{titlePage}</ResponsiveText>
                        <ResponsiveText scale={0.7} color={color}>{titleText}</ResponsiveText>
                        {separation ? textComponents
                            : <Text scale={0.5} color={color}>{desc}</Text>}

                        {hasFieldText && (
                                <div
                                style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                height: "100px",
                                justifyContent: "center"
                                }}
                            >
                               
                                <TextField
                                    id={`emocion-${linkName}`} // 🔹 ID único por pétalo
                                    variant="filled"
                                    margin="normal"
                                    onChange={(e) => {
                                    let history = localStorage.getItem("history");
                                    history = history ? JSON.parse(history) : [];
                                    const lastLink = history[history.length - 1] || "";
                                    const lastEmotionLink = lastLink.split(":")[0];
                                    history[history.length - 1] = lastEmotionLink + ":" + e.target.value;
                                    localStorage.setItem("history", JSON.stringify(history));
                                    }}
                                    onFocus={() => setIsTextFieldFocused(true)}
                                    onBlur={() => setIsTextFieldFocused(false)}
                                    sx={{
                                    backgroundColor: 'white',
                                    '&:hover': { backgroundColor: 'white' },
                                    '&.Mui-focused': { backgroundColor: 'white' },
                                    '& .MuiFilledInput-root': { backgroundColor: 'white' }
                                    }}
                                />
                                </div>
                            )}
                    </BlurredBox>
                    {imageBody && <BodyImage src={imageBodyPath} scale={4}/>}

                    <QuantumRaizButton/>

                </Content>
                
            </Background>
            {/* ── PANEL LATERAL ── */}
            <SidePanel
                isOpen={panelOpen}
                onToggle={() => setPanelOpen(prev => !prev)}
                isRamificando={isRamificando}
                isCorreccion={isCorreccion}
                mostrarCorreccion={mostrarCorreccion}
                onRamificar={handleRamificar}
                onBorrar={handleBorrar}
                onPDF={handlePDF}
                onOraciones={irAOracionesSinBorrar}
                onInicio={iniciarSesionNueva}
                onLegado={volverAlLegado}
                onCorreccion={handleCorreccion}
            />
            
        </PageContainer>
    </LoginCheck>
}

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

const getColorWithFuente = (link) => {
    
     if (link.startsWith("interferencias")) {
        return "#fdf8f8";
    }
    const match = link.match(/petalo-(\d+)/);

    if (!match) {
        return "#fdf8f8"; // color por defecto para interferencias
    }

    const number = parseInt(match[1]);

    switch (number) {
        case 5:
            return "#292929ff"
        default:
            return "white"

    }

}

const ContainerAlert = styled.div`
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 999;
`;


const BodyImage = styled(ResponsiveImage)`
  margin-top: 10px;
`;
const Text = styled(ResponsiveText)`
  padding-top: 30px
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const Container = styled.div`
  margin-top: auto;

  @media (max-width: 768px) { /* Ajusta el valor para dispositivos móviles */
    padding-bottom: 100px; /* Ajusta este valor según tus necesidades */
  }
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

const BlurredBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 40px;
  max-width: 90vw;
  width: 100%;
  box-sizing: border-box;
  margin: 5px auto;
  
`;



export default FinalPageTemplate;
