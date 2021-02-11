// let CMaj = {
//     type: "Cmaj",
//     text: "Cmaj",
//     notes: ["C3", "E3", "G3"],
//     key: 0
//   };

//   let CMaj_firstInverion = {
//     type: "Cmaj",
//     text: "Cmaj First Inversion",
//     notes: ["E3", "G3", "C4"],
//     key: 1
//   };

//   let CMaj_secondInverion = {
//     type: "Cmaj",
//     text: "Cmaj Second Inversion",
//     notes: ["G3", "C4", "E4"],
//     key: 2
//   };

//   let DMaj = {
//     type: "Dmaj",
//     text: "Dmaj",
//     notes: ["D3", "F#3", "A3"],
//     key: 3
//   };

//   let DMaj_firstInverion = {
//     type: "Dmaj",
//     text: "Dmaj First Inversion",
//     notes: ["F#3", "A3", "D4"],
//     key: 4
//   };

//   let DMaj_secondInverion = {
//     type: "Dmaj",
//     text: "Dmaj Second Inversion",
//     notes: ["A3", "D4", "F#4"],
//     key: 5
//   };

//   let Emin = {
//     type: "Emin",
//     text: "Emin",
//     notes: ["E3", "G3", "B3"],
//     key: 6
//   };
//   let Emin_firstInversion = {
//     type: "Emin",
//     text: "Emin First Inversion",
//     notes: ["G3", "B3", "E4"],
//     key: 7
//   };
//   let Emin_secondInversion = {
//     type: "Emin",
//     text: "Emin Second Inversion",
//     notes: ["B3", "E4", "G4"],
//     key: 8
//   };

//   let Emaj = {
//     type: "Emaj",
//     text: "Emaj",
//     notes: ["E3", "G#3", "B3"],
//     key: 9
//   };
//   let Emaj_firstInversion = {
//     type: "Emaj",
//     text: "Emaj First Inversion",
//     notes: ["G#3", "B3", "E4"],
//     key: 10
//   };
//   let Emaj_secondInversion = {
//     type: "Emaj",
//     text: "Emaj Second Inversion",
//     notes: ["B3", "E4", "G#4"],
//     key: 11
//   };

//   let Fmaj_secondInversion = {
//     type: "Fmaj",
//     text: "Fmaj First Inversion",
//     notes: ["C3", "F3", "A3"],
//     key: 12
//   };

//   let Fmaj = {
//     type: "Fmaj",
//     text: "Fmaj",
//     notes: ["F3", "A3", "C4"],
//     key: 13
//   };

//   let Fmaj_firstInversion = {
//     type: "Fmaj",
//     text: "Fmaj First Inversion",
//     notes: ["A3", "C4", "F4"],
//     key: 14
//   };

//   let Gmaj_firstInversion = {
//     type: "Gmaj",
//     text: "Gmaj First Inversion",
//     notes: ["B3", "D4", "G4"],
//     key: 15
//   };

//   let Gmaj = {
//     type: "Gmaj",
//     text: "Gmaj",
//     notes: ["G3", "B3", "D4"],
//     key: 16
//   };

//   let Gmaj_secondInversion = {
//     type: "Gmaj",
//     text: "Gmaj Second Inversion",
//     notes: ["D3", "G3", "B3"],
//     key: 17
//   };

let chordList = [
  { name: "C", quality: "major", position: "root", notes: [60, 64, 67], asLetters: ["C", "E", "G"] },
  { name: "C#/Db", quality: "major",  position: "root", notes: [61, 65, 68], asLetters: ["C#/Db", "E#/F", "G#/Ab"] },
  { name: "D", quality: "major", position: "root", notes: [62, 66, 69], asLetters: ["D", "F#", "A"]},
  { name: "Eb", quality: "major", position: "root", notes: [63, 67, 70], asLetters: ["Eb", "G", "Bb"] },
  { name: "E", quality: "major", position: "root", notes: [64, 68, 71], asLetters: ["E", "G#", "B"] },
  { name: "F", quality: "major", position: "root", notes: [65, 69, 72], asLetters: ["F", "A", "C"] },
  { name: "F#/Gb", quality: "major", position: "root", notes: [66, 70, 73], asLetters: ["F#/Gb", "A#/Bb", "C#/Db"] },
  { name: "G", quality: "major", position: "root", notes: [55, 59, 62], asLetters: ["G", "B", "D"] },
  { name: "Ab", quality: "major", position: "root", notes: [56, 60, 63], asLetters: ["Ab", "C", "Eb"] },
  { name: "A", quality: "major", position: "root", notes: [57, 61, 64], asLetters: ["A", "C#", "E"] },
  { name: "Bb", quality: "major", position: "root", notes: [58, 62, 65], asLetters: ["Bb", "D", "F"] },
  { name: "B", quality: "major", position: "root", notes: [59, 63, 66], asLetters: ["B", "D#", "F#"] },


    { name: "C", quality: "minor", position: "root", notes: [60, 63, 67], asLetters: ["C", "Eb", "G"] },
    { name: "C#/Db", quality: "minor",  position: "root", notes: [61, 64, 68], asLetters: ["C#/Db", "E/Fb", "G#/Ab"] },
    { name: "D", quality: "minor", position: "root", notes: [62, 65, 69], asLetters: ["D", "F", "A",]},
    { name: "Eb", quality: "minor", position: "root", notes: [63, 66, 70], asLetters: ["Eb", "Gb", "Bb"] },
    { name: "E", quality: "minor", position: "root", notes: [64, 67, 71], asLetters: ["E", "G", "B"] },
    { name: "F", quality: "minor", position: "root", notes: [65, 68, 72], asLetters: ["F", "Ab", "C"] },
    { name: "F#/Gb", quality: "minor", position: "root", notes: [66, 69, 73], asLetters: ["F#/Gb", "A/Bbb", "C#/Db"] },
    { name: "G", quality: "minor", position: "root", notes: [55, 58, 62], asLetters: ["G", "Bb", "D"] },
    { name: "Ab/G#", quality: "minor", position: "root", notes: [56, 59, 63], asLetters: ["Ab/G#", "Cb/B", "Eb/D#"] },
    { name: "A", quality: "minor", position: "root", notes: [57, 60, 64], asLetters: ["A", "C", "E"] },
    { name: "Bb", quality: "minor", position: "root", notes: [58, 61, 65], asLetters: ["Bb", "Db", "F"] },
    { name: "B", quality: "minor", position: "root", notes: [59, 62, 66], asLetters: ["B", "D", "F#"] },

  { name: "C major", position: "first inversion", notes: [64, 67, 72], asLetters: ["E", "G", "C"] },
  { name: "C major", position: "second inversion", notes: [55, 60, 64], asLetters: ["G", "C", "E"] },
  { name: "E- major", position: "first inversion", notes: [67, 70, 75], asLetters: ["G", "Bb", "Eb", "A#", "D#"] },
  { name: "E- major", position: "second inversion", notes: [58, 63, 67], asLetters: ["Bb", "G", "Eb", "A#", "D#"] },
  { name: "F major", position: "second inversion", notes: [60, 65, 69], asLetters: ["C", "F", "A"] },
  { name: "G major", position: "first inversion", notes: [59, 62, 67], asLetters: ["B", "D", "G"] },
  { name: "G major", position: "second inversion", notes: [62, 67, 71], asLetters: ["D", "G", "B"] }
];

export default chordList;
