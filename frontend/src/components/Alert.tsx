import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface Props {
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
}

const STYLES = {
  error: { cls: 'error-box', Icon: XCircle, iconCls: 'text-red-400' },
  warning: { cls: 'warning-box', Icon: AlertTriangle, iconCls: 'text-amber-400' },
  success: { cls: 'success-box', Icon: CheckCircle, iconCls: 'text-emerald-400' },
  info: { cls: 'bg-blue-900/20 border border-blue-700/40 rounded-lg p-4 text-blue-300 text-sm', Icon: Info, iconCls: 'text-blue-400' },
};

export default function Alert({ type, message }: Props) {
  const { cls, Icon, iconCls } = STYLES[type];
  return (
    <div className={`${cls} flex items-start gap-3 animate-fade-in`}>
      <Icon size={16} className={`${iconCls} mt-0.5 flex-shrink-0`} />
      <span>{message}</span>
    </div>
  );
}
