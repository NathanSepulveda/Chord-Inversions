import React from "react";
import styled from "styled-components";
import PlayButton from "./playbutton";
import TempoBox from "./Tempo";

const F = styled.div`
  background-color: #192c3b;

  text-align: center;
  padding: 15px;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 76px;
  width: 100%;
`;

const Phantom = styled.div`
  display: block;
  padding: 15px;
  height: 76px;
  width: 100%;
`;

const DeleteButton = styled.button`
  width: 60px;
  height: 40px;

  /* background-color: ${(props) => props.selected && "blue"}; */
  font-size: 11px;
  border-radius: 7px;

  line-height: 40px;
  text-align: center;
  /* margin: 7px; */

  border: none;
  outline: none;
  color: ${(props) => (props.selected ? "black" : "white")};

  cursor: ${(props) => !props.disabled && "pointer"};
  opacity: ${(props) => props.disabled && 0.2};
  background-color: red;
`;

function BottomControlls(props) {
  return (
    <div>
      <Phantom />
      <F>
        {
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <TempoBox
              speedIndex={props.speedIndex}
              speeds={props.speeds}
              handleSetSpeeds={props.handleSetSpeeds}
              disabled={props.isPlaying}
              color={props.currentColor}
            ></TempoBox>
            <PlayButton
              onClick={props.isPlaying ? props.onClickStop : props.onClickPlay}
              playing={props.isPlaying}
              currentColor={props.currentColor}
            />
            <DeleteButton
              disabled={props.isPlaying}
              onClick={props.onClickClear}
            >
              CLEAR
            </DeleteButton>
          </div>
        }
      </F>
    </div>
  );
}

export default BottomControlls;
