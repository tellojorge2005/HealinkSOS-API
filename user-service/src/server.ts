import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import profileRoutes from "./routes/profileRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Montaje de rutas
app.use("/user", profileRoutes);

console.log("⏳ Iniciando AppDataSource en user-service...");

AppDataSource.initialize()
    .then(() => {
        console.log("✅ ¡CONEXIÓN EXITOSA! user-service conectado a Oracle Cloud.");
        
        // Asignación de puerto estático 3003 para no interferir con el auth-service ni admin-service
        const PORT = 3003;
        
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Microservicio User corriendo en http://0.0.0.0:${PORT}`);
            console.log(`🔗 Endpoint Ver Perfil: GET http://0.0.0.0:${PORT}/user/perfil/:idUsuario`);
            console.log(`🔗 Endpoint Editar Perfil: PUT http://0.0.0.0:${PORT}/user/perfil/:idUsuario`);
            console.log(`🔗 Endpoint Borrar Perfil: DELETE http://0.0.0.0:${PORT}/user/perfil/:idUsuario`);
        });
    })
    .catch((error: any) => {
        console.log("❌ ERROR EN LA CONEXIÓN (USER):");
        console.error(error);
    });