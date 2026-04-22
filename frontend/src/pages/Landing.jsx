// =============================================
// Landing.jsx — Página de presentación pública de CHRONOS
// =============================================
// 📚 CONCEPTOS REACT EN ESTE ARCHIVO:
//
// ① Componente sin estado (stateless)
//    Esta página es completamente estática en términos
//    de React. No necesita useState porque su contenido
//    no cambia con interacciones del usuario.
//    Las animaciones son puras CSS (no JS).
//
// ② Datos como constantes fuera del componente
//    Los arrays de features y stats se definen FUERA
//    del componente function Landing() { }.
//    ¿Por qué? Porque si estuvieran DENTRO, React los
//    recrearía en cada re-render (ineficiente).
//    Las constantes que no dependen del estado van fuera.
//
// ③ animation-delay con style inline
//    Para escalonar la aparición de las tarjetas usamos
//    style={{ animationDelay: `${index * 0.1}s` }}.
//    Esto genera delays de 0s, 0.1s, 0.2s, etc.
// =============================================

import "../styles/Landing.css";

// -------------------------------------------------------
// DATOS ESTÁTICOS — se definen FUERA del componente
// para no recrearlos en cada render
// -------------------------------------------------------

// Métricas de la sección stats
const stats = [
  { number: "+500",  label: "Microempresas confían en nosotros" },
  { number: "98%",   label: "Tasa de satisfacción del cliente"  },
  { number: "3.2M",  label: "Horas gestionadas este año"        },
];

// Features del producto para la sección de características
const features = [
  {
    icon: "⏱️",
    title: "Control de turnos en tiempo real",
    desc:  "Registra, aprueba y monitorea los turnos de tu equipo desde un solo lugar, sin hojas de cálculo ni papel.",
  },
  {
    icon: "📋",
    title: "Gestión de actividades",
    desc:  "Asigna tareas diarias a cada empleado y sigue el progreso con checklists visuales e intuitivos.",
  },
  {
    icon: "📊",
    title: "Reportes automáticos",
    desc:  "Genera informes de productividad, horas trabajadas y asistencia en segundos, listos para exportar.",
  },
  {
    icon: "🔔",
    title: "Notificaciones inteligentes",
    desc:  "Alertas automáticas para aprobaciones pendientes, turnos próximos y actividades sin completar.",
  },
  {
    icon: "🔐",
    title: "Roles y permisos",
    desc:  "Define quién puede ver qué. Administradores, supervisores y operarios con acceso personalizado.",
  },
  {
    icon: "🕵️",
    title: "Auditoría completa",
    desc:  "Historial detallado de cada acción realizada en el sistema. Transparencia total en tu organización.",
  },
];

// -------------------------------------------------------
// COMPONENTE PRINCIPAL: Landing
// -------------------------------------------------------
function Landing() {
  return (
    <div className="landing-page">

      {/* ================================================
          NAVBAR — Barra de navegación fija en la parte superior.
          position: fixed en CSS → siempre visible al hacer scroll.
      ================================================ */}
      <nav className="landing-nav">

        {/* Logo */}
        <span className="nav-logo">CHRONOS</span>

        {/* Links centrales */}
        <div className="nav-links">
          <span className="nav-link">Características</span>
          <span className="nav-link">Precios</span>
          <span className="nav-link">Soporte</span>
        </div>

        {/* Botón de acceso */}
        <button className="nav-cta">Iniciar sesión →</button>

      </nav>

      {/* ================================================
          HERO — Sección principal de impacto.
          Usa clamp() en CSS para que el título sea
          fluido según el ancho de pantalla.
      ================================================ */}
      <section className="hero-section">

        {/* Esferas decorativas de glow (solo CSS, no interactivas) */}
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />

        <div className="hero-content">

          {/* Chip / badge de estado */}
          <div className="hero-chip">
            <span className="chip-dot" />
            Plataforma activa — v2.0 disponible
          </div>

          {/* Título principal
              clamp(38px, 6vw, 72px) → mínimo 38px,
              ideal 6% del ancho, máximo 72px
          */}
          <h1 className="hero-title">
            Gestión de tiempos{" "}
            <span className="highlight">sin fricción</span>
          </h1>

          {/* Descripción breve */}
          <p className="hero-subtitle">
            CHRONOS centraliza turnos, actividades y reportes de tu microempresa
            en una sola plataforma. Simple, potente y accesible desde cualquier dispositivo.
          </p>

          {/* Botones de acción */}
          <div className="hero-actions">
            <button className="btn-primary">Comenzar gratis →</button>
            <button className="btn-ghost">Ver demostración</button>
          </div>

        </div>

        {/* Línea divisoria sutil al pie del hero */}
        <div className="hero-divider" />

      </section>

      {/* ================================================
          STATS — Métricas de impacto.
          Generadas con .map() a partir del array stats.
      ================================================ */}
      <section className="stats-section">
        {stats.map((stat, index) => (
          <div className="stat-item" key={index}>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ================================================
          FEATURES — Características del producto.
          Grid de 3 columnas (responsive con auto-fit).
      ================================================ */}
      <section className="features-section">

        {/* Encabezado de sección */}
        <p className="section-label">¿Por qué CHRONOS?</p>
        <h2 className="section-title">Todo lo que tu equipo necesita</h2>
        <p className="section-subtitle">
          Diseñado para microempresas que quieren controlar su tiempo
          sin complicaciones tecnológicas.
        </p>

        {/* Grid de tarjetas
            animation-delay escalonado:
            index 0 → 0s, index 1 → 0.1s, index 2 → 0.2s, etc.
            Esto crea el efecto de que las tarjetas aparecen
            una por una, en vez de todas al mismo tiempo.
        */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              className="feature-card"
              key={index}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Ícono dentro de una caja con fondo sutil */}
              <div className="feature-icon-wrap">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>

      </section>

      {/* ================================================
          CTA FINAL — Llamado a la acción al pie de página.
      ================================================ */}
      <section className="cta-section">

        <h2 className="cta-title">
          Empieza a gestionar mejor{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent), var(--light))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            hoy mismo
          </span>
        </h2>

        <p className="cta-subtitle">
          Sin tarjeta de crédito. Sin configuración compleja. Solo ingresa y empieza.
        </p>

        <div className="cta-actions">
          <button className="btn-primary">Crear cuenta gratuita →</button>
          <button className="btn-ghost">Contactar ventas</button>
        </div>

      </section>

      {/* ================================================
          FOOTER — Minimalista.
      ================================================ */}
      <footer className="landing-footer">

        <span className="footer-logo">CHRONOS</span>

        <span className="footer-copy">
          © 2026 CHRONOS · Proyecto SENA
        </span>

        <div className="footer-links">
          <span className="footer-link">Términos</span>
          <span className="footer-link">Privacidad</span>
          <span className="footer-link">Soporte</span>
        </div>

      </footer>

    </div>
  );
}

export default Landing;
