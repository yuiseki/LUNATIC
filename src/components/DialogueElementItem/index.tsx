/* eslint-disable @next/next/no-img-element */
import { DialogueElement } from "@/types/DialogueElement";
import { AvatarIcon } from "../AvatarIcon";
import { EmojiWrap } from "../EmojiWrap";

export const DialogueElementItem: React.FC<{
  prevDialogueElement?: DialogueElement;
  dialogueElement: DialogueElement;
  dialogueIndex: number;
  isResponding: boolean;
  setInputText?: (text: string) => void;
  mode?: string;
}> = ({
  prevDialogueElement,
  dialogueElement,
  dialogueIndex,
  isResponding,
  setInputText,
  mode,
}) => {
  return (
    <div
      className="dialogueElementItem"
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
        style={{
          display: "flex",
          justifyItems: "center",
          flexShrink: 0,
        }}
      >
        <AvatarIcon who={dialogueElement.who} />
      </div>
      <div>
        <div
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
            style={{
              cursor: "pointer",
              display: "flex",
              fontFamily: "sans-serif, emoji",
              padding: "6px",
              height: "auto",
            }}
          >
            <EmojiWrap emoji=":send_money:" count={10000} />
            <EmojiWrap emoji=":is_all_scam:" count={10000} />
          </div>
        )}
      </div>
    </div>
  );
};
