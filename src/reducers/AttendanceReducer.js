import {
  ATTENDANCE_REQUEST,
  ATTENDANCE_SUCCESS,
  ATTENDANCE_FAIL,
} from "../constants/AttendanceContant";

const initialState = {
  requestBody: null,
  responseBody: [],
  divisionData: [],
  subOrderingAttendance: [],
  weeklyAttendance: [],
  monthlyAttendance: [],
  yearlyAttendance: [],
  traineeTypes: [],
  traineeDivision: [],
  allAttendance: [],
  cdplcData: [],
  error: null,
  otData: null,
  otEmployees: [],
  dutyOffEmployees: [],
  msg: null,
  loading: false,
};

export const GetAttendanceCard = (state = initialState, action) => {
  switch (action.type) {
    case ATTENDANCE_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
      };
    case ATTENDANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody || state.responseBody,
        divisionData: action.payload.divisionData || state.divisionData,
        subOrderingAttendance:
          action.payload.subOrderingAttendance || state.subOrderingAttendance,
        weeklyAttendance:
          action.payload.weeklyAttendance || state.weeklyAttendance,
        yearlyAttendance:
          action.payload.yearlyAttendance || state.yearlyAttendance,
        monthlyAttendance:
          action.payload.monthlyAttendance || state.monthlyAttendance,
        traineeTypes: action.payload.traineeTypes || state.traineeTypes,
        traineeDivision:
          action.payload.traineeDivision || state.traineeDivision,
        allAttendance: action.payload.allAttendance || state.allAttendance,
        cdplcData: action.payload.cdplcData || state.cdplcData,
        otData: action.payload.otData || state.otData,
        otEmployees: action.payload.otEmployees || state.otEmployees,
        dutyOffEmployees: action.payload.dutyOffEmployees || state.dutyOffEmployees,
        msg: null,
      };
    case ATTENDANCE_FAIL:
      return {
        ...state,
        loading: false,
        msg: action.payload.msg,
        responseBody: [],
      };
    default:
      return state;
  }
};
