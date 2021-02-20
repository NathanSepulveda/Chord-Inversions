import styled from "styled-components";
import SoundfontProvider from "./soundfontprovider";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import "react-piano/dist/styles.css";
import PianoWithRecording from "./PianoWithRecording";
import processChordChain, { chordChain } from "./chord-info/ChordChain";
import { notes } from "./chord-info/ChordStepKeys";
import Directions from "./Directions";
import ChordPicker from "./ChordPicker";


// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";


const AddChordButton = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 100%;
  border: 1px solid black;
  background-color: lightgreen;
  line-height: 50px;
  text-align: center;
  font-size: 32px;
  margin-right: 5px;
  /* cursor: pointer; */

  cursor: ${(props) => !props.disabled && "pointer"};
  opacity: ${(props) => props.disabled && 0.2};
`;

const ChordNodeContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

const AddNodes = styled.div`
  display: flex;
  flex-direction: row;
`;

const ChordNode = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 100%;
  border: 1px solid white;
  background-color: lightblue;
  color: white;
  line-height: 55px;
  text-align: center;
  font-size: 18px;
  margin-right: 20px;
  background-color: ${(props) => props.active && "#C0C0C0"};
  background-color: ${(props) => props.playing && "yellow"};
  color: ${(props) => props.playing && "black"};
  user-select: none;

  cursor: pointer;
  z-index: 1;

  /* &:after {
    content: '';
  flex: 1;
  padding-left: 2rem;
  height: 1px;
  background-color: #000;
  } */
`;

// const ChordNodes = props => {
//   return (
//     <AddNodes>
//     <ChordNodeContainer>
//       {chordList.map((c, i) => (
//         <ChordNode
//           onClick={() => {
//             setActiveNode(i)

//             setIsCalculated(false)

//           }}
//           onMouseOver={() => handleHover(i)}
//           active={activeNode === i}
//           playing={activePlayingNode === i}
//           key={i}
//         >
//           {c === undefined ? "" : c.includes("m") ? c[0] + c[1] : c[0]}
//         </ChordNode>

//       ))}
//     </ChordNodeContainer>

//     <AddChordButton onClick={onClickAddChordNode}>+</AddChordButton>
//   </AddNodes>
//   )
// }

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [recording, setRecording] = useState({
    events: [],
    currentEvents: [],
  });

  const [chordList, setChordList] = useState([]);
  const [activeNode, setActiveNode] = useState(undefined);
  const [recordingAsNotes, setRecordingAsNotes] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [chordString, setChordString] = useState("");
  const [activePlayingNode, setActivePlayingNode] = useState(undefined);
  const [isLooping, setIsLooping] = useState(false);

  let scheduledEvents = [];

  const getRecordingEndTime = () => {
    if (recording.events.length === 0) {
      return 0;
    }
    return Math.max(
      ...recording.events.map((event) => event.time + event.duration)
    );
  };

  const setRecordingHandler = (value) => {
    let newR = Object.assign({}, recording, value);
    setRecording(newR);
  };

  const onClickCalculate = () => {
    setChordString("");

    if (chordList.length < 2) {
      return;
    }

    if (chordList.includes(undefined)) {
      return;
    }
    let events = processChordChain(
      chordChain(chordList[0], chordList.slice(1))
    );
    setRecordingHandler({
      events: events[0],
    });

    setRecordingAsNotes(events[1]);

    setIsCalculated(true);
  };

  const onClickPlay = () => {
    setIsPlaying(true);
    unsetActiveNode();

    const startAndEndTimes = _.uniq(
      _.flatMap(recording.events, (event) => [
        event.time,
        event.time + event.duration,
      ])
    );

    let count = 0;
    console.log(startAndEndTimes);
    startAndEndTimes.forEach((time) => {
      scheduledEvents.push(
        setTimeout(() => {
          const currentEvents = recording.events.filter((event) => {
            if (event.time <= time && event.time + event.duration > time) {
              count = event.group;
              setActivePlayingNode(count);

              return event.time <= time && event.time + event.duration > time;
            }
          });

          setRecordingHandler({ currentEvents });
          convertMIDIToChordLetters(chordList[count], recordingAsNotes[count]);
        }, time * 1000)
      );
    });

    setTimeout(() => {
      onClickStop();
      setChordString("");
    }, getRecordingEndTime() * 1000);
  };

  const onPlayChord = (index) => {
    if (isPlaying) {
      return;
    }

    setIsPlaying(true);

    let chordIwant = recordingAsNotes[index];
    let chordName = chordList[index];

    if (chordIwant === undefined || chordName === undefined) {
      return;
    }

    let currentEvents = chordIwant.map((n) => {
      return { midiNumber: n, time: "", duration: "" };
    });

    setRecordingHandler({ currentEvents });
    setActivePlayingNode(index);
    convertMIDIToChordLetters(chordName, chordIwant);

    setTimeout(() => {
      onClickStop();
    }, 1 * 2000);
  };

  const convertMIDIToChordLetters = (chordFromList, chordIwant) => {
    let accidental = "";
    let quality = chordFromList[1];
    if (chordFromList[0].length > 1) {
      accidental = chordFromList[0].split("")[1];
    }

    let asNotes = chordIwant.map((n) => {
      return getKeyByValue(notes, n, quality, accidental);
    });

    console.log(asNotes);
    let str = asNotes.join(" - ");

    let chordS = chordFromList[0] + chordFromList[1] + ": " + str;
    if (chordFromList.includes("M")) {
      chordS = chordFromList[0] + ": " + str;
    }
    setChordString(chordS);
  };

  const onClickStop = () => {
    scheduledEvents.forEach((scheduledEvent) => {
      clearTimeout(scheduledEvent);
    });
    setIsPlaying(false);

    setActivePlayingNode(undefined);
    setRecordingHandler({
      mode: "RECORDING",
      currentEvents: [],
    });
  };

  const onClickClear = () => {
    onClickStop();
    setActiveNode(undefined);
    setChordString("");
    setChordList([]);
    // setChordString([])
    setRecordingHandler({
      events: [],
      currentEvents: [],
    });

    setIsCalculated(false);
  };

  const onClickAddChordNode = () => {
    if (!isPlaying) {
      setChordList([...chordList, undefined]);
      setActiveNode(chordList.length);

      setIsCalculated(false);
    }
  };

  const setChord = (index, chordValue) => {
    console.log(index);

    setChordList((prevState) => {
      const newItems = [...prevState];
      newItems[index] = chordValue;
      console.log(newItems);

      return newItems;
    });

    // setIsCalculated(false)
  };

  useEffect(() => {
    onClickCalculate();
  }, [chordList]);

  const getKeyByValue = (object, value, quality, accidental) => {
    console.log(value);
    let found = Object.keys(object).filter((key) => object[key] === value);
    if (value > 71) {
      found = Object.keys(object).filter((key) => object[key] === value - 12);
    } else if (value < 60) {
      found = Object.keys(object).filter((key) => object[key] === value + 12);
    }
    if (accidental === "" && found.length > 1 && quality === "m") {
      found = found.find((n) => n.includes("b"));
    } else if (accidental === "" && found.length > 1) {
      found = found.find((n) => n.includes("#"));
    } else if (accidental === "#" && found.length > 1) {
      found = found.find((n) => n.includes("#"));
    } else if (accidental === "b" && found.length > 1) {
      found = found.find((n) => n.includes("b"));
    }
    // if (found.length > 1) {
    //   found = found.join("/");
    // }

    console.log(found);
    return found;
  };

  const deleteChord = (index) => {
    console.log(index);
    // this.setState((prevState) => {
    //   const newItems = this.state.chordList.filter((c, i) => i !== index);

    //   console.log(newItems);
    //   return { chordList: newItems };
    // });

    setChordList((prevState) => {
      const newItems = chordList.filter((c, i) => i !== index);

      console.log(newItems);
      return newItems;
    });

    onClickCalculate();
    setIsCalculated(false);
  };

  const unsetActiveNode = () => {
    setActiveNode(undefined);
    setIsCalculated(false);
  };

  const handleHover = (index) => {
    // if (isCalculated) {
      // setActiveNode(undefined)
    onPlayChord(index);
    // }
  };


  useEffect(() => {
    document.body.style.backgroundColor = "#afd275";
  }, []);
  return (
    <div style={{ height: "100%", background: "#afd275", padding: "25px" }}>
      <h1 className="h3">Chord Inversion Helper Demo</h1>
      <Directions></Directions>
      <div className="mt-5">
        <SoundfontProvider
          instrumentName="acoustic_grand_piano"
          audioContext={audioContext}
          hostname={soundfontHostname}
          render={({ isLoading, playNote, stopNote }) => (
            <PianoWithRecording
              recording={recording}
              isPlaying={isPlaying}
              setRecording={setRecording}
              noteRange={{ first: 53, last: 79 }}
              // width={1300}
              playNote={playNote}
              noteToPlay={60}
              stopNote={stopNote}
              disabled={isLoading}
            />
          )}
        />
      </div>
      
      <div style={{ margin: "0 auto", width: "50%" }}>
      <h4 style={{marginTop: "25px"}} >{chordString === "" ? "Current Chord Notes: " : "Current Chord Notes: " + chordString}</h4>
        <AddNodes>
          <ChordNodeContainer>
            {chordList.map((c, i) => (
              <ChordNode
              onDoubleClick={() => {
                  if (!isPlaying) {
                    // setActiveNode(i);
                    onPlayChord(i)
                    setIsCalculated(false);
                  }
                }}
                onClick={() => {
                  setActiveNode(i);
                }}
                active={activeNode === i}
                playing={activePlayingNode === i}
                key={i}
              >
                {c === undefined ? "" : c.includes("m") ? c[0] + c[1] : c[0]}
              </ChordNode>
            ))}
          </ChordNodeContainer>

          <AddChordButton
            disabled={chordList.length > 7}
            onClick={chordList.length > 7 ? "" : onClickAddChordNode}
          >
            +
          </AddChordButton>
        </AddNodes>
        {activeNode !== undefined ? (
          <ChordPicker
            activeNode={activeNode}
            setChord={setChord}
            unsetActiveNode={unsetActiveNode}
            chordList={chordList}
            deleteChord={deleteChord}
          />
        ) : (
          ""
        )}

        <div className="mt-5" style={{ marginTop: "20px" }}>
          {/* <button
            disabled={
              isPlaying ||
              chordList.length < 2 ||
              chordList.includes(undefined)
            }
            onClick={!isPlaying ? onClickCalculate : undefined}
          >
            Calculate
          </button> */}
          <button disabled={isPlaying} onClick={onClickClear}>
            Clear
          </button>
          <button disabled={isPlaying} onClick={onClickPlay}>
            Play
          </button>
          <button onClick={onClickStop}>Stop</button>
        </div>
      </div>
    </div>
  );
};

export default App;
