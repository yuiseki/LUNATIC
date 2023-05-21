/* eslint-disable @next/next/no-img-element */

import { emojiDict } from "@/const/emojiDict";

export const EmojiWrap: React.FC<{
  emoji: string;
  count?: number;
}> = ({ emoji, count }) => {
  return (
    <div
      className="emojiWrap"
      style={{
        display: "flex",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(2px)",
        height: "33px",
        padding: "0 8px",
        marginRight: "4px",
        borderRadius: "6px",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <span
        className="emoji"
        style={{
          fontSize: "2em",
          color: "blue",
          fontFamily: "serif",
          fontWeight: "bold",
        }}
      >
        {(() => {
          if (Object.keys(emojiDict).includes(emoji)) {
            const emojiDef = emojiDict[emoji];
            return (
              <img
                src={emojiDef.src}
                height={emojiDef.height}
                width={emojiDef.width}
                alt={`${emojiDef.name}, ${count}`}
              />
            );
          } else {
            return emoji;
          }
        })()}
      </span>
      {count && count < 999 ? (
        <span
          className="emojiCount"
          style={{
            fontSize: "1.2em",
            color: "white",
            paddingLeft: "2px",
          }}
        >
          {count}
        </span>
      ) : (
        <span
          className="emojiCount"
          style={{
            fontSize: "1.2em",
            color: "white",
            paddingLeft: "2px",
          }}
        >
          999+
        </span>
      )}
    </div>
  );
};
