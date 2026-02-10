const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../correosADL.xlsx');
console.log(`Reading file from: ${filePath}`);

try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    if (data.length > 0) {
        console.log('Headers:', JSON.stringify(data[0]));
        console.log('First Record:', JSON.stringify(data[1]));
    } else {
        console.log('Sheet is empty');
    }
} catch (error) {
    console.error('Error reading file:', error);
}
