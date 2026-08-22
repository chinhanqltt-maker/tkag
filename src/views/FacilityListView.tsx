import React, { useState, useMemo } from 'react';
import { Facility, FilterState } from '../types';
import {
  filterFacilities,
  TEAM_LIST,
  getDistinctWards,
  getDistinctOfficers
} from '../services/dataAggregator';
import { exportFacilitiesToExcel } from '../services/excelExporter';
import { FacilityModal } from '../components/FacilityModal';
import { SearchableSelect } from '../components/SearchableSelect';
import {
  Building2,
  User,
  Search,
  Filter,
  Download,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  MapPin,
  Phone,
  FileText,
  X,
  Sparkles
} from 'lucide-react';

interface FacilityListViewProps {
  facilities: Facility[];
  initialFilter?: Partial<FilterState>;
  onClearInitialFilter?: () => void;
}

const DEFAULT_FILTER: FilterState = {
  search: '',
  team: 'ALL',
  facilityType: 'ALL',
  industry: 'ALL',
  ward: 'ALL',
  surveyWeek: 'ALL',
  surveyType: 'ALL',
  status: 'ALL',
  officer: 'ALL'
};

const INDUSTRY_LIST = [
  'LPG', 'Xăng dầu', 'Phân bón', 'Thuốc BVTV', 'Vật tư nông nghiệp',
  'Thực phẩm công thương', 'Rượu', 'Bia', 'Thuốc lá', 'Sữa',
  'Dầu thực vật', 'Bánh', 'Tân dược', 'Đông y', 'Thú y', 'Thủy sản',
  'Mỹ phẫm', 'Đồng hồ', 'Mắt kính', 'Quần áo', 'Điện thoại', 'Điện gia dụng',
  'Vật liệu xây dựng', 'Lưu trú', 'Ăn uống', 'Vật tư đồ sắt', 'Điện máy', 'Xe máy', 'Xe ôtô'
];

export const FacilityListView: React.FC<FacilityListViewProps> = ({
  facilities,
  initialFilter,
  onClearInitialFilter
}) => {
  const [filter, setFilter] = useState<FilterState>({
    ...DEFAULT_FILTER,
    ...initialFilter
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  // Extract distinct wards & officers for dropdowns
  const distinctWards = useMemo(() => getDistinctWards(facilities), [facilities]);
  const distinctOfficers = useMemo(() => getDistinctOfficers(facilities), [facilities]);

  // Filter facilities
  const filteredData = useMemo(() => {
    return filterFacilities(facilities, filter);
  }, [facilities, filter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilter(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilter = () => {
    setFilter(DEFAULT_FILTER);
    if (onClearInitialFilter) onClearInitialFilter();
    setPage(1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
              Sheet OK & D2-D12
            </span>
            <span className="text-xs text-slate-500">Danh bạ tổng hợp 11.422+ cơ sở kinh doanh toàn tỉnh</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Tra Cứu & Quản Lý Hồ Sơ Cơ Sở Kinh Doanh
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportFacilitiesToExcel(filteredData)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Xuất Excel ({filteredData.length.toLocaleString('vi-VN')} cơ sở)</span>
          </button>
        </div>
      </div>

      {/* Multi-Filter Panel */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Quick Keyword Search Box */}
        <div className="space-y-2.5">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600 dark:text-blue-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={filter.search}
                onChange={e => handleFilterChange('search', e.target.value)}
                placeholder="Gõ từ khóa tìm kiếm: Tên cơ sở, Tên bảng hiệu, Chủ hộ / Người đại diện, MST, CCCD, SĐT, Địa chỉ, Xã/Phường, Giấy phép..."
                className="w-full pl-11 pr-10 py-3 text-sm rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-inner font-medium transition-all"
              />
              {filter.search && (
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  title="Xóa nội dung tìm kiếm"
                >
                  <X className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-full p-0.5" />
                </button>
              )}
            </div>

            <button
              onClick={handleResetFilter}
              className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors w-full md:w-auto justify-center shrink-0 cursor-pointer shadow-sm"
              title="Đặt lại toàn bộ tiêu chí về mặc định"
            >
              <RotateCcw className="h-4 w-4 text-slate-500" />
              <span>Đặt lại bộ lọc</span>
            </button>
          </div>

          {/* Quick tags & status indicator */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-[11px] text-slate-600 dark:text-slate-300">Gợi ý tìm nhanh:</span>
              {['Xăng dầu', 'LPG', 'Phân bón', 'Thuốc BVTV', 'Thực phẩm', 'Sữa', 'Thuốc lá', 'Tân dược', 'Ăn uống'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleFilterChange('search', tag)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                    filter.search === tag
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/40 dark:hover:text-blue-300 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
              Kết quả: {filteredData.length.toLocaleString('vi-VN')} / {facilities.length.toLocaleString('vi-VN')} cơ sở
            </div>
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {/* Team */}
          <SearchableSelect
            label="Đội QLTT"
            options={TEAM_LIST}
            value={filter.team}
            onChange={val => handleFilterChange('team', val)}
            allLabel={`Tất cả Đội (${TEAM_LIST.length})`}
            placeholder="Gõ tìm Đội..."
          />

          {/* Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Loại hình</label>
            <select
              value={filter.facilityType}
              onChange={e => handleFilterChange('facilityType', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Tất cả loại hình</option>
              <option value="Cá nhân">Cá nhân (Hộ KD)</option>
              <option value="Tổ chức">Tổ chức (Doanh nghiệp)</option>
            </select>
          </div>

          {/* Industry */}
          <SearchableSelect
            label="Ngành hàng"
            options={INDUSTRY_LIST}
            value={filter.industry}
            onChange={val => handleFilterChange('industry', val)}
            allLabel="Tất cả ngành nghề"
            placeholder="Gõ tên ngành..."
          />

          {/* Ward */}
          <SearchableSelect
            label="Phường / Xã"
            options={distinctWards}
            value={filter.ward}
            onChange={val => handleFilterChange('ward', val)}
            allLabel={`Tất cả Phường/Xã (${distinctWards.length})`}
            placeholder="Gõ tên Xã / Phường..."
          />

          {/* Survey Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Phân loại TK</label>
            <select
              value={filter.surveyType}
              onChange={e => handleFilterChange('surveyType', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Tất cả phân loại</option>
              <option value="Mới">Thống kê Mới</option>
              <option value="Lại">Thống kê Lại</option>
            </select>
          </div>

          {/* Officer */}
          <SearchableSelect
            label="Cán bộ phụ trách"
            options={distinctOfficers}
            value={filter.officer}
            onChange={val => handleFilterChange('officer', val)}
            allLabel={`Tất cả cán bộ (${distinctOfficers.length})`}
            placeholder="Gõ tên cán bộ (Nhân, Tuấn...)"
          />
        </div>

        {/* Filter summary status */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Tìm thấy <strong className="text-blue-600 dark:text-blue-400 font-extrabold">{filteredData.length.toLocaleString('vi-VN')}</strong> cơ sở phù hợp
          </span>
          <span>Trang {currentPage} / {totalPages}</span>
        </div>
      </div>

      {/* Facilities Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-3 font-bold w-12 text-center">STT</th>
                <th className="py-3 px-2.5 font-bold w-20 text-center">Đội</th>
                <th className="py-3 px-4 font-bold min-w-[200px]">Tên Cơ Sở / Hộ Kinh Doanh</th>
                <th className="py-3 px-3 font-bold min-w-[140px]">Người Đại Diện</th>
                <th className="py-3 px-3 font-bold w-28">MST / CCCD</th>
                <th className="py-3 px-4 font-bold min-w-[200px]">Địa Chỉ</th>
                <th className="py-3 px-3 font-bold min-w-[150px]">Ngành Hàng</th>
                <th className="py-3 px-2.5 font-bold w-20 text-center">Thống Kê</th>
                <th className="py-3 px-2 text-center w-16">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Không tìm thấy cơ sở kinh doanh nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                paginatedData.map((f, idx) => (
                  <tr
                    key={f.id}
                    onClick={() => setSelectedFacility(f)}
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3 text-center text-slate-400 font-mono">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>

                    <td className="py-3 px-2.5 text-center">
                      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                        {f.team}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-start gap-1.5">
                        <span className={`mt-0.5 shrink-0 ${f.facilityType === 'Tổ chức' ? 'text-amber-500' : 'text-blue-500'}`}>
                          {f.facilityType === 'Tổ chức' ? <Building2 className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {f.registeredName}
                          </p>
                          {f.signboardName && (
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              Hiệu: {f.signboardName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {f.representative || '---'}
                      </p>
                      {f.phone && (
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" /> {f.phone}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-3 font-mono">
                      {f.mst && <p className="font-bold text-slate-900 dark:text-white">{f.mst}</p>}
                      {f.cccd && <p className="text-[11px] text-slate-500">{f.cccd}</p>}
                      {!f.mst && !f.cccd && <span className="text-slate-300">---</span>}
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-slate-800 dark:text-slate-200 line-clamp-1">
                        {f.fullAddress || '---'}
                      </p>
                      {f.ward && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-400" /> {f.ward}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {f.industries.slice(0, 2).map((ind, iIdx) => (
                          <span
                            key={iIdx}
                            className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {ind}
                          </span>
                        ))}
                        {f.industries.length > 2 && (
                          <span className="text-[10px] px-1 py-0.5 rounded font-bold text-blue-600">
                            +{f.industries.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-2.5 text-center">
                      <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        f.surveyType.toLowerCase().includes('mới')
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {f.surveyType || 'TK'}
                        {f.surveyWeek ? ` (T${f.surveyWeek})` : ''}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedFacility(f);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Hiển thị mỗi trang:</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="25">25 cơ sở</option>
              <option value="50">50 cơ sở</option>
              <option value="100">100 cơ sở</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-semibold text-slate-700 dark:text-slate-300 px-2">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Facility Detail Modal */}
      <FacilityModal
        facility={selectedFacility}
        onClose={() => setSelectedFacility(null)}
      />
    </div>
  );
};
