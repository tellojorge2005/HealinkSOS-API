import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import sosRoutes from "./routes/sosRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Montaje de rutas
app.use("/sos", sosRoutes);

console.log("Iniciando conexiones en sos-core-service...");

// Iniciamos la BD Relacional (SQL)
AppDataSource.initialize()
    .then(() => {
        console.log("¡CONEXIÓN SQL EXITOSA! (Solo lectura para Contactos)");

        // Puerto 3004 para el SOS
        const PORT = 3004;

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Microservicio SOS corriendo en http://0.0.0.0:${PORT}`);
            console.log(`Endpoint Telemetría (NoSQL): POST http://0.0.0.0:${PORT}/sos/telemetria`);
        });
    })
    .catch((error: any) => {
        console.log("ERROR EN LA CONEXIÓN (SQL SOS):");
        console.error(error);
    });