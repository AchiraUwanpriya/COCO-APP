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
  let fromDate = undefined;

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

    // If a specific day was selected, fromDate is provided (YYYY-MM-DD)
    if (adate.fromDate) {
      fromDate = adate.fromDate;
    } else {
      year = adate.year || adate.Year || year;
      month = adate.month || adate.Month || month;
    }
  } else if (adate) {
    const formatted = dayjs(adate).isValid() ? dayjs(adate) : null;
    if (formatted) {
      fromDate = formatted.format("YYYY-MM-DD");
    }
  }

  const today = dayjs();

  sno = sno ? String(sno).trim() : "";

  let params;
  if (fromDate) {
    // Single-day query → ?fromDate=2026-07-22
    params = { sno, fromDate };
  } else {
    // Month-range query → ?year=2026&month=07
    if (!year) year = today.format("YYYY");
    if (!month) month = today.format("MM");
    if (month && String(month).length === 1) {
      month = `0${month}`;
    }
    params = { sno, year, month };
  }

  const config = {
    method: "get",
    url: "/Attendence/GetFilterdAttendenceDetails",
    params,
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
