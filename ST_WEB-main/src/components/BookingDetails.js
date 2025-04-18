import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FlightDetails2.css";

function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.error("Token not found. Please log in first.");
      return;
    }

    fetchBookingDetails();
  }, [id, token]);

  const fetchBookingDetails = () => {
    setLoading(true);
    axios
      .get(`https://backend-fpnx.onrender.com/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBooking(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching booking details:", error);
        setLoading(false);
      });
  };

  const handleUpdateStatus = (newStatus) => {
    setActionLoading(true);
    setActionError(null);
  
    axios
      .put(`https://backend-fpnx.onrender.com/bookings/approve/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setBooking(prev => ({
          ...prev,
          booking: {
            ...prev.booking,
            status: newStatus
          }
        }));
        setActionLoading(false);
      })
      .catch((error) => {
        console.error(`Error updating booking status to ${newStatus}:`, error);
        // تجاهل الخطأ إذا كان يتعلق فقط بإرسال البريد الإلكتروني
        if (error.response?.data?.message.includes("sendBookingEmail")) {
          setBooking(prev => ({
            ...prev,
            booking: {
              ...prev.booking,
              status: newStatus
            }
          }));
        } else {
          setActionError(`فشل تحديث الحالة: ${error.response?.data?.message || error.message}`);
        }
        setActionLoading(false);
      });
  };
  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'Approved': return 'status-approved';
      case 'Rejected': return 'status-rejected';
      default: return '';
    }
  };

  if (loading) return (
    <div className="loading-message">جاري تحميل تفاصيل الحجز...</div>
  );
  
  if (!booking) return (
    <div className="error-message">تعذر العثور على تفاصيل الحجز.</div>
  );

  // استخراج البيانات المهمة من الرد الجديد
  const { user, flight, booking: bookingDetails } = booking;

  // تحديد فئة المقعد بناءً على رقم المقعد
  const getSeatClass = (seatNumber) => {
    if (!seatNumber) return "غير محدد";
    return seatNumber.startsWith('E') ? 'اقتصادي' : 
           seatNumber.startsWith('B') ? 'رجال الأعمال' : 
           seatNumber.startsWith('F') ? 'الأولى' : 'غير محدد';
  };

  return (
    <div className="flight-details" dir="rtl">
      <h2>تفاصيل الحجز</h2>
      
      {actionError && <div className="error-message">{actionError}</div>}
      
      <div className="details-view">
        <p><strong>المستخدم:</strong> {user.fullName}</p>
        <p><strong>البريد الإلكتروني:</strong> {user.email}</p>
        <p><strong>رقم الهاتف:</strong> {user.phone}</p>
        <p><strong>رقم الرحلة:</strong> {flight.flightNumber}</p>
        
        {/* معلومات المقعد */}
        <p><strong>رقم المقعد:</strong> {bookingDetails.seatNumber || "غير محدد"}</p>
        <p><strong>فئة المقعد:</strong> {getSeatClass(bookingDetails.seatNumber)}</p>
        <p><strong>سعر المقعد:</strong> {bookingDetails.seatPrice || flight.priceEconomy} $</p>
        
        <p><strong>رقم الجواز:</strong> {bookingDetails.passportNumber}</p>
        <p>
          <strong>الحالة:</strong> 
          <span className={`status-label ${getStatusClass(bookingDetails.status)}`}>
            {bookingDetails.status === 'Pending' ? 'معلق' : 
             bookingDetails.status === 'Approved' ? 'مقبول' : 
             bookingDetails.status === 'Rejected' ? 'مرفوض' : bookingDetails.status}
          </span>
        </p>
        <p><strong>تاريخ الإنشاء:</strong> {new Date(bookingDetails.createdAt).toLocaleString("ar-SA")}</p>
        
        <div className="actions">
          <button onClick={() => navigate("/AdminDashboard")} className="delete-schedule-btn">
            العودة
          </button>
          <button 
            onClick={() => handleUpdateStatus('Rejected')} 
            className="delete-schedule-btn"
            disabled={actionLoading}
          >
            {actionLoading ? 'جاري المعالجة...' : 'رفض الحجز'}
          </button>
          <button 
            onClick={() => handleUpdateStatus('Approved')} 
            className="add-schedule-btn"
            disabled={actionLoading}
          >
            {actionLoading ? 'جاري المعالجة...' : 'قبول الحجز'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;