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
    const resData = data?.data;
    const isSuccess =
      data?.status === 200 ||
      resData?.StatusCode == 200 ||
      resData?.statusCode == 200 ||
      resData?.Status == 200 ||
      resData?.status == 200 ||
      Array.isArray(resData);

    if (isSuccess) {
      let list = [];
      if (Array.isArray(resData)) {
        list = resData;
      } else if (resData && typeof resData === "object") {
        list =
          resData.ResultSet ||
          resData.resultSet ||
          resData.Data ||
          resData.data ||
          resData.Result ||
          resData.result ||
          resData.CategoryList ||
          resData.categoryList ||
          resData.list ||
          resData.items ||
          resData;
      }

      if (!Array.isArray(list) && typeof list === "object" && list !== null) {
        list = Object.values(list).filter((x) => x && typeof x === "object");
      }

      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          cdplcData: list,
        },
      });
    } else {
      dispatch({
        type: ATTENDANCE_FAIL,
        payload: {
          msg:
            resData?.message ||
            resData?.Message ||
            "Failed to fetch CDPLC category attendance data",
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
export const GetCDLDepartmentAtt = (hadDate) => async (dispatch) => {
  dispatch({
    type: ATTENDANCE_REQUEST,
  });

  try {
    const data = await AttendanceService.GetCDLDepartmentAtt(hadDate);
    const resData = data?.data;
    const isSuccess =
      data?.status === 200 ||
      resData?.StatusCode == 200 ||
      resData?.statusCode == 200 ||
      resData?.Status == 200 ||
      resData?.status == 200 ||
      Array.isArray(resData);

    if (isSuccess) {
      let list = [];
      if (Array.isArray(resData)) {
        list = resData;
      } else if (resData && typeof resData === "object") {
        list =
          resData.ResultSet ||
          resData.resultSet ||
          resData.Data ||
          resData.data ||
          resData.Result ||
          resData.result ||
          resData;
      }

      if (!Array.isArray(list) && typeof list === "object" && list !== null) {
        list = Object.values(list).filter((x) => x && typeof x === "object");
      }

      dispatch({
        type: ATTENDANCE_SUCCESS,
        payload: {
          departmentAttendance: list,
        },
      });
      return list;
    } else {
      dispatch({
        type: ATTENDANCE_FAIL,
        payload: {
          msg:
            resData?.message ||
            resData?.Message ||
            "Failed to fetch department attendance data",
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
export const GetAttendanceCard =
  (year, month, sno) => async (dispatch) => {
    dispatch({
      type: ATTENDANCE_REQUEST,
    });

    try {
      const data = await AttendanceService.GetAttendanceCard(
        year,
        month,
        sno
      );
      const resData = data?.data;

      const isSuccess =
        data?.status === 200 ||
        resData?.StatusCode == 200 ||
        resData?.statusCode == 200 ||
        resData?.Status == 200 ||
        resData?.status == 200 ||
        Array.isArray(resData);

      if (isSuccess) {
        let list = [];
        if (Array.isArray(resData)) {
          list = resData;
        } else if (resData) {
          list =
            resData.ResultSet ||
            resData.resultSet ||
            resData.Data ||
            resData.data ||
            resData.attendenceDetails ||
            resData.AttendanceDetails ||
            resData.Result ||
            resData.result ||
            [];
        }

        if (!Array.isArray(list) && typeof list === "object") {
          list = Object.values(list);
        }

        dispatch({
          type: ATTENDANCE_SUCCESS,
          payload: {
            responseBody: list,
            attendenceDetails: list,
          },
        });
      } else {
        dispatch({
          type: ATTENDANCE_FAIL,
          payload: {
            msg:
              resData?.message ||
              resData?.Message ||
              "Sorry we could not find result for your search query. Please try again!",
          },
        });
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          (error.response.data.message || error.response.data.Message)) ||
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

export const GetAttendenceDetails =
  (adate, sno, year, month) => async (dispatch) => {
    dispatch({
      type: ATTENDANCE_REQUEST,
    });

    try {
      const data = await AttendanceService.GetAttendenceDetails(
        adate,
        sno,
        year,
        month
      );
      const resData = data?.data;

      const isSuccess =
        data?.status === 200 ||
        resData?.StatusCode == 200 ||
        resData?.statusCode == 200 ||
        resData?.Status == 200 ||
        resData?.status == 200 ||
        Array.isArray(resData);

      if (isSuccess) {
        let list = [];
        if (Array.isArray(resData)) {
          list = resData;
        } else if (resData) {
          list =
            resData.ResultSet ||
            resData.resultSet ||
            resData.Data ||
            resData.data ||
            resData.attendenceDetails ||
            resData.AttendanceDetails ||
            resData.Result ||
            resData.result ||
            [];
        }

        if (!Array.isArray(list) && typeof list === "object") {
          list = Object.values(list);
        }

        dispatch({
          type: ATTENDANCE_SUCCESS,
          payload: {
            attendenceDetails: list,
            responseBody: list,
          },
        });
      } else {
        dispatch({
          type: ATTENDANCE_FAIL,
          payload: {
            msg:
              resData?.message ||
              resData?.Message ||
              "Sorry, could not load attendance details. Please try again!",
          },
        });
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          (error.response.data.message || error.response.data.Message)) ||
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



