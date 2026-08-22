import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, RefreshCw, AlertCircle, CheckCircle2, QrCode } from 'lucide-react';

export interface ParsedCccdData {
  raw: string;
  cccd: string;
  cmndOld?: string;
  fullName: string;
  dob?: string;
  gender?: string;
  address?: string;
  dateIssued?: string;
}

interface CccdQrScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: ParsedCccdData) => void;
}

export function parseVietnameseCccdQr(qrText: string): ParsedCccdData {
  const parts = qrText.split('|');
  if (parts.length >= 3) {
    // Format: CCCD|CMND_OLD|FULL_NAME|DOB|GENDER|ADDRESS|DATE_ISSUED
    return {
      raw: qrText,
      cccd: parts[0]?.trim() || '',
      cmndOld: parts[1]?.trim() || '',
      fullName: parts[2]?.trim() || '',
      dob: parts[3]?.trim() || '',
      gender: parts[4]?.trim() || '',
      address: parts[5]?.trim() || '',
      dateIssued: parts[6]?.trim() || ''
    };
  }

  // Fallback if not standard delimited format
  const digitsMatch = qrText.match(/\b\d{9,12}\b/);
  return {
    raw: qrText,
    cccd: digitsMatch ? digitsMatch[0] : qrText.trim(),
    fullName: ''
  };
}

export const CccdQrScanner: React.FC<CccdQrScannerProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  const [isStarting, setIsStarting] = useState(true);
  const [error, setError] = useState<string>('');
  const [scannedResult, setScannedResult] = useState<ParsedCccdData | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = 'cccd-reader-view';

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsStarting(true);
    setError('');
    setScannedResult(null);

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(readerElementId);
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            if (!isMounted) return;
            const parsed = parseVietnameseCccdQr(decodedText);
            setScannedResult(parsed);
            scanner.stop().then(() => {
              onScanSuccess(parsed);
              onClose();
            }).catch(console.error);
          },
          () => {
            // Ignore frame scan errors
          }
        );

        if (isMounted) setIsStarting(false);
      } catch (err: any) {
        if (isMounted) {
          setIsStarting(false);
          setError(err.message || 'Không thể truy cập camera. Vui lòng cấp quyền sử dụng camera trong trình duyệt.');
        }
      }
    };

    // Small timeout for DOM element to render
    const timer = setTimeout(() => {
      startScanner();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Quét Mã QR Thẻ CCCD Gắn Chip
              </h3>
              <p className="text-[11px] text-slate-500">
                Hướng camera vào mã QR góc trên thẻ Căn cước
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scanner Viewport */}
        <div className="p-4 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[280px] bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
            <div id={readerElementId} className="w-full h-full" />

            {isStarting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white gap-2">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
                <p className="text-xs font-medium">Đang khởi động camera...</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 w-full p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-[11px] text-slate-500 text-center mt-3">
            Hệ thống sẽ tự động trích xuất <strong>Số CCCD</strong> và <strong>Họ tên</strong> để tra cứu ngay các địa chỉ kinh doanh liên quan.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};