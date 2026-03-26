import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import chargement from "../assets/chargement.gif";


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
        

        const res = await fetch(`/api/order/autoAssign`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // On envoie le token de session
          },
          redirect: "manual",
        });

        const data = await safeParseJson(res);
        if (cancelled) return;

        switch (res.status) {
          case 200: {
            const nbPalettes = data?.nbPalettes ?? data?.nombrePalette ?? data?.paletteCount;

            if (nbPalettes == null) {
              throw new Error("Réponse 200 mais nbPalettes manquant.");
            }

            // Navigation vers RecupCommande avec les données de la commande
            navigate("/recup-commande", {
              replace: true,
              state: {
                nbPalettes,
                order: data,
              },
            });
            break;
          }

          case 204: {
            navigate("/start", {
              replace: true,
              state: { message: "Aucune commande à assigner." },
            });
            break;
          }

          case 307: {
            navigate("/recover", {
              replace: true,
              state: {
                message: "Commande en cours détectée.",
                order: data, 
              },
            });
            break;
          }

          default: {
            const msg = data?.message || data?.error || `Erreur API: ${res.status}`;
            throw new Error(msg);
          }
        }
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Erreur de connexion au serveur");
      }
    };

    run();
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h3 className="font-bold text-[30px] font-inter">
        Chargement des données...
      </h3>

      <img src={chargement} alt="Chargement" className="w-40 h-40 mt-10" />

      {error && (
        <div className="mt-10 p-4 bg-red-900/50 border border-red-500 rounded-lg max-w-xl text-center">
          <p className="text-red-300 font-bold uppercase text-xs tracking-widest mb-1">Erreur Serveur</p>
          <p className="text-white">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-sm underline opacity-70 hover:opacity-100"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}