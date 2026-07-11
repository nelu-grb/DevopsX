const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// healthcheck endpoint (available without DB)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
const DB_HOST = process.env.DB_HOST || 'mysql';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || 'changeit';
const DB_NAME = process.env.DB_NAME || 'videojuegos_db';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

let pool;
async function initDb() {
  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  // simple test
  const [rows] = await pool.query('SELECT 1');
}

app.get('/api/juegos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, titulo, plataforma, estado FROM videojuegos ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener juegos' });
  }
});

app.post('/api/juegos', async (req, res) => {
  try {
    const { titulo, plataforma, estado } = req.body;
    if (!titulo || !plataforma || !estado) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const [result] = await pool.execute(
      'INSERT INTO videojuegos (titulo, plataforma, estado) VALUES (?, ?, ?)',
      [titulo, plataforma, estado]
    );
    const insertedId = result.insertId;
    res.status(201).json({ id: insertedId, titulo, plataforma, estado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear juego' });
  }
});

app.put('/api/juegos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { titulo, plataforma, estado } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    if (!titulo || !plataforma || !estado) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const [result] = await pool.execute(
      'UPDATE videojuegos SET titulo = ?, plataforma = ?, estado = ? WHERE id = ?',
      [titulo, plataforma, estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    res.json({ id, titulo, plataforma, estado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar juego' });
  }
});

app.delete('/api/juegos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const [result] = await pool.execute('DELETE FROM videojuegos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar juego' });
  }
});

const PORT = process.env.PORT || 3000;

// export app for tests
module.exports = app;

// start server only when run directly
if (require.main === module) {
  initDb()
    .then(() => {
      app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));
    })
    .catch(err => {
      console.error('No se pudo inicializar la base de datos:', err);
      process.exit(1);
    });
}
