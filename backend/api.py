from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

# Konfigurasi koneksi database
db = pymysql.connect(
    host="localhost",
    user="root",
    password="",
    database="goexplore23"
)

# Endpoint untuk daftar paket wisata
@app.route("/api/packages", methods=["GET"])
def get_packages():
    try:
        cursor = db.cursor(pymysql.cursors.DictCursor)
        query = "SELECT * FROM alternative"
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint untuk menambahkan alternatif baru
@app.route("/api/packages", methods=["POST"])
def add_package():
    data = request.json
    name = data.get("name")
    harga = data.get("harga")
    durasi = data.get("durasi")
    preferensi = data.get("preferensi")
    objek = data.get("objek")

    # Validasi input
    if not all([name, harga, durasi, preferensi, objek]):
        return jsonify({"error": "Semua data harus diisi!"}), 400

    try:
        cursor = db.cursor()
        query = "INSERT INTO alternative (name, harga, durasi, preferensi, objek) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (name, harga, durasi, preferensi, objek))
        db.commit()
        return jsonify({"message": "Data berhasil ditambahkan!", "id": cursor.lastrowid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint untuk daftar kriteria
@app.route("/api/criteria", methods=["GET"])
def get_criteria():
    try:
        cursor = db.cursor(pymysql.cursors.DictCursor)
        query = "SELECT * FROM criteria"
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint untuk rekomendasi MOORA
@app.route("/api/recommendation", methods=["POST"])
def get_recommendations():
    data = request.json
    criteria = data.get("criteria")
    bobot = data.get("bobot")

    if not criteria or not bobot:
        return jsonify({"error": "Kriteria dan bobot harus diisi!"}), 400

    try:
        cursor = db.cursor(pymysql.cursors.DictCursor)
        query = "SELECT * FROM alternative"
        cursor.execute(query)
        results = cursor.fetchall()

        # Step 1: Normalisasi data
        normalized_data = []
        for pkg in results:
            normalized_data.append({
                **pkg,
                "normalizedPrice": 1 / pkg["harga"],  # Harga: kriteria minimisasi
                "normalizedAttractions": pkg["objek"],  # Objek wisata: kriteria maksimisasi
                "normalizedDuration": 1 if pkg["durasi"] == criteria["criteria"] else 0,  # Cocok durasi
                "normalizedPreference": 1 if pkg["preferensi"] == criteria["type"] else 0  # Cocok preferensi
            })

        # Step 2: Hitung skor MOORA
        scored_data = []
        for pkg in normalized_data:
            score = (
                bobot["harga"] * pkg["normalizedPrice"] +
                bobot["objek"] * pkg["normalizedAttractions"] +
                bobot["durasi"] * pkg["normalizedDuration"] +
                bobot["type"] * pkg["normalizedPreference"]
            )
            scored_data.append({**pkg, "score": score})

        # Step 3: Urutkan berdasarkan skor tertinggi
        recommendations = sorted(scored_data, key=lambda x: x["score"], reverse=True)

        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Menjalankan server
if __name__ == "__main__":
    app.run(debug=True, port=5000)

