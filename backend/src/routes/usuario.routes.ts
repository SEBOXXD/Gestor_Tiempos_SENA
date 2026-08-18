import { Router } from "express";
import { registrarUsuario } from "../controllers/usuario.controller";

const router = Router();

router.post("/", registrarUsuario);

export default router;