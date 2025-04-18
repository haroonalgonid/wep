import axios from "axios";

const API_BASE_URL = "https://backend-fpnx.onrender.com";

const fetchAirlines = (token) => {
  return axios.get(`${API_BASE_URL}/airlines/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const toggleApproval = (airlineId, isApproved, token) => {
  return axios.put(
    `${API_BASE_URL}/airlines/admin/${airlineId}/approve`,
    { isApproved },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteAirline = (airlineId, token) => {
  return axios.delete(`${API_BASE_URL}/airlines/${airlineId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createAirline = (formData) => {
    return axios.post(`${API_BASE_URL}/airlines`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

export { fetchAirlines, toggleApproval, deleteAirline, createAirline };
