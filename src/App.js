// // import "./App.css";
// import chordList from "./chord-info/chordList";
// import React, { useState } from "react";
// // import { Dropdown } from "semantic-ui-react";
// import 'semantic-ui-css/semantic.min.css'
// import styled from "styled-components";
// import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
// import 'react-piano/dist/styles.css';
// import Dropdown from './dropdown';

import Picker from "react-scrollable-picker";
import SoundfontProvider from "./soundfontprovider";
import PropTypes from "prop-types";
// import Picker from 'react-mobile-picker';

// let chordTypes = [
//   {
//     key: "major",
//   },
//   {
//     key: "minor"
//   }
// ]
// let chords =
//   [
//     {key: "C",
//      modules: chordTypes
//     },
//     {
//       key: "C#",
//       modules: chordTypes
//     }
//   ]

// class Module extends React.Component {
//     constructor(props) {
//       super(props);
//       this.toggleHidden = this.toggleHidden.bind(this);
//       this.state = {
//         isHovered: false
//       }
//     }

//     toggleHidden () {
//       this.setState({
//         isHovered: !this.state.isHovered
//       })
//     }

//     render() {
//       const styles = {
//         'backgroundColor': this.props.lightColor,
//       }
//       if (this.state.isHovered) {
//         styles['backgroundColor'] = this.props.color;
//         styles['color'] = 'white';
//       }

//       return (
//         <div className='singleModule'
//              onMouseEnter={this.toggleHidden}
//              onMouseLeave={this.toggleHidden}
//              style={styles}>
//           {this.props.id}
//         </div>
//       )
//     }
//   }

//   class ModuleGroup extends React.Component {
//     constructor(props) {
//       super(props);
//       this.toggleHidden = this.toggleHidden.bind(this);
//       this.state = {
//         isVisible: false
//       }
//     }

//     toggleHidden () {
//       this.setState({
//         isVisible: !this.state.isVisible
//       })
//     }

//     render() {
//       // const lightBackgroundColor = ColorLuminance(this.props.color, 1.5);

//       // Only make bg color if on hover
//       const bgStyle = {
//       }
//       if (this.state.isVisible) {
//         // bgStyle['backgroundColor'] = lightBackgroundColor;
//         bgStyle['borderLeft'] = `5px solid ${this.props.color}`;
//       }

//       return (
//         <div className='moduleGroup'
//              onMouseEnter={this.toggleHidden}
//              onMouseLeave={this.toggleHidden}
//              style={bgStyle}>
//           <i className={`fa `} style={{color: this.props.color}}></i>
//           {this.props.id}

//           <div className={`modulesSet ${this.state.isVisible ? 'visible': ''}`}>
//             {this.props.modules.map(module => <Module
//                 key={module.key}
//                 id={module.key}
//                 // lightColor={lightBackgroundColor}
//                 // color={this.props.color}
//               />)}
//           </div>
//         </div>
//       )
//     }
//   }

//   class ModuleGroupSelector extends React.Component {
//     constructor(props) {
//       super(props);
//       this.toggleHidden = this.toggleHidden.bind(this);
//       this.state = {
//         isVisible: false
//       }
//     }

//     toggleHidden () {
//       this.setState({
//         isVisible: !this.state.isVisible
//       })
//     }

//     render() {
//       const moduleGroups = this.props.moduleGroups;
//       return (
//         <div className='analytics' onMouseEnter={this.toggleHidden} onMouseLeave={this.toggleHidden}>

//           <div className='topButton'>
//             Analytics Modules
//           </div>
//           <div className={`analyticsDropDown ${this.state.isVisible ? 'visible': ''}`}>
//             {moduleGroups.map(group => <ModuleGroup key={group.key} id={group.key} color={group.color} modules={group.modules} />)}
//           </div>
//         </div>
//       )
//     }
//   }

//   class Menu extends React.Component {
//     render() {
//       const availableModules = this.props.availableModules;
//       return (
//         <div className='navbar'>

//           <div className='logo'>
//             PlanningTool
//           </div>

//           <ModuleGroupSelector moduleGroups={chords} />
//         </div>
//       )
//     }
//   }

// const MainHouse = styled.div`
//   border-radius: 90px;
//   border: 2px solid blue;
//   width: 60px;
//   margin: auto;
//   text-align: center;
//   line-height: 55px;
//   height: 60px;
//   font-size: 30px;
//   animation-duration: 2s;

//   &:hover {
//     border: 2px solid green;
//   }
// `;

// const KeyBoardContainer = styled.div`
//   height: 200px;
//   text-align: center;
// `;

// const House = styled.div`
//   display: flex;
// `;

// // const DropdownExampleSelection = () => (
// //   <Dropdown fluid selection options={chordList} />
// // );

// function App() {
//   const [correctChords, setCorrectChords] = useState([]);

//   function handleSettingChords(chordArray) {
//     setCorrectChords(chordArray);
//   }

//   const firstNote = MidiNumbers.fromNote('f3');
//   const lastNote = MidiNumbers.fromNote('f5');
//   const keyboardShortcuts = KeyboardShortcuts.create({
//     firstNote: firstNote,
//     lastNote: lastNote,
//     keyboardConfig: KeyboardShortcuts.HOME_ROW,
//   });

//   return (
//     <div className="App">
//       <header className="App-header">
//         <p>Chord Inversion Calculator</p>
//         {/* <Piano
//       noteRange={{ first: firstNote, last: lastNote }}
//       playNote={(midiNumber) => {
//         return 64
//       }}
//       stopNote={(midiNumber) => {
//         // Stop playing a given note - see notes below
//       }}
//       width={700}
//       keyboardShortcuts={keyboardShortcuts}
//     /> */}
//         <Selector onChange={handleSettingChords} />
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// function Selector(props) {
//   const [show1, setState1] = useState(false);
//   const [show2, setState2] = useState(false);
//   const [show3, setState3] = useState(false);
//   const [show4, setState4] = useState(false);
//   const [chords, setTheArray] = useState(["", "", "", ""]);

//   let handleSelectChange = (e, { value }) => {
//     console.log(value);
//     /* this.setState({stateValue:value}) */
//   };

//   let checkForCommonTones = (chord_1, chord_2) => {
//     let commonTone = false;

//     chord_1.asLetters.forEach(tone => {
//       if (!commonTone) {
//         if (chord_2.asLetters.includes(tone)) {
//           commonTone = true;
//         }
//       }
//       return commonTone;
//     });
//   };

//   let transposeDown = chord => {
//     let newChord = {};
//     newChord.name = chord.name;
//     newChord.position = chord.position;
//     newChord.notes = chord.notes.map(nt => {
//       return nt - 12;
//     });
//     return newChord;
//   };

//   let transposeUp = chord => {
//     let newChord = {};
//     newChord.name = chord.name;
//     newChord.position = chord.position;
//     newChord.notes = chord.notes.map(nt => {
//       return nt + 12;
//     });
//     return newChord;
//   };

//   let getCommonTonesAndIndexes = (chord_1, chord_2) => {
//     let firstCommonTone = "";
//     let index;
//     let chordName = chord_2.name;
//     let transposeDownChord = transposeDown(chord_2);
//     let transposeUpChord = transposeUp(chord_2);
//     console.log(chord_1, chord_2);

//     chord_1.notes.forEach(tone => {
//       if (firstCommonTone === "") {
//         if (chord_2.notes.includes(tone)) {
//           firstCommonTone = tone;
//           index = chord_1.notes.indexOf(tone);
//         }
//       }
//     });
//     chord_1.notes.forEach(tone => {
//       if (firstCommonTone === "") {
//         if (transposeDownChord.notes.includes(tone)) {
//           firstCommonTone = tone;
//           index = chord_1.notes.indexOf(tone);
//         }
//       }
//     });

//     chord_1.notes.forEach(tone => {
//       if (firstCommonTone === "") {
//         if (transposeUpChord.notes.includes(tone)) {
//           firstCommonTone = tone;
//           index = chord_1.notes.indexOf(tone);
//         }
//       }
//     });

//     return { firstCommonTone, index, chordName };
//   };

//   let findCorrectChord = (input, chordList) => {
//     console.log(input);
//     const result = chordList.find(chord => {
//       let transposedChordDown = transposeDown(chord);
//       // console.log(chord.notes[input.index]);
//       let res =
//         chord.name === input.chordName &&
//         chord.notes[input.index] === input.firstCommonTone;

//       if (!res) {
//         res =
//           transposedChordDown.name === input.chordName &&
//           transposedChordDown.notes[input.index] === input.firstCommonTone;
//         if (res) {
//           return transposedChordDown;
//         }
//       }
//       return res;
//     });
//     return result;
//   };

//   // let findCorrectChord = (input, chordList) => {
//   //   console.log(input);
//   //   const result = chordList.find(chord => {
//   //     let transposedChordDown = transposeDown(chord)
//   //     // console.log(chord.notes[input.index]);
//   //     return (
//   //       chord.name === input.chordName &&
//   //       chord.notes[input.index] === input.firstCommonTone
//   //     );
//   //   });
//   //   return result;

//   // };

//   function handleSet(e) {
//     props.onChange(e);
//   }

//   let evaluate = () => {
//     let correctChord = false;
//     let finalChordArray = [chords[0]];

//     for (let i = 0; i < chords.length - 1; i++) {
//       // console.log(chords[i], chords[i + 1]);
//       if (correctChord) {
//         console.log("there");
//         let check = checkForCommonTones(correctChord, chords[i + 1]);
//         // if (!check) {
//         //   check = checkForCommonTones(correctChord, transposeDown(chords[i+1]))
//         // }
//         if (check) {
//           let res = getCommonTonesAndIndexes(correctChord, chords[i + 1]);
//           console.log(res);
//           correctChord = findCorrectChord(res, chordList);
//           console.log(correctChord);
//           finalChordArray.push(correctChord);
//         }
//       } else {
//         let check = checkForCommonTones(chords[i], chords[i + 1]);
//         console.log(check, chords[i], chords[i + 1]);
//         // if (!check) {
//         //   check = checkForCommonTones(correctChord, transposeDown(chords[i+1]))
//         // }
//         if (check) {
//           let res = getCommonTonesAndIndexes(chords[i], chords[i + 1]);
//           console.log(res);
//           correctChord = findCorrectChord(res, chordList);
//           console.log(correctChord, "YOOOO");
//           // if (correctChord[0] >= finalChordArray[i].notes[0]) {
//           //   correctChord = transposeDown(correctChord)
//           // }
//           // finalChordArray.push(correctChord)
//         }
//       }
//     }
//     console.log(finalChordArray);
//     handleSet(finalChordArray);
//   };

//   return (
//     <House>
//       <MainHouse onClick={() => setState4(!show4)}>
//         +
//         {show4
//           ? chordList.map(chord => {
//               return (
//                 <button
//                   onClick={() => {
//                     const newArray = Array.from(chords);
//                     newArray[0] = chord;
//                     setTheArray(newArray);
//                   }}
//                 >
//                   {chord.name}
//                 </button>
//               );
//             })
//           : ""}
//         {/* <button> Menu item 1 </button>
//                 <button> Menu item 2 </button>
//                 <button onClick={handleClick2}> Menu item 3 </button> */}
//       </MainHouse>

//       <MainHouse onClick={() => setState1(!show1)}>
//         +
//         {show1
//           ? chordList.map(chord => {
//               return (
//                 <button
//                   onClick={() => {
//                     const newArray = Array.from(chords);
//                     newArray[1] = chord;
//                     setTheArray(newArray);
//                   }}
//                 >
//                   {chord.name}
//                 </button>
//               );
//             })
//           : ""}
//       </MainHouse>
//       <MainHouse onClick={() => setState2(!show2)}>
//         +
//         {show2
//           ? chordList.map(chord => {
//               return (
//                 <button
//                   onClick={() => {
//                     const newArray = Array.from(chords);
//                     newArray[2] = chord;
//                     setTheArray(newArray);
//                   }}
//                 >
//                   {chord.name}
//                 </button>
//               );
//             })
//           : ""}
//       </MainHouse>
//       <MainHouse onClick={() => setState3(!show3)}>
//         +
//         {show3
//           ? chordList.map(chord => {
//               return (
//                 <button
//                   onClick={() => {
//                     const newArray = Array.from(chords);
//                     newArray[3] = chord;
//                     setTheArray(newArray);
//                   }}
//                 >
//                   {chord.name}
//                 </button>

//               );
//             })
//           : ""}
//       </MainHouse>
//       {/* <Dropdown/> */}
//       <button onClick={evaluate}>evaluate</button>

//     </House>
//       // <Menu/>
//     );
// }

import React, { useState } from "react";

import _ from "lodash";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
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

let transFormKeyMajRoot = {
  "1-M": [0],
  "1-m": [0],
  "2-M": [0, 2],
  "2-m": [0],
  "3-M": [2],
  "3-m": [2],
  "4-M": [2],
  "4-m": [2],
  "5-M": [2],
  "5-m": [2],
  "6-M": [1, 2],
  "6-m": [2],
  "7-M": [1],
  "7-m": [1],
  "8-M": [1],
  "8-m": [1],
  "9-M": [1],
  "9-m": [1],
  "10-M": [0, 1],
  "10-m": [1],
  "11-M": [0],
  "11-m": [0],
};

let createMajorChord = (MIDINumber) => {
  return [MIDINumber, MIDINumber + 4, MIDINumber + 7];
};

let createMinorChord = (MIDINumber) => {
  return [MIDINumber, MIDINumber + 3, MIDINumber + 7];
};

let createChord = (MIDINumber, quality) => {
  if (quality === "M") {
    return [MIDINumber, MIDINumber + 4, MIDINumber + 7];
  } else {
    return [MIDINumber, MIDINumber + 3, MIDINumber + 7];
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
  let currentChordRoot;
  let currentChordQuality;
  let currentChordPosition;
  [
    currentChordRoot,
    currentChordQuality,
    currentChordPosition,
  ] = currentChordWithPosition;
  let nextChordRoot;
  let nextChordQuality;
  [nextChordRoot, nextChordQuality] = nextChord;

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
  let duration = 0.9;
  let current = 0;
  let neww = [];
  cChain.forEach((c) => {
    c.forEach((n) => {
      neww.push({ midiNumber: n, time: current, duration: duration });
    });
    current += 1;
  });
  return neww;
};

class App extends React.Component {
  state = {
    recording: {
      mode: "RECORDING",
      events: getStuff(
        chordChain(
          ["C", "M", 0],
          [
            ["A", "m"],
            ["E", "M"],
            ["F", "M"],
            ["G", "M"]
          ]
        )
      ),
      currentEvents: [],
    },
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

  onClickPlay = () => {
    this.setRecording({
      mode: "PLAYING",
    });
    console.log(this.state);
    const startAndEndTimes = _.uniq(
      _.flatMap(this.state.recording.events, (event) => [
        event.time,
        event.time + event.duration,
      ])
    );
    console.log(startAndEndTimes);
    startAndEndTimes.forEach((time) => {
      this.scheduledEvents.push(
        setTimeout(() => {
          const currentEvents = this.state.recording.events.filter((event) => {
            return event.time <= time && event.time + event.duration > time;
          });
          this.setRecording({
            currentEvents,
          });
        }, time * 1000)
      );
    });
    // Stop at the end
    console.log(this.state);
    setTimeout(() => {
      this.onClickStop();
    }, this.getRecordingEndTime() * 1000);
  };

  onClickStop = () => {
    this.scheduledEvents.forEach((scheduledEvent) => {
      clearTimeout(scheduledEvent);
    });
    this.setRecording({
      mode: "RECORDING",
      currentEvents: [],
    });
  };

  onClickClear = () => {
    this.onClickStop();
    this.setRecording({
      events: [],
      mode: "RECORDING",
      currentEvents: [],
    });
  };

  render() {
    return (
      <div style={{ overflow: "hidden" }}>
        <h1 className="h3">Chord Inversion Helper Demo</h1>
        <div className="mt-5">
          <SoundfontProvider
            instrumentName="acoustic_grand_piano"
            audioContext={audioContext}
            hostname={soundfontHostname}
            render={({ isLoading, playNote, stopNote }) => (
              <PianoWithRecording
                recording={this.state.recording}
                setRecording={this.setRecording}
                noteRange={{ first: 59, last: 79 }}
                width={900}
                playNote={playNote}
                stopNote={stopNote}
                disabled={isLoading}
              />
            )}
          />
        </div>
        <div className="mt-5">
          <button disabled={this.state.recording.mode === "PLAYING"} onClick={this.state.recording.mode !== "PLAYING" && this.onClickPlay}>Play</button>
          {/* <button onClick={this.onClickStop}>Stop</button>
          <button onClick={this.onClickClear}>Clear</button> */}
        </div>

        <div className="mt-5">
          <strong>Recorded notes</strong>
          <div>{JSON.stringify(this.state.recording.events)}</div>
        </div>
      </div>
    );
  }
}



export default App;
