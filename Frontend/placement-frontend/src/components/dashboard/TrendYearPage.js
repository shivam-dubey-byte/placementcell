import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TrendYearPage = () => {
  const { year } = useParams();
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5007/api/pacementtrend/filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ year, offer: { $in: ["P", "I+P"] } }),
    })
      .then(res => res.json())
      .then(data => {
        setStudents(data.students || []);
        setCurrentPage(1);
      });
  }, [year]);

  const totalPages = Math.ceil(students.length / pageSize);
  const paginated = students.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const styles = {
    container: { padding: "20px", fontFamily: "Segoe UI, sans-serif" },
    heading: { fontSize: "24px", fontWeight: "600", marginBottom: "16px", color: "#333" },
    tableWrapper: { overflowX: "auto", borderRadius: "8px", border: "1px solid #ddd" },
    table: { width: "100%", borderCollapse: "collapse", minWidth: "600px" },
    th: {
      backgroundColor: "#f5f5f5",
      padding: "12px",
      borderBottom: "1px solid #ccc",
      textAlign: "left"
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #eee",
      color: "#444"
    },
    empty: {
      textAlign: "center",
      padding: "20px",
      fontStyle: "italic",
      color: "#777"
    },
    pagination: {
      marginTop: "20px",
      display: "flex",
      justifyContent: "center",
      gap: "6px",
      flexWrap: "wrap"
    },
    pageBtn: (active = false) => ({
      padding: "8px 14px",
      border: "1px solid #ccc",
      backgroundColor: active ? "#007bff" : "#fff",
      color: active ? "#fff" : "#333",
      borderRadius: "5px",
      fontWeight: active ? "bold" : "normal",
      cursor: active ? "default" : "pointer",
      minWidth: "36px"
    }),
  };

  const renderPagination = () => {
    const buttons = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    if (currentPage > 1) {
      buttons.push(
        <button key="prev" onClick={() => setCurrentPage(currentPage - 1)} style={styles.pageBtn()}>
          ⬅
        </button>
      );
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          style={styles.pageBtn(currentPage === i)}
          disabled={currentPage === i}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      buttons.push(
        <button key="next" onClick={() => setCurrentPage(currentPage + 1)} style={styles.pageBtn()}>
          ➡
        </button>
      );
    }

    return <div style={styles.pagination}>{buttons}</div>;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Placed Students in {year}</h2>

      {students.length === 0 ? (
        <p style={styles.empty}>No placed students found for {year}.</p>
      ) : (
        <>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Reg. No</th>
                  <th style={styles.th}>Email</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((s, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{s.name}</td>
                    <td style={styles.td}>{s.registration}</td>
                    <td style={styles.td}>{s.email || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default TrendYearPage;
