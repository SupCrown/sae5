import { useEffect, useRef, useState } from "react";

export default function OvalVoiceVisualizer({ isActive }) {
  const rafRef = useRef(null);
  const [levels, setLevels] = useState(() => Array.from({ length: 14 }, () => 0.4));

  useEffect(() => {
    const tick = () => {
      setLevels((prev) =>
        prev.map((v, i) => {
          const wave = (Math.sin(Date.now() / 120 + i * 0.7) + 1) / 2;
          const rand = Math.random() * 0.7;
          const target = 0.25 + wave * rand;
          return v + (target - v) * 0.35;
        })
      );
      rafRef.current = requestAnimationFrame(tick);
    };

    if (isActive) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
      setLevels(Array.from({ length: 14 }, () => 0.4));
    }

    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [isActive]);

  return (
    <div
      style={{
        width: 200,
        height: 90,
        borderRadius: 9999,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 6,
            height: "35%",
          }}
        >
          {levels.map((lvl, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: Math.round(lvl * 80),
                background: "#fff",
                borderRadius: 9999,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}