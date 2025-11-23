// 'use client'
// import { useState, useEffect, useCallback } from 'react';
// import { ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

// const ScreenSizeWarningModal = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

//   const handleClose = useCallback(() => {
//     setShowModal(false);
//     sessionStorage.setItem('modalDismissed', 'true');
//   }, []);

//   useEffect(() => {
//     const checkScreenSize = () => {
//       const width = window.innerWidth;
//       const modalDismissed = sessionStorage.getItem('modalDismissed');
      
//       if (width < 768) {
//         setScreenSize('mobile');
//         if (!modalDismissed) {
//           setShowModal(true);
//         }
//       } else if (width >= 768 && width < 1024) {
//         setScreenSize('tablet');
//         setShowModal(false);
//       } else {
//         setScreenSize('desktop');
//         setShowModal(false);
//       }
//     };

//     checkScreenSize();

//     let timeoutId: NodeJS.Timeout;
//     const debouncedResize = () => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(checkScreenSize, 150);
//     };

//     window.addEventListener('resize', debouncedResize);
//     return () => {
//       window.removeEventListener('resize', debouncedResize);
//       clearTimeout(timeoutId);
//     };
//   }, []);

//   useEffect(() => {
//     if (!showModal) return;

//     const handleEscapeKey = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         handleClose();
//       }
//     };

//     document.addEventListener('keydown', handleEscapeKey);
//     document.body.style.overflow = 'hidden';

//     return () => {
//       document.removeEventListener('keydown', handleEscapeKey);
//       document.body.style.overflow = 'unset';
//     };
//   }, [showModal, handleClose]);

//   const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (e.target === e.currentTarget) {
//       handleClose();
//     }
//   };

//   if (!showModal) return null;

//   return (
//     <div 
//       className="fixed inset-0 z-[9999] overflow-y-auto"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="modal-title"
//       aria-describedby="modal-description"
//     >
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-black/95 backdrop-blur-lg"
//         onClick={handleBackdropClick}
//       >
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div 
//             className="absolute top-5 left-10 w-32 h-32 bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl animate-pulse" 
//             style={{ animationDuration: '8s' }} 
//           />
//           <div 
//             className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-radial from-blue-500/10 via-blue-500/5 to-transparent rounded-full blur-xl animate-pulse" 
//             style={{ animationDuration: '12s', animationDelay: '2s' }} 
//           />
//           <div className="cosmic-wave absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/5 to-transparent animate-wave-move" />
//         </div>
//       </div>

//       {/* Compact Modal Content */}
//       <div className="relative flex items-center justify-center min-h-screen p-3 sm:p-4">
//         <div className="relative w-full max-w-md bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden max-h-[95vh]">
//           <div className="absolute inset-0 rounded-2xl border border-blue-400/20 opacity-50 animate-pulse" />
          
//           {/* Scrollable Content with Reduced Height */}
//           <div className="p-4 sm:p-5 text-center relative z-10 overflow-y-auto max-h-[95vh]">
//             {/* Compact Warning Icon */}
//             <div className="relative mx-auto mb-2 w-12 h-12">
//               <div 
//                 className="absolute inset-0 border-2 border-yellow-400/30 rounded-full animate-spin" 
//                 style={{ animationDuration: '6s' }} 
//               />
//               <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-400/30">
//                 <div className="text-white text-xl font-bold animate-pulse">⚠</div>
//               </div>
//             </div>

//             {/* Title */}
//             <h2 
//               id="modal-title"
//               className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2"
//             >
//               Better on Desktop
//             </h2>

//             {/* Device Message - Compact */}
//             <div id="modal-description" className="space-y-2 mb-3">
//               {screenSize === 'mobile' && (
//                 <>
//                   <DevicePhoneMobileIcon className="w-8 h-8 mx-auto text-blue-400" />
//                   <p className="text-sm text-slate-300">
//                     You&apos;re on <span className="text-blue-400 font-semibold">mobile</span>
//                   </p>
//                 </>
//               )}
              
//               {screenSize === 'tablet' && (
//                 <>
//                   <div className="w-8 h-8 mx-auto text-purple-400 flex items-center justify-center">
//                     <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
//                     </svg>
//                   </div>
//                   <p className="text-sm text-slate-300">
//                     You&apos;re on <span className="text-purple-400 font-semibold">tablet</span>
//                   </p>
//                 </>
//               )}

//               <p className="text-xs text-slate-400 leading-relaxed px-1">
//                 High-performance <span className="text-cyan-400 font-medium">PC/laptop/Phone</span> recommended
//               </p>
//             </div>

//             {/* Compact Performance Warning */}
//             <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-lg p-2.5 mb-3 border border-red-500/30">
//               <div className="flex items-center justify-center mb-1.5">
//                 <span className="text-red-400 text-base mr-1.5">⚡</span>
//                 <span className="text-red-400 font-semibold text-xs">3D Models Require High Memory</span>
//               </div>
//               <ul className="text-xs text-slate-400 space-y-0.5 text-left max-w-xs mx-auto">
//                 <li className="flex items-start">
//                   <span className="text-red-400 mr-1.5 mt-0.5">•</span>
//                   <span><span className="text-orange-400 font-medium">3D Earth</span> - High memory needed</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-red-400 mr-1.5 mt-0.5">•</span>
//                   <span><span className="text-red-400 font-semibold">3D Mars</span> - Most demanding</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-red-400 mr-1.5 mt-0.5">•</span>
//                   <span><span className="text-orange-400 font-medium">3D Moon</span> - High memory needed</span>
//                 </li>
//               </ul>
//             </div>

//             {/* Compact Recommendation */}
//             <div className="bg-slate-900/50 rounded-lg p-2.5 mb-3 border border-slate-700/30">
//               <div className="flex items-center justify-center mb-1.5">
//                 <ComputerDesktopIcon className="w-5 h-5 text-green-400 mr-1.5" />
//                 <span className="text-green-400 font-semibold text-xs">Recommended</span>
//               </div>
//               <ul className="text-xs text-slate-400 space-y-0.5 text-left max-w-xs mx-auto">
//                 <li className="flex items-center">
//                   <span className="text-cyan-400 mr-1.5">•</span>
//                   High-performance PC/Laptop/Phone
//                 </li>
//                 <li className="flex items-center">
//                   <span className="text-cyan-400 mr-1.5">•</span>
//                   8GB+ RAM for 3D rendering
//                 </li>
//                 <li className="flex items-center">
//                   <span className="text-cyan-400 mr-1.5">•</span>
//                   HD imagery & smooth experience
//                 </li>
//               </ul>
//             </div>

//             {/* Compact Action Button */}
//             <button
//               onClick={handleClose}
//               className="w-full group relative px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white text-sm font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-95"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//               <span className="relative flex items-center justify-center space-x-2 z-10">
//                 <span>Continue Anyway</span>
//                 <span className="text-base group-hover:translate-x-1 transition-transform">🚀</span>
//               </span>
//             </button>

//             <p className="text-xs text-slate-500 mt-2">
//               May experience slower performance
//             </p>
//           </div>

//           {/* Bottom accent */}
//           <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-60" />
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes wave-move {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }

//         .animate-wave-move {
//           animation: wave-move 30s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ScreenSizeWarningModal;
