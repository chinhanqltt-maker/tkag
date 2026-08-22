import React, { useEffect, useState } from 'react';
import { Smartphone, Download, X, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setShowBanner(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert('Để cài đặt ứng dụng:\n- Trên Android: Bấm menu 3 chấm trên trình duyệt > chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".\n- Trên iPhone/iPad: Bấm nút Chia sẻ (Share icon) > chọn "Thêm vào MH chính" (Add to Home Screen).');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) return null;

  return (
    <>
      {showBanner && (
        <div className="no-print bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 text-xs shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 shrink-0 animate-bounce" />
              <span>
                <strong>Cài đặt App Tra Cứu QLTT An Giang</strong> lên màn hình điện thoại để tra cứu Offline siêu tốc!
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="px-3 py-1 bg-white text-amber-900 rounded-md font-bold hover:bg-amber-100 transition-colors shadow-xs"
              >
                Cài đặt ngay
              </button>
              <button
                onClick={() => setShowBanner(false)}
                className="p-1 hover:bg-amber-800 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};