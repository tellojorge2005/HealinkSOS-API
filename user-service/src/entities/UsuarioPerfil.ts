import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("USUARIOS_PERFIL", { schema: "HEALINK_USUARIO" })
export class UsuarioPerfil {
    @PrimaryGeneratedColumn({ name: "ID_PERFIL" })
    id: number;

    @Column({ name: "ID_USUARIO", type: "number" })
    idUsuario: number;

    @Column({ name: "NOMBRE_COMPLETO", type: "varchar2", length: 150 })
    nombreCompleto: string;

    @Column({ name: "FECHA_NACIMIENTO", type: "varchar2", length: 20 })
    fechaNacimiento: string;

    @Column({ name: "TIPO_SANGRE", type: "varchar2", length: 10 })
    tipoSangre: string;

    @Column({ name: "ALERGIAS", type: "varchar2", length: 255, nullable: true })
    alergias: string;

    @Column({ name: "HISTORIAL_MEDICO", type: "varchar2", length: 1000, nullable: true })
    historialMedico: string;
}