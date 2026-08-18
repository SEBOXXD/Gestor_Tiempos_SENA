import express from "express";
import cors from "cors";
import { db } from "./config/database";
import usuarioRoutes from "./routes/usuario.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/usuarios", usuarioRoutes);

app.get("/", (_req, res) => {
  res.json({
    mensaje: "Gestor_Tiempos_SENA API funcionando"
  });
});

const PORT = Number(process.env.PORT) || 3000;

db.getConnection()
  .then((connection) => {
    console.log("✅ Conexión exitosa con MySQL en Railway");
    connection.release();
  })
  .catch((error) => {
    console.error("❌ Error conectando con MySQL:", error.message);
  });

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});