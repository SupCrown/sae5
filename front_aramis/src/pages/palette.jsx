import React, { Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import cerclePng from "../assets/images/cercle.png";

// 1. DÉFINITION DE LA PALETTE RÉELLE (1.2m x 0.8m)
const DetailedPallet = () => {
  const woodColor = "#bc915d";
  const cubeColor = "#8b5a2b";
  return (
    <group position={[0.6, 0, 0.4]}>
      {[ 0.05, 0.4, 0.75 ].map((z, i) => (
        <mesh key={`b-${i}`} position={[0, 0.01, z - 0.4]}>
          <boxGeometry args={[1.2, 0.02, 0.1]} />
          <meshStandardMaterial color={woodColor} />
        </mesh>
      ))}
      {[0.05, 0.6, 1.15].map((x) => [0.05, 0.4, 0.75].map((z) => (
        <mesh key={`bl-${x}-${z}`} position={[x - 0.6, 0.05, z - 0.4]}>
          <boxGeometry args={[0.1, 0.08, 0.1]} />
          <meshStandardMaterial color={cubeColor} />
        </mesh>
      )))}
      {[0.07, 0.23, 0.4, 0.57, 0.73].map((z, i) => (
        <mesh key={`t-${i}`} position={[0, 0.12, z - 0.4]}>
          <boxGeometry args={[1.2, 0.02, 0.14]} />
          <meshStandardMaterial color={woodColor} />
        </mesh>
      ))}
    </group>
  );
};

// 2. COMPOSANT COLIS
const Package = ({ pos, size, color, opacity = 1 }) => (
  <group position={[pos[0] + (size[0]/2), 0.14 + pos[1] + (size[1]/2), pos[2] + (size[2]/2)]}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.8} transparent={opacity < 1} opacity={opacity} />
    </mesh>
    <lineSegments>
      <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
      <lineBasicMaterial color="black" />
    </lineSegments>
  </group>
);

// 3. PAGE PRINCIPALE
export default function PalettePage() {
  const [allData, setAllData] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [placedPackages, setPlacedPackages] = useState([]);

  // Récupération des données API
  useEffect(() => {
    fetch("http://147.93.55.68/order/testPlacement/1")
      .then(res => res.json())
      .then(data => {
        const formatted = data[0].map((box, index) => ({
          orderIndex: index + 1, // Pour afficher Colis 1, Colis 2...
          id: box.productId,
          pos: [box.x / 100, box.z / 100, box.y / 100], 
          size: [box.dx / 100, box.dz / 100, box.dy / 100],
          color: "#bc915d"
        }));
        setAllData(formatted);
      })
      .catch(err => console.error("Erreur API:", err));
  }, []);

  const nextPackage = allData[currentIndex];

  const handlePlacePackage = () => {
    if (nextPackage) {
      setPlacedPackages([...placedPackages, nextPackage]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-white flex flex-col font-sans text-black">
      <div className="h-[6px] w-full bg-[#870000] shrink-0" />
      
      {/* HEADER STATISTIQUES */}
      <div className="flex justify-between items-center px-8 py-3 border-b border-gray-100 bg-white">
        <button className="border-2 border-black px-6 py-1 text-xl font-bold hover:bg-gray-100">←</button>
        <h2 className="text-xl font-semibold text-gray-500">
          {placedPackages.length} / {allData.length} colis placés
        </h2>
      </div>

      <img src={cerclePng} alt="" className="absolute top-40 right-[-100px] w-80 opacity-5 pointer-events-none" />

      <div className="flex flex-1 min-h-0 w-full">
        
        {/* ZONE GAUCHE : VISUALISATION 3D */}
        <div className="w-[65%] h-full flex flex-col p-6">
          <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter italic text-[#870000]">ARAMIS OPTIMIZER</h1>
          <div className="flex-1 relative bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 shadow-inner">
            <Canvas shadows camera={{ position: [3, 3, 3], fov: 40 }}>
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 10, 10]} intensity={1} castShadow />
              
              <Suspense fallback={null}>
                <DetailedPallet />
                
                {/* Colis déjà validés */}
                {placedPackages.map((p, i) => (
                  <Package key={`placed-${i}`} {...p} />
                ))}
                
                {/* Colis fantôme (en cours) */}
                {nextPackage && (
                  <Package 
                    pos={nextPackage.pos} 
                    size={nextPackage.size} 
                    color="#870000" 
                    opacity={0.4} 
                  />
                )}

                <Environment preset="city" />
                <ContactShadows position={[0.6, 0, 0.4]} opacity={0.3} scale={6} blur={2} />
              </Suspense>

              <OrbitControls makeDefault target={[0.6, 0.3, 0.4]} maxPolarAngle={Math.PI / 2.1} />
            </Canvas>
          </div>
        </div>

        {/* ZONE DROITE : INTERFACE DE PRÉPARATION */}
        <div className="w-[35%] h-full flex flex-col justify-center px-10 gap-10 border-l border-gray-50">
          
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-[#870000] rounded-[2rem] flex items-center justify-center shadow-xl shadow-red-100 text-white font-black text-4xl">
                {nextPackage ? nextPackage.orderIndex : "✓"}
              </div>
              <div>
                <h3 className="text-2xl font-bold uppercase text-gray-400 leading-none">Colis actuel</h3>
                <p className="text-4xl font-black text-black tracking-tighter">
                  ID: {nextPackage?.id || "TERMINÉ"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-gray-500 font-bold uppercase text-sm">Dimensions</span>
                <span className="font-black italic">
                  {nextPackage ? `${Math.round(nextPackage.size[0]*100)}x${Math.round(nextPackage.size[2]*100)}x${Math.round(nextPackage.size[1]*100)} cm` : "-"}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-500 font-bold uppercase text-sm">Zone de ramasse</span>
                <span className="font-black text-[#870000]">Allée 04 - H12</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <button 
              disabled={!nextPackage}
              onClick={handlePlacePackage}
              className={`text-white text-3xl font-black py-10 rounded-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-tighter ${
                !nextPackage 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-[#870000] hover:bg-black hover:shadow-red-200'
              }`}
            >
              {nextPackage ? "Confirmer le placement" : "Palette Terminée"}
            </button>
            
            <button 
              className="border-[3px] border-black text-black text-xl font-bold py-5 rounded-2xl hover:bg-gray-100 transition-colors uppercase tracking-widest"
              onClick={() => window.location.reload()}
            >
              Réinitialiser
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}