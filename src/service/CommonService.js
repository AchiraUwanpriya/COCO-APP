import axios from "axios";

const readAuthKey = () => {
  const raw = sessionStorage.getItem("token");
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    return parsed || raw;
  } catch (err) {
    return raw;
  }
};

const getBannerImages = async () => {
  return axios.get(`home/GetBannerImgList`).then((response) => {
    return response;
  });
};

const GetAccessHeadComponent = async () => {
  return axios.post(`Access/GetAccessHeadComponent`).then((response) => {
    return response;
  });
};


const GetUserByServiceNo = async () => {
 
  
  return axios.post(`login/GetUserByServiceNo`)
    .then((response) => {

      if (
        response.data &&
        response.data.ResultSet &&
        response.data.ResultSet.length > 0
      ) {
        const serviceNo = response.data.ResultSet[0].ServiceNo;

        localStorage.setItem("ServiceNo", serviceNo);
      }

      return response;
    });
};
const GetToDoList = async () => {
  const authKey = readAuthKey();
  return axios.get(`DailyCollect/GetSupplier`, {
    headers: {
      "auth-key": authKey,
    },
  }).then((response) => {
    return response;
  });
};

const GetDailyCollect = async (params = {}) => {
  const authKey = readAuthKey();
  const date = params.date || params.p_mdd_month || '';
  
  return axios.get(`DailyCollect/GetDailyCollect`, {
    headers: {
      "auth-key": authKey,
    },
    params: {
      p_mdd_month: date,
    },
  }).then((response) => {
    return response;
  });
};

const GetChaserDailyCollect = async (params = {}) => {
  const authKey = readAuthKey();
  return axios.get(`DailyCollect/GetChaserDailyCollect`, {
    headers: {
      "auth-key": authKey,
    },
    params,
  }).then((response) => {
    return response;
  });
};


const PostDailyCollect = async (payload) => {
  const authKey = readAuthKey();
  return axios
    .post(`DailyCollect/PostDailyCollect`, payload, {
      headers: {
        "auth-key": authKey,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response;
    });
};

const UpdateDailyCollect = async (payload) => {
  const authKey = readAuthKey();
  return axios
    .post(`DailyCollect/UpdateDailyCollect`, payload, {
      headers: {
        "auth-key": authKey,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response;
    });
};

const GetCdllocbaseAttendance = async (hadDate) => {
  return axios.get("Attendancedashboard/GetCdllocbaseAttendance", {
      params: {
         
        p_had_date: hadDate
      },
    }).then((response) => {
    
    return response;
  });
};

const GetEmployeeNoPay = async (barcodeNo, currentYear) => {
  return axios.get(`Attendancedashboard/GetEmployeeNoPay`, {
    params: {
      p_barcode_no: barcodeNo,
      p_current_year: currentYear
    }
  }).then((response) => {
    return response;
  });
};

const GetEmployeeDetails = async (p_sno) => {
  return axios.get(`Attendancedashboard/GetEmployeeDetails`, {
    params: {
      p_sno: p_sno
    }
  }).then((response) => {
    return response;
  });
};
const GetEmployeeAttSummary = async (p_sno) => {
  return axios.get(`Attendancedashboard/GetEmployeeAttSummary`, {
    params: {
      p_sno: p_sno
    }
  }).then((response) => {
    return response;
  });
};

const GetEmployeeOtherInfo = async (p_sno) => {
  return axios.get(`Attendancedashboard/GetEmployeeOtherInfo`, {
    params: {
      p_sno: p_sno
    }
  }).then((response) => {
    return response;
  });
};

export default {
  getBannerImages,
  GetAccessHeadComponent,
  GetUserByServiceNo,
  GetToDoList,
  GetDailyCollect,
  PostDailyCollect,
  UpdateDailyCollect,
  GetCdllocbaseAttendance,
  GetEmployeeNoPay,
  GetEmployeeDetails,
  GetEmployeeAttSummary,
  GetEmployeeOtherInfo,
  GetChaserDailyCollect
};
