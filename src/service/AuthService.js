import axios from "axios";

const login = async (service_no,password,device, ip) => {
  let formData = new FormData();
  formData.append("P_SERVICE_NO", service_no);
  formData.append("P_PASSWORD", password);
  formData.append("P_DEVICE", device);
  formData.append("P_IP", ip);

  let config = {
    method: "post",
    url: "Login/Login",
    data: formData,
  };

  return axios.request(config).then((response) => {
    return response;
  });
};
const verifyOTP = async (userOTP, encryptedOTP) => {
  const config = {
    method: "post",
    url: "Login/VerifyOTP",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      UserOTP: userOTP,
      EncryptedOTP: encryptedOTP,
    },
  };

  return axios.request(config).then((response) => {
    return response;
  });
};


const biometricLogin = async (biometricToken) => {
  const config = {
    method: "post",
    url: "Login/BiometricLogin",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      BiometricToken: biometricToken,
    },
  };

  return axios.request(config).then((response) => {
    return response;
  });
};

export default {
  login,
  verifyOTP,
  biometricLogin,
};
