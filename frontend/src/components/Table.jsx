import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios"; 

export default function DataTable() {
  const [alternatives, setAlternatives] = useState([]); // State untuk data dari API
  const [loading, setLoading] = useState(true); // State loading
  const [error, setError] = useState(null); // State error

  // Fetch data dari API saat komponen dimount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/packages");
        setAlternatives(response.data); // Set data ke state
      } catch (err) {
        setError(err.message); // Tangkap error jika ada
      } finally {
        setLoading(false); // Loading selesai
      }
    };

    fetchData();
  }, []);

  return (
    <TableContainer>
      {/* <h2>Daftar Paket Wisata</h2> */}
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Alternatif</th>
              <th>Harga</th>
              <th>Durasi</th>
              <th>Preferensi Khusus</th>
              <th>Jumlah Objek Wisata</th>
            </tr>
          </thead>
          <tbody>
            {alternatives.map((alt, index) => (
              <tr key={alt.id}>
                <td>{index + 1}</td>
                <td>{alt.name}</td>
                <td>{`Rp. ${alt.harga}`}</td>
                <td>{alt.durasi}</td>
                <td>{alt.preferensi}</td>
                <td>{alt.objek}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </TableContainer>
  );
}

const TableContainer = styled.div`
  margin: 2rem auto;
  width: 80%;
  overflow-x: auto;

  h2 {
    text-align: center;
    color: #0077b6;
    margin-bottom: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-family: Arial, sans-serif;
    
    thead {
      background-color: #0077b6;
      color: white;
    }

    th, td {
      padding: 0.8rem;
      border: 1px solid #ddd;
    }

    tbody tr {
      &:nth-child(even) {
        background-color: #f2f2f2;
      }

      &:hover {
        background-color: #e3f2fd;
      }
    }
  }
`;

