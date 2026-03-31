import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { UsuarioAuth } from "./UsuarioAuth";

@Entity("usuarios_perfil")
export class UsuarioPerfil {
    @PrimaryGeneratedColumn({ name: "id_perfil" })
    id: number;

    @Column({ type: "varchar2", length: 100 })
    nombreCompleto: string;

    @Column({ type: "date" })
    fechaNacimiento: Date;

    @Column({ type: "varchar2", length: 3, nullable: true })
    tipoSangre: string;

    @Column({ type: "varchar2", length: 4000, nullable: true })
    historialMedico: string;

    @Column({ type: "varchar2", length: 4000, nullable: true })
    alergias: string;

    // Aquí es donde se hace el vínculo con la tabla Auth
    @OneToOne(() => UsuarioAuth, (usuario) => usuario.perfil)
    @JoinColumn({ name: "id_usuario" }) // Esta es tu FK de la imagen
    usuario: UsuarioAuth;
}