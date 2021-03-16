import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useSound from "use-sound";

import click from "./button.mp3";
const LetterTile = styled.div`
  width: 42px;
  height: 42px;

  /* background-color: ${(props) => props.selected && "blue"}; */
  font-size: 20px;
  border-radius: 7px;

  line-height: 42px;
  text-align: center;
  margin: 7px;

  @media (max-width: 768px) {
    font-size: 16px;

    width: 42px;
    height: 42px;
    margin: 5px;
    /* padding: 5px; */
    line-height: 42px;
  }

  color: ${(props) => (props.selected ? "black" : "white")};

  cursor: ${(props) => !props.disabled && "pointer"};
  opacity: ${(props) => props.disabled && 0.2};
  background-color: ${(props) =>
    props.selected ? "#e0b0ff" : props.currentColor};

  box-shadow: ${(props) =>
    props.selected
      ? "2px 2px 5px 0 rgba(255, 255, 255, 0.3), -0.5px -1px 4px 0 rgba(0, 0, 0, 0.25)"
      : "2px 2px 5px 0 rgba(0, 0, 0, 0.25), -2px -2px 5px 0 rgba(255, 255, 255, 0.3)"};

  background-image: ${(props) =>
    props.selected
      ? "linear-gradient(135deg, rgba(0,0,0,0.255), rgba(255,255,255,0.25))"
      : ""};

  &.position {
    width: 65px;
  }

  &.quality {
    width: 55px;
  }
`;

export const DeleteButton = styled.button`
  width: 78px;
  height: 45px;

  /* background-color: ${(props) => props.selected && "blue"}; */
  font-size: 16px;
  border-radius: 7px;

  line-height: 45px;
  text-align: center;
  margin: 7px;

  @media (max-width: 768px) {
    font-size: 12px;

    width: 75px;
    height: 42px;
    margin: 5px;
    /* padding: 5px; */
    line-height: 42px;
  }

  border: none;
  outline: none;
  color: ${(props) => (props.selected ? "black" : "white")};

  cursor: ${(props) => !props.disabled && "pointer"};
  opacity: ${(props) => props.disabled && 0.2};
  background-color: red;

  box-shadow: ${(props) =>
    props.selected
      ? "2px 2px 5px 0 rgba(255, 255, 255, 0.3), -0.5px -1px 4px 0 rgba(0, 0, 0, 0.25)"
      : "2px 2px 5px 0 rgba(0, 0, 0, 0.25), -2px -2px 5px 0 rgba(255, 255, 255, 0.3)"};

  background-image: linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0.22),
    rgba(255, 255, 255, 0.25)
  );
`;

const TileContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
  background-color: ${(props) => props.currentColor};
`;

const ChordPicker = (props) => {
  const [chordRoot, setChordRoot] = useState("C");
  const [noteAccidental, setNoteAccidental] = useState("");
  const [chordQuality, setChordQuality] = useState("M");
  const [position, setPosition] = useState(0);

  const letters = ["C", "D", "E", "F", "G", "A", "B"];
  const accidentals = ["#", "b"];
  const qualities = ["M", "m"];
  const positions = [0, 1, 2];
  const [increment, setIncrement] = useState("plus");

  const [playbackRate, setPlaybackRate] = React.useState(1.0);

  const [play] = useSound(click, {
    playbackRate,
    volume: .9,
  });

  const handleAccidental = (v) => {
    if (props.allowSound) {
      play();
    }
    
    setNoteAccidental((prevState) => {
      if (["C", "F"].includes(chordRoot) && v === "b") {
        return prevState;
      } else if (["E", "B"].includes(chordRoot) && v === "#") {
        return prevState;
      } else if (prevState === v) {
        return "";
      } else {
        return v;
      }

      // if (prevState === v) {
      //   return "";
      // } else {
      //   return v;
      // }
    });
  };

  useEffect(() => {
    let root = chordRoot + noteAccidental;
    props.setChord(
      Number(props.activeNode),
      props.activeNode === 0
        ? [root, chordQuality, position]
        : [root, chordQuality]
    );

    console.log("here");
  }, [chordRoot, noteAccidental, chordQuality, position]);

  useEffect(() => {
    let current = props.chordList[props.activeNode];
    console.log(current);
    if (current !== undefined) {
      if (current[0].includes("#") || current[0].includes("b")) {
        let [r, acc] = current[0].split("");
        setChordRoot(r);
        setNoteAccidental(acc);
        setChordQuality(current[1]);
      } else {
        setChordRoot(current[0]);
        setNoteAccidental("");
        setChordQuality(current[1]);
      }
      if (current.length > 2) {
        setPosition(current[2]);
      }
    } else {
      setChordRoot("C");
      setNoteAccidental("");
      setChordQuality("M");
      console.log("my dog");

      let root = chordRoot + noteAccidental;
      props.setChord(
        Number(props.activeNode),
        props.activeNode === 0
          ? [root, chordQuality, position]
          : [root, chordQuality]
      );
    }
  }, [props.activeNode]);

  // // useEffect(() => {
  // //     let root = chordRoot + noteAccidental;
  // //     props.setChord(
  // //         Number(props.activeNode),
  // //         props.activeNode === 0
  // //           ? [root, chordQuality, position]
  // //           : [root, chordQuality]
  // //       );
  // // }, [])

  const handleSound = () => {
    if (increment === "plus") {
      setPlaybackRate(playbackRate + (Math.random() * 20) / 100);
      play();
    } else {
      setPlaybackRate(playbackRate - (Math.random() * 20) / 100);
      play();
    }

    setInterval((prev) => (prev === "minus" ? "plus" : "minus"));
  };

  const handleRoot = (v) => {
    if (noteAccidental === "#" && ["E", "B"].includes(v)) {
      setNoteAccidental("");
    } else if (noteAccidental === "b" && ["C", "F"].includes(v)) {
      setNoteAccidental("");
    }

    setChordRoot(v);
  };




  return (
    <React.Fragment>
      <div>
        <TileContainer currentColor={props.currentColor}>
          {letters.map((l, i) => (
            <LetterTile
              key={i}
              className="letter"
              selected={l === chordRoot}
              // onClick={() => handleRoot(l)}
              onClick={() => {
                if (props.allowSound) {
                  play();
                }
                handleRoot(l);
              }}
            >
              {l}
            </LetterTile>
          ))}
        </TileContainer>
        <TileContainer>
          {accidentals.map((l, i) => (
            <LetterTile
              key={i}
              className="accidental"
              selected={l === noteAccidental}
              currentColor={props.currentColor}
              // onClick={() => {
              //   handleAccidental(l);
              // }}
              onClick={() => {


                handleAccidental(l);
              }}
              disabled={
                ["C", "F"].includes(chordRoot) && l === "b"
                  ? true
                  : ["E", "B"].includes(chordRoot) && l === "#"
                  ? true
                  : false
              }
            >
              {l}
            </LetterTile>
          ))}
          <div style={{ width: "35px" }}></div>
          {qualities.map((l, i) => (
            <LetterTile
              key={i}
              className="quality"
              selected={l === chordQuality}
              // onClick={() => setChordQuality(l)}
              onClick={() => {
                //  setPlaybackRate((playbackRate + (Math.random() * 20)/100))
                if (props.allowSound) {
                  play();
                }
                // handleSound()
                setChordQuality(l);
              }}
              currentColor={props.currentColor}
            >
              {l === "M" ? "maj" : "min"}
            </LetterTile>
          ))}
        </TileContainer>
        {props.activeNode === 0 ? (
          <TileContainer>
            {positions.map((l, i) => (
              <LetterTile
                key={i}
                className="position"
                selected={l === position}
                // onClick={() => setPosition(l)}
                onClick={()=> {
                  if (props.allowSound) {
                    play();
                  }
                  setPosition(l)
                }}
                currentColor={props.currentColor}
              >
                {l === 0 ? "root" : l === 1 ? "1st" : "2nd"}
              </LetterTile>
            ))}
          </TileContainer>
        ) : (
          ""
        )}
        {props.activeNode !== 0 ? (
          <DeleteButton
            onClick={() => {
              if (props.activeNode !== 0) {
                props.deleteChord(props.activeNode);
                props.unsetActiveNode();
              }
            }}
          >
            DELETE
          </DeleteButton>
        ) : (
          ""
        )}

        <div>
          {/* {chordRoot}
        {noteAccidental}
        {chordQuality} */}
          {/* <button
      style={{marginLeft: "10px"}}
        onClick={() => {
          let root = chordRoot + noteAccidental;
          props.setChord(
            Number(props.activeNode),
            props.activeNode === 0
              ? [root, chordQuality, position]
              : [root, chordQuality]
          );
          props.unsetActiveNode();
        }}
      >
        Set Chord
      </button> */}
          {/* <button onClick={props.unsetActiveNode}> 
          Close
      </button> */}
        </div>

        {/* <button onClick={this.props.unsetActiveNode}></button> */}
      </div>
    </React.Fragment>
  );
};

export default ChordPicker;
