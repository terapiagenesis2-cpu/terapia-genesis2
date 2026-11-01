import styled from "styled-components";

export const Background = styled.div`
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888888;
    border-radius: 2px;
  }

  min-height: 100vh;
  display: flex;
  flex-direction: column;
      // `;