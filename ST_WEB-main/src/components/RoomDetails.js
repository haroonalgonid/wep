import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/room.css";

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    pricePerNight: 0,
    bedCount: 0,
  });

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setError('');
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`https://backend-fpnx.onrender.com/hotels/room/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('الغرفة غير موجودة');
          }
          throw new Error('فشل في جلب تفاصيل الغرفة');
        }
        
        const data = await response.json();
        setRoom(data.room);
        setFormData({
          pricePerNight: data.room.pricePerNight,
          bedCount: data.room.bedCount,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذه الغرفة؟')) return;
    
    try {
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-fpnx.onrender.com/hotels/rooms/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('الغرفة غير موجودة');
        }
        throw new Error('فشل في حذف الغرفة');
      }
      
      navigate('/dashboardHotel');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      setError('');
      
      if (formData.pricePerNight <= 0) {
        throw new Error('السعر يجب أن يكون أكبر من الصفر');
      }
      if (formData.bedCount <= 0) {
        throw new Error('عدد الأسرة يجب أن يكون أكبر من الصفر');
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-fpnx.onrender.com/hotels/rooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          pricePerNight: formData.pricePerNight,
          bedCount: formData.bedCount
        })
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('الغرفة غير موجودة');
        }
        throw new Error('فشل في تحديث الغرفة');
      }
      
      const data = await response.json();
      setRoom(data.room);
      setEditMode(false);
      window.location.reload(); // إعادة تحميل الصفحة لتحديث البيانات
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAvailabilityChange = async () => {
    try {
      setError('');
      
      if (!room) {
        throw new Error('الغرفة غير موجودة');
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-fpnx.onrender.com/hotels/rooms/${id}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          isAvailable: !room.isAvailable
        })
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('الغرفة غير موجودة');
        }
        throw new Error('فشل في تغيير حالة الغرفة');
      }
      
      const data = await response.json();
      setRoom(data.room);
      window.location.reload(); // إعادة تحميل الصفحة لتحديث البيانات
    } catch (err) {
      setError(err.message);
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
  if (!room) return <div>الغرفة غير موجودة</div>;

  return (
    <div className="room-details">
      <div className="room-content">
        <h1>غرفة {room.type}</h1>
        
        {error && <div className="error">{error}</div>}
        
        {editMode ? (
          <div className="edit-form">
            <div className="form-group">
              <label>السعر لليلة:</label>
              <input 
                type="number" 
                name="pricePerNight" 
                value={formData.pricePerNight} 
                onChange={handleInputChange} 
                min="1"
              />
            </div>
            <div className="form-group">
              <label>عدد الأسرة:</label>
              <input 
                type="number" 
                name="bedCount" 
                value={formData.bedCount} 
                onChange={handleInputChange} 
                min="1"
              />
            </div>
            <button onClick={handleUpdate}>حفظ التعديلات</button>
          </div>
        ) : (
          <>
            <div className="room-images">
              {room.images?.map((img, index) => (
                <img key={index} src={img} alt={`صورة الغرفة ${index}`} />
              ))}
            </div>
            <div className="room-info">
              <p>السعر لليلة: ${room.pricePerNight}</p>
              <p>عدد الأسرة: {room.bedCount}</p>
              <p>المساحة: {room.size} متر مربع</p>
              <p>الإطلالة: {room.view}</p>
              <p>المرافق: {room.amenities?.join('، ')}</p>
              <p>الحالة: {room.isAvailable ? 'متاحة' : 'محجوزة'}</p>
            </div>
          </>
        )}
      </div>
      <div className="room-actions">
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? 'إلغاء التعديل' : 'تعديل الغرفة'}
        </button>
        <button onClick={handleAvailabilityChange}>
          {room.isAvailable ? 'حجز الغرفة' : 'تحرير الغرفة'}
        </button>
        <button onClick={handleDelete} className="delete-schedule-btn">
          حذف الغرفة
        </button>
      </div>
    </div>
  );
}

export default RoomDetails;