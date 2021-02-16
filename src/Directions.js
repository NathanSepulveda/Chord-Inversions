import React, { useState } from "react";
import styled from "styled-components";
import chev from "./down-chevron.png";

const Cont = styled.div`
  display: flex;
  flex-direction: row;
`;

let Directions = () => {
  const [isShowing, setIsShowing] = useState(false);
  return (
    <div>
      <p>
        This app is designed to help you find the best chord inversions to use
        for a chord progression on the piano. Your chord progressions will sound
        smoother and will be easier to play compared to only using root position
        chords.
      </p>
      <Cont>
        <h2>Directions</h2>
        <img onClick={() => {setIsShowing(prev => !prev)}} style={{ height: "20px", margin: "8px 5px", cursor: "pointer" }} src={chev} />
      </Cont>
      {
          isShowing ? <ol style={{marginTop: "-5px"}}>
          <li>
            Begin by adding a starting chord with the circular button with a "+"
            sign.
          </li>
          <li>
            Select the chord's root, if it's sharp or flat, quaility (major or
            minor for now), and position (root, first, or second inversion).
          </li>
          <li>
            After this chord is added, you can the rest of the chord's in the
            progression one by one. You will only be selecting the root, if it's
            sharp or flat, and the qauilty of the chord for every chord except the
            first.
          </li>
          <li>
            Once you have at least two chords set and no chord nodes are empty,
            you can click the calculate button.
          </li>
          <li>
            If the chord inversions have been calculated, you will see the "play"
            button active. Press this button to play your chord progression with
            the best chord inversions!
          </li>
          <li>
            With the calculated progression, you can also hover over a chord's
            node to have that indivicudal chord playback for you on the piano.
          </li>
          <li>
            You can edit a chord node at any time, as well as delete all but the
            first chord by clicking the chord node and selecting the "delete"
            button.
          </li>
          <li>
            Note that any changes to the chord progression will need to be
            recalulated before you can play back the progression or an individual
            chord.
          </li>
          <li>
            You can clear your chord progression at any time using the "clear"
            button.
          </li>
        </ol> : ""
      }
      
    </div>
  );
};

export default Directions;
