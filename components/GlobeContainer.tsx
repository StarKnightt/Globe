'use client';

import { CobeGlobe } from '@/components/globe/CobeGlobe';

export default function GlobeContainer() {
  return (
    <div className="h-screen w-screen bg-slate-950">
      <CobeGlobe />
    </div>
  );
}