import React, { useEffect, useState, useReducer } from "react";
import styled from "styled-components";
import Emoji from "./emoji";
import Modal from "react-modal";
import { Link } from "./Directions";
import { useCookies } from "react-cookie";

const ModalTopBar = styled.div`
  background-color: white;
  height: 45px;
  color: black;
  text-align: center;
  padding-top: 8px;
`;

const EmailInput = styled.input`
  /* background-color: ${(props) => props.color}; */
  box-shadow: 2px 2px 5px 0 rgba(255, 255, 255, 0.3),
    -0.5px -1px 4px 0 rgba(0, 0, 0, 0.25);
  border: none;
  width: 250px;
  height: 35px;
  padding: 5px;
  color: black;
  border-radius: 10px;
  outline: none;
`;


const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value,
  };
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

const EmailModal = (props) => {

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [formIsSent, setFormIsSent] = useState(false);
  const [cookies, setCookie] = useCookies();

  const [formData, setFormData] = useReducer(formReducer, {});


  const handleChange = (event) => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setIsValidEmail(false);
      return;
    }

    const fields = {
      email: formData.email,
      first_name: formData.first_name,
    };

    setFormIsSent(true);

    fetch("../.netlify/functions/functions", {
      method: "POST",
      body: JSON.stringify(fields),
    })
      .then(() => {
        setFormIsSent(true);
        setCookie("hasSubscribed", true, { path: "/" });
        props.setHasSubscribed(true);
      })
      .catch((error) => alert(error));

    // e.preventDefault();
  };

  function validateEmail(email) {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      padding: "0 !important",
      marginRight: "-90px",
      transform: "translate(-50%, -50%)",
      zIndex: "100",
      maxWidth: "440px",
      backgroundColor: props.currentColor,
    },
  };

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onAfterOpen={props.afterOpenModal}
      onRequestClose={props.closeModal}
      style={customStyles}
      // style={{margin: "0 25%"}}
      contentLabel="Learn More"
    >
      <ModalTopBar>
        {" "}
        <h2>
          Want to learn more? {"  "}
          <Emoji emoji={"🧠"} description={"brain"}></Emoji>
        </h2>
      </ModalTopBar>
      {!formIsSent ? (
        <div style={{ padding: "8px", alignItems: "center" }}>
          <p style={{ textAlign: "center", fontSize: "18px" }}>
            Inversions can be hard, even with the help of the app! Sign up below
            if you want to get:
          </p>
          <ol>
            <li>A free video lesson! (soon!)</li>
            <li>Updates on my interactive video course I'm building</li>
            <li>Updates on the mobile version of this app</li>
          </ol>

          <p style={{ textAlign: "center", fontSize: "10px" }}>
            Follow me on Twitter{" "}
            <Link href="https://twitter.com/nateysepy" newTab={true}>
              @nateysepy
            </Link>{" "}
            and on{" "}
            <Link
              href="https://www.instagram.com/nathan_sepulveda_music/"
              newTab={true}
            >
              Instagram
            </Link>
          </p>
          <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
            <label>
              <div style={{ margin: "10px 0 10px" }}>
                <EmailInput
                  color={props.currentColor}
                  // style={{ width: "250px", height: "35px", padding: "5px", boxShadow: "2px 2px 5px 0 rgba(255, 255, 255, 0.3), -0.5px -1px 4px 0 rgba(0, 0, 0, 0.25)" }}
                  name="email"
                  placeholder="futuremusicgenius@mail.com"
                  onChange={handleChange}
                />
              </div>

              {!isValidEmail ? (
                <p
                  style={{
                    marginTop: "-6px",
                  }}
                >
                  <Emoji emoji={"🚨"} description={"alert"}></Emoji>Please use a
                  valid email address{" "}
                  <Emoji emoji={"🚨"} description={"alert"}></Emoji>
                </p>
              ) : (
                ""
              )}
            </label>

            <input
              type="submit"
              value="Send it!"
              disabled={!formData.email}
              style={
                !formData.email || formData.email === ""
                  ? { opacity: ".25" }
                  : { opacity: "1.0" }
              }
            />
            {Number(cookies.pageVisit) > 6 ? (
              <p
                style={{
                  fontSize: "8px",
                  textDecoration: "underline",
                  marginTop: "5px",
                }}
                onClick={() => {
                  setCookie("hasSubscribed", true, { path: "/" });
                  props.setHasSubscribed(true);
                  props.setIsOpen(false);
                }}
              >
                Do not show again.
              </p>
            ) : (
              ""
            )}
          </form>
        </div>
      ) : (
        <div
          style={{
            width: "340px",
            padding: "25px",
            textAlign: "center",
            fontSize: "18px",
          }}
        >
          <p>
            Thank you so much!{" "}
            <span role="img" aria-label="rock on emoji">
              🤘
            </span>{" "}
            I'll be in touch soon. 💌{" "}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default EmailModal;
