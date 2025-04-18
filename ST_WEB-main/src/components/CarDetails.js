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
    make: '',
    model: '',
    year: 0,
    type: '',
    pricePerDay: 0,
    seats: 0,
    transmission: '',
    fuelType: '',
    mileage: 0,
    features: [],
    plateNumber: '',
    isAvailable: true
  });

  useEffect(() => {
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
          make: data.car.make,
          model: data.car.model,
          year: data.car.year,
          type: data.car.type,
          pricePerDay: data.car.pricePerDay,
          seats: data.car.seats,
          transmission: data.car.transmission,
          fuelType: data.car.fuelType,
          mileage: data.car.mileage,
          features: data.car.features,
          plateNumber: data.car.plateNumber,
          isAvailable: data.car.isAvailable
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-fpnx.onrender.com/carrental/cars/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('فشل في حذف السيارة');
      
      navigate('/cars'); // توجيه المستخدم إلى صفحة السيارات بعد الحذف
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-fpnx.onrender.com/carrental/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('فشل في تحديث السيارة');
      
      const data = await response.json();
      setCar(data.car);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAvailabilityChange = async () => {
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
      
      const data = await response.json();
      setCar(data.car);
      setFormData(prev => ({...prev, isAvailable: data.car.isAvailable}));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'features' ? value.split(',') : value
    }));
  };

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;
  if (!car) return <div>السيارة غير موجودة</div>;

  return (
    <div className="room-details">
      <div className="room-content">
        <h1>{car.make} {car.model} ({car.year})</h1>
        
        {editMode ? (
          <div className="edit-form">
            <div className="form-group">
              <label>الشركة المصنعة:</label>
              <input 
                type="text" 
                name="make" 
                value={formData.make} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>الموديل:</label>
              <input 
                type="text" 
                name="model" 
                value={formData.model} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>السنة:</label>
              <input 
                type="number" 
                name="year" 
                value={formData.year} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>النوع:</label>
              <input 
                type="text" 
                name="type" 
                value={formData.type} 
                onChange={handleInputChange} 
              />
            </div>
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
              <label>عدد المقاعد:</label>
              <input 
                type="number" 
                name="seats" 
                value={formData.seats} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>ناقل الحركة:</label>
              <input 
                type="text" 
                name="transmission" 
                value={formData.transmission} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>نوع الوقود:</label>
              <input 
                type="text" 
                name="fuelType" 
                value={formData.fuelType} 
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
              <label>المميزات (افصلها بفواصل):</label>
              <input 
                type="text" 
                name="features" 
                value={formData.features.join(',')} 
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
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? 'إلغاء التعديل' : 'تعديل السيارة'}
        </button>
        <button onClick={handleAvailabilityChange}>
          {car.isAvailable ? 'حجز السيارة' : 'تحرير السيارة'}
        </button>
        <button onClick={handleDelete} className="delete-schedule-btn">
          حذف السيارة
        </button>
      </div>
    </div>
  );
}

export default CarDetails;