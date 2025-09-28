'use client';

import React from 'react';

export default function LoadingOverlay() {
  return (
    <div id="loadingOverlay" className="loading-overlay">
      <h1>Loading Moon Viewer...</h1>
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>

      <style jsx>{`
        .loading-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 20px;
          border-radius: 8px;
          z-index: 1000;
          text-align: center;
        }

        .loading-spinner {
          margin-top: 15px;
        }

        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid #fff;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
