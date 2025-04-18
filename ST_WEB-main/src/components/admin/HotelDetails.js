import React from "react";
import { toggleHotelApproval, deleteHotel } from "../admin/HotelManagement";

const HotelDetails = ({ hotel, onClose, onToggleApproval, onDelete }) => {
    if (!hotel) return null;

    const token = localStorage.getItem("token");

    const handleToggleApproval = () => {
        toggleHotelApproval(hotel._id, !hotel.isApproved, token)
            .then(() => {
                onToggleApproval(hotel._id, !hotel.isApproved);
            })
            .catch((error) => {
                console.error("Error toggling approval:", error);
            });
    };

    const handleDelete = () => {
        if (window.confirm("هل أنت متأكد أنك تريد حذف هذا الفندق؟ سيتم حذف جميع البيانات المرتبطة به بما في ذلك الغرف والحجوزات والتقييمات.")) {
            deleteHotel(hotel._id, token)
                .then(() => {
                    onDelete(hotel._id);
                    alert("تم حذف الفندق بنجاح");
                })
                .catch((error) => {
                    console.error("Error deleting hotel:", error);
                    alert("حدث خطأ أثناء حذف الفندق");
                });
        }
    };

    return (
        <div className="restaurant-details-modal">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>✖</button>
                <h2>تفاصيل الفندق</h2>
                <div className="details-grid">
                    <div className="detail-item">
                        <span className="detail-label">اسم الفندق:</span>
                        <span className="detail-value">{hotel.name}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">النوع:</span>
                        <span className="detail-value">
                            {hotel.type === "luxury" ? "فاخر" : 
                             hotel.type === "budget" ? "اقتصادي" : 
                             hotel.type === "boutique" ? "بوتيك" : hotel.type}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">العنوان:</span>
                        <span className="detail-value">{hotel.address}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">الشعار:</span>
                        <img
                            src={`${hotel.logo}`}
                            alt="شعار الفندق"
                            className="detail-image"
                        />
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">رقم الهاتف:</span>
                        <span className="detail-value">{hotel.phoneNumber}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">الموقع الإلكتروني:</span>
                        <span className="detail-value">
                            {hotel.website ? (
                                <a href={hotel.website} target="_blank" rel="noopener noreferrer">
                                    {hotel.website}
                                </a>
                            ) : "غير متوفر"}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">البريد الإلكتروني:</span>
                        <span className="detail-value">{hotel.email}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">المرافق:</span>
                        <span className="detail-value">
                            {hotel.facilities && hotel.facilities.length > 0 
                                ? hotel.facilities.join("، ") 
                                : "لا توجد مرافق مسجلة"}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">السجل التجاري:</span>
                        <img
                            src={`${hotel.commercialRecord}`}
                            alt="السجل التجاري"
                            className="detail-image"
                        />
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">الرخصة:</span>
                        <img
                            src={`${hotel.license}`}
                            alt="رخصة الفندق"
                            className="detail-image"
                        />
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">حالة الموافقة:</span>
                        <span className="detail-value">
                            {hotel.isApproved ? "مفعلة" : "معطلة"}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">تاريخ الإنشاء:</span>
                        <span className="detail-value">
                            {new Date(hotel.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">متوسط التقييم:</span>
                        <span className="detail-value">
                            {hotel.averageRating || "لا توجد تقييمات بعد"}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">عدد التقييمات:</span>
                        <span className="detail-value">
                            {hotel.totalReviews || "0"}
                        </span>
                    </div>
                </div>

                <div className="control-buttons">
                    <button
                        className={`toggle-btn ${hotel.isApproved ? "disable" : "enable"}`}
                        onClick={handleToggleApproval}
                    >
                        {hotel.isApproved ? "تعطيل" : "تمكين"}
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

export default HotelDetails;