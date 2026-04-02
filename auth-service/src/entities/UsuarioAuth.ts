import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from "typeorm";
import { UsuarioPerfil } from "./UsuarioPerfil";

@Entity("USUARIOS_AUTH", { schema: "HEALINK_USUARIO" })
export class UsuarioAuth {
    @PrimaryGeneratedColumn({ name: "ID_USUARIO" })
    id: number;

    @Column({ name: "EMAIL", type: "varchar2", length: 100, unique: true })
    email: string;

    @Column({ name: "HASH_PASSWORD", type: "varchar2", length: 255 })
    passwordHash: string;

    @CreateDateColumn({ name: "FECHA_REGISTRO" })
    fechaRegistro: Date;

    // Relación 1 a 1 con el perfil médico
    @OneToOne(() => UsuarioPerfil, (perfil) => perfil.usuario)
    perfil: UsuarioPerfil;
}