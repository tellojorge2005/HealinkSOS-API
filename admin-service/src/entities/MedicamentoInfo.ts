import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { MedicamentoHorario } from "./MedicamentoHorario";

@Entity("MEDICAMENTOS_INFO", { schema: "HEALINK_MEDICAMENTOS" })
export class MedicamentoInfo {
    @PrimaryGeneratedColumn({ name: "ID_MEDICINA" })
    id: number;

    @Column({ name: "ID_USUARIO", type: "number" })
    idUsuario: number;

    @Column({ name: "NOMBRE_FARMACO", type: "varchar2", length: 100 })
    nombreFarmaco: string;

    @Column({ name: "DOSIS", type: "varchar2", length: 100, nullable: true })
    dosis: string;

    @OneToMany(() => MedicamentoHorario, (horario) => horario.medicamento, { cascade: true })
    horarios: MedicamentoHorario[];
}