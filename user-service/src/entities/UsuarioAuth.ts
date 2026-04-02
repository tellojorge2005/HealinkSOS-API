import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("USUARIOS_AUTH", { schema: "HEALINK_USUARIO" })
export class UsuarioAuth {
    // CORRECCIÓN: Le decimos a TypeORM que la columna real en Oracle es ID_USUARIO
    @PrimaryGeneratedColumn({ name: "ID_USUARIO" })
    id: number;
}