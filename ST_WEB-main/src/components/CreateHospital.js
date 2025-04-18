import React, { useState } from "react";
import axios from "axios";

const CreateHospitalForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    hospitalData: {
      name: "",
      type: "",
      address: "",
      phoneNumber: "",
      website: "",
      email: "",
      facilities: [],
    },
    identityImage: null,
    hospitalLogo: null,
    commercialRecord: null,
    medicalLicense: null,
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("hospitalData.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        hospitalData: {
          ...formData.hospitalData,
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
      hospitalData: {
        ...formData.hospitalData,
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
  
      // بيانات المستشفى
      const hospitalData = {
        ...formData.hospitalData,
        facilities: formData.hospitalData.facilities
      };
      
      formDataToSend.append("hospitalData", JSON.stringify(hospitalData));
  
      // الملفات الفردية
      if (formData.identityImage) {
        formDataToSend.append("identityImage", formData.identityImage);
      }
      if (formData.hospitalLogo) {
        formDataToSend.append("hospitalLogo", formData.hospitalLogo);
      }
      if (formData.commercialRecord) {
        formDataToSend.append("commercialRecord", formData.commercialRecord);
      }
      if (formData.medicalLicense) {
        formDataToSend.append("medicalLicense", formData.medicalLicense);
      }
  
      // صور المستشفى المتعددة
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });
  
      // إضافة header لمنع تكرار الطلبات
      const config = {
        headers: { 
          "Content-Type": "multipart/form-data",
          "X-Request-Once": Date.now() // إضافة timestamp فريد
        },
        timeout: 30000 // timeout بعد 30 ثانية
      };
  
      const response = await axios.post(`https://backend-fpnx.onrender.com/hospitals/hospitals`, formDataToSend, config);
      
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("تم إنشاء المستشفى بنجاح!");
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error details:", error);
      let errorMessage = "حدث خطأ أثناء إنشاء المستشفى";
      
      if (error.response) {
        // الخطأ من الخادم
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      errorMessage;
      } else if (error.request) {
        // لم يتم استلام رد من الخادم
        errorMessage = "لا يوجد اتصال بالخادم";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-hospital-form">
      <h2>إنشاء مستشفى جديد</h2>
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
          name="hospitalData.name"
          placeholder="اسم المستشفى"
          value={formData.hospitalData.name}
          onChange={handleChange}
          required
        />
    <select
  name="hospitalData.type"
  value={formData.hospitalData.type}
  onChange={handleChange}
  required
>
  <option value="">اختر نوع المستشفى</option>
  <option value="general">مستشفى عام</option>
  <option value="specialized">مستشفى متخصص</option>
</select>
        <input
          type="text"
          name="hospitalData.address"
          placeholder="العنوان"
          value={formData.hospitalData.address}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="hospitalData.phoneNumber"
          placeholder="رقم الهاتف"
          value={formData.hospitalData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="hospitalData.website"
          placeholder="الموقع الإلكتروني"
          value={formData.hospitalData.website}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="hospitalData.email"
          placeholder="البريد الإلكتروني للمستشفى"
          value={formData.hospitalData.email}
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
          <label>شعار المستشفى</label>
          <input
            type="file"
            name="hospitalLogo"
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
          <label>الترخيص الطبي</label>
          <input
            type="file"
            name="medicalLicense"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label>صور المستشفى</label>
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

export default CreateHospitalForm;