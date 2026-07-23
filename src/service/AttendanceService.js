import axios from "axios";
import dayjs from "dayjs";

const GetAttendenceDetails = async (
  adate,
  snoParam,
  yearParam,
  monthParam
) => {
  let sno = snoParam;
  let year = yearParam;
  let month = monthParam;

  if (
    adate &&
    typeof adate === "object" &&
    !dayjs.isDayjs(adate) &&
    !(adate instanceof Date)
  ) {
    sno =
      adate.sno !== undefined
        ? adate.sno
        : adate.Sno !== undefined
        ? adate.Sno
        : adate.serviceNo !== undefined
        ? adate.serviceNo
        : adate.ServiceNo !== undefined
        ? adate.ServiceNo
        : sno;
    year = adate.year || adate.Year || year;
    month = adate.month || adate.Month || month;
  } else if (adate) {
    const formatted = dayjs(adate).isValid() ? dayjs(adate) : null;
    if (formatted) {
      if (!year) year = formatted.format("YYYY");
      if (!month) month = formatted.format("MM");
    }
  }

  const today = dayjs();

  sno = sno ? String(sno).trim() : "";
  if (!year) year = today.format("YYYY");
  if (!month) month = today.format("MM");

  if (month && String(month).length === 1) {
    month = `0${month}`;
  }

  const config = {
    method: "get",
    url: "/Attendence/GetAttendenceDetails",
    params: {
      sno,
      year,
      month,
    },
  };

  return axios.request(config).then((response) => {
    return response;
  });
};

const mockRes = () =>
  Promise.resolve({ data: { StatusCode: 200, ResultSet: [] } });

const GetAttendanceCard = async (year, month, sno) =>
  GetAttendenceDetails({ year, month, sno });
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
