import axios from "axios";

const GetAttendenceDetails = async () => {
  const config = {
    method: "get",
    url: "/Attendence/GetAttendenceDetails",
  };

  return axios.request(config).then((response) => {
    return response;
  });
};

const mockRes = () => Promise.resolve({ data: { StatusCode: 200, ResultSet: [] } });

const GetAttendanceCard = async (month) => mockRes();
const GetCdlBasedDivison = async (mcvDate, hadDate) => mockRes();
const GetTraineeBasedTypes = async (hadDate) => mockRes();
const GetTraineeDivisionAttendance = async (mcvDate, hadDate) => mockRes();
const GetAllAttendance = async (mcvDate, hadDate) => mockRes();
const GetCDLWeekAttendance = async (hadDate) => mockRes();
const GetCDLMonthlyAttendance = async () => mockRes();
const GetCDLYearlyAttendance = async () => mockRes();
const GetCDLCategoryAtt = async (hadDate) => mockRes();
const GetOTEntered = async () => mockRes();
const GetCDLOTEmployee = async () => mockRes();
const GetCDLDutyoffEmployee = async () => mockRes();
const GetsubOrderingAttendanceCard = async (month, sno) => mockRes();


export default {
  GetAttendenceDetails,
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
