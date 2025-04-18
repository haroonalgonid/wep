  import { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { User, FileText, Car, CarTaxiFront, LayoutDashboard, LogOut, FileTextIcon } from "lucide-react";
  import axios from "axios";

  function DashboardCarRental() {
    const [showModal, setShowModal] = useState(false);
    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState("cars");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // حالات منفصلة لكل قسم
    const [carsLoading, setCarsLoading] = useState(false);
    const [carsError, setCarsError] = useState("");
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

    // جلب السيارات من الخادم
    useEffect(() => {
      const fetchCars = async () => {
        setCarsLoading(true);
        setCarsError("");
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
          }

          const response = await fetch("https://backend-fpnx.onrender.com/carrental/admin/company-cars", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("فشل في جلب بيانات السيارات");
          }

          const data = await response.json();
          setCars(data.cars || []);
        } catch (error) {
          console.error("حدث خطأ أثناء جلب السيارات:", error);
          setCarsError(error.message);
          setCars([]);
        } finally {
          setCarsLoading(false);
        }
      };

      if (currentPage === "cars") {
        fetchCars();
      }
    }, [currentPage]);

    // إضافة سيارة جديدة
    const handleFormSubmit = async (newCar) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
        }
    
        const formData = new FormData();
        
        // إضافة الحقول الأساسية
        formData.append('make', newCar.make);
        formData.append('model', newCar.model);
        formData.append('year', newCar.year);
        formData.append('type', newCar.type);
        formData.append('pricePerDay', newCar.pricePerDay);
        formData.append('seats', newCar.seats);
        formData.append('transmission', newCar.transmission);
        formData.append('fuelType', newCar.fuelType);
        formData.append('mileage', newCar.mileage);
        formData.append('plateNumber', newCar.plateNumber);
        formData.append('isAvailable', newCar.isAvailable);
        
        // إضافة المميزات كسلسلة JSON
        formData.append('features', JSON.stringify(newCar.features));
    
        // إضافة الصور
        for (let i = 0; i < newCar.images.length; i++) {
          formData.append('images', newCar.images[i]);
        }
    
        const response = await axios.post("https://backend-fpnx.onrender.com/carrental", formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
    
        if (response.data && response.data.car) {
          setCars(prevCars => [...prevCars, response.data.car]);
          setShowModal(false);
        } else {
          throw new Error("استجابة غير متوقعة من الخادم");
        }
      } catch (error) {
        console.error("حدث خطأ أثناء إضافة السيارة:", error);
        setError(error.response?.data?.message || error.message || "فشل في إضافة السيارة");
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
  
          const response = await fetch("https://backend-fpnx.onrender.com/carrental/admin/company-bookings", {
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

    
    const handleCarClick = (id) => {
      navigate(`/car/${id}`);
    };

    const handleBookingClick = (id) => {
      navigate(`/bookingcars/${id}`);
    };

    const renderContent = () => {
      switch (currentPage) {
        case "cars":
          return (
            <div className="w-full mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">إدارة السيارات</h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="add-flight-btn"
                >
                  <span className="plus-icon">+</span>
                  <span>إضافة سيارة</span>
                </button>
              </div>
    
              {carsLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>جاري تحميل البيانات...</p>
                </div>
              ) : cars.length > 0 ? (
                <div className="flights-table-container">
                  <table className="flights-table">
                    <thead>
                      <tr>
                        <th>الماركة</th>
                        <th>الموديل</th>
                        <th>السنة</th>
                        <th>السعر اليومي</th>
                        <th>عدد المقاعد</th>
                        <th>نوع القير</th>
                        <th>نوع الوقود</th>
                        <th>المميزات</th>
                        <th>الحالة</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cars.map((car) => (
                        <tr
                          key={car._id}
                          className="flight-row"
                          onClick={() => handleCarClick(car._id)}
                        >
                          <td>{car.brand}</td>
                          <td>{car.model}</td>
                          <td>{car.year}</td>
                          <td>{car.pricePerDay}</td>
                          <td>{car.seats}</td>
                          <td>{car.transmission}</td>
                          <td>{car.fuelType}</td>
                          <td>{car.features.join(', ')}</td>
                          <td>{car.isAvailable ? "متاحة" : "غير متاحة"}</td>
                          <td>
                            <div className="action-buttons">
                              {/* يمكن إضافة أزرار التعديل والحذف هنا */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🚗</div>
                  <h3>لا توجد سيارات حالياً</h3>
                  <p>قم بإضافة سيارات جديدة لتظهر هنا</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="add-first-flight-btn"
                  >
                    إضافة سيارة جديدة
                  </button>
                </div>
              )}
            </div>
          );

          case "bookings":
            return (
              <div className="w-full mt-6">
                {/* ... (بقية الكود كما هو) */}
                {bookings.length > 0 ? (
                  <div className="bookings-table-container">
                    <table className="bookings-table">
                      <thead>
                        <tr>
                          <th>اسم المستخدم</th>
                          <th>البريد الإلكتروني</th>
                          <th>السيارة</th>
                          <th>تاريخ الاستلام</th>
                          <th>تاريخ التسليم</th>
                          <th>الحالة</th>
                          <th>السعر الإجمالي</th>
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
                            <td>{booking.user?.name || "غير معروف"}</td>
                            <td>{booking.user?.email || "غير معروف"}</td>
                            <td>{`${booking.car?.make} ${booking.car?.model}`}</td>
                            <td>{new Date(booking.pickupDate).toLocaleDateString()}</td>
                            <td>{new Date(booking.returnDate).toLocaleDateString()}</td>
                            <td>
                              {booking.status === "confirmed" ? "مؤكدة" : 
                               booking.status === "pending" ? "قيد الانتظار" : 
                               booking.status === "cancelled" ? "ملغاة" : booking.status}
                            </td>
                            <td>{booking.totalPrice}</td>
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
        default:
          return null;
      }
    };

    return (
      <div className="dashboard-container" dir="rtl">
        <header className="dashboard-header">
          <div className="header-logo">
            <span className="logo-icon"><CarTaxiFront /></span>
            <h1>لوحة تحكم تأجير السيارات</h1>
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
              <li className={currentPage === "cars" ? "active" : ""}>
                <button onClick={() => setCurrentPage("cars")}>
                  <span className="nav-icon"><Car /></span>
                  <span className="nav-text">إدارة السيارات</span>
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
                <h2>إضافة سيارة جديدة</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="close-modal-btn"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <AddCarForm onFormSubmit={handleFormSubmit} />
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

  // مكون نموذج إضافة سيارة
  function AddCarForm({ onFormSubmit }) {
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());
    const [type, setType] = useState("sedan");
    const [pricePerDay, setPricePerDay] = useState(100);
    const [seats, setSeats] = useState(5);
    const [transmission, setTransmission] = useState("automatic");
    const [fuelType, setFuelType] = useState("gasoline");
    const [mileage, setMileage] = useState(0);
    const [plateNumber, setPlateNumber] = useState("");
    const [features, setFeatures] = useState([]);
    const [images, setImages] = useState([]);
    const [isAvailable, setIsAvailable] = useState(true);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (images.length === 0) {
            setError("يجب رفع صور السيارة");
            return;
        }

        if (!plateNumber) {
            setError("رقم اللوحة مطلوب");
            return;
        }

        const newCar = {
            make,
            model,
            year,
            type,
            pricePerDay,
            seats,
            transmission,
            fuelType,
            mileage,
            plateNumber,
            features,
            images,
            isAvailable
        };

        onFormSubmit(newCar);
    };

    const validFeatures = ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'LeatherSeats', 'BackupCamera', 'USBPort', 'KeylessEntry'];

    const handleFeatureChange = (feature) => {
        setFeatures(prev => {
            if (prev.includes(feature)) {
                return prev.filter(f => f !== feature);
            } else {
                return [...prev, feature];
            }
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImages(Array.from(e.target.files));
            setError("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
                <label>الشركة المصنعة (Make)</label>
                <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>الموديل (Model)</label>
                <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>السنة</label>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    required
                    min="2000"
                    max={new Date().getFullYear()}
                />
            </div>

            <div className="form-group">
                <label>نوع السيارة</label>
                <select value={type} onChange={(e) => setType(e.target.value)} required>
                    <option value="sedan">سيدان</option>
                    <option value="suv">SUV</option>
                    <option value="truck">شاحنة</option>
                    <option value="van">فان</option>
                    <option value="luxury">فاخرة</option>
                    <option value="sports">رياضية</option>
                </select>
            </div>

            <div className="form-group">
                <label>السعر اليومي</label>
                <input
                    type="number"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(Number(e.target.value))}
                    required
                    min="1"
                />
            </div>

            <div className="form-group">
                <label>عدد المقاعد</label>
                <input
                    type="number"
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    required
                    min="2"
                    max="9"
                />
            </div>

            <div className="form-group">
                <label>نوع القير</label>
                <select value={transmission} onChange={(e) => setTransmission(e.target.value)} required>
                    <option value="automatic">أوتوماتيك</option>
                    <option value="manual">يدوي</option>
                </select>
            </div>

            <div className="form-group">
                <label>نوع الوقود</label>
                <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} required>
                    <option value="gasoline">بنزين</option>
                    <option value="diesel">ديزل</option>
                    <option value="electric">كهرباء</option>
                    <option value="hybrid">هايبرد</option>
                </select>
            </div>

            <div className="form-group">
                <label>عدد الكيلومترات</label>
                <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    min="0"
                />
            </div>

            <div className="form-group">
                <label>رقم اللوحة</label>
                <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>المميزات</label>
                <div className="features-checkboxes">
                    {validFeatures.map((feature) => (
                        <div key={feature} className="feature-checkbox">
                            <input
                                type="checkbox"
                                id={feature}
                                checked={features.includes(feature)}
                                onChange={() => handleFeatureChange(feature)}
                            />
                            <label htmlFor={feature}>{feature}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>صور السيارة (يجب اختيار صورة واحدة على الأقل)</label>
                <input
                    type="file"
                    onChange={handleImageChange}
                    multiple
                    required
                    accept="image/*"
                />
                <div className="image-preview">
                    {images.map((image, index) => (
                        <div key={index} className="preview-item">
                            <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} width="100" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>الحالة</label>
                <div className="availability-radio">
                    <label>
                        <input
                            type="radio"
                            checked={isAvailable}
                            onChange={() => setIsAvailable(true)}
                        />
                        متاحة
                    </label>
                    <label>
                        <input
                            type="radio"
                            checked={!isAvailable}
                            onChange={() => setIsAvailable(false)}
                        />
                        غير متاحة
                    </label>
                </div>
            </div>

            <button type="submit" className="submit-btn">
                إضافة سيارة
            </button>
        </form>
    );
}

  export default DashboardCarRental;