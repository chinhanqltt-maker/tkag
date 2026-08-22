const XLSX = require('xlsx');
const wb = XLSX.readFile('data.xlsx');
const okWs = wb.Sheets['OK'];
const okData = XLSX.utils.sheet_to_json(okWs, { header: 1 });

console.log('--- SAMPLE ROWS FROM OK ---');
for (let i = 2; i < 7; i++) {
  console.log(`Row ${i}:`, JSON.stringify(okData[i]));
}

// Let us inspect the columns and distinct values in OK
const header0 = okData[0];
const header1 = okData[1];

// Team column check: which column indicates Đội?
console.log('\n--- Checking team / department column in OK ---');
const teams = {};
const statusMap = {};
const typeMap = {};
const weekMap = {};

for (let r = 2; r < okData.length; r++) {
  const row = okData[r];
  if (!row || row.length === 0) continue;
  // Let's check columns near the end: col 82, 83, 84, etc.
  const lastCol = row[row.length - 1];
  const secondLast = row[row.length - 2];
  const thirdLast = row[row.length - 3];
  const col36 = row[36]; // Tuần thống kê? Let's check col indexes
  
  const type = row[1];
  typeMap[type] = (typeMap[type] || 0) + 1;
  
  // Find which column has 'Đội 2', 'Đội 3', etc.
  for (let c = 0; c < row.length; c++) {
    const val = String(row[c]);
    if (val && val.includes('Đội')) {
      teams[c] = (teams[c] || {});
      teams[c][val] = (teams[c][val] || 0) + 1;
    }
  }
}

console.log('Types:', typeMap);
console.log('Team columns found:', teams);
