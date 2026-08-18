import bcrypt from "bcrypt";
import { db } from "../config/database";

interface CrearUsuario {
  nombre: string;
  correo: string;
  contrasena: string;
  id_rol: number;
  id_sede: number;
}

export const crearUsuario = async (datos: CrearUsuario) => {
  const contrasenaHash = await bcrypt.hash(datos.contrasena, 10);

  const [resultado] = await db.execute(
    `INSERT INTO usuario 
    (nombre, correo, contrasena, estado_usuario, id_rol, id_sede)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      datos.nombre,
      datos.correo,
      contrasenaHash,
      true,
      datos.id_rol,
      datos.id_sede
    ]
  );

  return resultado;
};