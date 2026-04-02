import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { ContactoEmergencia } from "../entities/ContactoEmergencia";

export const agregarContacto = async (req: Request, res: Response) => {
    const { idUsuario, nombreContacto, telefono, prioridad } = req.body;
    try {
        const contactoRepo = AppDataSource.getRepository(ContactoEmergencia);
        const nuevoContacto = new ContactoEmergencia();
        nuevoContacto.idUsuario = idUsuario;
        nuevoContacto.nombreContacto = nombreContacto;
        nuevoContacto.telefono = telefono;
        nuevoContacto.prioridad = prioridad;

        await contactoRepo.save(nuevoContacto);
        res.status(201).json({ message: "Contacto registrado" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerContactosPorUsuario = async (req: Request, res: Response): Promise<any> => {
    const { idUsuario } = req.params;
    try {
        const repo = AppDataSource.getRepository(ContactoEmergencia);
        const contactos = await repo.find({
            where: { idUsuario: Number(idUsuario) }
        });
        res.json(contactos);
    } catch (error: any) {
        res.status(500).json({ message: "Error al obtener contactos" });
    }
};

export const eliminarContacto = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID no proporcionado" });

    try {
        const repo = AppDataSource.getRepository(ContactoEmergencia);
        // CORRECCIÓN: Convertimos el id a número
        await repo.delete(Number(id));
        res.status(200).json({ message: "Contacto eliminado" });
    } catch (error: any) {
        res.status(500).json({ message: "Error al eliminar contacto" });
    }
};