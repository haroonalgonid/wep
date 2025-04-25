import React, { useState } from "react";
import axios from "axios";

const CreateRestaurantForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    restaurantData: {
      name: "",
      type: "",
      address: "",
      phoneNumber: "",
      email: "",
      description: "", // Added description field
    },
    identityImage: null,
    restaurantLogo: null,
    commercialRecord: null,
    license: null,
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("restaurantData.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        restaurantData: {
          ...formData.restaurantData,
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
  
      // بيانات المطعم
      formDataToSend.append("restaurantData", JSON.stringify(formData.restaurantData));
  
      // الملفات الفردية
      if (formData.identityImage) {
        formDataToSend.append("identityImage", formData.identityImage);
      }
      if (formData.restaurantLogo) {
        formDataToSend.append("restaurantLogo", formData.restaurantLogo);
      }
      if (formData.commercialRecord) {
        formDataToSend.append("commercialRecord", formData.commercialRecord);
      }
      if (formData.license) {
        formDataToSend.append("license", formData.license);
      }
  
      // صور المطعم المتعددة
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });
  
      // إعدادات الطلب
      const config = {
        headers: { 
          "Content-Type": "multipart/form-data",
          "X-Request-Once": Date.now()
        },
        timeout: 30000
      };
  
      const response = await axios.post(`https://backend-fpnx.onrender.com/restaurants/addRestaurant`, formDataToSend, config);
      
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("تم إنشاء المطعم بنجاح!");
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error details:", error);
      let errorMessage = "حدث خطأ أثناء إنشاء المطعم";
      
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
    <div className="create-restaurant-form">
      <h2>إنشاء مطعم جديد</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
        <input
          type="text"
          name="restaurantData.name"
          placeholder="اسم المطعم"
          value={formData.restaurantData.name}
          onChange={handleChange}
          required
        />
        <select
          name="restaurantData.type"
          value={formData.restaurantData.type}
          onChange={handleChange}
          required
        >
          <option value="">اختر نوع المطعم</option>
          <option value="fast_food">وجبات سريعة</option>
          <option value="casual_dining">مطعم عائلي</option>
          <option value="fine_dining">مطعم فاخر</option>
          <option value="buffet">بوفيه</option>
        </select>
        <input
          type="text"
          name="restaurantData.address"
          placeholder="العنوان"
          value={formData.restaurantData.address}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="restaurantData.phoneNumber"
          placeholder="رقم الهاتف"
          value={formData.restaurantData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="restaurantData.email"
          placeholder="البريد الإلكتروني للمطعم"
          value={formData.restaurantData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="restaurantData.description"
          placeholder="وصف المطعم"
          value={formData.restaurantData.description}
          onChange={handleChange}
          required
        />
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
          <label>شعار المطعم</label>
          <input
            type="file"
            name="restaurantLogo"
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
          <label>صور المطعم</label>
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

export default CreateRestaurantForm;