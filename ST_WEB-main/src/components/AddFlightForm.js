import React, { useState } from "react";
import axios from "axios";
import "../styles/AddFlight.css";

function AddFlightForm({ onFormSubmit }) {
  const [formData, setFormData] = useState({
    flightNumber: "",
    aircraftType: "",
    departureAirport: "",
    arrivalAirport: "",
    departureTime: "",
    arrivalTime: "",
    priceEconomy: "",
    priceBusiness: "",
    priceFirstClass: "",
    availableSeatsEconomy: "",
    availableSeatsBusiness: "",
    availableSeatsFirstClass: "",
    discount: "" // إضافة حقل الخصم
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://backend-fpnx.onrender.com/flights",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

      console.log("Flight Added:", response.data);
      alert("تم إضافة الرحلة بنجاح");
      onFormSubmit();
    } catch (error) {
      console.error("Error adding flight:", error);
      alert("حدث خطأ أثناء إضافة الرحلة");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* الحقول الأخرى */}
      <label>رقم الرحلة:</label>
      <input type="text" name="flightNumber" value={formData.flightNumber} onChange={handleChange} required />

      <label>نوع الطائرة:</label>
      <input type="text" name="aircraftType" value={formData.aircraftType} onChange={handleChange} required />

      <label>مطار المغادرة:</label>
      <input type="text" name="departureAirport" value={formData.departureAirport} onChange={handleChange} required />

      <label>مطار الوصول:</label>
      <input type="text" name="arrivalAirport" value={formData.arrivalAirport} onChange={handleChange} required />

      <label>وقت المغادرة:</label>
      <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleChange} required />

      <label>وقت الوصول:</label>
      <input type="datetime-local" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} required />

      <label>سعر الدرجة الاقتصادية:</label>
      <input type="number" name="priceEconomy" value={formData.priceEconomy} onChange={handleChange} required />

      <label>سعر درجة رجال الأعمال:</label>
      <input type="number" name="priceBusiness" value={formData.priceBusiness} onChange={handleChange} required />

      <label>سعر الدرجة الأولى:</label>
      <input type="number" name="priceFirstClass" value={formData.priceFirstClass} onChange={handleChange} required />

      <label>المقاعد المتاحة - الدرجة الاقتصادية:</label>
      <input type="number" name="availableSeatsEconomy" value={formData.availableSeatsEconomy} onChange={handleChange} required />

      <label>المقاعد المتاحة - درجة رجال الأعمال:</label>
      <input type="number" name="availableSeatsBusiness" value={formData.availableSeatsBusiness} onChange={handleChange} required />

      <label>المقاعد المتاحة - الدرجة الأولى:</label>
      <input type="number" name="availableSeatsFirstClass" value={formData.availableSeatsFirstClass} onChange={handleChange} required />

      {/* حقل الخصم غير الإجباري */}
      <label>الخصم (اختياري):</label>
      <input 
        type="number" 
        name="discount" 
        value={formData.discount} 
        onChange={handleChange} 
        placeholder="أدخل نسبة الخصم إذا وجدت"
        min="0"
        max="100"
      />

      <button type="submit" className="add-flight-btn">إضافة الرحلة</button>
    </form>
  );
}

export default AddFlightForm;