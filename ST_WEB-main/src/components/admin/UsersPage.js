import React from "react";
import { User } from "lucide-react";

const UsersPage = () => {
  return (
    <div className="dashboard-section">
      <h2 className="section-title">إدارة المستخدمين</h2>
      <div className="empty-state">
        <div className="empty-icon"><User size={80} /></div>
        <h3>لا يوجد مستخدمون</h3>
      </div>
    </div>
  );
};

export default UsersPage;