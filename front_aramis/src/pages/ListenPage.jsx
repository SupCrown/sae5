import { useState } from "react";
import OvalVoiceVisualizer from "../components/OvalVoiceVisualizer";

export default function ListenPage() {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (value) => {
    const t = value.trim();
    if (!t) return;

    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(t);
    u.lang = "fr-FR";
    u.rate = 1;
    u.pitch = 1;

    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Écris et appuie sur Entrée</h1>

      <OvalVoiceVisualizer isActive={isSpeaking} />

      <input
        className="px-4 py-2 rounded-lg text-black w-[340px] py-3"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") speak(text);
        }}
        placeholder="Tape ici puis Entrée"
      />
    </div>
  );
}
