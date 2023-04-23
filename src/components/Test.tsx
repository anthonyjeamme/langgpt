import { Ear } from "@phosphor-icons/react";
import { useState } from "react";

const Test = () => {
  const currentWord = "ナルト";

  const [success, setSuccess] = useState(false);
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="text-center">
      <h1 className="text-6xl font-japanese mb-8">{currentWord}</h1>
      <button
        className={`${
          success ? "bg-green-600" : isListening ? "bg-red-600" : "bg-sky-500"
        } rounded h-10 w-52 text-center`}
        onClick={() => {
          if (isListening) return;
          setIsListening(true);

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
            setIsListening(false);
            if (spokenText === currentWord) {
              console.log("BRAVO ! ");

              setSuccess(true);
            } else {
              console.log("Oups, vous avez dit", spokenText);
            }
          };

          recognition.start();
        }}
      >
        {success ? (
          "Bravo"
        ) : isListening ? (
          <Ear className="m-auto" />
        ) : (
          "Parler"
        )}
      </button>
    </div>
  );
};
export default Test;
