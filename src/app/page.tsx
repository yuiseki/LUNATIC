"use client";

import { DialogueElementItem } from "@/components/DialogueElementItem";
import { TextInput } from "@/components/TextInput";
import { emojiDict } from "@/const/emojiDict";
import { useLocalStorage } from "@/hooks/localStorage";
import { DialogueElement } from "@/types/DialogueElement";
import { nextPostJson } from "@/utils/nextPostJson";
import { scrollToBottom } from "@/utils/scrollToBottom";
import { sleep } from "@/utils/sleep";
import { useCallback, useEffect, useState } from "react";

const greeting = `対話型自己書き換えウェブサイト。
ルナティック、起動しました。

私には、ユーザーの指示に従って、このウェブサイトの見た目を変更する能力があります。
あなたの指示によっては、このウェブサイトを完全に操作不能なほどに破壊することも可能ですので、ご注意ください。

ユーザーの指示を待機しています…`;

const disclaimer = `
本ウェブサイトを利用した場合は、以下の事項に同意したものとみなされます。
免責事項：本ウェブサイトの開発運用者は、あなたが本ウェブサイトを利用することによって生ずる、いかなる損害に対しても、一切の責任を負いません。
`;

const defaultUserCssStyle = `
`;

export default function Home() {
  const [userCssStyle, setUserCssStyle] = useLocalStorage<string>(
    "lunatic-user-css-style",
    ""
  );

  const [requesting, setRequesting] = useState(false);

  const [inputText, setInputText] = useState("");
  // dialogue state
  const [dialogueList, setDialogueList] = useState<DialogueElement[]>([]);
  const [lazyInserting, setLazyInserting] = useState(false);
  const [insertingText, setInsertingText] = useState(greeting);
  const insertNewDialogue = useCallback(
    (newDialogueElement: DialogueElement, lazy?: boolean) => {
      if (!lazy) {
        setDialogueList((prev) => {
          return [...prev, newDialogueElement];
        });
      } else {
        setLazyInserting(true);
        const lazyNewDialogueElement = {
          ...newDialogueElement,
          text: "",
        };
        setDialogueList((prev) => {
          return [...prev, lazyNewDialogueElement];
        });
        setInsertingText(newDialogueElement.text);
      }
    },
    []
  );
  const [lazyInsertingInitialized, setLazyInsertingInitialized] =
    useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  useEffect(() => {
    if (lazyInserting) {
      if (!lazyInsertingInitialized) {
        const newIntervalId = setInterval(() => {
          setDialogueList((prev) => {
            const last = prev[prev.length - 1];
            last.text = insertingText.slice(0, last.text.length + 1);
            scrollToBottom();
            if (insertingText.length === last.text.length) {
              setLazyInserting(false);
              setLazyInsertingInitialized(false);
              setInsertingText("");
              if (!requesting) {
                setResponding(false);
              }
            }
            return [...prev.slice(0, prev.length - 1), last];
          });
        }, 50);
        setIntervalId(newIntervalId);
        setLazyInsertingInitialized(true);
      }
    } else {
      clearInterval(intervalId);
      setIntervalId(undefined);
    }
    return () => {
      if (!lazyInserting) {
        clearInterval(intervalId);
        setIntervalId(undefined);
      }
    };
  }, [
    intervalId,
    lazyInserting,
    lazyInsertingInitialized,
    insertingText,
    requesting,
  ]);

  // communication state
  const [responding, setResponding] = useState(false);
  const [pastMessages, setPastMessages] = useState<
    { messages: Array<any> } | undefined
  >();
  const onSubmit = useCallback(async () => {
    setResponding(true);

    const newInputText = inputText.trim();
    setInputText("");
    console.log(newInputText);
    insertNewDialogue({
      who: "user",
      text: newInputText,
      emojiList: Object.keys(emojiDict)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .map((emojiName) => {
          return {
            name: emojiName,
            count: Math.floor(Math.random() * (1000 - 0 + 1) + 0),
          };
        }),
    });
    await sleep(200);
    scrollToBottom();

    setRequesting(true);
    const surfaceRes = await nextPostJson("/api/lunatic/surface", {
      query: newInputText,
      pastMessagesJsonString: pastMessages
        ? JSON.stringify(pastMessages)
        : undefined,
    });

    const surfaceResJson: {
      surface: string;
      history: { messages: Array<any> };
    } = await surfaceRes.json();
    setPastMessages(surfaceResJson.history);
    insertNewDialogue(
      {
        who: "assistant",
        text: surfaceResJson.surface,
        emojiList: Object.keys(emojiDict)
          .sort(() => Math.random() - 0.5)
          .slice(0, 4)
          .map((emojiName) => {
            return {
              name: emojiName,
              count: Math.floor(Math.random() * (1000 - 0 + 1) + 0),
            };
          }),
      },
      true
    );
    setResponding(true);

    setRequesting(true);
    const cssRes = await nextPostJson("/api/lunatic/css", {
      pastMessagesJsonString: JSON.stringify(surfaceResJson.history),
      currentCss: userCssStyle,
    });
    const cssResJson = await cssRes.json();
    console.log(cssResJson.css);
    if (cssResJson.css) {
      const newUserCssStyle = cssResJson.css.split("```")[1];
      setUserCssStyle(newUserCssStyle);
    }
    setResponding(false);
    setRequesting(false);
  }, [
    inputText,
    insertNewDialogue,
    pastMessages,
    setUserCssStyle,
    userCssStyle,
  ]);

  const onClickEmergency = useCallback(() => {
    setDialogueList([]);
    setPastMessages(undefined);
    setUserCssStyle(defaultUserCssStyle);
    setMounted(false);
  }, [setUserCssStyle]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      const emojiNames = Object.keys(emojiDict)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      insertNewDialogue(
        {
          who: "assistant",
          text: greeting,
          emojiList: emojiNames.map((emojiName) => {
            return {
              name: emojiName,
              count: Math.floor(Math.random() * (1000 - 0 + 1) + 0),
            };
          }),
        },
        true
      );
      if (!userCssStyle || userCssStyle.length === 0) {
        setUserCssStyle(defaultUserCssStyle);
      }
    }
  }, [mounted, userCssStyle, setUserCssStyle, insertNewDialogue]);
  if (!mounted) return null;

  return (
    <>
      <main suppressHydrationWarning className="main">
        <div
          className="dialogueListWrap"
          style={{
            width: "100%",
            margin: "0 auto 5em",
          }}
        >
          {dialogueList.map((dialogueElement, dialogueIndex) => {
            return (
              <DialogueElementItem
                key={dialogueIndex}
                dialogueElement={dialogueElement}
                dialogueIndex={dialogueIndex}
                isResponding={
                  (responding || lazyInserting) &&
                  dialogueIndex === dialogueList.length - 1
                }
              />
            );
          })}
        </div>
        <div
          className="textInputWrap"
          style={{
            position: "absolute",
            bottom: "1em",
            left: 0,
            width: "100%",
            margin: "auto",
            zIndex: 1000,
          }}
        >
          <TextInput
            disabled={responding || lazyInserting}
            placeholder={
              "文字をすごく大きくして。背景を虹色にして。アイコンを回転させて。"
            }
            inputText={inputText}
            setInputText={setInputText}
            onSubmit={onSubmit}
          />
        </div>
      </main>
      <div className="emergencyButtonWrap">
        <button onClick={onClickEmergency}>緊急脱出</button>
      </div>
      <style suppressHydrationWarning>{userCssStyle}</style>
    </>
  );
}
