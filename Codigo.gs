// ==========================================
// CONFIGURACIÓN DE ENTORNOS
// ==========================================
var ENTORNO = "PROD"; // <--- CAMBIA A "PROD" CUANDO SUBAS LA VERSIÓN FINAL

var HOJAS_ID = {
  "PROD": "1XB2cMUMHvO4M4PF2cUnJhy1c6wTXdu2CmPKi3aFlvDk",
  "DEV":  "1Yo2Za0Bi1E2_AeIe4lFOLS9ckqveQJ2yHULmvih8oVk"
};

function getSheet() {
  // Ahora el script siempre sabrá a qué Excel apuntar según la variable ENTORNO
  return SpreadsheetApp.openById(HOJAS_ID[ENTORNO]).getSheets()[0];
}

/**
 * Función principal para manejar las peticiones GET.
 * Controla tanto la carga inicial de la web como la obtención de datos.
 */
function doGet(e) {
  var action = e.parameter.action;

  // ESCENARIO 1: La web solicita los datos para el Historial
  if (action === 'get') {
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      // Usamos getSheets()[0] para que siempre use la primera pestaña, sin importar el nombre
      var sheet = ss.getSheets()[0];
      var data = sheet.getDataRange().getValues();

      // Si la hoja está vacía o solo tiene encabezados
      if (data.length <= 1) {
        return ContentService.createTextOutput(JSON.stringify([]))
          .setMimeType(ContentService.MimeType.JSON);
      }

      var headers = data.shift(); // Quitamos los encabezados

      var result = data.map(function(row) {
        return {
          fecha: row[0],
          persona: row[1],
          categoria: row[2],
          monto: row[3],
          comentario: row[4]
        };
      });

      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({error: error.toString()}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ESCENARIO 2: Carga normal de la página web (index.html)
  // Esto es lo que soluciona el mensaje de "No mostró ningún valor"
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Gastos Tía Mimi v7.1')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Función para manejar el guardado de nuevos gastos (POST).
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0]; // Usamos la primera pestaña por defecto

    // Parseamos los datos que vienen del formulario index.html
    var data = JSON.parse(e.postData.contents);

    // Insertamos la fila en la hoja de cálculo
    sheet.appendRow([
      data.fecha,
      data.persona,
      data.categoria,
      data.monto,
      data.comentario
    ]);

    return ContentService.createTextOutput("Success")
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
