import styled from "styled-components";
import SoundfontProvider from "./soundfontprovider";
import React, { useState, useEffect, useReducer } from "react";
import _ from "lodash";
// import "react-piano/dist/styles.css";
import "./react-piano-master/src/styles.css";
import PianoWithRecording from "./PianoWithRecording";
import processChordChain, { chordChain } from "./chord-info/ChordChain";
import { notes } from "./chord-info/ChordStepKeys";
import Directions, { Link } from "./Directions";
import ChordPicker from "./ChordPicker";
import BottomControlls from "./footer";
import { useCookies } from "react-cookie";
import useSound from "use-sound";
import Modal from "react-modal";
import click from "./soft_button.mp3";
import ColorPicker from "./ColorPicker";
import keyboard from "./keyboard.mp3";
import Emoji from "./emoji";
import AddChord from "./AddChord";
import ChordNodes from "./ChordNodes";
import "react-toggle/style.css";
import EmailModal from "./emailcapture";
import LogRocket from "logrocket";
// import Tour from "reactour";

import JoyRide from "react-joyride";
// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";

const steps = [
  {
    target: ".addChord",
    content: "Click the plus button to add your first chord of the progression",
  },
  {
    target: ".chordSelections",
    content:
      "Click the chord root, if it is sharp or flat, major or minor, and the position (if you need to).",
  },
  {
    target: ".addChord",
    content: "Add another chord!",
  },
  {
    target: ".chordSelections",
    content:
      "Go through the same process, just note you can't choose the inversion because the app will figure out the best one for you! You can add up to 8 chords in a progression. Try adding a few more before going to the next step!",
  },
  {
    target: ".play-button",
    content:
      "Press play to see and hear your chords with the best chord inversions!",
  },
  {
    target: ".speed",
    content:
      "Change the speed of the playback if you want it slower or faster.",
  },
  {
    target: ".chord-nodes",
    content: "Double click one chord to hold that chord's position.",
  },

  // ...
];

const NodeAndChordContainter = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 400px;
`;

const Speaker = styled.div`
  position: relative;
  font-size: 18px;
  margin-top: 10px;
  user-select: none;

  @media (max-width: 410px) {
    font-size: 14.5px;
    margin-top: 8px;
  }
`;

const ChordNodeContainer = styled.div`
  /* display: flex; */
  display: grid;
  /* flex-direction: row; */
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 20px;
  grid-gap: 15px;
`;

const AddNodes = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 25px;
`;

// }

const speeds = [
  { label: "🐢", time: 3.3 },
  { label: "🐇", time: 1.7 },
  { label: "🐆", time: 1.0 },
];

let scheduledEvents = [];
let playbackTimeID = null;

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [recording, setRecording] = useState({
    events: [],
    currentEvents: [],
  });
  const [play] = useSound(click);
  const [playClicks] = useSound(keyboard);
  const [chordList, setChordList] = useState([]);
  const [activeNode, setActiveNode] = useState(undefined);
  const [recordingAsNotes, setRecordingAsNotes] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [chordString, setChordString] = useState("");
  const [activePlayingNode, setActivePlayingNode] = useState(undefined);
  const [isLooping, setIsLooping] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [currentColor, setColor] = useState("#add8e6");
  const [cookies, setCookie] = useCookies();
  const [allowSound, setAllowSound] = useState(false);

  const [formIsSent, setFormIsSent] = useState(false);
  const [step, setCurrentStep] = useState(0);
  // const [, setHacky]
  const [helpIsOpen, setHelpIsOpen] = useState(false);

  // const [formData, setFormData] = useReducer(formReducer, {});

  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [popUpHasBeenSeen, setPopUpHasBeenSeen] = useState(false);

  const [hasBeenPlayed, setHasBeenPlayed] = useState(false);

  // const [isValidEmail, setIsValidEmail] = useState(true);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [showMusicalTyping, setShowMusicalTyping] = useState(false);
  const [accidentalType, setNoteAccidentalType] = useState(0);

  function openModal() {
    setIsOpen(true);
  }


  const handleTutorialOpen = () => {
    if (helpIsOpen) {
      setHelpIsOpen(false)
      setCurrentStep(0)
      
    } else {
      setHelpIsOpen(true)
      onClickClear()
    }
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleSetSpeeds = () => {
    if (speedIndex !== 2) {
      setSpeedIndex((prevState) => prevState + 1);
    } else {
      setSpeedIndex(0);
    }
  };

  useEffect(() => {
    onClickCalculate();
  }, [speedIndex]);

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
    // setChordString("");

    if (chordList.length < 1) {
      return;
    }


    if (chordList.includes(undefined) || chordList == []) {
      return;
    }
    let events = processChordChain(
      chordChain(chordList[0], chordList.slice(1)),
      speeds[speedIndex].time
    );
    setRecordingHandler({
      events: events[0],
    });

    setRecordingAsNotes(events[1]);
  };

  const onClickPlay = () => {
    setIsPlaying(true);
    unsetActiveNode();
    setShowMusicalTyping(false);

    const startAndEndTimes = _.uniq(
      _.flatMap(recording.events, (event) => [
        event.time,
        event.time + event.duration,
      ])
    );

    let currentChordIndex = 0;

    startAndEndTimes.forEach((time) => {
      scheduledEvents.push(
        setTimeout(() => {
          const currentEvents = recording.events.filter((event) => {
            if (event.time <= time && event.time + event.duration > time) {
              currentChordIndex = event.group;
              setActivePlayingNode(currentChordIndex);
              getAccidentalType(chordList[currentChordIndex][0]);

              return event.time <= time && event.time + event.duration > time;
            }
          });

          setRecordingHandler({ currentEvents });
          convertMIDIToChordLetters(
            chordList[currentChordIndex],
            recordingAsNotes[currentChordIndex]
          );
        }, time * 1000)
      );
    });

    playbackTimeID = setTimeout(() => {
      onClickStop();
      if (step === 4 && helpIsOpen) {
        setCurrentStep(5)

      }
      setHasBeenPlayed(true);
      setChordString("");
    }, getRecordingEndTime() * 1000);
  };

  const getAccidentalType = (note, quality) => {
    let sharps = ["C#", "D", "D#", "E", "F#", "G#", "A", "A#", "B"];

    if (sharps.includes(note)) {
      setNoteAccidentalType(0);
    } else {
      setNoteAccidentalType(1);
    }
  };

  const onPlayChord = (index) => {
    setIsPlaying(true);
    setShowMusicalTyping(false);
    let chordIwant = recordingAsNotes[index];
    let chordName = chordList[index];

    console.log(recordingAsNotes, chordList);

    if (chordIwant === undefined || chordName === undefined) {
      setIsPlaying(false);
      return;
    }

    let currentEvents = chordIwant.map((n) => {
      return { midiNumber: n, time: "", duration: "" };
    });

    setRecordingHandler({ currentEvents });
    setActivePlayingNode(index);
    getAccidentalType(chordList[index][0], chordList[index][1]);
    convertMIDIToChordLetters(chordName, chordIwant);
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


    let str = asNotes.join(" - ");

    let chordS = str;
    if (chordFromList.includes("M")) {
      chordS = str;
    }
    setChordString(chordS);
  };

  const onClickStop = () => {
    // var id = window.setTimeout(function () {}, 0);

    // while (id--) {
    //   window.clearTimeout(id); // will do nothing if no timeout with id is present
    // }

    scheduledEvents.forEach((scheduledEvent) => {

      clearTimeout(scheduledEvent);
    });
    setIsPlaying(false);
    clearTimeout(playbackTimeID);
    scheduledEvents = [];

    setActivePlayingNode(undefined);
    setRecordingHandler({
      mode: "RECORDING",
      currentEvents: [],
    });
  };

  const handlesTourCallback = (s) => {
    console.log(s);
    setCurrentStep(s.index);
    // if (s.index === 0) {

    // }
    if (s.index === 6 && s.lifecycle === "complete") {
      setHelpIsOpen(false)
      setCurrentStep(0)
    }
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
  };

  const onClickAddChordNode = () => {
    onClickStop();
    // if (!isPlaying) {
    setChordList([...chordList, undefined]);
    setActiveNode(chordList.length);

    // }
  };

  const setChord = (index, chordValue) => {

    onClickStop();
    setChordList((prevState) => {
      const newItems = [...prevState];
      newItems[index] = chordValue;


      return newItems;
    });
  };

  useEffect(() => {
    onClickCalculate();
  }, [chordList]);

  const getKeyByValue = (object, value, quality, accidental) => {

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


    return found;
  };

  const deleteChord = (index) => {
    console.log(index);
    onClickStop();

    setChordList((prevState) => {
      const newItems = chordList.filter((c, i) => i !== index);

      console.log(newItems);
      return newItems;
    });

    onClickCalculate();
    setActiveNode(index - 1);
  };

  const unsetActiveNode = () => {
    setActiveNode(undefined);
  };

  useEffect(() => {
    LogRocket.init("lrd9dg/chordinversions");
    if (cookies.hasSubscribed) {
      setHasSubscribed(cookies.hasSubscribed);
    } else {
      setCookie("hasSubscribed", false, { path: "/" });
    }

    if (!cookies.pageVisit) {
      setCookie("pageVisit", 1, { path: "/" });
    } else {
      let current = Number(cookies.pageVisit);
      setCookie("pageVisit", current + 1, { path: "/" });
    }
  }, []);

  useEffect(() => {

    // setCookie("hasSubscribed", false, { path: "/" });
    if (!isPlaying && hasBeenPlayed) {
      let pageVisits = Number(cookies.pageVisit);

      if (pageVisits % 4 == 0 || pageVisits == 1) {
        if (cookies.hasSubscribed == "false") {
          setTimeout(() => {
            setIsOpen(true);
          }, 1200);
        }
      }
    }
  }, [hasBeenPlayed]);

  const handleOnChangeMusicalTyping = (e) => {
    console.log(e.target.checked);
    setShowMusicalTyping(e.target.checked);
    onClickStop();
    if (allowSound && e.target.checked) {
      playClicks();
    }
  };

  return (
    <React.Fragment>
      <div
        style={{
          maxWidth: "1000px",
          backgroundColor: currentColor,
          margin: "0 auto",
        }}
        className="content"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Title>Chord Inversion Calculator</Title>
            {/* <Second>Chord Inversion Calculator</Second>
            <Third>Chord Inversion Calculator</Third> */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <ColorPicker
                currentColor={currentColor}
                setColor={setColor}
                allowSound={allowSound}
              ></ColorPicker>

              <p
                style={{
                  margin: "-3px 0 0 0 ",
                  fontSize: "10px",
                  display: "flex",
                }}
              >
                <p
                  onClick={openModal}
                  style={{
                    textDecoration: "underline",
                    color: "white",
                    marginLeft: "2px",
                    cursor: "pointer",
                  }}
                >
                  LEARN MORE
                </p>
              </p>
            </div>
          </div>
          <Speaker
            allowSound={allowSound}
            onClick={() =>
              setAllowSound((prevState) => (prevState ? false : true))
            }
          >
            {allowSound ? (
              <Emoji emoji={"🔊"} description={"sound on"}></Emoji>
            ) : (
              <Emoji emoji={"🔇"} description={"sound off"}></Emoji>
            )}
          </Speaker>
        </div>

        {/* <h1 className="h3">Chord Calculator</h1> */}
        <Directions
          showMusicalTyping={showMusicalTyping}
          // setHelpIsOpen={setHelpIsOpen}
          helpIsOpen={helpIsOpen}
          handleTutorialOpen={handleTutorialOpen}
          handleOnChangeMusicalTyping={handleOnChangeMusicalTyping}
        ></Directions>
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
                playNote={playNote}
                noteToPlay={60}
                stopNote={stopNote}
                disabled={isLoading}
                accidentalType={accidentalType}
                showMusicalTyping={showMusicalTyping}
              />
            )}
          />
        </div>
        {/* <p style={{ marginTop: "25px" }}>Musical Typing</p> */}

        <div style={{ margin: "0 auto" }}>
          <NodeAndChordContainter>
            <AddNodes>
              <ChordNodeContainer>
                <ChordNodes
                  chordList={chordList}
                  currentColor={currentColor}
                  onPlayChord={onPlayChord}
                  setIsPlaying={setIsPlaying}
                  setActiveNode={setActiveNode}
                  setActivePlayingNode={setActivePlayingNode}
                  activeNode={activeNode}
                  deleteChord={deleteChord}
                  activePlayingNode={activePlayingNode}
                ></ChordNodes>

                <AddChord
                  onClickAddChordNode={onClickAddChordNode}
                  chordList={chordList}
                  allowSound={allowSound}
                  play={play}
                  setCurrentStep={setCurrentStep}
                  currentStep={step}
                  joyRideOpen={helpIsOpen}
                ></AddChord>
              </ChordNodeContainer>
            </AddNodes>
            {activeNode !== undefined ? (
              <ChordPicker
                activeNode={activeNode}
                setChord={setChord}
                unsetActiveNode={unsetActiveNode}
                chordList={chordList}
                deleteChord={deleteChord}
                currentColor={currentColor}
                onPlayChord={onPlayChord}
                allowSound={allowSound}
                setCurrentStep={setCurrentStep}
                currentStep={step}
                joyRideOpen={helpIsOpen}
              />
            ) : (
              ""
            )}
          </NodeAndChordContainter>
        </div>
        {/* <button onClick={() => openModal()}>Open Modal</button> */}
        <EmailModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          currentColor={currentColor}
          setIsOpen={setIsOpen}
          afterOpenModal={afterOpenModal}
          setHasSubscribed={setHasSubscribed}
        />
      </div>

      <BottomControlls
        style={{ zIndex: 1000 }}
        speedIndex={speedIndex}
        speeds={speeds}
        handleSetSpeeds={handleSetSpeeds}
        isPlaying={isPlaying}
        currentColor={currentColor}
        onClickClear={onClickClear}
        onClickPlay={onClickPlay}
        onClickStop={onClickStop}
        setCurrentStep={setCurrentStep}
        currentStep={step}
        joyRideOpen={helpIsOpen}
      ></BottomControlls>
      {/* <Tour
        getCurrentStep={curr => setCurrentStep(curr)}
        steps={steps}
        isOpen={helpIsOpen}
        onRequestClose={() => setHelpIsOpen(false)}
        goToStep={step}
      /> */}

      <JoyRide
        steps={steps}
        continuous={true}
        callback={handlesTourCallback}
        run={helpIsOpen}
        stepIndex={step}
        hideBackButton
        continuous={false}

      />
    </React.Fragment>
  );
};

const Title = styled.h1`
  font-size: 28px;
  @media (max-width: 410px) {
    font-size: 24px;
  }
`;

export default App;
