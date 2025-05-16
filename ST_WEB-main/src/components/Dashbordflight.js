import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddFlightForm from "./AddFlightForm";
import "../styles/Dashbordflight.css";
import axios from "axios";
import { User, Plane, Hospital, Hotel, Utensils, LayoutDashboard, LogOut, BarChart3, FileTextIcon, Settings } from "lucide-react";

function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState({
    totalBookings: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
  });
  const [currentPage, setCurrentPage] = useState("flights");
  const [loading, setLoading] = useState(true);
  const [moderatorInfo, setModeratorInfo] = useState({
    name: "مدير النظام",
    role: "مسؤول",
    moderatorType: ""
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(true);
  const [companyData, setCompanyData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);


  const handleImageUpload = async (file, type) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // تحديد حالة التحميل بناءً على نوع الصورة
    if (type === 'logo') setUploadingLogo(true);
    if (type === 'license') setUploadingLicense(true);
    if (type === 'documents') setUploadingDocuments(true);

    const response = await axios.post(
      'https://backend-fpnx.onrender.com/upload', // تأكد من وجود هذا الرابط في سيرفرك
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // تحديث حالة النموذج بناءً على نوع الصورة
    setEditFormData(prev => ({
      ...prev,
      [type === 'logo' ? 'companyLogo' : 
       type === 'license' ? 'operatingLicenseImage' : 
       'legalDocumentsImage']: response.data.url
    }));

    return response.data.url;
  } catch (error) {
    console.error(`Error uploading ${type} image:`, error);
    alert(`فشل تحميل ${type === 'logo' ? 'الشعار' : type === 'license' ? 'صورة الرخصة' : 'المستندات القانونية'}`);
    return null;
  } finally {
    if (type === 'logo') setUploadingLogo(false);
    if (type === 'license') setUploadingLicense(false);
    if (type === 'documents') setUploadingDocuments(false);
  }
};

  // 2. تعديل دالة جلب بيانات الشركة
  const fetchCompanyData = async () => {
    setLoadingCompany(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://backend-fpnx.onrender.com/flights/airlines/my-company",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // البيانات تأتي مباشرة في response.data وليس response.data.data
      setCompanyData(response.data);
      setEditFormData(response.data);
    } catch (error) {
      console.error("Error fetching company data:", error);
      setError("فشل في جلب بيانات الشركة. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoadingCompany(false);
    }
  };


  // 3. تعديل دالة التحديث
  const handleUpdateCompany = async () => {
    try {
      const response = await axios.put(
        "https://backend-fpnx.onrender.com/flights/airlines/my-company",
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCompanyData(response.data);
      setIsEditing(false);
      alert("تم تحديث بيانات الشركة بنجاح");
    } catch (error) {
      console.error("Error updating company data:", error);
      alert("حدث خطأ أثناء تحديث بيانات الشركة");
    }
  };


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
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchModeratorProfile();
  }, [currentPage, token]);

  // دالة لجلب الرحلات
  const fetchFlights = () => {
    setLoading(true);
    if (!token) {
      console.error("Token not found. Please log in first.");
      setLoading(false);
      return;
    }

    axios
      .get("https://backend-fpnx.onrender.com/flights/my-flights", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFlights(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the flights:", error);
        setLoading(false);
      });
  };

  // دالة لجلب الحجوزات
  const fetchBookings = () => {
    setLoading(true);
    if (!token) {
      console.error("Token not found. Please log in first.");
      setLoading(false);
      return;
    }

    axios
      .get("https://backend-fpnx.onrender.com/bookings/moderator-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBookings(response.data.bookings);
        setBookingStats({
          totalBookings: response.data.totalBookings,
          pendingCount: response.data.pendingCount,
          approvedCount: response.data.approvedCount,
          rejectedCount: response.data.rejectedCount,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the bookings:", error);
        setLoading(false);
      });
  };

  // جلب البيانات عند تغيير الصفحة
  // جلب البيانات عند تغيير الصفحة
  useEffect(() => {
    const fetchData = async () => {
      await fetchModeratorProfile();

      if (currentPage === "flights") {
        fetchFlights();
      } else if (currentPage === "bookings") {
        fetchBookings();
      } else if (currentPage === "settings") {
        fetchCompanyData();
      }
    };

    fetchData();
  }, [currentPage, token]);

  // إغلاق النافذة المنبثقة بعد إضافة رحلة
  const handleFormSubmit = () => {
    setShowModal(false);
    fetchFlights(); // إعادة تحميل الرحلات بعد الإضافة
  };

  // الانتقال إلى صفحة تفاصيل الرحلة
  const handleFlightClick = (id) => {
    navigate(`/flight/${id}`);
  };
  const handleBookingClick = (id) => {
    navigate(`/booking/${id}`);
  };
  // عرض المحتوى بناءً على الصفحة الحالية
  const renderContent = () => {
    switch (currentPage) {
      case "flights":
        return (
          <div className="w-full mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">إدارة الرحلات</h2>
              <button
                onClick={() => setShowModal(true)}
                className="add-flight-btn"
              >
                <span className="plus-icon">+</span>
                <span>إضافة رحلة</span>
              </button>
            </div>

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : flights.length > 0 ? (
              <div className="flights-table-container">
                <table className="flights-table">
                  <thead>
                    <tr>
                      <th>رقم الرحلة</th>
                      <th></th>
                      <th>النوع</th>
                      <th>المطار المغادر</th>
                      <th>المطار القادم</th>
                      <th>وقت المغادرة</th>
                      <th>وقت الوصول</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map((flight) => (
                      <tr
                        key={flight._id}
                        className="flight-row"
                        onClick={() => handleFlightClick(flight._id)}
                      >
                        <td>{flight.flightNumber}</td>
                        <td>
                          {/* <div className="airline-cell">
                            <span className="airline-icon">✈️</span>
                            <span>{flight.airline}</span>
                          </div> */}
                        </td>
                        <td>{flight.aircraftType}</td>
                        <td>{flight.departureAirport}</td>
                        <td>{flight.arrivalAirport}</td>
                        <td>{new Date(flight.departureTime).toLocaleString("ar-SA")}</td>
                        <td>{new Date(flight.arrivalTime).toLocaleString("ar-SA")}</td>
                        {/* <td>
                          <div className="action-buttons">
                            <button className="edit-btn" title="تعديل">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="delete-btn" title="حذف">
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon"><Plane /></div>
                <h3>لا توجد رحلات حالياً</h3>
                <p>قم بإضافة رحلات جديدة لتظهر هنا</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="add-first-flight-btn"
                >
                  إضافة رحلة جديدة
                </button>
              </div>
            )}
          </div>
        );
      case "bookings":
        return (
          <div className="dashboard-section">
            <h2 className="section-title">الحجوزات</h2>
            <div className="booking-stats">
              <div className="stat-card">
                <span className="stat-value">{bookingStats.totalBookings}</span>
                <span className="stat-label">إجمالي الحجوزات</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{bookingStats.pendingCount}</span>
                <span className="stat-label">معلقة</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{bookingStats.approvedCount}</span>
                <span className="stat-label">مقبولة</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{bookingStats.rejectedCount}</span>
                <span className="stat-label">مرفوضة</span>
              </div>
            </div>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : bookings.length > 0 ? (
              <div className="bookings-table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>اسم المستخدم</th>
                      <th>رقم الرحلة</th>
                      <th>رقم المقعد</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="booking-row" onClick={() => handleBookingClick(booking._id)}>
                        <td>{booking.user.fullName}</td>
                        <td>{booking.flight.flightNumber}</td>
                        <td>{booking.seatNumber || "غير محدد"}</td>
                        <td>{booking.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon"><FileTextIcon /></div>
                <h3>لا توجد حجوزات حالياً</h3>
                <p>سيتم عرض الحجوزات هنا عند توفرها</p>
              </div>
            )}
          </div>
        );
      case "settings":
        return (
          <div className="dashboard-section">
            <h2 className="section-title">إعدادات الشركة</h2>

            {loadingCompany ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>جاري تحميل بيانات الشركة...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={fetchCompanyData} className="retry-btn">
                  إعادة المحاولة
                </button>
              </div>
            ) : companyData ? (
              <div className="company-settings">
            {isEditing ? (
  <div className="edit-form">
    <h3>تعديل بيانات الشركة</h3>
    
    {/* حقل اسم الشركة */}
    <div className="form-group">
      <label>اسم الشركة *</label>
      <input
        type="text"
        value={editFormData.companyName || ''}
        onChange={(e) => setEditFormData({...editFormData, companyName: e.target.value})}
        required
      />
    </div>

    {/* حقل رمز IATA */}
    <div className="form-group">
      <label>رمز IATA *</label>
      <input
        type="text"
        value={editFormData.IATACode || ''}
        onChange={(e) => setEditFormData({...editFormData, IATACode: e.target.value})}
        required
      />
    </div>

    {/* حقل الوصف */}
    <div className="form-group">
      <label>وصف الشركة</label>
      <textarea
        value={editFormData.description || ''}
        onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
        rows="3"
      />
    </div>

    {/* تحميل شعار الشركة */}
    <div className="form-group">
      <label>شعار الشركة</label>
      <div className="image-upload-container">
        {editFormData.companyLogo && (
          <img 
            src={editFormData.companyLogo} 
            alt="شعار الشركة الحالي" 
            className="current-image"
          />
        )}
        <input
          type="file"
          id="logo-upload"
          accept="image/*"
          onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'logo')}
          disabled={uploadingLogo}
          hidden
        />
        <label htmlFor="logo-upload" className="upload-btn">
          {uploadingLogo ? 'جاري التحميل...' : 'تغيير الشعار'}
        </label>
      </div>
    </div>

    {/* تحميل صورة الرخصة التشغيلية */}
    <div className="form-group">
      <label>صورة الرخصة التشغيلية</label>
      <div className="image-upload-container">
        {editFormData.operatingLicenseImage && (
          <img 
            src={editFormData.operatingLicenseImage} 
            alt="رخصة التشغيل الحالية" 
            className="current-image"
          />
        )}
        <input
          type="file"
          id="license-upload"
          accept="image/*"
          onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'license')}
          disabled={uploadingLicense}
          hidden
        />
        <label htmlFor="license-upload" className="upload-btn">
          {uploadingLicense ? 'جاري التحميل...' : 'تغيير الرخصة'}
        </label>
      </div>
    </div>

    {/* تحميل المستندات القانونية */}
    <div className="form-group">
      <label>المستندات القانونية</label>
      <div className="image-upload-container">
        {editFormData.legalDocumentsImage && (
          <img 
            src={editFormData.legalDocumentsImage} 
            alt="المستندات القانونية الحالية" 
            className="current-image"
          />
        )}
        <input
          type="file"
          id="documents-upload"
          accept="image/*"
          onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'documents')}
          disabled={uploadingDocuments}
          hidden
        />
        <label htmlFor="documents-upload" className="upload-btn">
          {uploadingDocuments ? 'جاري التحميل...' : 'تغيير المستندات'}
        </label>
      </div>
    </div>

    {/* باقي الحقول */}
    <div className="form-row">
      <div className="form-group">
        <label>البريد الإلكتروني *</label>
        <input
          type="email"
          value={editFormData.email || ''}
          onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <label>رقم الهاتف *</label>
        <input
          type="tel"
          value={editFormData.phoneNumber || ''}
          onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
          required
        />
      </div>
    </div>

    <div className="form-group">
      <label>الموقع الإلكتروني</label>
      <input
        type="url"
        value={editFormData.website || ''}
        onChange={(e) => setEditFormData({...editFormData, website: e.target.value})}
      />
    </div>

    <div className="form-group">
      <label>العنوان الرئيسي</label>
      <input
        type="text"
        value={editFormData.headquartersAddress || ''}
        onChange={(e) => setEditFormData({...editFormData, headquartersAddress: e.target.value})}
      />
    </div>

    <div className="form-group">
      <label>رقم تسجيل الشركة</label>
      <input
        type="text"
        value={editFormData.companyRegistrationNumber || ''}
        onChange={(e) => setEditFormData({...editFormData, companyRegistrationNumber: e.target.value})}
      />
    </div>

    <div className="form-actions">
      <button 
        type="button"
        onClick={() => setIsEditing(false)} 
        className="cancel-btn"
      >
        إلغاء
      </button>
      <button 
        type="button"
        onClick={handleUpdateCompany} 
        className="save-btn"
        disabled={uploadingLogo || uploadingLicense || uploadingDocuments}
      >
        {uploadingLogo || uploadingLicense || uploadingDocuments ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </button>
    </div>
  </div>
) : (
                  <div className="bookings-table-container">
  <div className="bookings-table-header">
    <h3>{companyData.companyName}</h3>
    <button
      onClick={() => setIsEditing(true)}
      className="booking-action-btn"
    >
      تعديل البيانات
    </button>
  </div>

  <div className="bookings-table">
    <table>
      <tbody>
        <tr className="booking-row">
          <td className="booking-label">رمز IATA:</td>
          <td>{companyData.IATACode}</td>
        </tr>
        <tr className="booking-row">
          <td className="booking-label">البريد الإلكتروني:</td>
          <td>{companyData.email}</td>
        </tr>
        <tr className="booking-row">
          <td className="booking-label">رقم الهاتف:</td>
          <td>{companyData.phoneNumber}</td>
        </tr>
        <tr className="booking-row">
          <td className="booking-label">الموقع الإلكتروني:</td>
          <td>
            <a
              href={companyData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="booking-link"
            >
              {companyData.website}
            </a>
          </td>
        </tr>
        <tr className="booking-row">
          <td className="booking-label">العنوان الرئيسي:</td>
          <td>{companyData.headquartersAddress}</td>
        </tr>
      </tbody>
    </table>

                      {/* أضف حقول العرض الأخرى حسب الحاجة */}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-data">
                <p>لا توجد بيانات للشركة</p>
                <button onClick={fetchCompanyData} className="retry-btn">
                  جلب البيانات
                </button>
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
      {/* شريط العلوي */}
      <header className="dashboard-header">
        <div className="header-logo">
          <span className="logo-icon"><Plane /></span>
          <h1>لوحة تحكم الرحلات</h1>
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

      {/* الشريط الجانبي */}
      <aside className="dashboard-sidebar">
        {/* <div className="sidebar-header">
          <span className="company-logo">🛫</span>
          <h2>نظام إدارة الرحلات</h2>
        </div> */}
        <nav className="sidebar-nav">
          <ul>
            <li className={currentPage === "flights" ? "active" : ""}>
              <button onClick={() => setCurrentPage("flights")}>
                <span className="nav-icon"><Plane size={24} /></span>
                <span className="nav-text">إدارة الرحلات</span>
              </button>
            </li>
            <li className={currentPage === "bookings" ? "active" : ""}>
              <button onClick={() => setCurrentPage("bookings")}>
                <span className="nav-icon"><FileTextIcon size={24} /></span>
                <span className="nav-text">الحجوزات</span>
              </button>
            </li>
            <li className={currentPage === "settings" ? "active" : ""}>
              <button onClick={() => setCurrentPage("settings")}>
                <span className="nav-icon"><Settings size={24} /></span>
                <span className="nav-text">الإعدادات</span>
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

      {/* المحتوى الرئيسي */}
      <main className="dashboard-main">{renderContent()}</main>

      {/* نافذة منبثقة */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>إضافة رحلة جديدة</h2>
              <button
                onClick={() => setShowModal(false)}
                className="close-modal-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <AddFlightForm onFormSubmit={handleFormSubmit} />
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

export default AdminDashboard;