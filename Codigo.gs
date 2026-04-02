// ==========================================
// CONFIGURACIÓN DE ENTORNOS
// ==========================================
var ENTORNO = "DEV"; // <--- CAMBIA A "PROD" CUANDO SUBAS LA VERSIÓN FINAL

var HOJAS_ID = {
  "PROD": "1XB2cMUMHvO4M4PF2cUnJhy1c6wTXdu2CmPKi3aFlvDk",
  "DEV":  "1LeFSDyYfQNewcmTF16UxzCKKSzEO6r8VPrfWNeIZi80"
};

function getSheet() {
  // Ahora el script siempre sabrá a qué Excel apuntar según la variable ENTORNO
  return SpreadsheetApp.openById(HOJAS_ID[ENTORNO]).getSheets()[0];
}


function getSheet() {
  // Retorna la primera pestaña (donde se guardan los gastos)
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function getLista(columna) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CONFIG");
    if (!sheet) return ["Error: CONFIG no existe"];
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return ["Sin datos"];
    var data = sheet.getRange(2, columna, lastRow - 1, 1).getValues();
    return data.map(function(r) { return r[0]; }).filter(function(i) { return i !== "" && i !== null; });
  } catch(e) {
    return ["Error al leer lista"];
  }
}

function doGet(e) {
  if (e.parameter.action === 'get') {
    try {
      var sheet = getSheet();
      var values = sheet.getDataRange().getValues();

      // Si solo hay encabezados
      if (values.length <= 1) {
        return ContentService.createTextOutput(JSON.stringify({
          totalGeneral: 0, porPersona: [], porCategoria: [], movimientos: []
        })).setMimeType(ContentService.MimeType.JSON);
      }

      values.shift(); // Eliminar encabezados
      var totalGeneral = 0, statsPersona = {}, statsCategoria = {}, movimientos = [];

      // Procesar de abajo hacia arriba (más recientes primero)
      for (var i = values.length - 1; i >= 0; i--) {
        var r = values[i];
        if (!r[0] && !r[3]) continue; // Saltar filas vacías

        var monto = parseFloat(r[3]) || 0;
        totalGeneral += monto;

        // Agrupar por Persona y Categoría
        var p = r[1] || "Anónimo";
        var c = r[2] || "Otros";
        statsPersona[p] = (statsPersona[p] || 0) + monto;
        statsCategoria[c] = (statsCategoria[c] || 0) + monto;

        // Guardar solo los últimos 15 para velocidad
        if (movimientos.length < 15) {
          var f = new Date(r[0]);
          var fTxt = isNaN(f.getTime()) ? "S/F" : Utilities.formatDate(f, "GMT-3", "dd/MM");
          movimientos.push({
            fecha: fTxt,
            persona: p,
            cat: c,
            monto: monto,
            nota: r[4] || ""
          });
        }
      }

      // Formatear para el Front-end
      var res = {
        totalGeneral: totalGeneral,
        porPersona: Object.keys(statsPersona).sort().map(function(k){ return {etiqueta: k, monto: statsPersona[k]}; }),
        porCategoria: Object.keys(statsCategoria).sort().map(function(k){ return {etiqueta: k, monto: statsCategoria[k]}; }),
        movimientos: movimientos
      };

      return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({error: err.toString()})).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Carga de la Interfaz
  var t = HtmlService.createTemplateFromFile('index');
  t.categorias = getLista(1); // Columna A de CONFIG
  t.personas = getLista(2);   // Columna B de CONFIG
  return t.evaluate()
    .setTitle("Dashboard v8.4.2")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    getSheet().appendRow([d.fecha, d.persona, d.categoria, d.monto, d.comentario]);
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  } catch (ex) {
    return ContentService.createTextOutput("Error").setMimeType(ContentService.MimeType.TEXT);
  }
}
