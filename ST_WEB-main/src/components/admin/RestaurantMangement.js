import axios from "axios";

const API_BASE_URL = "https://backend-fpnx.onrender.com";

const fetchRestaurants = (token) => {
  return axios.get(`${API_BASE_URL}/restaurants`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const toggleRestaurantApproval = (restaurantId, isApproved, token) => {
  return axios.put(
    `${API_BASE_URL}/restaurants/admin/${restaurantId}/approve`,
    { isApproved },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteRestaurant = (restaurantId, token) => {
  return axios.delete(`${API_BASE_URL}/restaurants/restaurants/${restaurantId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createRestaurant = (formData) => {
  return axios.post(`${API_BASE_URL}/restaurants`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export { fetchRestaurants, toggleRestaurantApproval, deleteRestaurant, createRestaurant };
    