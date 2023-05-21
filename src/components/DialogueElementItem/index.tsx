/* eslint-disable @next/next/no-img-element */
import { DialogueElement } from "@/types/DialogueElement";
import { AvatarIcon } from "../AvatarIcon";
import { EmojiWrap } from "../EmojiWrap";

export const DialogueElementItem: React.FC<{
  dialogueElement: DialogueElement;
  dialogueIndex: number;
  isResponding: boolean;
}> = ({ dialogueElement, dialogueIndex, isResponding }) => {
  return (
    <div
      className={`dialogueElementItem ${
        dialogueElement.who === "assistant"
          ? "dialogueElementItemAssistant"
          : "dialogueElementItemHuman"
      }`}
      key={dialogueIndex}
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "8px",
        width: "100%",
        padding: "8px 10px",
        marginTop: "15px",
        marginBottom: "15px",
        border: "2px solid rgba(55, 55, 55, 0.5)",
        borderRadius: "2px",
        boxShadow: " 0 2px 6px 0 rgba(55, 55, 55, 0.3)",
        color: `${
          dialogueElement.who === "assistant"
            ? "rgba(236, 236, 241, 0.8)"
            : "rgba(236, 236, 241, 1)"
        }`,
        backgroundColor: `${
          dialogueElement.who === "assistant"
            ? "rgba(68, 70, 84, 0.9)"
            : "rgba(52, 53, 65, 0.9)"
        }`,
      }}
    >
      <div
        className="avatarIconWrap"
        style={{
          display: "flex",
          justifyItems: "center",
          flexShrink: 0,
        }}
      >
        <AvatarIcon who={dialogueElement.who} />
      </div>
      <div className="dialogueElementWrap">
        <div
          className="dialogueTextWrap"
          style={{
            fontSize: "1.2em",
            paddingLeft: "5px",
            paddingRight: "5px",
            flexGrow: 1,
            maxWidth: "100%",
          }}
        >
          {dialogueElement.text?.split("\n").map((row, rowIdx) => {
            return (
              <div
                className="dialogueTextRow"
                key={`${dialogueIndex}-${rowIdx}`}
                style={{
                  minHeight: "1em",
                  maxWidth: "100%",
                  wordBreak: "break-all",
                }}
              >
                {row}
                {isResponding &&
                  rowIdx === dialogueElement.text.split("\n").length - 1 && (
                    <span className="blinkingCursor" />
                  )}
              </div>
            );
          })}
          {!isResponding &&
            dialogueElement.textEnd?.split("\n").map((row, rowIdx) => {
              return (
                <div
                  key={`${dialogueIndex}-${rowIdx}-end`}
                  style={{
                    minHeight: "1em",
                    marginLeft: row.startsWith(" ") ? "1em" : "0px",
                  }}
                >
                  {row}
                </div>
              );
            })}
        </div>
        {!isResponding && (
          <div
            className="dialogueEmojiListWrap"
            style={{
              cursor: "pointer",
              display: "flex",
              fontFamily: "sans-serif, emoji",
              padding: "6px",
              height: "auto",
            }}
          >
            {dialogueElement.emojiList.map((emojiValue) => {
              return (
                <EmojiWrap
                  key={emojiValue.name}
                  emoji={emojiValue.name}
                  count={emojiValue.count}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
