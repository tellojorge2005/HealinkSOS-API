import { Router } from "express";
import { registrar, login } from "../controllers/authController";

const router = Router();

// Endpoint para creación de cuentas: POST /auth/registrar
router.post("/registrar", registrar);

// Endpoint para inicio de sesión: POST /auth/login
router.post("/login", login);

export default router;