import React, { useState, useEffect } from "react";

const TypingText=({
  text = "",
  interval = 50,
  handleTypingComplete = () => {},
}) => {
  const [typedText, setTypedText] = useState("");

  const typingRender = (text: string, updater: (text: string) => void, interval: number) => {
    let localTypingIndex = 0;
    let localTyping = "";
    if (text) {
      const printer = setInterval(() => {
        if (localTypingIndex < text.length) {
          updater((localTyping += text[localTypingIndex]));
          localTypingIndex += 1;
        } else {
          localTypingIndex = 0;
          localTyping = "";
          clearInterval(printer);
          handleTypingComplete();
        }
      }, interval);
    }
  };
  useEffect(() => {
    typingRender(text, setTypedText, interval);
  }, [text, interval]);

  return <span>{typedText}</span>
}

export default TypingText
