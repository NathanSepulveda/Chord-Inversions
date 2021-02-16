import React, { useState, useEffect } from "react";
import styled from "styled-components";

const LetterTile = styled.div`
width: 35px;
height: 35px;

/* background-color: ${(props) => props.selected && "blue"}; */
font-size: 20px;
border-radius: 7px;
text-align: center;
line-height: 35px;
color: white;
margin: 5px;
cursor: ${(props) => !props.disabled && "pointer"};
opacity: ${(props) => props.disabled && 0.2};

&.letter {
  background-color: ${(props) => (props.selected ? "rgb(15, 99, 214)" : "#DCDCDC")};
}

&.accidental {
  background-color: ${(props) => (props.selected ? "rgb(15, 99, 214)"  : "#C0C0C0")};
}
&.quality {
  background-color: ${(props) => (props.selected ? "rgb(15, 99, 214)"  : "#808080")};
}

&.position {
  background-color: ${(props) => (props.selected ? "rgb(15, 99, 214)"  : "#778899")};
}
`;

const TileContainer = styled.div`
display: flex;
flex-direction: row;
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

const handleAccidental = (v) => {
  setNoteAccidental((prevState) => {

    if (["C", "F"].includes(chordRoot) && v === "b") {
      return prevState
    } else if (["E", "B"].includes(chordRoot) && v === "#") {
      return prevState
    } else if (prevState === v) {
      return ""
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
  let current = props.chordList[props.activeNode];

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
  }
}, [props.activeNode]);
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
    <TileContainer>
      {letters.map((l, i) => (
        <LetterTile
          key={i}
          className="letter"
          selected={l === chordRoot}
          onClick={() => handleRoot(l)}
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
      <div style={{ background: "rgb(233, 244, 233", width: "35px" }}></div>
      {qualities.map((l, i) => (
        <LetterTile
          key={i}
          className="quality"
          selected={l === chordQuality}
          onClick={() => setChordQuality(l)}
        >
          {l}
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
            onClick={() => setPosition(l)}
          >
            {l === 0 ? "R" : l}
          </LetterTile>
        ))}
      </TileContainer>
    ) : (
      ""
    )}

    <div>
      {chordRoot}
      {noteAccidental}
      {chordQuality}
      <button
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
      </button>
      {props.activeNode !== 0 ? (
        <button
          onClick={() => {
            if (props.activeNode !== 0) {
              props.deleteChord(props.activeNode);
              props.unsetActiveNode();
            }
          }}
        >
          delete
        </button>
      ) : (
        ""
      )}
    </div>

    {/* <button onClick={this.props.unsetActiveNode}></button> */}
  </React.Fragment>
);
};

export default ChordPicker