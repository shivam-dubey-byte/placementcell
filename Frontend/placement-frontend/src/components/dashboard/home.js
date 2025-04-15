import React, { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";

const Home = ({ userType }) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => (currentYear - i).toString());

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    studentStats: [],
    offerTypes: [],
    companyWisePlacements: [],
    placementTrend: [],
    companyVisitsPerYear: []
  });
  const [offerVsPlacement, setOfferVsPlacement] = useState([]);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = getToken();

        const [trendRes, currentStatsRes, offersPlacementRes] = await Promise.all([
          fetch("http://localhost:5006/api/dashboard/trends", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`http://localhost:5006/api/dashboard/current-year-stats?year=${selectedYear}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:5006/api/dashboard/offers-vs-placements", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const trendJson = await trendRes.json();
        const currentStatsJson = await currentStatsRes.json();
        const offersPlacementJson = await offersPlacementRes.json();

        const studentStats = currentStatsJson.studentDistribution
          .filter(item => item._id !== "NA" && item._id !== "")
          .map(item => ({ name: item._id, value: item.count }));

        const offerTypes = currentStatsJson.offerTypes.map(item => ({
          type: item._id,
          count: item.count
        }));

        const companyWisePlacements = currentStatsJson.topRecruiters.map(item => ({
          company: item._id,
          students: item.count
        }));

        const sortedTrend = [...trendJson.trends].sort((a, b) => a.year - b.year);
        const selectedYearInt = parseInt(selectedYear);
        let last6Years = sortedTrend.slice(-6);

        const selectedYearInTrend = last6Years.some(entry => entry.year === selectedYearInt);
        if (!selectedYearInTrend) {
          const selectedEntry = sortedTrend.find(entry => entry.year === selectedYearInt);
          if (selectedEntry) {
            const filtered = last6Years.slice(1);
            last6Years = [...filtered, selectedEntry];
          }
        }

        const placementTrend = last6Years.map(item => ({
          year: item.year.toString(),
          percentagePlaced: item.percentagePlaced
        }));

        const companyVisitsPerYear = last6Years.map(item => ({
          year: item.year.toString(),
          companies: item.companiesVisited
        }));

        setDashboardData({
          studentStats,
          offerTypes,
          companyWisePlacements,
          placementTrend,
          companyVisitsPerYear
        });

        setOfferVsPlacement(
          offersPlacementJson.stats.map(stat => ({
            year: stat.year.toString(),
            offers: stat.offers,
            placed: stat.placed
          }))
        );
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedYear]);

  // Style object remains identical for both user types
  const styles = {
    container: {
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      maxWidth: "1300px",
      margin: "0 auto",
      backgroundColor: "#f5f7fa",
    },
    heading: {
      fontSize: "26px",
      marginBottom: "10px",
      color: "#222",
      textAlign: "center"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
      gap: "20px",
    },
    chartBox: {
      background: "#fff",
      padding: "15px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    },
    chartTitle: {
      textAlign: "center",
      fontSize: "18px",
      marginBottom: "10px",
      color: "#333",
    },
  };

  // Conditional click handler for admin
  const handleChartClick = (path) => {
    if (userType === "admin") {
      navigate(path);
    }
  };

  // Conditional cursor style
  const chartCursorStyle = userType === "admin" ? "pointer" : "default";

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        {userType === "admin" ? "Admin Dashboard" : "Student Dashboard"}
      </h2>

{/* Year Dropdown - visible only to admin and no dropdown arrow */}
{userType === "admin" && (
  <div style={{ marginBottom: "20px" }}>
    <label style={{
      marginRight: "12px",
      fontWeight: "600",
      fontSize: "16px",
      color: "#333",
    }}>
      Select Year:
    </label>

    <select
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
      style={{
        appearance: "none",            // hides arrow in most modern browsers
        WebkitAppearance: "none",      // Safari
        MozAppearance: "none",         // Firefox
        padding: "10px 16px",
        fontSize: "15px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#fff",
        color: "#333",
        boxShadow: "0 3px 8px rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
        backgroundImage: "none"        // extra precaution
      }}
    >
      {availableYears.map((year) => (
        <option key={year} value={year}>{year}</option>
      ))}
    </select>
  </div>
)}


      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <div style={styles.grid}>
          {/* 1. Student Distribution */}
          <div style={styles.chartBox}>
            <h4 style={styles.chartTitle}>Student Distribution</h4>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.studentStats}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                    onClick={(entry) => handleChartClick(
                      `/dashboard/student-list/${selectedYear}?status=${encodeURIComponent(entry.name)}`
                    )}
                    cursor={chartCursorStyle}
                  >
                    {dashboardData.studentStats.map((entry, index) => {
                      let color = "#17a2b8";
                      if (entry.name === "Placed") color = "#28a745";
                      else if (entry.name === "Not Placed") color = "#dc3545";
                      else if (entry.name === "Higher Studies") color = "#ffc107";
                      return <Cell key={index} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Types of Offers */}
          <div style={styles.chartBox}>
            <h4 style={styles.chartTitle}>Types of Offers</h4>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.offerTypes}
                  margin={{ top: 20, bottom: 30 }}
                  barCategoryGap={30}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis domain={[0, 'dataMax + 5']} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#007bff"
                    barSize={40}
                    onClick={(entry) => handleChartClick(
                      `/dashboard/offer-details/${selectedYear}?type=${encodeURIComponent(entry.type)}`
                    )}
                    cursor={chartCursorStyle}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Top Recruiters */}
          <div style={styles.chartBox}>
            <h4 style={styles.chartTitle}>Top Recruiters</h4>
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.companyWisePlacements
                    .filter(c => c.company && typeof c.students === "number")
                    .sort((a, b) => b.students - a.students)
                    .slice(0, 6)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="company" angle={-20} textAnchor="end" interval={0} height={70} />
                  <YAxis domain={[0, 'dataMax + 5']} />
                  <Tooltip />
                  <Bar
                    dataKey="students"
                    fill="#28a745"
                    barSize={50}
                    onClick={(entry) => handleChartClick(
                      `/dashboard/recruiter/${selectedYear}?company=${encodeURIComponent(entry.company)}`
                    )}
                    cursor={chartCursorStyle}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Placement Trend */}
          <div style={styles.chartBox}>
            <h4 style={styles.chartTitle}>Placement Trend Over Years (in %)</h4>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.placementTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line
                    type="monotone"
                    dataKey="percentagePlaced"
                    stroke="#17a2b8"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5. Companies Visited Per Year */}
          <div style={styles.chartBox}>
            <h4 style={styles.chartTitle}>Companies Visited Per Year</h4>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.companyVisitsPerYear}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 'dataMax + 5']} />
                  <Tooltip />
                  <Bar
                    dataKey="companies"
                    fill="#ffc107"
                    barSize={50}
                    onClick={(entry) => handleChartClick(`/dashboard/companies/${entry.year}`)}
                    cursor={chartCursorStyle}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 6. Offers vs Placements Comparison */}
          <div style={styles.chartBox}>
            <h4 style={styles.chartTitle}>Offers vs Placements Comparison (Last 6 Years)</h4>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={offerVsPlacement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="offers" fill="#007bff" name="Offers" />
                  <Bar dataKey="placed" fill="#28a745" name="Placed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;