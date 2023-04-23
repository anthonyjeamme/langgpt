import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";

type TSoundsContext = {
  play: (soundName: string) => void;
};

const soundsContext = createContext<TSoundsContext>({
  play: () => undefined,
});

export const SoundsContext: FC<{ children: ReactNode }> = ({ children }) => {
  const audiosRef = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    preloadSounds();
  }, []);

  function preloadSounds() {
    const sounds = [
      {
        name: "pop",
        path: "/sounds/pop.mp3",
      },
      {
        name: "success",
        path: "/sounds/success.wav",
      },
    ];

    for (const sound of sounds) {
      const audio = new Audio();
      audio.src = sound.path;
      audiosRef.current[sound.name] = audio;
    }
  }

  const play = (soundName: string) => {
    //

    if (!audiosRef.current[soundName]) return;

    audiosRef.current[soundName].play();
  };

  return (
    <soundsContext.Provider
      value={{
        play,
      }}
    >
      {children}
    </soundsContext.Provider>
  );
};

export const useSounds = () => useContext(soundsContext);
