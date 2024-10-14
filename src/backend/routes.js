const express = require('express');
const router = express.Router();
const db = require('./db');

// 1. Získat všechny třídy
router.get('/tridy', (req, res) => {
  db.query('SELECT * FROM tridy', (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// 2. Získat žáky v dané třídě
router.get('/tridy/:tridaId/zaci', (req, res) => {
  const { tridaId } = req.params;
  db.query('SELECT * FROM zaci WHERE trida_id = ?', [tridaId], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// 3. Přidat nového žáka
router.post('/tridy/:tridaId/zaci', (req, res) => {
  const { tridaId } = req.params;
  const { jmeno } = req.body;
  db.query('INSERT INTO zaci (jmeno, trida_id) VALUES (?, ?)', [jmeno, tridaId], (err, result) => {
    if (err) throw err;
    res.status(201).json({ id: result.insertId, jmeno, trida_id: tridaId });
  });
});

// 4. Přidat známku žákovi
router.post('/zaci/:zakId/znamky', (req, res) => {
  const { zakId } = req.params;
  const { znamka, vaha, popis } = req.body;
  db.query(
    'INSERT INTO znamky (zak_id, znamka, vaha, popis) VALUES (?, ?, ?, ?)',
    [zakId, znamka, vaha, popis],
    (err, result) => {
      if (err) throw err;
      res.status(201).json({ id: result.insertId, zak_id: zakId, znamka, vaha, popis });
    }
  );
});

// 5. Smazat známku
router.delete('/znamky/:znamkaId', (req, res) => {
  const { znamkaId } = req.params;
  db.query('DELETE FROM znamky WHERE id = ?', [znamkaId], (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: 'Známka byla smazána.' });
  });
});

// 6. Smazat žáka
router.delete('/zaci/:zakId', (req, res) => {
  const { zakId } = req.params;
  db.query('DELETE FROM zaci WHERE id = ?', [zakId], (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: 'Žák byl smazán.' });
  });
});

// 7. Vypočítat průměr známek žáka
router.get('/zaci/:zakId/prumer', (req, res) => {
  const { zakId } = req.params;
  db.query(
    'SELECT AVG(znamka * vaha / 10) AS prumer FROM znamky WHERE zak_id = ?',
    [zakId],
    (err, result) => {
      if (err) throw err;
      res.json(result[0]);
    }
  );
});

module.exports = router;
