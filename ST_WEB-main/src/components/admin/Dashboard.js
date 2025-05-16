import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashbordflight.css";
import { User, FileText, Plane, Hospital, Hotel, Utensils, LayoutDashboard, LogOut, Car, BarChart2 } from "lucide-react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

import UserManagement from "./UsersManagement";
import AirlineDetails from "./AirlineDetails";
import HospitalDetails from "./HospitalDetails";
import HotelDetails from "./HotelDetails";

import axios from "axios";
import { fetchAirlines, toggleApproval, deleteAirline } from "./AirlineManagement";
import { fetchHospitals, toggleHospitalApproval, deleteHospital } from "./HospitalMnangement";
import { fetchRestaurants, toggleRestaurantApproval, deleteRestaurant } from "./RestaurantMangement";
import { fetchCarRentals, toggleCarRentalApproval, deleteCarRental } from "./CarRentalManagement";

import { fetchHotels, toggleHotelApproval, deleteHotel, createHotel } from "./HotelManagement";

import CreateAirlineForm from "../CreateAirline";
import CreateHospitalForm from "../CreateHospital";
import CreateHotelForm from "../CreateHotel";
import CreateRestaurantForm from "../CreateRestaurant";
import CreateCarRentalForm from "../CreateCarRentalForm";
import RestaurantDetails from "../RestaurantDetails";
import CarRentalDetails from "../admin/CarRentalDetails";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

function Dashboard() {
  const [currentPage, setCurrentPage] = useState("statistics");
  const [requests, setRequests] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [carRentals, setCarRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedCarRental, setSelectedCarRental] = useState(null);
  const [statistics, setStatistics] = useState(null);

  const [selectedAirline, setSelectedAirline] = useState(null);
  const [showCreateAirlineForm, setShowCreateAirlineForm] = useState(false);
  const [showCreateHospitalForm, setShowCreateHospitalForm] = useState(false);
  const [showCreateHotelForm, setShowCreateHotelForm] = useState(false);
  const [showCreateRestaurantForm, setShowCreateRestaurantForm] = useState(false);
  const [showCreateCarRentalForm, setShowCreateCarRentalForm] = useState(false);
  const [profile, setProfile] = useState(null);


  const closeAirlineDetails = () => {
    setSelectedAirline(null);
  };
  const closeHospitalDetails = () => {
    setSelectedHospital(null);
  };
  const closeHotelDetails = () => {
    setSelectedHotel(null);
  };
  const closeCarRentalDetails = () => {
    setSelectedCarRental(null);
  };
  

  const fetchStatistics = () => {
    setLoading(true);
    axios.get("https://backend-fpnx.onrender.com/stats/statistics", {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      setStatistics(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching statistics:", error);
      setLoading(false);
    });
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

  // دالة لجلب بيانات الملف الشخصي
  const fetchProfile = () => {
    axios
      .get("https://backend-fpnx.onrender.com/admin/profile", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  };

  // جلب بيانات الملف الشخصي عند تحميل المكون
  useEffect(() => {
    fetchProfile();
  }, [token]);


  const fetchHotelsData = () => {
    setLoading(true);
    fetchHotels(token)
      .then((response) => {
        console.log("Fetched hotels:", response.data.hotels); 
        
        // استخراج بيانات الفندق من كل كائن داخل المصفوفة
        const extractedHotels = response.data.hotels.map(hotelData => hotelData.hotel);
        
        setHotels(extractedHotels); // تعيين البيانات المعالجة
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      });
  };

  
  const handleToggleHotelApproval = (hotelId, isApproved) => {
    toggleHotelApproval(hotelId, isApproved, token)
      .then(() => {
        fetchHotelsData(); // إعادة جلب بيانات الفنادق بعد التعديل
        setSelectedHotel(null); // إلغاء تحديد الفندق
      })
      .catch((error) => {
        console.error("Error toggling hotel approval:", error); // طباعة الخطأ في حالة فشل العملية
      });
  };
  
  const handleDeleteHotel = (hotelId) => {
    deleteHotel(hotelId, token)
      .then(() => {
        fetchHotelsData(); // إعادة جلب بيانات الفنادق بعد الحذف
        setSelectedHotel(null); // إلغاء تحديد الفندق
      })
      .catch((error) => {
        console.error("Error deleting hotel:", error); // طباعة الخطأ في حالة فشل العملية
      });
  };

  const fetchHospitalsData = () => {
    setLoading(true);
    fetchHospitals()
      .then((response) => {
        console.log("Fetched hospitals:", response.data.hospitals); // تحقق من البيانات
        setHospitals(response.data.hospitals); // تعيين البيانات بشكل صحيح
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hospitals:", error);
        setLoading(false);
      });
  };


  const handleToggleHospitalApproval = (hospitalId, isApproved) => {
    toggleHospitalApproval(hospitalId, isApproved, token)
      .then(() => {
        fetchHospitalsData();
        setSelectedHospital(null);
      })
      .catch((error) => {
        console.error("Error toggling hospital approval:", error);
      });
  };

  const handleDeleteHospital = (hospitalId) => {
    deleteHospital(hospitalId, token)
      .then(() => {
        fetchHospitalsData();
        setSelectedHospital(null);
      })
      .catch((error) => {
        console.error("Error deleting hospital:", error);
      });
  };


  const fetchAirlinesData = () => {
    setLoading(true);
    fetchAirlines(token)
      .then((response) => {
        setAirlines(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching airlines:", error);
        setLoading(false);
      });
  };

  const handleToggleApproval = (airlineId, isApproved) => {
    toggleApproval(airlineId, isApproved, token)
      .then(() => {
        fetchAirlinesData();
        setSelectedAirline(null);
      })
      .catch((error) => {
        console.error("Error toggling approval:", error);
      });
  };

  const handleDeleteAirline = (airlineId) => {
    deleteAirline(airlineId, token)
      .then(() => {
        fetchAirlinesData();
        setSelectedAirline(null);
      })
      .catch((error) => {
        console.error("Error deleting airline:", error);
      });
  };
  
  const fetchRestaurantsData = () => {
    setLoading(true);
    fetchRestaurants(token)
      .then((response) => {
        const formattedData = response.data.restaurants.map(item => ({
          ...item.restaurant, 
          averageRating: item.averageRating,
          totalReviews: item.totalReviews
        }));
        setRestaurants(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      });
  };
 
  
  const handleToggleRestaurantApproval = (restaurantId, isApproved) => {
    toggleRestaurantApproval(restaurantId, isApproved, token)
      .then(() => {
        fetchRestaurantsData();
        setSelectedRestaurant(null);
      })
      .catch((error) => {
        console.error("Error toggling restaurant approval:", error);
      });
  };
  
  const handleDeleteRestaurant = (restaurantId) => {
    deleteRestaurant(restaurantId, token)
      .then(() => {
        fetchRestaurantsData();
        setSelectedRestaurant(null);
      })
      .catch((error) => {
        console.error("Error deleting restaurant:", error);
      });
  };
  
  const closeRestaurantDetails = () => {
    setSelectedRestaurant(null);
  };

  // جديد: دالة لجلب شركات تأجير السيارات
const fetchCarRentalsData = () => {
  setLoading(true);
  fetchCarRentals(token)
    .then((response) => {
      // تعديل هنا لاستخراج البيانات بشكل صحيح
      const formattedData = response.data.companies.map(item => ({
        ...item.company, // ننسخ كل خصائص كائن الشركة
        averageRating: item.averageRating,
        totalReviews: item.totalReviews
      }));
      setCarRentals(formattedData);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching car rentals:", error);
      setLoading(false);
    });
};

  useEffect(() => {
    if (currentPage === "statistics") {
      fetchStatistics();
    }
  }, [currentPage, token]);

  // جديد: دالة للتعامل مع تغيير حالة شركة تأجير السيارات
  const handleToggleCarRentalApproval = (carRentalId, isApproved) => {
    toggleCarRentalApproval(carRentalId, isApproved, token)
      .then(() => {
        fetchCarRentalsData();
        setSelectedCarRental(null);
      })
      .catch((error) => {
        console.error("Error toggling car rental approval:", error);
      });
  };

  // جديد: دالة للتعامل مع حذف شركة تأجير السيارات
  const handleDeleteCarRental = (carRentalId) => {
    deleteCarRental(carRentalId, token)
      .then(() => {
        fetchCarRentalsData();
        setSelectedCarRental(null);
      })
      .catch((error) => {
        console.error("Error deleting car rental:", error);
      });
  };

  useEffect(() => {
    if (currentPage === "restaurants") {
      fetchRestaurantsData();
    }
  }, [currentPage, token]);

  useEffect(() => {
    if (currentPage === "hospitals") {
      fetchHospitalsData();
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === "airlines") {
      fetchAirlinesData();
    }
  }, [currentPage, token]);

  useEffect(() => {
    if (currentPage === "hotels") {
      fetchHotelsData();
    }
  }, [currentPage, token]);

  // جديد: إضافة useEffect لجلب شركات تأجير السيارات
  useEffect(() => {
    if (currentPage === "carRentals") {
      fetchCarRentalsData();
    }
  }, [currentPage, token]);

  // دالة لجلب الطلبات
  const fetchRequests = () => {
    setLoading(true);
    axios
      .get("https://backend-fpnx.onrender.com/admin/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRequests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
        setLoading(false);
      });
  };

  // جلب البيانات عند تغيير الصفحة
  useEffect(() => {
    switch (currentPage) {
      case "requests":
        fetchRequests();
        break;
      case "airlines":
        fetchAirlines();
        break;
      case "hospitals":
        fetchHospitals();
        break;
      case "hotels":
        fetchHotels();
        break;
      case "restaurants":
        fetchRestaurants();
        break;
      case "carRentals":
        fetchCarRentalsData();
        break;
      default:
        break;
    }
  }, [currentPage, token]);

  // عرض المحتوى بناءً على الصفحة الحالية
  const renderContent = () => {
    switch (currentPage) {
      case "users":
        return <UserManagement />;
      case "requests":
        return (
          <div className="dashboard-section">
            <h2 className="section-title">إدارة الطلبات</h2>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : requests.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>نوع الطلب</th>
                      <th>المستخدم</th>
                      <th>الحالة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request._id}>
                        <td>{request.type}</td>
                        <td>{request.user.fullName}</td>
                        <td>{request.status}</td>
                        <td>
                          <button className="edit-btn">تعديل</button>
                          <button className="delete-btn">حذف</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon"><FileText size={80} /></div>
                <h3>لا توجد طلبات</h3>
              </div>
            )}
          </div>
        );
      case "airlines":
        return (
          <div className="w-full mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">إدارة شركات الطيران</h2>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setShowCreateAirlineForm(true)}
              >
                إضافة شركة طيران
              </button>
            </div>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : airlines.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>اسم الشركة</th>
                      <th>الشعار</th>
                      <th>الحالة</th>

                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
  {airlines.slice().reverse().map((airline) => (
    <tr key={airline._id} onClick={() => setSelectedAirline(airline)}>
      <td>{airline.companyName}</td>
      <td>
        <img
          src={`${airline.companyLogo}`}
          alt={airline.companyName}
          className="company-logo"
        />
      </td>
      <td>
        <span className={airline.isApproved ? "status-approved" : "status-pending"}>
          {airline.isApproved ? "مفعل" : "غير مفعل"}
        </span>
        </td>

      <td>
        <button className="edit-btn">تعديل</button>
      </td>
    </tr>
  ))}
</tbody>

                </table>
              </div>
            ) : (
              <div className="empty-state">
                  <div className="empty-icon"><Plane size={80} /></div>
                  <h3>لا توجد شركات طيران</h3>
              </div>
            )}
          </div>
        );
      case "hospitals":
        return (
          <div className="w-full mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">إدارة المستشفيات</h2>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setShowCreateHospitalForm(true)}
              >
                إضافة مستشفى
              </button>
            </div>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : hospitals.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>اسم المستشفى</th>
                      <th>المدينة</th>
                      <th>الحالة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
  {hospitals.slice().reverse().map(({ hospital }) => (
    <tr key={hospital._id} onClick={() => setSelectedHospital(hospital)}>
      <td>{hospital.name}</td>
      <td>{hospital.address}</td>
      <td>
        <span className={hospital.isApproved ? "status-approved" : "status-pending"}>
          {hospital.isApproved ? "مفعل" : "غير مفعل"}
        </span>
      </td>
      <td>
        <button className="edit-btn">تعديل</button>
      </td>
    </tr>
  ))}
</tbody>

                </table>
              </div>
            ) : (
              <div className="empty-state">
                  <div className="empty-icon"><Hospital size={80} /></div>
                  <h3>لا توجد مستشفيات</h3>
              </div>
            )}
          </div>
        );

     case "hotels":
        return (
          <div className="w-full mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">إدارة الفنادق</h2>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setShowCreateHotelForm(true)}
              >
                إضافة فندق
              </button>
            </div>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : hotels.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>اسم الفندق</th>
                      <th>المدينة</th>
                      <th>الحالة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
  {hotels.slice().reverse().map((hotel) => (
    <tr key={hotel._id} onClick={() => setSelectedHotel(hotel)}>
      <td>{hotel.name}</td>
      <td>{hotel.address}</td>
      <td>
        <span className={hotel.isApproved ? "status-approved" : "status-pending"}>
          {hotel.isApproved ? "مفعل" : "غير مفعل"}
        </span>
      </td>
      <td>
        <button className="edit-btn">تعديل</button>
      </td>
    </tr>
  ))}
</tbody>

                </table>
              </div>
            ) : (
              <div className="empty-state">
                  <div className="empty-icon"><Hotel size={80} /></div>
                  <h3>لا توجد فنادق</h3>
              </div>
            )}
          </div>
        );
        case "restaurants":
          return (
            <div className="w-full mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">إدارة المطاعم</h2>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowCreateRestaurantForm(true)}
                >
                  إضافة مطعم
                </button>
              </div>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>جاري تحميل البيانات...</p>
                </div>
              ) : restaurants.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>اسم المطعم</th>
                        <th>العنوان</th>
                        <th></th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
  {[...restaurants].reverse().map((restaurant) => (
    <tr key={restaurant._id} onClick={() => setSelectedRestaurant(restaurant)}>
      <td>{restaurant.name}</td>
      <td>{restaurant.address}</td>
      <td>{restaurant.cuisineType}</td>
      <td>
        <span className={restaurant.isApproved ? "status-approved" : "status-pending"}>
          {restaurant.isApproved ? "مفعل" : "غير مفعل"}
        </span>
      </td>
      <td>
        <button className="edit-btn">تعديل</button>
      </td>
    </tr>
  ))}
</tbody>

                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon"><Utensils size={80} /></div>
                  <h3>لا توجد مطاعم</h3>
                </div>
              )}
            </div>
          );
      // جديد: إضافة حالة لعرض شركات تأجير السيارات
      case "carRentals":
        return (
          <div className="w-full mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">إدارة شركات تأجير السيارات</h2>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setShowCreateCarRentalForm(true)}
              >
                إضافة شركة تأجير سيارات
              </button>
            </div>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : carRentals.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>اسم الشركة</th>
                      <th>العنوان</th>
                      <th>رقم الاتصال</th>
                      <th>الحالة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                   <tbody>
        {carRentals.slice().reverse().map((carRental) => (
          <tr key={carRental._id} onClick={() => setSelectedCarRental(carRental)}>
            <td>{carRental.name}</td>
            <td>{carRental.address}</td>
            <td>{carRental.phoneNumber}</td>
            <td>
              <span className={carRental.isApproved ? "status-approved" : "status-pending"}>
                {carRental.isApproved ? "مفعل" : "غير مفعل"}
              </span>
            </td>
            <td>
              <button className="edit-btn">تعديل</button>
            </td>
          </tr>
        ))}
      </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                  <div className="empty-icon"><Car size={80} /></div>
                  <h3>لا توجد شركات تأجير سيارات</h3>
              </div>
            )}
          </div>
        );
        case "statistics":
          if (!statistics) return (
            <div className="empty-state">
              <div className="empty-icon"><BarChart2 size={80} /></div>
              <h3>لا توجد بيانات إحصائية</h3>
            </div>
          );
        
          // بيانات الرسومات البيانية
          const flightStatusData = {
            labels: statistics.airline.flightStatusCounts.map(item => item._id),
            datasets: [{
              label: 'حالة الرحلات',
              data: statistics.airline.flightStatusCounts.map(item => item.count),
              backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
            }]
          };
        
          const bookingsData = {
            labels: ['الفنادق', 'تأجير السيارات'],
            datasets: [{
              label: 'إجمالي الحجوزات',
              data: [statistics.hotel.totalBookings, statistics.carRental.totalBookings],
              backgroundColor: ['#FF6384', '#36A2EB'],
            }]
          };
        
          const entitiesData = {
            labels: ['شركات الطيران', 'الفنادق', 'المستشفيات', 'المطاعم', 'تأجير السيارات'],
            datasets: [{
              label: 'عدد الجهات المسجلة',
              data: [
                statistics.airline.totalAirlines,
                statistics.hotel.totalHotels,
                statistics.hospital.totalHospitals,
                statistics.restaurant.totalRestaurants,
                statistics.carRental.totalRentals
              ],
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
              ],
            }]
          };
        
          return (
            <div className="dashboard-section">
              <h2 className="section-title">الإحصائيات العامة</h2>
              
              <div className="stats-and-charts-grid">
                {/* إحصائيات سريعة في الجانب الأيمن */}
                <div className="quick-stats-container">
                  <div className="quick-stats">
                    <div className="stat-card">
                      <h4><User size={18} /> المستخدمين</h4>
                      <p>{statistics.users.totalUsers}</p>
                    </div>
                    <div className="stat-card">
                      <h4><Plane size={18} /> الرحلات</h4>
                      <p>{statistics.airline.totalFlights}</p>
                    </div>
                    <div className="stat-card">
                      <h4><Hotel size={18} /> الغرف</h4>
                      <p>{statistics.hotel.availableRooms} متاحة</p>
                    </div>
                    <div className="stat-card">
                      <h4><Utensils size={18} /> الطلبات</h4>
                      <p>{statistics.restaurant.totalOrders}</p>
                    </div>
                  </div>
                </div>
                
                {/* الرسومات البيانية في الجانب الأيسر */}
                <div className="charts-container">
                  <div className="charts-grid">
                    {/* رسمة بيانية للجهات المسجلة */}
                    <div className="chart-card">
                      <h3>الجهات المسجلة في النظام</h3>
                      <div className="chart-container">
                        <Bar 
                          data={entitiesData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'top',
                                rtl: true,
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
          
                    {/* رسمة بيانية دائرية للحجوزات */}
                    <div className="chart-card">
                      <h3>توزيع الحجوزات</h3>
                      <div className="chart-container">
                        <Pie 
                          data={bookingsData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'top',
                                rtl: true,
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
          
                    {/* رسمة بيانية لحالة الرحلات */}
                    <div className="chart-card">
                      <h3>حالة الرحلات الجوية</h3>
                      <div className="chart-container">
                        <Bar 
                          data={flightStatusData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'top',
                                rtl: true,
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
        <LayoutDashboard className="company-logo w-5 h-5 text-blue-500" />
        <h1>لوحة التحكم العامة</h1>
        </div>
        <div className="header-controls">
          <div className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              {/* تحديث النصوص بناءً على بيانات الملف الشخصي */}
              <span className="user-name">
                {profile ? profile.email : "جارٍ التحميل..."}
              </span>
              <span className="user-role">
                {profile ? profile.role : "جارٍ التحميل..."}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* الشريط الجانبي */}
      <aside className="dashboard-sidebar">
        <nav className="sidebar-nav">
          <ul>
          <li className={currentPage === "statistics" ? "active" : ""}>
  <button onClick={() => setCurrentPage("statistics")}>
    <BarChart2 size={20} />
    <span className="nav-text">الإحصائيات</span>
  </button>
</li>
            <li className={currentPage === "users" ? "active" : ""}>
              <button onClick={() => setCurrentPage("users")}>
                <User size={20} />
                <span className="nav-text">المستخدمين</span>
              </button>
            </li>
            
            <li className={currentPage === "airlines" ? "active" : ""}>
              <button onClick={() => setCurrentPage("airlines")}>
                <Plane size={20} />
                <span className="nav-text">شركات الطيران</span>
              </button>
            </li>
            <li className={currentPage === "hospitals" ? "active" : ""}>
              <button onClick={() => setCurrentPage("hospitals")}>
                <Hospital size={20} />
                <span className="nav-text">المستشفيات</span>
              </button>
            </li>
            <li className={currentPage === "hotels" ? "active" : ""}>
              <button onClick={() => setCurrentPage("hotels")}>
                <Hotel size={20} />
                <span className="nav-text">الفنادق</span>
              </button>
            </li>
            <li className={currentPage === "restaurants" ? "active" : ""}>
              <button onClick={() => setCurrentPage("restaurants")}>
                <Utensils size={20} />
                <span className="nav-text">المطاعم</span>
              </button>
            </li>
            <li className={currentPage === "carRentals" ? "active" : ""}>
              <button onClick={() => setCurrentPage("carRentals")}>
              <Car size={20} />
              <span className="nav-text"> تأجير السيارات</span>
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
      <main className="dashboard-main">
        {renderContent()}
        {selectedAirline && (
          <AirlineDetails
            airline={selectedAirline}
            onClose={closeAirlineDetails}
            onToggleApproval={handleToggleApproval}
            onDelete={handleDeleteAirline}
          />
        )}
        {selectedRestaurant && (
          <RestaurantDetails
            restaurant={selectedRestaurant}
            onClose={closeRestaurantDetails}
            onToggleApproval={handleToggleRestaurantApproval}
            onDelete={handleDeleteRestaurant}
          />
        )}
        {selectedCarRental && (
          <CarRentalDetails
            carRental={selectedCarRental}
            onClose={closeCarRentalDetails}
            onToggleApproval={handleToggleCarRentalApproval}
            onDelete={handleDeleteCarRental}
          />
        )}
        {showCreateRestaurantForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <CreateRestaurantForm
                onClose={() => setShowCreateRestaurantForm(false)}
                onSuccess={() => {
                  setShowCreateRestaurantForm(false);
                  fetchRestaurantsData();
                }}
              />
            </div>
          </div>
        )}
        {selectedHospital && (
          <HospitalDetails
            hospital={selectedHospital}
            onClose={closeHospitalDetails}
            onToggleApproval={handleToggleHospitalApproval}
            onDelete={handleDeleteHospital}
          />
        )}
        {selectedHotel && (
          <HotelDetails
            hotel={selectedHotel}
            onClose={closeHotelDetails}
            onToggleApproval={handleToggleHotelApproval}
            onDelete={handleDeleteHotel}
          />
        )}
        {showCreateAirlineForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <CreateAirlineForm
                onClose={() => setShowCreateAirlineForm(false)}
                onSuccess={() => {
                  setShowCreateAirlineForm(false);
                  fetchAirlinesData();
                }}
              />
            </div>
          </div>
        )}
        {showCreateHospitalForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <CreateHospitalForm
                onClose={() => setShowCreateHospitalForm(false)}
                onSuccess={() => {
                  setShowCreateHospitalForm(false);
                  fetchHospitalsData();
                }}
              />
            </div>
          </div>
        )}
        {showCreateHotelForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <CreateHotelForm
                onClose={() => setShowCreateHotelForm(false)}
                onSuccess={() => {
                  setShowCreateHotelForm(false);
                  fetchHotelsData();
                }}
              />
            </div>
          </div>
        )}
        {showCreateCarRentalForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <CreateCarRentalForm
                onClose={() => setShowCreateCarRentalForm(false)}
                onSuccess={() => {
                  setShowCreateCarRentalForm(false);
                  fetchCarRentalsData();
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;