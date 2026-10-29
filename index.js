const express = require('express');
const db = require('./db');
const app = express();
const port = 3000;

// Middleware: lets Express read JSON sent in the request body
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

// CREATE
app.post('/theogene', (req, res) => {
  const { names, sex, phone } = req.body;
  if (!names) {
    return res.status(400).json({ message: 'names is required' });
  }
  const sql = 'INSERT INTO theogene (names, sex, phone) VALUES (?, ?, ?)';
  db.query(sql, [names, sex, phone], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, names, sex, phone });
  });
});

// READ ALL
app.get('/theogene', (req, res) => {
  db.query('SELECT * FROM theogene', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// READ ONE
app.get('/theogene/:id', (req, res) => {
  db.query('SELECT * FROM theogene WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(results[0]);
  });
});

// UPDATE
app.put('/theogene/:id', (req, res) => {
  const { names, sex, phone } = req.body;
  const sql = 'UPDATE theogene SET names = ?, sex = ?, phone = ? WHERE id = ?';
  db.query(sql, [names, sex, phone, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ id: Number(req.params.id), names, sex, phone });
  });
});

// DELETE
app.delete('/theogene/:id', (req, res) => {
  db.query('DELETE FROM theogene WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(204).send();
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});