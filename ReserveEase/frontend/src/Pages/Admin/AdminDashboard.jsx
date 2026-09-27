import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  // 1. Fetch All Reservations
  const fetchReservations = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/reservation/admin/all"
      );
      setReservations(data.reservations);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reservations!");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // 2. Update Status (Approved / Rejected)
  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/reservation/admin/status/${id}`,
        { status }
      );
      toast.success(data.message);
      fetchReservations(); // List refresh karne ke liye
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status!");
    }
  };

  // 3. Logout Handler Function
  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Token delete
    toast.success("Admin Logged Out Successfully!");
    navigate("/admin/login"); // Redirect to Login page
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      {/* Header Section with Logout Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          borderBottom: "2px solid #eee",
          paddingBottom: "15px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>
          RESTAURANT ADMIN DASHBOARD
        </h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          LOGOUT
        </button>
      </div>

      {/* Reservations Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#000", color: "#fff" }}>
            <th style={{ padding: "12px" }}>Customer Name</th>
            <th style={{ padding: "12px" }}>Email</th>
            <th style={{ padding: "12px" }}>Phone</th>
            <th style={{ padding: "12px" }}>Date</th>
            <th style={{ padding: "12px" }}>Time</th>
            <th style={{ padding: "12px" }}>Status</th>
            <th style={{ padding: "12px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {reservations && reservations.length > 0 ? (
            reservations.map((element) => (
              <tr key={element._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "12px" }}>
                  {element.firstName} {element.lastName}
                </td>
                <td style={{ padding: "12px" }}>{element.email}</td>
                <td style={{ padding: "12px" }}>{element.phone}</td>
                <td style={{ padding: "12px" }}>{element.date}</td>
                <td style={{ padding: "12px" }}>{element.time}</td>
                <td
                  style={{
                    padding: "12px",
                    fontWeight: "bold",
                    color:
                      element.status === "Approved"
                        ? "#28a745"
                        : element.status === "Rejected"
                        ? "#dc3545"
                        : "#ffc107",
                  }}
                >
                  {element.status}
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => handleStatusChange(element._id, "Approved")}
                    style={{
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      marginRight: "8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(element._id, "Rejected")}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                No Reservations Found!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;