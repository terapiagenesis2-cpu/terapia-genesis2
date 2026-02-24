import styled from "styled-components";

const Watermark = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;

  background-image: url("/images/LOGO%20GENESIS_OSCURO..png");
  background-repeat: repeat;
  background-position: center;
  background-size: 220px;
  opacity: 0.06;
`;

export default Watermark;