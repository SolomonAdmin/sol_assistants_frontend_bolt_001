import React from 'react';

interface SliderDotsProps {
  count: number;
  current: number;
  onChange: (index: number) => void;
}

export default function SliderDots({ count, current, onChange }: SliderDotsProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            current === index 
              ? 'w-8 bg-white' 
              : 'bg-white/50 hover:bg-white/70'
          }`}
        />
      ))}
    </div>
  );
}