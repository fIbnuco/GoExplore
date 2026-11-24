const mysql = require("mysql2");

// Buat koneksi ke database MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "goexplore",
});
``;
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
  INSERT INTO criteria (criteria,type)
  VALUES
    ('harga','cost'),
    ('durasi','benefit'),
    ('preferensi','benefit'),
    ('jumlah_objek_wisata','benefit');
`;

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

connection.query(insertEvaluasi, (err, results) => {
  if (err) {
    console.error("Error inserting data: ", err);
    return;
  }
  console.log("Data berhasil ditambahkan ke tabel 'evaluasi'.");
});

connection.end();
