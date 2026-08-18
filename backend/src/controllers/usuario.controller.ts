import { Request, Response } from "express";
import { crearUsuario } from "../services/usuario.service";

export const registrarUsuario = async (
  req: Request,
  res: Response
) => {
  try {
    const usuario = await crearUsuario(req.body);

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear el usuario"
    });
  }
};