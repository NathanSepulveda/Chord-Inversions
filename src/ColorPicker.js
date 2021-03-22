import styled from "styled-components";
import React, { useState, useEffect, useReducer } from "react";
import colorClick from "./color_button.mp3";
import useSound from "use-sound";
import { useCookies } from "react-cookie";

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

const colors = ["#add8e6", "#ffb6c1", "#afd275", "#957DAD"];

const ColorPicker = props => {
    const [playColor] = useSound(colorClick);
    const [cookies, setCookie] = useCookies();



    useEffect(() => {
        if (cookies.color) {
          document.body.style.backgroundColor = cookies.color;
          props.setColor(cookies.color);
        } else {
          document.body.style.backgroundColor = props.currentColor;
        }
    
        let current = cookies.test;
        console.log(current);
        setCookie("test", 1, { path: "/" });
      }, [props.currentColor]);

    return (
        <div style={{ marginTop: "-18px" }}>
        {colors.map((c) => (
          <ColorDot
            color={c}
            currentColor={props.currentColor}
            onClick={() => {
              setCookie("color", c, { path: "/" });
              props.setColor(c);
              if (props.allowSound) {
                playColor();
              }
            }}
          ></ColorDot>
        ))}
      </div>
    )
}

export default ColorPicker