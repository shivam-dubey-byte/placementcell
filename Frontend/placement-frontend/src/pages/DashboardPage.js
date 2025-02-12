import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import Nav from "../components/Nav";
import Dashboard from "../components/Dashboard";

export default function DashboardPage() {
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate(); // ✅ Define navigate

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.role) {
      navigate("/login"); // ✅ Redirect to login if user role is missing
    } else {
      setUserType(user.role);
    }
  }, [navigate]); // ✅ Include navigate in dependency array

  if (!userType) return <h2>Loading...</h2>;

  return (
    <>
      <Nav />
      <Dashboard userType={userType} />
    </>
  );
}
