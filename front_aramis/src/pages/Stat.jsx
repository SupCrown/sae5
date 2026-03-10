import { useRef, useState, useEffect } from "react";

function Stat() {
  const [periode, setPeriode] = useState("heure");
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const scrollRef = useRef(null);
  const trackRef = useRef(null);

  const data = {
    heure: [
      { nom: "Blaise Damien", nbCommandes: "945", nbPalettes: "582", nbColis: "5634" },
      { nom: "Roméo Délégué", nbCommandes: "945", nbPalettes: "582", nbColis: "5634" },
      { nom: "Kebaili Josua", nbCommandes: "984", nbPalettes: "562", nbColis: "5633" },
      { nom: "LSD Josua", nbCommandes: "9999", nbPalettes: "99999", nbColis: "9999999" },
      { nom: "Test 1", nbCommandes: "150", nbPalettes: "70", nbColis: "1200" },
      { nom: "Test 2", nbCommandes: "151", nbPalettes: "71", nbColis: "1210" },
      { nom: "Test 3", nbCommandes: "152", nbPalettes: "72", nbColis: "1220" },
      { nom: "Test 4", nbCommandes: "153", nbPalettes: "73", nbColis: "1230" },
    ],
    jour: [
      { nom: "Blaise Damien", nbCommandes: "4200", nbPalettes: "1800", nbColis: "15400" },
      { nom: "Roméo Délégué", nbCommandes: "3980", nbPalettes: "1720", nbColis: "14950" },
      { nom: "Kebaili Josua", nbCommandes: "4510", nbPalettes: "1910", nbColis: "16020" },
      { nom: "LSD Josua", nbCommandes: "5200", nbPalettes: "2200", nbColis: "18200" },
      { nom: "Test 1", nbCommandes: "150", nbPalettes: "70", nbColis: "1200" },
      { nom: "Test 2", nbCommandes: "151", nbPalettes: "71", nbColis: "1210" },
      { nom: "Test 3", nbCommandes: "152", nbPalettes: "72", nbColis: "1220" },
      { nom: "Test 4", nbCommandes: "153", nbPalettes: "73", nbColis: "1230" },
    ],
    semaine: [
      { nom: "Blaise Damien", nbCommandes: "22500", nbPalettes: "9500", nbColis: "87400" },
      { nom: "Roméo Délégué", nbCommandes: "21700", nbPalettes: "9100", nbColis: "85200" },
      { nom: "Kebaili Josua", nbCommandes: "23100", nbPalettes: "9800", nbColis: "89600" },
      { nom: "LSD Josua", nbCommandes: "24800", nbPalettes: "10300", nbColis: "92100" },
      { nom: "Test 1", nbCommandes: "150", nbPalettes: "70", nbColis: "1200" },
      { nom: "Test 2", nbCommandes: "151", nbPalettes: "71", nbColis: "1210" },
      { nom: "Test 3", nbCommandes: "152", nbPalettes: "72", nbColis: "1220" },
      { nom: "Test 4", nbCommandes: "153", nbPalettes: "73", nbColis: "1230" },
    ],
    mois: [
      { nom: "Blaise Damien", nbCommandes: "92400", nbPalettes: "38200", nbColis: "352000" },
      { nom: "Roméo Délégué", nbCommandes: "88700", nbPalettes: "36500", nbColis: "341000" },
      { nom: "Kebaili Josua", nbCommandes: "95100", nbPalettes: "39400", nbColis: "361500" },
      { nom: "LSD Josua", nbCommandes: "102000", nbPalettes: "42100", nbColis: "389000" },
      { nom: "Test 1", nbCommandes: "150", nbPalettes: "70", nbColis: "1200" },
      { nom: "Test 2", nbCommandes: "151", nbPalettes: "71", nbColis: "1210" },
      { nom: "Test 3", nbCommandes: "152", nbPalettes: "72", nbColis: "1220" },
      { nom: "Test 4", nbCommandes: "153", nbPalettes: "73", nbColis: "1230" },
    ],
  };

  const rows = data[periode];

  const trackHeight = 420;
  const thumbHeight = 80;

  const updateThumbFromScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const maxScroll = container.scrollHeight - container.clientHeight;
    const maxThumbTop = trackHeight - thumbHeight;

    if (maxScroll <= 0) {
      setThumbTop(0);
      return;
    }

    const ratio = container.scrollTop / maxScroll;
    setThumbTop(ratio * maxThumbTop);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !trackRef.current || !scrollRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      let newTop = e.clientY - trackRect.top - thumbHeight / 2;

      const maxThumbTop = trackHeight - thumbHeight;
      newTop = Math.max(0, Math.min(newTop, maxThumbTop));

      setThumbTop(newTop);

      const container = scrollRef.current;
      const maxScroll = container.scrollHeight - container.clientHeight;
      const ratio = maxThumbTop === 0 ? 0 : newTop / maxThumbTop;

      container.scrollTop = ratio * maxScroll;
    };

    const stopDrag = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [isDragging]);

  // remet le tableau en haut quand on change de période
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    setThumbTop(0);
  }, [periode]);

  return (
    <div className="bg-[#f3f3f3] flex flex-col items-center pt-[30px]">
      <div className="mb-[35px]">
        <select
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
          className="border-[3px] border-black bg-white text-[22px] font-bold px-[18px] py-[6px]"
        >
          <option value="heure">Par Heure</option>
          <option value="jour">Par Jour</option>
          <option value="semaine">Par Semaine</option>
          <option value="mois">Par Mois</option>
        </select>
      </div>

      <div className="w-[94%] max-w-[1100px] relative">
        <div className="border-[3px] border-black bg-white">
          <table className="w-full table-fixed text-center border-collapse">
            <thead>
              <tr className="border-b-[6px] border-black">
                <th className="text-left pl-[18px] py-[14px] text-[18px] font-bold">
                  Nom Prénom
                </th>
                <th className="py-[14px] text-[18px] font-bold">
                  Nombre de commandes
                </th>
                <th className="py-[14px] text-[18px] font-bold">
                  Nombre de palettes
                </th>
                <th className="py-[14px] text-[18px] font-bold">
                  Nombre de colis
                </th>
              </tr>
            </thead>
          </table>

          <div
            ref={scrollRef}
            onScroll={updateThumbFromScroll}
            className="max-h-[420px] overflow-y-scroll scrollbar-hide"
          >
            <table className="w-full table-fixed text-center border-collapse">
              <tbody>
                {rows.map((r, idx) => {
                  const rowClass = idx % 2 === 0 ? "bg-[#f7f7f7]" : "bg-[#dcdcdc]";

                  return (
                    <tr key={idx} className={rowClass}>
                      <td className="text-left pl-[18px] py-[35px] text-[18px]">
                        {r.nom}
                      </td>
                      <td className="py-[35px] text-[28px] font-bold">
                        {r.nbCommandes}
                      </td>
                      <td className="py-[35px] text-[28px] font-bold">
                        {r.nbPalettes}
                      </td>
                      <td className="py-[35px] text-[28px] font-bold">
                        {r.nbColis}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div
          ref={trackRef}
          className="absolute right-[-40px] top-[60px] h-[420px] w-[14px] bg-[#d9d9d9] rounded-[10px]"
        >
          <div
            onMouseDown={handleMouseDown}
            className="absolute w-[14px] h-[80px] bg-[#b32017] rounded-[10px] cursor-pointer"
            style={{ top: thumbTop }}
          />
        </div>
      </div>
    </div>
  );
}

export default Stat;