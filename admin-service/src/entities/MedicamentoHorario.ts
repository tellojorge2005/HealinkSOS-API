import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { MedicamentoInfo } from "./MedicamentoInfo";

@Entity("MEDICAMENTOS_HORARIOS", { schema: "HEALINK_MEDICAMENTOS" })
export class MedicamentoHorario {
    @PrimaryGeneratedColumn({ name: "ID_HORARIO" })
    id: number;

    @Column({ name: "HORA_INICIO", type: "varchar2", length: 10 })
    horaInicio: string;

    @Column({ name: "FRECUENCIA_HORAS", type: "number" })
    frecuenciaHoras: number;

    @ManyToOne(() => MedicamentoInfo, (medicamento) => medicamento.horarios, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ID_MEDICINA" })
    medicamento: MedicamentoInfo;
}