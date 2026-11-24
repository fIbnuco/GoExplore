from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Konfigurasi database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/goexplore23'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Model untuk tabel alternative
class Alternative(db.Model):
    __tablename__ = 'alternative'

    id_alternative = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    harga = db.Column(db.Integer, nullable=False)
    durasi = db.Column(db.String(100), nullable=False)
    preferensi = db.Column(db.String(100), nullable=False)
    objek = db.Column(db.Integer, nullable=False)

# Model untuk tabel criteria
class Criteria(db.Model):
    __tablename__ = 'criteria'

    id_criteria = db.Column(db.Integer, primary_key=True, autoincrement=True)
    criteria = db.Column(db.String(100), nullable=False)
    type = db.Column(db.Enum('benefit', 'cost'), nullable=False)

# Model untuk tabel evaluasi
class Evaluasi(db.Model):
    __tablename__ = 'evaluasi'

    id_evaluasi = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_alternative = db.Column(db.Integer, db.ForeignKey('alternative.id_alternative'), nullable=False)
    id_criteria = db.Column(db.Integer, db.ForeignKey('criteria.id_criteria'), nullable=False)
    nilai = db.Column(db.Float, nullable=False)

# Fungsi untuk membuat tabel dan mengisi data
def seed_data():
    db.create_all()

    # Data untuk tabel alternative
    alternatives = [
        Alternative(name='Jogja Heritage Journey', harga=2800000, durasi='3 Hari 2 Malam', preferensi='Anak-anak', objek=8),
        Alternative(name='Jogja Accessible Heritage Tour', harga=800000, durasi='1 Hari', preferensi='Disabilitas', objek=4),
        Alternative(name='Hidden Gems of Jogja', harga=1500000, durasi='2 Hari 1 Malam', preferensi='Lansia', objek=6),
        Alternative(name='Jogja Culinary Delight', harga=1700000, durasi='1 Hari', preferensi='Lansia', objek=5),
        Alternative(name='Romantic Jogja Escape', harga=3000000, durasi='3 Hari 2 Malam', preferensi='Anak-anak', objek=8),
        Alternative(name='Art and Soul of Jogja', harga=2800000, durasi='2 Hari 1 Malam', preferensi='Lansia', objek=7),
        Alternative(name='Jogja Eco Adventure', harga=2200000, durasi='2 Hari 1 Malam', preferensi='Anak-anak', objek=7),
        Alternative(name='Jogja Natural & Cultural Accessible', harga=950000, durasi='1 Hari', preferensi='Disabilitas', objek=4),
        Alternative(name='Jogja Nature Escape', harga=1200000, durasi='1 Hari', preferensi='Disabilitas', objek=5),
    ]
    db.session.bulk_save_objects(alternatives)

    # Data untuk tabel criteria
    criteria = [
        Criteria(criteria='harga', type='cost'),
        Criteria(criteria='durasi', type='benefit'),
        Criteria(criteria='preferensi', type='benefit'),
        Criteria(criteria='jumlah_objek_wisata', type='benefit'),
    ]
    db.session.bulk_save_objects(criteria)

    # Data untuk tabel evaluasi
    evaluasi = [
        Evaluasi(id_alternative=1, id_criteria=1, nilai=2800000),
        Evaluasi(id_alternative=1, id_criteria=2, nilai=3),
        Evaluasi(id_alternative=1, id_criteria=3, nilai=2),
        Evaluasi(id_alternative=1, id_criteria=4, nilai=8),
        Evaluasi(id_alternative=2, id_criteria=1, nilai=800000),
        Evaluasi(id_alternative=2, id_criteria=2, nilai=1),
        Evaluasi(id_alternative=2, id_criteria=3, nilai=3),
        Evaluasi(id_alternative=2, id_criteria=4, nilai=4),
        Evaluasi(id_alternative=3, id_criteria=1, nilai=1500000),
        Evaluasi(id_alternative=3, id_criteria=2, nilai=2),
        Evaluasi(id_alternative=3, id_criteria=3, nilai=1),
        Evaluasi(id_alternative=3, id_criteria=4, nilai=6),
        Evaluasi(id_alternative=4, id_criteria=1, nilai=1700000),
        Evaluasi(id_alternative=4, id_criteria=2, nilai=1),
        Evaluasi(id_alternative=4, id_criteria=3, nilai=1),
        Evaluasi(id_alternative=4, id_criteria=4, nilai=5),
        Evaluasi(id_alternative=5, id_criteria=1, nilai=3000000),
        Evaluasi(id_alternative=5, id_criteria=2, nilai=3),
        Evaluasi(id_alternative=5, id_criteria=3, nilai=2),
        Evaluasi(id_alternative=5, id_criteria=4, nilai=8),
        Evaluasi(id_alternative=6, id_criteria=1, nilai=2800000),
        Evaluasi(id_alternative=6, id_criteria=2, nilai=2),
        Evaluasi(id_alternative=6, id_criteria=3, nilai=1),
        Evaluasi(id_alternative=6, id_criteria=4, nilai=7),
        Evaluasi(id_alternative=7, id_criteria=1, nilai=2200000),
        Evaluasi(id_alternative=7, id_criteria=2, nilai=2),
        Evaluasi(id_alternative=7, id_criteria=3, nilai=2),
        Evaluasi(id_alternative=7, id_criteria=4, nilai=7),
        Evaluasi(id_alternative=8, id_criteria=1, nilai=950000),
        Evaluasi(id_alternative=8, id_criteria=2, nilai=1),
        Evaluasi(id_alternative=8, id_criteria=3, nilai=3),
        Evaluasi(id_alternative=8, id_criteria=4, nilai=4),
        Evaluasi(id_alternative=9, id_criteria=1, nilai=1200000),
        Evaluasi(id_alternative=9, id_criteria=2, nilai=1),
        Evaluasi(id_alternative=9, id_criteria=3, nilai=3),
        Evaluasi(id_alternative=9, id_criteria=4, nilai=5),
    ]
    db.session.bulk_save_objects(evaluasi)

    db.session.commit()
    print("Data berhasil ditambahkan ke tabel.")

if __name__ == '__main__':
    with app.app_context():
        seed_data()

