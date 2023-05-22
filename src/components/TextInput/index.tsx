/* eslint-disable @next/next/no-img-element */
import React, { KeyboardEventHandler, useCallback, useRef } from "react";

export const TextInput = ({
  disabled,
  placeholder,
  inputText,
  setInputText,
  onSubmit,
}: {
  disabled: boolean;
  placeholder: string;
  inputText: string;
  setInputText: (inputText: string) => void;
  onSubmit: () => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        console.log(
          "onKeyDown ctrl + Enter",
          event.currentTarget.value,
          event.currentTarget.value.length
        );
        if (0 < event.currentTarget.value.length) {
          onSubmit();
        }
      }
    },
    [onSubmit]
  );

  return (
    <div
      className="textInput"
      style={{ position: "relative", maxWidth: "1000px", margin: "auto" }}
    >
      <textarea
        className="textInputTextarea"
        ref={textareaRef}
        value={inputText}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.style.height = "0px";
              textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
            }
          }, 100);
          setInputText(e.currentTarget.value);
        }}
        rows={inputText ? inputText.split("\n").length : 1}
        maxLength={400}
      />
      <button
        className="textInputButton"
        onClick={onSubmit}
        disabled={disabled}
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          display: "block",
          padding: "4px",
          height: "34px",
          width: "34px",
        }}
      >
        <img
          style={{ height: "24px", width: "24px" }}
          src="https://i.gyazo.com/1e58e82090fc6f9b140e23fc03faefc7.png"
          alt="Request updating of web site"
          title="Request updating of web site"
        />
      </button>
    </div>
  );
};
