const XLSX = require('xlsx');
const fs = require('fs');

console.log('Loading data.xlsx...');
const wb = XLSX.readFile('data.xlsx');

// 1. Parse Sheet "Công Thức ( BC)"
console.log('Extracting Công Thức ( BC)...');
const bcWs = wb.Sheets['Công Thức ( BC)'];
const bcData = XLSX.utils.sheet_to_json(bcWs, { header: 1 });

const industrySummary = [];
const teamNames = ['Đội 2', 'Đội 3', 'Đội 4', 'Đội 5', 'Đội 6', 'Đội 7', 'Đội 8', 'Đội 9', 'Đội 10', 'Đội 11', 'Đội 12'];

// Process rows from row 7 to 51
for (let r = 6; r <= 50; r++) {
  const row = bcData[r];
  if (!row) continue;
  const code = row[0] !== undefined && row[0] !== null ? String(row[0]).trim() : '';
  const name = row[1] !== undefined && row[1] !== null ? String(row[1]).trim() : '';
  if (!name) continue;

  const teamCounts = {};
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

// 2. Parse Sheet "Số liệu thống kê"
console.log('Extracting Số liệu thống kê...');
const stWs = wb.Sheets['Số liệu thống kê'];
const stData = XLSX.utils.sheet_to_json(stWs, { header: 1 });

const weeklySummary = [];
for (let r = 2; r < stData.length; r++) {
  const row = stData[r];
  if (!row || !row[0]) continue;
  const weekLabel = String(row[0]).trim();
  if (!weekLabel.startsWith('Tuần')) continue;

  const weekNum = parseInt(weekLabel.replace(/\D/g, ''), 10) || 0;

  // Cols 1..11 = Total per team, Col 12 = Total
  // Cols 13..23 = New per team, Col 24 = New Total
  // Cols 25..35 = Re-survey per team, Col 36 = Re-survey Total
  const totalByTeam = {};
  for (let c = 1; c <= 11; c++) {
    totalByTeam[teamNames[c - 1]] = typeof row[c] === 'number' ? row[c] : (parseInt(row[c], 10) || 0);
  }
  const totalAll = typeof row[12] === 'number' ? row[12] : (parseInt(row[12], 10) || 0);

  const newByTeam = {};
  for (let c = 13; c <= 23; c++) {
    newByTeam[teamNames[c - 13]] = typeof row[c] === 'number' ? row[c] : (parseInt(row[c], 10) || 0);
  }
  const newAll = typeof row[24] === 'number' ? row[24] : (parseInt(row[24], 10) || 0);

  const reByTeam = {};
  for (let c = 25; c <= 35; c++) {
    reByTeam[teamNames[c - 25]] = typeof row[c] === 'number' ? row[c] : (parseInt(row[c], 10) || 0);
  }
  const reAll = typeof row[36] === 'number' ? row[36] : (parseInt(row[36], 10) || 0);

  weeklySummary.push({
    weekLabel,
    weekNum,
    total: { byTeam: totalByTeam, all: totalAll },
    newSurvey: { byTeam: newByTeam, all: newAll },
    reSurvey: { byTeam: reByTeam, all: reAll }
  });
}

// 3. Parse Sheet "OK" (Facilities Master List)
console.log('Extracting master facilities from sheet OK...');
const okWs = wb.Sheets['OK'];
const okData = XLSX.utils.sheet_to_json(okWs, { header: 1 });

const industryCols = [
  'LPG', 'Xăng dầu', 'Phân bón', 'Thuốc BVTV', 'Vật tư nông nghiệp',
  'Thực phẩm công thương quản lý', 'Rượu', 'Bia, nướt giải khát', 'Thuốc lá', 'Sữa',
  'Dầu thực vật', 'Bột, tinh bột', 'Bánh, mứt, kẹo', 'Sản xuất bánh kẹo,', 'Sản xuất bánh phở, bún',
  'Tân dược', 'Đông y', 'Thuốc thú y gia súc', 'Thức ăn gia súc, gia cầm', 'Thuốc thú y thủy sản',
  'Thức ăn thủy sản', 'Mỹ phẫm', 'Đồng hồ', 'Mắt kính', 'Quần áo',
  'Điện thoại', 'Điện gia dụng', 'Vật liệu xây dựng', 'Dịch vụ lưu trú (Khách sạn)', 'Dịch vụ lưu trú (Nhà trọ)',
  'Dịch vụ ăn uống', 'Vật tư đồ sắt', 'Điện máy', 'Trang trí nội thất', 'Phụ tùng oto',
  'Phụ tùng Honda', 'Xe máy', 'Xe oto', 'Vàng, bạc', 'Vi tính'
];

const facilities = [];
for (let r = 2; r < okData.length; r++) {
  const row = okData[r];
  if (!row || row.length === 0) continue;
  
  // Normalize team
  let team = '';
  // Check col 83 or search for Đội
  for (let c = row.length - 1; c >= 0; c--) {
    const val = String(row[c] || '');
    if (val.match(/^Đội\s*\d+$/i)) {
      team = val.trim();
      break;
    }
  }
  if (!team) {
    const lastColVal = String(row[row.length - 1] || '');
    if (lastColVal.startsWith('Đội')) team = lastColVal;
    else if (String(row[83] || '').startsWith('Đội')) team = String(row[83]);
  }

  const facilityType = String(row[1] || '').trim();
  const signboardName = String(row[2] || '').trim();
  const registeredName = String(row[3] || '').trim();
  const representative = String(row[4] || '').trim();
  const position = String(row[5] || '').trim();
  const birthDate = row[6] ? String(row[6]).trim() : '';
  const cccd = row[7] ? String(row[7]).trim() : '';
  const cccdDate = row[8] ? String(row[8]).trim() : '';
  const cccdPlace = row[9] ? String(row[9]).trim() : '';
  const phone = row[10] ? String(row[10]).trim() : '';
  const businessLines = row[11] ? String(row[11]).trim() : '';
  const mst = row[13] ? String(row[13]).trim() : '';
  
  // Business Registration Certificate
  const bLicenseNo = row[14] ? String(row[14]).trim() : '';
  const bLicenseBranch = row[15] ? String(row[15]).trim() : '';
  const bLicenseLoc = row[16] ? String(row[16]).trim() : '';
  const bLicenseDate = row[17] ? String(row[17]).trim() : '';
  const bLicensePlace = row[18] ? String(row[18]).trim() : '';

  // Condition Cert
  const condCertNo = row[19] ? String(row[19]).trim() : '';
  const condCertDate = row[20] ? String(row[20]).trim() : '';
  const condCertPlace = row[21] ? String(row[21]).trim() : '';
  const condCertExp = row[22] ? String(row[22]).trim() : '';

  // Practice License
  const pracLicenseNo = row[23] ? String(row[23]).trim() : '';
  const pracLicenseDate = row[24] ? String(row[24]).trim() : '';
  const pracLicensePlace = row[25] ? String(row[25]).trim() : '';
  const pracLicenseExp = row[26] ? String(row[26]).trim() : '';

  // Other License
  const otherLicenseName = row[27] ? String(row[27]).trim() : '';
  const otherLicenseNo = row[28] ? String(row[28]).trim() : '';
  const otherLicenseDate = row[29] ? String(row[29]).trim() : '';
  const otherLicensePlace = row[30] ? String(row[30]).trim() : '';
  const otherLicenseExp = row[31] ? String(row[31]).trim() : '';

  // Address
  const fullAddress = row[32] ? String(row[32]).trim() : '';
  const streetNo = row[33] ? String(row[33]).trim() : '';
  const hamlet = row[34] ? String(row[34]).trim() : '';
  const ward = row[35] ? String(row[35]).trim() : '';

  // Survey tracking
  const surveyWeek = row[36] ? parseInt(row[36], 10) || null : null;
  const surveyType = row[37] ? String(row[37]).trim() : '';
  const officerArea = row[38] ? String(row[38]).trim() : '';
  const officerInput = row[39] ? String(row[39]).trim() : '';

  // Industry flags (cols 40..79)
  const activeIndustries = [];
  for (let c = 40; c < 80; c++) {
    const val = row[c];
    if (val && (String(val).toLowerCase() === 'x' || String(val) === '1' || val === true)) {
      const indName = okData[0][c] || industryCols[c - 40];
      if (indName) activeIndustries.push(indName.trim());
    }
  }

  // Status & Note
  const note = row[80] ? String(row[80]).trim() : '';
  const status = row[81] ? String(row[81]).trim() || 'Đang hoạt động' : 'Đang hoạt động';

  if (registeredName || representative || fullAddress) {
    facilities.push({
      id: r - 1,
      stt: row[0] || (r - 1),
      facilityType: facilityType.includes('Tổ chức') ? 'Tổ chức' : 'Cá nhân',
      rawType: facilityType,
      signboardName,
      registeredName: registeredName || signboardName || '(Chưa có tên)',
      representative,
      position,
      birthDate,
      cccd,
      cccdDate,
      cccdPlace,
      phone,
      businessLines,
      mst,
      bLicenseNo,
      bLicenseBranch,
      bLicenseLoc,
      bLicenseDate,
      bLicensePlace,
      condCertNo,
      condCertDate,
      condCertPlace,
      condCertExp,
      pracLicenseNo,
      pracLicenseDate,
      pracLicensePlace,
      pracLicenseExp,
      otherLicenseName,
      otherLicenseNo,
      otherLicenseDate,
      otherLicensePlace,
      otherLicenseExp,
      fullAddress,
      streetNo,
      hamlet,
      ward,
      surveyWeek,
      surveyType,
      officerArea,
      officerInput,
      industries: activeIndustries,
      note,
      status,
      team: team || 'Chưa phân đội'
    });
  }
}

console.log(`Extracted ${facilities.length} valid facilities!`);

// Write out parsed dataset
if (!fs.existsSync('src/data')) {
  fs.mkdirSync('src/data', { recursive: true });
}

fs.writeFileSync('src/data/industrySummary.json', JSON.stringify(industrySummary, null, 2), 'utf8');
fs.writeFileSync('src/data/weeklySummary.json', JSON.stringify(weeklySummary, null, 2), 'utf8');
fs.writeFileSync('src/data/facilitiesSample.json', JSON.stringify(facilities.slice(0, 500), null, 2), 'utf8');
fs.writeFileSync('src/data/facilitiesAll.json', JSON.stringify(facilities), 'utf8');

console.log('Successfully generated JSON datasets in src/data/ !');
