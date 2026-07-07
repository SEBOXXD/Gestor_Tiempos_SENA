import "../styles/Card.css"

function Card({ icon, value, label, trend, trendDir, className = "" }) {
  return (
    <div className={`card ${className}`}>
      {icon && <span className="card-icon">{icon}</span>}
      {value && <p className="card-value">{value}</p>}
      {label && <h3 className="card-label">{label}</h3>}
      {trend && (
        <span className={`card-trend ${trendDir === "up" ? "trend-up" : "trend-down"}`}>
          {trendDir === "up" ? "▲" : "▼"} {trend}
        </span>
      )}
    </div>
  )
}

export default Card
