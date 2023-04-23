import { Ear } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { speak } from "./speech";
import {
  SoundsContext,
  useSounds,
} from "./contexts/SoundsContext/SoundsContext";

const Test = () => {
  const [currentWord, setCurrentWord] = useState<{
    id: string;
    jap: string;
    romaji: string;
  }>(narutoCharaters[0]);

  const scoresRef = useRef<Record<string, number>>({});

  return (
    <SoundsContext>
      <VoiceStep
        key={currentWord.romaji}
        word={currentWord}
        handleNext={(score) => {
          if (!scoresRef.current[currentWord.id])
            scoresRef.current[currentWord.id] = 0;

          scoresRef.current[currentWord.id] = Math.max(
            0,
            scoresRef.current[currentWord.id] + score
          );

          setCurrentWord(pickRandomWord(currentWord.id, scoresRef.current));
        }}
      />
    </SoundsContext>
  );

  function pickRandomWord(
    currentWordId: string,
    scores: Record<string, number>
  ) {
    const list = narutoCharaters
      .filter(({ id }) => !scores[id] || scores[id] < 4)
      .filter(({ id }) => id !== currentWordId)
      .slice(0, 4);

    return getRandomElementFromArray(list);
  }
};
export default Test;

function getRandomElementFromArray(array: any[]) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const VoiceStep = ({
  word,
  handleNext,
}: {
  word: {
    jap: string;
    romaji: string;
  };
  handleNext: (score: number) => void;
}) => {
  const sounds = useSounds();

  const [state, setState] = useState<
    "pending" | "listening" | "success" | "failed"
  >("pending");

  return (
    <div className="text-center w-full flex flex-col">
      <div className="flex-1 flex items-center justify-center mb-5">
        <h1 className="text-6xl font-japanese mb-8 flex justify-center">
          {word.jap.split("").map((caracter, index) => (
            <div className="relative" key={index}>
              {state === "failed" && (
                <div className="absolute bottom-full text-xl text-center w-full">
                  {getCaracterRomaji(caracter)}
                </div>
              )}
              {caracter}
            </div>
          ))}
        </h1>
      </div>

      <div className="flex">
        {state === "failed" || state === "success" ? (
          <>
            <button
              className=" flex-1"
              onClick={() => {
                speak(word.jap);
                sounds.play("pop");
              }}
            >
              Ecouter
            </button>

            <button
              onClick={() => {
                sounds.play("pop");
                handleNext(state === "success" ? 1 : -1);
              }}
              className={`${
                state === "success" ? "bg-green-600" : "bg-red-600"
              } rounded h-16 text-center ml-6 flex-1`}
            >
              {state === "success" ? "Bravo !" : "Oups, "} Continuer
            </button>
          </>
        ) : (
          <>
            <button
              className="flex-1 h-16"
              onClick={() => {
                speak(word.jap);
                setState("failed");
                sounds.play("pop");
              }}
            >
              Je ne sais pas
            </button>

            <button
              className={`${
                state === "listening" ? "bg-sky-500" : "bg-sky-400"
              } rounded h-16  flex-1 text-center ml-6`}
              onClick={() => {
                if (!["pending", "failed"].includes(state)) return;
                setState("listening");

                sounds.play("pop");

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
                  spokenText = hiraganaToKatakana(
                    event.results[last][0].transcript
                  );

                  console.log(spokenText);
                  if (spokenText.length === word.jap.length) {
                    recognition.stop();
                  }
                };

                recognition.onend = function () {
                  const katakana = spokenText;

                  if (katakana === word.jap) {
                    setState("success");

                    sounds.play("success");
                  } else {
                    setState("failed");

                    console.log("Oups, vous avez dit", katakana);
                  }
                };

                recognition.start();
              }}
            >
              {state === "listening" ? <Ear className="m-auto" /> : "Parler"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const getCaracterRomaji = (caracter: string) => {
  return katakanas.find(({ jap }) => jap === caracter)?.romaji;
};

const narutoCharaters = [
  { id: "0", jap: "ナルト", romaji: "na-ru-to" },
  { id: "1", jap: "サスケ", romaji: "sa-su-ke" },
  { id: "2", jap: "サクラ", romaji: "sa-ku-ra" },
  { id: "3", jap: "カカシ", romaji: "ka-ka-shi" },
  { id: "4", jap: "ヒナタ", romaji: "hi-na-ta" },
  { id: "5", jap: "シカマル", romaji: "shi-ka-ma-ru" },
  { id: "6", jap: "イノ", romaji: "i-no" },
  { id: "7", jap: "キバ", romaji: "ki-ba" },
  { id: "8", jap: "シノ", romaji: "shi-no" },
  { id: "9", jap: "チョウジ", romaji: "cho-u-ji" },
  { id: "10", jap: "ネジ", romaji: "ne-ji" },
  { id: "11", jap: "テンテン", romaji: "ten-ten" },
  { id: "12", jap: "ガアラ", romaji: "ga-a-ra" },
  { id: "13", jap: "カンクロウ", romaji: "kan-ku-ro-u" },
  { id: "14", jap: "テマリ", romaji: "te-ma-ri" },
  { id: "15", jap: "ジライヤ", romaji: "ji-ra-i-ya" },
  { id: "16", jap: "ツナデ", romaji: "tsu-na-de" },
  { id: "17", jap: "オロチマル", romaji: "o-ro-chi-ma-ru" },
  { id: "18", jap: "イタチ", romaji: "i-ta-chi" },
  { id: "19", jap: "キサメ", romaji: "ki-sa-me" },
  { id: "20", jap: "デイダラ", romaji: "de-i-da-ra" },
  { id: "21", jap: "ヒダン", romaji: "hi-dan" },
  { id: "22", jap: "カクズ", romaji: "ka-ku-zu" },
  { id: "23", jap: "ペイン", romaji: "pe-i-n" },
  { id: "24", jap: "トビ", romaji: "to-bi" },
  { id: "25", jap: "ゼツ", romaji: "ze-tsu" },
  { id: "26", jap: "マダラ", romaji: "ma-da-ra" },
];

const katakanas = [
  { jap: "ア", romaji: "a" },
  { jap: "イ", romaji: "i" },
  { jap: "ウ", romaji: "u" },
  { jap: "エ", romaji: "e" },
  { jap: "オ", romaji: "o" },
  { jap: "カ", romaji: "ka" },
  { jap: "キ", romaji: "ki" },
  { jap: "ク", romaji: "ku" },
  { jap: "ケ", romaji: "ke" },
  { jap: "コ", romaji: "ko" },
  { jap: "サ", romaji: "sa" },
  { jap: "シ", romaji: "shi" },
  { jap: "ス", romaji: "su" },
  { jap: "セ", romaji: "se" },
  { jap: "ソ", romaji: "so" },
  { jap: "タ", romaji: "ta" },
  { jap: "チ", romaji: "chi" },
  { jap: "ツ", romaji: "tsu" },
  { jap: "テ", romaji: "te" },
  { jap: "ト", romaji: "to" },
  { jap: "ナ", romaji: "na" },
  { jap: "ニ", romaji: "ni" },
  { jap: "ヌ", romaji: "nu" },
  { jap: "ネ", romaji: "ne" },
  { jap: "ノ", romaji: "no" },
  { jap: "ハ", romaji: "ha" },
  { jap: "ヒ", romaji: "hi" },
  { jap: "フ", romaji: "fu" },
  { jap: "ヘ", romaji: "he" },
  { jap: "ホ", romaji: "ho" },
  { jap: "マ", romaji: "ma" },
  { jap: "ミ", romaji: "mi" },
  { jap: "ム", romaji: "mu" },
  { jap: "メ", romaji: "me" },
  { jap: "モ", romaji: "mo" },
  { jap: "ヤ", romaji: "ya" },
  { jap: "ユ", romaji: "yu" },
  { jap: "ヨ", romaji: "yo" },
  { jap: "ラ", romaji: "ra" },
  { jap: "リ", romaji: "ri" },
  { jap: "ル", romaji: "ru" },
  { jap: "レ", romaji: "re" },
  { jap: "ロ", romaji: "ro" },
  { jap: "ワ", romaji: "wa" },
  { jap: "ヰ", romaji: "wi" },
  { jap: "ヱ", romaji: "we" },
  { jap: "ヲ", romaji: "wo" },
];

function hiraganaToKatakana(hiraganaString: string) {
  const hiraganaStart = "ぁ".charCodeAt(0);
  const hiraganaEnd = "ん".charCodeAt(0);
  const katakanaShift = "ァ".charCodeAt(0) - hiraganaStart;

  let katakanaString = "";

  for (let i = 0; i < hiraganaString.length; i++) {
    const charCode = hiraganaString.charCodeAt(i);
    if (charCode >= hiraganaStart && charCode <= hiraganaEnd) {
      katakanaString += String.fromCharCode(charCode + katakanaShift);
    } else {
      katakanaString += hiraganaString[i];
    }
  }

  return katakanaString;
}
