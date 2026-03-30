# GastosTiaMimiv6.3-Stable-Android-

MASTER BACKUP: Gastos Tía Mimi v6.3 (Stable Android)

1. **Backend**: Google Apps Script
  * Spreadsheet ID: 1XB2cMUMHvO4M4PF2cUnJhy1c6wTXdu2CmPKi3aFlvDk
  * Tab Name: Registro de Gastos

En esta seccion se guarda el código que se registra dentro de Google Drive. Se crea una planilla de Google Spreadsheet con las columnas requeridas para guardar los datos que se crean, y luego se carga el codigo en la funcion "Apps Script". Alli se guarda el siguiente codigo de javaScript.

*** JavaScript**
/** * VERSION 6.3 STABLE BACKUP
* Optimized for Android / mode: 'no-cors' */

const SPREADSHEET_ID = '1XB2cMUMHvO4M4PF2cUnJhy1c6wTXdu2CmPKi3aFlvDk';
const SHEET_NAME = 'Registro de Gastos';

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    const expenses = data.slice(1).map(row => ({
      fecha: row[0],
      persona: row[1],
      categoria: row[2],
      monto: row[3],
      comentario: row[4]
    }));
    
    return ContentService.createTextOutput(JSON.stringify(expenses))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (f) {
    return ContentService.createTextOutput("Error").setMimeType(ContentService.MimeType.TEXT);
  }
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

##
##
2. **Frontend: HTML File**
*Filename: gastos_tia_mimi_app_v6.3_PROD.html
En esta seccion se guarda el código HTML en el que se registra el frontend. Es decir la aplicacion de carga que usa el usuario desde su mobil o computadora. 

#Codigo HTML

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Gastos Tía Mimi v6.3</title>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:wght@600;700&display=swap" rel="stylesheet">
    <style>
        /* [Styles omitted for brevity, identical to your working v6.3 file] */
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        :root { --primary: #FF6B6B; --bg: #FFF8F3; --card-bg: #FFFFFF; --text: #2D3748; --border: #E2E8F0; }
        body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); padding-bottom: 20px; }
        .header { background: linear-gradient(135deg, var(--primary) 0%, #EE5A52 100%); color: white; padding: 1.2rem; text-align: center; position: sticky; top: 0; z-index: 100; }
        .header h1 { font-family: 'Fraunces', serif; font-size: 1.5rem; }
        .container { max-width: 500px; margin: 0 auto; padding: 1rem; }
        .card { background: var(--card-bg); border-radius: 20px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid var(--border); }
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.4rem; font-weight: 600; font-size: 0.85rem; color: #718096; }
        input, select { width: 100%; padding: 0.8rem; border: 2px solid var(--border); border-radius: 12px; font-size: 16px; }
        .btn { width: 100%; padding: 1rem; border: none; border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; }
        .btn-primary { background: var(--primary); color: white; margin-top: 10px; }
        .tab-buttons { display: flex; gap: 8px; margin-bottom: 1rem; }
        .tab-btn { flex: 1; padding: 0.8rem; border: 2px solid var(--border); background: white; border-radius: 15px; font-weight: 600; }
        .tab-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .expense-item { border-bottom: 1px solid var(--border); padding: 1rem 0; }
    </style>
</head>
<body>
    <div class="header"><h1>💝 Tía Mimi v6.3</h1></div>
    <div class="container">
        <div class="tab-buttons">
            <button class="tab-btn active" onclick="switchTab('nuevo', this)">➕ Nuevo</button>
            <button class="tab-btn" onclick="switchTab('historial', this)">📋 Historial</button>
        </div>
        <div id="tab-nuevo" class="tab-content active">
            <div class="card">
                <form id="expenseForm">
                    <div class="form-group"><label>📅 FECHA</label><input type="date" id="fecha" required></div>
                    <div class="form-group"><label>👤 QUIÉN GASTÓ</label>
                        <select id="persona" required>
                            <option value="Marcela">Marcela</option><option value="Gabriela">Gabriela</option>
                            <option value="Leo">Leo</option><option value="Paula">Paula</option>
                        </select>
                    </div>
                    <div class="form-group"><label>🏷️ CATEGORÍA</label>
                        <select id="categoria" required>
                            <option value="Limpieza">🧹 Limpieza</option><option value="Supermercado">🛒 Supermercado</option>
                            <option value="Transporte">🚌 Transporte</option><option value="Impuestos">💡 Impuestos</option>
                            <option value="Medicamentos">💊 Medicamentos</option><option value="Otros">📦 Otros</option>
                        </select>
                    </div>
                    <div class="form-group"><label>💰 MONTO ($)</label><input type="number" id="monto" step="0.01" inputmode="decimal" required></div>
                    <div class="form-group"><label>💬 COMENTARIOS</label><input type="text" id="comentario"></div>
                    <button type="submit" class="btn btn-primary" id="submitBtn">💾 GUARDAR GASTO</button>
                </form>
            </div>
        </div>
        <div id="tab-historial" class="tab-content">
            <div class="card" id="expense-list-container"></div>
        </div>
    </div>

    <script>
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwvZnw9PR_9hfO_546z5q2nY4-FnLvWZjGf_gHnGDXaIHbsU47FXOg1D5Pc3edV_Hoe/exec';
        document.getElementById('fecha').valueAsDate = new Date();

        function switchTab(tab, btn) {
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('tab-' + tab).classList.add('active');
            btn.classList.add('active');
            if(tab === 'historial') loadExpenses();
        }

        async function loadExpenses() {
            const container = document.getElementById('expense-list-container');
            container.innerHTML = 'Cargando...';
            try {
                const resp = await fetch(`${SCRIPT_URL}?t=${Date.now()}`);
                const data = await resp.json();
                container.innerHTML = data.reverse().map(e => `
                    <div class="expense-item">
                        <strong>$ ${parseFloat(e.monto).toLocaleString('es-AR')}</strong> - ${e.persona}<br>
                        <small>${e.categoria} | ${e.comentario || ''}</small>
                    </div>
                `).join('');
            } catch (err) { container.innerHTML = 'Error al cargar historial.'; }
        }

        document.getElementById('expenseForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            btn.disabled = true; btn.textContent = 'Guardando...';
            const payload = {
                fecha: document.getElementById('fecha').value,
                persona: document.getElementById('persona').value,
                categoria: document.getElementById('categoria').value,
                monto: document.getElementById('monto').value,
                comentario: document.getElementById('comentario').value
            };
            try {
                await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
                alert('✅ ¡Gasto guardado!');
                document.getElementById('expenseForm').reset();
                document.getElementById('fecha').valueAsDate = new Date();
            } catch (err) { alert('❌ Error'); }
            finally { btn.disabled = false; btn.textContent = '💾 GUARDAR GASTO'; }
        });
    </script>
</body>
</html>
