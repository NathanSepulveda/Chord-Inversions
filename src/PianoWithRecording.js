import React from "react";
import { Piano, KeyboardShortcuts } from "./react-piano-master/src/index";
import DimensionsProvider from "./DimensionsProvider";
const DURATION_UNIT = 2.0;
const DEFAULT_NOTE_DURATION = DURATION_UNIT;
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: 60,
  lastNote: 77,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});
class PianoWithRecording extends React.Component {
  static defaultProps = {
    notesRecorded: false,
  };
  state = {
    keysDown: {},
    noteDuration: DEFAULT_NOTE_DURATION,
  };
  onPlayNoteInput = (midiNumber) => {
    this.setState({
      notesRecorded: false,
    });
  };
  onStopNoteInput = (midiNumber, { prevActiveNotes }) => {
    if (this.state.notesRecorded === false) {
      //   this.recordNotes(prevActiveNotes, this.state.noteDuration);
      this.setState({
        notesRecorded: true,
        noteDuration: DEFAULT_NOTE_DURATION,
      });
    }
  };
  recordNotes = (midiNumbers, duration) => {
    if (this.props.isPlaying) {
      return;
    }
    const newEvents = midiNumbers.map((midiNumber) => {
      return {
        midiNumber,
        time: this.props.recording.currentTime,
        duration: duration,
      };
    });
    this.props.setRecording({
      events: this.props.recording.events.concat(newEvents),
      currentTime: this.props.recording.currentTime + duration,
    });
  };
  render() {
    const {
      playNote,
      stopNote,
      recording,
      setRecording,
      accidentalType,
      ...pianoProps
    } = this.props;


    const { currentEvents } = this.props.recording;
    const activeNotes = this.props.isPlaying
      ? currentEvents.map((event) => event.midiNumber)
      : null;
    return (
      <div>
        <DimensionsProvider>
          {({ containerWidth, containerHeight }) => (
            <Piano
              playNote={playNote}
              stopNote={stopNote}
              width={containerWidth}
              height={"90px"}
              keyboardShortcuts={
                containerWidth > 824 && this.props.showMusicalTyping
                  ? keyboardShortcuts
                  : null
              }
              //   onPlayNoteInput={this.onPlayNoteInput}
              onStopNoteInput={this.onStopNoteInput}
              activeNotes={activeNotes}
              accidentalType={accidentalType}
              // noteRange={{ first: 53, last: 81 }}
              {...pianoProps}
            />
          )}
        </DimensionsProvider>
      </div>
    );
  }
}
export default PianoWithRecording;
