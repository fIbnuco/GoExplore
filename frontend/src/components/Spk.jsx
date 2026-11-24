import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [packages, setPackages] = useState([]);
  const [criteria, setCriteria] = useState({
    harga: 800000,
    durasi: "1 Hari",
    type: "Disabilitas",
    objek: 4,
  });

  const [weights, setWeights] = useState({
    harga: 0.4,
    durasi: 0.3,
    type: 0.2,
    objek: 0.1,
  });

  const [recommendations, setRecommendations] = useState([]);
  const [normalizedData, setNormalizedData] = useState([]);

  // Duration mapping for normalization
  const durationValues = {
    "1 Hari": 1,
    "2 Hari 1 Malam": 2,
    "3 Hari 2 Malam": 3
  };

  // Preference similarity scores
  const preferenceMatrix = {
    "Anak-anak": {
      "Anak-anak": 1.0,
      "Disabilitas": 0.5,
      "Lansia": 0.3
    },
    "Disabilitas": {
      "Anak-anak": 0.5,
      "Disabilitas": 1.0,
      "Lansia": 0.7
    },
    "Lansia": {
      "Anak-anak": 0.3,
      "Disabilitas": 0.7,
      "Lansia": 1.0
    }
  };


  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/packages");
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  // const calculateNormalizationMatrix = () => {
  //   if (packages.length === 0) return;

  //   const criteriaKeys = ["harga", "durasi", "preferensi", "objek"];
  //   const normalizationFactors = criteriaKeys.reduce((factors, key) => {
  //     const sumSquares = packages.reduce(
  //       (sum, pkg) => sum + Math.pow(pkg[key], 2),
  //       0
  //     );
  //     factors[key] = Math.sqrt(sumSquares);
  //     return factors;
  //   }, {});

  //   const normalizedPackages = packages.map((pkg) => {
  //     return {
  //       name: pkg.name,
  //       normalized: {
  //         harga: pkg.harga / normalizationFactors.harga,
  //         objek: pkg.objek / normalizationFactors.objek,
  //         durasi: pkg.durasi === criteria.durasi ? 1 : 0,
  //         preferensi: pkg.preferensi === criteria.type ? 1 : 0,
  //       },
  //     };
  //   });

  //   setNormalizedData(normalizedPackages);
  // };

  const handleCriteriaChange = (e) => {
    const { name, value } = e.target;

    if (name === "harga") {
      const numericValue = value.replace(/\D/g, "");
      setCriteria((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setCriteria((prev) => ({
        ...prev,
        [name]:
          name === "objek" ? Math.min(Math.max(parseInt(value), 4), 10) : value,
      }));
    }
    // Reset recommendations and recalculate normalization when criteria change
    setRecommendations([]);
    setNormalizedData([]);
    // calculateMOORARecommendations(); // Call to recalculate recommendations
  };

  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    let numericValue = parseFloat(value);

    // Pastikan nilai tidak kurang dari 0.1
    if (isNaN(numericValue) || numericValue < 0.1) {
      numericValue = 0.1;
    }

    setWeights((prev) => {
      const newWeights = { ...prev, [name]: numericValue };
      const totalWeight = Object.values(newWeights).reduce(
        (sum, weight) => sum + weight,
        0
      );

      // Jika total bobot lebih dari 1, sesuaikan bobot lainnya
      if (totalWeight > 1) {
        const adjustmentFactor = 1 / totalWeight;
        const adjustedWeights = Object.fromEntries(
          Object.entries(newWeights).map(([key, weight]) => [
            key,
            weight * adjustmentFactor,
          ])
        );

        // Pastikan tidak ada bobot yang kurang dari 0.1
        const minWeight = 0.1;
        const adjustedTotal = Object.values(adjustedWeights).reduce(
          (sum, weight) => sum + weight,
          0
        );

        // Jika total setelah penyesuaian kurang dari 1, kita perlu menyesuaikan kembali
        if (adjustedTotal < 1) {
          const remainingWeight = 1 - adjustedTotal;
          const weightAdjustment =
            remainingWeight / Object.keys(adjustedWeights).length;

          return Object.fromEntries(
            Object.entries(adjustedWeights).map(([key, weight]) => {
              const newWeight = Math.max(weight + weightAdjustment, minWeight); // Pastikan tidak kurang dari 0.1
              return [key, newWeight];
            })
          );
        }

        return adjustedWeights;
      }

      return newWeights;
    });

    // Reset recommendations when weights change
    setRecommendations([]);
    setNormalizedData([]);
    // calculateMOORARecommendations(); // Call to recalculate recommendations
  };

  const calculateMOORARecommendations = () => {
    if (packages.length === 0) return;

    // Step 1: Calculate normalization factors
    const sumSquares = {
      harga: Math.sqrt(packages.reduce((sum, pkg) => sum + Math.pow(pkg.harga, 2), 0)),
      durasi: Math.sqrt(packages.reduce((sum, pkg) => sum + Math.pow(durationValues[pkg.durasi], 2), 0)),
      objek: Math.sqrt(packages.reduce((sum, pkg) => sum + Math.pow(pkg.objek, 2), 0))
    };

    // Step 2: Normalize the data
    const normalizedPackages = packages.map(pkg => {
      const normalized = {
        harga: pkg.harga / sumSquares.harga,
        durasi: durationValues[pkg.durasi] / sumSquares.durasi,
        preferensi: preferenceMatrix[criteria.type][pkg.preferensi],
        objek: pkg.objek / sumSquares.objek
      };
      return { ...pkg, normalized };
    });

    setNormalizedData(normalizedPackages);

    // Step 3: Calculate MOORA scores
    const scores = normalizedPackages.map(pkg => {
      const benefit = 
        weights.durasi * pkg.normalized.durasi +
        weights.type * pkg.normalized.preferensi +
        weights.objek * pkg.normalized.objek;
      const cost = weights.harga * pkg.normalized.harga;
      
      const score = benefit - cost;
      return { ...pkg, score };
    });

    // Step 4: Adjust scores to be non-negative
    const minScore = Math.min(...scores.map(pkg => pkg.score));
    const adjustedScores = scores.map(pkg => ({
      ...pkg,
      score: pkg.score - minScore + 1
    }));

    // Step 5: Rank the packages
    const rankedPackages = adjustedScores
      .sort((a, b) => b.score - a.score)
      .map((pkg, index) => ({
        ...pkg,
        ranking: index + 1
      }));

    setRecommendations(rankedPackages);
  };

  // const calculateMOORARecommendations = () => {
  //   if (packages.length === 0) return;

  //   // Langkah 1: Normalisasi Matriks Keputusan
  //   const criteriaKeys = ["harga", "durasi", "preferensi", "objek"];
  //   const normalizationFactors = criteriaKeys.reduce((factors, key) => {
  //     const sumSquares = packages.reduce(
  //       (sum, pkg) => sum + Math.pow(pkg[key], 2),
  //       0
  //     );
  //     factors[key] = Math.sqrt(sumSquares);
  //     return factors;
  //   }, {});

  //   const normalizedPackages = packages.map((pkg) => {
  //     const normalized = {
  //       harga: pkg.harga / normalizationFactors.harga,
  //       objek: pkg.objek / normalizationFactors.objek,
  //       durasi: pkg.durasi === criteria.durasi ? 1 : 0,
  //       preferensi: pkg.preferensi === criteria.type ? 1 : 0,
  //     };
  //     return { ...pkg, normalized };
  //   });

  //   // Simpan data normalisasi
  //   setNormalizedData(normalizedPackages);

  //   // Langkah 2: Hitung nilai MOORA
  //   const scores = normalizedPackages.map((pkg) => {
  //     const benefit =
  //       weights.durasi * pkg.normalized.durasi +
  //       weights.type * pkg.normalized.preferensi +
  //       weights.objek * pkg.normalized.objek;
  //     const cost = weights.harga * pkg.normalized.harga;

  //     const score = benefit - cost;
  //     return { ...pkg, score };
  //   });

  //   // Langkah 3: Penyesuaian agar tidak ada nilai negatif
  //   const minScore = Math.min(...scores.map((pkg) => pkg.score));
  //   const adjustedScores = scores.map((pkg) => ({
  //     ...pkg,
  //     score: pkg.score - minScore + 1,
  //   }));

  //   // Langkah 4: Ranking
  //   const rankedPackages = adjustedScores
  //     .sort((a, b) => b.score - a.score)
  //     .map((pkg, index) => ({
  //       ...pkg,
  //       ranking: index + 1,
  //     }));

  //   setRecommendations(rankedPackages);
  // };



  // const calculateMOORARecommendations = () => {
  //   if (packages.length === 0) return;

  //   // Langkah 1: Normalisasi Matriks Keputusan
  //   const criteriaKeys = ["harga", "durasi", "preferensi", "objek"];
  //   const normalizationFactors = criteriaKeys.reduce((factors, key) => {
  //     const sumSquares = packages.reduce(
  //       (sum, pkg) => sum + Math.pow(pkg[key], 2),
  //       0
  //     );
  //     factors[key] = Math.sqrt(sumSquares);
  //     return factors;
  //   }, {});

  //   const normalizedPackages = packages.map((pkg) => {
  //     // Mengacak preferensi sebelum normalisasi
  //     // const randomPreference = Math.random() < 0.5 ? "Anak-anak" : "Lansia"; // Atau Anda bisa menambahkan pilihan lain
  //     const normalized = {
  //       harga: pkg.harga / normalizationFactors.harga,
  //       objek: pkg.objek / normalizationFactors.objek,
  //       durasi: pkg.durasi === criteria.durasi ? 1 : 0,
  //       preferensi: pkg.preferensi === criteria.type ? 1 : 0, // Menggunakan preferensi acak
  //     };
  //     return { ...pkg, normalized };
  //   });

  //   // Langkah 2: Hitung nilai MOORA
  //   const scores = normalizedPackages.map((pkg) => {
  //     const benefit =
  //       weights.durasi * pkg.normalized.durasi +
  //       weights.type * pkg.normalized.preferensi +
  //       weights.objek * pkg.normalized.objek;
  //     const cost = weights.harga * pkg.normalized.harga;

  //     const score = benefit - cost;
  //     return { ...pkg, score };
  //   });

  //   // Langkah 3: Penyesuaian agar tidak ada nilai negatif
  //   const minScore = Math.min(...scores.map((pkg) => pkg.score));
  //   const adjustedScores = scores.map((pkg) => ({
  //     ...pkg,
  //     score: pkg.score - minScore + 1, // Geser semua nilai agar minimal 1
  //   }));

  //   // Langkah 4: Ranking
  //   const rankedPackages = adjustedScores
  //     .sort((a, b) => b.score - a.score)
  //     .map((pkg, index) => ({
  //       ...pkg,
  //       ranking: index + 1,
  //     }));

  //   setRecommendations(rankedPackages);
  // };

  // const calculateMOORARecommendations = () => {
  //   if (packages.length === 0) return;

  //   // Step 1: Normalisasi Matriks Keputusan
  //   const criteriaKeys = ["harga", "durasi", "preferensi", "objek"];
  //   const normalizationFactors = criteriaKeys.reduce((factors, key) => {
  //     const sumSquares = packages.reduce(
  //       (sum, pkg) => sum + Math.pow(pkg[key], 2),
  //       0
  //     );
  //     factors[key] = Math.sqrt(sumSquares);
  //     return factors;
  //   }, {});

  //   const normalizedPackages = packages.map((pkg) => {
  //     const normalized = {
  //       harga: pkg.harga / normalizationFactors.harga,
  //       objek: pkg.objek / normalizationFactors.objek,
  //       durasi: pkg.duration === criteria.durasi ? 1 : 0,
  //       preferensi: pkg.preferensi === criteria.type ? 1 : 0,
  //     };
  //     return { ...pkg, normalized };
  //   });

  //   // Step 2: Hitung nilai MOORA
  //   const scores = normalizedPackages.map((pkg) => {
  //     const benefit =
  //       weights.durasi * pkg.normalized.durasi +
  //       weights.type * pkg.normalized.preferensi +
  //       weights.objek * pkg.normalized.objek;
  //     const cost = weights.harga * pkg.normalized.harga;

  //     const score = benefit - cost;
  //     return { ...pkg, score };
  //   });

  //   // Step 3: Penyesuaian agar tidak ada nilai negatif
  //   const minScore = Math.min(...scores.map((pkg) => pkg.score));
  //   const adjustedScores = scores.map((pkg) => ({
  //     ...pkg,
  //     score: pkg.score - minScore + 1, // Geser semua nilai agar minimal 1
  //   }));

  //   // Step 4: Ranking
  //   const rankedPackages = adjustedScores
  //     .sort((a, b) => b.score - a.score)
  //     .map((pkg, index) => ({
  //       ...pkg,
  //       ranking: index + 1,
  //     }));

  //   setRecommendations(rankedPackages);
  // };

  //   const calculateMOORARecommendations = () => {
  //   if (packages.length === 0) return;

  //   // Step 1: Normalisasi Matriks Keputusan
  //   const criteriaKeys = ["harga", "durasi", "preferensi", "objek"];
  //   const normalizationFactors = criteriaKeys.reduce((factors, key) => {
  //     const sumSquares = packages.reduce(
  //       (sum, pkg) => sum + Math.pow(pkg[key], 2),
  //       0
  //     );
  //     factors[key] = Math.sqrt(sumSquares);
  //     return factors;
  //   }, {});

  //   const normalizedPackages = packages.map((pkg) => {
  //     const normalized = {
  //       harga: pkg.harga / normalizationFactors.harga,
  //       objek: pkg.objek / normalizationFactors.objek,
  //       durasi: pkg.duration === criteria.durasi ? 1 : 0,
  //       preferensi: pkg.preferensi === criteria.type ? 1 : 0,
  //     };
  //     return { ...pkg, normalized };
  //   });

  //   // Step 2: Hitung nilai MOORA
  //   const scores = normalizedPackages.map((pkg) => {
  //     const benefit =
  //       weights.durasi * pkg.normalized.durasi +
  //       weights.type * pkg.normalized.preferensi +
  //       weights.objek * pkg.normalized.objek;
  //     const cost = weights.harga * pkg.normalized.harga;

  //     const score = benefit - cost;
  //     return { ...pkg, score };
  //   });

  //   // Step 3: Ranking
  //   const rankedPackages = scores
  //     .sort((a, b) => b.score - a.score)
  //     .map((pkg, index) => ({
  //       ...pkg,
  //       ranking: index + 1,
  //     }));

  //   setRecommendations(rankedPackages);
  // };

  // const calculateMOORARecommendations = () => {
  //   if (packages.length === 0) return;

  //   // Step 1: Normalisasi
  //   const criteriaKeys = ["harga", "objek"]; // Kriteria numerik untuk normalisasi
  //   const normalizedPackages = packages.map((pkg) => {
  //     const normalizedValues = {};
  //     criteriaKeys.forEach((key) => {
  //       const sumSquares = packages.reduce(
  //         (sum, p) => sum + Math.pow(p[key], 2),
  //         0
  //       );
  //       normalizedValues[key] = pkg[key] / Math.sqrt(sumSquares);
  //     });

  //     return { ...pkg, normalized: normalizedValues };
  //   });

  //   // Step 2: Hitung nilai MOORA
  //   const scores = normalizedPackages.map((pkg) => {
  //     let score = 0;

  //     // Benefit criteria (e.g., jumlah objek wisata)
  //     score += weights.objek * pkg.normalized.objek;

  //     // Cost criteria (e.g., harga)
  //     score -= weights.harga * pkg.normalized.harga;

  //     return { ...pkg, score };
  //   });

  //   // Step 3: Ranking
  //   const rankedPackages = scores
  //     .sort((a, b) => b.score - a.score)
  //     .map((pkg, index) => ({
  //       ...pkg,
  //       ranking: index + 1,
  //     }));

  //   setRecommendations(rankedPackages);
  // };

  // const calculateRecommendations = () => {
  //   const scores = packages.map((pkg) => {
  //     let score = 0.1;

  //     if (pkg.harga <= criteria.harga) {
  //       score += weights.harga;
  //     }

  //     if (pkg.duration === criteria.durasi) {
  //       score += weights.durasi;
  //     }

  //     if (pkg.preferensi === criteria.type) {
  //       score += weights.type;
  //     }

  //     if (pkg.objek >= criteria.objek) {
  //       score += weights.objek;
  //     }

  //     return { ...pkg, score };
  //   });

  //   const sortedScores = scores.sort((a, b) => b.score - a.score);
  //   const rankedScores = sortedScores.map((pkg, index) => ({
  //     ...pkg,
  //     ranking: index + 1,
  //   }));

  //   setRecommendations(rankedScores);
  // };

  const isCriteriaValid = () => {
    return criteria.harga > 0 && criteria.objek >= 4;
  };

  return (
    <div id="spk" style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ color: "#0077b6", textAlign: "center" }}>
        Rekomendasi Paket Wisata Jogja
      </h1>
      <p style={{ textAlign: "center", fontSize: "18px" }}>
        Silahkan Pilih Kriteria dan Bobot yang Anda Inginkan
      </p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: "#0077b6",
                color: "white",
                padding: "12px",
                fontSize: "16px",
                borderBottom: "2px solid #ddd",
              }}
            >
              Kriteria
            </th>
            <th
              style={{
                backgroundColor: "#0077b6",
                color: "white",
                padding: "12px",
                fontSize: "16px",
                borderBottom: "2px solid #ddd",
              }}
            >
              Pilihan
            </th>
            <th
              style={{
                backgroundColor: "#0077b6",
                color: "white",
                padding: "12px",
                fontSize: "16px",
                borderBottom: "2px solid #ddd",
              }}
            >
              Bobot
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              Budget
            </td>
            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              <input
                type="text"
                name="harga"
                value={criteria.harga}
                onChange={handleCriteriaChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                }}
              />
              {!criteria.harga && (
                <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  Silahkan isi terlebih dahulu budget Anda.
                </p>
              )}
            </td>
            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              <input
                type="number"
                name="harga"
                value={weights.harga.toFixed(1)}
                onChange={handleWeightChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                }}
                min="0.1"
                step="0.1"
              />
            </td>
          </tr>

          <tr>
            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              Durasi
            </td>
            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              <select
                name="durasi"
                value={criteria.durasi}
                onChange={handleCriteriaChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                }}
              >
                <option value="1 Hari">1 Hari</option>
                <option value="2 Hari 1 Malam">2 Hari 1 Malam</option>
                <option value="3 Hari 2 Malam">3 Hari 2 Malam</option>
              </select>
            </td>
            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              <input
                type="number"
                name="durasi"
                value={weights.durasi.toFixed(1)}
                onChange={handleWeightChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                }}
                min="0.1"
                step="0.1"
              />
            </td>
          </tr>

          <tr>
            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              Preferensi Khusus
            </td>
            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              <select
                name="type"
                value={criteria.type}
                onChange={handleCriteriaChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                }}
              >
                <option value="Anak-anak">Anak-anak</option>
                <option value="Disabilitas">Disabilitas</option>
                <option value="Lansia">Lansia</option>
              </select>
            </td>
            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              <input
                type="number"
                name="type"
                value={weights.type.toFixed(1)}
                onChange={handleWeightChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                }}
                min="0.1"
                step="0.1"
              />
            </td>
          </tr>

          <tr>
            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              Jumlah Objek Wisata
            </td>
            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              <input
                type="number"
                name="objek"
                value={criteria.objek}
                onChange={handleCriteriaChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                }}
                min="4"
                max="10"
              />
            </td>
            <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              <input
                type="number"
                name="objek"
                value={weights.objek.toFixed(1)}
                onChange={handleWeightChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                }}
                min="0.1"
                step="0.1"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={calculateMOORARecommendations}
        disabled={!isCriteriaValid()}
        style={{
          backgroundColor: isCriteriaValid() ? "#23c24d" : "#ccc",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: isCriteriaValid() ? "pointer" : "not-allowed",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        Hitung Rekomendasi
      </button>

      <h2 style={{ marginTop: "30px", color: "#0077b6", textAlign: "center" }}>
        Hasil Rekomendasi
      </h2>

      {isCriteriaValid() && recommendations.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "2px solid #0077b6",
            borderRadius: "10px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            marginTop: "20px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  backgroundColor: "#0077b6",
                  color: "white",
                  padding: "12px",
                  borderBottom: "2px solid #ddd",
                  fontSize: "16px",
                }}
              >
                Nama Paket
              </th>
              <th
                style={{
                  backgroundColor: "#0077b6",
                  color: "white",
                  padding: "12px",
                  borderBottom: "2px solid #ddd",
                  fontSize: "16px",
                }}
              >
                Harga
              </th>
              <th
                style={{
                  backgroundColor: "#0077b6",
                  color: "white",
                  padding: "12px",
                  borderBottom: "2px solid #ddd",
                  fontSize: "16px",
                }}
              >
                Durasi
              </th>
              <th
                style={{
                  backgroundColor: "#0077b6",
                  color: "white",
                  padding: "12px",
                  borderBottom: "2px solid #ddd",
                  fontSize: "16px",
                }}
              >
                Preferensi Khusus
              </th>
              <th
                style={{
                  backgroundColor: "#0077b6",
                  color: "white",
                  padding: "12px",
                  borderBottom: "2px solid #ddd",
                  fontSize: "16px",
                }}
              >
                Jumlah Objek Wisata
              </th>
              <th
                style={{
                  backgroundColor: "#0077b6",
                  color: "white",
                  padding: "12px",
                  borderBottom: "2px solid #ddd",
                  fontSize: "16px",
                }}
              >
                MOORA Score
              </th>
              <th
                style={{
                  backgroundColor: "#0077b6",
                  color: "white",
                  padding: "12px",
                  borderBottom: "2px solid #ddd",
                  fontSize: "16px",
                }}
              >
                Peringkat
              </th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((pkg, index) => (
              <tr key={index}>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {pkg.name}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  Rp. {pkg.harga}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {pkg.durasi}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {pkg.preferensi}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {pkg.objek}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {pkg.score.toFixed(2)}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {pkg.ranking}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", fontSize: "16px", color: "#555" }}>
          Silahkan isi kriteria yang diperlukan untuk menampilkan rekomendasi.
        </p>
      )}

      <button
        onClick={calculateMOORARecommendations}
        style={{
          backgroundColor: "#0077b6",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          marginTop: "20px",
        }}
      >
        Hitung Normalisasi Matriks
      </button>

      {normalizedData.length > 0 && (
        <div>
          <h2
            style={{
              marginTop: "30px",
              color: "# 0077b6",
              textAlign: "center",
            }}
          >
            Tabel Normalisasi Matriks
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "2px solid #0077b6",
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              marginTop: "20px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: "#0077b6",
                    color: "white",
                    padding: "12px",
                  }}
                >
                  Nama Paket
                </th>
                <th
                  style={{
                    backgroundColor: "#0077b6",
                    color: "white",
                    padding: "12px",
                  }}
                >
                  Normalisasi Harga
                </th>
                <th
                  style={{
                    backgroundColor: "#0077b6",
                    color: "white",
                    padding: "12px",
                  }}
                >
                  Normalisasi Durasi
                </th>
                <th
                  style={{
                    backgroundColor: "#0077b6",
                    color: "white",
                    padding: "12px",
                  }}
                >
                  Normalisasi Preferensi
                </th>
                <th
                  style={{
                    backgroundColor: "#0077b6",
                    color: "white",
                    padding: "12px",
                  }}
                >
                  Normalisasi Objek
                </th>
              </tr>
            </thead>
            <tbody>
              {normalizedData.map((pkg, index) => (
                <tr key={index}>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                  >
                    {pkg.name}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                  >
                    {pkg.normalized.harga.toFixed(2)}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                  >
                    {pkg.normalized.durasi.toFixed(2)}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                  >
                    {pkg.normalized.preferensi.toFixed(2)}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                  >
                    {pkg.normalized.objek.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
