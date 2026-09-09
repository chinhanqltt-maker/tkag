import * as XLSX from 'xlsx';
import { Facility, IndustryRow, WeeklyRow } from '../types';
import industrySummaryData from '../data/industrySummary.json';
import weeklySummaryData from '../data/weeklySummary.json';
import facilitiesAllData from '../data/facilitiesAll.json';

const SPREADSHEET_ID = '1p9hd2pd_X85W76bLyj6iNifzTTQ7OXCV8bHAwCKbSEs';
const STORAGE_KEY = 'TKAG_QLTT_DATA_V1';

export interface AppDataStore {
  facilities: Facility[];
  industrySummary: IndustryRow[];
  weeklySummary: WeeklyRow[];
  lastUpdated: string;
  source: 'BUILTIN' | 'GOOGLE_SHEETS' | 'UPLOADED_FILE';
}

export function loadInitialData(): AppDataStore {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed.facilities && parsed.facilities.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached data, falling back to embedded', e);
    }
  }

  return {
    facilities: facilitiesAllData as Facility[],
    industrySummary: industrySummaryData as IndustryRow[],
    weeklySummary: weeklySummaryData as WeeklyRow[],
    lastUpdated: new Date().toLocaleString('vi-VN'),
    source: 'BUILTIN'
  };
}

export function saveToCache(store: AppDataStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn('LocalStorage full, skipped caching entire payload', e);
  }
}

export function resetCache(): AppDataStore {
  localStorage.removeItem(STORAGE_KEY);
  return {
    facilities: facilitiesAllData as Facility[],
    industrySummary: industrySummaryData as IndustryRow[],
    weeklySummary: weeklySummaryData as WeeklyRow[],
    lastUpdated: new Date().toLocaleString('vi-VN'),
    source: 'BUILTIN'
  };
}

export async function syncFromGoogleSheets(
  sheetId: string = SPREADSHEET_ID,
  onProgress?: (msg: string) => void
): Promise<AppDataStore> {
  if (onProgress) onProgress('Đang kết nối đến máy chủ Google Sheets...');

  const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
  
  // Try fetching via direct fetch or CORS proxy if needed
  let buffer: ArrayBuffer;
  try {
    const res = await fetch(exportUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    buffer = await res.arrayBuffer();
  } catch (err: any) {
    if (onProgress) onProgress('Thử kết nối qua cổng dự phòng CORS proxy...');
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(exportUrl)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error('Không thể tải file từ Google Sheets qua mạng. Vui lòng thử tải file .xlsx lên trực tiếp.');
    buffer = await res.arrayBuffer();
  }

  if (onProgress) onProgress('Đang giải mã các sheet dữ liệu...');
  const store = parseWorkbookArrayBuffer(buffer, 'GOOGLE_SHEETS');
  saveToCache(store);
  return store;
}

export async function parseUploadedExcel(file: File): Promise<AppDataStore> {
  const buffer = await file.arrayBuffer();
  const store = parseWorkbookArrayBuffer(buffer, 'UPLOADED_FILE');
  saveToCache(store);
  return store;
}

export function parseWorkbookArrayBuffer(
  buffer: ArrayBuffer,
  source: 'GOOGLE_SHEETS' | 'UPLOADED_FILE'
): AppDataStore {
  const wb = XLSX.read(buffer, { type: 'array' });
  const teamNames = ['Đội 2', 'Đội 3', 'Đội 4', 'Đội 5', 'Đội 6', 'Đội 7', 'Đội 8', 'Đội 9', 'Đội 10', 'Đội 11', 'Đội 12'];

  // 1. Industry summary
  const industrySummary: IndustryRow[] = [];
  const bcWs = wb.Sheets['Công Thức ( BC)'];
  if (bcWs) {
    const bcData: any[][] = XLSX.utils.sheet_to_json(bcWs, { header: 1 });
    for (let r = 6; r <= 50; r++) {
      const row = bcData[r];
      if (!row) continue;
      const code = row[0] !== undefined && row[0] !== null ? String(row[0]).trim() : '';
      const name = row[1] !== undefined && row[1] !== null ? String(row[1]).trim() : '';
      if (!name) continue;

      const teamCounts: Record<string, number> = {};
      for (let c = 2; c <= 12; c++) {
        const tName = teamNames[c - 2];
        teamCounts[tName] = typeof row[c] === 'number' ? row[c] : (parseInt(row[c], 10) || 0);
      }
      const total = typeof row[13] === 'number' ? row[13] : (parseInt(row[13], 10) || 0);

      industrySummary.push({
        row: r,
        code,
        name,
        isCategoryHeader: code === '' && (name === 'Tổ chức' || name === 'Cá nhân' || name === 'TCCN'),
        teams: teamCounts,
        total
      });
    }
  }

  // 2. Weekly summary
  const weeklySummary: WeeklyRow[] = [];
  const stWs = wb.Sheets['Số liệu thống kê'];
  if (stWs) {
    const stData: any[][] = XLSX.utils.sheet_to_json(stWs, { header: 1 });
    for (let r = 2; r < stData.length; r++) {
      const row = stData[r];
      if (!row || !row[0]) continue;
      const weekLabel = String(row[0]).trim();
      if (!weekLabel.startsWith('Tuần')) continue;
      const weekNum = parseInt(weekLabel.replace(/\D/g, ''), 10) || 0;

      const totalByTeam: Record<string, number> = {};
      for (let c = 1; c <= 11; c++) totalByTeam[teamNames[c - 1]] = parseInt(row[c], 10) || 0;
      const totalAll = parseInt(row[12], 10) || 0;

      const newByTeam: Record<string, number> = {};
      for (let c = 13; c <= 23; c++) newByTeam[teamNames[c - 13]] = parseInt(row[c], 10) || 0;
      const newAll = parseInt(row[24], 10) || 0;

      const reByTeam: Record<string, number> = {};
      for (let c = 25; c <= 35; c++) reByTeam[teamNames[c - 25]] = parseInt(row[c], 10) || 0;
      const reAll = parseInt(row[36], 10) || 0;

      weeklySummary.push({
        weekLabel,
        weekNum,
        total: { byTeam: totalByTeam, all: totalAll },
        newSurvey: { byTeam: newByTeam, all: newAll },
        reSurvey: { byTeam: reByTeam, all: reAll }
      });
    }
  }

  // 3. Facilities
  const facilities: Facility[] = [];
  const teamSheets = [
    { sheet: 'D2', team: 'Đội 2' },
    { sheet: 'D3', team: 'Đội 3' },
    { sheet: 'D4', team: 'Đội 4' },
    { sheet: 'D5', team: 'Đội 5' },
    { sheet: 'D6', team: 'Đội 6' },
    { sheet: 'D7', team: 'Đội 7' },
    { sheet: 'D8', team: 'Đội 8' },
    { sheet: 'D9', team: 'Đội 9' },
    { sheet: 'D10', team: 'Đội 10' },
    { sheet: 'D11', team: 'Đội 11' },
    { sheet: 'D12', team: 'Đội 12' },
  ];

  const hasTeamSheets = teamSheets.some(ts => !!wb.Sheets[ts.sheet]);
  let idCounter = 1;

  if (hasTeamSheets) {
    teamSheets.forEach(({ sheet, team }) => {
      const ws = wb.Sheets[sheet];
      if (!ws) return;
      const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      for (let r = 2; r < data.length; r++) {
        const row = data[r];
        if (!row || row.length === 0) continue;

        const signboardName = String(row[2] || '').trim();
        const registeredName = String(row[3] || '').trim();
        const representative = String(row[4] || '').trim();
        const fullAddress = row[32] ? String(row[32]).trim() : '';
        const mst = row[13] ? String(row[13]).trim() : '';
        const facilityTypeRaw = String(row[1] || '').trim();

        if (!registeredName && !signboardName && !representative && !fullAddress && !mst) continue;

        const facilityType = facilityTypeRaw.toLowerCase().includes('tổ chức') || facilityTypeRaw.toLowerCase().includes('doanh nghiệp')
          ? 'Tổ chức'
          : 'Cá nhân';

        const activeIndustries: string[] = [];
        for (let c = 40; c < 80; c++) {
          const val = row[c];
          if (val && (String(val).toLowerCase() === 'x' || String(val) === '1' || val === true || typeof val === 'number')) {
            const indName = (data[0] && data[0][c]) || industryCols[c - 40];
            if (indName) activeIndustries.push(String(indName).trim());
          }
        }

        facilities.push({
          id: idCounter++,
          stt: row[0] || idCounter,
          facilityType,
          rawType: facilityTypeRaw,
          signboardName,
          registeredName: registeredName || signboardName || '(Chưa có tên)',
          representative,
          position: String(row[5] || '').trim(),
          birthDate: row[6] ? String(row[6]).trim() : '',
          cccd: row[7] ? String(row[7]).trim() : '',
          cccdDate: row[8] ? String(row[8]).trim() : '',
          cccdPlace: row[9] ? String(row[9]).trim() : '',
          phone: row[10] ? String(row[10]).trim() : '',
          businessLines: row[11] ? String(row[11]).trim() : '',
          mst,
          bLicenseNo: row[14] ? String(row[14]).trim() : '',
          bLicenseBranch: row[15] ? String(row[15]).trim() : '',
          bLicenseLoc: row[16] ? String(row[16]).trim() : '',
          bLicenseDate: row[17] ? String(row[17]).trim() : '',
          bLicensePlace: row[18] ? String(row[18]).trim() : '',
          condCertNo: row[19] ? String(row[19]).trim() : '',
          condCertDate: row[20] ? String(row[20]).trim() : '',
          condCertPlace: row[21] ? String(row[21]).trim() : '',
          condCertExp: row[22] ? String(row[22]).trim() : '',
          pracLicenseNo: row[23] ? String(row[23]).trim() : '',
          pracLicenseDate: row[24] ? String(row[24]).trim() : '',
          pracLicensePlace: row[25] ? String(row[25]).trim() : '',
          pracLicenseExp: row[26] ? String(row[26]).trim() : '',
          otherLicenseName: row[27] ? String(row[27]).trim() : '',
          otherLicenseNo: row[28] ? String(row[28]).trim() : '',
          otherLicenseDate: row[29] ? String(row[29]).trim() : '',
          otherLicensePlace: row[30] ? String(row[30]).trim() : '',
          otherLicenseExp: row[31] ? String(row[31]).trim() : '',
          fullAddress,
          streetNo: row[33] ? String(row[33]).trim() : '',
          hamlet: row[34] ? String(row[34]).trim() : '',
          ward: row[35] ? String(row[35]).trim() : '',
          surveyWeek: row[36] ? parseInt(row[36], 10) || null : null,
          surveyType: row[37] ? String(row[37]).trim() : '',
          officerArea: row[38] ? String(row[38]).trim() : '',
          officerInput: row[39] ? String(row[39]).trim() : '',
          industries: activeIndustries,
          note: row[80] ? String(row[80]).trim() : '',
          status: row[81] ? String(row[81]).trim() || 'Đang hoạt động' : 'Đang hoạt động',
          team
        });
      }
    });
  } else {
    const okWs = wb.Sheets['OK'];
    if (okWs) {
      const okData: any[][] = XLSX.utils.sheet_to_json(okWs, { header: 1 });
      for (let r = 2; r < okData.length; r++) {
        const row = okData[r];
        if (!row || row.length === 0) continue;

        let team = '';
        for (let c = row.length - 1; c >= 0; c--) {
          const val = String(row[c] || '');
          if (val.match(/^Đội\s*\d+$/i)) {
            team = val.trim();
            break;
          }
        }
        if (!team) {
          if (String(row[83] || '').startsWith('Đội')) team = String(row[83]);
        }

        const facilityType = String(row[1] || '').trim();
        const signboardName = String(row[2] || '').trim();
        const registeredName = String(row[3] || '').trim();
        const representative = String(row[4] || '').trim();
        const fullAddress = row[32] ? String(row[32]).trim() : '';

        if (!registeredName && !representative && !fullAddress) continue;

        const activeIndustries: string[] = [];
        for (let c = 40; c < 80; c++) {
          const val = row[c];
          if (val && (String(val).toLowerCase() === 'x' || String(val) === '1' || val === true)) {
            const indName = okData[0][c];
            if (indName) activeIndustries.push(String(indName).trim());
          }
        }

        facilities.push({
          id: idCounter++,
          stt: row[0] || (r - 1),
          facilityType: facilityType.includes('Tổ chức') ? 'Tổ chức' : 'Cá nhân',
          rawType: facilityType,
          signboardName,
          registeredName: registeredName || signboardName || '(Chưa có tên)',
          representative,
          position: String(row[5] || '').trim(),
          birthDate: row[6] ? String(row[6]).trim() : '',
          cccd: row[7] ? String(row[7]).trim() : '',
          cccdDate: row[8] ? String(row[8]).trim() : '',
          cccdPlace: row[9] ? String(row[9]).trim() : '',
          phone: row[10] ? String(row[10]).trim() : '',
          businessLines: row[11] ? String(row[11]).trim() : '',
          mst: row[13] ? String(row[13]).trim() : '',
          bLicenseNo: row[14] ? String(row[14]).trim() : '',
          bLicenseBranch: row[15] ? String(row[15]).trim() : '',
          bLicenseLoc: row[16] ? String(row[16]).trim() : '',
          bLicenseDate: row[17] ? String(row[17]).trim() : '',
          bLicensePlace: row[18] ? String(row[18]).trim() : '',
          condCertNo: row[19] ? String(row[19]).trim() : '',
          condCertDate: row[20] ? String(row[20]).trim() : '',
          condCertPlace: row[21] ? String(row[21]).trim() : '',
          condCertExp: row[22] ? String(row[22]).trim() : '',
          pracLicenseNo: row[23] ? String(row[23]).trim() : '',
          pracLicenseDate: row[24] ? String(row[24]).trim() : '',
          pracLicensePlace: row[25] ? String(row[25]).trim() : '',
          pracLicenseExp: row[26] ? String(row[26]).trim() : '',
          otherLicenseName: row[27] ? String(row[27]).trim() : '',
          otherLicenseNo: row[28] ? String(row[28]).trim() : '',
          otherLicenseDate: row[29] ? String(row[29]).trim() : '',
          otherLicensePlace: row[30] ? String(row[30]).trim() : '',
          otherLicenseExp: row[31] ? String(row[31]).trim() : '',
          fullAddress,
          streetNo: row[33] ? String(row[33]).trim() : '',
          hamlet: row[34] ? String(row[34]).trim() : '',
          ward: row[35] ? String(row[35]).trim() : '',
          surveyWeek: row[36] ? parseInt(row[36], 10) || null : null,
          surveyType: row[37] ? String(row[37]).trim() : '',
          officerArea: row[38] ? String(row[38]).trim() : '',
          officerInput: row[39] ? String(row[39]).trim() : '',
          industries: activeIndustries,
          note: row[80] ? String(row[80]).trim() : '',
          status: row[81] ? String(row[81]).trim() || 'Đang hoạt động' : 'Đang hoạt động',
          team: team || 'Chưa phân đội'
        });
      }
    }
  }

  return {
    facilities: facilities.length > 0 ? facilities : (facilitiesAllData as Facility[]),
    industrySummary: industrySummary.length > 0 ? industrySummary : (industrySummaryData as IndustryRow[]),
    weeklySummary: weeklySummary.length > 0 ? weeklySummary : (weeklySummaryData as WeeklyRow[]),
    lastUpdated: new Date().toLocaleString('vi-VN'),
    source
  };
}
