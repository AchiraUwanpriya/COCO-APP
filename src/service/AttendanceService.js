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

const mockRes = (data = []) =>
  Promise.resolve({ data: { StatusCode: 200, ResultSet: data } });

const mockAllAttendance = [
  { Type: "CDPLC", ActualStrength: 2450, EligibleStrength: 2380, Attendance: 2150 },
  { Type: "Sub (Local)", ActualStrength: 1200, EligibleStrength: 1150, Attendance: 980 },
  { Type: "Sub (Foreign)", ActualStrength: 450, EligibleStrength: 430, Attendance: 390 },
  { Type: "Trainee(NAITA)", ActualStrength: 320, EligibleStrength: 310, Attendance: 285 },
  { Type: "Trainee (Other)", ActualStrength: 180, EligibleStrength: 175, Attendance: 150 },
  { Type: "KRY Site", ActualStrength: 260, EligibleStrength: 250, Attendance: 230 }
];

const mockCDLCategoryAtt = [
  { Type: "EXECUTIVE", EligibleStrength: 420, Attendance: 395, ActualPercentage: 94, EligiblePercentage: 94 },
  { Type: "SUPERVISORY", EligibleStrength: 680, Attendance: 620, ActualPercentage: 91, EligiblePercentage: 91 },
  { Type: "CLERICAL", EligibleStrength: 350, Attendance: 310, ActualPercentage: 88, EligiblePercentage: 88 },
  { Type: "SKILLED", EligibleStrength: 930, Attendance: 825, ActualPercentage: 88, EligiblePercentage: 88 },
  { Type: "SEMI SKILLED", EligibleStrength: 320, Attendance: 280, ActualPercentage: 87, EligiblePercentage: 87 },
  { Type: "TOTAL", EligibleStrength: 2700, Attendance: 2430, ActualPercentage: 90, EligiblePercentage: 90 }
];

const mockCdlBasedDivision = [
  {
    HLD_DIV_CODE: "SHIP REPAIR",
    STRENGTH_EXECUTIVE: 150, ATTENDANCE_EXECUTIVE: 140, PERCENTAGE_EXECUTIVE: 93.3,
    STRENGTH_SUPERVISORY: 220, ATTENDANCE_SUPERVISORY: 205, PERCENTAGE_SUPERVISORY: 93.1,
    STRENGTH_CLERICAL: 80
  },
  {
    HLD_DIV_CODE: "SHIP BUILDING",
    STRENGTH_EXECUTIVE: 130, ATTENDANCE_EXECUTIVE: 120, PERCENTAGE_EXECUTIVE: 92.3,
    STRENGTH_SUPERVISORY: 190, ATTENDANCE_SUPERVISORY: 175, PERCENTAGE_SUPERVISORY: 92.1,
    STRENGTH_CLERICAL: 70
  },
  {
    HLD_DIV_CODE: "OFFSHORE & ENG",
    STRENGTH_EXECUTIVE: 90, ATTENDANCE_EXECUTIVE: 82, PERCENTAGE_EXECUTIVE: 91.1,
    STRENGTH_SUPERVISORY: 140, ATTENDANCE_SUPERVISORY: 128, PERCENTAGE_SUPERVISORY: 91.4,
    STRENGTH_CLERICAL: 40
  },
  {
    HLD_DIV_CODE: "YARD DEV",
    STRENGTH_EXECUTIVE: 50, ATTENDANCE_EXECUTIVE: 45, PERCENTAGE_EXECUTIVE: 90.0,
    STRENGTH_SUPERVISORY: 80, ATTENDANCE_SUPERVISORY: 72, PERCENTAGE_SUPERVISORY: 90.0,
    STRENGTH_CLERICAL: 30
  }
];

const mockTraineeBasedTypes = [
  { type: "NAITA Trainees", strength: 180, attendance: 165 },
  { type: "Engineering Undergraduates", strength: 90, attendance: 84 },
  { type: "Technical Apprentices", strength: 120, attendance: 108 },
  { type: "Management Trainees", strength: 40, attendance: 38 },
  { type: "Vocational Trainees", strength: 70, attendance: 60 }
];

const mockTraineeDivisionAttendance = [
  {
    HLD_DIV_CODE: "SHIP REPAIR",
    STRENGTH_INDUSTRIAL: 120, ATTENDANCE_INDUSTRIAL: 110, PERCENTAGE_INDUSTRIAL: 91.6,
    STRENGTH_CLERICAL: 30, ATTENDANCE_CLERICAL: 28, PERCENTAGE_CLERICAL: 93.3
  },
  {
    HLD_DIV_CODE: "SHIP BUILDING",
    STRENGTH_INDUSTRIAL: 100, ATTENDANCE_INDUSTRIAL: 92, PERCENTAGE_INDUSTRIAL: 92.0,
    STRENGTH_CLERICAL: 25, ATTENDANCE_CLERICAL: 23, PERCENTAGE_CLERICAL: 92.0
  },
  {
    HLD_DIV_CODE: "OFFSHORE & ENG",
    STRENGTH_INDUSTRIAL: 80, ATTENDANCE_INDUSTRIAL: 72, PERCENTAGE_INDUSTRIAL: 90.0,
    STRENGTH_CLERICAL: 15, ATTENDANCE_CLERICAL: 14, PERCENTAGE_CLERICAL: 93.3
  },
  {
    HLD_DIV_CODE: "YARD DEV",
    STRENGTH_INDUSTRIAL: 50, ATTENDANCE_INDUSTRIAL: 44, PERCENTAGE_INDUSTRIAL: 88.0,
    STRENGTH_CLERICAL: 10, ATTENDANCE_CLERICAL: 9, PERCENTAGE_CLERICAL: 90.0
  }
];

const mockCDLWeekAttendance = [
  { AttDate: "2026-07-17", DayName: "Fri", Attendance: 2100, Eligible: 2380 },
  { AttDate: "2026-07-18", DayName: "Sat", Attendance: 1850, Eligible: 2380 },
  { AttDate: "2026-07-19", DayName: "Sun", Attendance: 1200, Eligible: 2380 },
  { AttDate: "2026-07-20", DayName: "Mon", Attendance: 2250, Eligible: 2380 },
  { AttDate: "2026-07-21", DayName: "Tue", Attendance: 2280, Eligible: 2380 },
  { AttDate: "2026-07-22", DayName: "Wed", Attendance: 2200, Eligible: 2380 },
  { AttDate: "2026-07-23", DayName: "Thu", Attendance: 2150, Eligible: 2380 }
];

const mockOTEntered = [
  { live_employee: 2150, ot_entered: 1420, duty_off: 230 }
];

const mockOTEmployees = [
  { servidce_no: "0004086", name: "A.B. Perera", dep: "Senior Engineer", loc: "Dock 1", div: "Ship Repair", start_time: "2026-07-23T17:00:00" },
  { servidce_no: "0003595", name: "K.L. Fernando", dep: "Technician", loc: "Workshop", div: "Ship Building", start_time: "2026-07-23T17:30:00" },
  { servidce_no: "0002810", name: "M.N. Silva", dep: "Supervisor", loc: "Dock 2", div: "Ship Repair", start_time: "2026-07-23T17:00:00" }
];

const mockDutyOffEmployees = [
  { servidce_no: "0001920", name: "S.T. Jayasinghe", dep: "Inspector", loc: "Yard A", div: "Yard Development" },
  { servidce_no: "0001540", name: "W.P. De Silva", dep: "Officer", loc: "Main Office", div: "Offshore" }
];

const GetAttendanceCard = async (year, month, sno) =>
  GetAttendenceDetails({ year, month, sno });
const GetCdlBasedDivison = async (mcvDate, hadDate) => mockRes(mockCdlBasedDivision);
const GetTraineeBasedTypes = async (hadDate) => mockRes(mockTraineeBasedTypes);
const GetTraineeDivisionAttendance = async (mcvDate, hadDate) => mockRes(mockTraineeDivisionAttendance);
const GetAllAttendance = async (mcvDate, hadDate) => mockRes(mockAllAttendance);
const GetCDLWeekAttendance = async (hadDate) => mockRes(mockCDLWeekAttendance);
const GetCDLMonthlyAttendance = async () => mockRes(mockCDLWeekAttendance);
const GetCDLYearlyAttendance = async () => mockRes(mockCDLWeekAttendance);
const GetCDLCategoryAtt = async (hadDate) => {
  let dateStr = dayjs().format("YYYY-MM-DD");
  if (hadDate) {
    if (typeof hadDate === "string") {
      dateStr = hadDate.split("T")[0];
    } else if (dayjs.isDayjs(hadDate) || hadDate instanceof Date) {
      dateStr = dayjs(hadDate).format("YYYY-MM-DD");
    }
  }

  const config = {
    method: "get",
    url: "/AttendanceDashbaordController/GetbasedonCategory",
    params: { Date: dateStr },
  };
  return axios.request(config);
};
const GetOTEntered = async () => mockRes(mockOTEntered);
const GetCDLOTEmployee = async () => mockRes(mockOTEmployees);
const GetCDLDutyoffEmployee = async () => mockRes(mockDutyOffEmployees);
const GetsubOrderingAttendanceCard = async (month, sno) => mockRes([]);

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
