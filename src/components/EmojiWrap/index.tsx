/* eslint-disable @next/next/no-img-element */
const emojiDict: {
  [key: string]: {
    src: string;
    name: string;
    height: number;
    width: number;
  };
} = {
  ":igyo:": {
    src: "./emoji/igyo.png",
    name: "偉業",
    height: 23,
    width: 23,
  },
  ":tiken:": {
    src: "./emoji/tiken.png",
    name: "知見",
    height: 23,
    width: 23,
  },
  ":dekai:": {
    src: "./emoji/dekai.png",
    name: "デカい",
    height: 23,
    width: 23,
  },
  ":chian_saikou:": {
    src: "./emoji/chian_saikou.gif",
    name: "治安最高",
    height: 23,
    width: 23,
  },
  ":desyo:": {
    src: "./emoji/desyo.png",
    name: "寿司",
    height: 23,
    width: 23,
  },
  ":mog:": {
    src: "./emoji/mog.png",
    name: "もぐ…",
    height: 23,
    width: 23,
  },
  ":saikou:": {
    src: "./emoji/saikou.png",
    name: "最高",
    height: 23,
    width: 23,
  },
  ":muzu:": {
    src: "./emoji/muzu.png",
    name: "難",
    height: 23,
    width: 23,
  },
  ":wakaran:": {
    src: "./emoji/wakaran.png",
    name: "わからん",
    height: 23,
    width: 23,
  },
  ":send_money:": {
    src: "./emoji/send_money.png",
    name: "レターパックで現金送れ",
    height: 23,
    width: 210,
  },
  ":is_all_scam:": {
    src: "./emoji/is_all_scam.png",
    name: "はすべて詐欺です",
    height: 23,
    width: 160,
  },
};

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
