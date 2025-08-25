import axios from "axios";

const API_URL = "/api/users";

const getAuthHeaders = () => {
  const { token } = JSON.parse(localStorage.getItem("userInfo"));
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getAllUsers = async (filters = {}) => {
  const validFilters = {};
  for (const key in filters) {
    if (filters[key]) {
      validFilters[key] = filters[key];
    }
  }
  const params = new URLSearchParams(validFilters).toString();
  const { data } = await axios.get(`${API_URL}?${params}`, getAuthHeaders());
  return data;
};

const updateUser = async (userId, userData) => {
  const { data } = await axios.put(
    `${API_URL}/${userId}`,
    userData,
    getAuthHeaders()
  );
  return data;
};

const deleteUser = async (userId) => {
  const { data } = await axios.delete(`${API_URL}/${userId}`, getAuthHeaders());
  return data;
};

const createUser = async (userData) => {
  const { data } = await axios.post(API_URL, userData, getAuthHeaders());
  return data;
};

const userService = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};

export default userService;
