import React from "react";
import { toggleHospitalApproval, deleteHospital } from "../admin/HospitalMnangement";

const HospitalDetails = ({ hospital, onClose, onToggleApproval, onDelete }) => {
  if (!hospital) return null;

  const token = localStorage.getItem("token");

  const handleToggleApproval = () => {
    toggleHospitalApproval(hospital._id, !hospital.isApproved, token)
      .then(() => {
        onToggleApproval(hospital._id, !hospital.isApproved);
      })
      .catch((error) => {
        console.error("Error toggling approval:", error);
      });
  };

  const handleDelete = () => {
    // إضافة رسالة تأكيد قبل الحذف
    const confirmDelete = window.confirm(
      "سيتم حذف المستشفى وجميع البيانات المرتبطة به (الأطباء، المواعيد، الخ). هل أنت متأكد من المتابعة؟"
    );
    
    if (confirmDelete) {
      deleteHospital(hospital._id, token)
        .then(() => {
          onDelete(hospital._id); // يُحدِّث الحالة في الـ Dashboard
          alert("✅ تم الحذف بنجاح");
          onClose(); // يُغلق النافذة
        })
        .catch((error) => {
          console.error("Error deleting hospital:", error);
          alert("حدث خطأ أثناء محاولة حذف المستشفى");
        });
    }
  };

  return (
    <div className="restaurant-details-modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>تفاصيل المستشفى</h2>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">اسم المستشفى:</span>
            <span className="detail-value">{hospital.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">النوع:</span>
            <span className="detail-value">
              {hospital.type === "general" ? "عام" : 
               hospital.type === "specialized" ? "متخصص" : 
               hospital.type}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">العنوان:</span>
            <span className="detail-value">{hospital.address}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">الشعار:</span>
            <img
              src={`${hospital.logo}`}
              alt="شعار المستشفى"
              className="detail-image"
            />
          </div>
          <div className="detail-item">
            <span className="detail-label">رقم الهاتف:</span>
            <span className="detail-value">{hospital.phoneNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">الموقع الإلكتروني:</span>
            <span className="detail-value">
              {hospital.website ? (
                <a href={hospital.website} target="_blank" rel="noopener noreferrer">
                  {hospital.website}
                </a>
              ) : "غير متوفر"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">البريد الإلكتروني:</span>
            <span className="detail-value">{hospital.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">المرافق:</span>
            <span className="detail-value">
              {hospital.facilities && hospital.facilities.length > 0 
                ? hospital.facilities.join("، ") 
                : "لا توجد مرافق مسجلة"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">السجل التجاري:</span>
            <img
              src={`${hospital.commercialRecord}`}
              alt="السجل التجاري"
              className="detail-image"
            />
          </div>
          <div className="detail-item">
            <span className="detail-label">الرخصة الطبية:</span>
            <img
              src={`${hospital.medicalLicense}`}
              alt="الرخصة الطبية"
              className="detail-image"
            />
          </div>
          <div className="detail-item">
            <span className="detail-label">حالة الموافقة:</span>
            <span className="detail-value">
              {hospital.isApproved ? "مفعلة" : "معطلة"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">تاريخ الإنشاء:</span>
            <span className="detail-value">
              {new Date(hospital.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">متوسط التقييم:</span>
            <span className="detail-value">
              {hospital.averageRating || "لا توجد تقييمات بعد"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">عدد التقييمات:</span>
            <span className="detail-value">
              {hospital.totalReviews || "0"}
            </span>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="control-buttons">
          <button
            className={`toggle-btn ${hospital.isApproved ? "disable" : "enable"}`}
            onClick={handleToggleApproval}
          >
            {hospital.isApproved ? "تعطيل" : "تمكين"}
          </button>
          <button
            className="delete-schedule-btn"
            onClick={handleDelete}
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetails;