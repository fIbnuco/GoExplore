const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "goexplore",
});

// Koneksi database
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected...");
});

// Endpoint untuk daftar paket wisata
app.get("/api/packages", (req, res) => {
  const query = "SELECT * FROM alternative"; // Asumsikan tabel packages
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Endpoint untuk menambahkan alternatif baru
app.post("/api/packages", (req, res) => {
  const { name, harga, durasi, preferensi, objek } = req.body;

  // Validasi input
  if (!name || !harga || !durasi || !preferensi || !objek) {
    return res.status(400).json({ error: "Semua data harus diisi!" });
  }

  // Query untuk menambahkan data ke tabel 'alternative'
  const query = `
    INSERT INTO alternative (name, harga, durasi, preferensi, objek) 
    VALUES (?, ?, ?, ?, ?)
  `;

  // Eksekusi query
  db.query(query, [name, harga, durasi, preferensi, objek], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Data berhasil ditambahkan!", id: results.insertId });
  });
});


app.get("/api/criteria", (req, res) => {
  const query = "SELECT * FROM criteria"; // Asumsikan tabel packages
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Endpoint untuk rekomendasi MOORA
app.post("/api/recommendation", (req, res) => {
  const { criteria, bobot } = req.body;

  // Ambil data paket wisata
  const query = "SELECT * FROM alternative";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!criteria || !bobot) {
      return res.status(400).json({ error: "Kriteria dan bobot harus diisi!" });
    }

    // Step 1: Normalisasi data
    const normalizedData = results.map((pkg) => {
      return {
        ...pkg,
        normalizedPrice: 1 / pkg.harga, // Harga: kriteria minimisasi
        normalizedAttractions: pkg.objek, // Objek wisata: kriteria maksimisasi
        normalizedDuration: pkg.durasi === criteria.criteria ? 1 : 0, // Cocok durasi
        normalizedPreference: pkg.preferensi === criteria.type ? 1 : 0, // Cocok preferensi
      };
    });

    // Step 2: Hitung skor MOORA
    const scoredData = normalizedData.map((pkg) => {
      const score =
        bobot.harga * pkg.normalizedPrice +
        bobot.objek * pkg.normalizedAttractions +
        bobot.durasi * pkg.normalizedDuration +
        bobot.type * pkg.normalizedPreference;

      return { ...pkg, score };
    });

    // Step 3: Urutkan berdasarkan skor tertinggi
    const recommendations = scoredData.sort((a, b) => b.score - a.score);

    // Kirim hasil rekomendasi
    res.json(recommendations);
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
