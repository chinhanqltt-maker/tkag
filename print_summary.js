const fs = require('fs');
const report = JSON.parse(fs.readFileSync('sheet_analysis.json', 'utf8'));

for (const [name, info] of Object.entries(report)) {
  console.log(`\n=================== SHEET: ${name} ===================`);
  console.log(`Rows: ${info.rowCount}, Cols: ${info.colCount}, Ref: ${info.ref}`);
  if (info.sampleRows && info.sampleRows.length > 0) {
    console.log('--- Row 0 ---:', JSON.stringify(info.sampleRows[0]));
    if (info.sampleRows.length > 1) console.log('--- Row 1 ---:', JSON.stringify(info.sampleRows[1]));
    if (info.sampleRows.length > 2) console.log('--- Row 2 ---:', JSON.stringify(info.sampleRows[2]));
    if (info.sampleRows.length > 3) console.log('--- Row 3 ---:', JSON.stringify(info.sampleRows[3]));
  }
}
