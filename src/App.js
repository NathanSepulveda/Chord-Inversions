import styled from "styled-components";
import SoundfontProvider from "./soundfontprovider";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import "react-piano/dist/styles.css";
import PianoWithRecording from "./PianoWithRecording";

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";

let getTransform = (prev, destination) => {
  if (destination[0] === "0") {
    return Number(prev.split("-")[1]);
  }
  if (prev.split("-")[1] === "0") {
    if (prev.split("-")[0] === "M") {
      return transFormKeyMajRoot[destination][0];
    } else {
      return transformKeyMin[destination][0];
    }
  } else if (prev.split("-")[1] === "1") {
    if (prev.split("-")[0] === "M") {
      return (transFormKeyMajRoot[destination][0] + 1) % 3;
    } else {
      return (transformKeyMin[destination][0] + 1) % 3;
    }
  } else if (prev.split("-")[1] === "2") {
    if (prev.split("-")[0] === "M") {
      return (transFormKeyMajRoot[destination][0] + 2) % 3;
    } else {
      return (transformKeyMin[destination][0] + 2) % 3;
    }
  }
};

let transformKeyMin = {
  "1-M": [0],
  "1-m": [0],
  "2-M": [2],
  "2-m": [0, 2],
  "3-M": [2],
  "3-m": [2],
  "4-M": [2],
  "4-m": [2],
  "5-M": [2],
  "5-m": [2],
  "6-M": [1],
  "6-m": [1, 2],
  "7-M": [1],
  "7-m": [1],
  "8-M": [1],
  "8-m": [1],
  "9-M": [1],
  "9-m": [1],
  "10-M": [0],
  "10-m": [0, 1],
  "11-M": [0],
  "11-m": [0],
};

// let transformKeySus = {
//   "1-M": [0],
//   "1-m": [0],
//   "2-M": [2],
//   "2-m": [0, 2],
//   "3-M": [2],
//   "3-m": [2],
//   "4-M": [2],
//   "4-m": [2],
//   "5-M": [2],
//   "5-m": [2],
//   "6-M": [1],
//   "6-m": [1, 2],
//   "7-M": [1],
//   "7-m": [1],
//   "8-M": [1],
//   "8-m": [1],
//   "9-M": [1],
//   "9-m": [1],
//   "10-M": [0],
//   "10-m": [0, 1],
//   "11-M": [0],
//   "11-m": [0],
// };

let transFormKeyMajRoot = {
  "1-M": [0],
  "1-m": [0],
  "1-dim": [0],
  "2-M": [0, 2],
  "2-m": [0],
  "2-dim": [0],
  "3-M": [2],
  "3-m": [2],
  "3-dim": [2],
  "4-M": [2],
  "4-m": [2],
  "4-dim": [2],
  "5-M": [2],
  "5-m": [2],
  "5-dim": [2],
  "6-M": [1, 2],
  "6-m": [2],
  "6-dim": [2],
  "7-M": [1],
  "7-m": [1],
  "7-dim": [1],
  "8-M": [1],
  "8-m": [1],
  "8-dim": [1],
  "9-M": [1],
  "9-m": [1],
  "9-dim": [1],
  "10-M": [0, 1],
  "10-m": [1],
  "10-dim": [1],
  "11-M": [0],
  "11-m": [0],
  "11-dim": [0],
};

let createChord = (MIDINumber, quality) => {
  if (quality === "M") {
    return [MIDINumber, MIDINumber + 4, MIDINumber + 7];
  } else if (quality === "m") {
    return [MIDINumber, MIDINumber + 3, MIDINumber + 7];
  } else if (quality === "dim") {
    return [MIDINumber, MIDINumber + 3, MIDINumber + 6];
  }
};

let transposeChord = (chord, octave) => {
  return chord.map((note) => note + octave);
};

let invertUp = (chord, destination) => {
  if (destination === 1) {
    return [chord[1], chord[2], chord[0] + 12];
  } else if (destination === 2) {
    return [chord[2], chord[0] + 12, chord[1] + 12];
  } else {
    return chord;
  }
};

let notes = {
  C: 60,
  "C#": 61,
  Db: 61,
  D: 62,
  "D#": 63,
  Eb: 63,
  E: 64,
  F: 65,
  "F#": 66,
  Gb: 66,
  G: 67,
  "G#": 68,
  Ab: 68,
  A: 69,
  "A#": 70,
  Bb: 70,
  B: 71,
};

let getDistanceInSemiTones = (note1, note2) => {
  let res = notes[note2] - notes[note1];
  if (Math.sign(res) === -1) {
    return res + 12;
  }

  return res;
};

let getNextChord = (currentChordWithPosition, nextChord) => {
  let [
    currentChordRoot,
    currentChordQuality,
    currentChordPosition,
  ] = currentChordWithPosition;

  let [nextChordRoot, nextChordQuality] = nextChord;

  let distance = getDistanceInSemiTones(currentChordRoot, nextChordRoot);

  let transform = getTransform(
    `${currentChordQuality}-${currentChordPosition}`,
    `${distance}-${nextChordQuality}`
  );
  let prevChord = invertUp(
    createChord(notes[currentChordRoot], currentChordQuality),
    currentChordPosition
  );

  let newChord = createChord(notes[nextChordRoot], nextChordQuality);

  let invertedChord = invertUp(newChord, transform);
  // if (invertedChord[0] - prevChord[0] > 6) {
  //   invertedChord = transposeChord(invertedChord, -12)
  // }
  return [
    prevChord,
    invertedChord,
    [nextChordRoot, nextChordQuality, transform],
  ];
};

let chordChain = (startingChord, listOfChords) => {
  let next;
  let chords = [];
  listOfChords.forEach((chord, i) => {
    if (i === 0) {
      let p = getNextChord(startingChord, chord);
      // console.log(p)
      chords.push(p[0]);
      chords.push(p[1]);
      next = p[2];
    } else {
      let p = getNextChord(next, chord);
      // console.log(p)
      chords.push(p[1]);
      next = p[2];
    }
  });
  let next2;
  let p = chords.map((chord) => {
    if (next2 == null) {
      next2 = chord;
      return chord;
    } else {
      if (chord[0] - next2[0] > 4) {
        next2 = transposeChord(chord, -12);
        return next2;
      } else if (chord[0] - next2[0] < -4) {
        next2 = transposeChord(chord, 12);
        return next2;
      } else {
        next2 = chord;
        return chord;
      }
    }
  });

  let final = lowerAll(p);

  console.log(final);

  return final;
};

let lowerAll = (chords) => {
  let newish = [];
  let tooHigh = false;
  for (let i = 0; i < chords.length; i++) {
    if (chords[i][2] > 79) {
      tooHigh = true;
      break;
    }
  }

  if (tooHigh) {
    chords.forEach((chord) => {
      newish.push(transposeChord(chord, -12));
    });
    return newish;
  } else {
    return chords;
  }
};

let getStuff = (cChain) => {
  let duration = 1.9;
  let current = 0;
  let neww = [];
  let justNotes = [];
  cChain.forEach((c, i) => {
    console.log(c);
    justNotes.push(c);
    c.forEach((n) => {
      neww.push({ midiNumber: n, time: current, duration: duration, group: i });
    });
    current += 2;
  });
  return [neww, justNotes];
};

class App extends React.Component {
  state = {
    isPlaying: false,
    recording: {
      events: [],
      currentEvents: [],
    },
    chordList: [],
    activeNode: undefined,
    recordingAsNotes: [],
    isCalculated: false,
    chordString: "",
  };

  scheduledEvents = [];

  getRecordingEndTime = () => {
    if (this.state.recording.events.length === 0) {
      return 0;
    }
    return Math.max(
      ...this.state.recording.events.map((event) => event.time + event.duration)
    );
  };

  setRecording = (value) => {
    this.setState({
      recording: Object.assign({}, this.state.recording, value),
    });
  };

  onClickCalculate = () => {
    this.setState({ chordString: "" });
    console.log(this.state.chordList);
    if (this.state.chordList.length < 2) {
      return;
    }
    let events = getStuff(
      chordChain(this.state.chordList[0], this.state.chordList.slice(1))
    );
    this.setRecording({
      events: events[0],
    });
    this.setState({ recordingAsNotes: events[1] });
    this.setState({ isCalculated: true });
  };

  onClickPlay = () => {
    this.setState({ isPlaying: true });

    console.log(this.state);
    const startAndEndTimes = _.uniq(
      _.flatMap(this.state.recording.events, (event) => [
        event.time,
        event.time + event.duration,
      ])
    );

    let count = 0;
    console.log(startAndEndTimes);
    startAndEndTimes.forEach((time) => {
      this.scheduledEvents.push(
        setTimeout(() => {
          const currentEvents = this.state.recording.events.filter(
            (event, i) => {
              if (event.time <= time && event.time + event.duration > time) {
                count = event.group;
                return event.time <= time && event.time + event.duration > time;
              }
            }
          );

          this.setRecording({
            currentEvents,
          });
          this.convertMIDIToChordLetters(
            this.state.chordList[count],
            this.state.recordingAsNotes[count]
          );
        }, time * 1000)
      );
    });

    // Stop at the end
    console.log(this.state);
    setTimeout(() => {
      this.onClickStop();
      this.setState({ chordString: "" });
    }, this.getRecordingEndTime() * 1000);
  };

  onPlayChord = (index) => {
    if (this.state.isPlaying) {
      return;
    }
    this.setState({ isPlaying: true });

    let chordIwant = this.state.recordingAsNotes[index];
    let chordName = this.state.chordList[index];

    let currentEvents = chordIwant.map((n) => {
      return { midiNumber: n, time: "", duration: "" };
    });

    this.setRecording({
      currentEvents,
    });

    this.convertMIDIToChordLetters(chordName, chordIwant);

    setTimeout(() => {
      this.onClickStop();
    }, 1 * 2000);
  };

  convertMIDIToChordLetters = (chordFromList, chordIwant) => {
    let accidental = "";
    if (chordFromList[0].length > 1) {
      accidental = chordFromList[0].split("")[1];
    }

    let asNotes = chordIwant.map((n) => {
      return this.getKeyByValue(notes, n, accidental);
    });

    console.log(asNotes);
    let str = asNotes.join(" - ");

    let chordS = chordFromList[0] + chordFromList[1] + ": " + str;
    if (chordFromList.includes("M")) {
      chordS = chordFromList[0] + ": " + str;
    }

    this.setState({ chordString: chordS });
  };

  onClickStop = () => {
    this.scheduledEvents.forEach((scheduledEvent) => {
      clearTimeout(scheduledEvent);
    });
    this.setState({ isPlaying: false });
    this.setRecording({
      mode: "RECORDING",
      currentEvents: [],
    });
  };

  onClickClear = () => {
    this.onClickStop();
    this.setState({ chordString: "" });
    this.setState({ chordList: [] });
    this.setRecording({
      events: [],
      currentEvents: [],
    });
    this.setState({ isCalculated: false });
  };

  onClickAddChordNode = () => {
    this.setState({
      chordList: [...this.state.chordList, undefined],
    });
    this.setState({ activeNode: this.state.chordList.length });
    this.setState({ isCalculated: false });
  };

  myChangeHandler = (event) => {
    this.setState({ chordsAsString: event.target.value });
  };

  setChord = (index, chordValue) => {
    console.log(index);
    this.setState((prevState) => {
      const newItems = [...prevState.chordList];
      newItems[index] = chordValue;
      console.log(newItems);

      return { chordList: newItems };
    });

    console.log(this.state);
    this.setState({ isCalculated: false });
  };

  getKeyByValue = (object, value, accidental) => {
    console.log(value);
    let found = Object.keys(object).filter((key) => object[key] === value);
    if (value > 71) {
      found = Object.keys(object).filter((key) => object[key] === value - 12);
    } else if (value < 60) {
      found = Object.keys(object).filter((key) => object[key] === value + 12);
    }
    // if (accidental === "" && found.length > 1) {
    //   found = found.find(n => n.includes("#"))
    // }
    if (found.length > 1) {
      found = found.join("/");
    }

    console.log(found);
    return found;
  };

  deleteChord = (index) => {
    console.log(index);
    this.setState((prevState) => {
      const newItems = this.state.chordList.filter((c, i) => i !== index);

      console.log(newItems);
      return { chordList: newItems };
    });

    console.log(this.state);
    this.setState({ isCalculated: false });
  };

  unsetActiveNode = () => {
    this.setState({ activeNode: undefined });
    this.setState({ isCalculated: false });
  };

  handleHover = (index) => {
    if (this.state.isCalculated) {
      this.onPlayChord(index);
    }
  };
  render() {
    return (
      <div style={{background: "rgb(233, 244, 233", padding: "25px"}}>
        <h1 className="h3">Chord Inversion Helper Demo</h1>
        <Directions></Directions>
        <div className="mt-5">
          <SoundfontProvider
            instrumentName="acoustic_grand_piano"
            audioContext={audioContext}
            hostname={soundfontHostname}
            render={({ isLoading, playNote, stopNote }) => (
              <PianoWithRecording
                recording={this.state.recording}
                isPlaying={this.state.isPlaying}
                setRecording={this.setRecording}
                noteRange={{ first: 53, last: 79 }}
                width={900}
                playNote={playNote}
                noteToPlay={60}
                stopNote={stopNote}
                disabled={isLoading}
              />
            )}
          />
        </div>
        <h4>{this.state.chordString}</h4>

        <AddNodes>
          <ChordNodeContainer>
            {this.state.chordList.map((c, i) => (
              <ChordNode
                onClick={() => {
                  this.setState({ activeNode: i });
                  this.setState({ isCalculated: false });
                }}
                onMouseOver={() => this.handleHover(i)}
                active={this.state.activeNode === i}
                key={i}
              >
                {c === undefined ? "" : c.includes("m") ? c[0] + c[1] : c[0]}
              </ChordNode>
            ))}
          </ChordNodeContainer>

          <AddChordButton onClick={this.onClickAddChordNode}>+</AddChordButton>
        </AddNodes>
        {this.state.activeNode !== undefined ? (
          <ChordPicker
            activeNode={this.state.activeNode}
            setChord={this.setChord}
            unsetActiveNode={this.unsetActiveNode}
            chordList={this.state.chordList}
            deleteChord={this.deleteChord}
          />
        ) : (
          ""
        )}

        <div className="mt-5" style={{marginTop: "20px"}}>
          <button
            disabled={
              this.state.isPlaying ||
              this.state.chordList.length < 2 ||
              this.state.chordList.includes(undefined)
            }
            onClick={!this.state.isPlaying ? this.onClickCalculate : undefined}
          >
            Calculate
          </button>
          <button
            disabled={this.state.isPlaying}
            onClick={!this.state.isPlaying ? this.onClickClear : undefined}
          >
            Clear
          </button>
          <button
            disabled={this.state.isPlaying || !this.state.isCalculated}
            onClick={!this.state.isPlaying ? this.onClickPlay : undefined}
          >
            Play
          </button>
          <button onClick={this.onClickStop}>Stop</button>
          {/* <button onClick={this.onClickClear}>Clear</button> */}
        </div>
      </div>
    );
  }
}

const AddChordButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  border: 1px solid black;
  background-color: lightgreen;
  line-height: 45px;
  text-align: center;
  font-size: 32px;
  margin: 5px;
`;

const ChordNodeContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const AddNodes = styled.div`
  display: flex;
  flex-direction: row;
`;

const ChordNode = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  border: 1px solid black;
  background-color: lightblue;
  line-height: 50px;
  text-align: center;
  font-size: 12px;
  margin: 5px;
  background-color: ${(props) => props.active && "green"};
`;

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
        return "#"
      } else if (["E", "B"].includes(chordRoot) && v === "#") {

        return "b"
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
              props.activeNode == 0
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

const Directions = () => {
  return (
    <div>
      <p>
        This app is designed to help you find the best chord inversions to use
        for a chord progression on the piano. Your chord progressions will sound
        smoother and will be easier to play compared to only using root position
        chords.
      </p>
      <h2>Directions</h2>
      <ol>
        <li>
          Begin by adding a starting chord with the circular button with a "+"
          sign.
        </li>
        <li>
          Select the chord's root, if it's sharp or flat, quaility (major or
          minor for now), and position (root, first, or second inversion).
        </li>
        <li>
          After this chord is added, you can the rest of the chord's in the
          progression one by one. You will only be selecting the root, if it's
          sharp or flat, and the qauilty of the chord for every chord except the
          first.{" "}
        </li>
        <li>
          Once you have at least two chords set and no chord nodes are empty,
          you can click the calculate button.
        </li>
        <li>
          If the chord inversions have been calculated, you will see the "play"
          button active. Press this button to play your chord progression with
          the best chord inversions!
        </li>
        <li>
          With the calculated progression, you can also hover over a chord's
          node to have that indivicudal chord playback for you on the piano.
        </li>
        <li>
          You can edit a chord node at any time, as well as delete all but the
          first chord by clicking the chord node and selecting the "delete"
          button.
        </li>
        <li>
          Note that any changes to the chord progression will need to be
          recalulated before you can play back the progression or an individual
          chord.
        </li>
        <li>
          You can clear your chord progression at any time using the "clear"
          button.
        </li>
      </ol>
    </div>
  );
};

export default App;
