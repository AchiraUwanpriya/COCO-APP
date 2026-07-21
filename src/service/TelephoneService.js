import axios from "axios";

const GetTelephoneCard = async () => {
  let config = {
    method: "post",
    url: "PhoneDirectory/GetTelephoneCard",
  };

  return axios.request(config).then((response) => {
    return response;
  });
};

export default {
  GetTelephoneCard,
};
