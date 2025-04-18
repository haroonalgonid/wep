import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/room.css"; // يمكنك استخدام نفس الأنماط أو إنشاء ملف جديد

function MenuItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    ingredients: [],
    isAvailable: true
  });

  useEffect(() => {
    const fetchMenuItemDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://backend-fpnx.onrender.com/restaurants/menuItem/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('فشل في جلب تفاصيل العنصر');
        
        const data = await response.json();
        setMenuItem(data.menuItem);
        setFormData({
          name: data.menuItem.name,
          description: data.menuItem.description,
          price: data.menuItem.price,
          category: data.menuItem.category,
          ingredients: data.menuItem.ingredients,
          isAvailable: data.menuItem.isAvailable
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItemDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-fpnx.onrender.com/restaurants/menuItem/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('فشل في حذف العنصر');
      
      navigate('/dashboardRestaurant'); // توجيه المستخدم إلى صفحة القائمة بعد الحذف
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-fpnx.onrender.com/restaurants/menuItem/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('فشل في تحديث العنصر');
      
      const data = await response.json();
      setMenuItem(data.menuItem);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAvailabilityChange = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-fpnx.onrender.com/restaurants/menuItem/${id}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          isAvailable: !menuItem.isAvailable
        })
      });
      
      if (!response.ok) throw new Error('فشل في تغيير حالة العنصر');
      
      const data = await response.json();
      setMenuItem(data.menuItem);
      setFormData(prev => ({...prev, isAvailable: data.menuItem.isAvailable}));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ingredients' ? value.split(',') : value
    }));
  };

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;
  if (!menuItem) return <div>العنصر غير موجود</div>;

  return (
    <div className="room-details">
      <div className="room-content">
        <h1>{menuItem.name}</h1>
        
        {editMode ? (
          <div className="edit-form">
            <div className="form-group">
              <label>الاسم:</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>الوصف:</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>السعر:</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>الفئة:</label>
              <input 
                type="text" 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>المكونات (افصلها بفواصل):</label>
              <input 
                type="text" 
                name="ingredients" 
                // value={formData.ingredients.join(',')} 
                onChange={handleInputChange} 
              />
            </div>
            <button onClick={handleUpdate}>حفظ التعديلات</button>
          </div>
        ) : (
          <>
            <div className="room-images">
              {menuItem.images?.map((img, index) => (
                <img key={index} src={img} alt={`صورة العنصر ${index}`} />
              ))}
            </div>
            <div className="room-info">
              <p>الوصف: {menuItem.description}</p>
              <p>السعر: ${menuItem.price}</p>
              <p>الفئة: {menuItem.category}</p>
              {/* <p>المكونات: {menuItem.ingredients.join('، ')}</p> */}
              <p>الحالة: {menuItem.isAvailable ? 'متاح' : 'غير متاح'}</p>
            </div>
          </>
        )}
      </div>
      <div className="room-actions">
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? 'إلغاء التعديل' : 'تعديل العنصر'}
        </button>
        <button onClick={handleAvailabilityChange}>
          {menuItem.isAvailable ? 'إخفاء العنصر' : 'إظهار العنصر'}
        </button>
        <button onClick={handleDelete} className="delete-schedule-btn">
          حذف العنصر
        </button>
      </div>
    </div>
  );
}

export default MenuItemDetails;