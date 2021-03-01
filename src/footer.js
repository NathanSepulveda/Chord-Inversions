import React from "react";
import styled from "styled-components";
import TempoBox from "./Tempo"

const F = styled.div`
  background-color: #192c3b;
  border-top: 1px solid #e7e7e7;

  text-align: center;
  padding: 20px;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 85px;
  width: 100%;

`;

const Phantom = styled.div`
  display: block;
  padding: 20px;
  height: 85px;
  width: 100%;
`;

function Footer({ children }) {
  return (
    <div>
      <Phantom />
      <F>
        {/* <TempoBox></TempoBox> */}
        {children}
      </F>
    </div>
  );
}

export default Footer;
