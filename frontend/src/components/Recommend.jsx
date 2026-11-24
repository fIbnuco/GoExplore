import React, { useState } from "react";
import styled from "styled-components";
import Destination1 from "../assets/taman sari.jpg";
import Destination2 from "../assets/kaliurang.jpg";
import Destination3 from "../assets/pantai drini.jpg";
import Destination4 from "../assets/obelix.jpg";
import Destination5 from "../assets/Pantai Parangtritis.jpeg";
import Destination6 from "../assets/heha.jpg";
import Destination7 from "../assets/bukit.jpeg";
import Destination8 from "../assets/drini.jpg";
import Destination9 from "../assets/paralayang.jpeg";
// import info1 from "../assets/info1.png";
import info2 from "../assets/info2.png";
import info3 from "../assets/info3.png";

export default function Recommend() {
  const data = [
    {
      image: Destination1,
      title: "Jogja Heritage Journey",
      subTitle: "Destinasi Wisata: ",
      subTitle2:
        "Candi Borobudur, Prambanan, Telogo Putri, Ratu Boko untuk sunset, Wisata Keraton, Taman Sari, Alun-Alun Selatan, dan Malioboro",
      subTitle3:
        "Preferensi: Anak-anak",
      subTitle4: "Cocok untuk anak-anak yang ingin bermain sambil belajar di lingkungan yang aman dan menarik.",
      cost: "Rp. 2.800.000",
      duration: "3 Hari 2 Malam",
    },
    {
      image: Destination2,
      title: "Jogja Accessible Heritage Tour",
      subTitle: "Destinasi Wisata: ",
      subTitle2:
        "Benteng Vredeburg, Malioboro, Gembira Loka, Keraton Yogyakarta",
      subTitle3:
        "Preferensi: Disabilitas",
      subTitle4: "Didesain untuk kenyamanan penyandang disabilitas, dengan akses mudah dan fasilitas yang mendukung kebutuhan khusus di setiap destinasi.",
      cost: "Rp. 800.000",
      duration: "1 Hari",
    },
    {
      image: Destination3,
      title: "Hidden Gems of Jogja ",
      subTitle: "Destinasi Wisata: ",
      subTitle2:
        "Wisata di Kalibiru, wisata Waduk Sermo, Pantai Drini, Panta Slili, wisata ke Goa Jomblang, dan Pantai Timang",
      subTitle3:
        "Preferensi: Lansia",
      subTitle4: "Destinasi ramah lansia dengan aksesibilitas penuh serta aktivitas ringan yang tidak melelahkan.",
      cost: "Rp. 1.500.000",
      duration: "2 Hari 1 Malam",
    },
    {
      image: Destination4,
      title: "Jogja Culinary Delight",
      subTitle: "Destinasi Wisata: ",
      subTitle2:
        "Berkunjung ke pasar tradisional, hunting kopi lokal, Kuliner gudeg, dan jajanan malam di Malioboro",
      subTitle3:
        "Preferensi: Lansia",
      subTitle4: "Destinasi ramah lansia dengan aksesibilitas penuh serta aktivitas ringan yang tidak melelahkan.",
      cost: "Rp. 1.700.000",
      duration: "1 Hari",
    },
    {
      image: Destination5,
      title: "Romantic Jogja Escape",
      subTitle: "Destinasi Wisata: ",
      subTitle2:
        "Pantai Parangtritis, Hutan Pinus, wisata ke Tebing Breksi, Bakpia 25, Pantai Baron, Ibarbo Park, Wisata sunset di Candi Ijo dan dinner romantis",
      subTitle3: "Preferensi: Anak-anak",
      subTitle4:
        "Cocok untuk anak-anak yang ingin bermain sambil belajar di lingkungan yang aman dan menarik.",
      cost: "Rp. 3.000.000",
      duration: "3 Hari 2 Malam",
    },
    {
      image: Destination6,
      title: "Art and Soul of Jogja",
      subTitle: "Destinasi Wisata:  ",
      subTitle2:
        "Belajar gamelan, menyaksikan pertunjukan wayang kulit, Malioboro, Tugu Jogja, Workshop batik, wisata seni ukir di Kasongan, Tour seni rupa di museum Affandi dan Ullen Sentalu",
      subTitle3: "Preferensi: Lansia",
      subTitle4:
        "Destinasi ramah lansia dengan aksesibilitas penuh serta aktivitas ringan yang tidak melelahkan.",
      cost: "Rp. 2.800.000",
      duration: "2 Hari 1 Malam",
    },
    {
      image: Destination7,
      title: "Jogja Eco Adventure",
      subTitle: "Destinasi Wisata:  ",
      subTitle2:
        "Hutan Pinus Imogiri, wisata desa bambu, Banker Kaliurang, Menyusuri Goa Pindul, Taman Nasional Gunung Merapi dan ekowisata di desa setempat",
      subTitle3: "Preferensi: Anak-anak",
      subTitle4:
        "Cocok untuk anak-anak yang ingin bermain sambil belajar di lingkungan yang aman dan menarik.",
      cost: "Rp. 2.200.000",
      duration: "2 Hari 1 Malam",
    },
    {
      image: Destination8,
      title: "Jogja Natural & Cultural Accessible",
      subTitle: "Destinasi Wisata:  ",
      subTitle2:
        "Pantai Slili, Taman Pelangi Monjali, Taman Pintar, dan Pasar Beringharjo ",
      subTitle3: "Preferensi: Disabilitas",
      subTitle4:
        "Didesain untuk kenyamanan penyandang disabilitas, dengan akses mudah dan fasilitas yang mendukung kebutuhan khusus di setiap destinasi.",
      cost: "Rp 950.000",
      duration: "1 Hari",
    },
    {
      image: Destination9,
      title: "Jogja Nature Escape",
      subTitle: "Destinasi Wisata:  ",
      subTitle2:
        "Hutan Pinus Mangunan 2, Bukit Bintang, Pantai Baron, Jogja Nasional Museum, Candi Ijo, dan Pantai Krakal",
      subTitle3: "Preferensi: Disablitas",
      subTitle4:
        "Didesain untuk kenyamanan penyandang disabilitas, dengan akses mudah dan fasilitas yang mendukung kebutuhan khusus di setiap destinasi.",
      cost: "Rp 1.200.000",
      duration: "1 Hari",
    },
  ];

  const [active, setActive] = useState(1);
  return (
    <Section id="tour">
      <div className="title">
        <h2>Tour Packages</h2>
      </div>
      <div className="packages">
        <ul>
          {/* {packages.map((pkg, index) => {
            return (
              <li
                className={active === index + 1 ? "active" : ""}
                onClick={() => setActive(index + 1)}
              >
                {pkg}
              </li>
            );
          })} */}
        </ul>
      </div>
      <div className="destinations">
        {data.map((destination) => {
          return (
            <div className="destination">
              <img src={destination.image} alt="" />
              <h3>{destination.title}</h3>
              <p>{destination.subTitle}</p>
              <p>{destination.subTitle2}</p>
              <p>{destination.subTitle3}</p>
              <p>{destination.subTitle4}</p>
              <div className="info">
                <div className="services">
                  {/* <img src={info1} alt="" /> */}
                  <img src={info2} alt="" />
                  <img src={info3} alt="" />
                </div>
                <h4>{destination.cost}</h4>
              </div>
              <div className="distance">
                {/* <span>1000 Kms</span> */}
                <span>
                  <b>{destination.duration}</b>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

const Section = styled.section`
  padding: 2rem 0;
  .title {
    text-align: center;
  }
  .packages {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
    ul {
      display: flex;
      list-style-type: none;
      width: max-content;
      li {
        padding: 1rem 2rem;
        border-bottom: 0.1rem solid black;
      }
      .active {
        border-bottom: 0.5rem solid #8338ec;
      }
    }
  }
  .destinations {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
    padding: 0 3rem;
    .destination {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background-color: #8338ec14;
      border-radius: 1rem;
      transition: 0.3s ease-in-out;
      &:hover {
        transform: translateX(0.4rem) translateY(-1rem);
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      }
      img {
        width: 100%;
      }
      .info {
        display: flex;
        align-items: center;
        .services {
          display: flex;
          gap: 0.3rem;
          img {
            border-radius: 1rem;
            background-color: #4d2ddb84;
            width: 2rem;
            /* padding: 1rem; */
            padding: 0.3rem 0.4rem;
          }
        }
        display: flex;
        justify-content: space-between;
      }
      .distance {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  @media screen and (min-width: 280px) and (max-width: 768px) {
    .packages {
      ul {
        li {
          padding: 0 0.5rem;
          font-size: 2vh;
          padding-bottom: 1rem;
        }
        .active {
          border-bottom-width: 0.3rem;
        }
      }
    }
    .destinations {
      grid-template-columns: 1fr;
      padding: 0;
    }
  }
`;
