import * as React from "react";
import { Helmet } from "react-helmet";
import { Link } from "gatsby";
import LoginCheck from "../components/login/LoginCheck";
import styled, { createGlobalStyle } from "styled-components";

import bg from "../../static/images/portada.webp";
import logo from "../images/logo.png";
import card1 from "../../static/images/card-nivel1.png";
import card2 from "../../static/images/card-nivel2.png";

const GlobalStyle = createGlobalStyle`
  *,*::before,*::after{
    box-sizing: border-box;
  }

  html, body{
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

export default function Index() {
  return (
    <LoginCheck>
      <GlobalStyle />

      <Helmet>
        <title>Terapia Génesis – Seleccionar nivel</title>

        {/* Fuente similar a la de Figma */}
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

          <Nav>
            <NavA href="#sobre">Sobre la terapia</NavA>
            <NavA href="#equipo">Equipo</NavA>
            <NavA href="#contacto">Contacto</NavA>
          </Nav>
        </TopBar>

        <Center>
          <Title>Elegí tu nivel espiritual</Title>

          <Cards>
            {/* CARD 1 */}
            <CardLink to="/intro-text" aria-label="Terapia cuántica Génesis (Nivel I)">
              <Card $img={card1}>
                <CardOverlay />
                
              </Card>
            </CardLink>

            {/* CARD 2 */}
            <CardLink to="/intro2" aria-label="Génesis 5D (Nivel II)">
              <Card $img={card2}>
                <CardOverlay />
            
              </Card>
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
  z-index: -2;
`;

const DarkOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;

  background: radial-gradient(
    circle at 50% 20%,
    rgba(20, 70, 120, 0.35),
    rgba(6, 18, 40, 0.85)
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

const Nav = styled.nav`
  display: flex;
  gap: 28px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavA = styled.a`
  text-decoration: none;
  font-family: Inter, system-ui, -apple-system, Segoe UI, sans-serif;
  color: rgba(255,255,255,0.9);
  font-size: 14px;
  font-weight: 500;

  &:hover {
    color: rgba(255,255,255,1);
    text-shadow: 0 0 16px rgba(255,255,255,0.18);
  }
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
  font-family: "Playfair Display", serif;
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
  grid-template-columns: repeat(2, 360px); /* Figma */
  gap: 54px;
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

const Card = styled.article`
  position: relative;
  width: 360px;
  height: 360px;
  border-radius: 33px;
  overflow: hidden;

  background: rgba(255, 255, 255, 1);

  /* Fondo de la card */
  background-image: url(${(p) => p.$img});
  background-size: cover;
  background-position: center;

  /* Figma shadows EXACTAS */
  box-shadow:
    6px 4px 6px rgba(0, 0, 0, 0.25),
    0px 0px 12.1px rgba(255, 255, 255, 1),
    inset 0px 6px 8px rgba(255, 255, 255, 1);

  /* Default: sale con mouse (200ms) */
  transition:
    transform 200ms linear,
    filter 200ms linear,
    box-shadow 200ms linear;

  /* BN por defecto */
  filter: grayscale(100%) brightness(0.90) contrast(1.05);

  &:hover {
    /* Entrar: 1000ms */
    transition-duration: 1000ms;
    transition-timing-function: linear;
    transition-delay: 1ms;

    transform: translateY(-4px) scale(1.01);
    filter: grayscale(0%) brightness(1) contrast(1);
  }

  @media (max-width: 900px) {
    width: min(360px, 92vw);
    height: min(360px, 92vw);
  }
`;

/* oscurece suave para que el texto se vea limpio */
const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 35%,
    rgba(0,0,0,0.15),
    rgba(0,0,0,0.55)
  );
  pointer-events: none;
`;

