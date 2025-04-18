import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/FlightDetails2.css";

function BookingsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
        }

        const response = await fetch(
          `https://backend-fpnx.onrender.com/hospitals/admin/appointments/${id}`,
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
          throw new Error(errorData.message || "فشل في جلب تفاصيل الحجز");
        }

        const data = await response.json();
        if (!data.appointment) {
          throw new Error("بيانات الحجز غير متوفرة في الاستجابة");
        }

        setBooking(data.appointment);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب تفاصيل الحجز:", error);
        setActionError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const updateStatus = async (newStatus) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
      }

      const response = await fetch(
        `https://backend-fpnx.onrender.com/hospitals/appointments/${id}/status`,
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
        throw new Error(errorData.message || "فشل في تحديث حالة الحجز");
      }

      const data = await response.json();
      setBooking(prev => ({ ...prev, status: data.status }));
    } catch (error) {
      console.error("حدث خطأ أثناء تحديث حالة الحجز:", error);
      setActionError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const updatePaymentStatus = async (newPaymentStatus) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
      }

      const response = await fetch(
        `https://backend-fpnx.onrender.com/hospitals/appointments/${id}/payment-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentStatus: newPaymentStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل في تحديث حالة الدفع");
      }

      const data = await response.json();
      setBooking(prev => ({ ...prev, paymentStatus: data.paymentStatus }));
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
      case 'confirmed': return 'تم التأكيد';
      case 'cancelled': return 'ملغى';
      case 'completed': return 'مكتمل';
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
      case 'confirmed': return 'status-approved';
      case 'completed': return 'status-approved';
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
    return <div className="loading-message">جاري تحميل تفاصيل الحجز...</div>;
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

  if (!booking) {
    return (
      <div className="error-message">
        لا توجد بيانات للحجز المطلوب.
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
      <h2>تفاصيل الموعد الطبي</h2>
      
      <div className="details-view">
        <div className="details-section">
          <h3>معلومات الحجز</h3>
          <p><strong>رقم الحجز:</strong> {booking._id}</p>
          <p>
            <strong>حالة الحجز:</strong> 
            <span className={`status-label ${getStatusClass(booking.status)}`}>
              {getStatusArabicName(booking.status)}
            </span>
          </p>
          <p>
            <strong>حالة الدفع:</strong> 
            <span className={`status-label ${getPaymentStatusClass(booking.paymentStatus)}`}>
              {getPaymentStatusArabicName(booking.paymentStatus)}
            </span>
          </p>
          <p>
            <strong>التاريخ والوقت:</strong>{" "}
            {new Date(booking.dateTime).toLocaleDateString('ar-EG')} -{" "}
            {new Date(booking.dateTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="details-section">
          <h3>معلومات الطبيب</h3>
          {booking.doctor ? (
            <>
              <p><strong>الاسم:</strong> {booking.doctor.name}</p>
              <p><strong>التخصص:</strong> {booking.doctor.specialty}</p>
            </>
          ) : (
            <p className="error-message">معلومات الطبيب غير متوفرة</p>
          )}
        </div>

        <div className="details-section">
          <h3>معلومات المريض</h3>
          {booking.user ? (
            <>
              <p><strong>الاسم الكامل:</strong> {booking.user.fullName}</p>
              <p><strong>البريد الإلكتروني:</strong> {booking.user.email}</p>
              <p><strong>رقم الهاتف:</strong> {booking.user.phone}</p>
            </>
          ) : (
            <p className="error-message">معلومات المريض غير متوفرة</p>
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
              onClick={() => updateStatus('confirmed')}
              disabled={actionLoading || booking.status === 'confirmed'}
              className={`action-btn ${booking.status === 'confirmed' ? 'disabled-btn' : 'add-schedule-btn'}`}
            >
              {actionLoading ? 'جاري المعالجة...' : 'تأكيد الحجز'}
            </button>
            <button
              onClick={() => updateStatus('completed')}
              disabled={actionLoading || booking.status === 'completed'}
              className={`action-btn ${booking.status === 'completed' ? 'disabled-btn' : 'add-schedule-btn'}`}
            >
              {actionLoading ? 'جاري المعالجة...' : 'إكمال الحجز'}
            </button>
            <button
              onClick={() => updateStatus('cancelled')}
              disabled={actionLoading || booking.status === 'cancelled'}
              className={`action-btn ${booking.status === 'cancelled' ? 'disabled-btn' : 'delete-schedule-btn'}`}
            >
              {actionLoading ? 'جاري المعالجة...' : 'إلغاء الحجز'}
            </button>
          </div>
          
          <div className="payment-actions">
            <button
              onClick={() => updatePaymentStatus('paid')}
              disabled={actionLoading || booking.paymentStatus === 'paid'}
              className={`action-btn ${booking.paymentStatus === 'paid' ? 'disabled-btn' : 'add-schedule-btn'}`}
            >
              {actionLoading ? 'جاري المعالجة...' : 'تأكيد الدفع'}
            </button>
            <button
              onClick={() => updatePaymentStatus('unpaid')}
              disabled={actionLoading || booking.paymentStatus === 'unpaid'}
              className={`action-btn ${booking.paymentStatus === 'unpaid' ? 'disabled-btn' : 'delete-schedule-btn'}`}
            >
              {actionLoading ? 'جاري المعالجة...' : 'إلغاء الدفع'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingsDetails;