import React, { useState } from "react";
import axios from "axios";

const CreateCarRentalForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyData: {
      name: "",
      type: "luxury", // القيمة الافتراضية
      address: "",
      phoneNumber: "",
      website: "",
      email: "",
      description: "",
      facilities: [],
    },
    identityImage: null,
    companyLogo: null,
    commercialRecord: null,
    license: null,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("companyData.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        companyData: {
          ...formData.companyData,
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
      companyData: {
        ...formData.companyData,
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
  
      // Basic data
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
  
      // Company data
      const companyData = {
        ...formData.companyData,
        facilities: formData.companyData.facilities
      };
      
      formDataToSend.append("companyData", JSON.stringify(companyData));
  
      // Single files
      if (formData.identityImage) {
        formDataToSend.append("identityImage", formData.identityImage);
      }
      if (formData.companyLogo) {
        formDataToSend.append("companyLogo", formData.companyLogo);
      }
      if (formData.commercialRecord) {
        formDataToSend.append("commercialRecord", formData.commercialRecord);
      }
      if (formData.license) {
        formDataToSend.append("license", formData.license);
      }
  
      // Multiple images
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });
  
      // Request configuration
      const config = {
        headers: { 
          "Content-Type": "multipart/form-data",
          "X-Request-Once": Date.now(),
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        timeout: 30000
      };
  
      const response = await axios.post(
        "https://backend-fpnx.onrender.com/carrental", 
        formDataToSend, 
        config
      );
      
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("تم إنشاء شركة التأجير بنجاح!");
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error details:", error);
      let errorMessage = "حدث خطأ أثناء إنشاء شركة التأجير";
      
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
      <h2>إنشاء شركة تأجير سيارات جديدة</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Admin data */}
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

        {/* Company data */}
        <input
          type="text"
          name="companyData.name"
          placeholder="اسم الشركة"
          value={formData.companyData.name}
          onChange={handleChange}
          required
        />
        <select
          name="companyData.type"
          value={formData.companyData.type}
          onChange={handleChange}
          required
        >
          <option value="luxury">فاخرة</option>
          <option value="budget">اقتصادية</option>
          <option value="commercial">تجارية</option>
        </select>
        <input
          type="text"
          name="companyData.address"
          placeholder="العنوان"
          value={formData.companyData.address}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="companyData.phoneNumber"
          placeholder="رقم الهاتف"
          value={formData.companyData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="companyData.website"
          placeholder="الموقع الإلكتروني"
          value={formData.companyData.website}
          onChange={handleChange}
        />
        <input
          type="email"
          name="companyData.email"
          placeholder="البريد الإلكتروني للشركة"
          value={formData.companyData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="companyData.description"
          placeholder="وصف الشركة"
          value={formData.companyData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="facilities"
          placeholder="المرافق (مفصولة بفاصلة)"
          onChange={handleFacilitiesChange}
        />

        {/* Required documents */}
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
          <label>شعار الشركة</label>
          <input
            type="file"
            name="companyLogo"
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
          <label>الرخصة</label>
          <input
            type="file"
            name="license"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label>صور إضافية (يمكن اختيار أكثر من صورة)</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
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

export default CreateCarRentalForm;