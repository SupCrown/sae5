import React, { Suspense, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import cerclePng from "../assets/images/cercle.png";

// 1. DÉFINITION DE LA PALETTE (Doit être avant PalettePage)
const DetailedPallet = () => {
  const woodColor = "#bc915d";
  const cubeColor = "#8b5a2b";
  return (
    <group position={[0, 0, 0]}>
      {/* Lattes du bas */}
      {[ -0.35, 0, 0.35 ].map((z, i) => (
        <mesh key={`b-${i}`} position={[0, 0.01, z]}>
          <boxGeometry args={[1.2, 0.02, 0.1]} />
          <meshStandardMaterial color={woodColor} />
        </mesh>
      ))}
      {/* Plots (Blocks) */}
      {[-0.55, 0, 0.55].map((x) => [-0.35, 0, 0.35].map((z) => (
        <mesh key={`bl-${x}-${z}`} position={[x, 0.05, z]}>
          <boxGeometry args={[0.1, 0.08, 0.1]} />
          <meshStandardMaterial color={cubeColor} />
        </mesh>
      )))}
      {/* Traverses */}
      {[-0.55, 0, 0.55].map((x, i) => (
        <mesh key={`m-${i}`} position={[x, 0.1, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.8]} />
          <meshStandardMaterial color={woodColor} />
        </mesh>
      ))}
      {/* Plateau supérieur */}
      {[-0.35, -0.18, 0, 0.18, 0.35].map((z, i) => (
        <mesh key={`t-${i}`} position={[0, 0.12, z]}>
          <boxGeometry args={[1.2, 0.02, 0.14]} />
          <meshStandardMaterial color={woodColor} />
        </mesh>
      ))}
    </group>
  );
};

// 2. DÉFINITION DU COLIS
const Package = ({ pos, size, color }) => (
  <group position={[pos[0], 0.12 + pos[1] + (size[1] / 2), pos[2]]}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
    <lineSegments>
      <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
      <lineBasicMaterial color="black" />
    </lineSegments>
  </group>
);

// 3. PAGE PRINCIPALE
export default function PalettePage() {
  const [packages, setPackages] = useState([]);
  
  // Simulation de la position du PROCHAIN colis (le fantôme rouge)
  const nextPos = useMemo(() => {
    const newSize = [0.4, 0.3, 0.4];
    let found = false;
    let res = { x: 0, y: 0, z: 0 };
    for (let y = 0; y < 1.8 && !found; y += 0.05) {
      for (let z = -0.4 + 0.2; z <= 0.4 - 0.2 + 0.01 && !found; z += 0.1) {
        for (let x = -0.6 + 0.2; x <= 0.6 - 0.2 + 0.01 && !found; x += 0.1) {
          const collision = packages.some(p => 
            Math.abs(x - p.pos[0]) < (0.4 + p.size[0])/2 - 0.01 &&
            Math.abs(y - p.pos[1]) < (0.3 + p.size[1])/2 - 0.01 &&
            Math.abs(z - p.pos[2]) < (0.4 + p.size[2])/2 - 0.01
          );
          if (!collision) { res = {x, y, z}; found = true; }
        }
      }
    }
    return res;
  }, [packages]);

  return (
    // "fixed inset-0" force le composant à coller aux 4 coins de l'écran
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-white flex flex-col font-sans text-black">
      
      {/* BARRE ROUGE ET HEADER */}
      <div className="h-[6px] w-full bg-[#870000] shrink-0" />
      
      <div className="flex justify-between items-center px-8 py-3 border-b border-gray-100 bg-white">
        <button className="border-2 border-black px-6 py-1 text-xl font-bold hover:bg-gray-100">←</button>
        <h2 className="text-xl font-semibold text-gray-500">{packages.length}/... colis placés</h2>
      </div>

      {/* CERCLES DÉCORATIFS (Discrets) */}
      <img src={cerclePng} alt="" className="absolute top-40 right-[-100px] w-80 opacity-5 pointer-events-none" />

      {/* CONTENU PRINCIPAL */}
      <div className="flex flex-1 min-h-0 w-full">
        
        {/* ZONE GAUCHE (65% pour la 3D) */}
        <div className="w-[65%] h-full flex flex-col p-6">
          <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter">Commande 123456</h1>
          <div className="flex-1 relative bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 shadow-inner">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[12rem] font-thin text-black opacity-5 pointer-events-none">1</div>
            
            <Canvas 
              shadows 
              camera={{ 
                position: [4, 5, 4], // On recule encore un peu la caméra en augmentant x, y et z
                fov: 35              // On passe de 25 à 35 pour un effet de dézoom plus marqué
              }}
            >
              <ambientLight intensity={0.8} />
              <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
              
              <Suspense fallback={null}>
                <DetailedPallet />
                {packages.map((p, i) => <Package key={i} {...p} />)}
                
                {/* COLIS FANTÔME */}
                <group position={[nextPos.x, 0.12 + nextPos.y + 0.15, nextPos.z]}>
                  <mesh>
                    <boxGeometry args={[0.4, 0.3, 0.4]} />
                    <meshStandardMaterial color="#870000" transparent opacity={0.4} />
                  </mesh>
                </group>

                <Environment preset="city" />
                <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
              </Suspense>

              <OrbitControls 
                makeDefault 
                target={[0, 0.5, 0]} // On garde une cible un peu haute pour laisser la palette en bas
                minPolarAngle={0} 
                maxPolarAngle={Math.PI / 2.1} 
              />
            </Canvas>
          </div>
        </div>

        {/* ZONE DROITE (35%) */}
        <div className="w-[35%] h-full flex flex-col justify-center px-10 gap-12">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-[#870000] rounded-[2rem] flex items-center justify-center shadow-xl shadow-red-100">
               <svg width="50" height="50" viewBox="0 0 24 24" fill="white"><path d="M21 16.5v-9l-9-5-9 5v9l9 5 9-5zm-9-11.23l6.71 3.73-6.71 3.73-6.71-3.73 6.71-3.73z" /></svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold uppercase text-gray-900">Prochain colis :</h3>
              <div className="text-2xl mt-1 text-gray-700 space-y-1">
                <p>Zone <span className="font-black text-black">H</span></p>
                <p>Allée <span className="font-black text-black">08</span></p>
                <p>Emplacement <span className="font-black text-black">023</span></p>
                <p>Niveau <span className="font-black text-black">4</span></p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 w-full">
            <button 
              onClick={() => setPackages([...packages, { pos: [nextPos.x, nextPos.y, nextPos.z], size: [0.4, 0.3, 0.4], color: "#bc915d" }])}
              className="bg-[#870000] text-white text-3xl font-black py-10 rounded-2xl shadow-2xl hover:bg-red-900 transition-all active:scale-95 uppercase tracking-tighter"
            >
              Colis Placé
            </button>
            <button className="border-[3px] border-[#870000] text-[#870000] text-xl font-bold py-5 rounded-2xl hover:bg-red-50 transition-colors uppercase">
              Colis Manquant
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}