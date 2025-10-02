

### Langkah Instalasi & Run (Siap Jalankan)
1. **Install Node.js**: Pastikan Node.js terinstall (v14+). Download dari [nodejs.org](https://nodejs.org).
2. **Buat Folder Proyek**:
   - Buat folder `digides-app`.
   - Copy semua kode di bawah ke file-file yang sesuai.
3. **Install Dependencies**:
   - Buka terminal di folder `digides-app`.
   - Jalankan: `npm init -y` (jika belum ada package.json).
   - Kemudian: `npm install express sqlite3 body-parser cors`.
4. **Jalankan Aplikasi**:
   - Di terminal: `node server.js`.
   - Buka browser: `http://localhost:3000`.
   - Login demo: Username `admin`, Password `password` (hardcoded untuk MVP).
5. **Stop**: Ctrl+C di terminal.

**Catatan**: 
- Database otomatis dibuat dengan tabel: `users` (administrasi), `surat` (persuratan), `pajak` (PBB-P2), `bansos` (bantuan sosial).
- Untuk produksi, tambahkan autentikasi real (e.g., Passport.js), validasi, dan hosting database (e.g., PostgreSQL).
- Jika error, pastikan port 3000 bebas.

<img width="429" height="399" alt="0Untitled" src="https://github.com/user-attachments/assets/34ac2c6d-9d8a-4506-b6d0-06f7aece318b" />
