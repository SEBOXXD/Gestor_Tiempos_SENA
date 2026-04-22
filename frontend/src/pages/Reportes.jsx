// =============================================
// Reportes.jsx — Página de Reportes CHRONOS
// =============================================
// 📚 EXPLICACIÓN PARA APRENDER REACT:
//
// 1. "import" → Importamos el CSS externo y React.
//    Todo archivo .jsx necesita React (aunque no lo uses explícitamente,
//    Vite lo maneja con el pragma JSX).
//
// 2. Componentes funcionales → Son funciones de JavaScript que devuelven JSX.
//    JSX es HTML dentro de JavaScript. Se devuelve con "return ( ... )".
//
// 3. "className" en lugar de "class" → En JSX no usamos "class" porque es
//    una palabra reservada de JS. Usamos "className".
//
// 4. Comentarios en JSX → Se escriben como {/* comentario */}
//
// 5. .map() → Sirve para recorrer arrays y generar elementos JSX.
//    Cada elemento necesita una prop "key" única para que React pueda
//    identificarlo eficientemente.
//
// 6. Fragmentos <> </> → Si necesitas devolver varios elementos sin un
//    contenedor extra en el DOM, usas un Fragment vacío.
// =============================================

import "../styles/Reportes.css";

// -------------------------------------------------------
// DATOS DE EJEMPLO (maqueta — sin backend)
// En una app real estos vendrían de una API con fetch/axios
// -------------------------------------------------------

// Métricas principales (KPIs)
const kpiData = [
  { icon: "⏱️", value: "1,284", label: "Horas registradas",  trend: "+8%",  dir: "up"   },
  { icon: "👥", value: "24",    label: "Empleados activos",  trend: "+2",   dir: "up"   },
  { icon: "✅", value: "98",    label: "Turnos aprobados",   trend: "+12%", dir: "up"   },
  { icon: "⚠️", value: "6",     label: "Turnos pendientes",  trend: "-3",   dir: "down" },
];

// Datos para el gráfico de barras (horas por día de la semana)
const barData = [
  { day: "Lun", height: 80  },
  { day: "Mar", height: 110 },
  { day: "Mié", height: 95  },
  { day: "Jue", height: 130 },
  { day: "Vie", height: 100 },
  { day: "Sáb", height: 45  },
  { day: "Dom", height: 20  },
];
// Altura máxima en px del gráfico de barras
const MAX_BAR_HEIGHT = 130;

// Leyenda del gráfico de dona (distribución de actividades)
const donutLegend = [
  { color: "#2c9c9c", label: "Producción",    percent: "45%" },
  { color: "#1f6f6f", label: "Administración", percent: "27%" },
  { color: "#a7d7d7", label: "Mantenimiento", percent: "16%" },
  { color: "rgba(167,215,215,0.3)", label: "Otros", percent: "12%" },
];

// Filas de la tabla de detalle
const tableData = [
  { empleado: "Ana García",    turno: "Mañana",   horas: "8h 00m", actividad: "Producción",     estado: "aprobado"  },
  { empleado: "Luis Martínez", turno: "Tarde",    horas: "7h 30m", actividad: "Administración", estado: "pendiente" },
  { empleado: "Carla Pérez",   turno: "Noche",    horas: "9h 15m", actividad: "Mantenimiento",  estado: "aprobado"  },
  { empleado: "Juan Rojas",    turno: "Mañana",   horas: "8h 00m", actividad: "Producción",     estado: "en-curso"  },
  { empleado: "Sofía Vargas",  turno: "Tarde",    horas: "6h 45m", actividad: "Administración", estado: "rechazado" },
  { empleado: "Miguel Torres", turno: "Mañana",   horas: "8h 00m", actividad: "Producción",     estado: "aprobado"  },
];

// Etiquetas legibles para los estados
const statusLabel = {
  aprobado:  "Aprobado",
  pendiente: "Pendiente",
  rechazado: "Rechazado",
  "en-curso":"En curso",
};

// -------------------------------------------------------
// COMPONENTE PRINCIPAL: Reportes
// -------------------------------------------------------
// Un componente funcional es simplemente una función que:
//   1. Recibe props (parámetros opcionales)
//   2. Retorna JSX (lo que se mostrará en pantalla)
// -------------------------------------------------------
function Reportes() {
  return (
    // El contenedor raíz tiene la clase CSS que creamos
    <div className="reportes-container">

      {/* ================================================
          SIDEBAR — Menú lateral de navegación
          Cada ítem es un <div> con clase "nav-item".
          El ítem activo lleva también la clase "active".
      ================================================ */}
      <aside className="sidebar">

        {/* Logo del sistema */}
        <div className="sidebar-logo">CHRONOS</div>
        <div className="sidebar-subtitle">Gestión de tiempos</div>

        {/* Sección principal del menú */}
        <span className="sidebar-section-label">Principal</span>

        <div className="nav-item">
          <span className="nav-icon">🏠</span> Inicio
        </div>
        <div className="nav-item">
          <span className="nav-icon">👥</span> Usuarios
        </div>
        <div className="nav-item">
          <span className="nav-icon">🕐</span> Turnos
        </div>
        <div className="nav-item">
          <span className="nav-icon">✅</span> Aprobaciones
        </div>
        <div className="nav-item">
          <span className="nav-icon">📋</span> Actividades
        </div>

        {/* Sección secundaria */}
        <span className="sidebar-section-label">Análisis</span>

        {/* "active" marca la página actual */}
        <div className="nav-item active">
          <span className="nav-icon">📊</span> Reportes
        </div>
        <div className="nav-item">
          <span className="nav-icon">🔔</span> Notificaciones
        </div>
        <div className="nav-item">
          <span className="nav-icon">🕵️</span> Auditoría
        </div>

        {/* Espaciador flexible empuja el perfil hacia abajo */}
        <div className="sidebar-spacer" />

        {/* Configuración y perfil al fondo */}
        <div className="nav-item">
          <span className="nav-icon">⚙️</span> Configuración
        </div>

        {/* Perfil del usuario logueado */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">A</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Admin</span>
            <span className="sidebar-user-role">Administrador</span>
          </div>
        </div>

      </aside>

      {/* ================================================
          CONTENIDO PRINCIPAL
      ================================================ */}
      <main className="reportes-main">

        {/* ---- ENCABEZADO DE PÁGINA ---- */}
        <header className="page-header">
          <div className="page-header-left">
            {/* h1 → título principal de la página (SEO y accesibilidad) */}
            <h1>📊 Reportes</h1>
            <p>Resumen de turnos, horas y actividades del periodo actual</p>
          </div>

          {/* Botón de exportación (maqueta, sin lógica) */}
          <button className="btn-export">
            ⬇️ Exportar PDF
          </button>
        </header>

        {/* ---- BARRA DE FILTROS ---- */}
        {/*
          Los <select> y <input> son controlados o no controlados en React.
          En maquetas se dejan sin estado (sin onChange) para simplificar.
          En una app real usarías useState() para guardar el valor seleccionado.
        */}
        <section className="filters-bar">

          <div className="filter-group">
            <label htmlFor="filtro-periodo">Período</label>
            {/* "htmlFor" es el equivalente JSX de "for" en HTML */}
            <select id="filtro-periodo" className="filter-select">
              <option>Esta semana</option>
              <option>Este mes</option>
              <option>Último trimestre</option>
              <option>Personalizado</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filtro-empleado">Empleado</label>
            <select id="filtro-empleado" className="filter-select">
              <option>Todos</option>
              <option>Ana García</option>
              <option>Luis Martínez</option>
              <option>Carla Pérez</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filtro-turno">Turno</label>
            <select id="filtro-turno" className="filter-select">
              <option>Todos</option>
              <option>Mañana</option>
              <option>Tarde</option>
              <option>Noche</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filtro-actividad">Actividad</label>
            <select id="filtro-actividad" className="filter-select">
              <option>Todas</option>
              <option>Producción</option>
              <option>Administración</option>
              <option>Mantenimiento</option>
            </select>
          </div>

          <button className="btn-filter">Aplicar filtros</button>

        </section>

        {/* ---- KPIs (métricas clave) ---- */}
        {/*
          .map() recorre el array kpiData y devuelve un elemento <div>
          por cada objeto. La prop "key" es obligatoria en listas:
          React la usa internamente para actualizar solo los elementos
          que cambiaron, no toda la lista.
        */}
        <section className="kpi-grid">
          {kpiData.map((kpi, index) => (
            <div className="kpi-card" key={index}>
              <span className="kpi-icon">{kpi.icon}</span>
              <span className="kpi-value">{kpi.value}</span>
              <span className="kpi-label">{kpi.label}</span>
              {/* Clase dinámica: "kpi-trend up" o "kpi-trend down" */}
              <span className={`kpi-trend ${kpi.dir}`}>
                {kpi.dir === "up" ? "▲" : "▼"} {kpi.trend} vs semana anterior
              </span>
            </div>
          ))}
        </section>

        {/* ---- GRÁFICOS ---- */}
        <section className="charts-grid">

          {/* Gráfico de barras — Horas trabajadas por día */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Horas trabajadas por día</h3>
              <span className="chart-badge">Esta semana</span>
            </div>

            {/*
              Simulamos barras con divs cuya altura en px se calcula
              proporcionalmente al valor máximo (MAX_BAR_HEIGHT).
              En una app real usarías una librería como Recharts o Chart.js.
            */}
            <div className="bar-chart">
              {barData.map((bar, index) => (
                <div className="bar-group" key={index}>
                  <div
                    className="bar"
                    style={{ height: `${bar.height}px` }}
                    title={`${bar.day}: ${bar.height}h`}
                  />
                  <span className="bar-label">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de dona — Distribución por actividad */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Distribución por actividad</h3>
              <span className="chart-badge">Mensual</span>
            </div>

            <div className="donut-wrapper">
              {/* Dona simulada con conic-gradient en CSS */}
              <div className="donut-chart">
                <div className="donut-center">
                  <span className="donut-center-value">320</span>
                  <span className="donut-center-label">horas</span>
                </div>
              </div>

              {/* Leyenda de colores */}
              <div className="donut-legend">
                {donutLegend.map((item, index) => (
                  <div className="legend-item" key={index}>
                    <span className="legend-dot" style={{ background: item.color }} />
                    <span>{item.label}</span>
                    <span className="legend-percent">{item.percent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>

        {/* ---- TABLA DE DETALLE ---- */}
        <section className="table-section">

          <div className="table-section-header">
            <h3>Detalle de turnos registrados</h3>
            <button className="btn-text">Ver todos →</button>
          </div>

          <table className="reports-table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Turno</th>
                <th>Horas</th>
                <th>Actividad</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {/*
                Recorremos tableData con .map() para generar cada fila <tr>.
                Usamos "index" como key (aceptable en maquetas;
                en producción prefiere un id único del objeto).
              */}
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.empleado}</td>
                  <td>{row.turno}</td>
                  <td>{row.horas}</td>
                  <td>{row.actividad}</td>
                  <td>
                    {/*
                      Clase dinámica: "status-badge aprobado",
                      "status-badge pendiente", etc.
                      Usamos template literals (backticks) para combinar
                      la clase base con la clase variable.
                    */}
                    <span className={`status-badge ${row.estado}`}>
                      <span className="status-dot" />
                      {statusLabel[row.estado]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </section>

      </main>
    </div>
  );
}

// Exportamos el componente para poder importarlo en AppRoutes.jsx
export default Reportes;
