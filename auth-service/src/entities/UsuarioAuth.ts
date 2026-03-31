import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from "typeorm";
import { UsuarioPerfil } from "./UsuarioPerfil";

@Entity("usuarios_auth")
export class UsuarioAuth {
    @PrimaryGeneratedColumn({ name: "id_usuario" })
    id: number;

    @Column({ type: "varchar2", length: 100, unique: true })
    email: string;

    @Column({ name: "hash_password", type: "varchar2", length: 255 })
    passwordHash: string;

    @CreateDateColumn({ name: "fecha_registro" })
    fechaRegistro: Date;

    // Relación 1 a 1 con el perfil médico
    @OneToOne(() => UsuarioPerfil, (perfil) => perfil.usuario)
    perfil: UsuarioPerfil;
}