import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X, Check, Search } from 'lucide-react';
import { removeVietnameseAccents } from '../services/dataAggregator';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  label: string;
  options: (string | Option)[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  allLabel?: string;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Gõ để tìm nhanh...',
  allLabel = 'Tất cả',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalize options to { value, label }
  const normalizedOptions: Option[] = useMemo(() => {
    const list: Option[] = [{ value: 'ALL', label: allLabel }];
    options.forEach(opt => {
      if (typeof opt === 'string') {
        list.push({ value: opt, label: opt });
      } else {
        list.push(opt);
      }
    });
    return list;
  }, [options, allLabel]);

  // Current selected label
  const selectedOption = useMemo(() => {
    return normalizedOptions.find(o => o.value === value) || normalizedOptions[0];
  }, [normalizedOptions, value]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return normalizedOptions;
    const termClean = removeVietnameseAccents(searchTerm.trim().toLowerCase());
    const termRaw = searchTerm.trim().toLowerCase();

    return normalizedOptions.filter(opt => {
      if (opt.value === 'ALL') return true;
      const labelRaw = opt.label.toLowerCase();
      const labelClean = removeVietnameseAccents(opt.label.toLowerCase());
      return labelRaw.includes(termRaw) || labelClean.includes(termClean);
    });
  }, [normalizedOptions, searchTerm]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('ALL');
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
        <span>{label}</span>
        {value !== 'ALL' && (
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded">
            Đã chọn
          </span>
        )}
      </label>

      {/* Trigger Box / Input */}
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border cursor-pointer transition-all ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-800'
            : value !== 'ALL'
            ? 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 font-medium'
            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:border-slate-300'
        }`}
      >
        <span className="truncate flex-1 text-left">
          {selectedOption.label}
        </span>

        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          {value !== 'ALL' && (
            <button
              type="button"
              onClick={handleClear}
              className="hover:text-red-500 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Bỏ chọn"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
        </div>
      </div>

      {/* Floating Dropdown Popover */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-fadeIn min-w-[200px]">
          {/* Search input inside dropdown */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-blue-500" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1 divide-y divide-slate-100 dark:divide-slate-800/40 scrollbar-none">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                Không tìm thấy kết quả phù hợp
              </div>
            ) : (
              filteredOptions.map(opt => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-300'
                    }`}
                  >
                    <span className="truncate flex-1">{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 ml-1 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Match counter footer */}
          <div className="px-2.5 py-1 text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span>{filteredOptions.length} lựa chọn</span>
            {searchTerm && <span className="text-blue-500">Đang lọc</span>}
          </div>
        </div>
      )}
    </div>
  );
};
