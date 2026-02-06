import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function PaletteViewer() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const [packages, setPackages] = useState([
    { id: 1, x: 0, y: 0.25, z: 0, width: 0.4, height: 0.3, depth: 0.4, color: '#c41e3a' }
  ]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(2, 2, 2);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Palette (base en bois)
    const paletteGroup = new THREE.Group();
    
    // Dimensions de la palette
    const paletteWidth = 1.2;
    const paletteDepth = 1.0;
    const paletteHeight = 0.15;

    // Base de la palette (planches supérieures)
    const topBoardGeometry = new THREE.BoxGeometry(paletteWidth, 0.02, paletteDepth);
    const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8B6F47 });
    const topBoard = new THREE.Mesh(topBoardGeometry, woodMaterial);
    topBoard.position.y = paletteHeight / 2;
    topBoard.castShadow = true;
    topBoard.receiveShadow = true;
    paletteGroup.add(topBoard);

    // Pieds de la palette
    const footGeometry = new THREE.BoxGeometry(0.1, paletteHeight, 0.1);
    const darkWoodMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    
    const positions = [
      [-paletteWidth/3, 0, -paletteDepth/3],
      [paletteWidth/3, 0, -paletteDepth/3],
      [-paletteWidth/3, 0, paletteDepth/3],
      [paletteWidth/3, 0, paletteDepth/3],
    ];

    positions.forEach(([x, y, z]) => {
      const foot = new THREE.Mesh(footGeometry, darkWoodMaterial);
      foot.position.set(x, y, z);
      foot.castShadow = true;
      paletteGroup.add(foot);
    });

    scene.add(paletteGroup);

    // Conteneur transparent pour visualiser les limites
    const containerGeometry = new THREE.BoxGeometry(paletteWidth, 1.5, paletteDepth);
    const containerMaterial = new THREE.MeshBasicMaterial({
      color: 0x3498db,
      transparent: true,
      opacity: 0.1,
      wireframe: false,
      side: THREE.DoubleSide
    });
    const containerEdges = new THREE.EdgesGeometry(containerGeometry);
    const containerLines = new THREE.LineSegments(
      containerEdges,
      new THREE.LineBasicMaterial({ color: 0x2980b9, linewidth: 2 })
    );
    containerLines.position.y = paletteHeight + 0.75;
    scene.add(containerLines);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // Dans votre useEffect qui gère les packages :
useEffect(() => {
    if (!sceneRef.current) return;
  
    // 1. Créer une liste des objets à supprimer pour éviter de muter l'array pendant le parcours
    const toRemove = [];
    sceneRef.current.traverse((child) => {
      if (child.userData.isPackage) {
        toRemove.push(child);
      }
    });
  
    // 2. Nettoyer proprement les ressources
    toRemove.forEach(pkg => {
      pkg.geometry.dispose();
      pkg.material.dispose();
      sceneRef.current.remove(pkg);
    });
  
    // 3. Ajouter les nouveaux paquets
    packages.forEach(pkg => {
      const geometry = new THREE.BoxGeometry(pkg.width, pkg.height, pkg.depth);
      const material = new THREE.MeshStandardMaterial({ color: pkg.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(pkg.x, pkg.y, pkg.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.isPackage = true; // Flag important
      sceneRef.current.add(mesh);
    });
  }, [packages]);

  const addPackage = () => {
    const newPackage = {
      id: packages.length + 1,
      x: (Math.random() - 0.5) * 0.8,
      y: 0.15 + packages.length * 0.35,
      z: (Math.random() - 0.5) * 0.6,
      width: 0.2 + Math.random() * 0.3,
      height: 0.2 + Math.random() * 0.3,
      depth: 0.2 + Math.random() * 0.3,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
    
    // Vérifier que le colis reste dans les limites de la palette
    const maxX = 0.6 - newPackage.width / 2;
    const maxZ = 0.5 - newPackage.depth / 2;
    newPackage.x = Math.max(-maxX, Math.min(maxX, newPackage.x));
    newPackage.z = Math.max(-maxZ, Math.min(maxZ, newPackage.z));
    
    setPackages([...packages, newPackage]);
  };

  const resetPackages = () => {
    setPackages([
      { id: 1, x: 0, y: 0.25, z: 0, width: 0.4, height: 0.3, depth: 0.4, color: '#c41e3a' }
    ]);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      <div className="bg-red-700 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Visualiseur de Palette 3D</h1>
        <p className="text-sm opacity-90">Commande 123456 - Zone H, Allée 08</p>
      </div>
      
      <div className="flex-1 relative" ref={mountRef} />
      
      <div className="bg-white p-4 shadow-lg border-t-4 border-red-700">
        <div className="flex gap-4 items-center justify-between max-w-4xl mx-auto">
          <div>
            <p className="text-sm text-gray-600">Colis placés: <span className="font-bold text-gray-900">{packages.length}</span></p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={addPackage}
              className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
            >
              + Ajouter un colis
            </button>
            <button
              onClick={resetPackages}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}