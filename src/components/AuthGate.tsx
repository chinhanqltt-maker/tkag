import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, KeyRound, AlertCircle } from 'lucide-react';

const AUTH_STORAGE_KEY = 'QLTT_AG_AUTH_SESSION_V2';
const CORRECT_PASSWORD = 'qlttag';

export function isUserAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'authenticated' || localStorage.getItem(AUTH_STORAGE_KEY) === 'authenticated';
  } catch {
    return false;
  }
}

export function logoutUser(): void {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
}

interface AuthGateProps {
  onAuthenticated: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onAuthenticated }) => {
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
      onAuthenticated();
    } else {
      setErrorMsg('Mật khẩu không đúng! Vui lòng kiểm tra lại.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-center items-center px-4 py-8 text-white font-sans selection:bg-amber-500 selection:text-slate-900">
      {/* Background radial glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Login Card */}
      <div className={`w-full max-w-md bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 transition-transform ${shake ? 'animate-shake ring-2 ring-red-500' : ''}`}>
        
        {/* Shield Icon & Badge */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 shadow-lg shadow-amber-500/20 mx-auto">
            <Lock className="h-8 w-8 text-blue-950" />
          </div>
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-900/60 border border-blue-600/40 text-blue-200 text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <span>Chi Cục QLTT Tỉnh An Giang</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Nhập mật khẩu để truy cập
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Phần mềm Tra cứu Cơ sở Kinh doanh & Báo cáo Thống kê
            </p>
          </div>

          <div className="text-xs text-amber-200 bg-amber-500/10 border border-amber-400/20 rounded-xl p-3 text-left space-y-1">
            <p className="font-semibold flex items-center gap-1.5 text-amber-300">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span>Khu vực giới hạn nội bộ</span>
            </p>
            <p className="text-[11px] text-slate-300">
              Vui lòng nhập mật khẩu xác thực để mở khóa và xem toàn bộ nội dung hệ thống.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
              Mật khẩu xác thực
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={e => {
                  setPasswordInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Nhập mật khẩu truy cập..."
                autoFocus
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-medium animate-fadeIn">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-400 h-4 w-4"
              />
              <span>Ghi nhớ trên thiết bị này</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-blue-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <span>Mở Khóa & Xem Nội Dung</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Footer Credit in Modal */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center space-y-1">
          <div className="text-[11px] text-slate-400">
            Người viết / Bản quyền: <strong className="text-slate-200">Võ Chí Nhân</strong>
          </div>
          <div className="text-[11px] text-slate-400">
            KSVTT phòng TCHC - Hotline/Zalo: <a href="tel:0914459992" className="text-amber-400 font-semibold hover:underline">0914.459.992</a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="text-center text-xs text-slate-500 mt-6">
        © {new Date().getFullYear()} Chi Cục Quản Lý Thị Trường Tỉnh An Giang
      </div>
    </div>
  );
};
