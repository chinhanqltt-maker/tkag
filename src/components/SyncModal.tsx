import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle2, AlertCircle, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { syncFromGoogleSheets } from '../services/dataLoader';
import { AppDataStore } from '../services/dataLoader';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess: (store: AppDataStore) => void;
  lastUpdated: string;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  onSyncSuccess,
  lastUpdated
}) => {
  const [sheetId, setSheetId] = useState('1p9hd2pd_X85W76bLyj6iNifzTTQ7OXCV8bHAwCKbSEs');
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSync = async () => {
    setIsSyncing(true);
    setErrorMessage('');
    setIsSuccess(false);
    setStatusMessage('Đang kết nối đến Google Sheets...');

    try {
      const store = await syncFromGoogleSheets(sheetId, msg => setStatusMessage(msg));
      setIsSuccess(true);
      setStatusMessage(`Đồng bộ thành công ${store.facilities.length} cơ sở từ Google Sheets!`);
      setTimeout(() => {
        onSyncSuccess(store);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Đồng bộ thất bại. Vui lòng kiểm tra quyền chia sẻ bảng tính hoặc kết nối mạng.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <RefreshCw className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Đồng Bộ Dữ Liệu Google Sheets
              </h2>
              <p className="text-xs text-slate-500">
                Cập nhật báo cáo trực tiếp từ bảng tính trực tuyến
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Google Spreadsheet ID / Liên kết
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sheetId}
                onChange={e => setSheetId(e.target.value)}
                placeholder="Nhập ID hoặc liên kết Google Sheets"
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Bảng tính hiện tại: <span className="font-semibold text-slate-700 dark:text-slate-300">Thống kê mới AG 2025</span>
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Lần cập nhật gần nhất:</span>
              <span className="font-medium font-mono">{lastUpdated || 'Đã tải sẵn'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Sheet chính:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">OK, Công Thức ( BC), Số liệu thống kê, D2-D12</span>
            </div>
            <a
              href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline pt-1"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Mở bảng tính Google Sheets gốc
            </a>
          </div>

          {/* Status feedback */}
          {statusMessage && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              isSuccess
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
            }`}>
              {isSuccess ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-6 py-3 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSyncing}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Đang đồng bộ...' : 'Bắt đầu đồng bộ'}
          </button>
        </div>
      </div>
    </div>
  );
};
