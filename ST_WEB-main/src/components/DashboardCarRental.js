  import { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { User, FileText, Car, CarTaxiFront, LayoutDashboard, LogOut, FileTextIcon , X, Check } from "lucide-react";
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
        
        // إضافة المميزات كسلسلة JSON
        formData.append('features', JSON.stringify(newCar.features));
    
        // إضافة الصور
        for (let i = 0; i < newCar.images.length; i++) {
          formData.append('images', newCar.images[i]);
        }
    
        const response = await axios.post("https://backend-fpnx.onrender.com/carrental/cars", formData, {
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
                        
                        <th>الموديل</th>
                        <th>السنة</th>
                        <th>عدد المقاعد</th>
                        <th>نوع القير</th>
                        <th>نوع الوقود</th>
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
                          <td>{car.model}</td>
                          <td>{car.year}</td>
                          <td>{car.seats}</td>
                          <td>{car.transmission}</td>
                          <td>{car.fuelType}</td>
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
    const [formData, setFormData] = useState({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      type: "sedan",
      pricePerDay: 100,
      seats: 5,
      transmission: "automatic",
      fuelType: "gasoline",
      mileage: 0,
      plateNumber: "",
      features: [],
      images: [],
    });
    
    const [error, setError] = useState("");
    const [previewImages, setPreviewImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validFeatures = ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'LeatherSeats', 'BackupCamera', 'USBPort', 'KeylessEntry'];
    const carTypes = ['sedan', 'suv', 'truck', 'van', 'luxury', 'sports'];
    const transmissions = ['automatic', 'manual'];
    const fuelTypes = ['gasoline', 'diesel', 'electric', 'hybrid'];

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: name === 'year' || name === 'pricePerDay' || name === 'seats' || name === 'mileage' 
          ? Number(value) 
          : value
      }));
    };

    const handleFeatureChange = (feature) => {
      setFormData(prev => ({
        ...prev,
        features: prev.features.includes(feature)
          ? prev.features.filter(f => f !== feature)
          : [...prev.features, feature]
      }));
    };

    const handleImageChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        setFormData(prev => ({ ...prev, images: files }));
        
        // إنشاء معاينات للصور
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
        setError("");
      }
    };

    const removeImage = (index) => {
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData(prev => ({ ...prev, images: newImages }));
      
      const newPreviews = [...previewImages];
      newPreviews.splice(index, 1);
      setPreviewImages(newPreviews);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      // التحقق من الصحة
      if (formData.images.length === 0) {
        setError("يجب رفع صورة واحدة على الأقل للسيارة");
        setIsSubmitting(false);
        return;
      }

      if (!formData.plateNumber) {
        setError("رقم اللوحة مطلوب");
        setIsSubmitting(false);
        return;
      }

      try {
        await onFormSubmit(formData);
        // Reset form after successful submission
        setFormData({
          make: "",
          model: "",
          year: new Date().getFullYear(),
          type: "sedan",
          pricePerDay: 100,
          seats: 5,
          transmission: "automatic",
          fuelType: "gasoline",
          mileage: 0,
          plateNumber: "",
          features: [],
          images: [],
        });
        setPreviewImages([]);
      } catch (err) {
        console.error("Submission error:", err);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md flex items-center">
            <X className="mr-2" size={18} />
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* العمود الأول */}
          <div className="space-y-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">الشركة المصنعة</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">الموديل</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">السنة</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="2000"
                max={new Date().getFullYear()}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع السيارة</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {carTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'sedan' ? 'سيدان' : 
                     type === 'suv' ? 'SUV' : 
                     type === 'truck' ? 'شاحنة' : 
                     type === 'van' ? 'فان' : 
                     type === 'luxury' ? 'فاخرة' : 'رياضية'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر اليومي</label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                  type="number"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* العمود الثاني */}
          <div className="space-y-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">عدد المقاعد</label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                required
                min="2"
                max="9"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع القير</label>
              <select 
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {transmissions.map(trans => (
                  <option key={trans} value={trans}>
                    {trans === 'automatic' ? 'أوتوماتيك' : 'يدوي'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع الوقود</label>
              <select 
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {fuelTypes.map(fuel => (
                  <option key={fuel} value={fuel}>
                    {fuel === 'gasoline' ? 'بنزين' : 
                     fuel === 'diesel' ? 'ديزل' : 
                     fuel === 'electric' ? 'كهرباء' : 'هايبرد'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">عدد الكيلومترات</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم اللوحة</label>
              <input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* المميزات */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">المميزات</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {validFeatures.map((feature) => (
              <div key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  id={feature}
                  checked={formData.features.includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={feature} className="mr-2 text-sm text-gray-700">
                  {feature}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* صور السيارة */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صور السيارة (يجب اختيار صورة واحدة على الأقل)
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            required
            accept="image/*"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          
          {previewImages.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">معاينة الصور:</h4>
              <div className="flex flex-wrap gap-3">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={preview} 
                      alt={`Preview ${index}`} 
                      className="h-24 w-24 object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

    
        {/* زر الإرسال */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الإضافة...
              </>
            ) : (
              <>
                <Check className="ml-2" size={18} />
                إضافة سيارة
              </>
            )}
          </button>
        </div>
      </form>
    );
  }

  export default DashboardCarRental;