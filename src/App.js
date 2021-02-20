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

// class App extends React.Component {
//   state = {
//     isPlaying: false,
//     recording: {
//       events: [],
//       currentEvents: [],
//     },
//     chordList: [],
//     activeNode: undefined,
//     recordingAsNotes: [],
//     isCalculated: false,
//     chordString: "",
//     activePlayingNode: undefined,
//     isLooped: true
//   };

//   scheduledEvents = [];

//   getRecordingEndTime = () => {
//     if (this.state.recording.events.length === 0) {
//       return 0;
//     }
//     return Math.max(
//       ...this.state.recording.events.map((event) => event.time + event.duration)
//     );
//   };

//   setRecording = (value) => {
//     this.setState({
//       recording: Object.assign({}, this.state.recording, value),
//     });
//   };

//   onClickCalculate = () => {
//     this.setState({ chordString: "" });
//     console.log(this.state.chordList);
//     if (this.state.chordList.length < 2) {
//       return;
//     }
//     let events = processChordChain(
//       chordChain(this.state.chordList[0], this.state.chordList.slice(1))
//     );
//     this.setRecording({
//       events: events[0],
//     });
//     this.setState({ recordingAsNotes: events[1] });
//     this.setState({ isCalculated: true });
//   };

//   onClickPlay = () => {
//     this.setState({ isPlaying: true });

//     console.log(this.state);
//     const startAndEndTimes = _.uniq(
//       _.flatMap(this.state.recording.events, (event) => [
//         event.time,
//         event.time + event.duration,
//       ])
//     );

//     let count = 0;
//     console.log(startAndEndTimes);
//     startAndEndTimes.forEach((time) => {
//       this.scheduledEvents.push(
//         setTimeout(() => {
//           const currentEvents = this.state.recording.events.filter(
//             (event) => {
//               if (event.time <= time && event.time + event.duration > time) {
//                 count = event.group;
//                 this.setState({activePlayingNode: count})
//                 return event.time <= time && event.time + event.duration > time;
//               }
//             }
//           );

//           this.setRecording({
//             currentEvents,
//           });
//           this.convertMIDIToChordLetters(
//             this.state.chordList[count],
//             this.state.recordingAsNotes[count]
//           );
//         }, time * 1000)
//       );
//     });

//     // Stop at the end
//     console.log(this.state);
//     setTimeout(() => {
//       this.onClickStop();
//       this.setState({ chordString: "" });
//     }, this.getRecordingEndTime() * 1000);
//   };

//   onPlayChord = (index) => {
//     if (this.state.isPlaying) {
//       return;
//     }
//     this.setState({ isPlaying: true });

//     let chordIwant = this.state.recordingAsNotes[index];
//     let chordName = this.state.chordList[index];

//     let currentEvents = chordIwant.map((n) => {
//       return { midiNumber: n, time: "", duration: "" };
//     });

//     this.setRecording({
//       currentEvents,
//     });

//     this.convertMIDIToChordLetters(chordName, chordIwant);

//     setTimeout(() => {
//       this.onClickStop();
//     }, 1 * 2000);
//   };

//   convertMIDIToChordLetters = (chordFromList, chordIwant) => {
//     let accidental = "";
//     let quality = chordFromList[1]
//     if (chordFromList[0].length > 1) {
//       accidental = chordFromList[0].split("")[1];
//     }

//     let asNotes = chordIwant.map((n) => {
//       return this.getKeyByValue(notes, n, quality, accidental);
//     });

//     console.log(asNotes);
//     let str = asNotes.join(" - ");

//     let chordS = chordFromList[0] + chordFromList[1] + ": " + str;
//     if (chordFromList.includes("M")) {
//       chordS = chordFromList[0] + ": " + str;
//     }

//     this.setState({ chordString: chordS });
//   };

//   onClickStop = () => {
//     this.scheduledEvents.forEach((scheduledEvent) => {
//       clearTimeout(scheduledEvent);
//     });
//     this.setState({ isPlaying: false });
//     this.setState({activePlayingNode: undefined})
//     this.setRecording({
//       mode: "RECORDING",
//       currentEvents: [],
//     });
//   };

//   onClickClear = () => {
//     this.onClickStop();
//     this.setState({ chordString: "" });
//     this.setState({ chordList: [] });
//     this.setRecording({
//       events: [],
//       currentEvents: [],
//     });
//     this.setState({ isCalculated: false });
//   };

//   onClickAddChordNode = () => {
//     this.setState({
//       chordList: [...this.state.chordList, undefined],
//     });
//     this.setState({ activeNode: this.state.chordList.length });
//     this.setState({ isCalculated: false });
//   };

//   setChord = (index, chordValue) => {
//     console.log(index);
//     this.setState((prevState) => {
//       const newItems = [...prevState.chordList];
//       newItems[index] = chordValue;
//       console.log(newItems);

//       return { chordList: newItems };
//     });

//     console.log(this.state);
//     this.onClickCalculate()
//     this.setState({ isCalculated: false });
//   };

//   getKeyByValue = (object, value, quality, accidental) => {
//     console.log(value);
//     let found = Object.keys(object).filter((key) => object[key] === value);
//     if (value > 71) {
//       found = Object.keys(object).filter((key) => object[key] === value - 12);
//     } else if (value < 60) {
//       found = Object.keys(object).filter((key) => object[key] === value + 12);
//     }
//     if (accidental === "" && found.length > 1 && quality === "m") {
//       found = found.find(n => n.includes("b"))
//     } else if (accidental === "" && found.length > 1) {
//       found = found.find(n => n.includes("#"))
//     } else if (accidental === "#" && found.length > 1) {
//       found = found.find(n => n.includes("#"))
//     } else if (accidental === "b" && found.length > 1) {
//       found = found.find(n => n.includes("b"))
//     }
//     // if (found.length > 1) {
//     //   found = found.join("/");
//     // }

//     console.log(found);
//     return found;
//   };

//   deleteChord = (index) => {
//     console.log(index);
//     this.setState((prevState) => {
//       const newItems = this.state.chordList.filter((c, i) => i !== index);

//       console.log(newItems);
//       return { chordList: newItems };
//     });

//     console.log(this.state);
//     this.setState({ isCalculated: false });
//   };

//   unsetActiveNode = () => {
//     this.setState({ activeNode: undefined });
//     this.setState({ isCalculated: false });
//   };

//   handleHover = (index) => {
//     if (this.state.isCalculated) {
//       this.onPlayChord(index);
//     }
//   };
//   componentDidMount() {
//     document.body.style.backgroundColor = "rgb(0, 244, 233"
// }

//   render() {
//     return (
//       <div style={{height: "100%", background: "rgb(0, 244, 233", padding: "25px"}}>
//         <h1 className="h3">Chord Inversion Helper Demo</h1>
//         <Directions></Directions>
//         <div className="mt-5">
//           <SoundfontProvider
//             instrumentName="acoustic_grand_piano"
//             audioContext={audioContext}
//             hostname={soundfontHostname}
//             render={({ isLoading, playNote, stopNote }) => (
//               <PianoWithRecording
//                 recording={this.state.recording}
//                 isPlaying={this.state.isPlaying}
//                 setRecording={this.setRecording}
//                 noteRange={{ first: 53, last: 79 }}
//                 width={900}
//                 playNote={playNote}
//                 noteToPlay={60}
//                 stopNote={stopNote}
//                 disabled={isLoading}
//               />
//             )}
//           />
//         </div>
//         <h4>{this.state.chordString}</h4>

//         <AddNodes>
//           <ChordNodeContainer>
//             {this.state.chordList.map((c, i) => (
//               <ChordNode
//                 onClick={() => {
//                   this.setState({ activeNode: i });
//                   this.setState({ isCalculated: false });
//                 }}
//                 onMouseOver={() => this.handleHover(i)}
//                 active={this.state.activeNode === i}
//                 playing={this.state.activePlayingNode === i}
//                 key={i}
//               >
//                 {c === undefined ? "" : c.includes("m") ? c[0] + c[1] : c[0]}
//               </ChordNode>

//             ))}
//           </ChordNodeContainer>

//           <AddChordButton onClick={this.onClickAddChordNode}>+</AddChordButton>
//         </AddNodes>
//         {this.state.activeNode !== undefined ? (
//           <ChordPicker
//             activeNode={this.state.activeNode}
//             setChord={this.setChord}
//             unsetActiveNode={this.unsetActiveNode}
//             chordList={this.state.chordList}
//             deleteChord={this.deleteChord}
//           />
//         ) : (
//           ""
//         )}

//         <div className="mt-5" style={{marginTop: "20px"}}>
//           <button
//             disabled={
//               this.state.isPlaying ||
//               this.state.chordList.length < 2 ||
//               this.state.chordList.includes(undefined)
//             }
//             onClick={!this.state.isPlaying ? this.onClickCalculate : undefined}
//           >
//             Calculate
//           </button>
//           <button
//             disabled={this.state.isPlaying}
//             onClick={!this.state.isPlaying ? this.onClickClear : undefined}
//           >
//             Clear
//           </button>
//           <button
//             disabled={this.state.isPlaying || !this.state.isCalculated}
//             onClick={!this.state.isPlaying ? this.onClickPlay : undefined}
//           >
//             Play
//           </button>
//           <button onClick={this.onClickStop}>Stop</button>
//           {/* <button onClick={this.onClickClear}>Clear</button> */}
//         </div>
//       </div>
//     );
//   }
// }

const AddChordButton = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  border: 1px solid black;
  background-color: lightgreen;
  line-height: 45px;
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
  width: 50px;
  height: 50px;
  border-radius: 100%;
  border: 1px solid white;
  background-color: lightblue;
  color: white;
  line-height: 50px;
  text-align: center;
  font-size: 18px;
  margin-right: 20px;
  background-color: ${(props) => props.active && "#C0C0C0"};
  background-color: ${(props) => props.playing && "yellow"};
  color: ${(props) => props.playing && "black"};

  cursor: pointer;

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

const App2 = () => {
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
    if (isPlaying || activeNode !== undefined) {
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
              noteRange={{ first: 53, last: 77 }}
              width={1400}
              playNote={playNote}
              noteToPlay={60}
              stopNote={stopNote}
              disabled={isLoading}
            />
          )}
        />
      </div>
      <h4>{chordString === "" ? " " : chordString}</h4>
      <div style={{ margin: "0 auto", width: "50%" }}>
        <AddNodes>
          <ChordNodeContainer>
            {chordList.map((c, i) => (
              <ChordNode
                onClick={() => {
                  if (!isPlaying) {
                    setActiveNode(i);

                    setIsCalculated(false);
                  }
                }}
                onMouseOver={() => handleHover(i)}
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

export default App2;
