import React from "react";
import styled from "styled-components";
import PlayButton from "./playbutton";
import loopImage from './repeat-button.svg';
import TempoBox from "./Tempo";

const F = styled.div`
  background-color: #192c3b;

  text-align: center;
  padding: 15px;
  position: fixed;
  left: 0;
  /* right: 0; */
  bottom: 0;
  height: 74px;
  align-items: center;
  width: 100%;

  @media (min-height: 810px) {
    height: initial;
    padding: 35px;
  }
`;

const Phantom = styled.div`
  display: block;
  padding: 15px;
  height: 74px;
  /* width: 100%; */
  max-width: 400px;
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
              setCurrentStep={props.setCurrentStep}
              currentStep={props.currentStep}
              joyRideOpen={props.joyRideOpen}
            ></TempoBox>

            {/* <div

              style={{width: "40px", position: "relative", left:"60px"}}
            >loop</div> */}
            <img style={{height: "40px", height: "30px", position: "relative", left:"46px", top: "7px", opacity: (!props.isLooping ? ".3" : "" ), cursor: "pointer" }} src={loopImage} alt="Logo" 
            
            onClick={() => {
              !props.isPlaying && (props.isLooping ? props.setIsLooping(false) : props.setIsLooping(true)) 
            }}
            
            />

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
