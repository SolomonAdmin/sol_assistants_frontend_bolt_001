import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroPanelProps } from './types';

export default function HeroPanel({ 
  title, 
  description, 
  image,
  imageAlt,
  logos,
  showVideoButton,
  onWatchDemo
}: HeroPanelProps) {
  return (
    <div className="w-full flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              {title}
            </h1>
            <p className="text-base lg:text-lg mb-6 text-blue-100">
              {description}
            </p>
            <div className="flex gap-4">
              {title.includes('Workato') ? (
                <a
                  href="https://www.workato.com/request_demo?&utm_campaign=Partners&utm_source=150"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center group"
                >
                  See Workato in Action
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              ) : (
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center group"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              {showVideoButton && (
                <button 
                  onClick={onWatchDemo}
                  className="border border-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white/10 transition-colors text-white"
                >
                  Watch Demo
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            {title.includes('SaaS') ? (
              <div className="relative w-full h-full">
                <img
                  src={image}
                  alt={imageAlt}
                  className="max-w-[50%] md:max-w-[60%] h-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 p-4">
                  {logos?.map((logo, index) => (
                    <img
                      key={index}
                      src={logo.src}
                      alt={logo.alt}
                      className="h-8 w-auto object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-200"
                      loading="eager"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <img
                src={image}
                alt={imageAlt}
                className="max-w-[50%] md:max-w-[60%] h-auto transform hover:scale-105 transition-transform duration-300"
                style={{ marginBottom: '-48px', marginRight: '15%' }}
                loading="eager"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}