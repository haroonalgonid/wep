import { useState, useEffect } from "react";
import AddFlightForm from "./AddFlightForm"; // تأكد من أنك استوردت المكون بشكل صحيح
import "../styles/Dashbordflight.css";

function ManageFlights() {
  const [flights, setFlights] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // جلب الرحلات من قاعدة البيانات (محاكاة البيانات هنا)
  useEffect(() => {
    const fetchFlights = async () => {
      // هنا يمكنك جلب البيانات من API أو قاعدة بيانات
      const response = await fetch("/api/flights"); // محاكاة جلب البيانات
      const data = await response.json();
      setFlights(data);
    };

    fetchFlights();
  }, []);

  // دالة لإغلاق النافذة المنبثقة بعد إرسال النموذج
  const handleFormSubmit = (newFlight) => {
    setFlights((prevFlights) => [...prevFlights, newFlight]);
    setShowModal(false); // إغلاق النافذة المنبثقة
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100" dir="rtl">
      {/* شريط العلوي */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">إدارة الرحلات</h1>
      </header>

      {/* محتوى الشاشة */}
      <div className="flex flex-1 flex-col items-center p-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 text-lg font-bold rounded-lg shadow-md hover:bg-blue-700 mb-4"
        >
          + إضافة رحلة جديدة
        </button>

        {/* عرض الرحلات */}
        <div className="w-full max-w-4xl">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">رقم الرحلة</th>
                <th className="px-4 py-2">المغادرة</th>
                <th className="px-4 py-2">الوصول</th>
                <th className="px-4 py-2">التاريخ</th>
                <th className="px-4 py-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td className="px-4 py-2">{flight.flightNumber}</td>
                  <td className="px-4 py-2">{flight.departure}</td>
                  <td className="px-4 py-2">{flight.arrival}</td>
                  <td className="px-4 py-2">{flight.date}</td>
                  <td className="px-4 py-2">
                    <button className="text-blue-600 hover:text-blue-800">تعديل</button>
                    <button className="ml-4 text-red-600 hover:text-red-800">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة منبثقة لإضافة رحلة جديدة */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl overflow-y-auto max-h-screen">
            <h2 className="text-xl font-semibold mb-4">إضافة رحلة جديدة</h2>
            <AddFlightForm onFormSubmit={handleFormSubmit} />
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageFlights;
