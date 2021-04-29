import React, { useState } from "react";
import styled from "styled-components";
import chev from "./down-chevron.png";
import DimensionsProvider from "./DimensionsProvider";
import Toggle from "react-toggle";
const Cont = styled.div`
  display: flex;
  flex-direction: row;
`;

const DirectionButton = styled.button`
  border: none;
  border-radius: 20px;
  color: white;
  height: 23px;
  outline: none;
  background-color: inherit;
  /* box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.25), -2px -2px 5px 0 rgba(255, 255, 255, 0.3) */

  box-shadow: ${(props) =>
    props.open
      ? "2px 2px 5px 0 rgba(255, 255, 255, 0.3), -0.5px -1px 4px 0 rgba(0, 0, 0, 0.25)"
      : "2px 2px 5px 0 rgba(0, 0, 0, 0.25), -2px -2px 5px 0 rgba(255, 255, 255, 0.3)"};
`;

let Directions = (props) => {
  const [isShowing, setIsShowing] = useState(false);


  return (
    <DimensionsProvider>
      {({ containerWidth, containerHeight }) => (
        <div>
          <p style={{ margin: "12px 0" }}>
            This app is designed to help you find the best chord inversions to
            use for a chord progression on the piano.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* <Cont>
              <h3>Directions</h3>
              <img
                onClick={() => {
                  setIsShowing((prev) => !prev);
                }}
                style={{ height: "16px", margin: "6px 5px", cursor: "pointer" }}
                src={chev}
              />
            </Cont> */}
            <DirectionButton
              onClick={props.handleTutorialOpen}
              open={props.helpIsOpen}
            >
              <h5>Tutorial</h5>
            </DirectionButton>
            {containerWidth < 824 ? (
              <p style={{ fontSize: "10px", lineHeight: "25px" }}>
                (You're on mobile. Make sure your device sound is on!){" "}
              </p>
            ) : (
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    fontSize: "10px",
                    height: "100%",
                    margin: "0 4px 20px 0",
                    position: "relative",
                    bottom: "5px",
                  }}
                  htmlFor="showing-musical-typing"
                >
                  Show Musical Typing
                </label>
                <Toggle
                  id="show-musical-typing-status"
                  checked={props.showMusicalTyping}
                  onChange={props.handleOnChangeMusicalTyping}
                />
              </div>
            )}
          </div>
          {isShowing ? (
            <div style={{ marginBottom: "5px" }}>
              <ol style={{ marginTop: "-10px" }}>
                <li>
                  Begin by adding a starting chord with the circular button with
                  a "+" sign.
                </li>
                <li>
                  Select the chord's root, if it's sharp or flat, quality (major
                  or minor for now), and position (root, first, or second
                  inversion).
                </li>
                <li>
                  After this chord is added, you can add the rest of the chords
                  in the progression one by one. You will only be selecting the
                  root, if it's sharp or flat, and the quality of the chord for
                  every chord except the first.
                </li>
                <li>
                  With your selected chord progression, press the "play" button
                  at the bottom to hear and see your chord progression with the
                  best chord inversions!
                </li>
                <li>
                  Double click/tap a chord node to have that individudal chord
                  playback for you on the piano.
                </li>
                <li>
                  You can delete all but the first chord by clicking the red x
                  in the top right corner of a chord node.
                </li>
                <li>
                  You can clear your chord progression using the "clear" button.
                </li>
              </ol>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </DimensionsProvider>
  );
};

export const Link = ({ newTab, children, href, isUnderlined }) => (
  <A
    href={href}
    isUnderlined={isUnderlined}
    rel={newTab ? "noopener noreferrer" : undefined}
    target={newTab ? "_blank" : undefined}
  >
    {children}
  </A>
);

const A = styled.a`
  ${(props) => (props.isUnderlined ? `text-decoration: underline;` : null)}
  color: white;

  &:hover {
    text-decoration: underline;
  }
`;

export default Directions;
