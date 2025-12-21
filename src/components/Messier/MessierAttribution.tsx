"use client";

import { MessierInfo } from "@/types/messier";

export default function MessierAttribution({ info }: { info: MessierInfo }) {
  return (
    <div className="mt-12 text-xs text-slate-400 text-center leading-relaxed">
      <p className="font-semibold text-slate-200">Source</p>
      <p>{info.description}</p>
      {info.credit && <p className="mt-2 text-slate-500">{info.credit}</p>}
    </div>
  );
}

