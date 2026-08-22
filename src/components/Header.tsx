import React, { useRef, useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  TrendingUp,
  Building2,
  Users,
  Printer,
  RefreshCw,
  Upload,
  AlertTriangle,
  Moon,
  Sun,
  ShieldCheck,
  Search,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { parseUploadedExcel } from '../services/dataLoader';
import { AppDataStore } from '../services/dataLoader';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSync: () => void;
  onDataLoaded: (store: AppDataStore) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  duplicateCount: number;
  onOpenDuplicates: () => void;
  totalFacilities: number;
  lastUpdated: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSync,
  onDataLoaded,
  isDarkMode,
  setIsDarkMode,
  duplicateCount,
  onOpenDuplicates,
  totalFacilities,
  lastUpdated
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      try {
        const store = await parseUploadedExcel(files[0]);
        onDataLoaded(store);
        alert(`Đã tải lên và nạp thành công ${store.facilities.length} cơ sở từ file ${files[0].name}!`);
      } catch (err: any) {
        alert(`Lỗi đọc file Excel: ${err.message}`);
      }
    }
  };

  const navTabs = [
    { id: 'quick', label: 'Tra Cứu Nhanh CCCD', icon: Search, badge: 'Mới / Hiện Trường', highlight: true },
    { id: 'overview', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'industry', label: 'Báo Cáo Ngành Nghề', icon: FileSpreadsheet, badge: 'Công thức BC' },
    { id: 'weekly', label: 'Tiến Độ Theo Tuần', icon: TrendingUp, badge: 'Số liệu TK' },
    { id: 'facilities', label: 'Danh Bạ Cơ Sở', icon: Building2, count: totalFacilities },
    { id: 'officers', label: 'Cán Bộ & Nhập Liệu', icon: Users },
    { id: 'export', label: 'Xuất Báo Cáo & In', icon: Printer }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm no-print">
      {/* Top Banner */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white px-3 sm:px-4 lg:px-8 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto">
          {/* Logo & Agency Title */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-blue-950 shadow-md font-extrabold text-base shrink-0">
              <ShieldCheck className="h-5 w-5 text-blue-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Chi Cục QLTT Tỉnh An Giang
                </span>
                <span className="hidden sm:inline-block rounded bg-blue-700/80 px-1.5 py-0.2 text-[10px] font-medium text-blue-100">
                  Phòng NV-TH
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-tight">
                Tra Cứu Cơ Sở & Báo Cáo Thống Kê
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Duplicates Warning */}
            {duplicateCount > 0 && (
              <button
                onClick={onOpenDuplicates}
                className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 px-2 sm:px-2.5 py-1 text-[11px] font-semibold text-amber-200 transition-colors"
                title="Xem các cơ sở trùng lặp MST, CCCD hoặc SĐT"
              >
                <AlertTriangle className="h-3 w-3 text-amber-300 animate-pulse" />
                <span className="hidden sm:inline">{duplicateCount} nhóm trùng</span>
              </button>
            )}

            {/* Sync from Google Sheets Button */}
            <button
              onClick={onOpenSync}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-700 hover:bg-blue-600 border border-blue-500/40 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-white shadow-sm transition-all"
            >
              <RefreshCw className="h-3 w-3" />
              <span className="hidden sm:inline">Đồng bộ Sheets</span>
            </button>

            {/* Upload Excel Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx,.xls"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/40 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-white shadow-sm transition-all"
            >
              <Upload className="h-3 w-3" />
              <span className="hidden sm:inline">Nạp Excel</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-lg bg-blue-950/60 p-1.5 text-blue-200 hover:bg-blue-900 hover:text-white transition-colors"
              title="Chuyển chế độ Sáng / Tối"
            >
              {isDarkMode ? <Sun className="h-3.5 w-3.5 text-amber-300" /> : <Moon className="h-3.5 w-3.5 text-blue-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto">
        <nav className="flex space-x-1 overflow-x-auto py-1.5 scrollbar-none" aria-label="Tabs">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : tab.highlight
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : tab.highlight ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${
                    isActive
                      ? 'bg-blue-700 text-blue-100'
                      : tab.highlight
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  }`}>
                    {tab.count.toLocaleString('vi-VN')}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};