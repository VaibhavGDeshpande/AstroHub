// File: components/LightPollution/BortleScaleChart.tsx
import React from "react";

const scale = [
  { label: "1", color: "bg-black", mag: "22.0-21.99", fraction: "<0.01", name: "Excellent dark sky" },
  { label: "2", color: "bg-gray-800", mag: "21.99-21.89", fraction: "0.01-0.06", name: "Average dark sky" },
  { label: "3", color: "bg-blue-700", mag: "21.89-21.69", fraction: "0.06-0.11", name: "Rural sky" },
  { label: "4", color: "bg-green-400", mag: "21.69-20.49", fraction: "0.11-1.00", name: "Rural/Suburban" },
  { label: "5", color: "bg-yellow-400", mag: "20.49-19.50", fraction: "1.00-3.00", name: "Suburban" },
  { label: "6", color: "bg-orange-500", mag: "19.50-18.94", fraction: "3.00-9.00", name: "Bright suburban" },
  { label: "7", color: "bg-red-600", mag: "18.94-18.38", fraction: "9.00-27.00", name: "Sub/Urban transition" },
  { label: "8", color: "bg-gray-300", mag: "<18.38", fraction: ">27.00", name: "City sky" },
  { label: "9", color: "bg-white", mag: "-", fraction: "-", name: "Inner city sky" },
];

export default function BortleScaleChart() {
  return (
    <div className="bg-black rounded-2xl shadow-lg p-5 w-full max-w-2xl">
      <h2 className="text-xl text-center font-bold pb-2 text-indigo-300">Bortle Scale Chart</h2>
      <div className="flex flex-col gap-2">
        {/* Color bar */}
        <div className="flex border-2 border-white/10 rounded overflow-hidden">
          {scale.map((s, i) => (
            <div key={i} className={`flex-1 h-8 ${s.color} flex justify-center items-center text-xs whitespace-nowrap`}>
              {s.label}
            </div>
          ))}
        </div>
        {/* Label legend */}
        <div className="flex justify-between w-full mt-2 text-xs text-white/80 font-semibold">
          {scale.map((s, i) => (
            <span key={i} className="text-center flex-1">{s.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
