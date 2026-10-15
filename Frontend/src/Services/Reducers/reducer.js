const initialState = {
  admin: null,
  token: localStorage.getItem('solarflow_token') || null,
  isAuthenticated: !!localStorage.getItem('solarflow_token'),
  adminProfile: null,
  panels: [],
  leads: [],
  employees: [],
  tasks: [],
  quotations: [],
  attendance: [],
  finances: [],
  financeTotals: { totalSalaryPaid: 0, totalAdvances: 0, totalExpenses: 0 },
  payments: [],
  paymentTotals: { totalCollected: 0, totalPendingBalance: 0 },
  dashboardStats: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      if (action.payload.token) {
        localStorage.setItem('solarflow_token', action.payload.token);
      }
      return {
        ...state,
        admin: action.payload.admin,
        token: action.payload.token,
        isAuthenticated: true,
      };

    case "LOGOUT":
      localStorage.removeItem('solarflow_token');
      return {
        ...state,
        admin: null,
        token: null,
        isAuthenticated: false,
      };

    case "SET_ADMIN_PROFILE":
    case "UPDATE_ADMIN_PROFILE":
      return {
        ...state,
        adminProfile: action.payload.admin,
        admin: action.payload.admin || state.admin,
      };

    // --- Panels ---
    case "SET_PANELS":
      return {
        ...state,
        panels: action.payload.panels || [],
      };

    case "ADD_PANEL_SUCCESS":
      return {
        ...state,
        panels: [action.payload.panel, ...state.panels],
      };

    case "UPDATE_PANEL_SUCCESS":
      return {
        ...state,
        panels: state.panels.map((p) =>
          p._id === action.payload.panel._id ? action.payload.panel : p
        ),
      };

    case "DELETE_PANEL_SUCCESS":
      return {
        ...state,
        panels: state.panels.filter((p) => p._id !== action.payload),
      };

    // --- Leads ---
    case "SET_LEADS":
      return {
        ...state,
        leads: action.payload.leads || [],
      };

    case "CREATE_LEAD_SUCCESS":
      return {
        ...state,
        leads: [action.payload.lead, ...state.leads],
      };

    case "UPDATE_LEAD_SUCCESS":
      return {
        ...state,
        leads: state.leads.map((l) =>
          l._id === action.payload.lead._id ? action.payload.lead : l
        ),
      };

    case "DELETE_LEAD_SUCCESS":
      return {
        ...state,
        leads: state.leads.filter((l) => l._id !== action.payload),
      };

    // --- Employees ---
    case "SET_EMPLOYEES":
      return {
        ...state,
        employees: action.payload.employees || [],
      };

    case "ADD_EMPLOYEE_SUCCESS":
      return {
        ...state,
        employees: [action.payload.employee, ...state.employees],
      };

    case "UPDATE_EMPLOYEE_SUCCESS":
      return {
        ...state,
        employees: state.employees.map((e) =>
          e._id === action.payload.employee._id ? action.payload.employee : e
        ),
      };

    case "DELETE_EMPLOYEE_SUCCESS":
      return {
        ...state,
        employees: state.employees.filter((e) => e._id !== action.payload),
      };

    // --- Tasks / Job assignments ---
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload.tasks || [],
      };

    case "ASSIGN_TASK_SUCCESS":
      return {
        ...state,
        tasks: [action.payload.task, ...state.tasks],
      };

    case "UPDATE_TASK_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t._id === action.payload.task._id ? action.payload.task : t
        ),
      };

    case "DELETE_TASK_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
      };

    // --- Quotations ---
    case "SET_QUOTATIONS":
      return {
        ...state,
        quotations: action.payload.quotations || [],
      };

    case "CREATE_QUOTATION_SUCCESS":
      return {
        ...state,
        quotations: [action.payload.quotation, ...state.quotations],
      };

    case "UPDATE_QUOTATION_SUCCESS":
      return {
        ...state,
        quotations: state.quotations.map((q) =>
          q._id === action.payload.quotation._id ? action.payload.quotation : q
        ),
      };

    case "DELETE_QUOTATION_SUCCESS":
      return {
        ...state,
        quotations: state.quotations.filter((q) => q._id !== action.payload),
      };

    // --- Attendance & Finances ---
    case "SET_ATTENDANCE":
      return {
        ...state,
        attendance: action.payload.records || [],
      };

    case "MARK_ATTENDANCE_SUCCESS":
      return {
        ...state,
        attendance: [
          action.payload.record,
          ...state.attendance.filter(
            (a) =>
              !(
                a.employeeId?._id === action.payload.record.employeeId?._id &&
                a.date === action.payload.record.date
              )
          ),
        ],
      };

    case "SET_FINANCES":
      return {
        ...state,
        finances: action.payload.records || [],
        financeTotals: action.payload.totals || state.financeTotals,
      };

    case "ADD_FINANCE_SUCCESS":
      return {
        ...state,
        finances: [action.payload.record, ...state.finances],
      };

    // --- Payments ---
    case "SET_PAYMENTS":
      return {
        ...state,
        payments: action.payload.payments || [],
        paymentTotals: {
          totalCollected: action.payload.totalCollected || 0,
          totalPendingBalance: action.payload.totalPendingBalance || 0,
        },
      };

    case "ADD_PAYMENT_SUCCESS":
      return {
        ...state,
        payments: [action.payload.payment, ...state.payments],
      };

    case "UPDATE_PAYMENT_SUCCESS":
      return {
        ...state,
        payments: state.payments.map((p) =>
          p._id === action.payload.payment._id ? action.payload.payment : p
        ),
      };

    case "DELETE_PAYMENT_SUCCESS":
      return {
        ...state,
        payments: state.payments.filter((p) => p._id !== action.payload),
      };

    // --- Dashboard ---
    case "SET_DASHBOARD_STATS":
      return {
        ...state,
        dashboardStats: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;