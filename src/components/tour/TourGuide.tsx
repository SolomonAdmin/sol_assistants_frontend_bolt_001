import React from 'react';
import { X } from 'lucide-react';

interface TourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  targetRef: React.RefObject<HTMLElement>;
}

export default function TourGuide({ isOpen, onClose, targetRef }: TourGuideProps) {
  if (!isOpen || !targetRef.current) return null;

  const targetRect = targetRef.current.getBoundingClientRect();

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50">
        {/* Cutout for the highlighted element */}
        <div
          className="absolute bg-transparent border-2 border-green-400 shadow-neon-green"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            borderRadius: '8px',
          }}
        />
        
        {/* Tooltip */}
        <div
          className="absolute bg-black border border-green-400 p-4 rounded-lg shadow-neon-green max-w-xs"
          style={{
            top: targetRect.bottom + 16,
            left: targetRect.left,
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-green-400 font-semibold">Select Assistant</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-green-400/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-green-400" />
            </button>
          </div>
          <p className="text-green-400/90 text-sm">
            Choose an AI assistant to chat with in your selected thread. Each assistant is specialized for different tasks and can help you achieve specific goals.
          </p>
        </div>
      </div>
    </>
  );
}