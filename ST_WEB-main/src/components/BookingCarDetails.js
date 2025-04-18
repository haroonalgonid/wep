import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/FlightDetails2.css";

function BookingCarDetails() {
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
          `https://backend-fpnx.onrender.com/carrental/bookings/${id}`,
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

        if (!data.booking) {
          throw new Error("بيانات الحجز غير متوفرة في الاستجابة");
        }

        // حساب عدد الأيام
        const pickupDate = new Date(data.booking.pickupDate);
        const returnDate = new Date(data.booking.returnDate);
        const timeDiff = returnDate - pickupDate;
        const numberOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        setBooking({
          ...data.booking,
          numberOfDays
        });
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
        `https://backend-fpnx.onrender.com/carrental/car-bookings/${id}/status`,
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
        `https://backend-fpnx.onrender.com/carrental/car-bookings/${id}/payment-status`,
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
      <h2>تفاصيل حجز السيارة</h2>
      
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
          <p><strong>تاريخ الاستلام:</strong> {new Date(booking.pickupDate).toLocaleDateString('ar-SA')}</p>
          <p><strong>تاريخ الإرجاع:</strong> {new Date(booking.returnDate).toLocaleDateString('ar-SA')}</p>
          <p><strong>عدد الأيام:</strong> {booking.numberOfDays}</p>
          <p><strong>السعر الإجمالي:</strong> {booking.totalPrice} $</p>
          <p><strong>مكان الاستلام:</strong> {booking.pickupLocation}</p>
          <p><strong>مكان الإرجاع:</strong> {booking.returnLocation}</p>
        </div>

        <div className="details-section">
          <h3>معلومات السيارة</h3>
          {booking.car ? (
            <>
              <p><strong>الشركة المصنعة:</strong> {booking.car.make}</p>
              <p><strong>الموديل:</strong> {booking.car.model}</p>
              <p><strong>السنة:</strong> {booking.car.year}</p>
              <p><strong>نوع السيارة:</strong> 
                {booking.car.type === 'sedan' ? 'سيدان' : 
                 booking.car.type === 'suv' ? 'دفع رباعي' : 
                 booking.car.type === 'truck' ? 'شاحنة' : 
                 booking.car.type === 'luxury' ? 'فاخرة' : booking.car.type}
              </p>
              <p><strong>سعر اليوم:</strong> {booking.car.pricePerDay} $</p>
              <p><strong>عدد المقاعد:</strong> {booking.car.seats}</p>
              <p><strong>ناقل الحركة:</strong> 
                {booking.car.transmission === 'automatic' ? 'أوتوماتيك' : 'يدوي'}
              </p>
              <p><strong>نوع الوقود:</strong> 
                {booking.car.fuelType === 'gasoline' ? 'بنزين' : 
                 booking.car.fuelType === 'diesel' ? 'ديزل' : 
                 booking.car.fuelType === 'electric' ? 'كهربائي' : booking.car.fuelType}
              </p>
              <p><strong>رقم اللوحة:</strong> {booking.car.plateNumber}</p>
            </>
          ) : (
            <p className="error-message">معلومات السيارة غير متوفرة</p>
          )}
        </div>

        <div className="details-section">
          <h3>معلومات العميل</h3>
          {booking.user ? (
            <>
              <p><strong>الاسم:</strong> {booking.user.fullName || 'غير متوفر'}</p>
              <p><strong>البريد الإلكتروني:</strong> {booking.user.email}</p>
              <p><strong>الهاتف:</strong> {booking.user.phone || 'غير متوفر'}</p>
              <p><strong>رقم الرخصة:</strong> {booking.driverLicenseNumber || 'غير متوفر'}</p>
            </>
          ) : (
            <p className="error-message">معلومات العميل غير متوفرة</p>
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

export default BookingCarDetails;