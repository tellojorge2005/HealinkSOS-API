import { NoSQLClient, Region } from 'oracle-nosqldb';
import dotenv from "dotenv";
import path from "path";

const rootPath = path.resolve(__dirname, "../../../");
dotenv.config({ path: path.join(rootPath, ".env") });

// Conexión a tu Oracle NoSQL Cloud usando tu API Key
const nosqlClient = new NoSQLClient({
    region: Region.US_PHOENIX_1, // Cambia esto si tu nube está en otra región (ej. US_PHOENIX_1)
    compartment: process.env.OCI_COMPARTMENT_ID,
    auth: {
        iam: {
            tenantId: process.env.OCI_TENANT_ID,
            userId: process.env.OCI_USER_ID,
            fingerprint: process.env.OCI_FINGERPRINT,
            privateKeyFile: process.env.OCI_PRIVATE_KEY_PATH // Ruta a tu .pem
        }
    }
});

export default nosqlClient;