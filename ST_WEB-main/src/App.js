import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from "./components/Signup"; 
import CreateAirline from './components/CreateAirline';
import CreateHotel from './components/CreateHotel';
import CreateRestaurantForm from "./components/CreateRestaurant"; // استدعاء المكون
import CreateCarRentalForm from "./components/CreateCarRentalForm"; // استدعاء المكون

import AddFlightForm from './components/AddFlightForm';
import AdminDashboard from './components/Dashbordflight';
import DashboardHospital from './components/DashboardHospital';
import DashboardHotel from "./components/DashboardHotel"; // استيراد لوحة تحكم الفندق
import DashboardRestaurant from "./components/DashboardRestaurant"; // استيراد لوحة تحكم الفندق
import DashboardCarRental from "./components/DashboardCarRental"; // استيراد لوحة تحكم الفندق

import FlightDetails from "./components/FlightDetails";
import BookingDetails from "./components/BookingDetails";
import Dashboard from "./components/admin/Dashboard";
// import UsersPage from "./components/admin/UsersPage";
import UserManagement from "./components/admin/UsersManagement";
import CreateHospitalForm from "./components/CreateHospital"; // تأكد من المسار الصحيح
import DoctorDetails from "./components/DoctorDetails";
import BookingsDetails from "./components/BookingDoctorDetails";
import BookingRoomDetails from "./components/BookingRoomDetails";
import RoomDetails from "./components/RoomDetails";
import MenuItemDetails from "./components/MenuItemDetails";
import OrderDetails from "./components/OrdersDetails";
import CarDetails from "./components/CarDetails";
import BookingCarDetails from "./components/BookingCarDetails";






import RestaurantDetails from "./components/RestaurantDetails"; // استيراد مكون تفاصيل المطعم


import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/addFlightForm" element={<AddFlightForm />} />


          <Route path="/createHotel" element={<CreateHotel />} />
          <Route path="/createAirline" element={<CreateAirline />} />
          <Route path="/createHospital" element={<CreateHospitalForm />} />
          <Route path="/createRestaurant" element={<CreateRestaurantForm />} />
          <Route path="/createCarRentalForm" element={<CreateCarRentalForm />} />


          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/dashboardHospital" element={<DashboardHospital />} />
          <Route path="/dashboardHotel" element={<DashboardHotel />} />
          <Route path="/dashboardRestaurant" element={<DashboardRestaurant />} />
          <Route path="/dashboardCarRental" element={<DashboardCarRental />} />

          <Route path="/flight/:id" element={<FlightDetails />} />
          <Route path="/booking/:id" element={<BookingDetails />} />
          <Route path="/doctor/:id" element={<DoctorDetails />} />
          <Route path="/bookingdoctor/:id" element={<BookingsDetails />} />
          <Route path="/bookingrooms/:id" element={<BookingRoomDetails />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/menu-item/:id" element={<MenuItemDetails />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/bookingcars/:id" element={<BookingCarDetails />} />



          <Route path="/restaurant/:id" element={<RestaurantDetails />} /> {/* مسار جديد لتفاصيل المطعم */}
          <Route path="/dashboard" element={<Dashboard/>}/>
          {/* <Route path="users" element={<UsersPage />} /> */}
          <Route path="/users" element={<UserManagement />} />

          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
