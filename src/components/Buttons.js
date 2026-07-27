import styled, { keyframes, css } from 'styled-components';
import { navigate } from "gatsby";
import { useEffect, useState } from "react";
import { useLocation } from "@reach/router";
import createAndSendPDF from "./apis/pdf-email";
import { Alert } from "@mui/material";
import { useRamificacion } from "../context/RamificacionContext";
import { useCorreccion } from "../context/LegadoContext";
import SidePanel from "./navigation/SidePanel";

// ─────────────────────────────────────────────────────────────
// ASSETS
// ─────────────────────────────────────────────────────────────
const ASSET_BASE_URL = "/genesis-assets";
const A = (name) => `${ASSET_BASE_URL}/${name}.svg`;

const SPHERE_PETALO = {
  red: A("petalo_red"),
  orange: A("petalo_orange"),
  yellow: A("petalo_yellow"),
  green: A("petalo_greenLight"),
  greenLight: A("petalo_greenLight"),
  purple: A("petalo_purple"),
  blueLight: A("petalo_blueLight"),
  blue: A("petalo_blue"),
};

const SPHERE_NUM = [
  A("petalo_red"), A("petalo_orange"), A("petalo_yellow"), A("petalo_greenLight"), A("petalo_purple"),
  A("petalo_blueLight"), A("petalo_blue"), A("petalo_blueNigth"), A("petalo_white"), A("petalo_brown"),
];

const SPHERE_ICON = {
  red: A("icon_petalo-1"),
  orange: A("icon_emocional"),
  yellow: A("icon_mental"),
  greenLight: A("icon_materia"),
  purple: A("icon_presencia"),
  blueLight: A("icon_umbral"),
  blue: A("icon_arqueotipo"),
};

const CENTER_RING_1 = A("center_ring1");
const CENTER_RING_2 = A("center_ring2");

// ─────────────────────────────────────────────────────────────
// COLORES Y METADATA
// ─────────────────────────────────────────────────────────────
const COLOR_MAP = {
  red: "#FF2D2D",
  yellow: "#FFD700",
  blue: "#3A6FFF",
  green: "#00C853",
  orange: "#FF8C00",
  purple: "#B44DFF",
  brown: "#A0522D",
  greenLight: "#00FFB2",
  blueLight: "#00BFFF",
  yellowLight: "#FFE066",
  redLight: "#FF6B6B",
  default: "#CC88CC",
};

const PETALO_CONFIG = {
  red: { label: "Corazón", svgName: "icon_petalo-1", dx: 5, dy: -183 },
  orange: { label: "Emocional", svgName: "icon_emocional", dx: 192, dy: -93 },
  yellow: { label: "Mental", svgName: "icon_mental", dx: 237, dy: 105 },
  greenLight: { label: "Materia", svgName: "icon_materia", dx: 102, dy: 272 },
  purple: { label: "Presencia", svgName: "icon_presencia", dx: -95, dy: 270 },
  blueLight: { label: "Umbral", svgName: "icon_umbral", dx: -227, dy: 105 },
  blue: { label: "Arquetipo", svgName: "icon_arqueotipo", dx: -178, dy: -98 },
};

const NUMBER_COLORS = [
  "#FF2D2D", "#FF8C00", "#FFD700", "#00C853",
  "#B44DFF", "#00BFFF", "#3A6FFF", "#A0522D",
  "#00FFB2", "#CC88CC",
];

const getColorFromBorder = (text) => COLOR_MAP[text] ?? COLOR_MAP.default;
const getColorFromNumber = (n) => NUMBER_COLORS[n] ?? COLOR_MAP.default;

const PI = Math.PI;
const xPos = (angle, r) => Math.sin((angle * PI) / 180) * r;
const yPos = (angle, r) => -Math.cos((angle * PI) / 180) * r;

const findPetalo = (petalos, linkName) => {
  for (let p of petalos) {
    if (p.linkName === linkName) return p;
    if (p.subPetalos) {
      const found = findPetalo(p.subPetalos, linkName);
      if (found) return found;
    }
  }
  return null;
};

// ─────────────────────────────────────────────────────────────
// ANIMATIONS
// ─────────────────────────────────────────────────────────────
const makeGlowAnim = (color) => keyframes`
  0%, 100% { filter: drop-shadow(0 0 4px ${color}44) drop-shadow(0 0 8px ${color}22); }
  50%       { filter: drop-shadow(0 0 14px ${color}bb) drop-shadow(0 0 28px ${color}55); }
`;

const floatCenter = keyframes`
  0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
  50%       { transform: translate(-50%, -50%) translateY(-6px); }
`;

// ─────────────────────────────────────────────────────────────
// ESFERA PÉTALO
// ─────────────────────────────────────────────────────────────
const PetaloSphere = ({ colorBorder, size = 138, label, onClick, isNumber, numberText, isSmallText }) => {
  const color = getColorFromBorder(colorBorder);
  const sphereSrc = isNumber ? SPHERE_NUM[numberText] : SPHERE_PETALO[colorBorder];
  const iconSrc = !isNumber && !isSmallText ? SPHERE_ICON[colorBorder] : null;

  return (
    <PetaloOuter $color={color} $size={size} onClick={onClick}>
      {sphereSrc && (
        <SphereLayer src={sphereSrc} alt="" style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "contain", pointerEvents: "none",
        }} />
      )}
      {iconSrc && (
        <SphereLayer src={iconSrc} alt={label} style={{
          position: "absolute", top: "29%", left: "35%",
          width: "30%", height: "28%",
          objectFit: "contain", pointerEvents: "none",
          filter: "brightness(0) invert(1)", opacity: 0.92,
        }} />
      )}
      {isNumber && <PetaloText>{numberText}</PetaloText>}
      {isSmallText && <PetaloText $small $large={numberText.length === 1} $color={color}> {numberText} </PetaloText>}
      {!isNumber && !isSmallText && label && <PetaloInnerLabel>{label}</PetaloInnerLabel>}
    </PetaloOuter>
  );
};

// ─────────────────────────────────────────────────────────────
// ESFERA CENTRAL
// ─────────────────────────────────────────────────────────────
const CenterSphere = ({ size = 250, onClick, title, centerIcon, centerSphere, subtitle, circuloBase }) => (
  <CenterOuter onClick={onClick} $circuloBase={circuloBase}>
    <CenterWrap $size={size}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: size * 1.44, height: size * 1.44,
        borderRadius: "50%",
        border: "3px solid rgba(192,191,191,0.5)",
        filter: "blur(1.75px)", pointerEvents: "none", zIndex: 0,
      }} />
      <SphereLayer src={CENTER_RING_1} alt="" style={{
        position: "absolute", top: "-1.64%", left: "-1.64%",
        width: "103.3%", height: "103.3%",
        pointerEvents: "none", zIndex: 1,
      }} />
      <SphereLayer src={centerSphere} alt="" style={{
        position: "absolute", top: "-8.31%", left: "-8.31%",
        width: "116.62%", height: "116.62%",
        pointerEvents: "none", zIndex: 2,
      }} />
      <SphereLayer src={CENTER_RING_2} alt="" style={{
        position: "absolute", top: "13%", left: "13%",
        width: "74%", height: "74%",
        pointerEvents: "none", zIndex: 3,
      }} />
      <CenterInner>
        <HomeIcon src={centerIcon} alt="center" />
        <CenterLabel>{title}</CenterLabel>
        {subtitle && <CenterSubtitle>{subtitle}</CenterSubtitle>}
      </CenterInner>
    </CenterWrap>
  </CenterOuter>
);

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────
const Buttons = ({ petalos, bigButtonTitle, centerIcon, centerSphere, circuloBase, onClick, noNumber, subtitle }) => {
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

  // ── HANDLERS ──────────────────────────────────────────────

  const handleRamificar = () => {
    let history = localStorage.getItem("history");
    if (!history) history = [];
    else history = JSON.parse(history);

    setIsRamificando(prev => !prev);
    setShowAlertRamificar(true);
    setTimeout(() => setShowAlertRamificar(false), 4000);

    const ramificarCount = history.filter(item => item === "ramificar").length;
    if (ramificarCount % 2 === 0 && history[history.length - 2]?.title !== "ramificar") {
      const linkPetaloDosAtras = history[history.length - 2]
        .replace('/circulo-base/', '').replace(/^\//, '');
      const petaloDosAtras = findPetalo(petalos, linkPetaloDosAtras.split(':')[0] || linkPetaloDosAtras);
      if (petaloDosAtras && petaloDosAtras.title.length === 1)
        history.splice(history.length - 3, 0, "ramificar");
      else
        history.splice(history.length - 2, 0, "ramificar");
    } else {
      if (history.length === 0 || history[history.length - 1] !== "ramificar")
        history.push("ramificar");
    }
    localStorage.setItem("history", JSON.stringify(history));
  };

  const handleBorrar = () => {
    let history = localStorage.getItem("history");
    if (!history) history = [];
    else history = JSON.parse(history);
    history.pop();
    setShowAlertBorrar(true);
    setTimeout(() => setShowAlertBorrar(false), 4000);
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

  // ── KEYBOARD SHORTCUTS ────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey) {
        let history = localStorage.getItem("history");
        if (!history) history = [];
        else history = JSON.parse(history);

        if (event.key === 'Control')
          createAndSendPDF().then(() => console.log("PDF CREADO CORRECTAMENTE"));
        else if (event.key === 'c' || event.key === 'C') {
          setShowAlertCorreccion(true);
          setTimeout(() => setShowAlertCorreccion(false), 4000);
          history.push("correccion");
          localStorage.setItem("history", JSON.stringify(history));
        }
        else if (event.key === 'r' || event.key === 'R') handleRamificar();
        else if (event.key === 'b' || event.key === 'B') handleBorrar();
        else if (event.key === 'Backspace') navigate("/");
        else if (event.key === 'o' || event.key === 'O') navigate("/intro-text");
      } else {
        switch (event.key) {
          case 'ArrowLeft': navigate(-1); break;
          case 'ArrowRight': navigate(+1); break;
          case 'Enter': navigate("/circulo-base"); break;
          default:
            if (/^[0-9]$/.test(event.key)) onClick(parseInt(event.key));
            break;
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClick, showAlertBorrar, showAlertRamificar, petalos]);

  const SPHERE_SIZE = 148;
  const SPHERE_SIZE_NUM = 120;
  const CENTER_SIZE = 200;
  const ORBIT_RADIUS =
    petalos.length <= 3 ? 210 : 225;
  const ORBIT_RADIUS_CB = 410;

  return (
    <PageContainer>
      <DarkOverlay />
      <ButtonsContainerCenter>

        {isRamificando && <ContainerAlert><Alert severity="info">Ramificando</Alert></ContainerAlert>}
        {showAlertRamificar && <ContainerAlert><Alert severity="success">Ramificacion</Alert></ContainerAlert>}
        {showAlertBorrar && <ContainerAlert><Alert severity="success">Punto borrado de la sesion</Alert></ContainerAlert>}
        {showAlertCorreccion && <ContainerAlert><Alert severity="success">Correccion</Alert></ContainerAlert>}

        {/* Anillo orbital decorativo */}
        <OrbitalRing $r={circuloBase ? ORBIT_RADIUS_CB : ORBIT_RADIUS} />

        {/* Botón central */}
        <CenterSphere
          size={CENTER_SIZE}
          onClick={() => navigate("/circulo-base")}
          title={bigButtonTitle}
          centerIcon={centerIcon}
          centerSphere={centerSphere}
          subtitle={subtitle}
          circuloBase={circuloBase}
        />

        {/* MODO CÍRCULO BASE */}
        {circuloBase && petalos.map((petalo) => {
          const cfg = PETALO_CONFIG[petalo.colorBorder];
          if (!cfg) return null;
          return (
            <PetaloWrapperAbs key={petalo.index} $dx={cfg.dx} $dy={cfg.dy}>
              <PetaloSphere
                colorBorder={petalo.colorBorder}
                size={SPHERE_SIZE}
                label={cfg.label}
                onClick={() => onClick(petalo.index + 1)}
              />
            </PetaloWrapperAbs>
          );
        })}

        {/* MODO NUMÉRICO */}
        {!circuloBase && !noNumber && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
          const angle = (number / 10) * 360 - 90;
          return (
            <PetaloWrapper key={number} $angle={angle} $radius={ORBIT_RADIUS}>
              <PetaloSphere
                colorBorder="default"
                size={SPHERE_SIZE_NUM}
                isNumber
                numberText={number}
                onClick={() => onClick(number)}
              />
            </PetaloWrapper>
          );
        })}

        {/* MODO TÍTULO */}
        {!circuloBase && noNumber && petalos.map((petalo) => {
          const angle = (petalo.index / petalos.length) * 360 - 90;
          return (
            <PetaloWrapper key={petalo.index} $angle={angle} $radius={ORBIT_RADIUS}>
              <PetaloSphere
                colorBorder={petalo.colorBorder}
                size={SPHERE_SIZE_NUM}
                isSmallText
                numberText={petalo.title}
                onClick={() => onClick(petalo.index + 1)}
              />
            </PetaloWrapper>
          );
        })}

      </ButtonsContainerCenter>

      <div style={{ flexGrow: 0.5 }} />

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
  );
};

export default Buttons;


// ══════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ══════════════════════════════════════════════════════════════

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ButtonsContainerCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  @media (min-height: 600px) and (max-width: 539px) { margin-top: -70px; }
`;

const DarkOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.30);
  pointer-events: none;
  z-index: 0;
`;

const CenterOuter = styled.div`
  position: absolute;
  top: ${({ $circuloBase }) => ($circuloBase ? "57%" : "50%")};
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${floatCenter} 5s ease-in-out infinite;
  z-index: 10;
  cursor: pointer;
`;

const CenterWrap = styled.div`
  position: relative;
  width:  ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  transition: transform 0.2s ease;
  &:hover { transform: scale(1.06); }
  @media (max-width: 540px) {
    width:  ${({ $size }) => Math.round($size * 0.72)}px;
    height: ${({ $size }) => Math.round($size * 0.72)}px;
  }
  @media (max-width: 370px) {
    width:  ${({ $size }) => Math.round($size * 0.58)}px;
    height: ${({ $size }) => Math.round($size * 0.58)}px;
  }
`;

const CenterInner = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  z-index: 10;
`;

const HomeIcon = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.95;
  margin-bottom: 6px;
  @media (max-width: 540px) { width: 22px; height: 22px; }
`;

const CenterLabel = styled.span`
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.2;
  padding: 0 12px;
  user-select: none;
  @media (max-width: 540px) { font-size: 10px; letter-spacing: 1px; }
`;

const CenterSubtitle = styled.span`
  color: #a8a8a8;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  margin-top: 2px;
  user-select: none;
  @media (max-width: 540px) { font-size: 11px; }
`;

const OrbitalRing = styled.div`
  position: absolute;
  top: 50%; left: 50%;
  width:  ${({ $r }) => $r * 2}px;
  height: ${({ $r }) => $r * 2}px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.05);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
`;

const PetaloWrapperAbs = styled.div`
  position: absolute;
  top:  calc(50% + ${({ $dy }) => $dy}px);
  left: calc(50% + ${({ $dx }) => $dx}px);
  transform: translate(-50%, -50%);
  @media (max-width: 860px) {
    top:  calc(50% + ${({ $dy }) => Math.round($dy * 0.75)}px);
    left: calc(50% + ${({ $dx }) => Math.round($dx * 0.75)}px);
  }
  @media (max-width: 540px) {
    top:  calc(50% + ${({ $dy }) => Math.round($dy * 0.52)}px);
    left: calc(50% + ${({ $dx }) => Math.round($dx * 0.52)}px);
  }
`;

const PetaloWrapper = styled.div`
  position: absolute;
  top:  calc(50% + ${({ $angle, $radius }) => yPos($angle, $radius)}px);
  left: calc(50% + ${({ $angle, $radius }) => xPos($angle, $radius)}px);
  transform: translate(-50%, -50%);
  @media (max-width: 540px) {
    top:  calc(50% + ${({ $angle }) => yPos($angle, 155)}px);
    left: calc(50% + ${({ $angle }) => xPos($angle, 155)}px);
  }
`;

const PetaloOuter = styled.div`
  position: relative;
  cursor: pointer;
  user-select: none;
  width:  ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: visible;
  animation: ${({ $color }) => css`${makeGlowAnim($color)} 3s ease-in-out infinite`};
  transition: transform 0.18s ease;
  &:hover { transform: scale(1.1); z-index: 5; }
  @media (max-width: 540px) {
    width:  ${({ $size }) => Math.round($size * 0.65)}px;
    height: ${({ $size }) => Math.round($size * 0.65)}px;
  }
`;

const SphereLayer = styled.img`
  display: block;
  user-select: none;
  pointer-events: none;
`;

const PetaloInnerLabel = styled.span`
  position: absolute;
  bottom: 26%;
  left: 0; right: 0;
  color: rgba(220,225,235,0.92);
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-align: center;
  line-height: 1.1;
  white-space: nowrap;
  text-shadow: 0 1px 6px rgba(0,0,0,0.9);
  user-select: none;
  z-index: 5;
  @media (max-width: 540px) { font-size: 9px; }
`;

const PetaloText = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  padding: ${({ $small }) => $small ? '0 8px' : '0'};
  color: white;

  font-size: ${({ $small, $large }) =>
    !$small ? '34px' : $large ? '30px' : '9px'};

  font-weight: ${({ $small }) => $small ? '700' : '400'};
  text-align: center;
  line-height: 1;
  text-shadow: 0 1px 10px rgba(0,0,0,0.8);
  user-select: none;
`;

const ContainerAlert = styled.div`
  position: fixed;
  left: 20px; top: 20px;
  z-index: 999;
`;
