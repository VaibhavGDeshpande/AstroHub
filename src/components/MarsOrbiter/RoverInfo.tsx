// // components/RoverInfo.tsx
// 'use client';

// import { motion } from 'framer-motion';
// import { RocketLaunchIcon, CalendarDaysIcon, FlagIcon } from '@heroicons/react/24/outline';
// import { MarsOrbiter } from '@/types/mars_orbiter';

// interface RoverInfoProps {
//   rover: MarsOrbiter['rover'];
// }

// export default function RoverInfo({ rover }: RoverInfoProps) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6"
//     >
//       <div className="flex items-center gap-2 mb-4">
//         <RocketLaunchIcon className="h-5 w-5 text-blue-400" />
//         <h2 className="text-xl font-bold text-white capitalize">{rover.name} Rover</h2>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
//           <div className="flex items-center gap-2 mb-1">
//             <CalendarDaysIcon className="h-4 w-4 text-slate-400" />
//             <h3 className="text-sm text-slate-400">Launch Date</h3>
//           </div>
//           <p className="text-white font-medium">
//             {new Date(rover.launch_date).toLocaleDateString()}
//           </p>
//         </div>

//         <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
//           <div className="flex items-center gap-2 mb-1">
//             <CalendarDaysIcon className="h-4 w-4 text-slate-400" />
//             <h3 className="text-sm text-slate-400">Landing Date</h3>
//           </div>
//           <p className="text-white font-medium">
//             {new Date(rover.landing_date).toLocaleDateString()}
//           </p>
//         </div>

//         <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
//           <div className="flex items-center gap-2 mb-1">
//             <FlagIcon className="h-4 w-4 text-slate-400" />
//             <h3 className="text-sm text-slate-400">Status</h3>
//           </div>
//           <p
//             className={`text-sm px-2 py-0.5 rounded-full inline-block font-medium ${
//               rover.status === 'active'
//                 ? 'bg-green-500/20 text-green-300 border border-green-400/40'
//                 : 'bg-slate-600/30 text-slate-300 border border-slate-500/40'
//             }`}
//           >
//             {rover.status.charAt(0).toUpperCase() + rover.status.slice(1)}
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   );
// }
