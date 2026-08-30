import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'   // ← Reset global + variables CSS de CHRONOS
import './styles/Background.css'  // ← Fondo animado con partículas (canvas fijo)
import App from "./App.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
