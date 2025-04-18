// import { useState } from "react";

// function AddScheduleForm({ doctorId }) {
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [slotDuration, setSlotDuration] = useState(30);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("التوكين غير موجود. يرجى تسجيل الدخول مرة أخرى.");
//       }

//       const response = await fetch("https://backend-fpnx.onrender.com/hospitals/schedules", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           doctor: doctorId,
//           startDate,
//           endDate,
//           startTime,
//           endTime,
//           slotDuration,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("فشل في إضافة جدول الدوام");
//       }

//       const data = await response.json();
//       console.log("تمت إضافة جدول الدوام بنجاح:", data);
//     } catch (error) {
//       console.error("حدث خطأ أثناء إضافة جدول الدوام:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="form-group">
//         <label>تاريخ البدء</label>
//         <input
//           type="date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           required
//         />
//       </div>
//       <div className="form-group">
//         <label>تاريخ الانتهاء</label>
//         <input
//           type="date"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           required
//         />
//       </div>
//       <div className="form-group">
//         <label>وقت البدء</label>
//         <input
//           type="time"
//           value={startTime}
//           onChange={(e) => setStartTime(e.target.value)}
//           required
//         />
//       </div>
//       <div className="form-group">
//         <label>وقت الانتهاء</label>
//         <input
//           type="time"
//           value={endTime}
//           onChange={(e) => setEndTime(e.target.value)}
//           required
//         />
//       </div>
//       <div className="form-group">
//         <label>مدة الحجز (بالدقائق)</label>
//         <input
//           type="number"
//           value={slotDuration}
//           onChange={(e) => setSlotDuration(e.target.value)}
//           required
//         />
//       </div>
//       <button type="submit" disabled={loading}>
//         {loading ? "جاري الإضافة..." : "إضافة جدول الدوام"}
//       </button>
//       {error && <p className="error-message">{error}</p>}
//     </form>
//   );
// }

// export default AddScheduleForm;