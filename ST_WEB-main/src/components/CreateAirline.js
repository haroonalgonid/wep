import React, { useState } from "react";
import { createAirline } from "./admin/AirlineManagement"; 

const CreateAirlineForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    airlineData: {
      companyName: "",
      IATACode: "",
      description: "",
      email: "",
      phoneNumber: "",
      website: "",
      headquartersAddress: "",
      countriesOperated: "",
      citiesOperated: "",
      companyRegistrationNumber: "",
    },
    identityImage: null,
    companyLogo: null,
    operatingLicenseImage: null,
    legalDocumentsImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("airlineData.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        airlineData: {
          ...formData.airlineData,
          [field]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
  
    // التحقق من وجود جميع الحقول المطلوبة
    if (!formData.identityImage || !formData.companyLogo || 
        !formData.operatingLicenseImage || !formData.legalDocumentsImage) {
      setError("يرجى تحميل جميع الملفات المطلوبة");
      setLoading(false);
      return;
    }
  
    const fullData = new FormData();
    
    // إضافة البيانات الأساسية
    fullData.append("name", formData.name);
    fullData.append("email", formData.email);
    fullData.append("password", formData.password);
    
    // إضافة airlineData كـ JSON
    fullData.append("airlineData", JSON.stringify(formData.airlineData));
    
    // إضافة الملفات
    fullData.append("identityImage", formData.identityImage);
    fullData.append("companyLogo", formData.companyLogo);
    fullData.append("operatingLicenseImage", formData.operatingLicenseImage);
    fullData.append("legalDocumentsImage", formData.legalDocumentsImage);
  
    try {
      const response = await createAirline(fullData);
      
      if (!response) {
        throw new Error("لا يوجد رد من الخادم");
      }
  
      console.log("Response from server:", response.data);
      
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("تم إنشاء شركة الطيران بنجاح!");
        if (onSuccess) onSuccess(); // إغلاق النموذج وإعادة جلب البيانات
        
        // إعادة تعيين النموذج بعد النجاح
        setFormData({
          name: "",
          email: "",
          password: "",
          airlineData: {
            companyName: "",
            IATACode: "",
            description: "",
            email: "",
            phoneNumber: "",
            website: "",
            headquartersAddress: "",
            countriesOperated: "",
            citiesOperated: "",
            companyRegistrationNumber: "",
          },
          identityImage: null,
          companyLogo: null,
          operatingLicenseImage: null,
          legalDocumentsImage: null,
        });
      } else {
        throw new Error(response.data?.message || "حدث خطأ غير متوقع");
      }
    } catch (error) {
      console.error("Error creating airline:", error);
      setError(error.message || "حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="create-airline-form">
      <h2>إنشاء شركة طيران جديدة</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
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
          name="airlineData.companyName"
          placeholder="اسم الشركة"
          value={formData.airlineData.companyName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="airlineData.IATACode"
          placeholder="رمز IATA"
          value={formData.airlineData.IATACode}
          onChange={handleChange}
          required
        />
        <textarea
          name="airlineData.description"
          placeholder="الوصف"
          value={formData.airlineData.description}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="email"
          name="airlineData.email"
          placeholder="البريد الإلكتروني للشركة"
          value={formData.airlineData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="airlineData.phoneNumber"
          placeholder="رقم الهاتف"
          value={formData.airlineData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="airlineData.website"
          placeholder="الموقع الإلكتروني"
          value={formData.airlineData.website}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="airlineData.headquartersAddress"
          placeholder="عنوان المقر"
          value={formData.airlineData.headquartersAddress}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="airlineData.countriesOperated"
          placeholder="الدول"
          value={formData.airlineData.countriesOperated}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="airlineData.citiesOperated"
          placeholder="المدن"
          value={formData.airlineData.citiesOperated}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="airlineData.companyRegistrationNumber"
          placeholder="رقم التسجيل"
          value={formData.airlineData.companyRegistrationNumber}
          onChange={handleChange}
          required
        />
        <div>
          <label>صورة الهوية</label>
          <input
            type="file"
            name="identityImage"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label>شعار الشركة</label>
          <input
            type="file"
            name="companyLogo"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label>رخصة التشغيل</label>
          <input
            type="file"
            name="operatingLicenseImage"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label>المستندات القانونية</label>
          <input
            type="file"
            name="legalDocumentsImage"
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

export default CreateAirlineForm;