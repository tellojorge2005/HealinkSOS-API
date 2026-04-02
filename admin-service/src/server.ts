import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import adminRoutes from "./routes/adminRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Montaje de rutas
app.use("/admin", adminRoutes);

console.log("⏳ Iniciando AppDataSource en admin-service...");

AppDataSource.initialize()
    .then(() => {
        console.log("✅ ¡CONEXIÓN EXITOSA! admin-service conectado a Oracle Cloud.");
        
        // Asignación de puerto estático 3002 para no interferir con el auth-service
        const PORT = 3002;
        
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Microservicio Admin corriendo en http://localhost:${PORT}`);
            console.log(`🔗 Endpoint Medicamentos: POST http://localhost:${PORT}/admin/medicamento`);
            console.log(`🔗 Endpoint Contactos: POST http://localhost:${PORT}/admin/contacto`);
        });
    })
    .catch((error: any) => {
        console.log("❌ ERROR EN LA CONEXIÓN (ADMIN):");
        console.error(error);
    });