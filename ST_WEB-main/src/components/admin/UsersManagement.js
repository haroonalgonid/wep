import { useState, useEffect } from "react";
import axios from "axios";
import { User, FileText, Plane, Hospital, Hotel, Utensils, Car } from "lucide-react";

function UsersManagement({ token }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [newUser, setNewUser] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        birthDate: "",
        gender: "male",
        address: "",
      });

    // دالة لجلب المستخدمين
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://backend-fpnx.onrender.com/auth?page=1&limit=10', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // دالة لحذف المستخدم
    const deleteUser = (userId) => {
        if (window.confirm("هل أنت متأكد من أنك تريد حذف هذا المستخدم؟")) {
            axios
                .delete(`https://backend-fpnx.onrender.com/auth/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    fetchUsers();
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                });
        }
    };

    // دالة لتعديل المستخدم
    const editUser = (user) => {
        setEditingUser(user);
        setShowEditModal(true);
    };

    // دالة لحفظ التعديلات
    const handleEditSubmit = (e) => {
        e.preventDefault();
        axios
            .put(`https://backend-fpnx.onrender.com/auth/${editingUser._id}`, editingUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                setShowEditModal(false);
                fetchUsers();
            })
            .catch((error) => {
                console.error("Error updating user:", error);
            });
    };

    // دالة لتحديث حالة التعديل
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingUser({
            ...editingUser,
            [name]: value,
        });
    };

    // دالة لإظهار/إخفاء نموذج التسجيل
    const toggleRegisterModal = () => {
        setShowRegisterModal(!showRegisterModal);
    };

    // دالة لتحديث حالة المستخدم الجديد
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value,
        });
    };

    // دالة لتسجيل مستخدم جديد
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            // تحويل الجنس إلى القيمة العربية المتوقعة من الخادم
            const genderArabic = newUser.gender === "male" ? "ذكر" : "أنثى";
    
            const response = await axios.post(
                "https://backend-fpnx.onrender.com/auth/register",
                {
                    fullName: newUser.fullName,
                    email: newUser.email,
                    password: newUser.password,
                    phone: newUser.phone,
                    birthDate: new Date(newUser.birthDate), // تحويل إلى كائن Date
                    gender: genderArabic, // استخدام القيمة العربية
                    address: newUser.address,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // إذا كان مطلوبًا
                    },
                }
            );
    
            if (response.status === 201) {
                alert("تم تسجيل المستخدم بنجاح!");
                setShowRegisterModal(false);
                setNewUser({
                    fullName: "",
                    email: "",
                    password: "",
                    phone: "",
                    birthDate: "",
                    gender: "male",
                    address: "",
                });
                fetchUsers();
            }
        } catch (error) {
            console.error("Error registering user:", error);
            const errorMsg = error.response?.data?.message || 
                            error.response?.data?.error || 
                            "حدث خطأ أثناء التسجيل";
            alert(`خطأ: ${errorMsg}`);
        }
    };
    


    // جلب البيانات عند تحميل المكون
    useEffect(() => {
        fetchUsers();
    }, [token]);

    return (
        <div className="w-full mt-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h2>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={toggleRegisterModal}>
                    إضافة مستخدم
                </button>

                
            </div>

            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>جاري تحميل البيانات...</p>
                </div>
            ) : users.length > 0 ? (
                <div className="flights-table-container">
                    <table className="flights-table">
                        <thead>
                            <tr>
                                <th>الاسم</th>
                                <th>البريد الإلكتروني</th>
                                <th></th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
  {[...users].reverse().map((user) => ( // انشئ نسخة من المصفوفة ثم اعكسها
    <tr key={user._id}>
      <td>{user.fullName}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <button className="edit-btn" onClick={() => editUser(user)}>
          تعديل
        </button>
        <button className="delete-btn" onClick={() => deleteUser(user._id)}>
          حذف
        </button>
      </td>
    </tr>
  ))}
</tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon"><User size={80} /></div>
                    <h3>لا يوجد مستخدمون</h3>
                </div>
            )}

            {/* نموذج التسجيل */}
            {showRegisterModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>إضافة مستخدم جديد</h2>
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="form-group">
                                <label>الاسم الكامل</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={newUser.fullName}
                                    onChange={handleRegisterChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleRegisterChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>كلمة المرور</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleRegisterChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>رقم الهاتف</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={newUser.phone}
                                    onChange={handleRegisterChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>تاريخ الميلاد</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={newUser.birthDate}
                                    onChange={handleRegisterChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>الجنس</label>
                                <select
    name="gender"
    value={newUser.gender}
    onChange={handleRegisterChange}
    required
>
    <option value="male">ذكر</option>
    <option value="female">أنثى</option>
</select>
                            </div>

                            <div className="form-group">
                                <label>العنوان</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={newUser.address}
                                    onChange={handleRegisterChange}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit">تسجيل</button>
                                <button type="button" onClick={toggleRegisterModal}>
                                    إلغاء
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

            {/* نموذج التعديل */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>تعديل المستخدم</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label>الاسم الكامل</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={editingUser.fullName}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editingUser.email}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>رقم الهاتف</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={editingUser.phone}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>تاريخ الميلاد</label>
                                <input
    type="date"
    name="birthDate"
    value={newUser.birthDate}
    onChange={handleRegisterChange}
    required
    pattern="\d{4}-\d{2}-\d{2}" // التأكد من التنسيق YYYY-MM-DD
/>
                            </div>

                            <div className="form-group">
                                <label>الجنس</label>
                                <select
                                    name="gender"
                                    value={editingUser.gender}
                                    onChange={handleEditChange}
                                >
                                    <option value="male">ذكر</option>
                                    <option value="female">أنثى</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>العنوان</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={editingUser.address}
                                    onChange={handleEditChange}
                                />
                            </div>

                            {/* <div className="form-group">
                                <label>الدور</label>
                                <select
                                    name="role"
                                    value={editingUser.role}
                                    onChange={handleEditChange}
                                >
                                    <option value="user">مستخدم</option>
                                    <option value="admin">مسؤول</option>
                                </select>
                            </div> */}

                            <div className="form-actions">
                                <button type="submit">حفظ التعديلات</button>
                                <button type="button" onClick={() => setShowEditModal(false)}>
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersManagement;