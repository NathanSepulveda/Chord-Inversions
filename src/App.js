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
import ColorPicker from "./ColorPicker"
import keyboard from "./keyboard.mp3";
import Emoji from "./emoji";
import AddChord from "./AddChord";
import "react-toggle/style.css";
// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";


const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value,
  };
};

Modal.setAppElement("#root");

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

// }



const speeds = [
  { label: "🐢", time: 3.3 },
  { label: "🐇", time: 1.7 },
  { label: "🐆", time: 1.0 },
];

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [recording, setRecording] = useState({
    events: [],
    currentEvents: [],
  });
  const [play] = useSound(click);
  const [playClicks] = useSound(keyboard)
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

  const [formData, setFormData] = useReducer(formReducer, {});

  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [popUpHasBeenSeen, setPopUpHasBeenSeen] = useState(false);

  const [hasBeenPlayed, setHasBeenPlayed] = useState(false);

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [showMusicalTyping, setShowMusicalTyping] = useState(false)

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setIsValidEmail(false);
      return;
    }

    const fields = {
      email: formData.email,
      first_name: formData.first_name,
    };

    setFormIsSent(true);

    fetch("../.netlify/functions/functions", {
      method: "POST",
      body: JSON.stringify(fields),
    })
      .then(() => {
        setFormIsSent(true);
        setCookie("hasSubscribed", true, { path: "/" });
        setHasSubscribed(true);
      })
      .catch((error) => alert(error));

    // e.preventDefault();
  };

  function validateEmail(email) {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  }

  const handleChange = (event) => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  };

  const handleSetSpeeds = () => {
    if (speedIndex !== 2) {
      setSpeedIndex((prevState) => prevState + 1);
    } else {
      setSpeedIndex(0);
    }
  };

  let scheduledEvents = [];

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
    console.log(chordList);

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

    setIsCalculated(true);
  };

  const [accidentalType, setNoteAccidentalType] = useState(0);

  const onClickPlay = () => {
    setIsPlaying(true);
    unsetActiveNode();
    setShowMusicalTyping(false)

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
              getAccidentalType(chordList[count][0]);

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
    setShowMusicalTyping(false)
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

    console.log(asNotes);
    let str = asNotes.join(" - ");

    let chordS = str;
    if (chordFromList.includes("M")) {
      chordS = str;
    }
    setChordString(chordS);
  };

  const onClickStop = () => {
    var id = window.setTimeout(function () {}, 0);

    while (id--) {
      window.clearTimeout(id); // will do nothing if no timeout with id is present
    }

    scheduledEvents.forEach((scheduledEvent) => {
      console.log(scheduledEvent);
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
    onClickStop();
    // if (!isPlaying) {
    setChordList([...chordList, undefined]);
    setActiveNode(chordList.length);

    setIsCalculated(false);
    // }
  };

  const setChord = (index, chordValue) => {
    console.log(index);
    onClickStop();
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

    console.log(found);
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
    setIsCalculated(false);
  };

  const unsetActiveNode = () => {
    setActiveNode(undefined);
    setIsCalculated(false);
  };


  useEffect(() => {
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
    console.log(cookies);
    // setCookie("hasSubscribed", false, { path: "/" });
    if (!isPlaying && hasBeenPlayed) {
      let pageVisits = Number(cookies.pageVisit);

      if (pageVisits % 4 == 0 || pageVisits == 2) {
        if (cookies.hasSubscribed == "false") {
          setTimeout(() => {
            setIsOpen(true);
          }, 1200);
        }
      }
    }
  }, [hasBeenPlayed]);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      padding: "0 !important",
      marginRight: "-90px",
      transform: "translate(-50%, -50%)",
      zIndex: "100",
      maxWidth: "440px",
      backgroundColor: currentColor,
    },
  };

  const handleOnChangeMusicalTyping = (e) => {
    console.log(e.target.checked)
    setShowMusicalTyping(e.target.checked)
    onClickStop()
    if (allowSound && e.target.checked) {
      playClicks()
    }
  }

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
        <Directions showMusicalTyping={showMusicalTyping} handleOnChangeMusicalTyping={handleOnChangeMusicalTyping}></Directions>
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
                {chordList.map((c, i) => (
                  <div style={{ height: "60px" }}>
                    <ChordNode
                      currentColor={currentColor}
                      onDoubleClick={() => {
                        onPlayChord(i);
                        setIsCalculated(false);
                      }}
                      chordLength={chordList.length}
                      onClick={() => {
                        setIsPlaying(false);
                        setActiveNode(i);
                        // onPlayChord(i);
                        setIsCalculated(false);
                      }}
                      active={activeNode === i}
                      playing={activePlayingNode === i}
                      key={i}
                    >
                      {c === undefined
                        ? ""
                        : c.includes("m")
                        ? c[0] + c[1]
                        : c[0]}
                    </ChordNode>
                    {activeNode === i && i !== 0 ? (
                      <div
                        style={{
                          zIndex: 8,
                          position: "relative",
                          bottom: "60px",
                          left: "40px",
                          borderRadius: "100%",
                          backgroundColor: "red",
                          width: "22px",
                          height: "22px",
                          fontSize: "1em",
                          textAlign: "center",
                          color: "white",
                          cursor: "pointer",
                        }}
                        onClick={() => deleteChord(i)}
                      >
                        x
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ))}

                <AddChord
                  onClickAddChordNode={onClickAddChordNode}
                  chordList={chordList}
                  allowSound={allowSound}
                  play={play}
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
              />
            ) : (
              ""
            )}
          </NodeAndChordContainter>
        </div>
        {/* <button onClick={() => openModal()}>Open Modal</button> */}
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          // style={{margin: "0 25%"}}
          contentLabel="Learn More"
        >
          <ModalTopBar>
            {" "}
            <h2>
              Want to learn more?  {"  "}
              <Emoji emoji={"🧠"} description={"brain"}></Emoji>
            </h2>
          </ModalTopBar>
          {!formIsSent ? (
            <div style={{ padding: "8px", alignItems: "center" }}>

                <p style={{ textAlign: "center", fontSize: "18px" }}>Inversions can be hard, even with the help of the app! Sign up below if you want to get:

                </p>
                <ol>
                  <li>A free video lesson! (soon!)</li>
                  <li>Updates on my interactive video course I'm building</li>
                  <li>Updates on the mobile version of this app</li>
                </ol>

              <p style={{ textAlign: "center", fontSize: "10px" }}>
                Follow me on Twitter{" "}
                <Link href="https://twitter.com/nateysepy" newTab={true}>
                  @nateysepy
                </Link>{" "}
                and on{" "}
                <Link
                  href="https://www.instagram.com/nathan_sepulveda_music/"
                  newTab={true}
                >
                  Instagram
                </Link>
              </p>
              <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
                <label>
                  <div style={{ margin: "10px 0 10px" }}>
                    <EmailInput
                      color={currentColor}
                      // style={{ width: "250px", height: "35px", padding: "5px", boxShadow: "2px 2px 5px 0 rgba(255, 255, 255, 0.3), -0.5px -1px 4px 0 rgba(0, 0, 0, 0.25)" }}
                      name="email"
                      placeholder="futuremusicgenius@mail.com"
                      onChange={handleChange}
                    />
                  </div>

                  {!isValidEmail ? (
                    <p
                      style={{
                        marginTop: "-6px",
                      }}
                    >
                      <Emoji emoji={"🚨"} description={"alert"}></Emoji>Please
                      use a valid email address{" "}
                      <Emoji emoji={"🚨"} description={"alert"}></Emoji>
                    </p>
                  ) : (
                    ""
                  )}
                </label>

                <input
                  type="submit"
                  value="Send it!"
                  disabled={!formData.email}
                  style={
                    !formData.email || formData.email === ""
                      ? { opacity: ".25" }
                      : { opacity: "1.0" }
                  }
                />
                {Number(cookies.pageVisit) > 6 ? (
                  <p
                    style={{
                      fontSize: "8px",
                      textDecoration: "underline",
                      marginTop: "5px",
                    }}
                    onClick={() => {
                      setCookie("hasSubscribed", true, { path: "/" });
                      setHasSubscribed(true);
                      setIsOpen(false);
                    }}
                  >
                    Do not show again.
                  </p>
                ) : (
                  ""
                )}
              </form>
            </div>
          ) : (
            <div
              style={{
                width: "340px",
                padding: "25px",
                textAlign: "center",
                fontSize: "18px",
              }}
            >
              <p>
                Thank you so much!{" "}
                <span role="img" aria-label="rock on emoji">
                  🤘
                </span>{" "}
                I'll be in touch soon. 💌{" "}
              </p>
            </div>
          )}
        </Modal>
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
      ></BottomControlls>
    </React.Fragment>
  );
};


const EmailInput = styled.input`
  /* background-color: ${(props) => props.color}; */
  box-shadow: 2px 2px 5px 0 rgba(255, 255, 255, 0.3),
    -0.5px -1px 4px 0 rgba(0, 0, 0, 0.25);
  border: none;
  width: 250px;
  height: 35px;
  padding: 5px;
  color: black;
  border-radius: 10px;
  outline: none;
`;

const ModalTopBar = styled.div`
  background-color: white;
  height: 45px;
  color: black;
  text-align: center;
  padding-top: 8px;
`;

const Title = styled.h1`
  font-size: 28px;
  @media (max-width: 410px) {
    font-size: 24px;
  }
`;

export default App;
