import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import chargement from "../assets/chargement.gif";

async function safeParseJson(res) {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;
  try { return await res.json(); } catch { return null; }
}

export default function DataLoading() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setError(null);
        const res = await fetch(`/api/order/autoAssign`, { method: "GET" });
        const data = await safeParseJson(res);

        if (cancelled) return;

        switch (res.status) {
          case 200:
          case 307: {
            // Dans la spec, la commande est valide si on a un orderID ou un type
            if (!data || (!data.orderID && !data.type)) {
              throw new Error("Réponse valide mais données de commande corrompues.");
            }

            // On envoie vers RecupCommande. 
            // Si c'est un 307 (crash), on peut passer un flag pour l'affichage.
            navigate("/recup-commande", {
              replace: true,
              state: {
                order: data,
                isRecovery: res.status === 307,
                nbPalettes: 1 // Par défaut 1, ou à extraire de 'data' si l'info existe
              },
            });
            break;
          }

          case 204: {
            // Aucune commande : on va vers une page d'attente (StartCommande)
            navigate("/start", {
              replace: true,
              state: { message: "Aucune commande disponible pour le moment." },
            });
            break;
          }

          default: {
            const msg = data?.message || `Erreur serveur : ${res.status}`;
            throw new Error(msg);
          }
        }
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "Erreur de connexion");
      }
    };

    run();
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h3 className="font-bold text-[30px]">Assignation d'une mission...</h3>
      <img src={chargement} alt="Chargement" className="w-40 h-40 mt-10" />
      {error && (
        <div className="mt-10 p-4 bg-red-900/50 border border-red-500 rounded-lg text-center">
          <p className="text-white">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 underline">Réessayer</button>
        </div>
      )}
    </div>
  );
}