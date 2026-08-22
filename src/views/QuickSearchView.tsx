import React, { useState, useMemo, useEffect } from 'react';
import { Facility } from '../types';
import { TEAM_LIST } from '../services/dataAggregator';
import { CccdQrScanner, ParsedCccdData } from '../components/CccdQrScanner';
import { FacilityModal } from '../components/FacilityModal';
import {
  Search,
  Camera,
  User,
  CreditCard,
  Building2,
  MapPin,
  Phone,
  Copy,
  Check,
  Navigation,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  History,
  X
} from 'lucide-react';

interface QuickSearchViewProps {
  facilities: Facility[];
}

type SearchMode = 'SMART' | 'CCCD' | 'NAME' | 'FACILITY' | 'ADDRESS';

const RECENT_SEARCHES_KEY = 'TKAG_RECENT_SEARCHES_V1';

export const QuickSearchView: React.FC<QuickSearchViewProps> = ({ facilities }) => {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('SMART');
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : ['089096022308', 'Nguyễn Hữu Thành', 'Xăng dầu', 'Phân bón'];
    } catch {
      return [];
    }
  });

  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2) return;
    setRecentSearches(prev => {
      const next = [trimmed, ...prev.filter(item => item !== trimmed)].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleQrScanSuccess = (data: ParsedCccdData) => {
    if (data.cccd) {
      setQuery(data.cccd);
      setSearchMode('CCCD');
      saveRecentSearch(data.cccd);
    } else if (data.fullName) {
      setQuery(data.fullName);
      setSearchMode('NAME');
      saveRecentSearch(data.fullName);
    }
  };

  const handleCopySummary = (f: Facility) => {
    const text = `🏛️ CHI CỤC QLTT AN GIANG - THÔNG TIN CƠ SỞ:\n` +
      `• Tên cơ sở: ${f.registeredName}\n` +
      `• Bảng hiệu: ${f.signboardName || '---'}\n` +
      `• Đại diện: ${f.representative || '---'} (${f.position || 'Chủ HKD'})\n` +
      `• CCCD/CMND: ${f.cccd || '---'}\n` +
      `• MST: ${f.mst || '---'}\n` +
      `• SĐT: ${f.phone || '---'}\n` +
      `• Địa chỉ: ${f.fullAddress || '---'}\n` +
      `• Đội quản lý: ${f.team}\n` +
      `• Cán bộ phụ trách: ${f.officerArea || '---'}\n` +
      `• Ngành hàng: ${f.industries.join(', ') || '---'}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(f.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Fast filtering
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return facilities.filter(f => {
      if (selectedTeam !== 'ALL' && f.team !== selectedTeam) return false;

      if (searchMode === 'CCCD') {
        const cleanQ = q.replace(/\D/g, '');
        const cleanCccd = (f.cccd || '').replace(/\D/g, '');
        return cleanCccd.includes(cleanQ) || (f.mst && f.mst.includes(cleanQ));
      }

      if (searchMode === 'NAME') {
        return f.representative && f.representative.toLowerCase().includes(q);
      }

      if (searchMode === 'FACILITY') {
        return (
          (f.registeredName && f.registeredName.toLowerCase().includes(q)) ||
          (f.signboardName && f.signboardName.toLowerCase().includes(q))
        );
      }

      if (searchMode === 'ADDRESS') {
        return (
          (f.fullAddress && f.fullAddress.toLowerCase().includes(q)) ||
          (f.ward && f.ward.toLowerCase().includes(q)) ||
          (f.hamlet && f.hamlet.toLowerCase().includes(q))
        );
      }

      // SMART ALL-IN-ONE
      return (
        (f.cccd && f.cccd.toLowerCase().includes(q)) ||
        (f.representative && f.representative.toLowerCase().includes(q)) ||
        (f.registeredName && f.registeredName.toLowerCase().includes(q)) ||
        (f.signboardName && f.signboardName.toLowerCase().includes(q)) ||
        (f.mst && f.mst.toLowerCase().includes(q)) ||
        (f.phone && f.phone.includes(q)) ||
        (f.fullAddress && f.fullAddress.toLowerCase().includes(q)) ||
        (f.bLicenseNo && f.bLicenseNo.toLowerCase().includes(q)) ||
        (f.ward && f.ward.toLowerCase().includes(q))
      );
    });
  }, [facilities, query, searchMode, selectedTeam]);

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-16">
      {/* Top Mobile Title */}
      <div className="text-center sm:text-left space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-extrabold">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>Tra Cứu Nhanh Hiện Trường</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Tìm Cơ Sở Theo CCCD, Họ Tên, Bảng Hiệu, Địa Chỉ
        </h2>
        <p className="text-xs text-slate-500">
          Tra cứu tức thì trong 11.422+ cơ sở của tỉnh An Giang • Hoạt động 100% Offline
        </p>
      </div>

      {/* Main Search Box & Camera Scan Button */}
      <div className="relative rounded-2xl bg-white dark:bg-slate-900 p-3 sm:p-4 shadow-md border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-blue-600" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveRecentSearch(query); }}
              placeholder={
                searchMode === 'CCCD'
                  ? 'Nhập số CCCD hoặc CMND (VD: 089096...)'
                  : searchMode === 'NAME'
                  ? 'Nhập họ và tên chủ cơ sở (VD: Nguyễn Văn A...)'
                  : searchMode === 'FACILITY'
                  ? 'Nhập tên cửa hàng, hộ kinh doanh, doanh nghiệp...'
                  : searchMode === 'ADDRESS'
                  ? 'Nhập tên đường, ấp, phường, xã...'
                  : 'Gõ số CCCD, Họ tên, Tên tiệm, MST, SĐT, Địa chỉ...'
              }
              className="w-full pl-11 pr-10 py-3 text-sm sm:text-base font-medium rounded-xl border-2 border-blue-500/30 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none transition-all shadow-inner"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-3.5 p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Camera CCCD Scan Button */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-1.5 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0"
            title="Quét mã QR trên thẻ CCCD bằng camera"
          >
            <Camera className="h-5 w-5" />
            <span className="hidden sm:inline">Quét CCCD</span>
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'SMART', label: 'Tất cả', icon: Sparkles },
            { id: 'CCCD', label: 'Số CCCD/CMND', icon: CreditCard },
            { id: 'NAME', label: 'Họ & Tên Chủ Hộ', icon: User },
            { id: 'FACILITY', label: 'Tên Cơ Sở/Bảng Hiệu', icon: Building2 },
            { id: 'ADDRESS', label: 'Địa Chỉ/Xã Phường', icon: MapPin }
          ].map(m => {
            const Icon = m.icon;
            const isSelected = searchMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setSearchMode(m.id as SearchMode);
                  if (query) saveRecentSearch(query);
                }}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Team Filter row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">Đội:</span>
            <button
              onClick={() => setSelectedTeam('ALL')}
              className={`px-2 py-1 rounded text-[11px] font-bold ${
                selectedTeam === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Tất cả
            </button>
            {TEAM_LIST.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTeam(t)}
                className={`px-2 py-1 rounded text-[11px] font-bold whitespace-nowrap ${
                  selectedTeam === t ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t.replace('Đội ', 'Đ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Searches Chips */}
      {!query && recentSearches.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-slate-400" /> Tra cứu gần đây:
            </span>
            <button
              onClick={() => {
                setRecentSearches([]);
                localStorage.removeItem(RECENT_SEARCHES_KEY);
              }}
              className="text-[11px] hover:text-rose-500"
            >
              Xóa lịch sử
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recentSearches.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(item)}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/40 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      {query && (
        <div className="flex items-center justify-between px-1 text-xs text-slate-500">
          <span>
            Kết quả: <strong className="text-blue-600 dark:text-blue-400 font-extrabold text-sm">{results.length}</strong> cơ sở phù hợp
          </span>
          <span>Địa bàn: {selectedTeam === 'ALL' ? 'Toàn tỉnh An Giang' : selectedTeam}</span>
        </div>
      )}

      {/* Result Cards List */}
      {query && results.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Không tìm thấy cơ sở kinh doanh nào
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Không có kết quả khớp với từ khóa "<strong>{query}</strong>" trong chế độ tìm kiếm hiện tại. Hãy thử chuyển sang chế độ "Tất cả" hoặc kiểm tra lại chính tả.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {results.map((f) => (
          <div
            key={f.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all space-y-3.5"
          >
            {/* Top Bar: Team, Type, Status */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-xs">
                  {f.team}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {f.facilityType}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {f.status || 'Đang hoạt động'}
                </span>
              </div>

              {/* Action: Copy info */}
              <button
                onClick={() => handleCopySummary(f)}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  copiedId === f.id
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Sao chép tóm tắt gửi Zalo"
              >
                {copiedId === f.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                <span className="hidden sm:inline">{copiedId === f.id ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>

            {/* Business Name & Signboard */}
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                {f.registeredName}
              </h3>
              {f.signboardName && (
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                  Bảng hiệu: {f.signboardName}
                </p>
              )}
            </div>

            {/* Representative & Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <div>
                <span className="text-slate-500">Người đại diện: </span>
                <strong className="text-slate-900 dark:text-white font-bold">{f.representative || '---'}</strong>
                {f.position && <span className="text-slate-500"> ({f.position})</span>}
              </div>

              <div>
                <span className="text-slate-500">Số CCCD/CMND: </span>
                <strong className="font-mono text-slate-900 dark:text-white">{f.cccd || '---'}</strong>
              </div>

              <div>
                <span className="text-slate-500">Mã số thuế: </span>
                <strong className="font-mono text-slate-900 dark:text-white">{f.mst || '---'}</strong>
              </div>

              <div>
                <span className="text-slate-500">Điện thoại: </span>
                <strong className="text-blue-600 dark:text-blue-400">{f.phone || '---'}</strong>
              </div>
            </div>

            {/* Address */}
            <div className="text-xs flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
              <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Địa chỉ:</strong> {f.fullAddress || '---'}
              </span>
            </div>

            {/* Industries */}
            {f.industries.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center text-xs">
                <span className="text-slate-400 text-[11px]">Ngành hàng:</span>
                {f.industries.map((ind, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            )}

            {/* Officer in charge */}
            {f.officerArea && (
              <div className="text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-between">
                <span>Cán bộ quản lý địa bàn: <strong className="text-slate-700 dark:text-slate-300">{f.officerArea}</strong></span>
                {f.surveyWeek && <span>Thống kê: Tuần {f.surveyWeek} ({f.surveyType})</span>}
              </div>
            )}

            {/* Field Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Call Phone */}
              {f.phone ? (
                <a
                  href={`tel:${f.phone}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Gọi Điện</span>
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-medium text-xs opacity-50 cursor-not-allowed"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Chưa có SĐT</span>
                </button>
              )}

              {/* Google Maps Directions */}
              {f.fullAddress ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.fullAddress + ', An Giang')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 transition-colors"
                >
                  <Navigation className="h-3.5 w-3.5 text-blue-600" />
                  <span>Chỉ Đường</span>
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-medium text-xs opacity-50 cursor-not-allowed"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Chưa có Đ/c</span>
                </button>
              )}

              {/* View Full Modal */}
              <button
                onClick={() => setSelectedFacility(f)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Xem Hồ Sơ</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Scanner Modal */}
      <CccdQrScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQrScanSuccess}
      />

      {/* Full Detail Modal */}
      <FacilityModal
        facility={selectedFacility}
        onClose={() => setSelectedFacility(null)}
      />
    </div>
  );
};