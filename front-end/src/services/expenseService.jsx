import axios from "axios";

const API_URL = "/api/expenses";

const getAuthHeaders = () => {
  const { token } = JSON.parse(localStorage.getItem("userInfo"));
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getExpenses = async (filters = {}) => {
  const validFilters = {};
  for (const key in filters) {
    if (filters[key] !== null && filters[key] !== "") {
      validFilters[key] = filters[key];
    }
  }
  const params = new URLSearchParams(validFilters).toString();
  const { data } = await axios.get(`${API_URL}?${params}`, getAuthHeaders());
  return data;
};

const createExpense = async (expenseData) => {
  const { data } = await axios.post(API_URL, expenseData, getAuthHeaders());
  return data;
};

const updateExpense = async (expenseId, expenseData) => {
  const { data } = await axios.put(
    `${API_URL}/${expenseId}`,
    expenseData,
    getAuthHeaders()
  );
  return data;
};

const deleteExpense = async (expenseId) => {
  const { data } = await axios.delete(
    `${API_URL}/${expenseId}`,
    getAuthHeaders()
  );
  return data;
};

const getStats = async (filters = {}) => {
  const validFilters = {};
  for (const key in filters) {
    if (filters[key]) {
      validFilters[key] = filters[key];
    }
  }
  const params = new URLSearchParams(validFilters).toString();
  const { data } = await axios.get(
    `${API_URL}/stats?${params}`,
    getAuthHeaders()
  );
  return data;
};

const expenseService = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getStats,
};

export default expenseService;
