import * as XLSX from 'xlsx';
import { Facility, IndustryRow, WeeklyRow } from '../types';
import { TEAM_LIST } from './dataAggregator';

export function exportIndustryMatrixToExcel(data: IndustryRow[], filename = 'Bao_Cao_Nganh_Nghe_QLTT_An_Giang.xlsx') {
  const wsData: any[][] = [];

  // Header 1
  wsData.push(['CHI CỤC QUẢN LÝ THỊ TRƯỜNG TỈNH AN GIANG', '', '', '', '', '', '', 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM']);
  wsData.push(['PHÒNG NGHIỆP VỤ - TỔNG HỢP', '', '', '', '', '', '', 'Độc lập - Tự do - Hạnh phúc']);
  wsData.push(['']);
  wsData.push(['DANH SÁCH TỔNG HỢP CƠ SỞ KINH DOANH THEO NGÀNH NGHỀ TRÊN ĐỊA BÀN TỈNH AN GIANG']);
  wsData.push(['']);

  // Table header
  const tableHeader = ['STT', 'Ngành nghề', ...TEAM_LIST, 'Tổng cộng'];
  wsData.push(tableHeader);

  data.forEach(item => {
    const row = [
      item.code || '',
      item.name,
      ...TEAM_LIST.map(t => item.teams[t] || 0),
      item.total
    ];
    wsData.push(row);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },
    { wch: 35 },
    ...TEAM_LIST.map(() => ({ wch: 10 })),
    { wch: 14 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Công Thức ( BC)');
  XLSX.writeFile(wb, filename);
}

export function exportWeeklyProgressToExcel(data: WeeklyRow[], filename = 'Bao_Cao_Tien_Do_Tuan_QLTT_An_Giang.xlsx') {
  const wsData: any[][] = [];

  wsData.push(['BÁO CÁO TIẾN ĐỘ THỐNG KÊ HẰNG TUẦN - CHI CỤC QLTT AN GIANG']);
  wsData.push(['']);

  // Multi-level Header
  const headerRow1 = [
    'Đơn vị',
    ...TEAM_LIST.map(() => 'TỔNG SỐ THỐNG KÊ'), 'Tổng',
    ...TEAM_LIST.map(() => 'THỐNG KÊ MỚI'), 'Tổng',
    ...TEAM_LIST.map(() => 'THỐNG KÊ LẠI'), 'Tổng'
  ];

  const headerRow2 = [
    'Tuần',
    ...TEAM_LIST, 'Tổng',
    ...TEAM_LIST, 'Tổng',
    ...TEAM_LIST, 'Tổng'
  ];

  wsData.push(headerRow1);
  wsData.push(headerRow2);

  data.forEach(w => {
    const row = [
      w.weekLabel,
      ...TEAM_LIST.map(t => w.total.byTeam[t] || 0),
      w.total.all,
      ...TEAM_LIST.map(t => w.newSurvey.byTeam[t] || 0),
      w.newSurvey.all,
      ...TEAM_LIST.map(t => w.reSurvey.byTeam[t] || 0),
      w.reSurvey.all
    ];
    wsData.push(row);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Số liệu thống kê');
  XLSX.writeFile(wb, filename);
}

export function exportFacilitiesToExcel(facilities: Facility[], filename = 'Danh_Sach_Co_So_QLTT_An_Giang.xlsx') {
  const exportRows = facilities.map((f, idx) => ({
    'STT': idx + 1,
    'Đội QLTT': f.team,
    'Loại hình': f.facilityType,
    'Tên cơ sở / Hộ KD / Doanh nghiệp': f.registeredName,
    'Tên bảng hiệu': f.signboardName || '',
    'Người đại diện': f.representative || '',
    'Chức vụ': f.position || '',
    'CCCD/CMND': f.cccd || '',
    'Điện thoại': f.phone || '',
    'Mã số thuế': f.mst || '',
    'Số GCN ĐKKD': f.bLicenseNo || '',
    'Ngày cấp ĐKKD': f.bLicenseDate || '',
    'Nơi cấp ĐKKD': f.bLicensePlace || '',
    'Địa chỉ đầy đủ': f.fullAddress || '',
    'Phường/Xã': f.ward || '',
    'Ấp/Đường': f.hamlet || f.streetNo || '',
    'Ngành nghề kinh doanh': f.industries.join(', '),
    'Tuần thống kê': f.surveyWeek ? `Tuần ${f.surveyWeek}` : '',
    'Loại thống kê': f.surveyType || '',
    'Cán bộ quản lý': f.officerArea || '',
    'Cán bộ nhập liệu': f.officerInput || '',
    'Tình trạng': f.status || 'Đang hoạt động',
    'Ghi chú': f.note || ''
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportRows);
  XLSX.utils.book_append_sheet(wb, ws, 'Danh sách Cơ sở');
  XLSX.writeFile(wb, filename);
}
