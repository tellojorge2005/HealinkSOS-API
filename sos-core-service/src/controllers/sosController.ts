import { Request, Response } from "express";
import nosqlClient from "../config/nosql-client";
import { AppDataSource } from "../config/data-source";
import { ContactoEmergencia } from "../entities/ContactoEmergencia";
import twilio from "twilio";

// Inicialización de Twilio usando el operador "!" para evitar el error TS2322
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
);

export const recibirTelemetria = async (req: Request, res: Response): Promise<any> => {
    // 1. Extraemos lo que nos manda el simulador Java
    const { id_dispositivo, id_usuario, alerta_sos, biometria, ubicacion } = req.body;

    try {
        // 2. Guardamos en Oracle NoSQL (Telemetría de alta velocidad)
        await nosqlClient.put(
            'telemetria_sos',
            {
                id_dispositivo,
                fecha_hora: new Date().toISOString(),
                alerta_sos,
                biometria,
                ubicacion
            }
        );

        // 3. Lógica de Pánico (Solo si alerta_sos es TRUE)
        if (alerta_sos === true) {
            console.log(`¡ALERTA SOS ACTIVADA! ID Usuario: ${id_usuario}`);

            // --- A. BUSCAR EL NOMBRE DEL USUARIO (SQL) ---
            // Usamos el permiso SELECT que acabas de dar a HEALINK_USUARIO.USUARIOS_PERFIL
            const perfilData = await AppDataSource.query(
                "SELECT nombre_completo FROM HEALINK_USUARIO.USUARIOS_PERFIL WHERE id_usuario = :id",
                [id_usuario]
            );

            // Si Oracle devuelve el nombre en mayúsculas (común en query directo), lo manejamos:
            const nombreUser = perfilData.length > 0
                ? (perfilData[0].NOMBRE_COMPLETO || perfilData[0].nombre_completo)
                : "Tu familiar";

            // --- B. BUSCAR CONTACTOS DE EMERGENCIA ---
            const contactoRepo = AppDataSource.getRepository(ContactoEmergencia);
            const contactos = await contactoRepo.find({
                where: { idUsuario: Number(id_usuario) },
                order: { prioridad: "ASC" }
            });

            if (contactos.length > 0) {
                // Link dinámico para Google Maps con las coordenadas del JSON
                const linkMapa = `https://www.google.com/maps?q=${ubicacion.latitud},${ubicacion.longitud}`;

                // Guion personalizado para la voz de Alice
                const guionVoz = `
                    <Response>
                        <Say language="es-MX" voice="alice">
                            Atención. Esta es una alerta médica de Healink. 
                            Tu familiar, ${nombreUser}, ha solicitado ayuda. 
                            Su ritmo cardíaco actual es de ${biometria.bpm} latidos por minuto. 
                            Te hemos enviado un mensaje de texto con su ubicación exacta en el mapa. 
                            Por favor, mantén la calma y actúa de inmediato.
                        </Say>
                    </Response>`;

                for (const contacto of contactos) {
                    // Formateo de número para Twilio (+52 para México)
                    const telDestino = contacto.telefono.startsWith('+') ? contacto.telefono : `+52${contacto.telefono}`;

                    // --- DISPARAR LLAMADA ---
                    try {
                        await twilioClient.calls.create({
                            twiml: guionVoz,
                            from: process.env.TWILIO_PHONE_NUMBER!,
                            to: telDestino
                        });
                        console.log(`Llamada iniciada para: ${contacto.nombreContacto}`);
                    } catch (e: any) { console.error(`Error Llamada (${contacto.nombreContacto}):`, e.message); }

                    // --- DISPARAR SMS ---
                    try {
                        await twilioClient.messages.create({
                            body: `🚨 SOS HEALINK: ${nombreUser} mandó una alerta. BPM: ${biometria.bpm}. Ubicación: ${linkMapa}`,
                            from: process.env.TWILIO_PHONE_NUMBER!,
                            to: telDestino
                        });
                        console.log(`📩 SMS enviado a: ${contacto.nombreContacto}`);
                    } catch (e: any) { console.error(`Error SMS (${contacto.nombreContacto}):`, e.message); }
                }
            } else {
                console.log("No se encontraron contactos de emergencia para este usuario.");
            }
        }

        // 4. Responder al simulador Java
        res.status(200).json({ message: "Telemetría recibida y procesada" });

    } catch (error: any) {
        console.error("ERROR CRÍTICO EN SOS_SERVICE:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};