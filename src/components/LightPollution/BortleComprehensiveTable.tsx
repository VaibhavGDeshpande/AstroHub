import React from "react";

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
    <div className={`overflow-x-auto rounded-xl border border-slate-700/50 bg-black/50 ${className}`}>
      <table className="w-full text-sm text-white">
        <thead className="bg-slate-800/80 text-purple-300">
          <tr>
            <th className="px-4 py-3 text-left">Class</th>
            <th className="px-4 py-3 text-left">Color</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">Sky Mag</th>
            <th className="px-4 py-3 text-left">Naked Eye</th>
            <th className="px-4 py-3 text-left">Galaxy View</th>
            <th className="px-4 py-3 text-left">Zodiacal Light</th>
            <th className="px-4 py-3 text-left">Pollution</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
            <tr key={i} className="border-t border-slate-700/50 hover:bg-slate-700/20 transition-colors">
              <td className="px-4 py-3 font-bold text-purple-400">{row.number}</td>
              <td className="px-4 py-3">
                <span className={`inline-block w-8 h-8 rounded ${row.color} border border-white/30`} />
              </td>
              <td className="px-4 py-3 font-medium capitalize">{row.label}</td>
              <td className="px-4 py-3 text-slate-300">{row.mag}</td>
              <td className="px-4 py-3 text-slate-300">{row.naked}</td>
              <td className="px-4 py-3 text-slate-300">{row.galaxy}</td>
              <td className="px-4 py-3 text-slate-300">{row.zodiac}</td>
              <td className="px-4 py-3 text-slate-300">{row.pollution}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
