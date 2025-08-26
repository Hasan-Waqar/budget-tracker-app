import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/users`;

const signup = async (userData) => {
  const { data } = await axios.post(`${API_URL}/signup`, userData);
  if (data) {
    localStorage.setItem("userInfo", JSON.stringify(data));
  }
  return data;
};

const login = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/login`, { email, password });
  if (data) {
    localStorage.setItem("userInfo", JSON.stringify(data));
  }
  return data;
};

const logout = () => {
  localStorage.removeItem("userInfo");
};

const updateProfile = async (userData) => {
  const { token } = JSON.parse(localStorage.getItem("userInfo"));

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.put(`${API_URL}/profile`, userData, config);

  if (data) {
    localStorage.setItem("userInfo", JSON.stringify(data));
  }
  return data;
};

const uploadPfp = async (file) => {
  const formData = new FormData();
  formData.append("pfp", file);
  const { token } = JSON.parse(localStorage.getItem("userInfo"));
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(`${API_URL}/profile/pfp`, formData, config);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const updatedUserInfo = { ...userInfo, ...data };
  localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

  return updatedUserInfo;
};

const authService = {
  signup,
  login,
  logout,
  updateProfile,
  uploadPfp,
};

export default authService;
