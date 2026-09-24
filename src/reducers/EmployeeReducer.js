import {
  EMPLOYEE_REQUEST,
  EMPLOYEE_SUCCESS,
  EMPLOYEE_FAIL,
  EMPLOYEE_BY_ID_REQUEST,
  EMPLOYEE_BY_ID_SUCCESS,
  EMPLOYEE_BY_ID_FAIL,
} from "../constants/EmployeeConstants";

const initialState = {
  responseBody: [],
  loading: false,
  msg: null,
  selectedEmployee: null,
  detailLoading: false,
  detailMsg: null,
};

export const GetEmployees = (state = initialState, action) => {
  switch (action.type) {
    case EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
      };
    case EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: null,
      };
    case EMPLOYEE_FAIL:
      return {
        ...state,
        loading: false,
        msg: action.payload.msg,
        responseBody: [],
      };
    case EMPLOYEE_BY_ID_REQUEST:
      return {
        ...state,
        detailLoading: true,
        detailMsg: null,
        selectedEmployee: null,
      };
    case EMPLOYEE_BY_ID_SUCCESS:
      return {
        ...state,
        detailLoading: false,
        selectedEmployee: action.payload.selectedEmployee,
        detailMsg: null,
      };
    case EMPLOYEE_BY_ID_FAIL:
      return {
        ...state,
        detailLoading: false,
        detailMsg: action.payload.detailMsg,
        selectedEmployee: null,
      };
    default:
      return state;
  }
};