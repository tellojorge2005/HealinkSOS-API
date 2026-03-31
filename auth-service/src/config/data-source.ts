import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";

// 1. Cargamos el .env desde la raíz
const rootPath = path.resolve(__dirname, "../../../");
dotenv.config({ path: path.join(rootPath, ".env") });

// 2. Resolvemos la ruta del Wallet
const walletPathFromEnv = process.env.DB_WALLET_PATH || "../shared-wallet";
const walletPath = path.resolve(__dirname, "../../", walletPathFromEnv);

// Le decimos a la red dónde está la carpeta
process.env.TNS_ADMIN = walletPath;

export const AppDataSource = new DataSource({
    type: "oracle",
    username: process.env.AUTH_USER, 
    password: process.env.AUTH_PASS,
    connectString: process.env.DB_CONNECT_STRING, 
    
    synchronize: false,
    logging: true,
    entities: [path.join(__dirname, "../entities/**/*.{ts,js}")],
    
    extra: {
        walletLocation: walletPath,
        walletPassword: process.env.DB_WALLET_PASSWORD, 
        
        connectionTimeout: 120000, 
        queueTimeout: 120000,
        thin: true 
    }
});