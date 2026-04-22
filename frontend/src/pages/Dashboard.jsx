// =============================================
// Dashboard.jsx — Pantalla principal del sistema
// =============================================
// 📚 CONCEPTOS REACT EN ESTE ARCHIVO:
//
// • Componente funcional puro (sin estado por ahora):
//   No usa useState porque todos los datos son estáticos
//   (maqueta). Cuando conectes el backend, agregarás
//   useState + useEffect para cargar datos reales.
//
// • JSX semántico: usamos <aside>, <main>, <header>,
//   <section>, <nav> en lugar de <div> genéricos.
//   Esto mejora la accesibilidad y el SEO.
//
// • .map() en listas: para generar tarjetas y filas
//   de tabla a partir de arrays de datos.
// =============================================

import "../styles/Dashboard.css";

// -------------------------------------------------------
// DATOS DE EJEMPLO (maqueta)
// En producción estos vendrían de una API vía useEffect.
// -------------------------------------------------------

// Cards de métricas en la parte superior
const kpiCards = [
  { icon: "⏱️", label: "Horas esta semana", value: "42" },
  { icon: "✅", label: "Turnos completados", value: "8"  },
  { icon: "📋", label: "Actividades activas", value: "5" },
  { icon: "🔔", label: "Notificaciones",      value: "3" },
];

// Filas de la tabla de actividades recientes
const actividadesRecientes = [
  { tarea: "Diseño pantalla Login",    estado: "Completado", fecha: "Hoy"      },
  { tarea: "Crear Dashboard base",     estado: "En progreso", fecha: "Hoy"     },
  { tarea: "Módulo de Reportes",       estado: "Completado", fecha: "Ayer"     },
  { tarea: "Aprobación de turnos",     estado: "Pendiente",  fecha: "Mañana"   },
  { tarea: "Configuración del sistema",estado: "Pendiente",  fecha: "Esta sem."},
];

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------
function Dashboard() {
  return (
    <div className="dashboard-container">

      {/* ================================================
          SIDEBAR — Menú de navegación lateral
          <aside> es el elemento semántico correcto para
          contenido secundario (menú, widgets, etc.)
      ================================================ */}
      <aside className="sidebar">

        <div className="sidebar-logo">CHRONOS</div>
        <div className="sidebar-subtitle">Gestión de tiempos</div>

        {/* Sección de navegación principal */}
        <span className="sidebar-section-label">Principal</span>

        {/* Ítem activo: tiene la clase "active" para resaltarse */}
        <div className="nav-item active">
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

        {/* Sección de análisis */}
        <span className="sidebar-section-label">Análisis</span>

        <div className="nav-item">
          <span className="nav-icon">📊</span> Reportes
        </div>
        <div className="nav-item">
          <span className="nav-icon">🔔</span> Notificaciones
        </div>
        <div className="nav-item">
          <span className="nav-icon">🕵️</span> Auditoría
        </div>

        {/* Empuja configuración y perfil al fondo */}
        <div className="sidebar-spacer" />

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
          <main> → área principal de contenido de la página
      ================================================ */}
      <main className="main-content">

        {/* ---- ENCABEZADO ---- */}
        <header className="header">
          <h1>Dashboard</h1>
          <div className="user-info">
            🌟 Bienvenido, Admin
          </div>
        </header>

        {/* ---- CARDS KPI ----
            .map() recorre el array kpiCards y devuelve un
            componente <div class="card"> por cada elemento.
            "key" es obligatoria en listas → React la usa
            internamente para optimizar re-renders.
        ---- */}
        <section className="cards">
          {kpiCards.map((card, index) => (
            <div className="card" key={index}>
              {/* Icono grande encima del valor */}
              <span style={{ fontSize: "24px" }}>{card.icon}</span>
              <p>{card.value}</p>
              <h3>{card.label}</h3>
            </div>
          ))}
        </section>

        {/* ---- TABLA DE ACTIVIDADES RECIENTES ---- */}
        <section className="table-section">
          <h2>Actividades recientes</h2>

          <table>
            <thead>
              <tr>
                <th>Tarea</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody>
              {/*
                Igual que con las cards: .map() genera una <tr>
                por cada actividad del array.
              */}
              {actividadesRecientes.map((act, index) => (
                <tr key={index}>
                  <td>{act.tarea}</td>
                  <td>{act.estado}</td>
                  <td>{act.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;