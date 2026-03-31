import "reflect-metadata";
import express from "express";
import cors from "cors";
import path from "path";
import { AppDataSource } from "./config/data-source"; // Importamos la conexión
import authRoutes from "./routes/authRoutes"; // Importamos tus rutas de registro

const app = express(); // <--- Aquí definimos 'app' para que TS ya no llore

// Middlewares
app.use(cors());
app.use(express.json());

// Montamos las rutas
app.use("/auth", authRoutes);

console.log("⏳ Iniciando AppDataSource.initialize()...");

AppDataSource.initialize()
    .then(() => {
        console.log("✅ ¡CONEXIÓN EXITOSA! Ya estamos dentro de Oracle Cloud. xdxd");
        
        const PORT = process.env.AUTH_PORT || 3001;
        
        // Usamos Number(PORT) y "0.0.0.0" para que sea visible en tu red local
        app.listen(Number(PORT), "0.0.0.0", () => {
            console.log(`🚀 Microservicio de Auth corriendo en http://localhost:${PORT}`);
            console.log(`🔗 Probar registro en: http://localhost:${PORT}/auth/registrar`);
        });
    })
    .catch((error: any) => { // <--- Agregamos ': any' para quitar el error TS7006
        console.log("❌ ERROR EN LA CONEXIÓN:");
        console.error(error);
    });

// Ruta de salud rápida
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "auth-service" });
});