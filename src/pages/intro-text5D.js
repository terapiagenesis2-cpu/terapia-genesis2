import { useEffect, useState } from "react";
import logoImg from "../images/logo.png";
import { navigate } from "gatsby";
import styled, { keyframes } from "styled-components";
import { TextField } from "@mui/material";
import LoginCheck from "../components/login/LoginCheck";

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/*
  STEPS:
  0 → Génesis 5D (aviso)         — sin dots
  1 → Oraciones apertura/cierre  — dot 1
  2 → Oración chamánica          — dot 2
  3 → Ho'oponopono + nombre/DOB  — dot 3
  4 → Conexión paciente + probl. — dot 4 → "Activar conexión"
*/
const TOTAL_STEPS = 4;

const V2 = () => {
  const [step,      setStep]      = useState(0);
  const [paciente,  setPaciente]  = useState("");
  const [dob,       setDob]       = useState({ day: "", month: "", year: "" });
  const [problems,  setProblems]  = useState(["", ""]);
  const [focused,   setFocused]   = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorPaciente, setErrorPaciente] = useState(false);
  const [errorProblems, setErrorProblems] = useState(false);
  const [modoSesion, setModoSesion] = useState(false);
  
  useEffect(() => {
    const hayPaciente = !!localStorage.getItem("paciente");

    if (hayPaciente) {
      setModoSesion(true);
      setStep(1); // o al step que quieras
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.margin = null;
      document.documentElement.style.padding = null;
      document.body.style.margin = null;
      document.body.style.padding = null;
      document.body.style.overflowX = null;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (focused) return;
      if (e.key === "Backspace" || e.key === "ArrowLeft") handleBack();
      if (e.key === "ArrowRight" || e.key === "Enter")    handleNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [step, paciente, dob, problems, focused]);



  const showError = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3500);
  };

  const handleBack = () => {
    if (step === 0) navigate("/");
    else setStep((s) => s - 1);
  };

  const handleNext = () => {
  if (step === 0) {
    setStep(1);
    return;
  }

  if (!modoSesion && step === 3) {
    if (!paciente.trim() || !dob.day || !dob.month || !dob.year) {
      setErrorPaciente(true);
      return;
    }
    setErrorPaciente(false);
  }

  if (step === TOTAL_STEPS) {
    if (modoSesion) {
      navigate("/interferencias");
      return;
    }

    if (!problems.some((p) => p && p.trim())) {
      setErrorProblems(true);
      return;
    }

    const dobStr = ` (${dob.day}/${dob.month}/${dob.year})`;

    localStorage.setItem("paciente", paciente.trim() + dobStr);
    localStorage.setItem("dob", JSON.stringify(dob));
    localStorage.setItem("problems", problems.filter(Boolean).join(","));
    localStorage.setItem("history", JSON.stringify([]));

    navigate("/circulo-base");
    return;
  }

  setStep((s) => s + 1);
};

  const btnLabel =
    step === 0           ? "Aceptar y continuar" :
    step === TOTAL_STEPS ? "Activar conexión"     : "Continuar";

  return (
    <LoginCheck>
      <Page>
        <TopBar>
          <Logo src={logoImg} alt="Terapia Génesis" />
          <Nav>
            <NavLink>Sobre la terapia</NavLink>
            <NavLink>Equipo</NavLink>
            <NavLink>Contacto</NavLink>
          </Nav>
        </TopBar>

        <CardArea>
        <Card key={step}>
          {showAlert && (
            <AlertWrap>Completar todos los campos para continuar</AlertWrap>
          )}
          <HeaderRow>
            <BackLink onClick={handleBack}>Anterior</BackLink>
            {step > 0 && (
              <DotsRow>
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <Dot key={i} $active={i + 1 === step} />
                ))}
              </DotsRow>
            )}
          </HeaderRow>
            
            {modoSesion && (
              <PacienteLabel>
                Sesión actual: {localStorage.getItem("paciente")}
              </PacienteLabel>
            )}


          {step === 0 && <SlideInicio />}
          {step === 1 && <SlideApertura />}
          {step === 2 && <SlideChamanica />}
          {step === 3 && (
            <SlidePaciente
              paciente={paciente} setPaciente={setPaciente}
              dob={dob}           setDob={setDob}
              setFocused={setFocused}
              errorPaciente={errorPaciente}
              modoSesion={modoSesion}
            />
          )}
          {step === 4 && (
            <SlideProblematicas
              problems={problems} setProblems={setProblems}
              setFocused={setFocused}
              errorProblems={errorProblems}
              modoSesion={modoSesion}
            />
          )}

          <FooterRow>
            <ContinueBtn onClick={handleNext}>{btnLabel}</ContinueBtn>
          </FooterRow>
        </Card>
        </CardArea>
      </Page>
    </LoginCheck>
  );
};

export default V2;

/* ══════════════════════════════════════════════
   SLIDES
══════════════════════════════════════════════ */

const SlideInicio = () => (
  <IntroWrapper>
    <MainTitle>GÉNESIS 5D</MainTitle>
    <IntroStrong>AVISO IMPORTANTE – ACCESO A NIVEL GÉNESIS® 5D</IntroStrong>
    <IntroText>
      Para garantizar la coherencia, profundidad y responsabilidad en la enseñanza del Nivel
      GÉNESIS® 5D, se establecen los siguientes requisitos obligatorios:
    </IntroText>
    <IntroList>
      <li>Experiencia mínima comprobable de 6 meses ejerciendo como terapeuta con la metodología.</li>
      <li>Aprobación de un examen de evaluación, que permitirá validar la integración real de los fundamentos, la práctica y la ética profesional del método.</li>
      <li>Uso correcto y explícito del nombre original en redes sociales, espacios terapéuticos y comunicaciones oficiales: <PinkText>Terapia Cuántica GÉNESIS®</PinkText></li>
    </IntroList>
    <IntroText>
      El Nivel 5D no es solo una formación más:<br />
      es una expansión de conciencia y de responsabilidad profesional.
    </IntroText>
    <IntroText>Por este motivo, únicamente podrán acceder quienes:</IntroText>
    <IntroList>
      <li>Hayan aplicado la técnica de manera activa.</li>
      <li>Representen fielmente la metodología.</li>
      <li>Utilicen el nombre oficial del método en su comunicación pública.</li>
    </IntroList>
    <IntroText>Esto asegura la protección, el respeto y la expansión auténtica de la frecuencia GÉNESIS®.</IntroText>
    <IntroText>Gracias por honrar el proceso y sostener la vibración del método.</IntroText>
  </IntroWrapper>
);

const SlideApertura = () => (
  <PrayerWrapper>
    <MainTitle>Espacio de oraciones</MainTitle>
    <SectionTitle>ORACIÓN PARA ABRIR ESPACIO SAGRADO</SectionTitle>
    <PrayerText>
      Querido padre celestial, te pido que extiendas tu escudo de protección en cada rincón de
      este espacio dedicado a la sanación y al amor incondicional. Coloca tu guarda y custodia a
      todos los seres de luz que me acompañan: energías positivas, maestros ascendidos, ángeles
      guardianes, guías angelicales, arcángeles, serafines, querubines, la protección del amado
      concilio del Espíritu Santo que me guía, la presencia de la madre María que me asiste y la
      sabiduría de Jesús que me inspira, Amén.
    </PrayerText>
    <SectionTitle style={{ marginTop: 28 }}>ORACIÓN PARA CERRAR ESPACIO SAGRADO</SectionTitle>
    <PrayerText>
      Doy gracias de manera infinita a mi Comité de Yo Superior, a mi ser espiritual y los seres
      que estuvieron en este día de sanación, por este sagrado servicio de evolución y
      transformación. En este momento, cierro amorosamente los archivos Akáshicos y las puertas
      astrales, confiando en la guía divina. Te agradezco Padre por tu presencia constante en mi
      vida, Madre, por la abundancia que nos ofreces, y al Espíritu Santo por tu elevado servicio.
      Que la luz del amor y sabiduría continúe guiándonos en este viaje espiritual, Amén.
    </PrayerText>
  </PrayerWrapper>
);

const SlideChamanica = () => (
  <PrayerWrapper>
    <MainTitle>Espacio de oraciones</MainTitle>
    <SectionTitle>ORACION CHAMANICA PARA ABRIR EL ESPACIO SAGRADO</SectionTitle>
    <PrayerText>A los vientos del Sur, gran serpiente, envuélvenos en tu círculo de luz y amor. Enséñanos a liberarnos del pasado, como tú renuevas tu piel, guíanos por el sendero de la belleza.</PrayerText>
    <PrayerText>A los vientos del Oeste, Gran Jaguar, ven a proteger este espacio medicinal, rodéanos con tu fuerza. Ven y enséñanos el camino de la paz, para vivir en armonía.</PrayerText>
    <PrayerText>A los vientos del Norte, Gran colibrí, abuelas y abuelos, antepasados, acérquense para calentar sus manos en nuestro fuego. Susúrrenos con el viento para comunicarse con nosotros. Los honramos a ustedes, que vinieron antes que nosotros, y a aquellos que vendrán después, de los hijos de nuestros hijos.</PrayerText>
    <PrayerText>A los vientos del Este, Gran Águila, Cóndor, vengan a nosotros desde el lugar donde el sol amanece, protégenos bajo tus alas, muéstranos las montañas que solo nos atrevemos a soñar. Enséñanos a volar, ala con ala, con el gran espíritu.</PrayerText>
    <PrayerText>Madre Tierra, Pachamama, nos hemos congregado para la sanación de todos tus hijos: el pueblo de las piedras, el reino de las plantas, aquellos de cuatro patas, los de dos patas, los que se deslizan por el suelo, los que tienen aletas, los que tienen pelaje y los que tienen alas. Todos nuestros parientes.</PrayerText>
    <PrayerText>Padre Sol, Abuela Luna, a las constelaciones de las Estrellas, Gran Espíritu, tú que eres conocido por mil nombres y que eres innombrable. Gracias por abrir este espacio de amor incondicional, haciéndonos uno con el Universo. Y permitirnos entonar el canto de la Vida. Ahó.</PrayerText>
    <SectionTitle style={{ marginTop: 28 }}>ORACIÓN CHAMÁNICA PARA CERRAR EL ESPACIO SAGRADO</SectionTitle>
    <PrayerText>Para concluir nuestra terapia al final del día, elevamos nuestro agradecimiento a la Serpiente, el Jaguar, el Colibrí, el Águila, el Cóndor, la Madre Tierra, el Padre Sol y la Abuela Luna, reconociendo su guía espiritual en nuestro viaje interior.</PrayerText>
  </PrayerWrapper>
);

const SlidePaciente = ({ paciente, setPaciente, dob, setDob, setFocused,errorPaciente,modoSesion }) => (
  <PrayerWrapper>
    <MainTitle>Espacio de oraciones</MainTitle>
    <SectionTitle>ORACION DE HO'OPONOPONO PARA INICIO DE SESIÓN</SectionTitle>
    <PrayerText>
      Divina presencia, sana aquí y ahora desde la raíz y para siempre, el problema o situación que
      trajo aquí (nombre del consultante)... haz que desbloquee las energías negativas que le impiden
      avanzar, aportando energía sanadora, liberándome y liberándolo/a de toda responsabilidad para
      lograr su evolución. Lo siento, perdóname, te amo, gracias.
    </PrayerText>
    {!modoSesion && ( 
      <>
        <InputCenter>
          <TextField
            label="Nombre y apellido"
            variant="filled"
            value={paciente}
            onChange={(e) => setPaciente(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            sx={{ ...inputSx, width: "min(380px, 100%)" }}
          />
        </InputCenter>
        <InputLabel>Fecha de nacimiento</InputLabel>
        <DateRow>
          <DateInput placeholder="Día"  value={dob.day}   onChange={(e) => setDob((d) => ({ ...d, day:   e.target.value }))} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
          <DateInput placeholder="Mes"  value={dob.month} onChange={(e) => setDob((d) => ({ ...d, month: e.target.value }))} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
          <DateInput $wide placeholder="Año" value={dob.year} onChange={(e) => setDob((d) => ({ ...d, year: e.target.value }))} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
        </DateRow>
        <Hint $error={errorPaciente}>
                      {errorPaciente
          ? "Completar todos los campos para continuar"
          : "Completar todos los campos para continuar"}
        </Hint>
      </>
      )}
  </PrayerWrapper>
);

const SlideProblematicas = ({ problems, setProblems, setFocused, errorProblems,modoSesion }) => (
  <PrayerWrapper>
    <MainTitle>Espacio de oraciones</MainTitle>
    <SectionTitle>CONEXIÓN CON EL PACIENTE</SectionTitle>
    <PrayerText>
      ¿Está el paciente dispuesto y abierto a recibir la terapia?<br />
      ¿Está el paciente abierto y receptivo hacia el terapeuta?<br />
      ¿Quiere el ser de (nombre del consultante)... sanar, progresar y transformarse?<br />
      ¿Acepta una sanación inmediata, completa, permitiendo encontrar una mejor versión para su bienestar y crecimiento personal?<br />
      ¿Cuál de estos puntos prioriza el ser de (nombre del consultante) para sanar?
    </PrayerText>
    {!modoSesion && (
      <>
        <ProblemRow>
          <TextField
            label="Problemática a tratar"
            variant="filled"
            value={problems[0]}
            onChange={(e) => { const c = [...problems]; c[0] = e.target.value; setProblems(c); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            sx={{ ...inputSx, width: "min(360px, 100%)" }}
          />
          <TextField
            label="Problemática a tratar"
            variant="filled"
            value={problems[1]}
            onChange={(e) => { const c = [...problems]; c[1] = e.target.value; setProblems(c); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            sx={{ ...inputSx, width: "min(360px, 100%)" }}
          />
        </ProblemRow>
        <Hint $error={errorProblems}>
          {errorProblems ? "Ingresar al menos una problemática." : "Completar todos los campos para continuar"}
        </Hint>
      </>
    )}
  </PrayerWrapper>
);

/* ══════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════ */

/* ── breakpoints ── */
const sm = "@media (max-width: 480px)";
const md = "@media (max-width: 768px)";

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background-image: url("/images/fondo-oraciones-G5D.png");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
`;

const TopBar = styled.div`
  width: 100%;
  padding: 14px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  flex-shrink: 0;
  ${md} { padding: 12px 20px; }
  ${sm} { padding: 10px 14px; }
`;

const Logo = styled.img`
  height: 95px;
  width: auto;
  filter: drop-shadow(0 6px 14px rgba(0,0,0,0.5));
  ${md} { height: 44px; }
  ${sm} { height: 36px; }
`;

const Nav = styled.div`
  display: flex;
  gap: 28px;
  ${md} { gap: 18px; }
  ${sm} { display: none; }
`;

const NavLink = styled.span`
  color: rgba(255,255,255,0.9);
  font-size: 14px;
  cursor: pointer;
  ${md} { font-size: 13px; }
`;

const CardArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px 40px;
  box-sizing: border-box;
  ${md} { padding: 24px 16px 32px; }
  ${sm} { padding: 16px 12px 24px; align-items: flex-start; }
`;

const Card = styled.div`
  width: 100%;
  max-width: 1080px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 34px 82px 38px;
  border-radius: 26px;
  background: rgba(6, 4, 20, 0.78);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 8px 48px rgba(0,0,0,0.7);
  animation: ${fadeSlide} 0.35s ease both;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.15) transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 4px; }
  ${md} { padding: 26px 28px 30px; max-height: 84vh; border-radius: 20px; }
  ${sm} { padding: 20px 16px 24px; max-height: 88vh; border-radius: 16px; }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  ${sm} { margin-bottom: 16px; }
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: rgba(255,255,255,0.72);
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  white-space: nowrap;
  &::before { content: "‹ "; font-size: 20px; }
  ${sm} { font-size: 13px; }
`;

const DotsRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  ${sm} { gap: 4px; }
`;

const Dot = styled.div`
  height: 8px;
  width: ${({ $active }) => ($active ? "28px" : "8px")};
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#fff" : "rgba(255,255,255,0.45)")};
  transition: all 0.3s ease;
  ${sm} { height: 6px; width: ${({ $active }) => ($active ? "20px" : "6px")}; }
`;

const MainTitle = styled.h1`
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(22px, 4vw, 42px);
  font-weight: 700;
  color: #fff;
  text-align: center;
  text-shadow: 0 4px 20px rgba(0,0,0,0.6);
  margin: 0 0 16px;
  letter-spacing: 0.5px;
  ${sm} { font-size: 22px; margin-bottom: 12px; }
`;

const SectionTitle = styled.h2`
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(12px, 2vw, 18px);
  font-weight: 600;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 16px;
  ${sm} { font-size: 12px; letter-spacing: 0.5px; margin-bottom: 12px; }
`;

const PrayerText = styled.p`
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(13px, 1.7vw, 16px);
  font-weight: 400;
  line-height: 1.65;
  color: rgba(255,255,255,0.88);
  text-align: center;
  max-width: 880px;
  margin: 0 auto 18px;
  ${sm} { font-size: 13px; line-height: 1.6; margin-bottom: 14px; text-align: left; }
`;

const IntroWrapper = styled.div`
  max-width: 680px;
  margin: 0 auto;
  ${sm} { max-width: 100%; }
`;

const IntroStrong = styled.p`
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(12px, 1.5vw, 13px);
  font-weight: 800;
  color: #fff;
  margin: 0 0 14px;
`;

const IntroText = styled.p`
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(12px, 1.5vw, 13px);
  font-weight: 400;
  line-height: 1.55;
  color: rgba(255,255,255,0.9);
  margin: 0 0 14px;
`;

const IntroList = styled.ul`
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(12px, 1.5vw, 13px);
  line-height: 1.55;
  color: rgba(255,255,255,0.9);
  padding-left: 18px;
  margin: 0 0 14px;
  li { margin-bottom: 6px; }
`;

const PinkText = styled.span`
  color: #ff26c9;
  font-weight: 700;
`;

const PrayerWrapper = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
`;

const InputCenter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  ${sm} { margin-top: 16px; }
  /* full width on mobile */
  ${sm} input, ${sm} .MuiFormControl-root { width: 100% !important; }
`;

const ProblemRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 24px;
  ${sm} {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
  }
  /* full width fields on mobile */
  ${sm} .MuiFormControl-root { width: 100% !important; max-width: 100%; }
`;

const InputLabel = styled.p`
  color: #fff;
  text-align: center;
  margin: 20px 0 10px;
  font-size: 14px;
  ${sm} { font-size: 13px; margin: 14px 0 8px; }
`;

const DateRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  ${sm} { gap: 8px; }
`;

const DateInput = styled.input`
  width: ${({ $wide }) => ($wide ? "112px" : "88px")};
  padding: 14px 0;
  border-radius: 16px;
  border: 1px solid white;
  background: rgba(255,255,255,0.04);
  color: white;
  text-align: center;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  &::placeholder { color: rgba(255,255,255,0.45); }
  &:focus { background: rgba(255,255,255,0.08); }
  ${sm} {
    width: ${({ $wide }) => ($wide ? "90px" : "72px")};
    font-size: 13px;
    padding: 12px 0;
    border-radius: 12px;
  }
`;

const Hint = styled.p`
  text-align: center;
  font-size: 12px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-style: italic;

  color: ${({ $error }) =>
    $error ? "#ff4d6d" : "rgba(255,255,255,0.5)"};

  &::before {
    content: ${({ $error }) => ($error ? '"⚠ "' : '"ⓘ "')};
  }

  transition: all 0.2s ease;
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  ${sm} { margin-top: 24px; }
`;

const ContinueBtn = styled.button`
  padding: 14px 46px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.45);
  background: rgba(255,255,255,0.08);
  color: white;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  &:hover { background: rgba(255,255,255,0.14); transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  ${sm} { padding: 13px 36px; font-size: 12px; width: 100%; max-width: 320px; }
`;

const alertFade = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const AlertWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 16px;
  width: 100%;
  animation: ${alertFade} 0.3s ease both;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 13px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.75);
  &::before { content: "ⓘ"; font-style: normal; }
`;

const inputSx = {
  "& .MuiFilledInput-root": {
    backgroundColor: "rgba(255,255,255,0.06) !important",
    border: "1px solid rgba(255,255,255,0.85)",
    borderRadius: "18px",
    color: "#fff",
    fontFamily: '"Inter", system-ui, sans-serif',

    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.09) !important",
    },

    "&.Mui-focused": {
      backgroundColor: "rgba(255,255,255,0.09) !important",
    },
  },

  "& .MuiFilledInput-root::before": {
    borderBottom: "none",
  },

  "& .MuiFilledInput-root::after": {
    borderBottom: "none",
  },

  "& .MuiFilledInput-input": {
    color: "#fff",
    backgroundColor: "transparent !important",
  },

  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.7)",
    fontFamily: '"Inter", system-ui, sans-serif',
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "rgba(255,255,255,0.95)",
  },

  // 🔥 AUTOFILL TRANSPARENTE REAL
  "& input:-webkit-autofill": {
    WebkitTextFillColor: "#fff !important",
    caretColor: "#fff",

    // ❗ totalmente transparente
    WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
    backgroundColor: "transparent !important",

    transition: "background-color 9999s ease-in-out 0s",
  },

  "& input:-webkit-autofill:hover": {
    WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
  },

  "& input:-webkit-autofill:focus": {
    WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
  },
};

const PacienteLabel = styled.div`
  text-align: center;
  margin-bottom: 15px;

  font-size: 14px;
  font-family: "Inter", system-ui, sans-serif;

  color: rgba(255,255,255,0.85);
  letter-spacing: 1px;

  background: rgba(255,255,255,0.06);
  padding: 8px 14px;
  border-radius: 12px;

  backdrop-filter: blur(6px);
`;