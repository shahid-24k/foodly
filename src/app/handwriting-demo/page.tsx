'use client';

import { useState } from 'react';
import { HandwritingSvg } from '@/components/ui/handwriting-svg';

export default function HandwritingDemoPage() {
  const [text, setText] = useState('FOODLY');
  const [duration, setDuration] = useState(2.5);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm flex flex-col items-center space-y-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-200">
          Handwriting SVG Animation
        </h1>

        <div className="w-full flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 p-8 min-h-[220px]">
          <HandwritingSvg
            key={`${text}-${duration}`}
            text={text}
            width={340}
            height={160}
            fontSize={64}
            strokeWidth={2}
            duration={duration}
            className="text-purple-400"
          />
        </div>

        <div className="w-full space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Input Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type anything..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span className="font-semibold uppercase tracking-wider">Duration</span>
              <span>{duration}s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
