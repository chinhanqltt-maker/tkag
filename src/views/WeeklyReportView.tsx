import React, { useState } from 'react';
import { WeeklyRow } from '../types';
import { TEAM_LIST } from '../services/dataAggregator';
import { exportWeeklyProgressToExcel } from '../services/excelExporter';
import {
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Sparkles,
  BarChart3,
  Award,
  ChevronDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface WeeklyReportViewProps {
  weeklySummary: WeeklyRow[];
}

export const WeeklyReportView: React.FC<WeeklyReportViewProps> = ({ weeklySummary }) => {
  const [selectedWeekNum, setSelectedWeekNum] = useState<number | 'ALL'>('ALL');
  const [activeTableTab, setActiveTableTab] = useState<'ALL_IN_ONE' | 'TOTAL' | 'NEW' | 'RE'>('ALL_IN_ONE');

  // Filtered rows
  const filteredWeeks = selectedWeekNum === 'ALL'
    ? weeklySummary
    : weeklySummary.filter(w => w.weekNum === selectedWeekNum);

  // Trend data for AreaChart
  const trendData = weeklySummary.map(w => ({
    week: w.weekLabel,
    'Tổng cộng': w.total.all,
    'Mới': w.newSurvey.all,
    'Lại': w.reSurvey.all
  }));

  // Selected week team breakdown
  const currentWeek = typeof selectedWeekNum === 'number'
    ? weeklySummary.find(w => w.weekNum === selectedWeekNum)
    : weeklySummary[weeklySummary.length - 1];

  const currentWeekTeamData = currentWeek
    ? TEAM_LIST.map(t => ({
        team: t,
        'Mới': currentWeek.newSurvey.byTeam[t] || 0,
        'Lại': currentWeek.reSurvey.byTeam[t] || 0,
        'Tổng': currentWeek.total.byTeam[t] || 0
      }))
    : [];

  // Calculate overall weekly totals
  const totalAllWeeks = weeklySummary.reduce((acc, w) => acc + w.total.all, 0);
  const totalNewAllWeeks = weeklySummary.reduce((acc, w) => acc + w.newSurvey.all, 0);
  const totalReAllWeeks = weeklySummary.reduce((acc, w) => acc + w.reSurvey.all, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
              Sheet Số Liệu Thống Kê
            </span>
            <span className="text-xs text-slate-500">Tiến độ thống kê hằng tuần của 11 Đội QLTT</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Báo Cáo Tiến Độ Thống Kê Theo Tuần (Mới / Lại)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportWeeklyProgressToExcel(weeklySummary)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Xuất Excel Báo Cáo Tuần</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase">Tổng Lượt Thống Kê Toàn Tỉnh</p>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {totalAllWeeks.toLocaleString('vi-VN')}
          </p>
          <p className="text-xs text-slate-400 mt-1">Ghi nhận qua tất cả các tuần</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase">Thống Kê Mới</p>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {totalNewAllWeeks.toLocaleString('vi-VN')}
          </p>
          <p className="text-xs text-slate-400 mt-1">{((totalNewAllWeeks / (totalAllWeeks || 1)) * 100).toFixed(1)}% tổng số lượt</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase">Thống Kê Lại</p>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {totalReAllWeeks.toLocaleString('vi-VN')}
          </p>
          <p className="text-xs text-slate-400 mt-1">{((totalReAllWeeks / (totalAllWeeks || 1)) * 100).toFixed(1)}% tổng số lượt</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Area Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Xu Hướng Tiến Độ Thống Kê Qua Các Tuần
              </h3>
              <p className="text-xs text-slate-500">So sánh số lượng Thống kê Mới vs Thống kê Lại</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorTong" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMoi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }} />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="Tổng cộng" stroke="#2563eb" fillOpacity={1} fill="url(#colorTong)" strokeWidth={2} />
                <Area type="monotone" dataKey="Mới" stroke="#10b981" fillOpacity={1} fill="url(#colorMoi)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Week Team Bar Chart */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                {currentWeek?.weekLabel || 'Tuần Gần Nhất'}
              </h3>
            </div>
            <p className="text-xs text-slate-500">Số lượng thống kê chi tiết từng Đội trong tuần</p>
          </div>

          <div className="h-64 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentWeekTeamData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="team" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }} />
                <Bar dataKey="Mới" fill="#10b981" stackId="a" />
                <Bar dataKey="Lại" fill="#f59e0b" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Week Selector & Table Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Table View Mode */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTableTab('ALL_IN_ONE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTableTab === 'ALL_IN_ONE'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Bảng Tổng Hợp 3 Nhóm (Chuẩn Mẫu)
          </button>
          <button
            onClick={() => setActiveTableTab('TOTAL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTableTab === 'TOTAL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Chỉ xem Tổng Số
          </button>
          <button
            onClick={() => setActiveTableTab('NEW')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTableTab === 'NEW'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Chỉ xem Thống Kê Mới
          </button>
          <button
            onClick={() => setActiveTableTab('RE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTableTab === 'RE'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Chỉ xem Thống Kê Lại
          </button>
        </div>

        {/* Filter Week Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label className="text-xs text-slate-500 whitespace-nowrap">Chọn Tuần:</label>
          <select
            value={selectedWeekNum}
            onChange={e => setSelectedWeekNum(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10))}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Tất Cả Các Tuần ({weeklySummary.length})</option>
            {weeklySummary.map(w => (
              <option key={w.weekNum} value={w.weekNum}>
                {w.weekLabel} (Tổng: {w.total.all})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Weekly Data Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {activeTableTab === 'ALL_IN_ONE' ? (
                <>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                    <th rowSpan={2} className="py-3 px-4 font-bold border-r border-slate-200 dark:border-slate-700">Tuần</th>
                    <th colSpan={12} className="py-2 px-2 text-center font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-r border-slate-200 dark:border-slate-700">
                      TỔNG SỐ THỐNG KÊ
                    </th>
                    <th colSpan={12} className="py-2 px-2 text-center font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-r border-slate-200 dark:border-slate-700">
                      THỐNG KÊ MỚI
                    </th>
                    <th colSpan={12} className="py-2 px-2 text-center font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                      THỐNG KÊ LẠI
                    </th>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 text-[11px]">
                    {/* Total cols */}
                    {TEAM_LIST.map(t => <th key={`tot-${t}`} className="py-1 px-1.5 text-center font-semibold">{t.replace('Đội ', 'Đ')}</th>)}
                    <th className="py-1 px-2 text-center font-bold bg-blue-100/60 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 border-r border-slate-200 dark:border-slate-700">Tổng</th>
                    {/* New cols */}
                    {TEAM_LIST.map(t => <th key={`new-${t}`} className="py-1 px-1.5 text-center font-semibold">{t.replace('Đội ', 'Đ')}</th>)}
                    <th className="py-1 px-2 text-center font-bold bg-emerald-100/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border-r border-slate-200 dark:border-slate-700">Tổng</th>
                    {/* Re cols */}
                    {TEAM_LIST.map(t => <th key={`re-${t}`} className="py-1 px-1.5 text-center font-semibold">{t.replace('Đội ', 'Đ')}</th>)}
                    <th className="py-1 px-2 text-center font-bold bg-amber-100/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">Tổng</th>
                  </tr>
                </>
              ) : (
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4 font-bold">Tuần Thống Kê</th>
                  {TEAM_LIST.map(t => (
                    <th key={t} className="py-3 px-2 text-center font-bold">{t}</th>
                  ))}
                  <th className="py-3 px-4 text-right font-extrabold bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200">
                    Tổng Toàn Tỉnh
                  </th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredWeeks.map((w, idx) => {
                if (activeTableTab === 'ALL_IN_ONE') {
                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800">
                        {w.weekLabel}
                      </td>
                      {/* Total */}
                      {TEAM_LIST.map(t => (
                        <td key={`tot-${t}`} className="py-2 px-1 text-center font-mono text-slate-700 dark:text-slate-300">
                          {w.total.byTeam[t] || '-'}
                        </td>
                      ))}
                      <td className="py-2 px-2 text-center font-bold font-mono text-blue-600 bg-blue-50/40 dark:bg-blue-950/20 border-r border-slate-200 dark:border-slate-700">
                        {w.total.all}
                      </td>
                      {/* New */}
                      {TEAM_LIST.map(t => (
                        <td key={`new-${t}`} className="py-2 px-1 text-center font-mono text-emerald-700 dark:text-emerald-400">
                          {w.newSurvey.byTeam[t] || '-'}
                        </td>
                      ))}
                      <td className="py-2 px-2 text-center font-bold font-mono text-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 border-r border-slate-200 dark:border-slate-700">
                        {w.newSurvey.all}
                      </td>
                      {/* Re */}
                      {TEAM_LIST.map(t => (
                        <td key={`re-${t}`} className="py-2 px-1 text-center font-mono text-amber-700 dark:text-amber-400">
                          {w.reSurvey.byTeam[t] || '-'}
                        </td>
                      ))}
                      <td className="py-2 px-2 text-center font-bold font-mono text-amber-600 bg-amber-50/40 dark:bg-amber-950/20">
                        {w.reSurvey.all}
                      </td>
                    </tr>
                  );
                } else {
                  const sourceGroup = activeTableTab === 'TOTAL'
                    ? w.total
                    : activeTableTab === 'NEW'
                    ? w.newSurvey
                    : w.reSurvey;

                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                        {w.weekLabel}
                      </td>
                      {TEAM_LIST.map(t => (
                        <td key={t} className="py-2.5 px-2 text-center font-mono text-slate-800 dark:text-slate-200">
                          {sourceGroup.byTeam[t] || '-'}
                        </td>
                      ))}
                      <td className="py-2.5 px-4 text-right font-extrabold font-mono text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20">
                        {sourceGroup.all.toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
