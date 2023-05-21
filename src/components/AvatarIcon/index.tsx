/* eslint-disable @next/next/no-img-element */

export const AvatarIcon: React.FC<{ who: string }> = ({ who }) => {
  return (
    <div
      className={`avatarIcon ${
        who === "assistant" ? "avatarIconAssistant" : "avatarIconHuman"
      }`}
    >
      {who === "assistant" ? (
        <img
          width={30}
          height={30}
          src="https://i.gyazo.com/1e58e82090fc6f9b140e23fc03faefc7.png"
          alt="ai icon"
        />
      ) : (
        <img
          width={30}
          height={30}
          src="https://i.gyazo.com/8960181a3459473ada71a8718df8785b.png"
          alt="user icon"
        />
      )}
    </div>
  );
};
