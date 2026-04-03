# HealinkSOS-API
API central del sistema HeaLink SOS, diseñado para el monitoreo de salud en tiempo real y la gestión de alertas de emergencia para adultos mayores.

---
## Funciones principales
* **Autenticación de usuarios:** Gestión del inicio de sesión y validación de acceso al sistema. 
* **Gestión de perfil:** Registro y edición de información del usuario, incluyendo datos médicos críticos como tipo de sangre, alergias e historial clínico. 
* **Administración de contactos:** Configuración de números de emergencia con asignación de niveles de prioridad para la respuesta ante crisis. 
* **Control de medicinas:** Registro y almacenamiento de medicamentos y tratamientos activos para referencia médica. 
* **Módulo SOS:** Función principal que recibe telemetría (BPM y ubicación) y dispara automáticamente llamadas de voz y mensajes SMS mediante Twilio al detectar una emergencia. 
* **Persistencia híbrida:** Almacenamiento de perfiles y contactos en bases de datos relacionales (Oracle SQL) y del historial de biometría en bases de datos de alta velocidad (Oracle NoSQL).
## Stack Tecnológico
* **Lenguaje:** TypeScript con Node.js. 
* **Framework y ORM:** Express y TypeORM. 
* **Comunicaciones:** Twilio API para la gestión de mensajes SMS y llamadas de voz. 
* **Bases de datos:** Oracle DB para el manejo de información relacional y Oracle NoSQL para el almacenamiento de alta velocidad de telemetría.
---
**Notas Adicional:** Para probar la aplicación y acceder al repositorio principal, favor de ingresar al siguiente enlace: https://github.com/tellojorge2005/Healink-SOS