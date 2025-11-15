// File: components/LightPollution/BortleComprehensiveTable.tsx
import React from "react";

const data = [
  {
    number: 1,
    color: "bg-black",
    label: "excellent dark sky",
    mag: "22.00–21.99",
    naked: "≥ 7.5",
    limit320: "> 17",
    m33: "obvious",
    m31: "·",
    galaxy: "casts shadows",
    zodiac: "striking",
    pollution: "airglow apparent",
    clouds: "·",
    ground: "visible only as silhouettes",
  },
  {
    number: 2,
    color: "bg-gray-700",
    label: "average dark sky",
    mag: "21.99–21.89",
    naked: "7.0–7.49",
    limit320: "16.5",
    m33: "easy with direct vision",
    m31: "·",
    galaxy: "appears highly structured",
    zodiac: "bright, faint yellow color",
    pollution: "airglow faint",
    clouds: "dark everywhere",
    ground: "large near objects vague",
  },
  {
    number: 3,
    color: "bg-blue-700",
    label: "rural sky",
    mag: "21.89–21.69",
    naked: "6.5–6.99",
    limit320: "16.0",
    m33: "easy with averted vision",
    m31: "·",
    galaxy: "complex structure",
    zodiac: "obvious",
    pollution: "LP on horizon",
    clouds: "dark overhead",
    ground: "large distant objects vague",
  },
  {
    number: 4,
    color: "bg-green-500",
    label: "rural/suburban transition",
    mag: "21.69–20.49",
    naked: "6.0–6.49",
    limit320: "15.5",
    m33: "difficult with averted vision",
    m31: "obvious",
    galaxy: "only large structures",
    zodiac: "halfway to zenith",
    pollution: "low LP",
    clouds: "lit in distance",
    ground: "distant large objects distinct",
  },
  {
    number: 5,
    color: "bg-yellow-400",
    label: "suburban",
    mag: "20.49–19.50",
    naked: "5.5–5.99",
    limit320: "14.5–15.0",
    m33: "·",
    m31: "easy with direct vision",
    galaxy: "washed out",
    zodiac: "faint",
    pollution: "encircling LP",
    clouds: "brighter than sky",
    ground: "·",
  },
  {
    number: 6,
    color: "bg-orange-500",
    label: "bright suburban",
    mag: "19.50–18.94",
    naked: "5.0–5.49",
    limit320: "14.0–14.5",
    m33: "·",
    m31: "easy with averted vision",
    galaxy: "visible only near zenith",
    zodiac: "·",
    pollution: "LP to 35°",
    clouds: "fairly bright",
    ground: "small close objects distinct",
  },
  {
    number: 7,
    color: "bg-red-600",
    label: "suburban/urban transition",
    mag: "18.94–18.38",
    naked: "4.5–4.99",
    limit320: "14.0",
    m33: "·",
    m31: "difficult with averted vision",
    galaxy: "invisible",
    zodiac: "·",
    pollution: "LP to zenith",
    clouds: "brilliantly lit",
    ground: "·",
  },
  {
    number: 8,
    color: "bg-gray-300 text-black",
    label: "city sky",
    mag: "< 18.38",
    naked: "4.0–4.49",
    limit320: "13",
    m33: "·",
    m31: "·",
    galaxy: "·",
    zodiac: "·",
    pollution: "bright to 35°",
    clouds: "·",
    ground: "headlines legible",
  },
  {
    number: 9,
    color: "bg-white text-black",
    label: "inner city sky",
    mag: "·",
    naked: "≤ 4.0",
    limit320: "·",
    m33: "·",
    m31: "·",
    galaxy: "·",
    zodiac: "·",
    pollution: "bright at zenith",
    clouds: "·",
    ground: "·",
  },
];


export default function BortleComprehensiveTable() {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-lg bg-black/70 border border-white/10">
      <table className="min-w-full table-auto text-sm text-white">
        <thead className="bg-black/90 text-emerald-300">
          <tr>
            <th className="px-2 py-2">No.</th>
            <th className="px-2 py-2">Map Color</th>
            <th className="px-2 py-2">Label</th>
            <th className="px-2 py-2">Sky Mag</th>
            <th className="px-2 py-2">Naked Eye Lim. Mag</th>
            <th className="px-2 py-2">320mm Lim. Mag</th>
            <th className="px-2 py-2">Central Galaxy</th>
            <th className="px-2 py-2">Zodiacal Light</th>
            <th className="px-2 py-2">Light Pollution</th>
            <th className="px-2 py-2">Clouds</th>
            <th className="px-2 py-2">Ground Objects</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-white/10">
              <td className="px-2 py-2 text-center">{row.number}</td>
              <td className="px-2 py-2 text-center">
                <span className={`inline-block w-8 h-4 rounded-sm border ${row.color} border-white/50`} />
              </td>
              <td className="px-2 py-2">{row.label}</td>
              <td className="px-2 py-2">{row.mag}</td>
              <td className="px-2 py-2 text-center">{row.naked}</td>
              <td className="px-2 py-2 text-center">{row.limit320}</td>
              <td className="px-2 py-2">{row.galaxy}</td>
              <td className="px-2 py-2">{row.zodiac}</td>
              <td className="px-2 py-2">{row.pollution}</td>
              <td className="px-2 py-2">{row.clouds}</td>
              <td className="px-2 py-2">{row.ground}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
