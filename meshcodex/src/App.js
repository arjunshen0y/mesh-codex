import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'react-hdr-loader';
import { Mesh } from 'three';
import { BoxGeometry, MeshBasicMaterial } from 'three';

function App() {
  const [model, setModel] = useState(null);
  const [hdri, setHdri] = useState(null);
  const [background, setBackground] = useState(0x000000);
  const [wireframe, setWireframe] = useState(false);
  const [scale, setScale] = useState(1);
  const [cube, setCube] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load('scene.gltf', (gltf) => {
      setModel(gltf.scene);
    });

    const hdriLoader = new HDRLoader();
    hdriLoader.load('meadow_2_4k.hdr', (hdri) => {
      setHdri(hdri);
    });
  }, []);

  useFrame(() => {
    if (model) {
      model.position.x += 0.01;
      model.rotation.y += 0.01;
    }
  });

  const handleAddCube = () => {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0xffffff });
    const cube = new Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    setCube(cube);
  };

  const handleRemoveCube = () => {
    setCube(null);
  };

  const handleScale = (e) => {
    setScale(e.target.value);
  };

  const handleWireframe = () => {
    setWireframe(!wireframe);
  };

  const handleBackground = (e) => {
    setBackground(e.target.value);
  };

  return (
    <div>
      <Canvas
        style={{
          width: '100%',
          height: '100vh',
          backgroundColor: `rgba(0, 0, 0, ${background / 255})`,
        }}
      >
        {hdri && (
          <ambientLight intensity={0.1} color={hdri.color} />
        )}
        {hdri && (
          <directionalLight
            castShadow
            position={[0, 0, 5]}
            intensity={0.5}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={10}
            shadow-camera-near={0.5}
            shadow-camera-focalLength={5}
          />
        )}
        {model && (
          <primitive object={model} />
        )}
        {cube && (
          <primitive object={cube} />
        )}
        <OrbitControls ref={(controls) => {
          controls.maxPolarAngle = Math.PI / 2;
          controls.minPolarAngle = Math.PI / 2;
        }} />
      </Canvas>
      <div>
        <button onClick={handleAddCube}>Add Cube</button>
        <button onClick={handleRemoveCube}>Remove Cube</button>
        <button onClick={handleWireframe}>Toggle Wireframe</button>
        <button onClick={() => setBackground(0xffffff)}>Change Background</button>
        <input
          type="range"
          min={0}
          max={1}
          value={scale}
          onChange={handleScale}
        />
        <select
          onChange={(e) => {
            setHdri(e.target.value);
          }}
        >
          <option value="meadow_2_4k.hdr">HDRI 1</option>
          <option value="hangar_interior_4k.hdr">HDRI 2</option>
          <option value="hotel_rooftop_balcony_4k.hdr">HDRI 3</option>
        </select>
      </div>
    </div>
  );
}

export default App;
