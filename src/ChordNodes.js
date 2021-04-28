import React, { useState, useEffect, useReducer } from "react";
import styled from "styled-components";

const DeleteButton = styled.div`
  z-index: 8;
  position: relative;
  bottom: 60px;
  left: 40px;
  border-radius: 100%;
  background-color: red;
  width: 22px;
  height: 22px;
  font-size: 1em;
  text-align: center;
  color: white;
  cursor: pointer;
`;

const ChordNode = styled.div`
  width: 58px;
  height: 58px;

  border-radius: 100%;
  /* border: 1px solid white; */
  background-color: ${(props) => props.currentColor};
  color: white;
  line-height: 58px;
  text-align: center;
  font-size: 18px;
  margin-right: 20px;
  background-color: ${(props) => props.active && "#e0b0ff"};
  background-color: ${(props) => props.playing && "yellow"};
  color: ${(props) => props.playing && "black"};
  user-select: none;

  cursor: pointer;
  z-index: 1;

  /* background-color: ${(props) => (props.selected ? "yellow" : "#add8e6")}; */

  box-shadow: ${(props) =>
    props.active || props.playing
      ? "2px 2px 5px 0 rgba(255, 255, 255, 0.3), -0.5px -1px 4px 0 rgba(0, 0, 0, 0.25)"
      : "2px 2px 5px 0 rgba(0, 0, 0, 0.25), -2px -2px 5px 0 rgba(255, 255, 255, 0.3)"};

  background-image: ${(props) =>
    props.active || props.playing
      ? "linear-gradient(135deg, rgba(0,0,0,0.255), rgba(255,255,255,0.25))"
      : ""};

  @media (max-width: 768px) {
    font-size: 22px;

    width: 50px;
    height: 50px;
    margin: 5px;
    /* padding: 5px; */
    line-height: 50px;
    /* 
    width: ${(props) => props.chordLength > 5 && "36px"};
    height: ${(props) => props.chordLength > 5 && "36px"};
    line-height: ${(props) => props.chordLength > 5 && "33px"};
    font-size: ${(props) => props.chordLength > 5 && "15px"}; */
  }

  @media (max-width: 320px) {
    font-size: 22px;

    width: 46px;
    height: 46px;
    margin: 5px;
    /* padding: 5px; */
    line-height: 46px;
    /* 
    width: ${(props) => props.chordLength > 5 && "36px"};
    height: ${(props) => props.chordLength > 5 && "36px"};
    line-height: ${(props) => props.chordLength > 5 && "33px"};
    font-size: ${(props) => props.chordLength > 5 && "15px"}; */
  }
  /* &:after {
    content: '';
  flex: 1;
  padding-left: 2rem;
  height: 1px;
  background-color: #000;
  } */
`;

const ChordNodes = (props) => {
  return (
    <React.Fragment>
      {props.chordList.map((c, i) => (
        <div style={{ height: "60px" }} className="chord-nodes">
          <ChordNode
            currentColor={props.currentColor}
            onDoubleClick={() => {
              props.onPlayChord(i);
            }}
            chordLength={props.chordList.length}
            onClick={() => {
              props.setIsPlaying(false);
              props.setActiveNode(i);
              // onPlayChord(i);
            }}
            active={props.activeNode === i}
            playing={props.activePlayingNode === i}
            key={i}
          >
            {c === undefined ? "" : c.includes("m") ? c[0] + c[1] : c[0]}
          </ChordNode>
          {props.activeNode === i && i !== 0 ? (
            <DeleteButton onClick={() => props.deleteChord(i)}>x</DeleteButton>
          ) : (
            ""
          )}
        </div>
      ))}
    </React.Fragment>
  );
};

export default ChordNodes;
