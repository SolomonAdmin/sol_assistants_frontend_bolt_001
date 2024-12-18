import React from 'react';

export default function VideoLoop() {
  return (
    <div className="relative w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ maxHeight: '600px' }}
          >
            <source 
              src="https://solimages.s3.us-east-1.amazonaws.com/slider_man_at_work.mp4" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}