// =============================================
// Inicio.jsx — Página de inicio del usuario
// =============================================
// 📚 NUEVOS CONCEPTOS REACT EN ESTE ARCHIVO:
//
// ① useState con ARRAY de objetos
//    Hasta ahora usamos useState con booleanos (true/false).
//    Aquí usamos un array de objetos para la checklist.
//    Cada objeto tiene { id, titulo, completado, ... }.
//
// ② Actualizar un elemento de un array sin mutarlo
//    En React NUNCA debes modificar el estado directamente:
//      ❌  estado[0].completado = true   ← MAL, muta el original
//      ✅  setEstado([...nuevo array])   ← BIEN, crea uno nuevo
//    Usamos .map() para crear un nuevo array con el cambio.
//
// ③ Calcular valores derivados del estado
//    En lugar de guardar "cuántas tareas están completas"
//    en otro useState, lo calculamos con .filter().length.
//    Esto es más limpio y siempre está sincronizado.
//
// ④ Estado con objetos: { ... spread, propiedad: nuevoValor }
//    Cuando actualizas solo UNA propiedad de un objeto en el
//    estado, usas spread (...item) para copiar el resto y
//    solo cambias lo que necesitas.
// =============================================

import { useState } from "react";
import "../styles/Inicio.css";

// -------------------------------------------------------
// HELPERS: funciones de utilidad
// -------------------------------------------------------

// Devuelve el saludo correcto según la hora actual
function obtenerSaludo() {
  const hora = new Date().getHours(); // getHours() → número 0-23
  if (hora < 12) return "Buenos días";
  if (hora < 18) return "Buenas tardes";
  return "Buenas noches";
}

// Formatea la fecha actual en español: "Lunes 21 de abril, 2026"
function obtenerFechaFormateada() {
  return new Date().toLocaleDateString("es-CO", {
    weekday: "long",   // "lunes"
    day: "numeric",    // "21"
    month: "long",     // "abril"
    year: "numeric",   // "2026"
  });
}

// -------------------------------------------------------
// DATOS DE EJEMPLO (maqueta — sin backend)
// -------------------------------------------------------

// Actividades asignadas al usuario para hoy
// En producción vendrían de una API con useEffect + fetch
const actividadesHoy = [
  {
    id: 1,
    hora: "07:00",
    titulo: "Apertura de planta",
    descripcion: "Revisión de equipos e inicio de línea de producción A.",
    tipo: "Producción",
    estado: "completada",
  },
  {
    id: 2,
    hora: "09:30",
    titulo: "Control de calidad — lote #0421",
    descripcion: "Verificar estándares del lote matutino antes del despacho.",
    tipo: "Calidad",
    estado: "en-curso",
  },
  {
    id: 3,
    hora: "11:00",
    titulo: "Reunión de equipo semanal",
    descripcion: "Revisión de metas y ajuste de turnos para la próxima semana.",
    tipo: "Administrativa",
    estado: "pendiente",
  },
  {
    id: 4,
    hora: "14:00",
    titulo: "Mantenimiento preventivo — máquina 3",
    descripcion: "Lubricación y ajuste de correas según plan de mantenimiento.",
    tipo: "Mantenimiento",
    estado: "pendiente",
  },
  {
    id: 5,
    hora: "16:30",
    titulo: "Cierre de turno",
    descripcion: "Reporte de producción y entrega al turno de noche.",
    tipo: "Producción",
    estado: "pendiente",
  },
];

// Ítems iniciales de la lista de chequeo
// "completado: false" → el usuario aún no los ha marcado
const checklistInicial = [
  { id: 1, titulo: "Revisar correos del turno anterior",    sub: "Bandeja de entrada",          completado: true  },
  { id: 2, titulo: "Registrar inicio de turno en el sistema", sub: "CHRONOS → Turnos",           completado: true  },
  { id: 3, titulo: "Verificar EPP del personal",            sub: "Lista de seguridad",          completado: false },
  { id: 4, titulo: "Confirmar asistencia del equipo",       sub: "5 personas asignadas",        completado: false },
  { id: 5, titulo: "Completar control de calidad AM",       sub: "Formato F-QA-021",            completado: false },
  { id: 6, titulo: "Enviar reporte de producción",          sub: "Antes de las 5:00 PM",        completado: false },
];

// Etiquetas legibles para los estados de las actividades
const estadoLabel = {
  completada: "Completada",
  "en-curso":  "En curso",
  pendiente:   "Pendiente",
};

// -------------------------------------------------------
// COMPONENTE PRINCIPAL: Inicio
// -------------------------------------------------------
function Inicio() {

  // ① ESTADO: array de objetos del checklist
  //    useState recibe el array inicial como valor por defecto.
  //    "checklist" es el array actual.
  //    "setChecklist" es la función para actualizarlo.
  const [checklist, setChecklist] = useState(checklistInicial);

  // -------------------------------------------------------
  // ② FUNCIÓN: alternar el estado de un ítem del checklist
  //    Recibe el "id" del ítem que se hizo clic.
  // -------------------------------------------------------
  const toggleCheck = (id) => {
    // .map() recorre CADA ítem del array y devuelve uno nuevo:
    // - Si el id coincide → invierte el valor de "completado"
    // - Si no coincide   → devuelve el ítem sin cambios
    //
    // { ...item } → "spread": copia TODAS las propiedades del objeto.
    // completado: !item.completado → solo sobreescribe ESA propiedad.
    const nuevoChecklist = checklist.map((item) =>
      item.id === id
        ? { ...item, completado: !item.completado } // ítem modificado
        : item                                       // ítem sin cambios
    );

    // Guardamos el NUEVO array (no mutamos el original)
    setChecklist(nuevoChecklist);
  };

  // ③ VALORES DERIVADOS: se calculan a partir del estado,
  //    no necesitan su propio useState.
  const totalCheck     = checklist.length;
  const completosCheck = checklist.filter((item) => item.completado).length;
  // Math.round para evitar decimales largos (ej: 33.333...)
  const porcentaje     = Math.round((completosCheck / totalCheck) * 100);

  // KPIs calculados a partir de las actividades
  const totalHoy       = actividadesHoy.length;
  const completadasHoy = actividadesHoy.filter((a) => a.estado === "completada").length;
  const enCursoHoy     = actividadesHoy.filter((a) => a.estado === "en-curso").length;

  // -------------------------------------------------------
  // JSX — Lo que se renderiza en pantalla
  // -------------------------------------------------------
  return (
    <div className="inicio-container">

      {/* ================================================
          SIDEBAR
      ================================================ */}
      <aside className="sidebar">

        <div className="sidebar-logo">CHRONOS</div>
        <div className="sidebar-subtitle">Gestión de tiempos</div>

        <span className="sidebar-section-label">Principal</span>

        {/* "active" → marca la página actual */}
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

        <div className="sidebar-spacer" />

        <div className="nav-item">
          <span className="nav-icon">⚙️</span> Configuración
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">M</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">María López</span>
            <span className="sidebar-user-role">Operaria</span>
          </div>
        </div>

      </aside>

      {/* ================================================
          CONTENIDO PRINCIPAL
      ================================================ */}
      <main className="inicio-main">

        {/* ---- BANNER DE BIENVENIDA ---- */}
        <div className="welcome-banner">
          <div className="welcome-text">
            {/* obtenerSaludo() se llama al renderizar el componente */}
            <h1>
              {obtenerSaludo()},{" "}
              <span>María</span> 👋
            </h1>
            {/* Capitalize la primera letra de la fecha */}
            <p>
              {obtenerFechaFormateada().charAt(0).toUpperCase()
               + obtenerFechaFormateada().slice(1)}
            </p>
          </div>

          {/* Turno activo del usuario */}
          <div className="turno-badge">
            <span className="turno-badge-label">Turno activo</span>
            <span className="turno-badge-value">
              ☀️ Mañana — 07:00 a 15:00
            </span>
            <span className="turno-horas">Llevas 4h 32m trabajadas</span>
          </div>
        </div>

        {/* ---- KPIs DEL DÍA ----
            Usamos los valores derivados calculados arriba.
            No se necesita estado extra porque son cálculos
            directos sobre actividadesHoy (datos estáticos).
        ---- */}
        <div className="kpi-row">
          <div className="kpi-mini">
            <span className="kpi-mini-icon">📋</span>
            <div className="kpi-mini-info">
              <span className="kpi-mini-value">{totalHoy}</span>
              <span className="kpi-mini-label">Actividades hoy</span>
            </div>
          </div>

          <div className="kpi-mini">
            <span className="kpi-mini-icon">✅</span>
            <div className="kpi-mini-info">
              <span className="kpi-mini-value">{completadasHoy}</span>
              <span className="kpi-mini-label">Completadas</span>
            </div>
          </div>

          <div className="kpi-mini">
            <span className="kpi-mini-icon">⚡</span>
            <div className="kpi-mini-info">
              <span className="kpi-mini-value">{enCursoHoy}</span>
              <span className="kpi-mini-label">En curso</span>
            </div>
          </div>

          <div className="kpi-mini">
            <span className="kpi-mini-icon">🎯</span>
            <div className="kpi-mini-info">
              <span className="kpi-mini-value">{porcentaje}%</span>
              <span className="kpi-mini-label">Checklist completo</span>
            </div>
          </div>
        </div>

        {/* ---- GRID PRINCIPAL ---- */}
        <div className="content-grid">

          {/* ============================================
              COLUMNA IZQUIERDA: Actividades del día
          ============================================ */}
          <div className="panel">

            <div className="panel-header">
              <h2>📅 Actividades asignadas hoy</h2>
              <span className="panel-badge">
                {completadasHoy}/{totalHoy} completadas
              </span>
            </div>

            {/* Lista de actividades generada con .map() */}
            {actividadesHoy.map((actividad, index) => (
              <div className="actividad-card" key={actividad.id}>

                {/* Línea de tiempo visual */}
                <div className="actividad-tiempo">
                  <span className="actividad-hora">{actividad.hora}</span>
                  <div className="actividad-dot" />
                  {/* La línea vertical solo aparece si no es el último elemento */}
                  {index < actividadesHoy.length - 1 && (
                    <div className="actividad-line" />
                  )}
                </div>

                {/* Información de la actividad */}
                <div className="actividad-info">
                  <span className="actividad-titulo">{actividad.titulo}</span>
                  <span className="actividad-desc">{actividad.descripcion}</span>

                  <div className="actividad-footer">
                    <span className="actividad-tipo">{actividad.tipo}</span>
                    {/*
                      Clase dinámica: "status-badge completada",
                      "status-badge en-curso", "status-badge pendiente"
                    */}
                    <span className={`status-badge ${actividad.estado}`}>
                      <span className="status-dot" />
                      {estadoLabel[actividad.estado]}
                    </span>
                  </div>
                </div>

              </div>
            ))}

          </div>

          {/* ============================================
              COLUMNA DERECHA: Lista de chequeo
          ============================================ */}
          <div className="panel">

            <div className="panel-header">
              <h2>☑️ Lista de chequeo</h2>
              <span className="panel-badge">
                {completosCheck}/{totalCheck}
              </span>
            </div>

            {/* BARRA DE PROGRESO
                El width se pasa como style inline porque es un
                valor dinámico (cambia con cada clic).
                Los valores fijos van en CSS; los dinámicos en style.
            */}
            <div className="progreso-wrapper">
              <div className="progreso-texto">
                <span>Progreso del turno</span>
                <span>{porcentaje}%</span>
              </div>
              <div className="progreso-bar-bg">
                <div
                  className="progreso-bar-fill"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>

            {/* CHECKLIST INTERACTIVO
                Cada ítem llama a toggleCheck(item.id) al hacer clic.
                La clase condicional "checked" activa los estilos
                de tachado y fondo verde del CSS.
            */}
            <div className="checklist">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  // Si item.completado es true → agrega clase "checked"
                  // Si es false → solo tiene clase "check-item"
                  className={`check-item ${item.completado ? "checked" : ""}`}
                  // Al hacer clic → toggleCheck cambia el estado
                  onClick={() => toggleCheck(item.id)}
                >

                  {/* Caja del checkbox personalizado */}
                  <div className="checkbox-box">
                    {/* La palomita solo aparece cuando está completado */}
                    {item.completado && (
                      <span className="checkbox-check">✓</span>
                    )}
                  </div>

                  {/* Texto del ítem */}
                  <div className="check-label">
                    <span className="check-title">{item.titulo}</span>
                    <span className="check-sub">{item.sub}</span>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Inicio;
