# 📊 Tia Mimi - Expense Management System v8.4.2

Una aplicación web personalizada para el control de gastos familiares, con integración total en la nube, interfaz móvil optimizada y arquitectura profesional de entornos.

## 🚀 Novedades de la v8.4.2 (Stable Edition)
* **Dual Environment:** Separación total de **PROD** (Producción) y **DEV** (Desarrollo) para pruebas seguras.
* **Smart Dashboard:** Visualización en tiempo real de gastos por Persona, Categoría e Historial reciente.
* **Anti-Fail System:** Lógica de auto-reintento y tiempos de espera controlados para evitar errores de conexión en móviles.
* **Cloud Powered:** Backend basado en Google Apps Script con almacenamiento persistente en Google Sheets.

## 📂 Estructura del Proyecto

* **[`main` branch](https://github.com/leomartire/GastosTiaMimiv6.3-Stable-Android-/tree/main):** Código estable configurado para el entorno de **Producción (PROD)**.
* **[`develop` branch](https://github.com/leomartire/GastosTiaMimiv6.3-Stable-Android-/tree/develop):** Versión de pruebas configurada para el entorno de **Desarrollo (DEV)**.
* **[🚀 v7.1 - Cloud Edition](./v7.1-Cloud):** Versión anterior estable con integración en tiempo real (Legacy).
* **[📦 v6.3 - Offline Edition](./v6.3-Offline):** Versión legada original (HTML standalone) para uso local.

---

## 🛠️ Roadmap & Estado del Proyecto

### ✅ Logros Recientes (¡Completado!)
- [x] **Dashboard de Total General:** Sumatoria automática en la pestaña de reportes.
- [x] **Historial de Movimientos:** Visualización de los últimos 15 gastos cargados.
- [x] **Arquitectura de Entornos:** Switch PROD/DEV para desarrollo seguro.
- [x] **Feedback Visual:** Banners dinámicos según el entorno activo.

### 📈 Próximas Mejoras (En Planificación)
- [ ] **Gráficos de Torta:** Representación visual de gastos por categoría usando Chart.js.
- [ ] **Filtro por Mes:** Selector para ver reportes de meses específicos.
- [ ] **Modo Oscuro:** Adaptación de la UI para visualización nocturna.
- [ ] **Botón de Borrado:** Opción para eliminar entradas erróneas desde la interfaz (con confirmación).

---

## ⚙️ Configuración Técnica
El sistema utiliza una variable global `ENTORNO` para alternar entre hojas de cálculo mediante sus IDs únicos:
```javascript
var ENTORNO = "PROD"; // Cambiar a "DEV" para pruebas en rama develop
