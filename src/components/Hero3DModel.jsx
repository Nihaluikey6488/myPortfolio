import React, { Suspense, useRef, useMemo, useState, useEffect, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';

// ---- Editable text ----
const BIG_WORD = 'CREATIVITY';
const CAPTIONS = {
  badge: 'COMES WITH',
  center: ['/GREAT MIND'],
  right: ['/PORTFOLIO', '2026'],
};

// ---- Colors ----
const BG = '#D9F95F'; // lime from the reference
const TEXT_COLOR = '#0b0b0b'; // black

// ---- Giant word controls ----
const TEXT_TOP_PERCENT = 33; // vertical center of the word: 0 = top of screen, 50 = middle
const TEXT_MAX_HEIGHT_PERCENT = 52; // the word is never taller than this % of the screen
const TEXT_STRETCH = 1; // extra letter height (1 = natural)
const LINE_HEIGHT = 0.8;
const LETTER_SPACING = '-0.02em';
const FALLBACK_SIZE = 'min(44vw, 64vh)'; // used before measuring, and if measuring ever fails

// ---- Character controls ----
const HERO_HEIGHT = 4.8; // character size (camera sees about 5.2 tall)
const HERO_BASE_Y = -0.15; // character vertical position

// 1. Error Boundary Component
class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-black p-6 text-center">
          <p className="font-semibold text-lg">3D Viewport failed to load</p>
          <p className="text-sm mt-1">
            {this.state.error?.message || 'Please check image URL / CORS or WebGL support.'}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Transparent PNG hero. Second entry is a local fallback: save a copy as public/hero.png
const HERO_SOURCES = [
  'https://ik.imagekit.io/7tiz96d91/c4c48d1828e3ee9a47175fccc47cb32c-removebg-preview.png?updatedAt=1792852402466',
  '/hero.png',
];

// Loads the first source that works, without throwing into the error boundary
function useHeroTexture(sources) {
  const { gl } = useThree();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    const tryLoad = (i) => {
      if (i >= sources.length) {
        console.error('Hero image failed to load from all sources');
        return;
      }
      loader.load(
        sources[i],
        (tex) => {
          if (cancelled) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = gl.capabilities.getMaxAnisotropy();
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          tex.needsUpdate = true;
          setTexture(tex);
        },
        undefined,
        () => tryLoad(i + 1)
      );
    };

    tryLoad(0);
    return () => {
      cancelled = true;
    };
  }, [sources, gl]);

  return texture;
}

// Transparent-PNG hero floating in front of the giant word
function CenterHeroImage() {
  const groupRef = useRef();
  const texture = useHeroTexture(HERO_SOURCES);

  const [width, height] = useMemo(() => {
    const img = texture?.image;
    const aspect = img && img.width && img.height ? img.width / img.height : 1;
    return [HERO_HEIGHT * aspect, HERO_HEIGHT];
  }, [texture]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.18, 0.06);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.12, 0.06);
    groupRef.current.position.y = HERO_BASE_Y + Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
  });

  if (!texture) return null;

  return (
    <group ref={groupRef} position={[0, HERO_BASE_Y, 0]}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.02}
          roughness={0.55}
          metalness={0.1}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  );
}

// Slight camera parallax
function CameraRig() {
  useFrame((state) => {
    const { camera, pointer } = state;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.6, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.4 + pointer.y * 0.4, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// Single Snake Trail Image Card Component
function SnakeTrailImageCard({ cardData, index, mouseWorldPos, allPositions }) {
  const imageRef = useRef();

  useFrame((state) => {
    if (!imageRef.current) return;

    if (index === 0) {
      allPositions[0].x = THREE.MathUtils.lerp(allPositions[0].x, mouseWorldPos.current.x, 0.2);
      allPositions[0].y = THREE.MathUtils.lerp(allPositions[0].y, mouseWorldPos.current.y, 0.2);
    } else {
      const prev = allPositions[index - 1];
      const curr = allPositions[index];
      curr.x += (prev.x - curr.x) * 0.25;
      curr.y += (prev.y - curr.y) * 0.25;
    }

    const targetX = allPositions[index].x;
    const targetY = allPositions[index].y;

    imageRef.current.position.x = THREE.MathUtils.lerp(imageRef.current.position.x, targetX, 0.15);
    imageRef.current.position.y = THREE.MathUtils.lerp(imageRef.current.position.y, targetY, 0.15);
    imageRef.current.position.z = cardData.baseZ;

    imageRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;

    const scaleFactor = cardData.baseScale * (1 - index * 0.008);
    imageRef.current.scale.set(scaleFactor * 0.8, scaleFactor * 1.1, 1);

    if (imageRef.current.material) {
      imageRef.current.material.opacity = Math.max(0.3, 1 - index * 0.015);
    }
  });

  return (
    <Image
      ref={imageRef}
      url={cardData.url}
      transparent
      position={[cardData.startX, cardData.startY, cardData.baseZ]}
      scale={[cardData.baseScale * 0.8, cardData.baseScale * 1.1]}
      side={THREE.DoubleSide}
    />
  );
}

// Snake Trail Group Manager
function SnakeCursorTrail({ count = 60 }) {
  const { camera, pointer } = useThree();
  const mouseWorldPos = useRef(new THREE.Vector3(0, 0, 0));
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.5), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const targetPoint = useMemo(() => new THREE.Vector3(), []);

  const imageUrls = [
    'https://ik.imagekit.io/7tiz96d91/creative/9734662cacdfe71648bd8a64cfd1d27c.jpg?tr=w-500,q-150',
    'https://ik.imagekit.io/7tiz96d91/creative/a6ee6c54c508056b494bdc3fe311aa13.jpg?tr=w-500,q-150',
    'https://ik.imagekit.io/7tiz96d91/creative/7aeed5d86038a63a175a394b17f59596.jpg?tr=w-500,q-150',
    'https://ik.imagekit.io/7tiz96d91/creative/202d6400dddb8f6f4ed1fcfaf56475e0.jpg?tr=w-500,q-150',
    'https://ik.imagekit.io/7tiz96d91/creative/aba8149098572dfe80a6bbd5bf2b45f5.jpg?tr=w-500,q-150',
    'https://ik.imagekit.io/7tiz96d91/creative/e2d3b0f4729780b4cfe3ed820a75bdee.jpg?tr=w-500,q-150',
    'https://ik.imagekit.io/7tiz96d91/creative/fb3ad24694ea20893a83198134daac24.jpg?tr=w-500,q-150',
    'https://ik.imagekit.io/7tiz96d91/creative/26d6799788ee43f728c67a3fff56cd85.jpg?tr=w-500,q-150',
    'https://ik.imagekit.io/7tiz96d91/creative/8f3f87524c43603540cd22d07721c568.jpg?tr=w-500,q-150',
    'https://ik.imagekit.io/7tiz96d91/creative/5c86883a6c248580bba253786d54c503.jpg?tr=w-500,q-150',
  ];

  const { cards, allPositions } = useMemo(() => {
    const tempCards = [];
    const tempPositions = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 3 + (i % 3) * 0.5;
      const startX = Math.cos(angle) * radius;
      const startY = Math.sin(angle) * radius;

      tempCards.push({
        startX,
        startY,
        baseZ: 0.6 + Math.random() * 1.0, // always in front of the character
        url: imageUrls[i % imageUrls.length],
        baseScale: 0.5 + Math.random() * 0.3,
      });

      tempPositions.push({ x: startX, y: startY });
    }
    return { cards: tempCards, allPositions: tempPositions };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useFrame(() => {
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(plane, targetPoint)) {
      mouseWorldPos.current.copy(targetPoint);
    }
  });

  return (
    <group>
      {cards.map((card, index) => (
        <SnakeTrailImageCard
          key={index}
          index={index}
          cardData={card}
          mouseWorldPos={mouseWorldPos}
          allPositions={allPositions}
        />
      ))}
    </group>
  );
}

// Giant word: as large as fits the width AND the max height, centered on x,
// centered on y by the real height of its letters. Falls back to a plain CSS size if anything fails.
function FitWord({ children }) {
  const wrapRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const useFallback = () => {
      const el = textRef.current;
      const wrap = wrapRef.current;
      if (!el || !wrap) return;
      el.style.fontSize = FALLBACK_SIZE;
      el.style.transform = 'none';
      wrap.style.setProperty('--glyph-h', '0px');
    };

    const fit = () => {
      const wrap = wrapRef.current;
      const el = textRef.current;
      if (!wrap || !el) return;

      try {
        // 1) size that fills the available width
        el.style.transform = 'none';
        el.style.fontSize = '100px';
        const w = el.getBoundingClientRect().width;
        if (!(w > 0) || !(wrap.clientWidth > 0)) throw new Error('no width');
        let size = (100 * wrap.clientWidth) / w;

        // 2) measure real letter height and the vertical centering offset
        let offset = 0;
        let glyphH = size * 0.72;
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = `${size}px ${getComputedStyle(el).fontFamily}`;
        const m = ctx.measureText(String(children).toUpperCase());
        const measured = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        if (Number.isFinite(measured) && measured > 0) glyphH = measured;
        if (m.fontBoundingBoxAscent !== undefined) {
          const lineH = size * LINE_HEIGHT;
          const baseline =
            (lineH - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
          const glyphCenter = baseline + (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2;
          offset = (lineH / 2 - glyphCenter) * TEXT_STRETCH;
        }

        // 3) never taller than the max height (everything scales linearly with font size)
        const maxH = (window.innerHeight * TEXT_MAX_HEIGHT_PERCENT) / 100;
        const k = Math.min(1, maxH / (glyphH * TEXT_STRETCH));
        size *= k;
        offset *= k;
        glyphH *= k;

        if (![size, offset, glyphH].every(Number.isFinite) || size < 20 || size > 3000) {
          throw new Error('bad numbers');
        }
        if (Math.abs(offset) > size) offset = 0;

        el.style.fontSize = size + 'px';
        el.style.transform = `translateY(${offset}px) scaleY(${TEXT_STRETCH})`;
        wrap.style.setProperty('--glyph-h', glyphH * TEXT_STRETCH + 'px');

        // Safety: if the word ended up tiny or off-screen, use the fallback
        const r = el.getBoundingClientRect();
        if (r.width < 50 || r.height < 20 || r.bottom < 0 || r.top > window.innerHeight) {
          throw new Error('off-screen');
        }
      } catch (e) {
        useFallback();
      }
    };

    fit();
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    return () => window.removeEventListener('resize', fit);
  }, [children]);

  return (
    <div ref={wrapRef} className="flex w-full justify-center">
      <div className="relative flex-none">
        <span
          ref={textRef}
          className="hero-giant block whitespace-nowrap uppercase"
          style={{
            fontSize: FALLBACK_SIZE,
            lineHeight: LINE_HEIGHT,
            letterSpacing: LETTER_SPACING,
            transformOrigin: 'center center',
          }}
        >
          {children}
        </span>

        {/* ® mark: right of the last letter, level with the top of the letters */}
        <span
          className="hero-giant absolute flex items-center justify-center rounded-[50%]"
          style={{
            left: 'calc(100% + 0.4vw)',
            top: 'calc(50% - var(--glyph-h, 0px) / 2)',
            border: `0.4vw solid ${TEXT_COLOR}`,
            width: '3.2vw',
            height: '4.4vw',
            fontSize: '2.3vw',
            lineHeight: 1,
          }}
        >
          R
        </span>
      </div>
    </div>
  );
}

// 4. Main Hero Section
export default function HeroSection() {
  return (
    <div
      className="relative isolate w-full h-screen overflow-hidden select-none"
      style={{ backgroundColor: BG, color: TEXT_COLOR }}
    >
      {/* Fonts: Kaigo first (your own font), Anton as a free fallback look-alike */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@700;800&display=swap');
        .hero-giant { font-family: 'Kaigo', 'Anton', Impact, 'Arial Narrow', sans-serif; font-weight: 400; }
        .hero-small { font-family: 'Montserrat', system-ui, sans-serif; font-weight: 800; }
      `}</style>

      {/* Header Navigation Placeholder */}
      <header
        className="w-full max-w-7xl mx-auto px-8 py-6 flex justify-between items-center absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 30 }}
      >
        <div className="text-xl font-bold tracking-wider"></div>
      </header>

      {/* GIANT WORD: lowest layer (z 0), centered on x, slightly above the face, behind the model */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          zIndex: 0,
          top: `${TEXT_TOP_PERCENT}%`,
          transform: 'translateY(-50%)',
          paddingLeft: '4.6vw',
          paddingRight: '4.6vw',
        }}
      >
        <FitWord>{BIG_WORD}</FitWord>
      </div>

      {/* 3D layer (z 10): model + cursor trail draw over the word. Canvas is fully transparent. */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        <CanvasErrorBoundary>
          <Canvas
            dpr={[1, 2]}
            style={{ background: 'transparent' }}
            camera={{ position: [0, 0.4, 9], fov: 32, near: 0.1, far: 100 }}
            gl={{
              alpha: true,
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <ambientLight intensity={0.3} />
            <spotLight position={[4, 5, 7]} angle={0.5} penumbra={0.9} intensity={80} color="#ffffff" />
            <directionalLight position={[-5, 2, 4]} intensity={0.9} color="#dcc7a4" />

            <CameraRig />

            <Suspense fallback={null}>
              <CenterHeroImage />
              <SnakeCursorTrail count={60} />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      {/* Small magazine-style captions along the bottom (z 20) */}
      <div
        className="absolute inset-x-0 bottom-0 px-[1.8vw] pb-[3.5vh] grid grid-cols-3 items-end pointer-events-none"
        style={{ zIndex: 20 }}
      >
        <div>
          <span
            className="hero-giant inline-flex items-center justify-center uppercase rounded-[50%] px-[1.6vw] py-[0.5vw]"
            style={{
              border: `0.22vw solid ${TEXT_COLOR}`,
              fontSize: 'clamp(14px, 1.7vw, 26px)',
              lineHeight: 1,
            }}
          >
            {CAPTIONS.badge}
          </span>
        </div>

        <div className="hero-small uppercase text-[10px] sm:text-[11px] leading-[1.35] tracking-wide text-center">
          {CAPTIONS.center.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>

        <div className="hero-small uppercase text-[10px] sm:text-[11px] leading-[1.35] tracking-wide justify-self-end">
          {CAPTIONS.right.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}