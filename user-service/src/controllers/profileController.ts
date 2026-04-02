import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { UsuarioPerfil } from "../entities/UsuarioPerfil";
import { UsuarioAuth } from "../entities/UsuarioAuth";

export const obtenerPerfil = async (req: Request, res: Response): Promise<any> => {
    const { idUsuario } = req.params;
    try {
        const repo = AppDataSource.getRepository(UsuarioPerfil);
        const perfil = await repo.findOne({
            where: { idUsuario: Number(idUsuario) }
        });
        res.json(perfil);
    } catch (error: any) {
        res.status(500).json({ message: "Error al obtener perfil" });
    }
};

export const actualizarPerfil = async (req: Request, res: Response): Promise<any> => {
    const { idUsuario } = req.params;
    const { fechaNacimiento, tipoSangre, alergias, historialMedico } = req.body;

    try {
        const repo = AppDataSource.getRepository(UsuarioPerfil);
        const perfil = await repo.findOne({ where: { idUsuario: Number(idUsuario) } });

        if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });

        perfil.fechaNacimiento = fechaNacimiento || perfil.fechaNacimiento;
        perfil.tipoSangre = tipoSangre || perfil.tipoSangre;
        perfil.alergias = alergias || perfil.alergias;
        perfil.historialMedico = historialMedico || perfil.historialMedico;

        await repo.save(perfil);
        res.status(200).json({ message: "Perfil actualizado correctamente" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const eliminarCuentaCompleta = async (req: Request, res: Response): Promise<any> => {
    const { idUsuario } = req.params;
    if (!idUsuario) return res.status(400).json({ message: "ID no proporcionado" });

    try {
        const authRepo = AppDataSource.getRepository(UsuarioAuth);
        await authRepo.delete(Number(idUsuario));
        res.status(200).json({ message: "Cuenta eliminada" });
    } catch (error: any) {
        res.status(500).json({ message: "Error al eliminar cuenta" });
    }
};