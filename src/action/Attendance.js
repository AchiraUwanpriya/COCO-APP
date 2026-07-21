import {
  ATTENDANCE_FAIL,
  ATTENDANCE_SUCCESS,
  ATTENDANCE_REQUEST,
} from "../constants/AttendanceContant";

import AttendanceService from "../service/AttendanceService";

export const GetCDLWeekAttendance = (hadDate) => async (dispatch) => {
  dispatch({
    type: ATTENDANCE_REQUEST,
  });

  try {
    const data = await AttendanceService.GetCDLWeekAttendance(hadDate);
    if (data.data.StatusCode === 200) {
      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          weeklyAttendance: data.data.ResultSet,
        },
      });
    } else {
      dispatch({
        type: ATTENDANCE_FAIL,
        payload: {
          msg: "Failed to fetch weekly attendance data",
        },
      });
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({
      type: ATTENDANCE_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};
export const GetCDLYearlyAttendance = () => async (dispatch) => {
  dispatch({
    type: ATTENDANCE_REQUEST,
  });

  try {
    const data = await AttendanceService.GetCDLYearlyAttendance();
    if (data.data.StatusCode === 200) {
      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          yearlyAttendance: data.data.ResultSet,
        },
      });
    } else {
      dispatch({
        type: ATTENDANCE_FAIL,
        payload: {
          msg: "Failed to fetch weekly attendance data",
        },
      });
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({
      type: ATTENDANCE_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};
export const GetCDLMonthlyAttendance = () => async (dispatch) => {
  dispatch({
    type: ATTENDANCE_REQUEST,
  });

  try {
    const data = await AttendanceService.GetCDLMonthlyAttendance();
    if (data.data.StatusCode === 200) {
      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          monthlyAttendance: data.data.ResultSet,
        },
      });
    } else {
      dispatch({
        type: ATTENDANCE_FAIL,
        payload: {
          msg: "Failed to fetch weekly attendance data",
        },
      });
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({
      type: ATTENDANCE_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

export const GetCDLCategoryAtt = (hadDate) => async (dispatch) => {
  dispatch({
    type: ATTENDANCE_REQUEST,
  });

  try {
    const data = await AttendanceService.GetCDLCategoryAtt(hadDate);
    if (data.data.StatusCode === 200) {
      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          cdplcData: data.data.ResultSet,
        },
      });
    } else {
      dispatch({
        type: ATTENDANCE_FAIL,
        payload: {
          msg: "Failed to fetch CDPLC category attendance data",
        },
      });
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({
      type: ATTENDANCE_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};
export const GetAttendanceCard = (month) => async (dispatch) => {
  dispatch({
    type: ATTENDANCE_REQUEST,
  });

  try {
    const data = await AttendanceService.GetAttendanceCard(month);
    if (data.data.StatusCode === 200) {
      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          responseBody: data.data.ResultSet,
        },
      });
    } else {
      dispatch({
        type: ATTENDANCE_FAIL,
        payload: {
          msg: "Sorry we could not find result for your search query. Please try again!",
        },
      });
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({
      type: ATTENDANCE_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

export const GetCdlBasedDivison = (mcvDate, hadDate) => async (dispatch) => {
  dispatch({
    type: ATTENDANCE_REQUEST,
  });

  try {
    const data = await AttendanceService.GetCdlBasedDivison(mcvDate, hadDate);
    if (data.data.StatusCode === 200) {
      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          divisionData: data.data.ResultSet,
        },
      });
    } else {
      dispatch({
        type: ATTENDANCE_FAIL,
        payload: {
          msg: "Failed to fetch division data",
        },
      });
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({
      type: ATTENDANCE_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};


export const GetTraineeBasedTypes = (hadDate) => async (dispatch) => {
  dispatch({
    type: ATTENDANCE_REQUEST,
  });

  try {
    const data = await AttendanceService.GetTraineeBasedTypes(hadDate);
    if (data.data.StatusCode === 200) {
      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          traineeTypes: data.data.ResultSet,
        },
      });
    } else {
      dispatch({
        type: ATTENDANCE_FAIL,
        payload: {
          msg: "Failed to fetch trainee types data",
        },
      });
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({
      type: ATTENDANCE_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

export const GetTraineeDivisionAttendance =
  (mcvDate, hadDate) => async (dispatch) => {
    dispatch({
      type: ATTENDANCE_REQUEST,
    });

    try {
      const data = await AttendanceService.GetTraineeDivisionAttendance(
        mcvDate,
        hadDate,
      );
      if (data.data.StatusCode === 200) {
        dispatch({
          type: ATTENDANCE_SUCCESS,
          payload: {
            traineeDivision: data.data.ResultSet,
          },
        });
      } else {
        dispatch({
          type: ATTENDANCE_FAIL,
          payload: {
            msg: "Failed to fetch trainee division data",
          },
        });
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({
        type: ATTENDANCE_FAIL,
        payload: {
          msg: message,
        },
      });
    }
  };

export const GetAllAttendance = (mcvDate, hadDate) => async (dispatch) => {
  dispatch({
    type: ATTENDANCE_REQUEST,
  });

  try {
    const data = await AttendanceService.GetAllAttendance(mcvDate, hadDate);
    if (data.data.StatusCode === 200) {
      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          allAttendance: data.data.ResultSet,
        },
      });
    } else {
      dispatch({
        type: ATTENDANCE_FAIL,
        payload: {
          msg: "Failed to fetch all attendance data",
        },
      });
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({
      type: ATTENDANCE_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

export const GetOTEntered = () => async (dispatch) => {
  dispatch({ type: ATTENDANCE_REQUEST });

  try {
    const data = await AttendanceService.GetOTEntered();
    if (data.data.StatusCode === 200) {
      const row = data.data.ResultSet?.[0];
      const liveEmp   = parseInt(row?.live_employee) || 0;
      const otEntered = parseInt(row?.ot_entered)    || 0;
      const dutyOff   = parseInt(row?.duty_off)      || 0;

      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          otData: {
            liveEmployees: liveEmp,
            dutyOff,
            otEntered,
            otNotEntered: Math.max(0, liveEmp - otEntered ),
          },
        },
      });
    } else {
      dispatch({ type: ATTENDANCE_FAIL, payload: { msg: "Failed to fetch OT data" } });
    }
  } catch (error) {
    const message =
      (error.response?.data?.message) || error.message || error.toString();
    dispatch({ type: ATTENDANCE_FAIL, payload: { msg: message } });
  }
};

export const GetCDLOTEmployee = () => async (dispatch) => {
  dispatch({ type: ATTENDANCE_REQUEST });

  try {
    const data = await AttendanceService.GetCDLOTEmployee();
    if (data.data.StatusCode === 200) {
      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          otEmployees: Array.isArray(data.data.ResultSet) ? data.data.ResultSet : [],
        },
      });
    } else {
      dispatch({ type: ATTENDANCE_FAIL, payload: { msg: "Failed to fetch OT employee list" } });
    }
  } catch (error) {
    const message =
      (error.response?.data?.message) || error.message || error.toString();
    dispatch({ type: ATTENDANCE_FAIL, payload: { msg: message } });
  }
};

export const GetCDLDutyoffEmployee = () => async (dispatch) => {
  dispatch({ type: ATTENDANCE_REQUEST });

  try {
    const data = await AttendanceService.GetCDLDutyoffEmployee();
    if (data.data.StatusCode === 200) {
      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          dutyOffEmployees: Array.isArray(data.data.ResultSet) ? data.data.ResultSet : [],
        },
      });
    } else {
      dispatch({ type: ATTENDANCE_FAIL, payload: { msg: "Failed to fetch duty off employee list" } });
    }
  } catch (error) {
    const message =
      (error.response?.data?.message) || error.message || error.toString();
    dispatch({ type: ATTENDANCE_FAIL, payload: { msg: message } });
  }
};

export const GetsubOrderingAttendanceCard = (month, sno) => async (dispatch) => {
  dispatch({
    type: ATTENDANCE_REQUEST,
  });

  try {
    const data = await AttendanceService.GetsubOrderingAttendanceCard(month, sno);
    if (data.data.StatusCode === 200) {
      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          subOrderingAttendance: data.data.ResultSet || [],
        },
      });
    } else {
      dispatch({
        type: ATTENDANCE_FAIL,
        payload: {
          msg: "No data found or invalid response.",
        },
      });
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({
      type: ATTENDANCE_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};



