const XLSX = require('xlsx');
const wb = XLSX.readFile('data.xlsx');
const bcWs = wb.Sheets['Công Thức ( BC)'];
const bcData = XLSX.utils.sheet_to_json(bcWs, { header: 1 });

console.log('--- NGÀNH NGHỀ IN CÔNG THỨC (BC) ---');
const industries = [];
for (let r = 6; r < bcData.length; r++) {
  const row = bcData[r];
  if (!row) continue;
  const stt = row[0];
  const name = row[1];
  if (name) {
    industries.push({ row: r, stt, name, total: row[13] });
  }
}
console.log(JSON.stringify(industries, null, 2));
