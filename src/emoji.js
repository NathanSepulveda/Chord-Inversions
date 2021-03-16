import React from "react";

const Emoji = ({ emoji, description }) => {
  return (
    <span role="img" aria-label={description + " emoji"}>
      {emoji}
    </span>
  );
};

export default Emoji;
