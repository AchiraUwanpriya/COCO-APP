import {
  EMPLOYEE_REQUEST,
  EMPLOYEE_SUCCESS,
  EMPLOYEE_FAIL,
  EMPLOYEE_BY_ID_REQUEST,
  EMPLOYEE_BY_ID_SUCCESS,
  EMPLOYEE_BY_ID_FAIL,
} from "../constants/EmployeeConstants";

import EmployeeService from "../service/EmployeeService";

export const GetEmployees = () => async (dispatch) => {
  dispatch({
    type: EMPLOYEE_REQUEST,
  });

  return await EmployeeService.GetEmployees().then(
    (data) => {
      if (data.data.StatusCode === 200) {
        dispatch({
          type: EMPLOYEE_SUCCESS,
          payload: {
            responseBody: data.data.ResultSet,
          },
        });
      } else {
        dispatch({
          type: EMPLOYEE_FAIL,
          payload: {
            msg: "Sorry, we could not load the employees. Please try again!",
          },
        });
      }
      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({
        type: EMPLOYEE_FAIL,
        payload: {
          msg: message,
        },
      });
      return Promise.reject();
    }
  );
};
export const GetEmployeeById = (employeeId) => async (dispatch) => {
  dispatch({
    type: EMPLOYEE_BY_ID_REQUEST,
  });

  return await EmployeeService.GetEmployeeById(employeeId).then(
    (data) => {
      if (data.data.StatusCode === 200) {
        const rs = data.data.ResultSet;
        // The endpoint may return a single object or a one-element array
        const employee = Array.isArray(rs) ? rs[0] || null : rs || null;
        dispatch({
          type: EMPLOYEE_BY_ID_SUCCESS,
          payload: {
            selectedEmployee: employee,
          },
        });
      } else {
        dispatch({
          type: EMPLOYEE_BY_ID_FAIL,
          payload: {
            detailMsg: "Sorry, we could not load the employee details. Please try again!",
          },
        });
      }
      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({
        type: EMPLOYEE_BY_ID_FAIL,
        payload: {
          detailMsg: message,
        },
      });
      return Promise.reject();
    }
  );
};