import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  trend?: string;
  badge?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass,
  bgClass,
  trend,
  badge,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-600' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
          </p>
        </div>
        <div className={`rounded-lg p-3 ${bgClass} ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              {trend}
            </span>
          )}
          {badge && (
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-medium text-slate-700 dark:text-slate-300">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
