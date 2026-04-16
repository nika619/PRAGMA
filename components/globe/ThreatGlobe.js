'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Earth Sphere ─── */
function Earth() {
  const meshRef = useRef();
  const atmosphereRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });

  // Create a simple earth-like procedural texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Ocean base
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate landmasses from simplified shapes
    ctx.fillStyle = '#0d2847';
    // North America
    ctx.beginPath();
    ctx.ellipse(250, 150, 120, 80, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // South America
    ctx.beginPath();
    ctx.ellipse(320, 310, 50, 100, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Europe/Africa
    ctx.beginPath();
    ctx.ellipse(530, 180, 60, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(540, 300, 50, 90, 0, 0, Math.PI * 2);
    ctx.fill();
    // Asia
    ctx.beginPath();
    ctx.ellipse(700, 160, 150, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    // Australia
    ctx.beginPath();
    ctx.ellipse(800, 340, 50, 35, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 32) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group>
      {/* Earth */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          emissive="#00e5ff"
          emissiveIntensity={0.05}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Outer glow ring */}
      <mesh scale={[1.12, 1.12, 1.12]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#7c4dff"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

/* ─── Attack Arc ─── */
function AttackArc({ start, end, color = '#ff1744', speed = 1 }) {
  const lineRef = useRef();
  const particleRef = useRef();
  const progress = useRef(0);

  const curve = useMemo(() => {
    const startVec = latLngToVec3(start[0], start[1], 2.02);
    const endVec = latLngToVec3(end[0], end[1], 2.02);
    const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
    const dist = startVec.distanceTo(endVec);
    mid.normalize().multiplyScalar(2 + dist * 0.5);
    return new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(64), [curve]);

  useFrame((_, delta) => {
    progress.current += delta * speed * 0.3;
    if (progress.current > 1) progress.current = 0;

    if (particleRef.current) {
      const pos = curve.getPoint(progress.current);
      particleRef.current.position.copy(pos);
    }

    // Animate line draw
    if (lineRef.current) {
      const drawCount = Math.floor(progress.current * 65);
      lineRef.current.geometry.setDrawRange(0, drawCount);
    }
  });

  return (
    <group>
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.5} linewidth={1} />
      </line>
      {/* Traveling particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ─── Threat Markers (pulsing dots on globe) ─── */
function ThreatMarker({ position, severity, label }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const colorMap = {
    critical: '#ff1744',
    high: '#ff6d00',
    medium: '#ffd600',
    low: '#00e676'
  };
  const color = colorMap[severity] || colorMap.medium;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.3;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  const pos = latLngToVec3(position[0], position[1], 2.03);

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      {/* Glow ring */}
      <mesh>
        <ringGeometry args={[0.03, 0.06, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {hovered && (
        <Html distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(5,10,18,0.9)',
            border: `1px solid ${color}`,
            borderRadius: '4px',
            padding: '6px 10px',
            color: 'white',
            fontSize: '11px',
            fontFamily: 'JetBrains Mono, monospace',
            whiteSpace: 'nowrap',
            boxShadow: `0 0 10px ${color}40`
          }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ─── Scene Setup ─── */
function GlobeScene({ threats }) {
  const displayedThreats = useMemo(() => (threats || []).slice(0, 30), [threats]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#7c4dff" />

      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

      <Earth />

      {/* Attack arcs */}
      {displayedThreats.map((t, i) => (
        t.lat != null && t.targetLat != null && (
          <AttackArc
            key={`arc-${t.id}-${i}`}
            start={[t.lat, t.lng]}
            end={[t.targetLat, t.targetLng]}
            color={t.severity === 'critical' ? '#ff1744' : t.severity === 'high' ? '#ff6d00' : '#00e5ff'}
            speed={0.5 + Math.random() * 0.5}
          />
        )
      ))}

      {/* Threat markers */}
      {displayedThreats.map((t, i) => (
        t.lat != null && (
          <ThreatMarker
            key={`marker-${t.id}-${i}`}
            position={[t.lat, t.lng]}
            severity={t.severity}
            label={`${t.source_ip} | ${t.type} | ${t.severity.toUpperCase()}`}
          />
        )
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.3}
        dampingFactor={0.1}
        enableDamping
      />
    </>
  );
}

/* ─── Helper: Convert lat/lng to 3D position ─── */
function latLngToVec3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/* ─── Exported Component ─── */
export default function ThreatGlobe({ threats }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <GlobeScene threats={threats} />
      </Canvas>
    </div>
  );
}
