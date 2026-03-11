const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

require('dotenv').config(); // Carga las variables

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

// Prueba de conexión inicial
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Error de conexión a la BD:', err);
  else console.log('Base de datos conectada correctamente');
});

// --- RUTA 1: REGISTRO ---
app.post('/registrar', async (req, res) => {
  const { nombre, email, edad, sangre, alergias, historial, password } = req.body;
  try {
    const query = `
      INSERT INTO Usuarios (Nombre_Completo, Email, Edad, Tipo_Sangre, Alergias, Historial_Medico, Hash_Password)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ID_Usuario`;
    
    // Siete valores para siete columnas
    const values = [nombre, email, edad, sangre, alergias, historial, password];
    const result = await pool.query(query, values);

    res.status(201).json({ mensaje: 'Éxito', id: result.rows[0].id_usuario });
  } catch (err) {
    console.error('Error al insertar:', err.message);
    res.status(500).json({ error: 'Error al registrar' });
  }
});

// --- RUTA 2: LOGIN ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body; // Recibimos email
  try {
    // Buscamos por Email en lugar de Nombre_Completo
    const query = 'SELECT ID_Usuario FROM Usuarios WHERE Email = $1 AND Hash_Password = $2';
    const result = await pool.query(query, [email, password]);

    if (result.rows.length > 0) {
      res.json({ id: result.rows[0].id_usuario });
    } else {
      res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }
  } catch (err) {
    console.error('Error en login:', err.message);
    res.status(500).json({ error: "Error de servidor" });
  }
});

// --- RUTA 3: OBTENER CONTACTOS (ORDENADOS POR PRIORIDAD) ---
app.get('/contactos/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  try {
    // Consultamos la tabla de contactos filtrando por el dueño y ordenando por prioridad
    const query = 'SELECT * FROM Contactos_Emergencia WHERE ID_Usuario = $1 ORDER BY Prioridad DESC';
    const result = await pool.query(query, [id_usuario]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener contactos" });
  }
});

// --- RUTA 4: AGREGAR CONTACTO ---
app.post('/contactos', async (req, res) => {
  const { id_usuario, nombre, telefono, prioridad } = req.body;
  try {
    const query = `
      INSERT INTO Contactos_Emergencia (ID_Usuario, Nombre_Contacto, Telefono, Prioridad)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [id_usuario, nombre, telefono, prioridad];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al guardar contacto" });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor HeaLink corriendo en http://0.0.0.0:${port}`);
});

// --- RUTA 5: OBTENER MEDICAMENTOS ---
app.get('/medicamentos/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const query = 'SELECT * FROM Medicamentos WHERE ID_Usuario = $1 ORDER BY Hora_Programada ASC';
    const result = await pool.query(query, [id_usuario]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener medicinas:', err.message);
    res.status(500).json({ error: "Error al obtener medicinas" });
  }
});

// --- RUTA 6: AGREGAR MEDICAMENTO ---
app.post('/medicamentos', async (req, res) => {
  const { id_usuario, nombre, dosis, hora, frecuencia } = req.body;
  try {
    const query = `
      INSERT INTO Medicamentos (ID_Usuario, Nombre_Farmaco, Dosis, Hora_Programada, Frecuencia_Horas)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [id_usuario, nombre, dosis, hora, frecuencia];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al guardar medicina:', err.message);
    res.status(500).json({ error: "Error al guardar medicina" });
  }
});

// --- RUTA 7: ELIMINAR CONTACTO ---
app.delete('/contactos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Contactos_Emergencia WHERE ID_Contacto = $1', [id]);
    res.json({ mensaje: 'Contacto eliminado' });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar contacto" });
  }
});

// --- RUTA 8: ELIMINAR MEDICAMENTO ---
app.delete('/medicamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Medicamentos WHERE ID_Medicina = $1', [id]);
    res.json({ mensaje: 'Medicina eliminada' });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar medicina" });
  }
});