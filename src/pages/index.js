import * as React from "react";
import { Helmet } from "react-helmet";
import { Link } from "gatsby";
import LoginCheck from "../components/login/LoginCheck";
import styled, { createGlobalStyle } from "styled-components";
import bg from "../../static/images/portada.webp";
import logo from "../images/logo.png";
import card1Bn from "../../static/images/card-nivel1-bn.png";
import card1Color from "../../static/images/card-nivel1.png";
import card2Bn from "../../static/images/card-nivel2-bn.png";
import card2Color from "../../static/images/card-nivel2.png";
import {Alert, TextField} from "@mui/material";


const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

const clearSessionData = () => {
  localStorage.removeItem("paciente");
  localStorage.removeItem("dob");
  localStorage.removeItem("problems");
  localStorage.setItem("history", JSON.stringify([]));
}
const Index = () => {
  
  React.useEffect(() => {
  clearSessionData();
}, []);


  return (
    <LoginCheck>
      <GlobalStyle />
      <Helmet>
        <title>Terapia Génesis – Seleccionar nivel</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <Page>
        <Background />
        <DarkOverlay />

        <TopBar>
          <Brand to="/">
            <Logo src={logo} alt="Génesis" />
          </Brand>
        </TopBar>

        <Center>
          <Title>Elegí tu nivel espiritual</Title>

          <Cards>
            <CardLink to="/intro-text" aria-label="Terapia cuántica Génesis Nivel I">
              <CardFrame $hoverBorder="rgba(245,245,245,0.95)" $glow="rgba(255,255,255,0.55)">
                <CardImage src={card1Bn} alt="" />
                <CardImageHover src={card1Color} alt="" />
              </CardFrame>
            </CardLink>

            <CardLink to="/intro-text5D" aria-label="Génesis 5D Nivel II">
              <CardFrame $hoverBorder="rgba(255, 255, 255, 0.95)" $glow="rgba(255, 255, 255, 0.55)">
                <CardImage src={card2Bn} alt="" />
                <CardImageHover src={card2Color} alt="" />
              </CardFrame>
            </CardLink>
          </Cards>
        </Center>
      </Page>
    </LoginCheck>
  );
}

/* -------------------- ESTILOS -------------------- */

const Page = styled.div`
  width: 100vw;
  min-height: 100vh;
  position: relative;
`;

const Background = styled.div`
  position: fixed;
  inset: 0;
  background-image: url(${bg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -3;
`;

const DarkOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: -2;
  background: radial-gradient(
    circle at 50% 25%,
    rgba(20, 70, 120, 0.18),
    rgba(6, 18, 40, 0.62)
  );
`;

const TopBar = styled.header`
  width: 100%;
  padding: 22px 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 18px 18px;
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  filter: drop-shadow(0 8px 18px rgba(0,0,0,0.55));
`;

const Center = styled.main`
  min-height: calc(100vh - 110px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 18px 64px;
`;

const Title = styled.h1`
  margin: 0 0 34px;
  font-family: Arvo, serif;
  color: rgba(255,255,255,0.95);
  font-size: 54px;
  font-weight: 700;
  text-align: center;
  text-shadow: 0 10px 30px rgba(0,0,0,0.65);

  @media (max-width: 1024px) {
    font-size: 46px;
  }

  @media (max-width: 480px) {
    font-size: 34px;
    margin-bottom: 22px;
  }
`;

const Cards = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 360px);
  gap: 30%;
  justify-content: center;
  align-items: center;


  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 26px;
  }
`;

const CardLink = styled(Link)`
  text-decoration: none;
`;

const CardFrame = styled.div`
  width: 360px;
  height: 360px;
  border-radius: 33px;
  position: relative;
  overflow: hidden;


  box-shadow:
    6px 4px 6px rgba(0, 0, 0, 0.25),
    0 0 10px rgba(255, 255, 255, 0.35),
    inset 0 6px 8px rgba(255, 255, 255, 0.85);

  transition:
    transform 200ms linear,
    border-color 200ms linear,
    box-shadow 200ms linear;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 33px;
    pointer-events: none;
    opacity: 0;
    box-shadow:
      0 0 0 2px ${(p) => p.$hoverBorder},
      0 0 10px ${(p) => p.$glow},
      0 0 18px ${(p) => p.$glow};
    transition: opacity 200ms linear, box-shadow 200ms linear;
  }

  &:hover {
    transform: translateY(-4px) scale(1.01);
    border-color: ${(p) => p.$hoverBorder};

    transition:
      transform 1000ms linear 1ms,
      border-color 1000ms linear 1ms,
      box-shadow 1000ms linear 1ms;

    box-shadow:
      6px 4px 6px rgba(0, 0, 0, 0.25),
      0 0 12px rgba(255, 255, 255, 0.85),
      inset 0 6px 8px rgba(255, 255, 255, 0.95);
  }

  &:hover::after {
    opacity: 1;
    transition: opacity 1000ms linear 1ms, box-shadow 1000ms linear 1ms;
  }

  @media (max-width: 900px) {
    width: min(360px, 92vw);
    height: min(360px, 92vw);
  }
`;

const CardImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardImageHover = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;

  transition: opacity 200ms linear;

  ${CardFrame}:hover & {
    opacity: 1;
    transition: opacity 260ms ease-out;
  }
`;

export default Index;