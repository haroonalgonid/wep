import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/FlightDetails2.css";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
        }

        const response = await fetch(
          `https://backend-fpnx.onrender.com/restaurants/orders/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "فشل في جلب تفاصيل الطلب");
        }

        const data = await response.json();
        console.log("بيانات الطلب:", data);

        if (!data.order) {
          throw new Error("بيانات الطلب غير متوفرة في الاستجابة");
        }

        setOrder(data.order);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب تفاصيل الطلب:", error);
        setActionError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const updateStatus = async (newStatus) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
      }

      const response = await fetch(
        `https://backend-fpnx.onrender.com/restaurants/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل في تحديث حالة الطلب");
      }

      const data = await response.json();
      setOrder(prev => ({ ...prev, status: data.status }));
    } catch (error) {
      console.error("حدث خطأ أثناء تحديث حالة الطلب:", error);
      setActionError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const updatePaymentStatus = async (newPaymentStatus) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
      }

      const response = await fetch(
        `https://backend-fpnx.onrender.com/restaurants/orders/${id}/payment-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentStatus: newPaymentStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل في تحديث حالة الدفع");
      }

      const data = await response.json();
      setOrder(prev => ({ ...prev, paymentStatus: data.paymentStatus }));
    } catch (error) {
      console.error("حدث خطأ أثناء تحديث حالة الدفع:", error);
      setActionError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusArabicName = (status) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'prepared': return 'تم التجهيز';
      case 'delivered': return 'تم التسليم';
      case 'cancelled': return 'ملغى';
      default: return status;
    }
  };

  const getPaymentStatusArabicName = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid': return 'مدفوع';
      case 'unpaid': return 'غير مدفوع';
      default: return paymentStatus;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'prepared': return 'status-approved';
      case 'delivered': return 'status-approved';
      case 'cancelled': return 'status-rejected';
      default: return '';
    }
  };

  const getPaymentStatusClass = (paymentStatus) => {
    switch(paymentStatus) {
      case 'paid': return 'status-approved';
      case 'unpaid': return 'status-pending';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading-message">جاري تحميل تفاصيل الطلب...</div>;
  }

  if (actionError) {
    return (
      <div className="error-message">
        خطأ: {actionError}
        <button
          onClick={() => navigate(-1)}
          className="delete-schedule-btn"
        >
          العودة
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-message">
        لا توجد بيانات للطلب المطلوب.
        <button
          onClick={() => navigate(-1)}
          className="delete-schedule-btn"
        >
          العودة
        </button>
      </div>
    );
  }

  return (
    <div className="flight-details" dir="rtl">
      <h2>تفاصيل الطلب</h2>
      
      <div className="details-view">
        <div className="details-section">
          <h3>معلومات الطلب</h3>
          <p><strong>رقم الطلب:</strong> {order._id}</p>
          <p>
            <strong>حالة الطلب:</strong> 
            <span className={`status-label ${getStatusClass(order.status)}`}>
              {getStatusArabicName(order.status)}
            </span>
          </p>
          <p>
            <strong>حالة الدفع:</strong> 
            <span className={`status-label ${getPaymentStatusClass(order.paymentStatus)}`}>
              {getPaymentStatusArabicName(order.paymentStatus)}
            </span>
          </p>
          <p><strong>تاريخ الطلب:</strong> {new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
          <p><strong>السعر الإجمالي:</strong> {order.totalPrice} $</p>
        </div>

        <div className="details-section">
          <h3>معلومات العميل</h3>
          {order.user ? (
            <>
              <p><strong>الاسم:</strong> {order.user.fullName || 'غير متوفر'}</p>
              <p><strong>البريد الإلكتروني:</strong> {order.user.email}</p>
              <p><strong>الهاتف:</strong> {order.user.phone || 'غير متوفر'}</p>
            </>
          ) : (
            <p className="error-message">معلومات العميل غير متوفرة</p>
          )}
        </div>

        <div className="details-section">
          <h3>معلومات المطعم</h3>
          {order.restaurant ? (
            <>
              <p><strong>اسم المطعم:</strong> {order.restaurant.name}</p>
              <p><strong>العنوان:</strong> {order.restaurant.address}</p>
            </>
          ) : (
            <p className="error-message">معلومات المطعم غير متوفرة</p>
          )}
        </div>

        <div className="details-section">
          <h3>تفاصيل الوجبات</h3>
          {order.menuItems && order.menuItems.length > 0 ? (
            <div className="items-list">
              {order.menuItems.map((item, index) => (
                <div key={index} className="item-detail">
                  <p><strong>اسم الوجبة:</strong> {item.menuItem.name}</p>
                  <p><strong>الكمية:</strong> {item.quantity}</p>
                  <p><strong>السعر:</strong> {item.menuItem.price} $</p>
                  <p><strong>المجموع:</strong> {item.quantity * item.menuItem.price} $</p>
                </div>
              ))}
              <div className="total-price">
                <p><strong>المجموع الكلي:</strong> {order.totalPrice} $</p>
              </div>
            </div>
          ) : (
            <p className="error-message">لا توجد وجبات في هذا الطلب</p>
          )}
        </div>

        <div className="actions">
          <button
            onClick={() => navigate(-1)}
            className="delete-schedule-btn"
          >
            العودة
          </button>
          
          <div className="status-actions">
            <button
              onClick={() => updateStatus('prepared')}
              disabled={actionLoading || order.status === 'prepared' || order.status === 'delivered' || order.status === 'cancelled'}
              className={`action-btn ${order.status === 'prepared' ? 'disabled-btn' : 'add-schedule-btn'}`}
            >
              {actionLoading ? 'جاري المعالجة...' : 'تم التجهيز'}
            </button>
            <button
              onClick={() => updateStatus('delivered')}
              disabled={actionLoading || order.status === 'delivered' || order.status === 'cancelled' || order.status === 'pending'}
              className={`action-btn ${order.status === 'delivered' ? 'disabled-btn' : 'add-schedule-btn'}`}
            >
              {actionLoading ? 'جاري المعالجة...' : 'تم التسليم'}
            </button>
            <button
              onClick={() => updateStatus('cancelled')}
              disabled={actionLoading || order.status === 'cancelled' || order.status === 'delivered'}
              className={`action-btn ${order.status === 'cancelled' ? 'disabled-btn' : 'delete-schedule-btn'}`}
            >
              {actionLoading ? 'جاري المعالجة...' : 'إلغاء'}
            </button>
          </div>
          
          <div className="payment-actions">
            <button
              onClick={() => updatePaymentStatus('paid')}
              disabled={actionLoading || order.paymentStatus === 'paid'}
              className={`action-btn ${order.paymentStatus === 'paid' ? 'disabled-btn' : 'add-schedule-btn'}`}
            >
              {actionLoading ? 'جاري المعالجة...' : 'تأكيد الدفع'}
            </button>
            <button
              onClick={() => updatePaymentStatus('unpaid')}
              disabled={actionLoading || order.paymentStatus === 'unpaid'}
              className={`action-btn ${order.paymentStatus === 'unpaid' ? 'disabled-btn' : 'delete-schedule-btn'}`}
            >
              {actionLoading ? 'جاري المعالجة...' : 'إلغاء الدفع'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;