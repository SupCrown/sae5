import React, { Suspense, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useOrder } from "../context/OrderContext";

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

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&family=DM+Mono:wght@400;500&display=swap');

  .W { font-family:'Barlow Condensed',sans-serif; background:#fff; color:#111; width:100%; height:100%; display:flex; flex-direction:column; overflow:hidden; }

  .W-bar  { height:5px; background:#870000; flex-shrink:0; }

  .W-head { display:flex; justify-content:space-between; align-items:center; padding:12px 32px; border-bottom:2px solid #e0e0e0; flex-shrink:0; }
  .W-back { background:transparent; border:2px solid #ccc; color:#111; padding:7px 20px; font-family:'Barlow Condensed',sans-serif; font-size:1.1rem; font-weight:700; letter-spacing:.05em; cursor:pointer; transition:border-color .15s,color .15s; }
  .W-back:hover { border-color:#870000; color:#870000; }
  .W-oid  { font-family:'DM Mono',monospace; font-size:.83rem; color:#999; letter-spacing:.08em; }
  .W-oid span { color:#444; font-weight:500; }

  .W-body { display:flex; flex:1; min-height:0; }

  /* LEFT */
  .W-L { width:62%; display:flex; flex-direction:column; padding:20px 28px 24px; gap:12px; background:#fff; }
  .W-cnt { font-family:'DM Mono',monospace; font-size:.72rem; color:#999; letter-spacing:.1em; border:1.5px solid #e0e0e0; padding:3px 10px; border-radius:2px; align-self:flex-start; }
  .W-cv  { flex:1; position:relative; border-radius:10px; overflow:hidden; background:#f4f4f4; border:2px solid #e0e0e0; }
  .W-hint{ position:absolute; bottom:12px; left:14px; font-family:'DM Mono',monospace; font-size:.6rem; color:#c0c0c0; letter-spacing:.1em; pointer-events:none; z-index:10; }

  /* DIVIDER */
  .W-div { width:2px; background:linear-gradient(180deg,transparent 0%,#d0d0d0 12%,#d0d0d0 88%,transparent 100%); flex-shrink:0; }

  /* RIGHT */
  .W-R { width:38%; display:flex; flex-direction:column; justify-content:space-between; padding:28px; background:#f8f8f8; gap:18px; }
  .W-sl { font-family:'DM Mono',monospace; font-size:.62rem; letter-spacing:.2em; color:#aaa; text-transform:uppercase; margin-bottom:10px; }

  .W-hero { display:flex; align-items:center; gap:18px; }
  .W-sb   { width:66px; height:66px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:2rem; font-weight:900; flex-shrink:0; transition:background .3s; }
  .W-sb.on  { background:#870000; color:#fff; }
  .W-sb.off { background:#e6f4ea; color:#2e7d32; }
  .W-pl { font-size:.72rem; color:#aaa; letter-spacing:.15em; font-family:'DM Mono',monospace; margin-bottom:3px; }
  .W-pv { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:2.5rem; line-height:1; color:#111; }

  .W-grid { background:#fff; border:2px solid #e8e8e8; border-radius:10px; padding:0 18px; display:flex; flex-direction:column; }
  .W-row  { display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:1px solid #f0f0f0; }
  .W-row:last-child { border-bottom:none; }
  .W-k { font-family:'DM Mono',monospace; font-size:.68rem; color:#aaa; letter-spacing:.12em; text-transform:uppercase; }
  .W-v { font-weight:700; font-size:1.1rem; color:#111; }
  .W-zp{ background:#fff0f0; border:1.5px solid #870000; color:#870000; padding:4px 14px; border-radius:4px; font-size:1rem; font-weight:700; letter-spacing:.06em; }

  .W-acts { display:flex; flex-direction:column; gap:10px; }
  .W-bp { border:none; border-radius:10px; padding:22px; font-family:'Barlow Condensed',sans-serif; font-style:italic; font-weight:900; font-size:2rem; letter-spacing:-.01em; text-transform:uppercase; cursor:pointer; transition:background .15s,transform .1s; }
  .W-bp:not(:disabled) { background:#870000; color:#fff; box-shadow:0 4px 18px rgba(135,0,0,.2); }
  .W-bp:not(:disabled):hover { background:#a00000; }
  .W-bp:not(:disabled):active { transform:scale(.98); }
  .W-bp:disabled { background:#efefef; color:#bbb; cursor:not-allowed; box-shadow:none; }

  .W-bm { background:transparent; border:2px solid #f0d0a0; color:#a06000; border-radius:10px; padding:14px; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:1rem; letter-spacing:.18em; text-transform:uppercase; cursor:pointer; transition:border-color .15s,color .15s,background .15s; }
  .W-bm:not(:disabled):hover { border-color:#d07010; color:#b05000; background:#fff8ee; }
  .W-bm:disabled { border-color:#eee; color:#ccc; cursor:not-allowed; }

  .W-prog { display:flex; flex-direction:column; gap:6px; }
  .W-pm  { display:flex; justify-content:space-between; font-family:'DM Mono',monospace; font-size:.62rem; color:#bbb; letter-spacing:.1em; }
  .W-trk { height:4px; background:#e8e8e8; border-radius:2px; overflow:hidden; }
  .W-fil { height:100%; background:#870000; border-radius:2px; transition:width .4s ease; }
`;

export default function PalettePage() {
  const { currentOrder, validateStep, loading, error } = useOrder();
  const [placedPackages, setPlacedPackages] = useState([]);

  const step = currentOrder?.currentStep;

  const formatPackage = (s) => ({
    id: s.productId,
    pos: [s.x / 100, s.z / 100, s.y / 100],
    size: [s.dx / 100, s.dz / 100, s.dy / 100],
    color: "#bc915d",
  });

  const handlePlacePackage = async () => {
    if (step) {
      setPlacedPackages([...placedPackages, formatPackage(step)]);
      await validateStep(false);
    }
  };

  const handleMissingPackage = async () => {
    if (!step) return;
    if (window.confirm("Confirmer que ce colis est manquant ?")) {
      await validateStep(true);
    }
  };

  if (loading)
    return (
      <div style={{ display:'flex', height:'100%', alignItems:'center', justifyContent:'center', background:'#fff' }}>
        <span style={{ fontFamily:'Barlow Condensed,sans-serif', fontStyle:'italic', fontWeight:900, color:'#870000', fontSize:'2rem' }}>
          CHARGEMENT...
        </span>
      </div>
    );

  if (error)
    return (
      <div style={{ display:'flex', height:'100%', alignItems:'center', justifyContent:'center', background:'#fff' }}>
        <span style={{ color:'#c00', fontWeight:'bold', fontSize:'1.2rem' }}>{error}</span>
      </div>
    );

  const total = placedPackages.length + (step ? 1 : 0);
  const progress = total > 0 ? Math.round((placedPackages.length / total) * 100) : 0;

  return (
    <>
      <style>{CSS}</style>
      <div className="W">
        <div className="W-bar" />

        <header className="W-head">
          <span className="W-oid">COMMANDE <span>#{currentOrder?.orderId || "---"}</span></span>
        </header>

        <div className="W-body">

          {/* ── GAUCHE ── */}
          <div className="W-L">
            <span className="W-cnt">{placedPackages.length} COLIS PLACÉ{placedPackages.length !== 1 ? "S" : ""}</span>
            <div className="W-cv">
              <Canvas camera={{ position: [3, 3, 3], fov: 40 }}>
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 10, 10]} intensity={1.2} />
                <Suspense fallback={null}>
                  <DetailedPallet />
                  {placedPackages.map((p, i) => <Package key={`placed-${i}`} {...p} />)}
                  {step && <Package {...formatPackage(step)} color="#870000" opacity={0.4} />}
                  <Environment preset="apartment" />
                </Suspense>
                <OrbitControls makeDefault target={[0.6, 0.3, 0.4]} maxPolarAngle={Math.PI / 2.1} />
              </Canvas>
              <span className="W-hint">DRAG TO ROTATE · SCROLL TO ZOOM</span>
            </div>
          </div>

          {/* ── SÉPARATEUR ── */}
          <div className="W-div" />

          {/* ── DROITE ── */}
          <div className="W-R">
            <div>
              <p className="W-sl">Colis en cours</p>
              <div className="W-hero">
                <div className={`W-sb ${step ? "on" : "off"}`}>{step ? "!" : "✓"}</div>
                <div>
                  <div className="W-pl">PRODUCT ID</div>
                  <div className="W-pv">{step?.productId || "TERMINÉ"}</div>
                </div>
              </div>
            </div>

            <div className="W-grid">
              <div className="W-row">
                <span className="W-k">Dimensions</span>
                <span className="W-v">{step ? `${step.dx} × ${step.dz} × ${step.dy} cm` : "—"}</span>
              </div>
              <div className="W-row">
                <span className="W-k">Zone</span>
                {step ? <span className="W-zp">{step.zone}</span> : <span className="W-v">—</span>}
              </div>
              <div className="W-row">
                <span className="W-k">Position X / Y</span>
                <span className="W-v">{step ? `${step.x} / ${step.y}` : "—"}</span>
              </div>
            </div>

            <div className="W-acts">
              <button className="W-bp" disabled={!step} onClick={handlePlacePackage}>
                {step ? "↓ Placer le colis" : "Mission terminée"}
              </button>
              <button className="W-bm" disabled={!step} onClick={handleMissingPackage}>
                ⚠ Colis manquant
              </button>
            </div>

            <div className="W-prog">
              <div className="W-pm">
                <span>PROGRESSION</span>
                <span>{progress}% — {placedPackages.length} placé{placedPackages.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="W-trk">
                <div className="W-fil" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}