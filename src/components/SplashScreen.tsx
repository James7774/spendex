"use client";
import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const SplashScreen = () => {

  return (
    <div className="splash-container">
      <div className="splash-background" />
      <div className="lottie-wrapper">
         <Player
            src="/animations/splash.json"
            autoplay
            loop
            style={{ width: '100%', height: '100%', background: 'transparent' }}
         />
      </div>

      <style jsx>{`
        .splash-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #0a0c10;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .splash-background {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .lottie-wrapper {
          width: min(320px, 80vw);
          height: min(320px, 80vw);
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 0 30px rgba(99, 102, 241, 0.3));
        }

        @keyframes fadeInScale {
          from { 
            opacity: 0; 
            transform: scale(0.85); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
