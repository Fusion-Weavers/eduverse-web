import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import {
    IoExpand,
    IoContract,
    IoRefreshOutline,
    IoWarningOutline,
    IoCubeOutline
} from 'react-icons/io5';

// Error boundary for Three.js components
class ErrorBoundaryWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('3D Model Error:', error, errorInfo);
        this.props.onError?.(error);
    }

    render() {
        if (this.state.hasError) {
            return null;
        }
        return this.props.children;
    }
}

// Wrapper component that catches model loading errors
function ModelWrapper({ url, onError, onLoad }) {
    const [error, setError] = useState(null);

    if (error) {
        return null;
    }

    return (
        <ErrorBoundaryWrapper onError={(err) => {
            setError(err);
            onError?.(err);
        }}>
            <Model url={url} onError={(err) => {
                setError(err);
                onError?.(err);
            }} onLoad={onLoad} />
        </ErrorBoundaryWrapper>
    );
}

// Model component that loads and displays the GLB/GLTF file
function Model({ url, onError, onLoad }) {
    const meshRef = useRef();
    const { scene } = useGLTF(url);
    const hasPositionedRef = useRef(false);

    useEffect(() => {
        if (scene && !hasPositionedRef.current) {
            try {
                // Center and scale the model for optimal viewing
                const box = new THREE.Box3().setFromObject(scene);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                // Calculate the diagonal to get true model extent
                const diagonal = Math.sqrt(size.x * size.x + size.y * size.y + size.z * size.z);

                // Target size in view - adjusted for better viewing distance
                // This assumes camera is at z=5 with fov=50
                const targetSize = 3.5; // Optimal size for comfortable viewing
                const scale = diagonal > 0 ? targetSize / diagonal : 1;

                // Apply scale
                scene.scale.setScalar(scale);

                // Center the model at origin
                const scaledCenter = center.clone().multiplyScalar(scale);
                scene.position.set(-scaledCenter.x, -scaledCenter.y, -scaledCenter.z);

                hasPositionedRef.current = true;
                onLoad?.();
            } catch (error) {
                console.error('Error processing model:', error);
                onError?.(error);
            }
        }
    }, [scene, url]);

    return <primitive ref={meshRef} object={scene} />;
}

// Loading component
function Loader() {
    return (
        <Html center>
            <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)'
            }}>
                <IoCubeOutline style={{ fontSize: '2rem', color: '#4A90E2', marginBottom: '10px' }} />
                <p style={{ margin: 0, color: '#333' }}>Loading 3D Model...</p>
            </div>
        </Html>
    );
}

// Main WebXR Viewer component
export default function WebXRViewer({ modelUrl, title }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [modelError, setModelError] = useState(null);
    const [modelLoaded, setModelLoaded] = useState(false);
    const [isXRSupported, setIsXRSupported] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const containerRef = useRef();

    // Validate model URL on mount
    useEffect(() => {
        if (!modelUrl) {
            setIsValidating(false);
            return;
        }

        setIsValidating(true);
        setModelError(null);

        // Try to fetch the URL to check if it's accessible
        fetch(modelUrl, { method: 'HEAD', mode: 'cors' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Model not found (HTTP ${response.status}). The file may not exist at this URL.`);
                }
                setIsValidating(false);
            })
            .catch(error => {
                console.error('Model URL validation error:', error);
                setModelError(`Cannot access model file. This could be due to:\n• The file doesn't exist at the specified URL\n• CORS (Cross-Origin) restrictions\n• Network connectivity issues\n\nURL: ${modelUrl}`);
                setIsValidating(false);
            });
    }, [modelUrl]);

    useEffect(() => {
        // Check if WebXR is supported
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-ar')
                .then(supported => setIsXRSupported(supported))
                .catch(() => setIsXRSupported(false));
        }
    }, []);

    const handleFullscreen = () => {
        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            } else if (containerRef.current.webkitRequestFullscreen) {
                containerRef.current.webkitRequestFullscreen();
            } else if (containerRef.current.msRequestFullscreen) {
                containerRef.current.msRequestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    const handleReset = () => {
        setModelError(null);
        setModelLoaded(false);
        setIsValidating(false);
        // Force re-validation
        if (modelUrl) {
            setIsValidating(true);
            fetch(modelUrl, { method: 'HEAD', mode: 'cors' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Model not found (HTTP ${response.status})`);
                    }
                    setIsValidating(false);
                })
                .catch(error => {
                    console.error('Model URL validation error:', error);
                    setModelError(`Cannot access model file. The file may not exist or has CORS restrictions.\n\nURL: ${modelUrl}`);
                    setIsValidating(false);
                });
        }
    };

    const handleEnterAR = async () => {
        if (!isXRSupported) {
            alert('WebXR AR is not supported on this device/browser. Try using Chrome on an Android device or Safari on iOS.');
            return;
        }

        try {
            const session = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['hit-test', 'dom-overlay'],
                domOverlay: { root: document.body }
            });

            // Additional WebXR session handling would go here
            console.log('AR session started', session);
        } catch (error) {
            console.error('Failed to start AR session:', error);
            alert('Failed to start AR session. Make sure you are on a compatible device.');
        }
    };

    // Handle fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    if (!modelUrl) {
        return (
            <div className="webxr-viewer-container no-model">
                <div className="no-model-message">
                    <IoWarningOutline />
                    <p>No 3D model available for this concept</p>
                </div>
                <style jsx>{`
          .webxr-viewer-container.no-model {
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 12px;
            padding: 3rem;
            text-align: center;
          }
          .no-model-message {
            color: #6c757d;
          }
          .no-model-message svg {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          .no-model-message p {
            margin: 0;
            font-size: 1rem;
          }
        `}</style>
            </div>
        );
    }

    if (isValidating) {
        return (
            <div className="webxr-viewer-container validating">
                <div className="validating-message">
                    <IoCubeOutline className="spinner" />
                    <h4>Validating 3D Model...</h4>
                    <p>Checking if model is accessible</p>
                </div>
                <style jsx>{`
          .webxr-viewer-container.validating {
            background: #f0f9ff;
            border: 2px solid #bae6fd;
            border-radius: 12px;
            padding: 3rem;
            text-align: center;
          }
          .validating-message {
            color: #0369a1;
          }
          .validating-message svg {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: spin 2s linear infinite;
          }
          .validating-message h4 {
            margin: 0.5rem 0;
          }
          .validating-message p {
            color: #075985;
            margin: 0;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    if (modelError) {
        return (
            <div className="webxr-viewer-container error">
                <div className="error-message">
                    <IoWarningOutline />
                    <h4>Failed to load 3D model</h4>
                    <p style={{ whiteSpace: 'pre-wrap', textAlign: 'left', maxWidth: '600px', margin: '1rem auto' }}>{modelError}</p>
                    <button onClick={handleReset} className="retry-button">
                        <IoRefreshOutline /> Try Again
                    </button>
                </div>
                <style jsx>{`
          .webxr-viewer-container.error {
            background: #fff5f5;
            border: 2px solid #feb2b2;
            border-radius: 12px;
            padding: 3rem;
            text-align: center;
          }
          .error-message {
            color: #c53030;
          }
          .error-message svg {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          .error-message h4 {
            margin: 0.5rem 0;
          }
          .error-message p {
            color: #742a2a;
            margin-bottom: 1rem;
          }
          .retry-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: #fff;
            border: 1px solid #c53030;
            border-radius: 6px;
            color: #c53030;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s;
          }
          .retry-button:hover {
            background: #c53030;
            color: white;
          }
        `}</style>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`webxr-viewer-container ${isFullscreen ? 'fullscreen' : ''}`}>
            <div className="viewer-header">
                <h4>{title || '3D Model Viewer'}</h4>
                <div className="viewer-controls">
                    {isXRSupported && (
                        <button onClick={handleEnterAR} className="control-button ar-button" title="Enter AR Mode">
                            <IoExpand /> AR Mode
                        </button>
                    )}
                    <button onClick={handleReset} className="control-button" title="Reset View">
                        <IoRefreshOutline />
                    </button>
                    <button onClick={handleFullscreen} className="control-button" title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                        {isFullscreen ? <IoContract /> : <IoExpand />}
                    </button>
                </div>
            </div>

            <div className="canvas-container">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    gl={{ preserveDrawingBuffer: true }}
                    onError={(error) => {
                        console.error('Canvas error:', error);
                        setModelError(error?.message || 'Failed to render 3D scene');
                    }}
                >
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />

                    <Suspense fallback={<Loader />}>
                        <ModelWrapper
                            url={modelUrl}
                            onError={(error) => setModelError(error?.message || 'Failed to load model')}
                            onLoad={() => setModelLoaded(true)}
                        />
                        <Environment preset="studio" />
                    </Suspense>

                    <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={1}
                        maxDistance={10}
                    />
                </Canvas>
            </div>

            <div className="viewer-instructions">
                <p>
                    <strong>Controls:</strong>
                    Drag to rotate • Scroll to zoom • Right-click to pan
                    {isXRSupported && ' • Click AR Mode to view in augmented reality'}
                </p>
            </div>

            <style jsx>{`
        .webxr-viewer-container {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .webxr-viewer-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          border-radius: 0;
          margin: 0;
        }

        .viewer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .viewer-header h4 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .viewer-controls {
          display: flex;
          gap: 0.5rem;
        }

        .control-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        .control-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        .control-button.ar-button {
          background: rgba(74, 144, 226, 0.8);
          border-color: rgba(74, 144, 226, 1);
        }

        .control-button.ar-button:hover {
          background: rgba(74, 144, 226, 1);
        }

        .canvas-container {
          width: 100%;
          height: 500px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          position: relative;
        }

        .fullscreen .canvas-container {
          height: calc(100vh - 140px);
        }

        .viewer-instructions {
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          border-top: 1px solid #e2e8f0;
        }

        .viewer-instructions p {
          margin: 0;
          font-size: 0.875rem;
          color: #6c757d;
          text-align: center;
        }

        .viewer-instructions strong {
          color: #495057;
        }

        @media (max-width: 768px) {
          .viewer-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .viewer-controls {
            width: 100%;
            justify-content: flex-end;
          }

          .canvas-container {
            height: 400px;
          }

          .control-button span {
            display: none;
          }
        }
      `}</style>
        </div>
    );
}
