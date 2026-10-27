import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle, SwitchCamera } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (dataUrl: string, fileName: string) => void;
  title?: string;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured,
  title = 'Capture 4M Form Photo',
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stop camera tracks helper
  const stopTracks = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Start camera
  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    setIsLoading(true);
    setCameraError(null);
    setCapturedPhoto(null);

    // Stop previous tracks if any
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by this browser environment.');
      }

      // Check available devices to see if flip is possible
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      } catch {
        // ignore device listing error
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play().catch(() => {
          // auto-play caught
        });
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Unable to access camera. Please check browser permissions.';
      setCameraError(
        errorMsg.includes('Permission denied') || errorMsg.includes('NotAllowedError')
          ? 'Camera permission was denied. Please allow camera access in your browser settings or use the file upload option.'
          : `Camera unavailable: ${errorMsg}. Please use the file upload option below.`
      );
    } finally {
      setIsLoading(false);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopTracks();
      setCapturedPhoto(null);
      setCameraError(null);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen]);

  // Capture snapshot from video feed
  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhoto(dataUrl);
      stopTracks();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera(facingMode);
  };

  const handleAccept = () => {
    if (capturedPhoto) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `4M_Camera_Scan_${timestamp}.jpg`;
      onPhotoCaptured(capturedPhoto, filename);
      stopTracks();
      onClose();
    }
  };

  const handleToggleCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleModalClose = () => {
    stopTracks();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">Shop floor live capture</p>
          </div>
          <button
            onClick={handleModalClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            aria-label="Close camera modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 bg-slate-950 flex flex-col items-center justify-center min-h-[360px] relative">
          <canvas ref={canvasRef} className="hidden" />

          {/* Error State */}
          {cameraError && (
            <div className="bg-slate-900 border border-slate-700 text-slate-200 p-6 rounded-lg max-w-md text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">Camera Access Required</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => startCamera(facingMode)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Again
                </button>
                <button
                  onClick={handleModalClose}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md transition-colors"
                >
                  Close &amp; Use File Upload
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !cameraError && (
            <div className="text-slate-400 text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <span>Starting camera feed...</span>
            </div>
          )}

          {/* Live Video View */}
          {!capturedPhoto && !cameraError && (
            <div className="w-full relative flex items-center justify-center aspect-4/3 bg-black rounded overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white/30 m-6 rounded-md flex items-center justify-center">
                <span className="text-[11px] text-white/70 bg-black/60 px-2.5 py-1 rounded">
                  Align paper 4M form inside frame
                </span>
              </div>
              {hasMultipleCameras && (
                <button
                  onClick={handleToggleCamera}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                  title="Switch camera"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Photo Preview View */}
          {capturedPhoto && (
            <div className="w-full relative flex items-center justify-center aspect-4/3 bg-black rounded overflow-hidden">
              <img
                src={capturedPhoto}
                alt="Captured 4M form"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-black/70 text-emerald-400 text-xs px-2.5 py-1 rounded flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Photo Captured
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {capturedPhoto
              ? 'Review image quality before accepting.'
              : 'Rear camera preferred for document scanning.'}
          </p>

          <div className="flex items-center gap-2">
            {!capturedPhoto ? (
              <>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCapture}
                  disabled={isLoading || !!cameraError}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  Capture Photo
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retake
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  Accept &amp; Attach
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
