import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const [hasError, setHasError] = useState(false);

  if (!isOpen) return null;

  const handleIframeError = () => {
    setHasError(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-5xl">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white hover:text-blue-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="relative overflow-hidden aspect-video rounded-lg shadow-2xl bg-slate-900">
          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
              <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
              <h3 className="text-xl font-semibold mb-2">Unable to Load Video</h3>
              <p className="text-slate-300 mb-4">
                We're having trouble loading the video. Please try again later or contact support if the problem persists.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <iframe
              src="https://share.synthesia.io/embeds/videos/f94cf0c5-f0df-41f0-9315-4075c5ab6941"
              loading="lazy"
              title="Synthesia video player - Solomon AI Workforce's Custom GPT"
              allowFullScreen
              allow="encrypted-media; fullscreen;"
              className="absolute w-full h-full top-0 left-0 border-0"
              onError={handleIframeError}
            />
          )}
        </div>
      </div>
    </div>
  );
}