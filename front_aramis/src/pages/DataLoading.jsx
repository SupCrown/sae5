import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import chargement from "../assets/chargement.gif";

const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL ?? "";

async function safeParseJson(res) {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function DataLoading() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setError(null);

        const PreparateurID = localStorage.getItem("PreparateurID");
        if (!PreparateurID) throw new Error("PreparateurID introuvable.");

        const res = await fetch(`${API_BASE_URL}/order/autoAssign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ PreparateurID }),
          redirect: "manual",
        });

        const data = await safeParseJson(res);
        if (cancelled) return;

        switch (res.status) {
          case 200: {
            
            const nbPalettes =
              data?.nbPalettes ?? data?.nombrePalette ?? data?.paletteCount;

            if (nbPalettes == null) {
              throw new Error("Réponse 200 mais nbPalettes manquant dans la réponse API.");
            }

            
            navigate("RecupCommande", {
              replace: true,
              state: {
                nbPalettes,
                order: data,
              },
            });
            break;
          }

          case 204: {
            
            navigate("StartCommande", {
              replace: true,
              state: { message: "Aucune commande à assigner." },
            });
            break;
          }

          case 307: {
           
            navigate("/recover", {
              replace: true,
              state: {
                message: "Commande en cours détectée, reprise après fermeture.",
                order: data, 
              },
            });
            break;
          }

          default: {
            const msg =
              data?.message ||
              data?.error ||
              `Réponse inattendue de l'API: ${res.status}`;
            throw new Error(msg);
          }
        }
      } catch (e) {
        if (cancelled) return;
        const msg = e?.message || "Erreur inconnue";
        setError(msg);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white">
      <h3 className="font-bold font-inter text-[30px] m-[5px]">
        Chargement des données
      </h3>

      <img src={chargement} alt="Chargement" className="w-40 h-40 mt-[70px]" />

      {error && (
        <div className="mt-6 max-w-xl text-center">
          <p className="text-red-300 font-semibold">Erreur</p>
          <p className="text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
}