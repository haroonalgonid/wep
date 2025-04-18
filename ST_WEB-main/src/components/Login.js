import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("moderator");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // حالة جديدة لمؤشر التحميل
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true); // بدء التحميل
  
    const loginUrl =
      userType === "admin"
        ? "https://backend-fpnx.onrender.com/admin/login"
        : "https://backend-fpnx.onrender.com/moderators/login";
  
    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fcmToken: "your-fcm-token" }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
  
        if (userType === "admin") {
          navigate("/Dashboard");
        } else {
          switch (data.moderatorType) {
            case "airline":
              navigate("/adminDashboard");
              break;
            case "hospital":
              navigate("/dashboardHospital");
              break;
            case "hotel":
              navigate("/dashboardHotel");
              break;
            case "carRental":
              navigate("/dashboardCarRental");
              break;
            case "restaurant":
              navigate("/dashboardRestaurant");
              break;
            default:
              setError("نوع المستخدم غير معروف.");
          }
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
    } finally {
      setIsLoading(false); // إيقاف التحميل بغض النظر عن النتيجة
    }
  };

  return (
    <div className="login-container">
      <h2>تسجيل الدخول</h2>
      {error && <p className="error-message">{error}</p>}
      
      <select value={userType} onChange={(e) => setUserType(e.target.value)}>
        <option value="moderator">مشرف</option>
        <option value="admin">أدمن</option>
      </select>

      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? (
          <span>جاري التحميل...</span>
        ) : (
          "تسجيل الدخول"
        )}
      </button>
      <button className="register-btn" onClick={() => navigate("/signup")}>
        إنشاء حساب مشرف
      </button>
    </div>
  );
};

export default Login;