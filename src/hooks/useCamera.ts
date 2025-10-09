import { useState, useRef, useEffect } from 'react';

interface CameraOptions {
  facingMode?: 'user' | 'environment';
}

const useCamera = (options: CameraOptions = {}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [supported, setSupported] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check if media devices are supported
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setSupported(false);
      setError('Camera API not supported in this browser');
    }
  }, []);

  // Initialize camera
  const startCamera = async () => {
    if (!supported) return;

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: options.facingMode || 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      setIsCameraActive(true);
      setError(null);

      // Set video source
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError(err.message || 'Error accessing camera');
      console.error('Camera error:', err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // Capture photo
  const capturePhoto = (): string | null => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Camera elements not ready');
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      setError('Could not get canvas context');
      return null;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Return data URL
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  // Toggle camera
  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return {
    videoRef,
    canvasRef,
    stream,
    error,
    isCameraActive,
    supported,
    startCamera,
    stopCamera,
    toggleCamera,
    capturePhoto,
  };
};

export default useCamera;