const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
});

app.get('/medicos', (req, res) => {
  db.query('SELECT * FROM medicos', (err, results) => {
    if (err) return res.json({ error: err.message });
    res.json(results);
  });
});

app.get('/turnos', (req, res) => {
  const medicoId = req.query.medico_id;
  db.query('SELECT * FROM turnos WHERE medico_id=? AND disponible=1',
    [medicoId], (err, results) => {
      if (err) return res.json({ error: err.message });
      res.json(results);
  });
});

app.get('/reservar', (req, res) => {
  const { turno_id, paciente } = req.query;
  db.query('INSERT INTO reservas (turno_id, paciente) VALUES (?, ?)',
    [turno_id, paciente], (err) => {
      if (err) return res.json({ error: err.message });
      db.query('UPDATE turnos SET disponible=0 WHERE id=?', [turno_id]);
      res.json({ ok: true });
  });
});
app.get('/horarios', (req, res) => {
  const medicoId = req.query.medico_id;
  db.query('SELECT dia FROM horarios WHERE medico_id=?',
    [medicoId], (err, results) => {
      if (err) return res.json({ error: err.message });
      res.json(results);
  });
});

app.listen(process.env.PORT || 3000);
