import { Router } from "express";
import { recibirTelemetria } from "../controllers/sosController";

const router = Router();

router.post("/telemetria", recibirTelemetria);

export default router;