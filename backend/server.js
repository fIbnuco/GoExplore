const mysql = require("mysql2");

// Buat koneksi ke database MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "moora4",
});

// Query untuk membuat tabel
const createDatabaseAndTableAlternative = `
  CREATE TABLE IF NOT EXISTS alternative (
    id_alternative INT(3) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    harga INT NOT NULL,
    durasi VARCHAR(100) NOT NULL,
    preferensi VARCHAR(100) NOT NULL,
    objek INT(3) NOT NULL
  );
`;

// Eksekusi query
connection.query(createDatabaseAndTableAlternative, (err, results) => {
  if (err) {
    console.error("Error creating table: ", err);
    return;
  }
  console.log("Tabel 'alternative' berhasil dibuat.");
});

const createDatabaseAndTableCriteria = `
    CREATE TABLE IF NOT EXISTS criteria (
      id_criteria INT(3) AUTO_INCREMENT PRIMARY KEY,
      criteria VARCHAR(100) NOT NULL,
      bobot DOUBLE NOT NULL,
      type ENUM('benefit','cost') NOT NULL
    );
`;

// Eksekusi query
connection.query(createDatabaseAndTableCriteria, (err, results) => {
  if (err) {
    console.error("Error creating table: ", err);
    return;
  }
  console.log("Tabel 'criteria' berhasil dibuat.");
});

// const createDatabaseAndTableSubCriteriaHarga = `
//     CREATE TABLE IF NOT EXISTS subcriteria_harga (
//       id_sub_criteria INT AUTO_INCREMENT PRIMARY KEY,
//       id_alternative INT NOT NULL,
//       id_criteria INT NOT NULL,                       
//       harga VARCHAR(100) NOT NULL,                      
//       value FLOAT NOT NULL,            
//       FOREIGN KEY (id_alternative) REFERENCES alternative(id_alternative),       
//       FOREIGN KEY (id_criteria) REFERENCES criteria(id_criteria) 
//     )ENGINE=MyISAM;
// `;

// // Eksekusi query
// connection.query(createDatabaseAndTableSubCriteriaHarga, (err, results) => {
//   if (err) {
//     console.error("Error creating table: ", err);
//     return;
//   }
//   console.log("Tabel 'subcriteria harga' berhasil dibuat.");
// });

// const createDatabaseAndTableSubCriteriaDurasi = `
//     CREATE TABLE IF NOT EXISTS subcriteria_durasi (
//       id_sub_criteriaDurasi INT(3) AUTO_INCREMENT PRIMARY KEY,
//       id_alternative INT(3) NOT NULL,
//       id_criteria INT(3) NOT NULL,
//       durasi VARCHAR(100) NOT NULL,
//       value FLOAT NOT NULL,
//       FOREIGN KEY (id_alternative) REFERENCES alternative(id_alternative),
//       FOREIGN KEY (id_criteria) REFERENCES criteria(id_criteria) 
//     )ENGINE=MyISAM;
// `;

// // Eksekusi query
// connection.query(createDatabaseAndTableSubCriteriaFasilitas, (err, results) => {
//   if (err) {
//     console.error("Error creating table: ", err);
//     return;
//   }
//   console.log("Tabel 'subcriteria fasilitas' berhasil dibuat.");
// });

// const createDatabaseAndTableSubCriteriaJenis = `
//     CREATE TABLE IF NOT EXISTS subcriteria_jenis (
//       id_sub_criteria INT AUTO_INCREMENT PRIMARY KEY,
//       id_alternative INT NOT NULL,
//       id_criteria INT NOT NULL,
//       jenis VARCHAR(100) NOT NULL,
//       value FLOAT NOT NULL,
//       FOREIGN KEY (id_alternative) REFERENCES alternative(id_alternative),
//       FOREIGN KEY (id_criteria) REFERENCES criteria(id_criteria) 
//     )ENGINE=MyISAM;
// `;

// // Eksekusi query
// connection.query(createDatabaseAndTableSubCriteriaJenis, (err, results) => {
//   if (err) {
//     console.error("Error creating table: ", err);
//     return;
//   }
//   console.log("Tabel 'subcriteria jenis' berhasil dibuat.");
// });

const createDatabaseAndTableEvaluasi = `
    CREATE TABLE IF NOT EXISTS evaluasi (
      id_evaluasi INT(3) AUTO_INCREMENT PRIMARY KEY, 
      id_alternative INT(3),
      id_criteria INT(3),
      nilai DOUBLE NOT NULL
    );
`;

// Eksekusi query
connection.query(createDatabaseAndTableEvaluasi, (err, results) => {
  if (err) {
    console.error("Error creating table: ", err);
    return;
  }
  console.log("Tabel 'evaluasi' berhasil dibuat.");
});

// Query untuk menambahkan data ke tabel 
const insertAlternative = `
  INSERT INTO alternative (name, harga, durasi, preferensi, objek) 
  VALUES
    ('Jogja Heritage Journey', 2800000, '3 Hari 2 Malam', 'Anak-anak', 8),
    ('Jogja Accessible Heritage Tour', 800000, '1 Hari', 'Disabilitas', 4),
    ('Hidden Gems of Jogja', 1500000, '2 Hari 1 Malam', 'Lansia', 6),
    ('Jogja Culinary Delight', 1700000, '1 Hari', 'Lansia', 5),
    ('Romantic Jogja Escape', 3000000, '3 Hari 2 Malam', 'Anak-anak', 8),
    ('Art and Soul of Jogja', 2800000, '2 Hari 1 Malam', 'Lansia', 7),
    ('Jogja Eco Adventure', 2200000, '2 Hari 1 Malam', 'Anak-anak', 7),
    ('Jogja Natural & Cultural Accessible', 950000, '1 Hari', 'Disabilitas', 4),
    ('Jogja Nature Escape', 1200000, '1 Hari', 'Disabilitas', 5);
`;
const insertCriteria = `
  INSERT INTO criteria (criteria, bobot, type)
  VALUES
    ('harga', 0.35, 'cost'),
    ('durasi', 0.30, 'benefit'),
    ('preferensi', 0.20, 'benefit'),
    ('jumlah_objek_wisata', 0.15, 'benefit');
`;
// const insertSubCriteriaHarga = `
//   INSERT INTO subcriteria_harga (id_alternative, id_criteria, harga, value)
//   VALUES
//     (2, 1, '1.700.000 - 2.400.000', 1.00),
//     (4, 1, '1.700.000 - 2.400.000', 1.00),
//     (1, 1, '2.500.000 - 3.000.000', 0.50),
//     (6, 1, '2.500.000 - 3.000.000', 0.50),
//     (3, 1, '3.100.000 - 3.500.000', 0.20),
//     (5, 1, '3.100.000 - 3.500.000', 0.20);
// `;

// const insertSubCriteriaFasilitas = `
//   INSERT INTO subcriteria_fasilitas (id_alternative, id_criteria, fasilitas, value)
//   VALUES
//     (2, 2, 'Sedikit', 0.20),
//     (4, 2, 'Sedikit', 0.20),
//     (1, 2, 'Cukup', 0.50),
//     (6, 2, 'Cukup', 0.50),
//     (3, 2, 'Banyak', 1.00),
//     (5, 2, 'Banyak', 1.00);
// `;

// const insertSubCriteriaJenis = `
//   INSERT INTO subcriteria_jenis (id_alternative, id_criteria, jenis, value)
//   VALUES
//     (4, 3, 'Kuliner', 0.20),
//     (2, 3, 'Alam', 0.50),
//     (3, 3, 'Alam', 0.50),
//     (1, 3, 'Sosial_Budaya', 1.00),
//     (5, 3, 'Sosial_Budaya', 1.00),
//     (6, 3, 'Sosial_Budaya', 1.00);
// `;

const insertEvaluasi = `
  INSERT INTO evaluasi (id_alternative,id_criteria,nilai)
  VALUES
    (1, 1, 2800000), (1, 2, 3), (1, 3, 2), (1, 4, 8),
    (2, 1, 800000), (2, 2, 1), (2, 3, 3), (2, 4, 4),
    (3, 1, 1500000), (3, 2, 2), (3, 3, 1), (3, 4, 6),
    (4, 1, 1700000), (4, 2, 1), (4, 3, 1), (4, 4, 5),
    (5, 1, 3000000), (5, 2, 3), (5, 3, 2), (5, 4, 8),
    (6, 1, 2800000), (6, 2, 2), (6, 3, 1), (6, 4, 7),
    (7, 1, 2200000), (7, 2, 2), (7, 3, 2), (7, 4, 7),
    (8, 1, 950000), (8, 2, 1), (8, 3, 3), (8, 4, 4),
    (9, 1, 1200000), (9, 2, 1), (9, 3, 3), (9, 4, 5);
`;

// Eksekusi query untuk menambahkan data
connection.query(insertAlternative, (err, results) => {
  if (err) {
    console.error("Error inserting data: ", err);
    return;
  }
  console.log("Data berhasil ditambahkan ke tabel 'alternative'.");
});
connection.query(insertCriteria, (err, results) => {
  if (err) {
    console.error("Error inserting data: ", err);
    return;
  }
  console.log("Data berhasil ditambahkan ke tabel 'criteria'.");
});
// connection.query(insertSubCriteriaHarga, (err, results) => {
//   if (err) {
//     console.error("Error inserting data: ", err);
//     return;
//   }
//   console.log("Data berhasil ditambahkan ke tabel 'subcriteria harga'.");
// });
// connection.query(insertSubCriteriaFasilitas, (err, results) => {
//   if (err) {
//     console.error("Error inserting data: ", err);
//     return;
//   }
//   console.log("Data berhasil ditambahkan ke tabel 'subcriteria fasiltas'.");
// });
// connection.query(insertSubCriteriaJenis, (err, results) => {
//   if (err) {
//     console.error("Error inserting data: ", err);
//     return;
//   }
//   console.log("Data berhasil ditambahkan ke tabel 'subcriteria jenis'.");
// });
connection.query(insertEvaluasi, (err, results) => {
  if (err) {
    console.error("Error inserting data: ", err);
    return;
  }
  console.log("Data berhasil ditambahkan ke tabel 'evaluasi'.");
});

// Menutup koneksi setelah selesai
connection.end();

// const express = require("express");
// const cors = require("cors");
// const db = require("./db");

// const app = express();
// const port = 5000;

// app.use(cors());
// app.use(express.json());

// // Endpoint untuk menerima rekomendasi wisata dan menyimpannya ke database
// app.post("/api/saveRecommendation", (req, res) => {
//   const places = req.body;

//   places.forEach((place) => {
//     const { name, price, distance, facilities, type, fs } = place;
//     const query = "INSERT INTO wisata (name, price, distance, facilities, type, fs) VALUES (?, ?, ?, ?, ?, ?)";
//     db.query(query, [name, price, distance, facilities, type, fs], (err, result) => {
//       if (err) {
//         console.error("Error saving place:", err);
//         res.status(500).send("Error saving data");
//       }
//     });
//   });

//   res.status(200).json({ message: "Data berhasil disimpan!" });
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
