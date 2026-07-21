import axios from "axios";

const login = async (service_no, password, device, ip) => {
  return Promise.resolve({ data: { StatusCode: 200, ResultSet: [] } });
};

const userLogin = async (serviceNo, password) => {
  const config = {
    method: "post",
    url: "Login/UserLogin",
    params: {
      serviceNo,
      password,
    },
  };

  return axios.request(config).then((response) => {
    return response;
  });
};

const verifyOTP = async (userOTP, encryptedOTP) => {
  return Promise.resolve({ data: { StatusCode: 200, ResultSet: [] } });
};

const biometricLogin = async (biometricToken) => {
  return Promise.resolve({ data: { StatusCode: 200, ResultSet: [] } });
};

export default {
  login,
  userLogin,
  verifyOTP,
  biometricLogin,
};
