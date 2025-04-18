import React from "react";
import { toggleCarRentalApproval, deleteCarRental } from "../admin/CarRentalManagement";

const CarRentalDetails = ({ carRental, onClose, onToggleApproval, onDelete }) => {
  if (!carRental) return null;

  const token = localStorage.getItem("token");

  const handleToggleApproval = () => {
    toggleCarRentalApproval(carRental._id, !carRental.isApproved, token)
      .then(() => {
        onToggleApproval(carRental._id, !carRental.isApproved);
      })
      .catch((error) => {
        console.error("Error toggling approval:", error);
      });
  };

  const handleDelete = () => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف شركة التأجير هذه؟ سيتم حذف جميع البيانات المرتبطة بها بما في ذلك السيارات والحجوزات.")) {
      deleteCarRental(carRental._id, token)
        .then(() => {
          onDelete(carRental._id);
          alert("تم حذف شركة التأجير بنجاح");
          onClose();
        })
        .catch((error) => {
          console.error("Error deleting car rental company:", error);
          alert("حدث خطأ أثناء حذف شركة التأجير");
        });
    }
  };

  return (
    <div className="restaurant-details-modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>تفاصيل شركة تأجير السيارات</h2>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">اسم الشركة:</span>
            <span className="detail-value">{carRental.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">النوع:</span>
            <span className="detail-value">
              {carRental.type === "luxury" ? "فاخرة" : 
               carRental.type === "economy" ? "اقتصادية" : 
               carRental.type}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">العنوان:</span>
            <span className="detail-value">{carRental.address}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">الشعار:</span>
            <img
              src={`${carRental.logo}`}
              alt="شعار الشركة"
              className="detail-image"
            />
          </div>
          <div className="detail-item">
            <span className="detail-label">رقم الهاتف:</span>
            <span className="detail-value">{carRental.phoneNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">الموقع الإلكتروني:</span>
            <span className="detail-value">
              {carRental.website ? (
                <a href={carRental.website} target="_blank" rel="noopener noreferrer">
                  {carRental.website}
                </a>
              ) : "غير متوفر"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">البريد الإلكتروني:</span>
            <span className="detail-value">{carRental.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">الوصف:</span>
            <span className="detail-value">{carRental.description}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">المرافق:</span>
            <span className="detail-value">
              {carRental.facilities && carRental.facilities.length > 0 
                ? carRental.facilities.join("، ") 
                : "لا توجد مرافق مسجلة"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">السجل التجاري:</span>
            <img
              src={`${carRental.commercialRecord}`}
              alt="السجل التجاري"
              className="detail-image"
            />
          </div>
          <div className="detail-item">
            <span className="detail-label">الرخصة:</span>
            <img
              src={`${carRental.license}`}
              alt="الرخصة"
              className="detail-image"
            />
          </div>
          <div className="detail-item">
            <span className="detail-label">حالة الموافقة:</span>
            <span className="detail-value">
              {carRental.isApproved ? "مفعلة" : "معطلة"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">تاريخ الإنشاء:</span>
            <span className="detail-value">
              {new Date(carRental.createdAt).toLocaleDateString()}
            </span>
          </div>
          {carRental.averageRating && (
            <div className="detail-item">
              <span className="detail-label">متوسط التقييم:</span>
              <span className="detail-value">
                {carRental.averageRating || "لا توجد تقييمات بعد"}
              </span>
            </div>
          )}
          {carRental.totalReviews && (
            <div className="detail-item">
              <span className="detail-label">عدد التقييمات:</span>
              <span className="detail-value">
                {carRental.totalReviews || "0"}
              </span>
            </div>
          )}
        </div>

        <div className="control-buttons">
          <button
            className={`toggle-btn ${carRental.isApproved ? "disable" : "enable"}`}
            onClick={handleToggleApproval}
          >
            {carRental.isApproved ? "تعطيل" : "تمكين"}
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

export default CarRentalDetails;