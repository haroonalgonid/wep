import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>مرحبا بكم في موقعنا</h1>
      <Link to="/login" className="login-link">تسجيل الدخول</Link>
      <Link to="/booking" className="booking-link">اختيار شركة الطيران</Link>
    </div>
  );
}

export default Home;