import React from "react";
import { toggleRestaurantApproval, deleteRestaurant } from "./admin/RestaurantMangement";

const RestaurantDetails = ({ restaurant, onClose, onToggleApproval, onDelete }) => {
    if (!restaurant) return null;

    const token = localStorage.getItem("token");

    const handleToggleApproval = () => {
        toggleRestaurantApproval(restaurant._id, !restaurant.isApproved, token)
            .then(() => {
                onToggleApproval(restaurant._id, !restaurant.isApproved);
                alert(`تم ${restaurant.isApproved ? "تعطيل" : "تمكين"} المطعم بنجاح`);
            })
            .catch((error) => {
                console.error("Error toggling approval:", error);
                alert("حدث خطأ أثناء تغيير حالة الموافقة");
            });
    };

    const handleDelete = () => {
        const confirmDelete = window.confirm(
            "⚠️ تنبيه هام: سيتم حذف جميع البيانات المرتبطة بهذا المطعم بما في ذلك:\n\n" +
            "- جميع القوائم والأصناف الغذائية\n" +
            "- جميع الطلبات والحجوزات\n" +
            "- جميع التقييمات والمراجعات\n\n" +
            "هل أنت متأكد من رغبتك في الاستمرار؟"
        );

        if (confirmDelete) {
            deleteRestaurant(restaurant._id, token)
                .then(() => {
                    onDelete(restaurant._id);
                    alert("تم حذف المطعم بنجاح");
                    onClose(); // إغلاق النافذة بعد الحذف
                })
                .catch((error) => {
                    console.error("Error deleting restaurant:", error);
                    alert("حدث خطأ أثناء حذف المطعم");
                });
        }
    };

    return (
        <div className="restaurant-details-modal">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>✖</button>
                <h2>تفاصيل المطعم</h2>
                <div className="details-grid">
                    <div className="detail-item">
                        <span className="detail-label">اسم المطعم:</span>
                        <span className="detail-value">{restaurant.name}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">النوع:</span>
                        <span className="detail-value">
                            {restaurant.type === "fine_dining" ? "مطعم فاخر" : 
                             restaurant.type === "casual_dining" ? "مطعم عادي" : 
                             restaurant.type === "fast_food" ? "وجبات سريعة" : 
                             restaurant.type === "cafe" ? "مقهى" : restaurant.type}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">العنوان:</span>
                        <span className="detail-value">{restaurant.address}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">الشعار:</span>
                        <img
                            src={`${restaurant.logo}`}
                            alt="شعار المطعم"
                            className="detail-image"
                        />
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">رقم الهاتف:</span>
                        <span className="detail-value">{restaurant.phoneNumber}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">البريد الإلكتروني:</span>
                        <span className="detail-value">{restaurant.email}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">المرافق:</span>
                        <span className="detail-value">
                            {restaurant.facilities && restaurant.facilities.length > 0 
                                ? restaurant.facilities.join("، ") 
                                : "لا توجد مرافق مسجلة"}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">السجل التجاري:</span>
                        <img
                            src={`${restaurant.commercialRecord}`}
                            alt="السجل التجاري"
                            className="detail-image"
                        />
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">الرخصة:</span>
                        <img
                            src={`${restaurant.license}`}
                            alt="رخصة المطعم"
                            className="detail-image"
                        />
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">حالة الموافقة:</span>
                        <span className="detail-value">
                            {restaurant.isApproved ? "مفعلة" : "معطلة"}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">تاريخ الإنشاء:</span>
                        <span className="detail-value">
                            {new Date(restaurant.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">متوسط التقييم:</span>
                        <span className="detail-value">
                            {restaurant.averageRating || "لا توجد تقييمات بعد"}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">عدد التقييمات:</span>
                        <span className="detail-value">
                            {restaurant.totalReviews || "0"}
                        </span>
                    </div>
                </div>

                {/* أزرار التحكم */}
                <div className="control-buttons">
                    <button
                        className={`toggle-btn ${restaurant.isApproved ? "disable" : "enable"}`}
                        onClick={handleToggleApproval}
                    >
                        {restaurant.isApproved ? "تعطيل" : "تمكين"}
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

export default RestaurantDetails;