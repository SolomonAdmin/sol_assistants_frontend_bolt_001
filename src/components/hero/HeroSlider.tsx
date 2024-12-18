import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HeroPanel from './HeroPanel';
import SliderDots from './SliderDots';
import { heroContent } from './heroContent';
import VideoModal from '../VideoModal';

export default function HeroSlider() {
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPanel((prev) => (prev + 1) % heroContent.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentPanel((prev) => (prev + 1) % heroContent.length);
  };

  const prevSlide = () => {
    setCurrentPanel((prev) => (prev - 1 + heroContent.length) % heroContent.length);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
      
      <div className="relative">
        <div 
          className="transition-transform duration-500 ease-in-out flex"
          style={{ transform: `translateX(-${currentPanel * 100}%)` }}
        >
          {heroContent.map((content, index) => (
            <HeroPanel 
              key={index} 
              {...content} 
              showVideoButton={index === 0}
              onWatchDemo={() => setIsVideoModalOpen(true)}
            />
          ))}
        </div>

        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <SliderDots 
          count={heroContent.length} 
          current={currentPanel} 
          onChange={setCurrentPanel}
        />
      </div>

      <VideoModal 
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}