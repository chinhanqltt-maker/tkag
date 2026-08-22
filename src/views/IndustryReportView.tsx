import React, { useState } from 'react';
import { IndustryRow } from '../types';
import { TEAM_LIST } from '../services/dataAggregator';
import { exportIndustryMatrixToExcel } from '../services/excelExporter';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  BarChart3,
  Building2,
  ChevronRight,
  Sparkles
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

interface IndustryReportViewProps {
  industrySummary: IndustryRow[];
  onDrillDownIndustry: (industryName: string) => void;
}

const CATEGORY_GROUPS = [
  { id: 'ALL', label: 'Tất Cả Ngành Nghề' },
  { id: 'FUEL', label: 'Xăng Dầu & LPG', match: ['lpg', 'xăng dầu'] },
  { id: 'AGRI', label: 'Nông Nghiệp & BVTV', match: ['phân bón', 'bvtv', 'vật tư nông nghiệp', 'thú y', 'thức ăn'] },
  { id: 'FOOD', label: 'Thực Phẩm & Đồ Uống', match: ['thực phẩm', 'rượu', 'bia', 'thuốc lá', 'sữa', 'dầu thực vật', 'bánh', 'bột', 'bún'] },
  { id: 'MED', label: 'Y Dược & Mỹ Phẩm', match: ['tân dược', 'đông y', 'mỹ phẫm', 'mỹ phẩm'] },
  { id: 'CONSUMER', label: 'Hàng Tiêu Dùng & Dịch Vụ', match: ['đồng hồ', 'mắt kính', 'quần áo', 'điện thoại', 'điện gia dụng', 'lưu trú', 'ăn uống'] },
  { id: 'AUTO', label: 'Cơ Khí & Phương Tiện', match: ['vật tư đồ sắt', 'vật liệu xây dựng', 'điện máy', 'nội thất', 'phụ tùng', 'xe'] }
];

export const IndustryReportView: React.FC<IndustryReportViewProps> = ({
  industrySummary,
  onDrillDownIndustry
}) => {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryRow | null>(
    industrySummary.find(i => i.name === 'Xăng dầu') || industrySummary[3] || null
  );

  // Filter items
  const filteredRows = industrySummary.filter(item => {
    if (item.isCategoryHeader) return true; // keep category headers

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCode = item.code.toLowerCase().includes(q);
      if (!matchName && !matchCode) return false;
    }

    // Category group filter
    if (selectedGroup !== 'ALL') {
      const group = CATEGORY_GROUPS.find(g => g.id === selectedGroup);
      if (group && group.match) {
        const itemLower = item.name.toLowerCase();
        const match = group.match.some(keyword => itemLower.includes(keyword));
        if (!match) return false;
      }
    }

    return true;
  });

  // Selected industry chart data
  const chartData = selectedIndustry
    ? TEAM_LIST.map(t => ({
        team: t,
        count: selectedIndustry.teams[t] || 0
      }))
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
              Sheet Công Thức ( BC)
            </span>
            <span className="text-xs text-slate-500">Phân loại theo ngành nghề & Đội QLTT</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Báo Cáo Tổng Hợp Cơ Sở Kinh Doanh Theo Ngành Nghề
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportIndustryMatrixToExcel(industrySummary)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Xuất Excel Biểu Mẫu BC</span>
          </button>
        </div>
      </div>

      {/* Selected Industry Chart Spotlight */}
      {selectedIndustry && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white dark:from-slate-900 dark:to-slate-850 p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-blue-600 text-white">
                  {selectedIndustry.code ? `Mã ${selectedIndustry.code}` : 'Chỉ số'}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Ngành: {selectedIndustry.name.trim()}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Tổng cộng toàn tỉnh: <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">{selectedIndustry.total.toLocaleString('vi-VN')}</span> cơ sở
              </p>
            </div>

            <button
              onClick={() => onDrillDownIndustry(selectedIndustry.name.trim())}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors self-start lg:self-auto"
            >
              <span>Xem danh sách {selectedIndustry.total} cơ sở ngành này</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="team" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} cơ sở`, selectedIndustry.name]}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm ngành nghề..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Group Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORY_GROUPS.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedGroup === g.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-3 font-bold w-12 text-center">STT</th>
                <th className="py-3 px-4 font-bold min-w-[220px]">Ngành Nghề Kinh Doanh</th>
                {TEAM_LIST.map(t => (
                  <th key={t} className="py-3 px-2.5 font-bold text-center w-16">
                    {t}
                  </th>
                ))}
                <th className="py-3 px-3 font-extrabold text-right w-20 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200">
                  Tổng
                </th>
                <th className="py-3 px-2 text-center w-16">Xem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRows.map((row, idx) => {
                const isSelected = selectedIndustry?.name === row.name;
                const isHeader = row.isCategoryHeader;

                return (
                  <tr
                    key={idx}
                    onClick={() => !isHeader && setSelectedIndustry(row)}
                    className={`transition-colors cursor-pointer ${
                      isHeader
                        ? 'bg-slate-50 dark:bg-slate-850 font-bold text-slate-900 dark:text-white'
                        : isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                      {row.code || (isHeader ? '' : idx + 1)}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">
                      <span className={isHeader ? 'font-extrabold text-blue-600 dark:text-blue-400' : ''}>
                        {row.name}
                      </span>
                    </td>
                    {TEAM_LIST.map(t => {
                      const count = row.teams[t] || 0;
                      return (
                        <td
                          key={t}
                          className={`py-2.5 px-2 text-center font-mono ${
                            count > 0 ? 'text-slate-800 dark:text-slate-200 font-semibold' : 'text-slate-300 dark:text-slate-700'
                          }`}
                        >
                          {count > 0 ? count.toLocaleString('vi-VN') : '-'}
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-3 text-right font-extrabold font-mono text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/20">
                      {row.total.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {!isHeader && row.total > 0 && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onDrillDownIndustry(row.name.trim());
                          }}
                          className="p-1 rounded text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                          title="Xem danh sách cơ sở"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
