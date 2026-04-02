import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { UsuarioAuth } from "./UsuarioAuth";

@Entity("USUARIOS_PERFIL", { schema: "HEALINK_USUARIO" })
export class UsuarioPerfil {
    @PrimaryGeneratedColumn({ name: "ID_PERFIL" })
    id: number;

    @Column({ name: "NOMBRE_COMPLETO", type: "varchar2", length: 100 })
    nombreCompleto: string;

    @Column({ name: "FECHA_NACIMIENTO", type: "date" })
    fechaNacimiento: Date;

    @Column({ name: "TIPO_SANGRE", type: "varchar2", length: 3, nullable: true })
    tipoSangre: string;

    @Column({ name: "HISTORIAL_MEDICO", type: "varchar2", length: 4000, nullable: true })
    historialMedico: string;

    @Column({ name: "ALERGIAS", type: "varchar2", length: 4000, nullable: true })
    alergias: string;

    // Vínculo con la tabla Auth usando la llave foránea en mayúsculas
    @OneToOne(() => UsuarioAuth, (usuario) => usuario.perfil)
    @JoinColumn({ name: "ID_USUARIO" }) 
    usuario: UsuarioAuth;
}