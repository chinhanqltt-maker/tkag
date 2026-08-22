import React from 'react';
import { Facility } from '../types';
import { X, Building2, User, Phone, MapPin, FileText, CheckCircle2, ShieldCheck, Tag, Calendar, UserCheck } from 'lucide-react';

interface FacilityModalProps {
  facility: Facility | null;
  onClose: () => void;
}

export const FacilityModal: React.FC<FacilityModalProps> = ({ facility, onClose }) => {
  if (!facility) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${facility.facilityType === 'Tổ chức' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'}`}>
              {facility.facilityType === 'Tổ chức' ? <Building2 className="h-6 w-6" /> : <User className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white">
                  {facility.team}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {facility.facilityType}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {facility.status || 'Đang hoạt động'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {facility.registeredName}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Signboard & Representative Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tên bảng hiệu</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {facility.signboardName || '(Chưa có thông tin bảng hiệu)'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Người đại diện / Chức vụ</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {facility.representative || 'Chưa cập nhật'} {facility.position ? `(${facility.position})` : ''}
              </p>
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Identity & Contact */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <User className="h-4 w-4 text-blue-500" /> Định Danh & Liên Hệ
              </h3>
              <div>
                <p className="text-xs text-slate-500">Mã số thuế (MST)</p>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                  {facility.mst || '---'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Số CCCD / CMND</p>
                <p className="text-sm font-mono font-medium text-slate-900 dark:text-white">
                  {facility.cccd || '---'}
                </p>
                {facility.cccdDate && (
                  <p className="text-xs text-slate-400">Cấp ngày: {facility.cccdDate} tại {facility.cccdPlace || ''}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500">Số điện thoại</p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> {facility.phone || '---'}
                </p>
              </div>
            </div>

            {/* Address & Jurisdiction */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-500" /> Địa Chỉ & Địa Bàn
              </h3>
              <div>
                <p className="text-xs text-slate-500">Địa chỉ đầy đủ</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {facility.fullAddress || '---'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-slate-500">Số / Tổ</p>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{facility.streetNo || '---'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Ấp / Đường</p>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{facility.hamlet || '---'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phường / Xã</p>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{facility.ward || '---'}</p>
              </div>
            </div>

            {/* Survey & Officers */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-amber-500" /> Thống Kê & Cán Bộ
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-slate-500">Tuần thống kê</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {facility.surveyWeek ? `Tuần ${facility.surveyWeek}` : '---'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phân loại</p>
                  <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                    facility.surveyType.toLowerCase().includes('mới')
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                  }`}>
                    {facility.surveyType || 'Thống kê'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500">Công chức quản lý địa bàn</p>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 whitespace-pre-line">
                  {facility.officerArea || '---'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Công chức nhập liệu</p>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 whitespace-pre-line">
                  {facility.officerInput || '---'}
                </p>
              </div>
            </div>
          </div>

          {/* Licenses Section */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-purple-500" /> Giấy Chứng Nhận & Giấy Phép Kinh Doanh
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                <p className="font-bold text-slate-700 dark:text-slate-300">GCN ĐKKD / Doanh Nghiệp</p>
                <p className="text-slate-500">Số: <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{facility.bLicenseNo || '---'}</span></p>
                <p className="text-slate-500">Ngày cấp: {facility.bLicenseDate || '---'}</p>
                <p className="text-slate-500">Nơi cấp: {facility.bLicensePlace || '---'}</p>
              </div>

              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                <p className="font-bold text-slate-700 dark:text-slate-300">GCN Đủ Điều Kiện Kinh Doanh</p>
                <p className="text-slate-500">Số: <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{facility.condCertNo || '---'}</span></p>
                <p className="text-slate-500">Ngày cấp: {facility.condCertDate || '---'}</p>
                <p className="text-slate-500">Hết hạn: {facility.condCertExp || '---'}</p>
              </div>

              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                <p className="font-bold text-slate-700 dark:text-slate-300">Giấy Phép Hành Nghề / Khác</p>
                <p className="text-slate-500">Tên GP: {facility.otherLicenseName || facility.pracLicenseNo ? 'Giấy phép hành nghề' : '---'}</p>
                <p className="text-slate-500">Số: <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{facility.pracLicenseNo || facility.otherLicenseNo || '---'}</span></p>
                <p className="text-slate-500">Hết hạn: {facility.pracLicenseExp || facility.otherLicenseExp || '---'}</p>
              </div>
            </div>
          </div>

          {/* Industries Tag Section */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-indigo-500" /> Ngành Hàng Đăng Ký / Kinh Doanh Thực Tế ({facility.industries.length})
            </h3>
            {facility.businessLines && (
              <p className="text-xs text-slate-600 dark:text-slate-400 italic mb-2">
                Mô tả: {facility.businessLines}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {facility.industries.length > 0 ? (
                facility.industries.map((ind, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  >
                    {ind}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Không có ngành hàng cụ thể được đánh dấu cờ</span>
              )}
            </div>
          </div>

          {/* Note Section */}
          {facility.note && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
              <span className="font-bold">Ghi chú:</span> {facility.note}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
