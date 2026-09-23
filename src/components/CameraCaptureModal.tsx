import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, Trash2, X, RefreshCw, Check } from 'lucide-react';
import { Student } from '../types/attendance';
import { StudentAvatar } from './StudentAvatar';

interface CameraCaptureModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (studentId: string, photoUrl?: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  student,
  isOpen,
  onClose,
  onSavePhoto,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('તમારા બ્રાઉઝરમાં કેમેરા સપોર્ટ ઉપલબ્ધ નથી (Camera not supported)');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      const errMsg = err instanceof Error ? err.message : '';
      setCameraError(`કેમેરા ચાલુ થઈ શક્યો નથી (${errMsg || 'પરમિશન આપો'})`);
      setCameraActive(false);
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, startCamera, stopCamera]);

  useEffect(() => {
    if (student) {
      setCapturedPhoto(student.photoUrl || null);
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleCaptureFromVideo = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    // Square crop for avatar
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    ctx.drawImage(video, startX, startY, size, size, 0, 0, 400, 400);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhoto(dataUrl);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;
        ctx.drawImage(img, startX, startY, size, size, 0, 0, 400, 400);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSavePhoto(student.id, capturedPhoto || undefined);
    onClose();
  };

  const handleRemovePhoto = () => {
    setCapturedPhoto(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              વિદ્યાર્થી ફોટો (Student Photo)
            </h3>
            <p className="text-xs text-slate-500">
              રોલ નં. {student.rollNo} - {student.nameGu} ({student.nameEn})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Camera vs Upload */}
        <div className="flex border-b border-slate-100 px-5 pt-2">
          <button
            onClick={() => setActiveTab('camera')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>કેમેરાથી ફોટો લો (Camera)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
            }}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>ફાઇલ અપલોડ (Upload)</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 flex flex-col items-center">
          {capturedPhoto ? (
            /* Preview of selected/captured photo */
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="relative w-44 h-44 rounded-2xl overflow-hidden ring-4 ring-emerald-500/30 shadow-md">
                <img
                  src={capturedPhoto}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" />
                નવો ફોટો પસંદ કરેલ છે
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCapturedPhoto(null);
                    if (activeTab === 'camera') startCamera();
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  ફરીથી લો (Retake)
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  દૂર કરો
                </button>
              </div>
            </div>
          ) : activeTab === 'camera' ? (
            /* Live Camera View */
            <div className="flex flex-col items-center w-full">
              {cameraError ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs text-center w-full my-4">
                  {cameraError}
                  <div className="mt-2">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-3 py-1.5 bg-white border border-rose-300 rounded-lg text-xs font-medium text-rose-800 hover:bg-rose-100"
                    >
                      ફાઇલ અપલોડનો ઉપયોગ કરો
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden bg-black shadow-inner flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Viewfinder overlay */}
                  <div className="absolute inset-4 border-2 border-white/60 border-dashed rounded-xl pointer-events-none" />

                  {/* Switch camera button (front/back) */}
                  <button
                    type="button"
                    onClick={() => {
                      setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-xs transition-colors"
                    title="કેમેરા બદલો (Flip camera)"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}

              {cameraActive && !cameraError && (
                <button
                  type="button"
                  onClick={handleCaptureFromVideo}
                  className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                  <span>ફોટો ક્લિક કરો (Capture)</span>
                </button>
              )}
            </div>
          ) : (
            /* File Upload View */
            <div className="flex flex-col items-center w-full">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  ગેલેરી અથવા ફાઇલમાંથી ફોટો પસંદ કરો
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  JPG, PNG અથવા WebP (પાસપોર્ટ સાઈઝ ઉત્તમ રહેશે)
                </p>
                <button
                  type="button"
                  className="mt-3 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
                >
                  બ્રાઉઝ કરો (Browse File)
                </button>
              </div>

              {/* Current default avatar display */}
              <div className="mt-4 flex items-center gap-3 p-3 bg-slate-50 rounded-xl w-full">
                <StudentAvatar student={student} size="sm" />
                <div className="text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">હાલનો ડિફોલ્ટ અવતાર</p>
                  <p>જો ફોટો ન હોય તો આ અવતાર દેખાશે</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            રદ કરો (Cancel)
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>સાચવો (Save Photo)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
