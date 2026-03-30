// Google Apps Script - v7.1 CLOUD HOSTING
const SPREADSHEET_ID = '1XB2cMUMHvO4M4PF2cUnJhy1c6wTXdu2CmPKi3aFlvDk'; 
const SHEET_NAME = 'Registro de Gastos';

function doGet(e) {
  // Caso A: Si pedimos los datos (Historial)
  if (e.parameter.action === 'get') {
    try {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = ss.getSheetByName(SHEET_NAME);
      const data = sheet.getDataRange().getValues();
      const expenses = data.slice(1).map(row => ({
        fecha: row[0] instanceof Date ? Utilities.formatDate(row[0], "GMT-3", "dd/MM/yyyy") : row[0],
        persona: row[1],
        categoria: row[2],
        monto: row[3],
        comentario: row[4]
      })).filter(ex => ex.persona);
      
      return ContentService.createTextOutput(JSON.stringify(expenses))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (f) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Caso B: Si entramos al link (Cargar Interfaz)
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Gastos Tía Mimi')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.fecha,
      data.persona,
      data.categoria,
      data.monto,
      data.comentario
    ]);
    
    return ContentService.createTextOutput("Success");
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.message);
  }
}
