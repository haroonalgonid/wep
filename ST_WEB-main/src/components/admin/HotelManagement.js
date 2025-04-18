import axios from "axios";

const API_BASE_URL = "https://backend-fpnx.onrender.com";

const fetchHotels = (token) => {
  return axios.get(`${API_BASE_URL}/hotels`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const toggleHotelApproval = (hotelId, isApproved, token) => {
  return axios.put(
    `${API_BASE_URL}/hotels/admin/${hotelId}/approve`,
    { isApproved },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteHotel = (hotelId, token) => {
  return axios.delete(`${API_BASE_URL}/hotels/${hotelId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createHotel = (formData) => {
  return axios.post(`${API_BASE_URL}/hotels`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export { fetchHotels, toggleHotelApproval, deleteHotel, createHotel };
