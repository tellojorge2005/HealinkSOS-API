import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { UsuarioAuth } from "../entities/UsuarioAuth";
import { UsuarioPerfil } from "../entities/UsuarioPerfil";
import bcrypt from "bcrypt";

/**
 * Registra un nuevo usuario y su perfil médico en la base de datos.
 */
export const registrar = async (req: Request, res: Response) => {
    const { email, password, nombreCompleto, fechaNacimiento, tipoSangre, historialMedico, alergias } = req.body;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevoUsuario = new UsuarioAuth();
        nuevoUsuario.email = email;
        nuevoUsuario.passwordHash = hashedPassword;

        const usuarioGuardado = await queryRunner.manager.save(nuevoUsuario);

        const nuevoPerfil = new UsuarioPerfil();
        nuevoPerfil.nombreCompleto = nombreCompleto;
        
        // Creación de la fecha en formato local para evitar desfases de zona horaria
        const [year, month, day] = fechaNacimiento.split('-');
        nuevoPerfil.fechaNacimiento = new Date(Number(year), Number(month) - 1, Number(day));
        
        nuevoPerfil.tipoSangre = tipoSangre;
        nuevoPerfil.historialMedico = historialMedico;
        nuevoPerfil.alergias = alergias;
        nuevoPerfil.usuario = usuarioGuardado; 

        await queryRunner.manager.save(nuevoPerfil);

        await queryRunner.commitTransaction();

        res.status(201).json({ 
            message: "Usuario registrado con éxito en HeaLink SOS",
            userId: usuarioGuardado.id 
        });

    } catch (error: any) {
        await queryRunner.rollbackTransaction();
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error al registrar: " + error.message });
    } finally {
        await queryRunner.release();
    }
};

/**
 * Autentica a un usuario validando sus credenciales.
 */
export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
        const usuarioRepo = AppDataSource.getRepository(UsuarioAuth);

        // 1. Verificar si el usuario existe en la base de datos
        const usuario = await usuarioRepo.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // 2. Comparar la contraseña ingresada con el hash almacenado
        const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
        if (!passwordValida) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // 3. Respuesta exitosa enviando el ID (requerido por el frontend en Android)
        res.status(200).json({ 
            message: "Inicio de sesión exitoso",
            id: usuario.id 
        });

    } catch (error: any) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};