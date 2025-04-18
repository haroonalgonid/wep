import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/room.css";

function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    pricePerDay: 0,
    mileage: 0,
    plateNumber: ''
  });

  const fetchCarDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-fpnx.onrender.com/carrental/car/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('فشل في جلب تفاصيل السيارة');
      
      const data = await response.json();
      setCar(data.car);
      setFormData({
        pricePerDay: data.car.pricePerDay,
        mileage: data.car.mileage,
        plateNumber: data.car.plateNumber
      });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-fpnx.onrender.com/carrental/cars/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('فشل في حذف السيارة');
      
      navigate('/dashboardCarRental');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-fpnx.onrender.com/carrental/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...car,
          pricePerDay: formData.pricePerDay,
          mileage: formData.mileage,
          plateNumber: formData.plateNumber
        })
      });
      
      if (!response.ok) throw new Error('فشل في تحديث السيارة');
      
      await fetchCarDetails();
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityChange = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-fpnx.onrender.com/carrental/cars/${id}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          isAvailable: !car.isAvailable
        })
      });
      
      if (!response.ok) throw new Error('فشل في تغيير حالة السيارة');
      
      await fetchCarDetails();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;
  if (!car && !loading) return <div>السيارة غير موجودة</div>;
  if (!car) return <div>جاري التحميل...</div>;
  
  return (
    <div className="room-details">
      <div className="room-content">
        <h1>{car.make} {car.model} ({car.year})</h1>
        
        {editMode ? (
          <div className="edit-form">
            <div className="form-group">
              <label>السعر لليوم:</label>
              <input 
                type="number" 
                name="pricePerDay" 
                value={formData.pricePerDay} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>المسافة المقطوعة:</label>
              <input 
                type="number" 
                name="mileage" 
                value={formData.mileage} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>رقم اللوحة:</label>
              <input 
                type="text" 
                name="plateNumber" 
                value={formData.plateNumber} 
                onChange={handleInputChange} 
              />
            </div>
            <button onClick={handleUpdate}>حفظ التعديلات</button>
            <button onClick={() => setEditMode(false)}>إلغاء</button>
          </div>
        ) : (
          <>
            <div className="room-images">
              {car.images.map((img, index) => (
                <img key={index} src={img} alt={`صورة السيارة ${index}`} />
              ))}
            </div>
            <div className="room-info">
              <p>الشركة: {car.rentalCompany.name}</p>
              <p>العنوان: {car.rentalCompany.address}</p>
              <p>السعر لليوم: ${car.pricePerDay}</p>
              <p>الموديل: {car.model}</p>
              <p>السنة: {car.year}</p>
              <p>النوع: {car.type}</p>
              <p>عدد المقاعد: {car.seats}</p>
              <p>ناقل الحركة: {car.transmission}</p>
              <p>نوع الوقود: {car.fuelType}</p>
              <p>المسافة المقطوعة: {car.mileage} كم</p>
              <p>المميزات: {car.features.join('، ')}</p>
              <p>رقم اللوحة: {car.plateNumber}</p>
              <p>الحالة: {car.isAvailable ? 'متاحة' : 'محجوزة'}</p>
            </div>
          </>
        )}
      </div>
      <div className="room-actions">
        {!editMode && (
          <>
            <button onClick={() => setEditMode(true)}>
              تعديل السيارة
            </button>
            <button onClick={handleAvailabilityChange}>
              {car.isAvailable ? 'حجز السيارة' : 'تحرير السيارة'}
            </button>
            <button onClick={handleDelete} className="delete-schedule-btn">
              حذف السيارة
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CarDetails;