import { Router } from "express";
import { 
    agregarMedicamento, 
    obtenerMedicamentosPorUsuario, 
    eliminarMedicamento 
} from "../controllers/medicamentoController";
import { 
    agregarContacto, 
    obtenerContactosPorUsuario, 
    eliminarContacto 
} from "../controllers/contactoController";

const router = Router();

// --- MEDICAMENTOS ---
router.post("/medicamento", agregarMedicamento);
router.get("/medicamento/usuario/:idUsuario", obtenerMedicamentosPorUsuario);
router.delete("/medicamento/:id", eliminarMedicamento);

// --- CONTACTOS ---
router.post("/contacto", agregarContacto);
router.get("/contacto/usuario/:idUsuario", obtenerContactosPorUsuario);
router.delete("/contacto/:id", eliminarContacto);

export default router;