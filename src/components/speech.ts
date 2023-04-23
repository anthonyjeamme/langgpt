export const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP"; // Set the language to Japanese

  // Find a Japanese voice if available
  const voices = window.speechSynthesis.getVoices();
  const japaneseVoice = voices.find((voice) => voice.lang === "ja-JP");
  if (japaneseVoice) {
    utterance.voice = japaneseVoice;
  }

  // Speak the text
  window.speechSynthesis.speak(utterance);
};
