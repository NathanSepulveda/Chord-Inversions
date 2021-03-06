import React, { useState } from "react";
import styled from "styled-components";

const NumberBox = styled.div`
  width: 60px;
  height: 40px;
  background-color: ${(props) => props.color};
  border-radius: 8px;
  opacity: ${(props) => props.disabled && 0.2};

  /* box-shadow: ${(props) =>
    !props.selected
      ? "2px 2px 5px 0 rgba(255, 255, 255, 0.3), -0.5px -1px 4px 0 rgba(0, 0, 0, 0.25)"
      : ""};

  background-image: linear-gradient(-45deg, rgba(0,0,0,0.22), rgba(255,255,255,0.25)); */
  color: black;
  text-align: center;
  line-height: 40px;
  font-size: 28px;
  transform: scale(-1, 1);
  cursor: ${(props) => !props.disabled && "pointer"};


`;

const TempoBox = (props) => {
  return (
    <div>
      <NumberBox onClick={() => !props.disabled ? props.handleSetSpeeds() : ""} disabled={props.disabled} color={props.color}>
        {props.speeds[props.speedIndex].label}
      </NumberBox>
      <label style={{position: "relative", left: "-18px", color: "white", fontSize: "11px"}}>PLAYBACK SPEED</label>
    </div>
  );
};

export default TempoBox;
