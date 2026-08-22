const XLSX = require('xlsx');
const wb = XLSX.readFile('data.xlsx');

console.log('--- SHEET ROW COUNTS ---');
wb.SheetNames.forEach(s => {
  const ws = wb.Sheets[s];
  const ref = ws['!ref'];
  if (ref) {
    const range = XLSX.utils.decode_range(ref);
    console.log(`${s.padEnd(25)}: ${range.e.r - range.s.r + 1} rows, ${range.e.c - range.s.c + 1} cols`);
  }
});

const okWs = wb.Sheets['OK'];
const okData = XLSX.utils.sheet_to_json(okWs, { header: 1 });
console.log('\n--- SHEET OK HEADER ROW 0 ---');
console.log(okData[0]);
console.log('\n--- SHEET OK HEADER ROW 1 ---');
console.log(okData[1]);
console.log('\n--- TOTAL RECORDS IN OK ---', okData.length - 2);

