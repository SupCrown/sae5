import { useEffect, useState } from "react";
import "./App.css";
import NextProduct from "./pages/NextProduct";
import Usericone from "./assets/images/ProfileIcon.png";
import OvalVoiceVisualizer from "./components/OvalVoiceVisualizer";

export default function App() {
  const [username, setUsername] = useState("Utilisateur");
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser || "Utilisateur");
  }, []);

  const speak = (text) => {
    const t = text.trim();
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

  // Exemple : faire parler automatiquement un texte
  useEffect(() => {
    speak("Bonjour, voici le prochain produit.");
  }, []);

  return (
    <div>
      <header
        style={{
          padding: "12px 16px",
          borderBottom: "10px solid #AD211B",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ marginRight: "500px" }}>
            <OvalVoiceVisualizer isActive={isSpeaking} />
          </div>

          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            {username}
          </h3>

          <img
            src={Usericone}
            alt="User"
            style={{ width: 44, height: 44 }}
          />
        </div>
      </header>

      <main style={{ padding: "16px", height: "560px" }}>
        <NextProduct speak={speak} />
      </main>
    </div>
  );
}