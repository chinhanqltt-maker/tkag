const XLSX = require('xlsx');
const wb = XLSX.readFile('data.xlsx', { cellFormula: true, cellNF: true });

console.log('--- FORMULAS IN CÔNG THỨC (BC) ---');
const bcWs = wb.Sheets['Công Thức ( BC)'];
for (let r = 7; r <= 25; r++) {
  const cName = bcWs[XLSX.utils.encode_cell({ r: r, c: 1 })]?.v;
  const cDoi2 = bcWs[XLSX.utils.encode_cell({ r: r, c: 2 })]?.f || bcWs[XLSX.utils.encode_cell({ r: r, c: 2 })]?.v;
  const cTong = bcWs[XLSX.utils.encode_cell({ r: r, c: 13 })]?.f || bcWs[XLSX.utils.encode_cell({ r: r, c: 13 })]?.v;
  console.log(`Row ${r} (${cName}): Đội 2 = ${cDoi2} | Tổng = ${cTong}`);
}

console.log('\n--- FORMULAS IN SỐ LIỆU THỐNG KÊ ---');
const stWs = wb.Sheets['Số liệu thống kê'];
for (let r = 2; r <= 6; r++) {
  const week = stWs[XLSX.utils.encode_cell({ r: r, c: 0 })]?.v;
  const doi2_tong = stWs[XLSX.utils.encode_cell({ r: r, c: 1 })]?.f || stWs[XLSX.utils.encode_cell({ r: r, c: 1 })]?.v;
  const doi2_moi = stWs[XLSX.utils.encode_cell({ r: r, c: 13 })]?.f || stWs[XLSX.utils.encode_cell({ r: r, c: 13 })]?.v;
  const doi2_lai = stWs[XLSX.utils.encode_cell({ r: r, c: 25 })]?.f || stWs[XLSX.utils.encode_cell({ r: r, c: 25 })]?.v;
  console.log(`Row ${r} (${week}): Đội 2 Tổng=${doi2_tong}, Mới=${doi2_moi}, Lại=${doi2_lai}`);
}

console.log('\n--- FORMULAS IN OK ROW 2 & 3 ---');
const okWs = wb.Sheets['OK'];
console.log('OK!A3 formula:', okWs['A3']?.f);
console.log('OK!B3 formula:', okWs['B3']?.f);
console.log('OK!CD3 formula:', okWs['CD3']?.f);
console.log('OK!CF3 formula:', okWs['CF3']?.f);

