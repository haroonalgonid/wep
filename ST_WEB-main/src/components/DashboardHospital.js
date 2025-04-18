import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashbordflight.css";
import axios from "axios";
import { User, FileText, Plane, Hospital, Hotel, Utensils, LayoutDashboard, LogOut, BarChart3, FileTextIcon } from "lucide-react";

function DashboardHospital() {
  const [showModal, setShowModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState({
    totalBookings: 0,
    confirmedCount: 0,
    pendingCount: 0,
    cancelledCount: 0
  });
  const [currentPage, setCurrentPage] = useState("doctors");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const navigate = useNavigate();
  const [moderatorInfo, setModeratorInfo] = useState({
    name: "مدير النظام",
    role: "مسؤول",
    moderatorType: ""
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const token = localStorage.getItem("token");


  const handleLogout = () => {
    // حذف التوكن من localStorage أو sessionStorage
    localStorage.removeItem('token'); // أو أي مفتاح استخدمته
    sessionStorage.removeItem('token');

    // أو إذا كنت تستخدم الكوكيز:
    // document.cookie = 'token=; Max-Age=0';

    // الانتقال إلى صفحة تسجيل الدخول
    navigate('/login');
  };
  
  // دالة لجلب معلومات المسؤول
  const fetchModeratorProfile = async () => {
    setProfileLoading(true);
    try {
      const response = await axios.get("https://backend-fpnx.onrender.com/moderators/profile", {
        headers: {
          Authorization: token,
        },
      });
      
      setModeratorInfo({
        name: response.data.name,
        role: "مسؤول",
        moderatorType: response.data.moderatorType
      });
    } catch (error) {
      console.error("Error fetching moderator profile:", error);
      setError("فشل في تحميل بيانات الملف الشخصي");
    } finally {
      setProfileLoading(false);
    }
  };

  // جلب البيانات الأولية عند تحميل المكون
  useEffect(() => {
    fetchModeratorProfile();
  }, []);

  // جلب الأطباء من الخادم
  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
      }

      const response = await fetch("https://backend-fpnx.onrender.com/hospitals/admin/doctors", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "لا يوجد أطباء لهذا المستشفى") {
          setDoctors([]);
          return;
        }
        throw new Error(errorData.message || "فشل في جلب البيانات");
      }

      const data = await response.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب الأطباء:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // جلب الحجوزات من الخادم
 // جلب الحجوزات من الخادم مع الإحصائيات
const fetchBookings = async () => {
  setLoading(true);
  setError(null);
  try {
    if (!token) {
      throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
    }

    const response = await fetch("https://backend-fpnx.onrender.com/hospitals/admin/appointments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message.includes("لا يوجد حجوزات") || errorData.message.includes("No appointments found")) {
        setBookings([]);
        setBookingStats({
          totalBookings: 0,
          confirmedCount: 0,
          pendingCount: 0,
          cancelledCount: 0
        });
        return;
      }
      throw new Error(errorData.message || "فشل في جلب الحجوزات");
    }

    const data = await response.json();
    setBookings(data.appointments || []);
    
    // تحديث الإحصائيات من الاستجابة
    if (data.stats) {
      setBookingStats({
        totalBookings: data.stats.totalBookings,
        confirmedCount: data.stats.confirmedCount,
        pendingCount: data.stats.pendingCount,
        cancelledCount: data.stats.cancelledCount
      });
    }
  } catch (error) {
    console.error("حدث خطأ أثناء جلب الحجوزات:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

// يمكننا حذف دالة fetchBookingStats المنفصلة لأننا نحصل على الإحصائيات مع الحجوزات
  // جلب إحصائيات الحجوزات
  // const fetchBookingStats = async () => {
  //   setStatsLoading(true);
  //   try {
  //     const response = await axios.get("https://backend-fpnx.onrender.com/hospitals/admin/appointments/stats", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
      
  //     setBookingStats({
  //       totalBookings: response.data.totalAppointments,
  //       confirmedCount: response.data.confirmedCount,
  //       pendingCount: response.data.pendingCount,
  //       cancelledCount: response.data.cancelledCount
  //     });
  //   } catch (error) {
  //     console.error("Error fetching booking stats:", error);
  //   } finally {
  //     setStatsLoading(false);
  //   }
  // };

  // جلب البيانات عند تغيير الصفحة
  useEffect(() => {
    if (currentPage === "doctors") {
      fetchDoctors();
    } else if (currentPage === "bookings") {
      fetchBookings();
    }
  }, [currentPage]);

  // إضافة طبيب جديد
  const handleFormSubmit = async (newDoctor) => {
    try {
      setError(null);
      const doctorData = {
        name: newDoctor.name,
        specialty: newDoctor.specialty,
        experienceYears: newDoctor.experienceYears || 0,
        bio: newDoctor.bio || "",
      };

      const response = await fetch("https://backend-fpnx.onrender.com/hospitals/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(doctorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل في إضافة الطبيب");
      }

      const data = await response.json();
      setDoctors((prevDoctors) => [...prevDoctors, data]);
      setShowModal(false);
    } catch (error) {
      console.error("حدث خطأ أثناء إضافة الطبيب:", error);
      setError(error.message);
    }
  };

  const handleDoctorClick = (id) => {
    navigate(`/doctor/${id}`);
  };

  const handleBookingClick = (id) => {
    navigate(`/bookingdoctor/${id}`);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "doctors":
        return (
          <div className="w-full mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">إدارة الأطباء</h2>
              <button
                onClick={() => setShowModal(true)}
                className="add-flight-btn"
              >
                <span className="plus-icon">+</span>
                <span>إضافة طبيب</span>
              </button>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={fetchDoctors} className="retry-btn">
                  إعادة المحاولة
                </button>
              </div>
            )}

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : doctors.length > 0 ? (
              <div className="flights-table-container">
                <table className="flights-table">
                  <thead>
                    <tr>
                      <th>اسم الطبيب</th>
                      <th>التخصص</th>
                      <th></th>
                      <th>الخبرة</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr
                        key={doctor._id}
                        className="flight-row"
                        onClick={() => handleDoctorClick(doctor._id)}
                      >
                        <td>
                          <div className="airline-cell">
                            <span className="airline-icon">👨‍⚕️</span>
                            <span>{doctor.name}</span>
                          </div>
                        </td>
                        <td>{doctor.specialty}</td>
                        <td>{doctor.phone}</td>
                        <td>{doctor.experienceYears}</td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">👨‍⚕️</div>
                <h3>لا توجد أطباء حالياً</h3>
                <p>قم بإضافة أطباء جدد لتظهر هنا</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="add-first-flight-btn"
                >
                  إضافة طبيب جديد
                </button>
              </div>
            )}
          </div>
        );

      case "bookings":
        return (
          <div className="w-full mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">إدارة الحجوزات</h2>
            </div>

            {!statsLoading && (
              <div className="booking-stats">
                <div className="stat-card">
                  <span className="stat-value">{bookingStats.totalBookings}</span>
                  <span className="stat-label">إجمالي الحجوزات</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{bookingStats.confirmedCount}</span>
                  <span className="stat-label">مؤكدة</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{bookingStats.pendingCount}</span>
                  <span className="stat-label">قيد الانتظار</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{bookingStats.cancelledCount}</span>
                  <span className="stat-label">ملغاة</span>
                </div>
              </div>
            )}
{/* 
            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={fetchBookings} className="retry-btn">
                  إعادة المحاولة
                </button>
              </div>
            )} */}

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : bookings.length > 0 ? (
              <div className="flights-table-container">
                <table className="flights-table">
                  <thead>
                    <tr>
                      <th>اسم المريض</th>
                      <th>اسم الطبيب</th>
                      <th>التاريخ</th>
                      <th>الوقت</th>
                      <th>الحالة</th>
                      {/* <th>الإجراءات</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="flight-row"
                        onClick={() => handleBookingClick(booking._id)}
                      >
                        <td>
                          <div className="airline-cell">
                            <span className="airline-icon"></span>
                            <span>{booking.user?.fullName || 'غير محدد'}</span>
                          </div>
                        </td>
                        <td>{booking.doctor?.name || 'غير محدد'}</td>
                        <td>{new Date(booking.dateTime).toLocaleDateString('ar-SA')}</td>
                        <td>{new Date(booking.dateTime).toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'})}</td>
                        <td>
                          <span className={`status-badge ${booking.status === 'confirmed' ? 'confirmed' : booking.status === 'cancelled' ? 'cancelled' : 'pending'}`}>
                            {booking.status === 'confirmed' ? 'مؤكدة' : booking.status === 'cancelled' ? 'ملغاة' : 'قيد الانتظار'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {/* <button 
                              className="edit-btn" 
                              title="تعديل"
                              onClick={(e) => {
                                e.stopPropagation();
                                // إجراءات التعديل
                              }}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="delete-btn" 
                              title="حذف"
                              onClick={(e) => {
                                e.stopPropagation();
                                // إجراءات الحذف
                              }}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon"><FileTextIcon /></div>
                <h3>لا توجد حجوزات حالياً</h3>
                <p>لم يتم العثور على أي حجوزات في النظام</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container" dir="rtl">
      <header className="dashboard-header">
        <div className="header-logo">
          <span className="logo-icon"><Hospital /></span>
          <h1>لوحة تحكم المستشفيات</h1>
        </div>
        <div className="header-controls">
          <div className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              {profileLoading ? (
                <div>جاري التحميل...</div>
              ) : (
                <>
                  <span className="user-name">{moderatorInfo.name}</span>
                  <span className="user-role">
                    {moderatorInfo.role}
                    {moderatorInfo.moderatorType && ` - ${moderatorInfo.moderatorType}`}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <aside className="dashboard-sidebar">
        <nav className="sidebar-nav">
          <ul>
            <li className={currentPage === "doctors" ? "active" : ""}>
              <button onClick={() => setCurrentPage("doctors")}>
                <span className="nav-icon"><User /></span>
                <span className="nav-text">إدارة الأطباء</span>
              </button>
            </li>
            <li className={currentPage === "bookings" ? "active" : ""}>
              <button onClick={() => setCurrentPage("bookings")}>
                <span className="nav-icon"><FileTextIcon /></span>
                <span className="nav-text">إدارة الحجوزات</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
      <LogOut className="logout-icon w-5 h-5" />
      <span>تسجيل الخروج</span>
    </button>
        </div>
      </aside>

      <main className="dashboard-main">{renderContent()}</main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>إضافة طبيب جديد</h2>
              <button
                onClick={() => setShowModal(false)}
                className="close-modal-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <AddDoctorForm onFormSubmit={handleFormSubmit} />
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowModal(false)}
                className="cancel-modal-btn"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddDoctorForm({ onFormSubmit }) {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experienceYears, setExperienceYears] = useState(0);
  const [bio, setBio] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDoctor = { name, specialty, experienceYears, bio };
    onFormSubmit(newDoctor);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>اسم الطبيب</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>التخصص</label>
        <input
          type="text"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>سنوات الخبرة</label>
        <input
          type="number"
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>السيرة الذاتية</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="submit-btn">
        إضافة طبيب
      </button>
    </form>
  );
}

export default DashboardHospital;