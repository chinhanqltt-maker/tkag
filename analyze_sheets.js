const XLSX = require('xlsx');
const fs = require('fs');

console.log('Reading data.xlsx...');
const wb = XLSX.readFile('data.xlsx');
console.log('Sheet Names:', wb.SheetNames);

const report = {};

wb.SheetNames.forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  const ref = ws['!ref'];
  if (!ref) {
    report[sheetName] = { empty: true };
    return;
  }
  const range = XLSX.utils.decode_range(ref);
  const rowCount = range.e.r - range.s.r + 1;
  const colCount = range.e.c - range.s.c + 1;
  
  // Get first 15 rows as array of arrays
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, range: { s: { r: range.s.r, c: range.s.c }, e: { r: Math.min(range.s.r + 15, range.e.r), c: range.e.c } } });
  
  report[sheetName] = {
    ref,
    rowCount,
    colCount,
    sampleRows: data
  };
});

fs.writeFileSync('sheet_analysis.json', JSON.stringify(report, null, 2), 'utf-8');
console.log('Analysis written to sheet_analysis.json');
