import { useRef } from "react";
import cerclePng from "../assets/images/cercle.png"; // adapte si besoin

export default function AuthScreen() {
  const inputs = [useRef(null), useRef(null), useRef(null)];

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    if (value && index < 2) inputs[index + 1].current.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs[index - 1].current.focus();
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white flex flex-col items-center">

      {/*TRAIT ROUGE EN HAUT */}
      <div className="absolute top-0 left-0 w-full h-[6px] bg-[#870000]" />

      {/*Cercles décoratifs */}
      <img
        src={cerclePng}
        alt=""
        className="absolute top-[100px] left-1/2 -translate-x-1/2 w-[500px] opacity-10 pointer-events-none select-none"
      />
      <img
        src={cerclePng}
        alt=""
        className="absolute bottom-[80px] left-[250px] w-[420px] opacity-10 pointer-events-none select-none"
      />
      <img
        src={cerclePng}
        alt=""
        className="absolute bottom-[360px] right-[80px] w-[420px] opacity-10 pointer-events-none select-none"
      />

      {/*Contenu principal */}
      <div className="flex flex-col items-center mt-[160px] gap-16 z-10">
        <h1 className="text-[80px] font-bold">Identification</h1>

        <div className="flex gap-10">
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              ref={inputs[i]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-[95px] h-[115px] bg-gray-200 text-center text-[60px] font-bold rounded-md shadow-inner focus:outline-none focus:ring-4 focus:ring-[#870000]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}