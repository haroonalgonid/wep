import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/FlightDetails2.css";

function FlightDetails() {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // أضف هذا السطر

  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

useEffect(() => {
  if (!token) {
    console.error("Token not found. Please log in first.");
    setLoading(false);
    return;
  }

  axios
    .get(`https://backend-fpnx.onrender.com/flights/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setFlight(response.data.flight); // تغيير هنا
      setFormData(response.data.flight); // تغيير هنا
      setLoading(false);
    })
    .catch((error) => {
      console.error("There was an error fetching the flight details:", error);
      setLoading(false);
    });
}, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

const handleSave = async () => {
  setIsSaving(true);
  try {
    const response = await axios.put(
      `https://backend-fpnx.onrender.com/flights/${id}`,
      formData, // تم تغيير هذا من { flight: formData } إلى formData مباشرة
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // تحديث الحالة بالبيانات الجديدة من الاستجابة
    setFlight(response.data);
    setFormData(response.data);
    setIsEditing(false);
    alert("تم تحديث الرحلة بنجاح!");
  } catch (error) {
    console.error("Error updating flight:", error);
    alert("فشل في تحديث الرحلة: " + (error.response?.data?.message || error.message));
  } finally {
    setIsSaving(false);
  }
};

  const handleDelete = () => {
    if (window.confirm("هل أنت متأكد من حذف هذه الرحلة؟")) {
      axios
        .delete(`https://backend-fpnx.onrender.com/flights/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          alert("تم حذف الرحلة بنجاح!");
          navigate("/adminDashboard"); // توجيه المستخدم إلى لوحة التحكم بعد الحذف
        })
        .catch((error) => {
          console.error("There was an error deleting the flight:", error);
          alert("فشل في حذف الرحلة.");
        });
    }
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (!flight) {
    return <div>الرحلة غير موجودة</div>;
  }

  return (
    <div className="flight-details" dir="rtl">
      <h2>تفاصيل الرحلة</h2>
      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>رقم الرحلة:</label>
            <input
              type="text"
              name="flightNumber"
              value={formData.flightNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>نوع الطائرة:</label>
            <input
              type="text"
              name="aircraftType"
              value={formData.aircraftType}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>الحالة:</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>المطار المغادر:</label>
            <input
              type="text"
              name="departureAirport"
              value={formData.departureAirport}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>المطار القادم:</label>
            <input
              type="text"
              name="arrivalAirport"
              value={formData.arrivalAirport}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>وقت المغادرة:</label>
            <input
              type="datetime-local"
              name="departureTime"
              value={new Date(formData.departureTime).toISOString().slice(0, 16)}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>وقت الوصول:</label>
            <input
              type="datetime-local"
              name="arrivalTime"
              value={new Date(formData.arrivalTime).toISOString().slice(0, 16)}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>سعر الدرجة الاقتصادية:</label>
            <input
              type="number"
              name="priceEconomy"
              value={formData.priceEconomy}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>سعر درجة رجال الأعمال:</label>
            <input
              type="number"
              name="priceBusiness"
              value={formData.priceBusiness}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>سعر الدرجة الأولى:</label>
            <input
              type="number"
              name="priceFirstClass"
              value={formData.priceFirstClass}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>المقاعد المتاحة (الاقتصادية):</label>
            <input
              type="number"
              name="availableSeatsEconomy"
              value={formData.availableSeatsEconomy}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>المقاعد المتاحة (رجال الأعمال):</label>
            <input
              type="number"
              name="availableSeatsBusiness"
              value={formData.availableSeatsBusiness}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>المقاعد المتاحة (الدرجة الأولى):</label>
            <input
              type="number"
              name="availableSeatsFirstClass"
              value={formData.availableSeatsFirstClass}
              onChange={handleInputChange}
            />
          </div>
          <button onClick={handleSave} className="add-schedule-btn">
            حفظ التعديلات
          </button>
          <button onClick={() => setIsEditing(false)} className="delete-schedule-btn">
            إلغاء
          </button>
        </div>
      ) : (
        <div className="details-view">
          <p>رقم الرحلة: {flight.flightNumber}</p>
          <p>نوع الطائرة: {flight.aircraftType}</p>
          <p>الحالة: {flight.status}</p>
          <p>المطار المغادر: {flight.departureAirport}</p>
          <p>المطار القادم: {flight.arrivalAirport}</p>
          <p>وقت المغادرة: {new Date(flight.departureTime).toLocaleString('ar-SA')}</p>
          <p>وقت الوصول: {new Date(flight.arrivalTime).toLocaleString('ar-SA')}</p>
          <p>سعر الدرجة الاقتصادية: {flight.priceEconomy}</p>
          <p>سعر درجة رجال الأعمال: {flight.priceBusiness}</p>
          <p>سعر الدرجة الأولى: {flight.priceFirstClass}</p>
          <p>المقاعد المتاحة (الاقتصادية): {flight.availableSeatsEconomy}</p>
          <p>المقاعد المتاحة (رجال الأعمال): {flight.availableSeatsBusiness}</p>
          <p>المقاعد المتاحة (الدرجة الأولى): {flight.availableSeatsFirstClass}</p>
          <div className="actions">
            <button onClick={() => setIsEditing(true)} className="add-schedule-btn">
              تعديل
            </button>
            <button onClick={handleDelete} className="delete-schedule-btn">
              حذف
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightDetails;