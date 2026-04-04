import "../styles/dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">Chronos</h2>

        <nav>
          <ul>
            <li>Inicio</li>
            <li>Mis tareas</li>
            <li>Reportes</li>
            <li>Configuración</li>
          </ul>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">

        {/* HEADER */}
        <header className="header">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span>Usuario</span>
          </div>
        </header>

        {/* CARDS */}
        <section className="cards">

          <div className="card">
            <h3>Tareas pendientes</h3>
            <p>12</p>
          </div>

          <div className="card">
            <h3>En progreso</h3>
            <p>5</p>
          </div>

          <div className="card">
            <h3>Completadas</h3>
            <p>20</p>
          </div>

        </section>

        {/* TABLA SIMPLE */}
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
              <tr>
                <td>Diseño login</td>
                <td>Completado</td>
                <td>Hoy</td>
              </tr>
              <tr>
                <td>Crear dashboard</td>
                <td>En progreso</td>
                <td>Hoy</td>
              </tr>
            </tbody>
          </table>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;