import React, { useState } from "react";
import axios from "axios";

const CreateHotelForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    hotelData: {
      name: "",
      type: "",
      address: "",
      phoneNumber: "",
      website: "",
      email: "",
      facilities: [],
      stars: 0,
    },
    identityImage: null,
    hotelLogo: null,
    commercialRecord: null,
    license: null,
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("hotelData.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        hotelData: {
          ...formData.hotelData,
          [field]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (name === "images") {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleFacilitiesChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      hotelData: {
        ...formData.hotelData,
        facilities: value.split(",").map((item) => item.trim()),
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
  
    try {
      const formDataToSend = new FormData();
  
      // البيانات الأساسية
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
  
      // بيانات الفندق
      const hotelData = {
        ...formData.hotelData,
        facilities: formData.hotelData.facilities,
        stars: parseInt(formData.hotelData.stars) || 0
      };
      
      formDataToSend.append("hotelData", JSON.stringify(hotelData));
  
      // الملفات الفردية
      if (formData.identityImage) {
        formDataToSend.append("identityImage", formData.identityImage);
      }
      if (formData.hotelLogo) {
        formDataToSend.append("hotelLogo", formData.hotelLogo);
      }
      if (formData.commercialRecord) {
        formDataToSend.append("commercialRecord", formData.commercialRecord);
      }
      if (formData.license) {
        formDataToSend.append("license", formData.license);
      }
  
      // صور الفندق المتعددة
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });
  
      // إعدادات الطلب
      const config = {
        headers: { 
          "Content-Type": "multipart/form-data",
          "X-Request-Once": Date.now()
        },
        timeout: 30000
      };
  
      const response = await axios.post(`https://backend-fpnx.onrender.com/hotels`, formDataToSend, config);
      
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("تم إنشاء الفندق بنجاح!");
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error details:", error);
      let errorMessage = "حدث خطأ أثناء إنشاء الفندق";
      
      if (error.response) {
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      errorMessage;
      } else if (error.request) {
        errorMessage = "لا يوجد اتصال بالخادم";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-hotel-form">
      <h2>إنشاء فندق جديد</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* <h3>بيانات المشرف</h3> */}
        <input
          type="text"
          name="name"
          placeholder="اسم المشرف"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني للمشرف"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* <h3>بيانات الفندق</h3> */}
        <input
          type="text"
          name="hotelData.name"
          placeholder="اسم الفندق"
          value={formData.hotelData.name}
          onChange={handleChange}
          required
        />
        <select
          name="hotelData.type"
          value={formData.hotelData.type}
          onChange={handleChange}
          required
        >
          <option value="">اختر نوع الفندق</option>
          <option value="luxury">فاخر</option>
          <option value="budget">اقتصادي</option>
        </select>
        <input
          type="text"
          name="hotelData.address"
          placeholder="العنوان"
          value={formData.hotelData.address}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="hotelData.phoneNumber"
          placeholder="رقم الهاتف"
          value={formData.hotelData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="hotelData.website"
          placeholder="الموقع الإلكتروني"
          value={formData.hotelData.website}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="hotelData.email"
          placeholder="البريد الإلكتروني للفندق"
          value={formData.hotelData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="facilities"
          placeholder="المرافق (مفصولة بفاصلة)"
          onChange={handleFacilitiesChange}
          required
        />

        {/* <h3>المستندات المطلوبة</h3> */}
        <div>
          <label>صورة الهوية</label>
          <input
            type="file"
            name="identityImage"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label>شعار الفندق</label>
          <input
            type="file"
            name="hotelLogo"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label>السجل التجاري</label>
          <input
            type="file"
            name="commercialRecord"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label>الترخيص</label>
          <input
            type="file"
            name="license"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label>صور الفندق (يمكن اختيار أكثر من صورة)</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "جاري الإرسال..." : "إرسال"}
          </button>
          <button type="button" onClick={onClose}>
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateHotelForm;