import { useCallback } from "react";

export function useSpeechSynthesis(options = {}) {
  const {
    lang = "fr-FR",
    rate = 1,
    pitch = 1,
    volume = 1,
    voiceNameIncludes,
  } = options;

  const pickVoice = () => {
    const voices = window.speechSynthesis?.getVoices?.() ?? [];
    if (!voices.length) return null;

  
    const byLang = voices.filter((v) => v.lang === lang);
    const pool = byLang.length ? byLang : voices;


    if (voiceNameIncludes?.length) {
      const found = pool.find((v) =>
        voiceNameIncludes.some((k) => v.name.toLowerCase().includes(k.toLowerCase()))
      );
      if (found) return found;
    }

    return pool[0] ?? null;
  };

  const speak = useCallback(
    (text) => {
      const t = (text ?? "").toString().trim();
      if (!t) return;

      if (!("speechSynthesis" in window)) {
        console.warn("speechSynthesis non supporté sur ce navigateur");
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(t);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      const voice = pickVoice();
      if (voice) utterance.voice = voice;

      window.speechSynthesis.speak(utterance);
    },
    [lang, rate, pitch, volume]
  );

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
}