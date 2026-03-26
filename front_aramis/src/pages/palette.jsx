import React, { Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useOrder } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";

// Composants 3D (Inchangés)
const DetailedPallet = () => {
  const woodColor = "#bc915d";
  const cubeColor = "#8b5a2b";
  return (
    <group position={[0.6, 0, 0.4]}>
      {[0.05, 0.4, 0.75].map((z, i) => (
        <mesh key={`b-${i}`} position={[0, 0.01, z - 0.4]}>
          <boxGeometry args={[1.2, 0.02, 0.1]} />
          <meshStandardMaterial color={woodColor} />
        </mesh>
      ))}
      {[0.05, 0.6, 1.15].map((x) =>
        [0.05, 0.4, 0.75].map((z) => (
          <mesh key={`bl-${x}-${z}`} position={[x - 0.6, 0.05, z - 0.4]}>
            <boxGeometry args={[0.1, 0.08, 0.1]} />
            <meshStandardMaterial color={cubeColor} />
          </mesh>
        ))
      )}
      {[0.07, 0.23, 0.4, 0.57, 0.73].map((z, i) => (
        <mesh key={`t-${i}`} position={[0, 0.12, z - 0.4]}>
          <boxGeometry args={[1.2, 0.02, 0.14]} />
          <meshStandardMaterial color={woodColor} />
        </mesh>
      ))}
    </group>
  );
};

const Package = ({ pos, size, color, opacity = 1 }) => (
  <group position={[pos[0] + size[0] / 2, 0.14 + pos[1] + size[1] / 2, pos[2] + size[2] / 2]}>
    <mesh>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.8} transparent={opacity < 1} opacity={opacity} />
    </mesh>
    <lineSegments>
      <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
      <lineBasicMaterial color="#444444" />
    </lineSegments>
  </group>
);

// ... (garder les imports et composants 3D au dessus)

export default function PalettePage() {
  const { currentOrder, validateStep, loading, error } = useOrder();
  const navigate = useNavigate();
  
  // État local des colis sur LA palette actuelle
  const [placedPackages, setPlacedPackages] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  // On ajoute un flag pour bloquer l'affichage pendant la transition
  const [isTransitioning, setIsTransitioning] = useState(false);

  const type = currentOrder?.type; 
  const step = currentOrder?.step;

  // --- GESTION DU CHANGEMENT DE SUPPORT (CORRIGÉE) ---
  useEffect(() => {
    const handleAutoSupport = async () => {
      // Si on reçoit NEW_SUPPORT et qu'on n'est pas déjà en train de valider
      if (type === "NEW_SUPPORT" && !isValidating) {
        setIsTransitioning(true); // On "coupe" l'affichage
        setIsValidating(true);
        
        try {
          // 1. On vide IMPÉRATIVEMENT la liste locale avant l'appel API
          setPlacedPackages([]); 
          
          // 2. On valide auprès de l'API
          await validateStep(false);
          
          console.log("Nouveau support validé avec succès.");
        } catch (err) {
          console.error("Erreur transition support:", err);
        } finally {
          setIsValidating(false);
          setIsTransitioning(false); // On réactive l'affichage
        }
      }
    };

    handleAutoSupport();

    if (type === "FINISHED") {
      setTimeout(() => navigate("/loading"), 500);
    }
  }, [type, validateStep, navigate]); // On ne met pas isValidating ici pour éviter les boucles

  const formatPackage = (s) => ({
    id: s.productId,
    pos: [s.x / 100, s.z / 100, s.y / 100],
    size: [s.dx / 100, s.dz / 100, s.dy / 100],
    color: "#bc915d",
  });

  const handlePlacePackage = async () => {
    // Si on est en transition ou qu'on valide, on bloque le clic
    if (!step || isValidating || isTransitioning || type === "NEW_SUPPORT") return;
    
    setIsValidating(true);
    try {
      // On ajoute au visuel AVANT de valider pour éviter le sentiment de lag
      const newPkg = formatPackage(step);
      setPlacedPackages(prev => [...prev, newPkg]);
      
      await validateStep(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleMissingPackage = async () => {
    if (!step || isValidating || isTransitioning || type === "NEW_SUPPORT") return;
    if (window.confirm("Confirmer que ce colis est manquant ?")) {
      setIsValidating(true);
      try {
        await validateStep(true);
      } finally {
        setIsValidating(false);
      }
    }
  };

  // Écran de transition strict pour éviter les "trous" de données
  if (loading || type === "NEW_SUPPORT" || isTransitioning) return (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-[#870000] border-t-transparent rounded-full animate-spin mb-4"></div>
      <span className="font-bold text-[#870000] text-2xl italic tracking-widest">
        PRÉPARATION DU NOUVEAU SUPPORT...
      </span>
    </div>
  );
// --- ZONE DE DEBUG ---
console.group(" État de la Commande");
console.log("Statut actuel (Type):", type);
console.log("ID Commande:", currentOrder?.orderID);
console.log("Support n°:", currentOrder?.supportCount);

// 1. Liste des colis déjà validés sur ce support (Historique API)
console.log(" Colis validés (API):", currentOrder?.placedProducts || []);

// 2. Liste des colis posés localement (Session actuelle)
console.log(" Colis posés localement:", placedPackages);

// 3. Le colis que tu dois poser MAINTENANT
if (step) {
    console.log(" PROCHAIN COLIS À POSER:", {
        id: step.productId,
        coords: `X:${step.x} Y:${step.y} Z:${step.z}`,
        dims: `${step.dx}x${step.dz}x${step.dy}`
    });
} else {
    console.log(" PROCHAIN COLIS : Aucun (Attente ou Fin)");
}

// 4. Alerte si NEW_SUPPORT pour vérifier si le step est vide ou non
if (type === "NEW_SUPPORT") {
    console.warn("CHANGEMENT DE SUPPORT EN COURS : L'API devrait envoyer un step vide ou le 1er colis du nouveau support.");
}
console.groupEnd();
// ---------------------
  return (
    <>
      <style>{CSS}</style>
      <div className="W">
        <div className="W-bar" />
        <header className="W-head">
          <span className="W-oid">COMMANDE <span>#{currentOrder?.orderID || "---"}</span></span>
          <span className="W-cnt">SUPPORT N°{currentOrder?.supportCount || 1}</span>
        </header>

        <div className="W-body">
          <div className="W-L">
            <span className="W-cnt">
              {placedPackages.length} COLIS SUR CE SUPPORT
            </span>
            <div className="W-cv">
              <Canvas camera={{ position: [3, 3, 3], fov: 40 }}>
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 10, 10]} intensity={1.2} />
                <Suspense fallback={null}>
                  <DetailedPallet />
                  
                  {/* Les colis validés renvoyés par l'API (historique) */}
                  {currentOrder?.placedProducts?.map((p, i) => (
                    <Package key={`hist-${i}`} {...formatPackage(p)} />
                  ))}
                  
                  {/* Les colis placés manuellement durant cette session */}
                  {placedPackages.map((p, i) => (
                    <Package key={`local-${i}`} {...p} />
                  ))}
                  
                  {/* Le colis fantôme à placer (étape actuelle) */}
                  {step && <Package {...formatPackage(step)} color="#870000" opacity={0.4} />}
                  
                  <Environment preset="apartment" />
                </Suspense>
                <OrbitControls makeDefault target={[0.6, 0.3, 0.4]} />
              </Canvas>
            </div>
          </div>

          <div className="W-div" />

          <div className="W-R">
            <div>
              <p className="W-sl">Instruction de pose</p>
              <div className="W-hero">
                <div className={`W-sb ${step ? "on" : "off"}`}>
                  {isValidating ? "..." : "!"}
                </div>
                <div>
                  <div className="W-pl">RÉFÉRENCE PRODUIT</div>
                  <div className="W-pv">{step?.productId || "CHARGEMENT..."}</div>
                </div>
              </div>
            </div>

            <div className="W-grid">
              <div className="W-row">
                <span className="W-k">Dimensions</span>
                <span className="W-v">{step ? `${step.dx}×${step.dz}×${step.dy} cm` : "—"}</span>
              </div>
              <div className="W-row">
                <span className="W-k">Emplacement</span>
                <span className="W-v" style={{color: '#870000'}}>{currentOrder?.location || "—"}</span>
              </div>
            </div>

            <div className="W-acts">
              <button 
                className="W-bp" 
                disabled={!step || isValidating || isTransitioning} 
                onClick={handlePlacePackage}
              >
                {isValidating ? "VALIDATION..." : "↓ CONFIRMER DÉPOSE"}
              </button>
              
              <button 
                className="W-bm" 
                disabled={!step || isValidating || isTransitioning} 
                onClick={handleMissingPackage}
              >
                Colis manquant
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ... (Garder le même CSS qu'avant)

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&family=DM+Mono:wght@400;500&display=swap');
  .W { font-family:'Barlow Condensed',sans-serif; background:#fff; color:#111; width:100%; height:100%; display:flex; flex-direction:column; overflow:hidden; }
  .W-bar  { height:5px; background:#870000; flex-shrink:0; }
  .W-head { display:flex; justify-content:space-between; align-items:center; padding:12px 32px; border-bottom:2px solid #e0e0e0; flex-shrink:0; }
  .W-oid  { font-family:'DM Mono',monospace; font-size:.83rem; color:#999; letter-spacing:.08em; }
  .W-oid span { color:#444; font-weight:500; }
  .W-body { display:flex; flex:1; min-height:0; }
  .W-L { width:62%; display:flex; flex-direction:column; padding:20px 28px 24px; gap:12px; background:#fff; }
  .W-cnt { font-family:'DM Mono',monospace; font-size:.72rem; color:#999; letter-spacing:.1em; border:1.5px solid #e0e0e0; padding:3px 10px; border-radius:2px; align-self:flex-start; }
  .W-cv  { flex:1; position:relative; border-radius:10px; overflow:hidden; background:#f4f4f4; border:2px solid #e0e0e0; }
  .W-div { width:2px; background:linear-gradient(180deg,transparent 0%,#d0d0d0 12%,#d0d0d0 88%,transparent 100%); flex-shrink:0; }
  .W-R { width:38%; display:flex; flex-direction:column; justify-content:space-between; padding:28px; background:#f8f8f8; gap:18px; }
  .W-sl { font-family:'DM Mono',monospace; font-size:.62rem; letter-spacing:.2em; color:#aaa; text-transform:uppercase; margin-bottom:10px; }
  .W-hero { display:flex; align-items:center; gap:18px; }
  .W-sb   { width:66px; height:66px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:2rem; font-weight:900; flex-shrink:0; transition:background .3s; }
  .W-sb.on   { background:#870000; color:#fff; }
  .W-sb.off  { background:#e6f4ea; color:#2e7d32; }
  .W-pl { font-size:.72rem; color:#aaa; letter-spacing:.15em; font-family:'DM Mono',monospace; margin-bottom:3px; }
  .W-pv { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:2.5rem; line-height:1; color:#111; }
  .W-grid { background:#fff; border:2px solid #e8e8e8; border-radius:10px; padding:0 18px; display:flex; flex-direction:column; }
  .W-row  { display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:1px solid #f0f0f0; }
  .W-row:last-child { border-bottom:none; }
  .W-k { font-family:'DM Mono',monospace; font-size:.68rem; color:#aaa; letter-spacing:.12em; text-transform:uppercase; }
  .W-v { font-weight:700; font-size:1.1rem; color:#111; }
  .W-acts { display:flex; flex-direction:column; gap:10px; }
  .W-bp { border:none; border-radius:10px; padding:22px; background:#870000; color:#fff; font-family:'Barlow Condensed',sans-serif; font-style:italic; font-weight:900; font-size:2rem; text-transform:uppercase; cursor:pointer; }
  .W-bp:disabled { background:#efefef; color:#bbb; cursor:not-allowed; }
  .W-bm { background:transparent; border:2px solid #f0d0a0; color:#a06000; border-radius:10px; padding:14px; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:1rem; letter-spacing:.18em; text-transform:uppercase; cursor:pointer; margin-top: 5px; }
  .W-bm:disabled { opacity: 0.5; cursor: not-allowed; }
`;