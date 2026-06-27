import { navigate } from 'gatsby';
import styled from 'styled-components';

const QuantumRaizButton = () => (
    <Wrapper onClick={() => navigate('/circulo-base')}>
        <img src="/genesis-assets/quantum-raiz.svg" alt="Quantum Raiz" />
    </Wrapper>
);

const Wrapper = styled.div`
    position: fixed;
    bottom: 20px;
    left: 20px;
    cursor: pointer;
    width: 80px;
    &:hover {
        filter: brightness(1.1);
    }
`;

export default QuantumRaizButton;