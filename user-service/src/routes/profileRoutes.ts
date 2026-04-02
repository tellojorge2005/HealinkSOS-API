import { Router } from "express";
import { 
    obtenerPerfil, 
    actualizarPerfil, 
    eliminarCuentaCompleta 
} from "../controllers/profileController";

const router = Router();

// Le agregamos el "/perfil" a todas para que hagan match con Android
router.get("/perfil/:idUsuario", obtenerPerfil);
router.put("/perfil/:idUsuario", actualizarPerfil);
router.delete("/perfil/:idUsuario", eliminarCuentaCompleta);

export default router;