import styled from 'styled-components';
import {navigate} from "gatsby";
import ResponsiveText from "../apis/ResponsiveText";




const NavigationButtons = () => <>
    <Container>
        <BackButton color="white" onClick={()=> navigate(-1)}/>
        <NextButton color="white" onClick={()=> navigate(+1)}/>
    </Container>
</>

export const NavigationButtonsInLine = () => <>
    <ContainerInLine>
        <BackButtonInLine color="white" onClick={()=> navigate(-1)}/> 
           <GuiaButton onClick={()=>navigate('/circulo-base')}>
        <ResponsiveText scale={0.6} bold color={"#413f3f"}>
            FUENTE MADRE
        </ResponsiveText>
    </GuiaButton>
        <NextButtonInLine color="white" onClick={()=> navigate(+1)}/>
    </ContainerInLine>
   
</>


// Anterior / siguiente con el diseño de Figma (pastilla 170x43 con flechas)
export const NavigationPill = () => <Pill>
    <PillButton aria-label="Anterior" onClick={() => navigate(-1)}>
        <Chevron/>
    </PillButton>
    <PillButton aria-label="Siguiente" onClick={() => navigate(+1)}>
        <Chevron flip/>
    </PillButton>
</Pill>

const Chevron = ({flip}) => (
    <svg width="14" height="22" viewBox="0 0 13.7779 22.0001" fill="none"
         style={flip ? {transform: "scaleX(-1)"} : undefined}>
        <path d="M12.2778 1.50006L2.25859 9.43197C1.24713 10.2327 1.24714 11.7674 2.25859 12.5682L12.2778 20.5001"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);

const Pill = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 170px;
  height: 43px;
  background: url("/genesis-assets/nav-pill.svg") no-repeat center / 100% 100%;
`;

const PillButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 100%;
  padding: 0;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  transition: filter 0.2s ease;

  &:hover {
    filter: drop-shadow(0 0 4px white);
  }
`;

const GuiaButton = styled.div`
  padding: 10px 20px;
  background-color: #fff7f7;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 20px;
  
  :hover {
   filter: brightness(1.5);
  }
`;

const ContainerInLine = styled.div`
  display: flex;
  gap: 50px;
`;

const Button = styled.div`
  width: 0;
  height: 0;
  border-top: 35px solid transparent;
  border-bottom: 35px solid transparent;
  user-select: none;
  cursor: pointer;
`;

const ButtonInLine = styled.div`
  width: 0;
  height: 0;
  border-top: 25px solid transparent;
  border-bottom: 25px solid transparent;
  user-select: none;
  cursor: pointer;
`;

export const NextButtonInLine = styled(ButtonInLine)`
  border-left: 35px solid ${props => props.color};
`;

export const BackButtonInLine = styled(ButtonInLine)`
  border-right: 35px solid ${props => props.color};
`;

const ButtonCustom = styled(Button)`

  @media (max-width: 370px) {
    border-top: 23px solid transparent;
    border-bottom: 23px solid transparent;
  }
  
  @media (max-width: 410px) and (min-width: 370px) {
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
  }
  
  @media (max-width: 620px) and (min-width: 410px) {
    border-top: 30px solid transparent;
    border-bottom: 30px solid transparent;
  }
`;

export const BackButton = styled(ButtonCustom)`
  border-right: 50px solid ${props => props.color};
  
  @media (max-width: 370px) {
    border-right: 33px solid ${props => props.color};
  }

  @media (max-width: 410px) and (min-width: 370px) {
    border-right: 35px solid ${props => props.color};
  }

  @media (max-width: 620px) and (min-width: 410px) {
    border-right: 40px solid ${props => props.color};
  }
`;

export const NextButton = styled(ButtonCustom)`
  border-left: 50px solid ${props => props.color};

  @media (max-width: 370px) {
    border-left: 33px solid ${props => props.color};
  }
  
  @media (max-width: 410px) and (min-width: 370px) {
    border-left: 35px solid ${props => props.color};
  }

  @media (max-width: 620px) and (min-width: 410px) {
    border-left: 40px solid ${props => props.color};
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 350px;

  @media (max-width: 370px) {
    width: 180px;
  }
  
  @media (max-width: 410px) and (min-width: 370px) {
    width: 210px;
  }

  @media (max-width: 465px) and (min-width: 410px) {
    width: 250px;
  }

  @media (max-width: 540px) and (min-width: 465px) {
    width: 270px;
  }

  @media (max-width: 620px) and (min-width: 540px) {
    width: 300px;
  }
`;

export default NavigationButtons;