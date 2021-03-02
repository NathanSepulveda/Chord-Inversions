import React from "react";
import styled from "styled-components";

const S = {
  Button: styled.button`
    width: 45px;
    height: 45px;

    margin: 10px 17px 10px 0;

    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;

    margin: 0;
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);

    &:focus {
      outline: none;
    }

    img {
      height: 50%;
      width: auto;
      margin: auto;
    }

    // gradient background white symbol
    /* background: #add8e6; */
    background-color: ${(props) => props.currentColor};
    color: white;

    &:hover {
      cursor: pointer;
      /* opacity: 50%; */
      /* background: linear-gradient(127.87deg, #3b919c 16.09%, #a58ad7 83.8%); */
    }

    /* &:active {
      background: linear-gradient(127.87deg, #8149e8 16.09%, #00b1c9 83.8%);
    } */

    // white button black symbol
    &.white {
      background: white;
      color: black;
    }
  `,
};

const PlayButton = (props) => {
  let { playing, onClick } = props;
  const renderSymbol = () => {
    if (playing) {
      // pause symbol
      return (
        <svg
          width="14"
          height="17"
          viewBox="0 0 14 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fill: "red" }}
        >
          <path
            d="M2.5426 0H2.45741C1.10022 0 0 1.03789 0 2.31818V14.6818C0 15.9621 1.10022 17 2.45741 17H2.5426C3.89978 17 5 15.9621 5 14.6818V2.31818C5 1.03789 3.89978 0 2.5426 0Z"
            fill="currentColor"
          />
          <path
            d="M11.5426 0H11.4574C10.1002 0 9 1.03789 9 2.31818V14.6818C9 15.9621 10.1002 17 11.4574 17H11.5426C12.8998 17 14 15.9621 14 14.6818V2.31818C14 1.03789 12.8998 0 11.5426 0Z"
            fill="currentColor"
          />
        </svg>
      );
    } else {
      // play symbol
      return (
        <svg
          width="16"
          height="19"
          viewBox="0 0 16 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.1429 7.27168C14.5052 7.51957 14.8017 7.85207 15.0065 8.24037C15.2113 8.62867 15.3184 9.06106 15.3184 9.50008C15.3184 9.93909 15.2113 10.3715 15.0065 10.7598C14.8017 11.1481 14.5052 11.4806 14.1429 11.7285L4.5246 18.3093C4.11899 18.5868 3.64533 18.7483 3.15468 18.7765C2.66403 18.8046 2.175 18.6983 1.74031 18.469C1.30562 18.2398 0.941751 17.8962 0.68794 17.4753C0.434128 17.0545 0.299994 16.5723 0.300002 16.0809L0.300002 2.91928C0.299994 2.42782 0.434128 1.94568 0.68794 1.52483C0.941751 1.10399 1.30562 0.7604 1.74031 0.531108C2.175 0.301817 2.66403 0.195519 3.15468 0.223673C3.64533 0.251828 4.11899 0.413367 4.5246 0.690877L14.1429 7.27168Z"
            fill="currentColor"
          />
        </svg>
      );
    }
  };

  return (
    <S.Button
      className={`play-button ${props.className || ""}`}
      onClick={onClick}
      currentColor={props.currentColor}
      style={props.style}
    >
      {props.children || renderSymbol()}
    </S.Button>
  );
};

export default PlayButton;
