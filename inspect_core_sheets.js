const XLSX = require('xlsx');
const wb = XLSX.readFile('data.xlsx');

function dumpSheet(name, maxRows = 20) {
  console.log(`\n=================== SHEET: ${name} ===================`);
  const ws = wb.Sheets[name];
  if (!ws) {
    console.log('Not found!');
    return;
  }
  const ref = ws['!ref'];
  console.log(`Ref: ${ref}`);
  const range = XLSX.utils.decode_range(ref);
  console.log(`Total Rows: ${range.e.r - range.s.r + 1}, Cols: ${range.e.c - range.s.c + 1}`);
  
  for (let r = range.s.r; r <= Math.min(range.s.r + maxRows, range.e.r); r++) {
    const row = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      row.push(cell ? cell.v : null);
    }
    // Only print non-empty
    if (row.some(x => x !== null && x !== '')) {
      console.log(`Row ${r}:`, JSON.stringify(row.slice(0, 45))); // first 45 cols
    }
  }
}

dumpSheet('OK', 10);
dumpSheet('Công Thức ( BC)', 25);
dumpSheet('Số liệu thống kê', 25);
dumpSheet('Số liệu hằng tuần', 20);
