
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AppError } from '../types';

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  isProcessing: boolean;
  onError: (error: AppError) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, isProcessing, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsActive(true);
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      onError({
        title: "Camera access needed",
        message: "We can't start the live scan without permission to use your webcam.",
        action: "Please enable camera access in your browser settings and try again."
      });
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
    }
  }, [stream]);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
    onCapture(imageData);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="relative w-full aspect-video bg-slate-900 rounded-[2rem] overflow-hidden group shadow-2xl border-4 border-white">
      {!isActive ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-900/60 backdrop-blur-sm transition-all duration-500">
          <button 
            onClick={startCamera}
            className="p-8 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl transition-all active:scale-95 shadow-2xl group-hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            aria-label="Start Live Audit"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
          <p className="mt-6 text-2xl font-black text-white tracking-tight">Start Live Audit</p>
          <p className="mt-2 text-sm text-slate-300 font-medium px-6 text-center">Requires camera access; point at any digital display.</p>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="scan-line" />
          
          <div className="absolute top-6 left-6 flex items-center gap-3">
             <div className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg animate-pulse tracking-widest uppercase">
               Live Vision
             </div>
             <div className="bg-black/40 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg border border-white/20 tracking-widest uppercase">
               720p 60fps
             </div>
          </div>

          <div className="absolute bottom-8 inset-x-0 flex justify-center gap-4 px-6">
            <button 
              onClick={captureFrame}
              disabled={isProcessing}
              className={`flex-1 max-w-[280px] px-8 py-4 rounded-2xl font-black text-lg shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
                isProcessing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-slate-50'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Auditing...
                </span>
              ) : 'Analyze Frame'}
            </button>
            <button 
              onClick={stopCamera}
              className="p-4 bg-black/40 backdrop-blur-md text-white rounded-2xl hover:bg-red-600 transition-all shadow-xl border border-white/20 focus:outline-none focus:ring-4 focus:ring-red-500/50"
              aria-label="Stop Camera"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
