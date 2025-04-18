import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, FileText, Plane, Hospital, Hotel, Utensils, LogOut, FileTextIcon } from "lucide-react";

function DashboardRestaurant() {
  const [showModal, setShowModal] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState("menu");
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState("");
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [moderatorInfo, setModeratorInfo] = useState({
    name: "مدير النظام",
    role: "مسؤول",
    moderatorType: ""
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "" // 'success' أو 'error'
  });
  const [isAddingItem, setIsAddingItem] = useState(false);
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

  // جلب قائمة الوجبات من الخادم
  useEffect(() => {
    const fetchMenuItems = async () => {
      setMenuLoading(true);
      setMenuError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
        }

        const response = await fetch("https://backend-fpnx.onrender.com/restaurants/admin/restaurant-menuItems", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("فشل في جلب بيانات الوجبات");
        }

        const data = await response.json();
        setMenuItems(data.menuItems || []);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الوجبات:", error);
        setMenuError(error.message);
        setMenuItems([]);
      } finally {
        setMenuLoading(false);
      }
    };

    if (currentPage === "menu") {
      fetchMenuItems();
    }
  }, [currentPage]);

// إضافة وجبة جديدة
 const handleFormSubmit = async (newItem) => {
  setIsAddingItem(true);
  setMenuError("");
  
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
    }

    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('description', newItem.description);
    formData.append('price', newItem.price);
    formData.append('category', newItem.category);
    
    if (newItem.image) {
      formData.append('image', newItem.image);
    }

    const response = await axios.post(
      "https://backend-fpnx.onrender.com/restaurants/menuItems",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success) {
      // إعادة جلب البيانات بدلاً من الإضافة المباشرة
      const fetchResponse = await fetch("https://backend-fpnx.onrender.com/restaurants/admin/restaurant-menuItems", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!fetchResponse.ok) {
        throw new Error("فشل في جلب بيانات الوجبات بعد الإضافة");
      }

      const data = await fetchResponse.json();
      setMenuItems(data.menuItems || []);
      
      setShowModal(false);
      setNotification({
        show: true,
        message: "تمت إضافة الوجبة بنجاح",
        type: "success"
      });
    } else {
      throw new Error(response.data.message || "فشل في إضافة الوجبة");
    }
  } catch (error) {
    console.error("حدث خطأ أثناء إضافة الوجبة:", error);
    setNotification({
      show: true,
      message: error.response?.data?.message || error.message,
      type: "error"
    });
  } finally {
    setIsAddingItem(false);
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  }
};

  // جلب الطلبات
  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
        }

        const response = await fetch("https://backend-fpnx.onrender.com/restaurants/admin/restaurant-orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("فشل في جلب بيانات الطلبات");
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الطلبات:", error);
        setOrdersError(error.message);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (currentPage === "orders") {
      fetchOrders();
    }
  }, [currentPage]);

  const handleMenuItemClick = (id) => {
    navigate(`/menu-item/${id}`);
  };

  const handleOrderClick = (id) => {
    navigate(`/order/${id}`);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "menu":
        return (
          
          <div className="w-full mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">إدارة الوجبات</h2>
              <button
                onClick={() => setShowModal(true)}
                className="add-flight-btn"
              >
                <span className="plus-icon">+</span>
                <span>إضافة وجبة</span>
              </button>
            </div>
  
            {menuLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : menuItems.length > 0 ? (
              <div className="flights-table-container">
                <table className="flights-table">
                  <thead>
                    <tr>
                      {/* <th>الصورة</th> */}
                      <th>الاسم</th>
                      <th>الوصف</th>
                      <th>السعر</th>
                      <th>الفئة</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr
                        key={item._id}
                        className="flight-row"
                        onClick={() => handleMenuItemClick(item._id)}
                      >
                        {/* <td>
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="menu-item-image"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          )}
                        </td> */}
                        <td>{item.name}</td>
                        <td className="description-cell">{item.description}</td>
                        <td>{item.price} ر.س</td>
                        <td>
                          {item.category === 'starter' && 'مقبلات'}
                          {item.category === 'main' && 'طبق رئيسي'}
                          {item.category === 'dessert' && 'حلويات'}
                          {item.category === 'beverage' && 'مشروبات'} 
                          </td>
                        <td>
                          <div className="action-buttons">
                            {/* أزرار التعديل والحذف يمكن إضافتها هنا */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon"><Utensils  /></div>
                <h3>لا توجد وجبات حالياً</h3>
                <p>قم بإضافة وجبات جديدة لتظهر هنا</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="add-first-flight-btn"
                >
                  إضافة وجبة جديدة
                </button>
              </div>
            )}
          </div>
        );

        case "orders":
            return (
              <div className="w-full mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">إدارة الطلبات</h2>
                </div>
          
                {ordersLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>جاري تحميل بيانات الطلبات...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="bookings-table-container">
                    <table className="bookings-table">
                      <thead>
                        <tr>
                          <th>رقم الطلب</th>
                          <th>الزبون</th>
                          <th>الوجبات</th>
                          <th>التاريخ</th>
                          <th>الحالة</th>
                          <th>المجموع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order._id}
                            className="booking-row"
                            onClick={() => handleOrderClick(order._id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>#{order._id.substring(order._id.length - 6)}</td> {/* Using part of ID as order number */}
                            <td>{order.user?.fullName || 'زائر'}</td> {/* Changed from customer.name to user.fullName */}
                            <td>
                              {order.menuItems.map(item => item.menuItem.name).join('، ')} {/* Changed from items to menuItems */}
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                              {order.status === 'pending' && 'قيد الانتظار'}
                              {order.status === 'preparing' && 'قيد التحضير'}
                              {order.status === 'ready' && 'جاهز للتوصيل'}
                              {order.status === 'delivered' && 'تم التسليم'}
                              {order.status === 'cancelled' && 'ملغى'}
                            </td>
                            <td>
                              {order.totalPrice || 
                               order.menuItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)} ر.س
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon"><FileTextIcon  /></div>
                    <h3>لا توجد طلبات حالياً</h3>
                    <p>سيتم عرض الطلبات هنا عند توفرها</p>
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
         {/* الإشعار يظهر هنا في الأعلى */}
    {notification.show && (
      <div className={`notification ${notification.type}`}>
        {notification.message}
        <button 
          onClick={() => setNotification({ show: false, message: "", type: "" })}
          className="close-notification"
        >
          ×
        </button>
      </div>
    )}

      <header className="dashboard-header">
        <div className="header-logo">
          <span className="logo-icon"><Utensils  /></span>
          <h1>لوحة تحكم المطعم</h1>
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
          <span className="company-logo">🍽️</span>
          <h2>نظام إدارة المطعم</h2>
        </div> */}
        <nav className="sidebar-nav">
          <ul>
            <li className={currentPage === "menu" ? "active" : ""}>
              <button onClick={() => setCurrentPage("menu")}>
                <span className="nav-icon"><Utensils  /></span>
                <span className="nav-text">إدارة الوجبات</span>
              </button>
            </li>
            <li className={currentPage === "orders" ? "active" : ""}>
              <button onClick={() => setCurrentPage("orders")}>
                <span className="nav-icon"><FileTextIcon  /></span>
                <span className="nav-text">إدارة الطلبات</span>
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
              <h2>إضافة وجبة جديدة</h2>
              <button
                onClick={() => setShowModal(false)}
                className="close-modal-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
            <AddMenuItemForm 
  onFormSubmit={handleFormSubmit} 
  isAddingItem={isAddingItem} 
/>
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

// مكون نموذج إضافة وجبة جديدة
function AddMenuItemForm({ onFormSubmit , isAddingItem  }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("starter");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      name,
      description,
      price,
      category,
      image
    };

    onFormSubmit(newItem);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>اسم الوجبة</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>الوصف</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>السعر</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          min="0"
          step="0.01"
        />
      </div>

      <div className="form-group">
  <label>الفئة</label>
  <select value={category} onChange={(e) => setCategory(e.target.value)} required>
    <option value="starter">مقبلات</option>
    <option value="main">طبق رئيسي</option>
    <option value="dessert">حلويات</option>
    <option value="beverage">مشروبات</option> {/* تم التعديل هنا */}
  </select>
</div>


      <div className="form-group">
        <label>صورة الوجبة</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          required
        />
      </div>

      <button type="submit" className="submit-btn" disabled={isAddingItem}>
  {isAddingItem ? (
    <>
      <span className="spinner"></span>
      جاري الإضافة...
    </>
  ) : (
    "إضافة وجبة"
  )}
</button>
    </form>
  );
}

export default DashboardRestaurant;