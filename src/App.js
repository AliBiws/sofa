import * as THREE from 'three'
import { useLayoutEffect, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, AccumulativeShadows, RandomizedLight, OrbitControls, Environment, useGLTF } from '@react-three/drei'


export default function App() {
  const [model, setModel] = useState('model1');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [model]);


  return (
    <>
    <select className='selector' onChange={(e) => setModel(e.target.value)} value={model}>
      <option value="model1">Model 1</option>
      <option value="model2">Model 2</option>
    </select>
    {isLoading && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>
          Loading...
        </div>
    )}
    <Canvas shadows camera={{ position: [4, 2.5, 8], fov: 35 }}>
      <ambientLight />
      <directionalLight position={[0, 0, 2]} intensity={5} />
      <group position={[0, -1.2, 0]}>
        <Center top>
          <Suzi model={model} rotation={[0, 0.5, 0]} scale={2} onLoad={() => setIsLoading(false)} />
        </Center>
        <AccumulativeShadows temporal frames={100} color="orange" colorBlend={2} toneMapped={true} alphaTest={0.75} opacity={2} scale={12}>
          <RandomizedLight intensity={Math.PI} amount={8} radius={4} ambient={0.5} position={[5, 5, 2]} bias={0.001} />
        </AccumulativeShadows>
      </group>
      <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      <Environment preset="city" />
    </Canvas>
    </>
  )
}

function Suzi({ model,onLoad, ...props }) {
  const { scene: scene1 } = useGLTF('https://tarahgraph.ir/files/1.glb');
  const { scene: scene2 } = useGLTF('https://tarahgraph.ir/files/2.glb');
  
  let scene;
  switch (model) {
    case 'model2':
      scene = scene2;
      break;
    case 'model1':
    default:
      scene = scene1;
  }

  useLayoutEffect(() => {
    scene.traverse((obj) => obj.isMesh && (obj.receiveShadow = obj.castShadow = true));
    onLoad();
  }, [scene, onLoad]);

  return <primitive object={scene} {...props} />
}

