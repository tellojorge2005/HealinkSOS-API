import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { UsuarioAuth } from "../entities/UsuarioAuth";
import { UsuarioPerfil } from "../entities/UsuarioPerfil";
import bcrypt from "bcrypt";

export const registrar = async (req: Request, res: Response) => {
    const { email, password, nombreCompleto, fechaNacimiento, tipoSangre, historialMedico, alergias } = req.body;

    // Iniciamos un "QueryRunner" para manejar la transacción (Todo o nada)
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // 1. Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Crear la entidad de Auth
        const nuevoUsuario = new UsuarioAuth();
        nuevoUsuario.email = email;
        nuevoUsuario.passwordHash = hashedPassword;

        // Guardamos el usuario (Oracle genera el ID automáticamente)
        const usuarioGuardado = await queryRunner.manager.save(nuevoUsuario);

        // 3. Crear la entidad de Perfil vinculada al usuario
        const nuevoPerfil = new UsuarioPerfil();
        nuevoPerfil.nombreCompleto = nombreCompleto;
        nuevoPerfil.fechaNacimiento = new Date(fechaNacimiento);
        nuevoPerfil.tipoSangre = tipoSangre;
        nuevoPerfil.historialMedico = historialMedico;
        nuevoPerfil.alergias = alergias;
        nuevoPerfil.usuario = usuarioGuardado; // ¡Aquí está el truco del OneToOne!

        await queryRunner.manager.save(nuevoPerfil);

        // 4. Si todo salió bien, confirmamos los cambios en Oracle
        await queryRunner.commitTransaction();

        res.status(201).json({ 
            message: "Usuario registrado con éxito en HeaLink SOS",
            userId: usuarioGuardado.id 
        });

    } catch (error: any) {
        // Si algo truena, deshacemos todo para no dejar basura
        await queryRunner.rollbackTransaction();
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error al registrar: " + error.message });
    } finally {
        // Liberamos la conexión al pool
        await queryRunner.release();
    }
};