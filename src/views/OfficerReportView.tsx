import React, { useState, useMemo } from 'react';
import { Facility, OfficerStats } from '../types';
import { calculateOfficerStats, TEAM_LIST } from '../services/dataAggregator';
import {
  Users,
  Search,
  Award,
  BarChart3,
  MapPin,
  FileCheck,
  Shield
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface OfficerReportViewProps {
  facilities: Facility[];
  onSelectOfficer: (officerName: string) => void;
}

export const OfficerReportView: React.FC<OfficerReportViewProps> = ({
  facilities,
  onSelectOfficer
}) => {
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('ALL');

  const officerStats = useMemo(() => calculateOfficerStats(facilities), [facilities]);

  const filteredOfficers = officerStats.filter(off => {
    if (selectedTeam !== 'ALL' && off.team !== selectedTeam) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return off.name.toLowerCase().includes(q) || off.team.toLowerCase().includes(q);
    }
    return true;
  });

  // Top 10 officers by facility count
  const top10Data = filteredOfficers.slice(0, 10).map(off => ({
    name: off.name,
    count: off.facilityCount,
    team: off.team
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
            Năng Suất Cán Bộ
          </span>
          <span className="text-xs text-slate-500">Phân công quản lý địa bàn và tiến độ nhập liệu</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          Báo Cáo Năng Suất Cán Bộ Quản Lý Địa Bàn & Nhập Liệu
        </h2>
      </div>

      {/* Top 10 Chart */}
      {top10Data.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Top Cán Bộ Phụ Trách Nhiều Cơ Sở Nhất
              </h3>
              <p className="text-xs text-slate-500">Số lượng cơ sở kinh doanh phân công theo công chức</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={top10Data}
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip
                  formatter={(val: any) => [`${val} cơ sở`, 'Khối lượng']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên cán bộ..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label className="text-xs text-slate-500 whitespace-nowrap">Lọc theo Đội:</label>
          <select
            value={selectedTeam}
            onChange={e => setSelectedTeam(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Tất cả Đội ({TEAM_LIST.length})</option>
            {TEAM_LIST.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Officers Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-3 font-bold w-12 text-center">STT</th>
                <th className="py-3 px-4 font-bold min-w-[180px]">Họ và Tên Cán Bộ</th>
                <th className="py-3 px-3 font-bold w-28 text-center">Đội QLTT</th>
                <th className="py-3 px-3 font-bold w-36 text-center">Vai Trò</th>
                <th className="py-3 px-3 font-bold w-32 text-right">Số Cơ Sở Phụ Trách</th>
                <th className="py-3 px-4 font-bold min-w-[200px]">Địa Bàn Phụ Trách (Phường/Xã)</th>
                <th className="py-3 px-3 font-bold w-24 text-center">Tra Cứu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOfficers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không tìm thấy cán bộ nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredOfficers.map((off, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3 px-3 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {off.name}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                        {off.team}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                        off.role === 'Cả hai'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                          : off.role === 'Quản lý địa bàn'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}>
                        {off.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold font-mono text-blue-600 dark:text-blue-400 text-sm">
                      {off.facilityCount.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-md">
                        {off.wards.slice(0, 3).map((w, wIdx) => (
                          <span key={wIdx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {w}
                          </span>
                        ))}
                        {off.wards.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            +{off.wards.length - 3} xã/phường
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onSelectOfficer(off.name)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100"
                      >
                        Xem cơ sở
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
