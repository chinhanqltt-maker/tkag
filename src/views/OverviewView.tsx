import React from 'react';
import { Facility, IndustryRow, WeeklyRow } from '../types';
import { calculateOverviewKPIs, calculateTeamStats, TEAM_LIST } from '../services/dataAggregator';
import { KpiCard } from '../components/KpiCard';
import {
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Flame,
  PieChart as PieIcon,
  BarChart3,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface OverviewViewProps {
  facilities: Facility[];
  industrySummary: IndustryRow[];
  weeklySummary: WeeklyRow[];
  onSelectTeam: (team: string) => void;
  onSelectIndustry: (ind: string) => void;
}

const COLORS = ['#2563eb', '#38bdf8', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

export const OverviewView: React.FC<OverviewViewProps> = ({
  facilities,
  industrySummary,
  weeklySummary,
  onSelectTeam,
  onSelectIndustry
}) => {
  const kpi = calculateOverviewKPIs(facilities);
  const teamStats = calculateTeamStats(facilities);

  // Type Distribution Data
  const typeData = [
    { name: 'Cá nhân (Hộ KD)', value: kpi.caNhan, color: '#2563eb' },
    { name: 'Tổ chức (Doanh nghiệp)', value: kpi.toChuc, color: '#f59e0b' }
  ];

  // Latest weekly stats
  const latestWeek = weeklySummary.length > 0 ? weeklySummary[weeklySummary.length - 1] : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tổng Quan Quản Lý Địa Bàn & Cơ Sở Kinh Doanh
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dữ liệu tổng hợp toàn tỉnh An Giang qua 11 Đội Quản lý thị trường (Đội 2 - Đội 12)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" /> 100% Cơ sở đã được số hóa
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Tổng Số Cơ Sở Quản Lý"
          value={kpi.total}
          subtitle="Toàn địa bàn tỉnh An Giang"
          icon={Building2}
          colorClass="text-blue-600 dark:text-blue-400"
          bgClass="bg-blue-50 dark:bg-blue-900/30"
          badge="11 Đội QLTT"
        />

        <KpiCard
          title="Hộ Kinh Doanh Cá Thể"
          value={kpi.caNhan}
          subtitle={`${((kpi.caNhan / (kpi.total || 1)) * 100).toFixed(1)}% tổng cơ sở`}
          icon={Users}
          colorClass="text-indigo-600 dark:text-indigo-400"
          bgClass="bg-indigo-50 dark:bg-indigo-900/30"
          badge="Cá nhân"
        />

        <KpiCard
          title="Tổ Chức / Doanh Nghiệp"
          value={kpi.toChuc}
          subtitle={`${((kpi.toChuc / (kpi.total || 1)) * 100).toFixed(1)}% tổng cơ sở`}
          icon={Building2}
          colorClass="text-amber-600 dark:text-amber-400"
          bgClass="bg-amber-50 dark:bg-amber-900/30"
          badge="Tổ chức"
        />

        <KpiCard
          title="Tiến Độ Thống Kê Ghi Nhận"
          value={latestWeek ? latestWeek.total.all : '---'}
          subtitle={latestWeek ? `${latestWeek.weekLabel}: ${latestWeek.newSurvey.all} mới, ${latestWeek.reSurvey.all} lại` : 'Đang cập nhật'}
          icon={TrendingUp}
          colorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-emerald-50 dark:bg-emerald-900/30"
          badge="Tiến độ"
        />
      </div>

      {/* Charts Section 1: Team Distribution & Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Distribution Bar Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Phân Bổ Cơ Sở Theo Đội Quản Lý Thị Trường
              </h3>
              <p className="text-xs text-slate-500">So sánh số lượng cơ sở quản lý giữa 11 Đội QLTT</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpi.teamComparison} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="team" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString('vi-VN')} cơ sở`, 'Số lượng']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Type Distribution Pie Chart */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-amber-500" />
              Cơ Cấu Loại Hình Kinh Doanh
            </h3>
            <p className="text-xs text-slate-500">Tỷ trọng Cá nhân (HKD) vs Tổ chức (DN)</p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString('vi-VN')} cơ sở`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-600" />
                <span className="text-slate-600 dark:text-slate-400">Cá nhân (Hộ KD):</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{kpi.caNhan.toLocaleString('vi-VN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-slate-600 dark:text-slate-400">Tổ chức (Doanh nghiệp):</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{kpi.toChuc.toLocaleString('vi-VN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section 2: Top 10 Industries & Top 10 Wards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Key Industries */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="h-5 w-5 text-rose-500" />
                Top 10 Ngành Nghề Trọng Điểm
              </h3>
              <p className="text-xs text-slate-500">Các ngành hàng có mật độ cơ sở kinh doanh lớn nhất</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={kpi.topIndustries}
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString('vi-VN')} cơ sở`, 'Số lượng']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Wards / Locations */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-500" />
                Top 10 Phường / Xã Tập Trung Cơ Sở
              </h3>
              <p className="text-xs text-slate-500">Địa bàn hành chính có số lượng cơ sở quản lý cao nhất</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={kpi.topWards}
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString('vi-VN')} cơ sở`, 'Số lượng']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Cards Grid (Quick Drilldown) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Thống Kê Chi Tiết Từng Đội QLTT (11 Đội)
          </h3>
          <p className="text-xs text-slate-500">Nhấp vào Đội bất kỳ để xem danh bạ cơ sở</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {teamStats.map(team => (
            <div
              key={team.teamName}
              onClick={() => onSelectTeam(team.teamName)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                  {team.teamName}
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  {team.totalFacilities.toLocaleString('vi-VN')} CS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800/60 pt-2">
                <div>Tổ chức: <span className="font-semibold text-slate-700 dark:text-slate-300">{team.toChuc}</span></div>
                <div>Cá nhân: <span className="font-semibold text-slate-700 dark:text-slate-300">{team.caNhan}</span></div>
                <div>Cán bộ: <span className="font-semibold text-slate-700 dark:text-slate-300">{team.officers.length}</span></div>
                <div>Lượt TK: <span className="font-semibold text-slate-700 dark:text-slate-300">{team.totalSurveys}</span></div>
              </div>

              {team.topIndustries.length > 0 && (
                <div className="pt-1 flex flex-wrap gap-1">
                  {team.topIndustries.slice(0, 2).map((ind, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {ind.name}: {ind.count}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
