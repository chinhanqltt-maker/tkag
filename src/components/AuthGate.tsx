import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, KeyRound, AlertCircle, Sparkles } from 'lucide-react';

const AUTH_STORAGE_KEY = 'QLTT_AG_AUTH_KEY_V1';
const CORRECT_PASSWORD = 'qlttag';

interface AuthGateProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export function isUserAuthenticated(): boolean {
  try {
    const local = localStorage.getItem(AUTH_STORAGE_KEY);
    const session = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return local === 'authenticated' || session === 'authenticated';
  } catch {
    return false;
  }
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isUserAuthenticated());
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = passwordInput.trim().toLowerCase();

    if (cleanInput === CORRECT_PASSWORD) {
      setErrorMsg('');
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, 'authenticated');
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'authenticated');
      }
      setIsAuthenticated(true);
    } else {
      setErrorMsg('Mật khẩu không đúng. Vui lòng thử lại!');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-between items-center px-4 py-8 text-white font-sans selection:bg-amber-500 selection:text-slate-900">
      {/* Decorative background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Top Header info */}
      <div className="text-center space-y-1.5 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <span>HỆ THỐNG NỘI BỘ QLTT AN GIANG</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className={`w-full max-w-md bg-white/10 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 transition-transform ${shake ? 'animate-shake ring-2 ring-red-500' : ''}`}>
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 shadow-lg shadow-amber-500/20 mx-auto">
            <Lock className="h-8 w-8 text-blue-950" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Yêu Cầu Xác Thực
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Chi Cục Quản Lý Thị Trường Tỉnh An Giang
            </p>
          </div>
          <p className="text-xs text-blue-200 bg-blue-900/40 border border-blue-700/40 rounded-lg p-2.5">
            Trang web chứa dữ liệu danh bạ cơ sở và số liệu thống kê nghiệp vụ nội bộ. Vui lòng nhập mật khẩu để truy cập.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-200">
              Mật khẩu truy cập
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={e => {
                  setPasswordInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Nhập mật khẩu..."
                autoFocus
                required
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-medium animate-fadeIn">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400 h-4 w-4"
              />
              <span>Ghi nhớ trên thiết bị này</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-blue-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Mở Khoá Truy Cập</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center space-y-1">
          <div className="text-[11px] text-slate-400">
            Người phát triển: <strong className="text-slate-200">Võ Chí Nhân</strong> (KSVTT Phòng TCHC)
          </div>
          <div className="text-[11px] text-slate-400">
            Hotline hỗ trợ / Zalo: <a href="tel:0914459992" className="text-amber-400 font-semibold hover:underline">0914.459.992</a>
          </div>
        </div>
      </div>

      {/* Bottom Footer note */}
      <div className="text-center text-xs text-slate-400 space-y-0.5 pb-2">
        <p>© {new Date().getFullYear()} Chi Cục Quản Lý Thị Trường Tỉnh An Giang</p>
      </div>
    </div>
  );
};
