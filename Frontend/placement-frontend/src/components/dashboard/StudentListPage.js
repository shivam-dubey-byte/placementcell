import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const StudentListPage = () => {
  const { year } = useParams();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5007/api/students/filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ year, working: status }),
        });

        const data = await res.json();
        setStudents(data.students || []);
        setCurrentPage(1);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchData();
  }, [year, status]);

  const totalPages = Math.ceil(students.length / pageSize);
  const paginated = students.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDownloadCSV = () => {
    const headers = ["Name", "Reg. No", "Email"];
    const rows = students.map(s => [s.name, s.registration, s.email || "N/A"]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Students_${status}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const styles = {
    container: {
      padding: "24px",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      minHeight: "100dvh",
    },
    card: {
      maxWidth: "1100px",
      margin: "0 auto",
      background: "#fff",
      borderRadius: "18px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      padding: "32px",
    },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "12px",
      marginBottom: "30px",
      borderBottom: "2px solid #e0e6ed",
      paddingBottom: "12px",
    },
    headingText: {
      fontSize: "26px",
      fontWeight: "700",
      color: "#1f2d3d",
      margin: 0,
    },
    yearBadge: {
      fontSize: "13px",
      background: "#0072ff",
      color: "#fff",
      padding: "4px 10px",
      borderRadius: "30px",
      marginLeft: "12px",
      fontWeight: 600,
    },
    downloadBtn: {
      padding: "10px 20px",
      background: "linear-gradient(to right, #00c6ff, #0072ff)",
      color: "#fff",
      border: "none",
      borderRadius: "50px",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "14px",
      boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
    },
    tableWrapper: {
      overflowX: "auto",
      borderRadius: "12px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "650px",
    },
    th: {
      background: "#f8f9fb",
      padding: "14px",
      textAlign: "left",
      fontWeight: "600",
      color: "#34495e",
      fontSize: "15px",
    },
    td: {
      padding: "14px",
      borderBottom: "1px solid #e9ecef",
      color: "#495057",
      fontSize: "14px",
      transition: "background 0.2s ease-in-out",
    },
    row: {
      transition: "background 0.3s ease",
    },
    rowHover: {
      backgroundColor: "#e9f5ff",
    },
    empty: {
      textAlign: "center",
      color: "#6c757d",
      padding: "32px",
      fontStyle: "italic",
      fontSize: "16px",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      marginTop: "28px",
      flexWrap: "wrap",
      gap: "8px",
    },
    pageBtn: (active = false) => ({
      padding: "8px 16px",
      borderRadius: "50px",
      border: "1px solid #ced4da",
      backgroundColor: active ? "#007bff" : "#fff",
      color: active ? "#fff" : "#495057",
      fontWeight: active ? "bold" : "normal",
      cursor: active ? "default" : "pointer",
      boxShadow: active ? "0 2px 6px rgba(0,123,255,0.3)" : "none",
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
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <h2 style={styles.headingText}>
            {status} Students
            <span style={styles.yearBadge}>{year}</span>
          </h2>
          <button style={styles.downloadBtn} onClick={handleDownloadCSV}>⬇ Download CSV</button>
        </div>

        {students.length === 0 ? (
          <p style={styles.empty}>No students found for "{status}" in {year}.</p>
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
                    <tr
                      key={i}
                      style={styles.row}
                      onMouseEnter={(e) => e.currentTarget.style.background = styles.rowHover.backgroundColor}
                      onMouseLeave={(e) => e.currentTarget.style.background = ""}
                    >
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
    </div>
  );
};

export default StudentListPage;
