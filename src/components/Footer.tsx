import React from 'react';
import { ShieldCheck, Phone, UserCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 py-6 px-4 transition-colors no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Left: Organization Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-amber-300 font-extrabold shadow shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              Hệ Thống Tra Cứu Cơ Sở & Báo Cáo Thống Kê
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              Chi Cục Quản Lý Thị Trường Tỉnh An Giang
            </div>
          </div>
        </div>

        {/* Center: Author & Contact Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Người viết / Bản quyền:</span>
            <span className="font-extrabold text-blue-700 dark:text-amber-300">Võ Chí Nhân</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600 dark:text-slate-300">KSVTT phòng TCHC</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold ml-1">
            <Phone className="h-3.5 w-3.5" />
            <a href="tel:0914459992" className="hover:underline tracking-wider">0914.459.992</a>
          </div>
        </div>

        {/* Right: Copyright */}
        <div className="text-center md:text-right text-slate-500 dark:text-slate-400 space-y-0.5">
          <div>© {new Date().getFullYear()} Bản quyền thuộc về <strong className="text-slate-700 dark:text-slate-200">Võ Chí Nhân</strong></div>
          <div className="text-[11px] text-slate-400">Hệ thống chuyển đổi số QLTT An Giang</div>
        </div>
      </div>
    </footer>
  );
};
