import axios from "axios";

const API_BASE_URL = "https://backend-fpnx.onrender.com/hospitals";

const fetchHospitals = () => {
  return axios.get(`${API_BASE_URL}/hospitals`);
};

const toggleHospitalApproval = (hospitalId, isApproved, token) => {
    return axios.put(
        `${API_BASE_URL}/hospitals/admin/${hospitalId}/approve`,
        { isApproved },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

const deleteHospital = (hospitalId, token) => {
    return axios.delete(`${API_BASE_URL}/hospitals/${hospitalId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const createHospital = (formData) => {
    return axios.post(`${API_BASE_URL}/hospitals`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export { fetchHospitals, toggleHospitalApproval, deleteHospital, createHospital };
