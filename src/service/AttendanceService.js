import axios from "axios";

const GetAttendanceCard = async (month) => {
  let formData = new FormData();
  formData.append("P_MONTH", month);

  let config = {
    method: "post",
    url: "Attendance/GetAttendanceCard",
    data: formData,
  };

  return axios.request(config).then((response) => {
    return response;
  });
};

const GetCdlBasedDivison = async (mcvDate, hadDate) => {
  return axios
    .get(`Attendancedashboard/GetCdlBasedDivison`, {
      params: {
        p_mcv_date: mcvDate,
        p_had_date: hadDate,
      },
    })
    .then((response) => {
      return response;
    });
};

const GetTraineeBasedTypes = async (hadDate) => {
  return axios
    .get(`Attendancedashboard/GetTraineeBasedTypes`, {
      params: {
        p_had_date: hadDate,
      },
    })
    .then((response) => {
      return response;
    });
};

const GetTraineeDivisionAttendance = async (mcvDate, hadDate) => {
  return axios
    .get(`Attendancedashboard/GetTraineeDivisionAttendance`, {
      params: {
        p_mcv_date: mcvDate,
        p_had_date: hadDate,
      },
    })
    .then((response) => {
      return response;
    });
};

const GetAllAttendance = async (mcvDate, hadDate) => {
  return axios
    .get(`Attendancedashboard/GetWorkforce`, {
      params: {
        p_had_date: hadDate,
      },
    })
    .then((response) => {
      return response;
    });
};

const GetCDLWeekAttendance = async (hadDate) => {
  return axios
    .get(`Attendancedashboard/GetCDLWeekAttendance`, {
      params: {
        p_had_date: hadDate,
      },
    })
    .then((response) => {
      return response;
    });
};

const GetCDLMonthlyAttendance = async () => {
  return axios
    .get(`Attendancedashboard/GetCDLMonthlyAttendance`)
    .then((response) => {
      return response;
    });
};

const GetCDLYearlyAttendance = async () => {
  return axios
    .get(`Attendancedashboard/GetCDLYearlyAttendance`)
    .then((response) => {
      return response;
    });
};

const GetCDLCategoryAtt = async (hadDate) => {
  return axios
    .get(`Attendancedashboard/GetCDLCategoryAtt`, {
      params: {
        p_had_date: hadDate,
      },
    })
    .then((response) => {
      return response;
    });
};

const GetOTEntered = async () => {
  return axios
    .get(`Attendancedashboard/GetOTEntered`)
    .then((response) => response);
};

const GetCDLOTEmployee = async () => {
  return axios
    .get(`Attendancedashboard/GetCDLOTEmployee`)
    .then((response) => response);
};

const GetCDLDutyoffEmployee = async () => {
  return axios
    .get(`Attendancedashboard/GetCDLDutyoffEmployee`)
    .then((response) => response);
};

const GetsubOrderingAttendanceCard = async (month, sno) => {
  return axios
    .get(`Attendance/GetsubOrderingAttendanceCard`, {
      params: {
        P_MONTH: month,
        p_sno: sno,
      },
    })
    .then((response) => {
      return response;
    });
};


export default {
  GetAttendanceCard,
  GetCdlBasedDivison,
  GetTraineeBasedTypes,
  GetTraineeDivisionAttendance,
  GetAllAttendance,
  GetCDLWeekAttendance,
  GetCDLYearlyAttendance,
  GetCDLMonthlyAttendance,
  GetCDLCategoryAtt,
  GetOTEntered,
  GetCDLOTEmployee,
  GetCDLDutyoffEmployee,
  GetsubOrderingAttendanceCard,
};
