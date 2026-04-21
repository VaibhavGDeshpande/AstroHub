import React from "react";
import { motion } from "framer-motion";

export const tableData = [
  {
    number: 1,
    color: "bg-black",
    label: "excellent dark sky",
    mag: "22.00–21.99",
    naked: "≥ 7.5",
    galaxy: "casts shadows",
    zodiac: "striking",
    pollution: "airglow apparent",
  },
  {
    number: 2,
    color: "bg-gray-700",
    label: "average dark sky",
    mag: "21.99–21.89",
    naked: "7.0–7.49",
    galaxy: "appears highly structured",
    zodiac: "bright, faint yellow",
    pollution: "airglow faint",
  },
  {
    number: 3,
    color: "bg-blue-700",
    label: "rural sky",
    mag: "21.89–21.69",
    naked: "6.5–6.99",
    galaxy: "complex structure",
    zodiac: "obvious",
    pollution: "LP on horizon",
  },
  {
    number: 4,
    color: "bg-green-500",
    label: "rural/suburban transition",
    mag: "21.69–20.49",
    naked: "6.0–6.49",
    galaxy: "large structures",
    zodiac: "halfway to zenith",
    pollution: "low LP",
  },
  {
    number: 5,
    color: "bg-yellow-400",
    label: "suburban",
    mag: "20.49–19.50",
    naked: "5.5–5.99",
    galaxy: "washed out",
    zodiac: "faint",
    pollution: "encircling LP",
  },
  {
    number: 6,
    color: "bg-orange-500",
    label: "bright suburban",
    mag: "19.50–18.94",
    naked: "5.0–5.49",
    galaxy: "visible only near zenith",
    zodiac: "barely visible",
    pollution: "LP to 35°",
  },
  {
    number: 7,
    color: "bg-red-600",
    label: "suburban/urban transition",
    mag: "18.94–18.38",
    naked: "4.5–4.99",
    galaxy: "invisible",
    zodiac: "invisible",
    pollution: "LP to zenith",
  },
  {
    number: 8,
    color: "bg-gray-300 text-black",
    label: "city sky",
    mag: "< 18.38",
    naked: "4.0–4.49",
    galaxy: "invisible",
    zodiac: "invisible",
    pollution: "bright to 35°",
  },
  {
    number: 9,
    color: "bg-white text-black",
    label: "inner city sky",
    mag: "—",
    naked: "≤ 4.0",
    galaxy: "invisible",
    zodiac: "invisible",
    pollution: "bright at zenith",
  },
];

type BortleComprehensiveTableProps = {
  className?: string;
};

export default function BortleComprehensiveTable({ className = "" }: BortleComprehensiveTableProps) {
  return (
    <div className={`${className}`}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-[1.5rem] border border-white/10 bg-black/40 shadow-2xl">
        <table className="w-full text-sm text-white">
          <thead className="bg-white/5 text-purple-300">
            <tr>
              <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px]">Class</th>
              <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px]">Color</th>
              <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px]">Description</th>
              <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px]">Sky Mag</th>
              <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px]">Naked Eye</th>
              <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px]">Galaxy View</th>
              <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px]">Zodiacal</th>
              <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px]">Pollution</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-black text-purple-400 text-lg">{row.number}</td>
                <td className="px-6 py-4">
                  <div className={`w-8 h-8 rounded-lg ${row.color} border border-white/20 shadow-lg group-hover:scale-110 transition-transform`} />
                </td>
                <td className="px-6 py-4 font-bold text-white capitalize">{row.label}</td>
                <td className="px-6 py-4 text-slate-400 font-medium">{row.mag}</td>
                <td className="px-6 py-4 text-slate-400 font-medium">{row.naked}</td>
                <td className="px-6 py-4 text-slate-400 font-medium">{row.galaxy}</td>
                <td className="px-6 py-4 text-slate-400 font-medium">{row.zodiac}</td>
                <td className="px-6 py-4 text-slate-400 font-medium">{row.pollution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {tableData.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-purple-400">{row.number}</span>
                <div className={`w-8 h-8 rounded-lg ${row.color} border border-white/20`} />
                <h3 className="font-bold text-white capitalize">{row.label}</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Sky Mag</p>
                <p className="text-xs font-bold text-slate-300">{row.mag}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Naked Eye</p>
                <p className="text-xs font-bold text-slate-300">{row.naked}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Galaxy View</p>
                <p className="text-xs font-bold text-slate-300">{row.galaxy}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Zodiacal</p>
                <p className="text-xs font-bold text-slate-300">{row.zodiac}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Pollution Report</p>
                <p className="text-xs font-bold text-slate-300">{row.pollution}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
