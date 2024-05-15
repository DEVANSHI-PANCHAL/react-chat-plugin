import { Button, Popover } from "@mui/material";
import React, { useState, useEffect } from "react";
import "./Chatbot.css";

const responses = {
  hello: "Hi there! How can I assist you today?",
  "flight details":
    "Here you will find information about flight details. <a href='https://www.goindigo.in/web-check-in.html' target='_blank'>Visit Website</a>",
  "how are you": "I'm just a bot, but I'm here to help you!",
  "need help": "How can I assist you today?",
  bye: "Goodbye! Have a great day!",
  default:
    "I'm sorry, I didn't understand that. Want to connect with an expert?",
  expert: "Great! Please wait a moment while we connect you with an expert.",
  no: "Okay, if you change your mind just let me know!",
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    };
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

//   const sendMessage = () => {
//     const userInputTrimmed = userInput.trim();
//     if (userInputTrimmed !== "") {
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { sender: "user", message: userInputTrimmed },
//       ]);
//       respondToUser(userInputTrimmed.toLowerCase());
//       setUserInput("");
//     }
//   };

const sendMessage = () => {
    const userInputTrimmed = userInput.trim();
    if (userInputTrimmed !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", message: userInputTrimmed },
      ]);
      
      // Call your API here
      fetchResponseFromAPI(userInputTrimmed)
        .then((data) => {
          const botResponse = data.message || responses["default"];
          appendMessage("bot", botResponse);
        })
        .catch((error) => {
          console.error('Error fetching response from API:', error);
          appendMessage('bot', 'Sorry, there was an error fetching the response.');
        });
  
      setUserInput("");
    }
  };
  
  // Function to fetch response from API
  const fetchResponseFromAPI = (userInput) => {
    return fetch("http://localhost:4001/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };
  

  const respondToUser = (userInput) => {
    const response = responses[userInput] || responses["default"];
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", message: response },
      ]);
    }, 500);
  };

  const appendMessage = (sender, message) => {
    setMessages((prevMessages) => [...prevMessages, { sender, message }]);
  };

  return (
    <div className="chatbot-container">
      {/* <button className="chatbot-toggle-btn" onClick={toggleChatbot}></button> */}
      <div className="chatbot-toggle-btn" >
        <Button onClick={handleButtonClick}>
          <i className="fas fa-comment-alt" />
        </Button>
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {/* Content of your popover */}
        <div>
          <div className="chat-header">
            <span>Chatbot</span>
            <button className="close-btn" onClick={toggleChatbot}>
              &times;
            </button>
          </div>
          <div className="chat-box">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.sender === "user" ? "user-message" : "bot-message"
                }
              >
                {message.message}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type a message..."
              id="user-input"
            />
            <button className="send-btn" onClick={sendMessage} id="send-btn">
              <i className="far fa-paper-plane" />
            </button>
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default Chatbot;
