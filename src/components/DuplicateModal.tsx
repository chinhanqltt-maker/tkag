import React, { useState } from 'react';
import { DuplicateGroup, Facility } from '../types';
import { X, AlertTriangle, Building2, User, ChevronRight } from 'lucide-react';

interface DuplicateModalProps {
  duplicates: DuplicateGroup[];
  onClose: () => void;
  onSelectFacility: (facility: Facility) => void;
}

export const DuplicateModal: React.FC<DuplicateModalProps> = ({
  duplicates,
  onClose,
  onSelectFacility
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredDuplicates = filterType === 'ALL'
    ? duplicates
    : duplicates.filter(d => d.type === filterType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-amber-50 dark:bg-amber-950/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Rà Soát & Cảnh Báo Trùng Lặp ({duplicates.length} nhóm trùng)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Phát hiện các cơ sở có cùng Mã số thuế, Số CCCD/CMND hoặc Số điện thoại giữa các Đội QLTT
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

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Lọc theo loại:</span>
          {['ALL', 'MST', 'CCCD', 'PHONE'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                filterType === t
                  ? 'bg-amber-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {t === 'ALL' ? `Tất cả (${duplicates.length})` : `${t} (${duplicates.filter(d => d.type === t).length})`}
            </button>
          ))}
        </div>

        {/* Body list */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh]">
          {filteredDuplicates.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              Không có nhóm trùng lặp nào phù hợp với bộ lọc.
            </div>
          ) : (
            filteredDuplicates.map((group, gIdx) => (
              <div
                key={gIdx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                      Trùng {group.type}: {group.key}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({group.facilities.length} cơ sở liên quan)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.facilities.map((fac, fIdx) => (
                    <div
                      key={fIdx}
                      onClick={() => onSelectFacility(fac)}
                      className="group p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                              {fac.team}
                            </span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {fac.facilityType}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                            {fac.registeredName}
                          </p>
                          <p className="text-xs text-slate-500">
                            Đại diện: <span className="text-slate-700 dark:text-slate-300 font-medium">{fac.representative || '---'}</span>
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            Địa chỉ: {fac.fullAddress || '---'}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

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
