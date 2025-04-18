import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      alert("يرجى اختيار نوع الحساب قبل المتابعة");
      return;
    }

    // توجيه كل دور إلى صفحة مختلفة
    const roleRoutes = {
      "شركة طيران": "/createAirline",
      "مالك مستشفى": "/createHospital",
      "مالك فندق": "/createHotel",
      "صاحب مطعم": "/createRestaurant",
      "مالك سيارة": "/createCarRentalForm",
    };

    navigate(roleRoutes[selectedRole]); // التوجيه إلى المسار المناسب
  };

  return (
    <div className="signup-container">
      <h2>إنشاء حساب جديد</h2>
      <p>يرجى اختيار نوع الحساب:</p>
      <div className="role-options">
        {Object.keys({
          "شركة طيران": "",
          "مالك مستشفى": "",
          "مالك فندق": "",
          "صاحب مطعم": "",
          "مالك سيارة": "",
        }).map((role) => (
          <button
            key={role}
            className={selectedRole === role ? "selected" : ""}
            onClick={() => handleSelectRole(role)}
          >
            {role}
          </button>
        ))}
      </div>
      <button className="continue-btn" onClick={handleContinue}>
        متابعة
      </button>
    </div>
  );
};

export default Signup;
