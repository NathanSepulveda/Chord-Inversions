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
import BottomControlls from "./footer";
import { useCookies } from "react-cookie";
import useSound from "use-sound";
import Modal from "react-modal";
import click from "./soft_button.mp3";
import colorClick from "./color_button.mp3";
// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-90px",
    transform: "translate(-50%, -50%)",
    zIndex: "100",
    backgroundColor: "pink",
  },
};

Modal.setAppElement("#root");

const NodeAndChordContainter = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 400px;
`;

const Speaker = styled.div`
  position: relative;
  /* opacity: ${(props) => !props.disabled && ".3"}; */
  margin-top: 10px;
  user-select: none;

  &:after {
    left: 0;

    height: 23px;
    background: ${(props) => !props.allowSound && "#c00"};
    /* background: #c00; */

    display: block;

    position: absolute;
    top: 1px;
    left: 7px;

    content: "";
    width: 1.5px;
    transform: rotate(40deg);
    display: block;
  }
`;

const AddChordButton = styled.div`
  width: 65px;
  height: 65px;
  border-radius: 100%;
  /* border: 1px solid black; */
  background-color: lightgreen;
  line-height: 60px;
  text-align: center;
  font-size: 32px;
  margin-right: 5px;

  @media (max-width: 768px) {
    font-size: 38px;

    width: 50px;
    height: 50px;
    margin: 5px;
    /* padding: 5px; */
    line-height: 50px;

    /* width: ${(props) => props.chordLength > 5 && "36px"};
    height: ${(props) => props.chordLength > 5 && "36px"};
    line-height: ${(props) => props.chordLength > 5 && "33px"};
    font-size: ${(props) => props.chordLength > 5 && "15px"}; */
  }
  /* cursor: pointer; */

  cursor: ${(props) => !props.disabled && "pointer"};
  display: ${(props) => props.disabled && "none"};
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
`;

const ChordNode = styled.div`
  width: 65px;
  height: 65px;

  border-radius: 100%;
  /* border: 1px solid white; */
  background-color: ${(props) => props.currentColor};
  color: white;
  line-height: 65px;
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
  /* &:after {
    content: '';
  flex: 1;
  padding-left: 2rem;
  height: 1px;
  background-color: #000;
  } */
`;

// }

const colors = ["#add8e6", "#ffb6c1", "#afd275", "#957DAD"];

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
  const [playColor] = useSound(colorClick);
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

  const [modalIsOpen, setIsOpen] = React.useState(false);
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
    const fields = {
      email: "nathans.composer+101@gmail.com",
    };

    fetch("../.netlify/functions", {
      method: "POST",
      body: JSON.stringify(fields),
    })
      .then(() => alert("Form Sent!"))
      .catch((error) => alert(error));

    // e.preventDefault();
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

  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  const onPlayChord = (index) => {
    // if (isPlaying) {
    //   setIsPlaying(false);
    //   sleep(100)
    //   setRecordingHandler({currentEvents: []});
    // onClickStop();
    // // sleep(200)

    // // unsetActiveNode();
    //   // return
    // }

    setIsPlaying(true);

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
    convertMIDIToChordLetters(chordName, chordIwant);

    // setTimeout(() => {
    //   onClickStop();
    // }, 1 * 2000);
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
    if (cookies.color) {
      document.body.style.backgroundColor = cookies.color;
      setColor(cookies.color);
    } else {
      document.body.style.backgroundColor = currentColor;
    }

    let current = cookies.test;
    console.log(current);
    setCookie("test", 1, { path: "/" });
  }, [currentColor]);

  useEffect(() => {
    if (!cookies.pageVisit) {
      setCookie("pageVisit", 1, { path: "/" });
    } else {
      let current = Number(cookies.pageVisit);
      setCookie("pageVisit", current + 1, { path: "/" });
    }

    if (Number(cookies.pageVisit) === 5) {
      setIsOpen(true);
    }
  }, []);

  // useEffect(() => {

  //   // document.getElementById('mod').onclick = function() {
  //     // document.getElementById('mod').click()
  //     // window.open(url);
  //     window.open('https://witty-motivator-5457.ck.page/8935ca41bb','_blank')
  //   // }
  // }, [currentColor]);

  // useEffect(() => {
  //   if (activeNode && chordList.length > 1) {
  //     onPlayChord(activeNode)
  //   }

  // }, [chordList[activeNode]])

  return (
    <React.Fragment>
      <div
        // style={{ height: "100%", padding: "10px 10px 0 10px" }}
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
            <h1>Chord Inversion Calculator</h1>
            <div style={{ marginTop: "-18px" }}>
              {colors.map((c) => (
                <ColorDot
                  color={c}
                  currentColor={currentColor}
                  onClick={() => {
                    setCookie("color", c, { path: "/" });
                    setColor(c);
                    if (allowSound) {
                      playColor();
                    }
                  }}
                ></ColorDot>
              ))}
            </div>
          </div>
          <Speaker
            allowSound={allowSound}
            onClick={() =>
              setAllowSound((prevState) => (prevState ? false : true))
            }
          >
            🔊
          </Speaker>
        </div>

        {/* <h1 className="h3">Chord Calculator</h1> */}
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
                playNote={playNote}
                noteToPlay={60}
                stopNote={stopNote}
                disabled={isLoading}
              />
            )}
          />
        </div>

        <div style={{ margin: "0 auto" }}>
          <NodeAndChordContainter>
            <h4 style={{ marginTop: "25px" }}>
              {chordString === ""
                ? "Active Chord Notes: "
                : "Active Chord Notes: " + chordString}
            </h4>
            <AddNodes>
              <ChordNodeContainer>
                {chordList.map((c, i) => (
                  <div>
                    <ChordNode
                      currentColor={currentColor}
                      onDoubleClick={() => {
                        // if (!isPlaying) {
                        // setActiveNode(i);

                        onPlayChord(i);
                        setIsCalculated(false);
                        // }
                      }}
                      chordLength={chordList.length}
                      onClick={() => {
                        setIsPlaying(false);
                        // sleep(10);
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
                    {/* {activeNode === i ? (
                      <button
                        style={{ zIndex: 10, position: "absolute" }}
                        onClick={() => deleteChord(i)}
                      >
                        x
                      </button>
                    ) : (
                      ""
                    )} */}
                  </div>
                ))}
                <AddChordButton
                  disabled={chordList.length > 7}
                  // onClick={chordList.length > 7 ? null : onClickAddChordNode}
                  onClick={() => {
                    onClickAddChordNode();
                    if (allowSound) {
                      play();
                    }
                  }}
                  chordLength={chordList.length}
                >
                  +
                </AddChordButton>
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
        <button onClick={() => openModal()}>Open Modal</button>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          // style={{margin: "0 25%"}}
          contentLabel="Learn More"
        >
          <h2>Want to learn more? 🧠</h2>
          <p>
            Inversions can be hard, even with the help of the app! I am working
            on a short <b>video course</b> going over the ins and outs of using{" "}
            <b>chord inversions on the piano</b>. Sign up below if you want to
            stay in the loop! ➰
          </p>
          <form>
            <fieldset>
              <label>
                <p>Name</p>
                <input name="name" />
              </label>
              <label>
                <p>Email</p>
                <input name="email" />
              </label>
            </fieldset>
            <button type="submit">Submit</button>
          </form>
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

const ColorDot = styled.span`
  height: 22px;
  width: 22px;
  margin: 7px 5px 0 0;
  background-color: ${(props) => props.color};
  opacity: ${(props) => props.color};
  /* border: ${(props) =>
    props.currentColor === props.color && "1px solid white"}; */
  border-radius: 50%;

  box-shadow: ${(props) =>
    props.currentColor === props.color
      ? "2px 2px 5px 0 rgba(255, 255, 255, 0.3), -0.5px -1px 4px 0 rgba(0, 0, 0, 0.25)"
      : ""};

  background-image: ${(props) =>
    props.currentColor === props.color
      ? "linear-gradient(135deg, rgba(0,0,0,0.255), rgba(255,255,255,.2))"
      : ""};

  display: inline-block;
`;

export default App;
