import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/FlightDetails2.css";

function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    doctor: id,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    slotDuration: 30,
  });
  const [editData, setEditData] = useState({
    name: "",
    specialty: "",
    experienceYears: "",
    bio: "",
    phone: "",
    email: ""
  });
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
        }

        const doctorResponse = await fetch(`https://backend-fpnx.onrender.com/hospitals/doctors/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!doctorResponse.ok) {
          throw new Error("فشل في جلب بيانات الطبيب");
        }

        const doctorData = await doctorResponse.json();
        setDoctor(doctorData.doctor);
        setEditData({
          name: doctorData.doctor.name,
          specialty: doctorData.doctor.specialty,
          experienceYears: doctorData.doctor.experienceYears,
          bio: doctorData.doctor.bio,
          phone: doctorData.doctor.phone,
          email: doctorData.doctor.email
        });

        const schedulesResponse = await fetch(`https://backend-fpnx.onrender.com/hospitals/schedules/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (schedulesResponse.ok) {
          const schedulesData = await schedulesResponse.json();
          setSchedules(schedulesData.schedules || []);
        }
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  const convertTo24Hour = (time12h) => {
    if (!time12h) return "";
    
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    
    if (hours === "12") {
      hours = "00";
    }
    
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours}:${minutes}`;
  };

  const convertTo12Hour = (time24h) => {
    if (!time24h) return "";
    
    let [hours, minutes] = time24h.split(":");
    let modifier = "AM";
    
    if (hours >= 12) {
      modifier = "PM";
    }
    
    if (hours > 12) {
      hours = hours - 12;
    } else if (hours === "00") {
      hours = 12;
    }
    
    return `${hours}:${minutes} ${modifier}`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleScheduleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "startTime" || name === "endTime") {
      const time24 = convertTo24Hour(value);
      setScheduleData({
        ...scheduleData,
        [name]: time24,
      });
    } else {
      setScheduleData({
        ...scheduleData,
        [name]: value,
      });
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleAddSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
      }

      const response = await fetch("https://backend-fpnx.onrender.com/hospitals/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        throw new Error("فشل في إضافة جدول الدوام");
      }

      const data = await response.json();
      alert("تم إضافة جدول الدوام بنجاح!");
      setShowScheduleForm(false);

      const schedulesResponse = await fetch(`https://backend-fpnx.onrender.com/hospitals/schedules/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (schedulesResponse.ok) {
        const schedulesData = await schedulesResponse.json();
        setSchedules(schedulesData.schedules || []);
      }
    } catch (error) {
      console.error("حدث خطأ أثناء إضافة جدول الدوام:", error);
      alert(error.message);
    }
  };

  const handleUpdateDoctor = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
      }

      const response = await fetch(`https://backend-fpnx.onrender.com/hospitals/doctors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("فشل في تحديث بيانات الطبيب");
      }

      const data = await response.json();
      alert("تم تحديث بيانات الطبيب بنجاح!");
      setDoctor(data.doctor);
      setShowEditForm(false);
    } catch (error) {
      console.error("حدث خطأ أثناء تحديث بيانات الطبيب:", error);
      alert(error.message);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الطبيب؟")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
      }

      const response = await fetch(`https://backend-fpnx.onrender.com/hospitals/doctors/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("فشل في حذف الطبيب");
      }

      alert("تم حذف الطبيب بنجاح!");
      navigate("/dashboardHospital");
    } catch (error) {
      console.error("حدث خطأ أثناء حذف الطبيب:", error);
      alert(error.message);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الجدول؟")) {
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
      }
  
      // جلب المواعيد المرتبطة
      const appointmentsResponse = await fetch(`https://backend-fpnx.onrender.com/hospitals/appointments?schedule=${scheduleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      let hasInvalidAppointments = false;
  
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        
        if (appointmentsData.appointments?.length > 0) {
          if (!window.confirm(`هناك ${appointmentsData.appointments.length} موعد مرتبط. هل تريد الاستمرار في الحذف؟`)) {
            return;
          }
  
          // حذف المواعيد مع التعامل مع الأخطاء
          const results = await Promise.allSettled(
            appointmentsData.appointments.map(appointment =>
              fetch(`https://backend-fpnx.onrender.com/hospitals/appointments/${appointment._id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
            )
          );
  
          // التحقق من وجود أخطاء
          hasInvalidAppointments = results.some(result => 
            result.status === 'rejected' || 
            (result.value && !result.value.ok)
          );
        }
      }
  
      // حذف الجدول الرئيسي
      const deleteResponse = await fetch(`https://backend-fpnx.onrender.com/hospitals/schedules/${scheduleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!deleteResponse.ok) {
        throw new Error("تم حذف الجدوال");
      }
  
      // تحديث الواجهة في جميع الأحوال
      setSchedules(prev => prev.filter(s => s._id !== scheduleId));
      
      // إعادة تحميل البيانات إذا كان هناك مواعيد تالفة
      if (hasInvalidAppointments) {
        alert("تم حذف الجدول ولكن واجهنا مشكلة في بعض المواعيد. سيتم تحديث البيانات...");
        window.location.reload(); // إعادة تحميل الصفحة
      } else {
        alert("تم الحذف بنجاح!");
      }
  
    } catch (error) {
      console.error("حدث خطأ:", error);
      alert(error.message);
      window.location.reload(); // إعادة تحميل الصفحة في حالة الخطأ
    }
  };

  if (loading) {
    return <div>جاري تحميل البيانات...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!doctor) {
    return <div>لا توجد بيانات للطبيب</div>;
  }

  return (
    <div className="flight-details" dir="rtl">
      <h2>تفاصيل الطبيب</h2>
      {!showEditForm ? (
        <div className="details-view">
          <p><strong>الاسم:</strong> {doctor.name}</p>
          <p><strong>التخصص:</strong> {doctor.specialty}</p>
          <p><strong>سنوات الخبرة:</strong> {doctor.experienceYears}</p>
          <p><strong>السيرة الذاتية:</strong> {doctor.bio}</p>
        </div>
      ) : (
        <div className="edit-form">
          <h3>تعديل بيانات الطبيب</h3>
          <div className="form-group">
            <label>الاسم:</label>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleEditInputChange}
            />
          </div>
          <div className="form-group">
            <label>التخصص:</label>
            <input
              type="text"
              name="specialty"
              value={editData.specialty}
              onChange={handleEditInputChange}
            />
          </div>
          <div className="form-group">
            <label>سنوات الخبرة:</label>
            <input
              type="number"
              name="experienceYears"
              value={editData.experienceYears}
              onChange={handleEditInputChange}
            />
          </div>
          <div className="form-group">
            <label>السيرة الذاتية:</label>
            <textarea
              name="bio"
              value={editData.bio}
              onChange={handleEditInputChange}
            />
          </div>
          <button onClick={handleUpdateDoctor} className="add-schedule-btn">
            حفظ التعديلات
          </button>
          <button onClick={() => setShowEditForm(false)} className="delete-schedule-btn">
            إلغاء
          </button>
        </div>
      )}

      <div className="actions">
        <button onClick={handleBack} className="back-btn">
          العودة
        </button>
        <button onClick={() => setShowEditForm(!showEditForm)} className="add-schedule-btn">
          {showEditForm ? "إلغاء التعديل" : "تعديل البيانات"}
        </button>
        <button onClick={handleDeleteDoctor} className="delete-schedule-btn">
          حذف الطبيب
        </button>
        <button onClick={() => setShowScheduleForm(!showScheduleForm)} className="add-schedule-btn">
          {showScheduleForm ? "إخفاء النموذج" : "إضافة جدول دوام"}
        </button>
      </div>

      {showScheduleForm && (
        <div className="schedule-form">
          <h3>إضافة جدول دوام جديد</h3>
          <div className="form-group">
            <label>تاريخ البدء:</label>
            <input
              type="date"
              name="startDate"
              value={scheduleData.startDate}
              onChange={handleScheduleInputChange}
            />
          </div>
          <div className="form-group">
            <label>تاريخ الانتهاء:</label>
            <input
              type="date"
              name="endDate"
              value={scheduleData.endDate}
              onChange={handleScheduleInputChange}
            />
          </div>
          <div className="form-group">
            <label>وقت البدء:</label>
            <input
              type="text"
              name="startTime"
              placeholder="HH:MM AM/PM (مثال: 09:00 AM أو 2:30 PM)"
              value={convertTo12Hour(scheduleData.startTime)}
              onChange={handleScheduleInputChange}
            />
          </div>
          <div className="form-group">
            <label>وقت الانتهاء:</label>
            <input
              type="text"
              name="endTime"
              placeholder="HH:MM AM/PM (مثال: 05:00 PM أو 11:30 AM)"
              value={convertTo12Hour(scheduleData.endTime)}
              onChange={handleScheduleInputChange}
            />
          </div>
          <div className="form-group">
            <label>مدة الفترة الزمنية (بالدقائق):</label>
            <input
              type="number"
              name="slotDuration"
              value={scheduleData.slotDuration}
              onChange={handleScheduleInputChange}
            />
          </div>
          <button onClick={handleAddSchedule} className="save-btn">
            حفظ الجدول
          </button>
        </div>
      )}

      <div className="schedules-list">
        <h3>جداول دوام الطبيب</h3>
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <div key={schedule._id} className="schedule-item">
              <p><strong>تاريخ البدء:</strong> {new Date(schedule.startDate).toLocaleDateString()}</p>
              <p><strong>تاريخ الانتهاء:</strong> {new Date(schedule.endDate).toLocaleDateString()}</p>
              <p><strong>وقت البدء:</strong> {convertTo12Hour(schedule.startTime)}</p>
              <p><strong>وقت الانتهاء:</strong> {convertTo12Hour(schedule.endTime)}</p>
              <p><strong>مدة الفترة الزمنية:</strong> {schedule.slotDuration} دقيقة</p>
              <button 
                onClick={() => handleDeleteSchedule(schedule._id)} 
                className="delete-schedule-btn"
              >
                حذف الجدول
              </button>
            </div>
          ))
        ) : (
          <p>لا توجد جداول دوام متاحة.</p>
        )}
      </div>
    </div>
  );
}

export default DoctorDetails;