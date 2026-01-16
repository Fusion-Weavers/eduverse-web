import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import {
    IoExpand, IoContract, IoRefreshOutline, 
    IoWarningOutline, IoCubeOutline, IoFlashOutline, IoShieldCheckmarkOutline
} from 'react-icons/io5';

// --- GLASSMORPHIC LOADER ---
function Loader() {
    return (
        <Html center>
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2rem border border-white/60 shadow-2xl flex flex-col items-center gap-4 min-w-200px animate-in zoom-in-95 duration-300">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                    <IoCubeOutline className="text-4xl text-indigo-600 animate-[spin_3s_linear_infinite] relative z-10" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Materializing...</p>
            </div>
        </Html>
    );
}

// --- MODEL LOGIC (Center & Scale) ---
function Model({ url, onError, onLoad }) {
    const { scene } = useGLTF(url);
    const hasPositionedRef = useRef(false);

    useEffect(() => {
        if (scene && !hasPositionedRef.current) {
            try {
                const box = new THREE.Box3().setFromObject(scene);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const diagonal = Math.sqrt(size.x * size.x + size.y * size.y + size.z * size.z);
                const targetSize = 3.5; 
                const scale = diagonal > 0 ? targetSize / diagonal : 1;

                scene.scale.setScalar(scale);
                const scaledCenter = center.clone().multiplyScalar(scale);
                scene.position.set(-scaledCenter.x, -scaledCenter.y, -scaledCenter.z);

                hasPositionedRef.current = true;
                onLoad?.();
            } catch (error) {
                onError?.(error);
            }
        }
    }, [scene, url, onLoad, onError]);

    return <primitive object={scene} />;
}

// --- MAIN VIEWER ---
export default function WebXRViewer({ modelUrl, embedUrl, title }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [modelError, setModelError] = useState(null);
    const [isXRSupported, setIsXRSupported] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const containerRef = useRef();

    // WebXR Support Check
    useEffect(() => {
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-ar')
                .then(supported => setIsXRSupported(supported))
                .catch(() => setIsXRSupported(false));
        }
    }, []);

    // Validation Logic
    useEffect(() => {
        if (embedUrl || !modelUrl) {
            setIsValidating(false);
            return;
        }
        setIsValidating(true);
        fetch(modelUrl, { method: 'HEAD', mode: 'cors' })
            .then(res => {
                if (!res.ok) throw new Error(`Status ${res.status}`);
                setIsValidating(false);
            })
            .catch(err => {
                setModelError(`Asset inaccessible: ${err.message}`);
                setIsValidating(false);
            });
    }, [modelUrl, embedUrl]);

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div 
            ref={containerRef} 
            className={`relative group bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-9999 rounded-none' : 'aspect-video'}`}
        >
            {/* --- TOP BAR --- */}
            <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between bg-linear-to-b from-slate-900/80 to-transparent backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10">
                        <IoCubeOutline />
                    </div>
                    <h4 className="text-white font-black tracking-tight uppercase text-xs">{title || '3D Viewport'}</h4>
                </div>

                <div className="flex items-center gap-2">
                    {isXRSupported && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 transition-all">
                            <IoFlashOutline /> AR Vision
                        </button>
                    )}
                    <button 
                        onClick={handleFullscreen}
                        className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-white/20 transition-all"
                    >
                        {isFullscreen ? <IoContract /> : <IoExpand />}
                    </button>
                </div>
            </div>

            {/* --- CANVAS / EMBED AREA --- */}
            <div className="absolute inset-0 z-10">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        className="w-full h-full border-0"
                        allow="autoplay; fullscreen; xr-spatial-tracking"
                    />
                ) : modelError ? (
                    <div className="flex flex-col items-center justify-center h-full text-rose-400 p-8 text-center bg-slate-900">
                        <IoWarningOutline className="text-5xl mb-4" />
                        <p className="font-bold tracking-tight">{modelError}</p>
                        <button onClick={() => window.location.reload()} className="mt-6 flex items-center gap-2 px-6 py-2 bg-white/10 rounded-full text-white text-xs font-black uppercase tracking-widest">
                            <IoRefreshOutline /> Retry
                        </button>
                    </div>
                ) : (
                    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} className="bg-slate-900">
                        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                        <ambientLight intensity={0.8} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                        <Suspense fallback={<Loader />}>
                            {!isValidating && <Model url={modelUrl} onError={setModelError} />}
                            <Environment preset="studio" />
                        </Suspense>
                        <OrbitControls minDistance={2} maxDistance={8} makeDefault />
                    </Canvas>
                )}
            </div>

            {/* --- FOOTER INSTRUCTIONS --- */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em] whitespace-nowrap">
                    Drag to rotate • Scroll to zoom • Right-click to pan
                </p>
            </div>

            {/* --- WATERMARK --- */}
            <div className="absolute bottom-6 right-8 z-20 flex items-center gap-2 opacity-50">
                <IoShieldCheckmarkOutline className="text-white" />
                <span className="text-[10px] font-black text-white tracking-widest uppercase">Verified Render</span>
            </div>
        </div>
    );
}