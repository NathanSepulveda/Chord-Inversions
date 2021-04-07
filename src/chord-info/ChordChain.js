import {
  transFormKeyMajRoot,
  transformKeyMin,
  notes,
  transformKeySus,
} from "./ChordStepKeys";

let getTransform = (prev, destination) => {
  if (destination[0] === "0") {
    return Number(prev.split("-")[1]);
  }
  if (prev.split("-")[1] === "0") {
    if (prev.split("-")[0] === "M") {
      return transFormKeyMajRoot[destination][0];
    } else if (prev.split("-")[0] === "m") {
      return transformKeyMin[destination][0];
    } else if (prev.split("-")[0] === "sus") {
      return transformKeySus[destination][0];
    }
  } else if (prev.split("-")[1] === "1") {
    if (prev.split("-")[0] === "M") {
      return (transFormKeyMajRoot[destination][0] + 1) % 3;
    } else if (prev.split("-")[0] === "sus") {
      return (transformKeySus[destination][0] + 1) % 3;
    } else if (prev.split("-")[0] === "m") {
      return (transformKeyMin[destination][0] + 1) % 3;
    }
  } else if (prev.split("-")[1] === "2") {
    if (prev.split("-")[0] === "M") {
      return (transFormKeyMajRoot[destination][0] + 2) % 3;
    } else if (prev.split("-")[0] === "m") {
      return (transformKeyMin[destination][0] + 2) % 3;
    } else if (prev.split("-")[0] === "sus") {
      return (transformKeySus[destination][0] + 2) % 3;
    }
  }
};

let createChord = (MIDINumber, quality) => {
  if (quality === "M") {
    return [MIDINumber, MIDINumber + 4, MIDINumber + 7];
  } else if (quality === "m") {
    return [MIDINumber, MIDINumber + 3, MIDINumber + 7];
  } else if (quality === "dim") {
    return [MIDINumber, MIDINumber + 3, MIDINumber + 6];
  } else if (quality === "sus") {
    return [MIDINumber, MIDINumber + 5, MIDINumber + 7];
  } else if (quality === "aug") {
    return [MIDINumber, MIDINumber + 4, MIDINumber + 8];
  } else if (quality === "sus2") {
    return [MIDINumber, MIDINumber + 2, MIDINumber + 7];
  } else if (quality === "m7") {
    return [MIDINumber, MIDINumber + 3, MIDINumber + 10];
  } else if (quality === "7") {
    return [MIDINumber, MIDINumber + 4, MIDINumber + 10];
  }
};

let transposeChord = (chord, octave) => {
  return chord.map((note) => note + octave);
};

let invertUp = (chord, destination) => {
  if (chord != undefined) {

    if (chord.length === 3) {
      if (destination === 1) {
        return [chord[1], chord[2], chord[0] + 12];
      } else if (destination === 2) {
        return [chord[2], chord[0] + 12, chord[1] + 12];
      } else {
        return chord;
      } 
    } else {
      if (destination === 1) {
        return [chord[1], chord[2], chord[3], chord[0] + 12];
      } else if (destination === 2) {
        return [chord[2], chord[3], chord[0] + 12, chord[1] + 12];
      } else if (destination === 3) {
        return [chord[3], chord[0] + 12, chord[1] + 12, chord[2] + 12 ];
      } 
      else {
        return chord;
      }
    }
  }

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

export let chordChain = (startingChord, listOfChords) => {
  let next;
  let chords = [];

  if (listOfChords.length < 1) {
    let prevChord = invertUp(
      createChord(notes[startingChord[0]], startingChord[1]),
      startingChord[2]
    );

    console.log(createChord(notes[startingChord[0]], startingChord[1]));
    return lowerAll([prevChord]);
  }

  listOfChords.forEach((chord, i) => {
    if (i === 0) {
      let p = getNextChord(startingChord, chord);
      // console.log(p)
      chords.push(p[0]);
      console.log(p[0], "wow");
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

  console.log(final, p);

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

let processChordChain = (cChain, speed) => {
  let duration = speed - 0.1;
  let current = 0;
  let neww = [];
  let justNotes = [];
  console.log(cChain);
  cChain.forEach((c, i) => {
    console.log(c);
    justNotes.push(c);
    c.forEach((n) => {
      neww.push({ midiNumber: n, time: current, duration: duration, group: i });
    });
    current += speed;
  });
  console.log(neww, justNotes);
  return [neww, justNotes];
};

function calculateDifference(first, second) {
  let diff = 0;
  for (let i = 0; i < first.length; i++) {
    diff += Math.abs(first[i] - second[i]);
  }
  return diff;
}

// const getInversions = (targ) => positions.map((pos) => invertUp(targ, pos));

const getInversions = targ => {
  let positions = [0, 1, 2]
  if (targ.length === 4) {
    positions = [0, 1, 2, 3]
  }
  return positions.map((pos) => invertUp(targ, pos))
}

const getDiffs = (starter, targs) => {
  let diffs = targs.map((t) => calculateDifference(starter, t));
  return diffs;
};

let proc = (c1AsArray, {root, quality}) => {
  let c2 = createChord(notes[root], quality)
  let targets = getInversions(c2);
  let diffs = getDiffs(c1AsArray, targets);
  if (Math.min(...diffs) > 6) {
    targets = getInversions(transposeChord(c2, -12));

    diffs = getDiffs(c1AsArray, targets);
  }
  let idx = diffs.indexOf(Math.min.apply(null, diffs));

  // return { chord: targets[idx], position: idx };
  let chordToReturn = targets[idx]

  if (chordToReturn.length === 4) {
    // alert("here!")
    let lastElementCurrent = chordToReturn[chordToReturn.length - 1]
    let lastElementCurrentTranposed = lastElementCurrent - 12

    let distanceFromTop = lastElementCurrent - chordToReturn[2]
    let distanceFromBottom = chordToReturn[0] - lastElementCurrentTranposed

    if (distanceFromTop > distanceFromBottom) {
      // alert("this happended!")
    }

  }
  return targets[idx];
};

let positions = [0, 1, 2]

export let processChain = (chords) => {
  let p = []
  let previousChordAsNotes = null
  if (!chords.includes(undefined)) {
    chords.forEach((e, i) => {
      if (!previousChordAsNotes) {
        console.log(e)
        // p.push(e + previousChordAsNotes)
        let chordAsNotes = createChord(notes[e.root], e.quality)
        console.log(chordAsNotes)
        p.push(chordAsNotes)
        previousChordAsNotes = chordAsNotes
        
      } else {
        // if (i !== chords.length - 1) {
          console.log(e)
          let newChordinRoot = createChord(notes[e.root], e.quality)
          console.log(e, newChordinRoot)
          let res = proc(previousChordAsNotes, e)
          p.push(res)
          previousChordAsNotes = res
          console.log(p)
        // }
  
        
      }
    })
    return p
  }

}

export default processChordChain;
