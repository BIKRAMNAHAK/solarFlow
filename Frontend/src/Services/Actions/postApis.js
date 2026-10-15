import axios from "axios";
import { BASE_URL } from "../helpers/config";

// --- Auth Actions ---
export const adminLoginAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, formdata);
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const adminForgotPasswordAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/forgot-password`, formdata);
      dispatch({ type: "FORGOT_PASSWORD_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const adminResetPasswordAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/reset-password`, formdata);
      dispatch({ type: "RESET_PASSWORD_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const updateAdminProfileAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/profile`, formdata);
      dispatch({ type: "UPDATE_ADMIN_PROFILE", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const adminLogoutAction = () => {
  return async (dispatch) => {
    dispatch({ type: "LOGOUT" });
    return { success: true };
  };
};

// --- Panel Actions ---
export const addPanelAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/panels`, formdata);
      dispatch({ type: "ADD_PANEL_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const updatePanelAction = (formdata, id) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${BASE_URL}/panels/${id}`, formdata);
      dispatch({ type: "UPDATE_PANEL_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const deletePanelAction = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${BASE_URL}/panels/${id}`);
      dispatch({ type: "DELETE_PANEL_SUCCESS", payload: id });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Lead Actions ---
export const createLeadAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/leads`, formdata);
      dispatch({ type: "CREATE_LEAD_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const updateLeadAction = (formdata, id) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${BASE_URL}/leads/${id}`, formdata);
      dispatch({ type: "UPDATE_LEAD_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const deleteLeadAction = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${BASE_URL}/leads/${id}`);
      dispatch({ type: "DELETE_LEAD_SUCCESS", payload: id });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Employee Actions ---
export const addEmployeeAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/employees`, formdata);
      dispatch({ type: "ADD_EMPLOYEE_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const updateEmployeeAction = (formdata, id) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${BASE_URL}/employees/${id}`, formdata);
      dispatch({ type: "UPDATE_EMPLOYEE_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const deleteEmployeeAction = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${BASE_URL}/employees/${id}`);
      dispatch({ type: "DELETE_EMPLOYEE_SUCCESS", payload: id });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Task / Digital Job Assignment Actions ---
export const assignTaskAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/tasks`, formdata);
      dispatch({ type: "ASSIGN_TASK_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const updateTaskStatusAction = (formdata, id) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${BASE_URL}/tasks/${id}`, formdata);
      dispatch({ type: "UPDATE_TASK_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const deleteTaskAction = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${BASE_URL}/tasks/${id}`);
      dispatch({ type: "DELETE_TASK_SUCCESS", payload: id });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Quotation Actions ---
export const createQuotationAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/quotations`, formdata);
      dispatch({ type: "CREATE_QUOTATION_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const updateQuotationAction = (formdata, id) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${BASE_URL}/quotations/${id}`, formdata);
      dispatch({ type: "UPDATE_QUOTATION_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const deleteQuotationAction = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${BASE_URL}/quotations/${id}`);
      dispatch({ type: "DELETE_QUOTATION_SUCCESS", payload: id });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Attendance & Employee Finance Actions ---
export const markAttendanceAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/attendance`, formdata);
      dispatch({ type: "MARK_ATTENDANCE_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const addFinanceRecordAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/employee-finance`, formdata);
      dispatch({ type: "ADD_FINANCE_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// --- Customer Payment Actions ---
export const addPaymentAction = (formdata) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${BASE_URL}/payments`, formdata);
      dispatch({ type: "ADD_PAYMENT_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const updatePaymentAction = (formdata, id) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${BASE_URL}/payments/${id}`, formdata);
      dispatch({ type: "UPDATE_PAYMENT_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const deletePaymentAction = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${BASE_URL}/payments/${id}`);
      dispatch({ type: "DELETE_PAYMENT_SUCCESS", payload: id });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};