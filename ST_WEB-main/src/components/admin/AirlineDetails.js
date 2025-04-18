import React from "react";
import { toggleApproval, deleteAirline } from "./AirlineManagement";

const AirlineDetails = ({ airline, onClose, onToggleApproval, onDelete }) => {
  if (!airline) return null;

  const token = localStorage.getItem("token");

  const handleToggleApproval = () => {
    toggleApproval(airline._id, !airline.isApproved, token)
      .then(() => {
        onToggleApproval(airline._id, !airline.isApproved);
      })
      .catch((error) => {
        console.error("Error toggling approval:", error);
        alert("حدث خطأ أثناء تغيير حالة الموافقة");
      });
  };

  const handleDelete = () => {
    const confirmation = window.confirm(
      "هل أنت متأكد من حذف شركة الطيران؟ سيتم حذف جميع البيانات المرتبطة بها بما في ذلك:\n" +
      "- جميع الرحلات الجوية التابعة لها\n" +
      "- جميع الحجوزات المرتبطة بهذه الرحلات" 
    );

    if (confirmation) {
      deleteAirline(airline._id, token)
        .then(() => {
          onDelete(airline._id);
          alert("تم حذف شركة الطيران بنجاح");
          onClose(); // إغلاق النافذة بعد الحذف
        })
        .catch((error) => {
          console.error("Error deleting airline:", error);
          alert("حدث خطأ أثناء حذف شركة الطيران");
        });
    }
  };

  return (
    <div className="restaurant-details-modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>تفاصيل شركة الطيران</h2>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">اسم الشركة:</span>
            <span className="detail-value">{airline.companyName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">الرمز الدولي:</span>
            <span className="detail-value">{airline.IATACode}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">الوصف:</span>
            <span className="detail-value">{airline.description}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">البريد الإلكتروني:</span>
            <span className="detail-value">{airline.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">رقم الهاتف:</span>
            <span className="detail-value">{airline.phoneNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">الموقع الإلكتروني:</span>
            <span className="detail-value">
              <a href={airline.website} target="_blank" rel="noopener noreferrer">
                {airline.website}
              </a>
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">العنوان الرئيسي:</span>
            <span className="detail-value">{airline.headquartersAddress}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">الدول التي تعمل بها:</span>
            <span className="detail-value">{airline.countriesOperated}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">المدن التي تعمل بها:</span>
            <span className="detail-value">{airline.citiesOperated}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">رقم التسجيل:</span>
            <span className="detail-value">{airline.companyRegistrationNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">صورة الرخصة:</span>
            <img
              src={`${airline.operatingLicenseImage}`}
              alt="رخصة التشغيل"
              className="detail-image"
            />
          </div>
          <div className="detail-item">
            <span className="detail-label">المستندات القانونية:</span>
            <img
              src={`${airline.legalDocumentsImage}`}
              alt="المستندات القانونية"
              className="detail-image"
            />
          </div>
          <div className="detail-item">
            <span className="detail-label">حالة الموافقة:</span>
            <span className="detail-value">
              {airline.isApproved ? "مفعلة" : "معطلة"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">المشرف:</span>
            <span className="detail-value">{airline.moderatorId.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">بريد المشرف:</span>
            <span className="detail-value">{airline.moderatorId.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">صورة هوية المشرف:</span>
            <img
              src={`${airline.moderatorId.identityImage}`}
              alt="هوية المشرف"
              className="detail-image"
            />
          </div>
          <div className="detail-item">
            <span className="detail-label">تاريخ الإنشاء:</span>
            <span className="detail-value">
              {new Date(airline.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="control-buttons">
          <button
            className={`toggle-btn ${airline.isApproved ? "disable" : "enable"}`}
            onClick={handleToggleApproval}
          >
            {airline.isApproved ? "تعطيل" : "تمكين"}
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

export default AirlineDetails;