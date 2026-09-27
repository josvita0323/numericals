import React from 'react';

interface Props {
  title: string;
  subtitle?: string;
  module?: string;
  moduleColor?: string;
  children: React.ReactNode;
}

export default function MethodLayout({ title, subtitle, module: mod, moduleColor = 'text-primary-400', children }: Props) {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        {mod && (
          <span className={`text-xs font-semibold uppercase tracking-widest ${moduleColor} mb-1 block`}>
            {mod}
          </span>
        )}
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-slate-400 mt-1 text-sm">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
