import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("CONTACTOS_EMERGENCIA", { schema: "HEALINK_CONTACTOS" })
export class ContactoEmergencia {
    @PrimaryGeneratedColumn({ name: "ID_CONTACTO" })
    id: number;

    @Column({ name: "ID_USUARIO", type: "number" })
    idUsuario: number;

    @Column({ name: "NOMBRE_CONTACTO", type: "varchar2", length: 100 })
    nombreContacto: string;

    @Column({ name: "TELEFONO", type: "varchar2", length: 20 })
    telefono: string;

    @Column({ name: "PRIORIDAD", type: "number" })
    prioridad: number;
}