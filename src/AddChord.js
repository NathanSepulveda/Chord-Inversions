import React from "react";
import styled from "styled-components";

const AddChord = ({ chordList, onClickAddChordNode, allowSound, play }) => {




  return (
    <AddChordButton

      disabled={chordList.length > 7}
      onClick={() => {
        onClickAddChordNode();
        if (allowSound) {
          play();
        }
      }}
    >
      +
    </AddChordButton>
  );
};

export default AddChord;

const AddChordButton = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 100%;
  background-color: lightgreen;
  line-height: 56px;
  text-align: center;
  font-size: 30px;
  margin-right: 5px;
  user-select: none;

  @media (max-width: 768px) {
    font-size: 38px;

    width: 50px;
    height: 50px;
    margin: 5px;
    line-height: 50px;

    &:active {
      width: 48px;
      height: 48px;
      line-height: 46px;
      background-color: #e0b0ff;
    }
    /* width: ${(props) => props.chordLength > 5 && "36px"};
    height: ${(props) => props.chordLength > 5 && "36px"};
    line-height: ${(props) => props.chordLength > 5 && "33px"};
    font-size: ${(props) => props.chordLength > 5 && "15px"}; */
  }
  /* cursor: pointer; */

  @media (max-width: 320px) {
    font-size: 38px;

    width: 46px;
    height: 46px;
    margin: 5px;
    line-height: 46px;

    &:active {
      width: 44px;
      height: 44px;
      line-height: 43px;
      background-color: #e0b0ff;
    }
    /* width: ${(props) => props.chordLength > 5 && "36px"};
    height: ${(props) => props.chordLength > 5 && "36px"};
    line-height: ${(props) => props.chordLength > 5 && "33px"};
    font-size: ${(props) => props.chordLength > 5 && "15px"}; */
  }


  @media (min-width: 768px) {
    &:active {
      width: 57px;
      height: 57px;
      line-height: 55px;
      background-color: #e0b0ff;
    }
  }

  cursor: ${(props) => !props.disabled && "pointer"};
  display: ${(props) => props.disabled && "none"};
`;
