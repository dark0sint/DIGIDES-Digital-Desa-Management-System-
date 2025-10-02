const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Database Setup
const db = new sqlite3.Database('database.db');

// Inisialisasi Tabel (jalan sekali)
db.serialize(() => {
  // Tabel Administrasi (Users/Warga)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    alamat TEXT,
    umur INTEGER
  )`);

  // Tabel Persuratan
  db.run(`CREATE TABLE IF NOT EXISTS surat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nomor_surat TEXT NOT NULL,
    judul TEXT,
    isi TEXT,
    tanggal DATE DEFAULT CURRENT_DATE
  )`);

  // Tabel Pajak PBB-P2
  db.run(`CREATE TABLE IF NOT EXISTS pajak (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_pemilik TEXT NOT NULL,
    npwpd TEXT,
    jumlah_pajak REAL,
    status TEXT DEFAULT 'Belum Bayar'
  )`);

  // Tabel Bansos
  db.run(`CREATE TABLE IF NOT EXISTS bansos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_penerima TEXT NOT NULL,
    jenis_bansos TEXT,
    jumlah REAL,
    status TEXT DEFAULT 'Dibagikan'
  )`);

  // Insert data demo (opsional, hapus jika tidak perlu)
  db.run("INSERT OR IGNORE INTO users (nama, alamat, umur) VALUES ('John Doe', 'Desa Contoh', 30)");
  db.run("INSERT OR IGNORE INTO surat (nomor_surat, judul, isi) VALUES ('001/2023', 'Surat Pengumuman', 'Pengumuman rapat desa.')");
});

// API Routes

// Login Sederhana (Hardcoded untuk MVP)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    res.json({ success: true, message: 'Login berhasil' });
  } else {
    res.status(401).json({ success: false, message: 'Login gagal' });
  }
});

// Administrasi: CRUD Users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/users', (req, res) => {
  const { nama, alamat, umur } = req.body;
  db.run('INSERT INTO users (nama, alamat, umur) VALUES (?, ?, ?)', [nama, alamat, umur], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.put('/api/users/:id', (req, res) => {
  const { nama, alamat, umur } = req.body;
  db.run('UPDATE users SET nama=?, alamat=?, umur=? WHERE id=?', [nama, alamat, umur, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Persuratan: CRUD Surat
app.get('/api/surat', (req, res) => {
  db.all('SELECT * FROM surat', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/surat', (req, res) => {
  const { nomor_surat, judul, isi } = req.body;
  db.run('INSERT INTO surat (nomor_surat, judul, isi) VALUES (?, ?, ?)', [nomor_surat, judul, isi], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// ... (Serupa untuk PUT dan DELETE surat, saya singkat untuk ruang; copy pattern dari users)

// Pajak PBB-P2: CRUD Pajak
app.get('/api/pajak', (req, res) => {
  db.all('SELECT * FROM pajak', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/pajak', (req, res) => {
  const { nama_pemilik, npwpd, jumlah_pajak, status } = req.body;
  db.run('INSERT INTO pajak (nama_pemilik, npwpd, jumlah_pajak, status) VALUES (?, ?, ?, ?)', [nama_pemilik, npwpd, jumlah_pajak, status], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Bansos: CRUD Bansos
app.get('/api/bansos', (req, res) => {
  db.all('SELECT * FROM bansos', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/bansos', (req, res) => {
  const { nama_penerima, jenis_bansos, jumlah, status } = req.body;
  db.run('INSERT INTO bansos (nama_penerima, jenis_bansos, jumlah, status) VALUES (?, ?, ?, ?)', [nama_penerima, jenis_bansos, jumlah, status], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Profil Desa: API sederhana untuk data statis (bisa diubah ke DB nanti)
app.get('/api/profil', (req, res) => {
  res.json({
    nama_desa: 'Desa Contoh',
    kepala_desa: 'Budi Santoso',
    deskripsi: 'Desa ini menyediakan layanan digital lengkap.',
    populasi: 5000
  });
});

app.put('/api/profil', (req, res) => {
  // Untuk MVP, hanya return success; implementasikan update DB jika perlu
  res.json({ success: true });
});

// Serve HTML Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/surat', (req, res) => res.sendFile(path.join(__dirname, 'public', 'surat.html')));
app.get('/pajak', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pajak.html')));
app.get('/bansos', (req, res) => res.sendFile(path.join(__dirname, 'public', 'bansos.html')));
app.get('/profil', (req, res) => res.sendFile(path.join(__dirname, 'public', 'profil.html')));

app.listen(PORT, () => {
  console.log(`DIGIDES Server running at http://localhost:${PORT}`);
});
