import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Dashboard from "../components/Dashboard";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(() => {
    // Directly get user role from localStorage on initial load
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role || null;
  });

  useEffect(() => {
    if (!userType) {
      navigate("/login");
    }
  }, [userType, navigate]); // Now navigation happens immediately on page load

  if (!userType) return <h2>Loading...</h2>;

  return (
    <>
      <Nav />
      <Dashboard userType={userType} />
    </>
  );
}
