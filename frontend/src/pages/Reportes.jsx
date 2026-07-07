import "../styles/Reportes.css"
import Sidebar from "../components/Sidebar"

const kpiData = [
  { icon: "⏱️", value: "1,284", label: "Horas registradas",  trend: "+8%",  dir: "up"   },
  { icon: "👥", value: "24",    label: "Empleados activos",  trend: "+2",   dir: "up"   },
  { icon: "✅", value: "98",    label: "Turnos aprobados",   trend: "+12%", dir: "up"   },
  { icon: "⚠️", value: "6",     label: "Turnos pendientes",  trend: "-3",   dir: "down" },
]

const barData = [
  { day: "Lun", height: 80  },
  { day: "Mar", height: 110 },
  { day: "Mié", height: 95  },
  { day: "Jue", height: 130 },
  { day: "Vie", height: 100 },
  { day: "Sáb", height: 45  },
  { day: "Dom", height: 20  },
]

const donutLegend = [
  { color: "#2c9c9c", label: "Producción",    percent: "45%" },
  { color: "#1f6f6f", label: "Administración", percent: "27%" },
  { color: "#a7d7d7", label: "Mantenimiento", percent: "16%" },
  { color: "rgba(167,215,215,0.3)", label: "Otros", percent: "12%" },
]

const tableData = [
  { empleado: "Ana García",    turno: "Mañana",   horas: "8h 00m", actividad: "Producción",     estado: "aprobado"  },
  { empleado: "Luis Martínez", turno: "Tarde",    horas: "7h 30m", actividad: "Administración", estado: "pendiente" },
  { empleado: "Carla Pérez",   turno: "Noche",    horas: "9h 15m", actividad: "Mantenimiento",  estado: "aprobado"  },
  { empleado: "Juan Rojas",    turno: "Mañana",   horas: "8h 00m", actividad: "Producción",     estado: "en-curso"  },
  { empleado: "Sofía Vargas",  turno: "Tarde",    horas: "6h 45m", actividad: "Administración", estado: "rechazado" },
  { empleado: "Miguel Torres", turno: "Mañana",   horas: "8h 00m", actividad: "Producción",     estado: "aprobado"  },
]

const statusLabel = {
  aprobado:  "Aprobado",
  pendiente: "Pendiente",
  rechazado: "Rechazado",
  "en-curso":"En curso",
}

function Reportes() {
  return (
    <div className="reportes-container">
      <Sidebar userName="Admin" userRole="Administrador" userInitial="A" />
      <main className="reportes-main">
        <header className="page-header">
          <div className="page-header-left">
            <h1>📊 Reportes</h1>
            <p>Resumen de turnos, horas y actividades del periodo actual</p>
          </div>
          <button className="btn-export">⬇️ Exportar PDF</button>
        </header>

        <section className="filters-bar">
          <div className="filter-group">
            <label htmlFor="filtro-periodo">Período</label>
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

        <section className="kpi-grid">
          {kpiData.map((kpi, index) => (
            <div className="kpi-card" key={index}>
              <span className="kpi-icon">{kpi.icon}</span>
              <span className="kpi-value">{kpi.value}</span>
              <span className="kpi-label">{kpi.label}</span>
              <span className={`kpi-trend ${kpi.dir}`}>
                {kpi.dir === "up" ? "▲" : "▼"} {kpi.trend} vs semana anterior
              </span>
            </div>
          ))}
        </section>

        <section className="charts-grid">
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Horas trabajadas por día</h3>
              <span className="chart-badge">Esta semana</span>
            </div>
            <div className="bar-chart">
              {barData.map((bar, index) => (
                <div className="bar-group" key={index}>
                  <div className="bar" style={{ height: `${bar.height}px` }} title={`${bar.day}: ${bar.height}h`} />
                  <span className="bar-label">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Distribución por actividad</h3>
              <span className="chart-badge">Mensual</span>
            </div>
            <div className="donut-wrapper">
              <div className="donut-chart">
                <div className="donut-center">
                  <span className="donut-center-value">320</span>
                  <span className="donut-center-label">horas</span>
                </div>
              </div>
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
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.empleado}</td>
                  <td>{row.turno}</td>
                  <td>{row.horas}</td>
                  <td>{row.actividad}</td>
                  <td>
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
  )
}

export default Reportes
