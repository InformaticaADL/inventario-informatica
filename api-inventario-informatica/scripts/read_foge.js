const xlsx = require('xlsx');
const workbook = xlsx.readFile('C:/Users/frehbein/Desktop/proyectos/inventario-informatica/FoGe IE-04.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
console.log(JSON.stringify(data[0]));
