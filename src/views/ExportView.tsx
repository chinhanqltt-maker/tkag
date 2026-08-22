import React, { useState } from 'react';
import { Facility, IndustryRow, WeeklyRow } from '../types';
import { TEAM_LIST } from '../services/dataAggregator';
import {
  exportIndustryMatrixToExcel,
  exportWeeklyProgressToExcel,
  exportFacilitiesToExcel
} from '../services/excelExporter';
import {
  Printer,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  FileText,
  Building2,
  Calendar
} from 'lucide-react';

interface ExportViewProps {
  facilities: Facility[];
  industrySummary: IndustryRow[];
  weeklySummary: WeeklyRow[];
}

export const ExportView: React.FC<ExportViewProps> = ({
  facilities,
  industrySummary,
  weeklySummary
}) => {
  const [printType, setPrintType] = useState<'INDUSTRY' | 'WEEKLY' | 'FACILITY_SUMMARY'>('INDUSTRY');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner (No Print) */}
      <div className="no-print border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
              Xuất Dữ Liệu & In Ấn
            </span>
            <span className="text-xs text-slate-500">Chuẩn quy định báo cáo Chi cục QLTT An Giang</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Trung Tâm Xuất Báo Cáo & In Ấn Hành Chính
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>In Báo Cáo A4 (PDF / Máy in)</span>
          </button>
        </div>
      </div>

      {/* Excel Download Cards (No Print) */}
      <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Industry Report */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <FileSpreadsheet className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider">Sheet Công Thức BC</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Báo Cáo Tổng Hợp Theo Ngành Nghề
            </h3>
            <p className="text-xs text-slate-500">
              Ma trận 34+ ngành hàng kinh doanh x 11 Đội QLTT và Tổng cộng toàn tỉnh.
            </p>
          </div>
          <button
            onClick={() => exportIndustryMatrixToExcel(industrySummary)}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-100 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Tải Excel Báo Cáo Ngành</span>
          </button>
        </div>

        {/* Card 2: Weekly Progress */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Calendar className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider">Sheet Số Liệu TK</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Báo Cáo Tiến Độ Thống Kê Theo Tuần
            </h3>
            <p className="text-xs text-slate-500">
              Phân tách 3 bảng: Tổng số, Thống kê Mới, Thống kê Lại theo từng tuần và Đội.
            </p>
          </div>
          <button
            onClick={() => exportWeeklyProgressToExcel(weeklySummary)}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Tải Excel Báo Cáo Tuần</span>
          </button>
        </div>

        {/* Card 3: Master Facilities */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Building2 className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider">Sheet OK & D2..D12</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Toàn Bộ Danh Sách 11.422+ Cơ Sở
            </h3>
            <p className="text-xs text-slate-500">
              Xuất toàn bộ cơ sở kinh doanh với đầy đủ MST, CCCD, Địa chỉ, Giấy phép và Cán bộ phụ trách.
            </p>
          </div>
          <button
            onClick={() => exportFacilitiesToExcel(facilities)}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 hover:bg-purple-100 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Tải Excel Danh Bạ Toàn Tỉnh</span>
          </button>
        </div>
      </div>

      {/* Select Print Format (No Print) */}
      <div className="no-print flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Chọn mẫu in xem trước:</span>
        <button
          onClick={() => setPrintType('INDUSTRY')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            printType === 'INDUSTRY' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}
        >
          Biểu Mẫu Ngành Nghề (Công Thức BC)
        </button>
        <button
          onClick={() => setPrintType('WEEKLY')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            printType === 'WEEKLY' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}
        >
          Biểu Mẫu Tiến Độ Tuần (Số Liệu TK)
        </button>
      </div>

      {/* Official Administrative Printable Document Section */}
      <div className="bg-white text-black p-8 rounded-2xl shadow-md border border-slate-200 mx-auto max-w-5xl print:border-none print:shadow-none print:p-0">
        {/* Official Header */}
        <div className="grid grid-cols-2 text-center text-xs mb-6 print-header">
          <div>
            <p className="font-bold uppercase tracking-wider">CHI CỤC QUẢN LÝ THỊ TRƯỜNG TỈNH AN GIANG</p>
            <p className="font-bold">PHÒNG NGHIỆP VỤ - TỔNG HỢP</p>
            <div className="w-24 h-0.5 bg-black mx-auto mt-1" />
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="font-bold">Độc lập - Tự do - Hạnh phúc</p>
            <div className="w-32 h-0.5 bg-black mx-auto mt-1" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-6 space-y-1">
          <h1 className="text-lg font-bold uppercase tracking-wide">
            {printType === 'INDUSTRY'
              ? 'DANH SÁCH TỔNG HỢP CƠ SỞ KINH DOANH THEO NGÀNH NGHỀ'
              : 'BÁO CÁO TIẾN ĐỘ THỐNG KÊ CƠ SỞ KINH DOANH HẰNG TUẦN'}
          </h1>
          <p className="text-xs italic">
            (Trên địa bàn tỉnh An Giang - Phân bổ theo các Đội Quản lý thị trường)
          </p>
        </div>

        {/* Print Content: Industry Report */}
        {printType === 'INDUSTRY' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-black border-collapse">
              <thead>
                <tr className="bg-slate-100 font-bold text-center border-b border-black">
                  <th className="border border-black p-1.5 w-10">STT</th>
                  <th className="border border-black p-1.5 text-left">Ngành nghề</th>
                  {TEAM_LIST.map(t => (
                    <th key={t} className="border border-black p-1.5 w-12">{t.replace('Đội ', 'Đ')}</th>
                  ))}
                  <th className="border border-black p-1.5 w-16">Tổng</th>
                </tr>
              </thead>
              <tbody>
                {industrySummary.map((row, idx) => (
                  <tr key={idx} className={row.isCategoryHeader ? 'font-bold bg-slate-50' : ''}>
                    <td className="border border-black p-1 text-center font-mono">{row.code || (row.isCategoryHeader ? '' : idx + 1)}</td>
                    <td className="border border-black p-1">{row.name}</td>
                    {TEAM_LIST.map(t => (
                      <td key={t} className="border border-black p-1 text-center font-mono">
                        {row.teams[t] || '-'}
                      </td>
                    ))}
                    <td className="border border-black p-1 text-right font-bold font-mono">
                      {row.total.toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Print Content: Weekly Report */}
        {printType === 'WEEKLY' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-black border-collapse">
              <thead>
                <tr className="bg-slate-100 font-bold text-center border-b border-black">
                  <th className="border border-black p-1.5 w-20">Tuần</th>
                  {TEAM_LIST.map(t => (
                    <th key={t} className="border border-black p-1.5">{t}</th>
                  ))}
                  <th className="border border-black p-1.5 w-20">Tổng Toàn Tỉnh</th>
                </tr>
              </thead>
              <tbody>
                {weeklySummary.map((w, idx) => (
                  <tr key={idx}>
                    <td className="border border-black p-1.5 font-bold">{w.weekLabel}</td>
                    {TEAM_LIST.map(t => (
                      <td key={t} className="border border-black p-1.5 text-center font-mono">
                        {w.total.byTeam[t] || '-'}
                      </td>
                    ))}
                    <td className="border border-black p-1.5 text-right font-bold font-mono">
                      {w.total.all.toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signatures Section */}
        <div className="grid grid-cols-3 text-center text-xs mt-12 pt-6 print-break-inside-avoid">
          <div className="space-y-16">
            <p className="font-bold uppercase">NGƯỜI LẬP BIỂU</p>
            <div>
              <p className="font-bold text-sm">Võ Chí Nhân</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">KSVTT phòng TCHC (0914.459.992)</p>
            </div>
          </div>
          <div className="space-y-16">
            <p className="font-bold uppercase">TRƯỞNG PHÒNG NV-TH</p>
            <p className="font-bold">(Ký, ghi rõ họ tên)</p>
          </div>
          <div className="space-y-16">
            <p className="font-bold uppercase">CHI CỤC TRƯỞNG</p>
            <p className="font-bold">(Ký, đóng dấu)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
