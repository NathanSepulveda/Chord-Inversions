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
      <p style={{margin: "12px 0"}}>
        This app is designed to help you find the best chord inversions to use
        for a chord progression on the piano.
      </p>
      <Cont>
        <h3>Directions</h3>
        <img onClick={() => {setIsShowing(prev => !prev)}} style={{ height: "16px", margin: "6px 5px", cursor: "pointer" }} src={chev} />
      </Cont>
      {
          isShowing ? 
        <div style={{marginBottom: "5px"}}>
          <ol style={{marginTop: "-10px"}}>
          <li>
            Begin by adding a starting chord with the circular button with a "+"
            sign.
          </li>
          <li>
            Select the chord's root, if it's sharp or flat, quality (major or
            minor for now), and position (root, first, or second inversion).
          </li>
          <li>
            After this chord is added, you can add the rest of the chords in the
            progression one by one. You will only be selecting the root, if it's
            sharp or flat, and the quality of the chord for every chord except the
            first.
          </li>
          <li>
              With your selected chord progression, press the "play" button at the bottom to hear and see your chord progression with the best chord inversions!
          </li>
          <li>
            Double click/tap a chord
            node to have that individudal chord playback for you on the piano.
          </li>
          <li>
            You can delete all but the
            first chord by clicking the red x in the top right corner of a chord node.
          </li>
          <li>
            You can clear your chord progression using the "clear"
            button.
          </li>
        </ol> 
        <p>Built by <Link href="https://twitter.com/nateysepy" newTab={true}>Nathan Sepulveda</Link></p> 
        </div>:
        
         ""
        
      }
      
      
    </div>
  );
};


export const Link = ({ newTab, children, href, isUnderlined }) => (
  <A
      href={href}
      isUnderlined={isUnderlined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      target={newTab ? '_blank' : undefined}
  >
      {children}
  </A>
);

const A = styled.a`
  ${props => props.isUnderlined ? `text-decoration: underline;` : null}
  color: white;

  &:hover {
      text-decoration: underline;
  }
`;


export default Directions;
