import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, FileText, Bed , Hotel, Utensils, LayoutDashboard, LogOut, FileTextIcon } from "lucide-react";
import axios from "axios";

function DashboardHotel() {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState("rooms");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // حالات منفصلة لكل قسم
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState("");
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [moderatorInfo, setModeratorInfo] = useState({
    name: "مدير النظام",
    role: "مسؤول",
    moderatorType: ""
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

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

 // جلب البيانات الأولية عند تحميل المكون
 useEffect(() => {
  fetchModeratorProfile();
}, []);


  // جلب الغرف من الخادم
  useEffect(() => {
    const fetchRooms = async () => {
      setRoomsLoading(true);
      setRoomsError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
        }

        const response = await fetch("https://backend-fpnx.onrender.com/hotels/admin/hotel-rooms", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("فشل في جلب بيانات الغرف");
        }

        const data = await response.json();
        setRooms(data.rooms || []);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الغرف:", error);
        setRoomsError(error.message);
        setRooms([]);
      } finally {
        setRoomsLoading(false);
      }
    };

    if (currentPage === "rooms") {
      fetchRooms();
    }
  }, [currentPage]);

  // إضافة غرفة جديدة
  const handleFormSubmit = async (newRoom) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
      }

      const formData = new FormData();
      formData.append('type', newRoom.type);
      formData.append('pricePerNight', newRoom.pricePerNight);
      formData.append('bedCount', newRoom.bedCount);
      formData.append('size', newRoom.size);
      formData.append('view', newRoom.view);
      formData.append('amenities', JSON.stringify(newRoom.amenities));
      formData.append('suiteRoomCount', newRoom.suiteRoomCount);

      // إضافة جميع الصور إلى FormData
      if (newRoom.images && newRoom.images.length > 0) {
        for (let i = 0; i < newRoom.images.length; i++) {
          formData.append('images', newRoom.images[i]);
        }
      } else {
        throw new Error("يجب رفع صور الغرفة");
      }

      const response = await fetch("https://backend-fpnx.onrender.com/hotels/rooms", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل في إضافة الغرفة");
      }

      const data = await response.json();
      setRooms((prevRooms) => [...prevRooms, data.room]);
      setShowModal(false);
    } catch (error) {
      console.error("حدث خطأ أثناء إضافة الغرفة:", error);
      setRoomsError(error.message); // تم التغيير هنا من setError إلى setRoomsError
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setBookingsLoading(true);
      setBookingsError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
        }

        const response = await fetch("https://backend-fpnx.onrender.com/hotels/admin/hotel-bookings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("فشل في جلب بيانات الحجوزات");
        }

        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الحجوزات:", error);
        setBookingsError(error.message);
        setBookings([]);
      } finally {
        setBookingsLoading(false);
      }
    };

    if (currentPage === "bookings") {
      fetchBookings();
    }
  }, [currentPage]);

  const handleRoomClick = (id) => {
    navigate(`/room/${id}`);
  };

  const handleBookingClick = (id) => {
    navigate(`/bookingrooms/${id}`);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "rooms":
        return (
          <div className="w-full mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">إدارة الغرف</h2>
              <button
                onClick={() => setShowModal(true)}
                className="add-flight-btn" // نفس كلاس زر إضافة رحلة
              >
                <span className="plus-icon">+</span>
                <span>إضافة غرفة</span>
              </button>
            </div>
  
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : rooms.length > 0 ? (
              <div className="flights-table-container"> {/* نفس كلاس جدول الرحلات */}
                <table className="flights-table"> {/* نفس كلاس جدول الرحلات */}
                  <thead>
                    <tr>
                      <th>النوع</th>
                      <th>السعر لليلة</th>
                      <th>عدد الأسرة</th>
                      <th>عدد الغرف</th>
                      <th>المساحة</th>
                      {/* <th>المنظر</th> */}
                      <th>المرافق</th>
                      <th>الحالة</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr
                        key={room._id}
                        className="flight-row" // نفس كلاس صف الرحلات
                        onClick={() => handleRoomClick(room._id)}
                      >
                        <td>{room.type}</td>
                        <td>{room.pricePerNight}</td>
                        <td>{room.bedCount}</td>
                        <td>{room.suiteRoomCount}</td>
                        <td>{room.size}m²</td>
                        {/* <td>{room.view}</td> */}
                        <td>{room.amenities.join(', ')}</td>
                        <td>{room.isAvailable ? "متاحة" : "محجوزة"}</td>
                        <td>
                          <div className="action-buttons">
                            {/* <button 
                              className="edit-btn" 
                              title="تعديل"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditRoom(room._id);
                              }}
                            >
                              <i className="fas fa-edit"></i>
                            </button> */}
                            {/* <button 
                              className="delete-btn" 
                              title="حذف"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRoom(room._id);
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
                <div className="empty-icon">🛏️</div> {/* تغيير الأيقونة */}
                <h3>لا توجد غرف حالياً</h3>
                <p>قم بإضافة غرف جديدة لتظهر هنا</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="add-first-flight-btn" // نفس كلاس زر إضافة أول رحلة
                >
                  إضافة غرفة جديدة
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
        
              {bookingsLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>جاري تحميل بيانات الحجوزات...</p>
                </div>
              ) : bookings.length > 0 ? (
                <div className="bookings-table-container">
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>البريد الإلكتروني</th>
                        <th>الهاتف</th>
                        <th>نوع الغرفة</th>
                        <th>تاريخ الوصول</th>
                        <th>تاريخ المغادرة</th>
                        <th>الحالة</th>
                        <th>حالة الدفع</th>
                        <th>السعر الإجمالي</th>
                        <th>عدد الأيام</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr
                          key={booking._id}
                          className="booking-row"
                          onClick={() => handleBookingClick(booking._id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>{booking.user.email}</td>
                          <td>{booking.user.phone}</td>
                          <td>{booking.room.type}</td>
                          <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                          <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                          <td>{booking.status}</td>
                          <td>{booking.paymentStatus}</td>
                          <td>{booking.totalPrice}</td>
                          <td>{booking.numberOfDays}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon"><FileTextIcon  /></div>
                  <h3>لا توجد حجوزات حالياً</h3>
                  <p>سيتم عرض الحجوزات هنا عند توفرها</p>
                </div>
              )}
            </div>
          ); default:
        return null;
    }
  };

  return (
    <div className="dashboard-container" dir="rtl">
      <header className="dashboard-header">
        <div className="header-logo">
          <span className="logo-icon"><Hotel  /></span>
          <h1>لوحة تحكم الفندق</h1>
        </div>
        <div className="header-controls">
             <div className="user-profile">
             <div className="user-avatar">
              <User size={20} />
            </div>            <div className="user-info">
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
        {/* <div className="sidebar-header">
          <span className="company-logo"><Hotel  /></span>
          <h2>نظام إدارة الفندق</h2>
        </div> */}
        <nav className="sidebar-nav">
          <ul>
            <li className={currentPage === "rooms" ? "active" : ""}>
              <button onClick={() => setCurrentPage("rooms")}>
                <span className="nav-icon"><Bed  /></span>
                <span className="nav-text">إدارة الغرف</span>
              </button>
            </li>
            <li className={currentPage === "bookings" ? "active" : ""}>
              <button onClick={() => setCurrentPage("bookings")}>
                <span className="nav-icon"><FileTextIcon  /></span>
                <span className="nav-text">إدارة الحجوزات</span>
              </button>
            </li>
            {/* <li className={currentPage === "settings" ? "active" : ""}>
              <button onClick={() => setCurrentPage("settings")}>
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">الإعدادات</span>
              </button>
            </li> */}
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
              <h2>إضافة غرفة جديدة</h2>
              <button
                onClick={() => setShowModal(false)}
                className="close-modal-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <AddRoomForm onFormSubmit={handleFormSubmit} />
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

// مكون نموذج إضافة غرفة

function AddRoomForm({ onFormSubmit }) {
  const [type, setType] = useState("double");
  const [pricePerNight, setPricePerNight] = useState(100);
  const [bedCount, setBedCount] = useState(2);
  const [size, setSize] = useState(30);
  const [view, setView] = useState("sea");
  const [amenities, setAmenities] = useState(["WiFi"]);
  const [suiteRoomCount, setSuiteRoomCount] = useState(1);
  const [images, setImages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRoom = {
      type,
      pricePerNight,
      bedCount,
      size,
      view,
      amenities,
      suiteRoomCount,
      images
    };

    onFormSubmit(newRoom);
  };

  const validAmenities = ['AC', 'WiFi', 'TV', 'MiniBar', 'SafeBox', 'HairDryer', 'CoffeeMachine', 'Balcony', 'Jacuzzi'];

  const handleAmenityChange = (amenity) => {
    setAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity); // إزالة إذا كانت موجودة
      } else {
        return [...prev, amenity]; // إضافة إذا لم تكن موجودة
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>النوع</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="single">غرفة فردية</option>
          <option value="double">غرفة مزدوجة</option>
          <option value="suite">سويت</option>
        </select>
      </div>

      <div className="form-group">
        <label>السعر لليلة</label>
        <input
          type="number"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(Number(e.target.value))}
          required
        />
      </div>

      <div className="form-group">
        <label>عدد الأسرة</label>
        <input
          type="number"
          value={bedCount}
          onChange={(e) => setBedCount(Number(e.target.value))}
          required
          min="1"
        />
      </div>

      <div className="form-group">
        <label>عدد الغرف (للسويت)</label>
        <input
          type="number"
          value={suiteRoomCount}
          onChange={(e) => setSuiteRoomCount(Number(e.target.value))}
          required
          min="1"
        />
      </div>

      <div className="form-group">
        <label>المساحة (م²)</label>
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          required
        />
      </div>

      <div className="form-group">
        <label>الإطلالة</label>
        <select value={view} onChange={(e) => setView(e.target.value)} required>
          <option value="sea">بحر</option>
          <option value="city">مدينة</option>
          <option value="garden">حديقة</option>
          <option value="mountain">جبل</option>
          <option value="pool">مسبح</option>
        </select>
      </div>

      <div className="form-group">
        <label>المرافق</label>
        <div className="checkbox-group">
          {['AC', 'WiFi', 'TV', 'MiniBar', 'SafeBox', 'HairDryer', 'CoffeeMachine', 'Balcony', 'Jacuzzi'].map(amenity => (
            <label key={amenity}>
              <input
                type="checkbox"
                checked={amenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>رفع الصور (يمكن اختيار أكثر من صورة)</label>
        <input
          type="file"
          onChange={(e) => setImages([...e.target.files])}
          accept="image/*"
          multiple
          required
        />
      </div>

      <button type="submit" className="submit-btn">
        إضافة غرفة
      </button>
    </form>
  );
}


export default DashboardHotel;