import { Router } from "express";
import { registrar } from "../controllers/authController";

const router = Router();

// Endpoint: POST /auth/registrar
router.post("/registrar", registrar);

export default router;