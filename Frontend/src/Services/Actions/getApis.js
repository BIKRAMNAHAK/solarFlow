import axios from "axios";
import { BASE_URL } from "../helpers/config";

// --- Get Admin Profile ---
export const getAdminProfileAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/profile`);
      dispatch({ type: "SET_ADMIN_PROFILE", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Get Solar Panels ---
export const getPanelsAction = (formdata) => {
  return async (dispatch) => {
    try {
      let params = {};
      if (formdata && formdata instanceof FormData) {
        for (const [key, value] of formdata.entries()) {
          params[key] = value;
        }
      }
      const response = await axios.get(`${BASE_URL}/panels`, { params });
      dispatch({ type: "SET_PANELS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Get Leads / Inquiries ---
export const getLeadsAction = (formdata) => {
  return async (dispatch) => {
    try {
      let params = {};
      if (formdata && formdata instanceof FormData) {
        for (const [key, value] of formdata.entries()) {
          params[key] = value;
        }
      }
      const response = await axios.get(`${BASE_URL}/leads`, { params });
      dispatch({ type: "SET_LEADS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Get Employees ---
export const getEmployeesAction = (formdata) => {
  return async (dispatch) => {
    try {
      let params = {};
      if (formdata && formdata instanceof FormData) {
        for (const [key, value] of formdata.entries()) {
          params[key] = value;
        }
      }
      const response = await axios.get(`${BASE_URL}/employees`, { params });
      dispatch({ type: "SET_EMPLOYEES", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Get Digital Task Assignments ---
export const getTasksAction = (formdata) => {
  return async (dispatch) => {
    try {
      let params = {};
      if (formdata && formdata instanceof FormData) {
        for (const [key, value] of formdata.entries()) {
          params[key] = value;
        }
      }
      const response = await axios.get(`${BASE_URL}/tasks`, { params });
      dispatch({ type: "SET_TASKS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Get Quotations ---
export const getQuotationsAction = (formdata) => {
  return async (dispatch) => {
    try {
      let params = {};
      if (formdata && formdata instanceof FormData) {
        for (const [key, value] of formdata.entries()) {
          params[key] = value;
        }
      }
      const response = await axios.get(`${BASE_URL}/quotations`, { params });
      dispatch({ type: "SET_QUOTATIONS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Get Attendance Records ---
export const getAttendanceAction = (formdata) => {
  return async (dispatch) => {
    try {
      let params = {};
      if (formdata && formdata instanceof FormData) {
        for (const [key, value] of formdata.entries()) {
          params[key] = value;
        }
      }
      const response = await axios.get(`${BASE_URL}/attendance`, { params });
      dispatch({ type: "SET_ATTENDANCE", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Get Employee Finances ---
export const getFinanceRecordsAction = (formdata) => {
  return async (dispatch) => {
    try {
      let params = {};
      if (formdata && formdata instanceof FormData) {
        for (const [key, value] of formdata.entries()) {
          params[key] = value;
        }
      }
      const response = await axios.get(`${BASE_URL}/employee-finance`, { params });
      dispatch({ type: "SET_FINANCES", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Get Customer Payments ---
export const getPaymentsAction = (formdata) => {
  return async (dispatch) => {
    try {
      let params = {};
      if (formdata && formdata instanceof FormData) {
        for (const [key, value] of formdata.entries()) {
          params[key] = value;
        }
      }
      const response = await axios.get(`${BASE_URL}/payments`, { params });
      dispatch({ type: "SET_PAYMENTS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Get Dashboard Stats ---
export const getDashboardStatsAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard/stats`);
      dispatch({ type: "SET_DASHBOARD_STATS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};