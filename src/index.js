import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);


// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(

      <App />

   ,
    document.getElementById("root")
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


// let findCorrectChord = (input, chordList) => {
//     console.log(input);
//     const result = chordList.find(chord => {
//       let transposedChordDown = transposeDown(chord)
//       // console.log(chord.notes[input.index]);
//       return (
//         chord.name === input.chordName &&
//         chord.notes[input.index] === input.firstCommonTone
//       );
//     });
//     return result;
    
//   };