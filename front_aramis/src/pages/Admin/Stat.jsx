import { useRef, useState, useEffect } from "react";

function Stat() {
  const [periode, setPeriode] = useState("day");
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const scrollRef = useRef(null);
  const trackRef = useRef(null);

  const fallbackData = {
    day: [
      { nom: "Blaise Damien", nbCommandes: "945", nbPalettes: "582", nbColis: "5634" },
      { nom: "Roméo Délégué", nbCommandes: "945", nbPalettes: "582", nbColis: "5634" },
      { nom: "Kebaili Josua", nbCommandes: "984", nbPalettes: "562", nbColis: "5633" },
      { nom: "Test 1", nbCommandes: "150", nbPalettes: "70", nbColis: "1200" },
    ],
    total: [
      { nom: "Blaise Damien", nbCommandes: "92400", nbPalettes: "38200", nbColis: "352000" },
      { nom: "Roméo Délégué", nbCommandes: "88700", nbPalettes: "36500", nbColis: "341000" },
      { nom: "Kebaili Josua", nbCommandes: "95100", nbPalettes: "39400", nbColis: "361500" },
      { nom: "Test 1", nbCommandes: "150", nbPalettes: "70", nbColis: "1200" },
    ],
  };

  const [statsData, setStatsData] = useState(fallbackData);

  const rows = statsData[periode] || [];

  const trackHeight = 420;
  const thumbHeight = 80;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://147.93.55.68/user/stats", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("API indisponible");
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          setStatsData(fallbackData);
          return;
        }

        const dayStats = data.map((item, index) => ({
          id: item.user?.id ?? index + 1,
          nom:
            `${item.user?.firstname ?? ""} ${item.user?.lastname ?? ""}`.trim() ||
            "Utilisateur",
          nbCommandes: item.ordersNumberOfTheDay ?? 0,
          nbPalettes: item.supportsNumberOfTheDay ?? 0,
          nbColis: item.productsNumberOfTheDay ?? 0,
        }));

        const totalStats = data.map((item, index) => ({
          id: item.user?.id ?? index + 1,
          nom:
            `${item.user?.firstname ?? ""} ${item.user?.lastname ?? ""}`.trim() ||
            "Utilisateur",
          nbCommandes: item.ordersNumberOfAllTime ?? 0,
          nbPalettes: item.supportsNumberOfAllTime ?? 0,
          nbColis: item.productsNumberOfAllTime ?? 0,
        }));

        setStatsData({
          day: dayStats.length ? dayStats : fallbackData.day,
          total: totalStats.length ? totalStats : fallbackData.total,
        });
      } catch (error) {
        console.warn("API stats indisponible -> fallback fake data");
        setStatsData(fallbackData);
      }
    };

    fetchStats();
  }, []);

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    setThumbTop(0);
  }, [periode, statsData]);

  return (
    <div className="flex flex-col items-center pt-[30px]">
      <div className="mb-[35px]">
        <select
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
          className="border-[3px] border-black bg-white text-[22px] font-bold px-[18px] py-[6px]"
        >
          <option value="day">Du jour</option>
          <option value="total">Total</option>
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
                  const rowClass =
                    idx % 2 === 0 ? "bg-[#f7f7f7]" : "bg-[#dcdcdc]";

                  return (
                    <tr key={r.id ?? idx} className={rowClass}>
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