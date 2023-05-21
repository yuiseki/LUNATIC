"use client";

import { useLocalStorage } from "@/hooks/localStorage";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [userCssStyle, setUserCssStyle] = useLocalStorage<string>(
    "lunatic-user-css-style",
    ""
  );

  const onClickFixMe = useCallback(() => {
    setUserCssStyle("");
  }, [setUserCssStyle]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, [mounted, userCssStyle, setUserCssStyle]);
  if (!mounted) return null;

  return (
    <main suppressHydrationWarning style={{ margin: "25px auto" }}>
      <button
        style={{ fontSize: "10em", marginBottom: "25px" }}
        onClick={onClickFixMe}
      >
        fixme
      </button>
      <div
        suppressHydrationWarning
        style={{ whiteSpace: "pre-wrap", backgroundColor: "white" }}
      >
        {userCssStyle.split("\n").map((line, idx) => {
          return <div key={idx}>{line}</div>;
        })}
      </div>
    </main>
  );
}
