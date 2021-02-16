import styled from "styled-components";
import SoundfontProvider from "./soundfontprovider";
import React from "react";
import _ from "lodash";
import "react-piano/dist/styles.css";
import PianoWithRecording from "./PianoWithRecording";
import processChordChain, {chordChain} from "./chord-info/ChordChain"
import { notes } from "./chord-info/ChordStepKeys";
import Directions from "./Directions"
import ChordPicker from "./ChordPicker"

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";

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
    let events = processChordChain(
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
            (event) => {
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
    let quality = chordFromList[1]
    if (chordFromList[0].length > 1) {
      accidental = chordFromList[0].split("")[1];
    }

    let asNotes = chordIwant.map((n) => {
      return this.getKeyByValue(notes, n, quality, accidental);
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

  getKeyByValue = (object, value, quality, accidental) => {
    console.log(value);
    let found = Object.keys(object).filter((key) => object[key] === value);
    if (value > 71) {
      found = Object.keys(object).filter((key) => object[key] === value - 12);
    } else if (value < 60) {
      found = Object.keys(object).filter((key) => object[key] === value + 12);
    }
    if (accidental === "" && found.length > 1 && quality === "m") {
      found = found.find(n => n.includes("b"))
    } else if (accidental === "" && found.length > 1) {
      found = found.find(n => n.includes("#"))
    } else if (accidental === "#" && found.length > 1) {
      found = found.find(n => n.includes("#"))
    } else if (accidental === "b" && found.length > 1) {
      found = found.find(n => n.includes("b"))
    }
    // if (found.length > 1) {
    //   found = found.join("/");
    // }

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





export default App;
