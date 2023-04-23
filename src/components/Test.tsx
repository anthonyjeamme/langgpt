import { Ear } from "@phosphor-icons/react";
import { useState } from "react";

const Test = () => {
  const currentWord = "ナルト";

  const [isListening, setIsListening] = useState(false);

  const [state, setState] = useState<
    "pending" | "listening" | "success" | "failed"
  >("pending");

  return (
    <div className="text-center">
      <h1 className="text-6xl font-japanese mb-8">{currentWord}</h1>
      <button
        className={`${
          state === "success"
            ? "bg-green-600"
            : state === "failed"
            ? "bg-red-600"
            : state === "listening"
            ? "bg-sky-500"
            : "bg-sky-400"
        } rounded h-10 w-52 text-center`}
        onClick={() => {
          if (!["pending", "failed"].includes(state)) return;
          setState("listening");

          const SpeechRecognition =
            // @ts-ignore
            window.SpeechRecognition || webkitSpeechRecognition;

          const recognition = new SpeechRecognition();
          recognition.lang = "ja-JP";
          recognition.continuous = true;
          recognition.interimResults = true;

          let spokenText = "";

          recognition.onresult = function (event: any) {
            const last = event.results.length - 1;
            spokenText = event.results[last][0].transcript;

            if (spokenText.length === currentWord.length) {
              recognition.stop();
            }
          };

          recognition.onend = function () {
            if (spokenText === currentWord) {
              console.log("BRAVO ! ");

              setState("success");
            } else {
              setState("failed");

              console.log("Oups, vous avez dit", spokenText);
            }
          };

          recognition.start();
        }}
      >
        {state === "success" ? (
          "Bravo"
        ) : state === "failed" ? (
          "Oups, réessayer"
        ) : state === "listening" ? (
          <Ear className="m-auto" />
        ) : (
          "Parler"
        )}
      </button>
    </div>
  );
};
export default Test;
