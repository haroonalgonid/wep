import axios from "axios";

// دالة لجلب شركات تأجير السيارات
export const fetchCarRentals = (token) => {
  return axios.get("https://backend-fpnx.onrender.com/carrental", {
    headers: {
      Authorization: token,
    },
  });
};

// دالة لتغيير حالة شركة تأجير السيارات
export const toggleCarRentalApproval = (carRentalId, isApproved, token) => {
  return axios.put(
    `https://backend-fpnx.onrender.com/carrental/admin/${carRentalId}/approve`,
    { isApproved },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

// دالة لحذف شركة تأجير السيارات
export const deleteCarRental = (carRentalId, token) => {
  return axios.delete(`https://backend-fpnx.onrender.com/carrental/${carRentalId}`, {
    headers: {
      Authorization: token,
    },
  });
};

// دالة لإنشاء شركة تأجير سيارات جديدة
export const createCarRental = (carRentalData, token) => {
  return axios.post("https://backend-fpnx.onrender.com/carrental", carRentalData, {
    headers: {
      Authorization: token,
      "Content-Type": "multipart/form-data",
    },
  });
};