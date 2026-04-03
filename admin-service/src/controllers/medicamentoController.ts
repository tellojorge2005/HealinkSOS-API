import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { MedicamentoInfo } from "../entities/MedicamentoInfo";
import { MedicamentoHorario } from "../entities/MedicamentoHorario";

export const agregarMedicamento = async (req: Request, res: Response) => {
    const { idUsuario, nombreFarmaco, dosis, horarios } = req.body;
    try {
        const medRepo = AppDataSource.getRepository(MedicamentoInfo);
        const nuevoMed = new MedicamentoInfo();
        nuevoMed.idUsuario = idUsuario;
        nuevoMed.nombreFarmaco = nombreFarmaco;
        nuevoMed.dosis = dosis;

        if (horarios && horarios.length > 0) {
            nuevoMed.horarios = horarios.map((h: any) => {
                const horario = new MedicamentoHorario();
                horario.horaInicio = h.horaInicio;
                horario.frecuenciaHoras = h.frecuenciaHoras;
                return horario;
            });
        }

        await medRepo.save(nuevoMed);
        res.status(201).json({ message: "Medicamento registrado con éxito" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerMedicamentosPorUsuario = async (req: Request, res: Response): Promise<any> => {
    const { idUsuario } = req.params;
    try {
        const repo = AppDataSource.getRepository(MedicamentoInfo);
        const medicamentos = await repo.find({
            where: { idUsuario: Number(idUsuario) },
            relations: ["horarios"]
        });
        res.json(medicamentos);
    } catch (error: any) {
        res.status(500).json({ message: "Error al obtener medicamentos" });
    }
};

export const eliminarMedicamento = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID no proporcionado" });

    try {
        const repo = AppDataSource.getRepository(MedicamentoInfo);
        // Convertimos el id a número para que TypeScript no chille
        await repo.delete(Number(id)); 
        res.status(200).json({ message: "Medicamento eliminado" });
    } catch (error: any) {
        res.status(500).json({ message: "Error al eliminar" });
    }
};