import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Calculating...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
      <Loader2 size={20} className="animate-spin text-primary-400" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
