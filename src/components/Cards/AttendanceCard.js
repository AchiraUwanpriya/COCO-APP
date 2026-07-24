import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import Loader from "../Utility/Loader";
import NotFound from "../Utility/NotFound";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    backgroundColor: "#1A5D28",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 700,
    padding: "4px 4px",
    lineHeight: "1.2",
    textAlign: "center",
    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
    boxSizing: "border-box",
    "&:last-child": {
      borderRight: "none",
    },
  },
  "&.MuiTableCell-body": {
    fontSize: 13,
    color: "#1e293b",
    padding: "8px 6px",
    lineHeight: "1.2",
    textAlign: "center",
    borderRight: "1px solid #e2e8f0",
    borderBottom: "1px solid #e2e8f0",
    "&:last-child": {
      borderRight: "none",
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ issat, issun, istoday }) => {
  let bgColor = "#ffffff";
  if (istoday === "true") {
    bgColor = "#e8f5e9";
  } else if (issun === "true") {
    bgColor = "#e8f2e8";
  } else if (issat === "true") {
    bgColor = "#f4f9f4";
  }

  return {
    backgroundColor: bgColor,
    borderLeft: istoday === "true" ? "4px solid #1A5D28" : "none",
    transition: "background-color 0.15s ease",
    "&:hover": {
      backgroundColor: istoday === "true" ? "#c8e6c9" : issun === "true" ? "#dceddc" : issat === "true" ? "#e4f2e4" : "#f8fafc",
    },
    "& td, & th": {
      backgroundColor: "inherit",
    },
  };
});

export default function AttendanceCard({ searchQuery = "", year, month }) {
  const { attendenceDetails, responseBody, loading, msg } = useSelector(
    (state) => state.attendanceCard
  );

  const listData = useMemo(() => {
    if (Array.isArray(attendenceDetails) && attendenceDetails.length > 0) {
      return attendenceDetails;
    }
    if (Array.isArray(responseBody) && responseBody.length > 0) {
      return responseBody;
    }
    return [];
  }, [attendenceDetails, responseBody]);

  const filteredData = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return listData;
    const q = searchQuery.trim().toLowerCase();
    return listData.filter((item) => {
      const sno = String(
        item.ServiceNo ||
        item.serviceNo ||
        item.Service_No ||
        item.Service_no ||
        item.SERVICE_NO ||
        item.ServiceNumber ||
        item.serviceNumber ||
        item.ServNo ||
        item.servNo ||
        item.Sno ||
        item.sno ||
        item.SNO ||
        item.EmpNo ||
        item.empNo ||
        ""
      ).toLowerCase();
      const name = String(
        item.Name ||
        item.name ||
        item.EmpName ||
        item.empName ||
        item.EmployeeName ||
        item.employeeName ||
        item.NAME ||
        ""
      ).toLowerCase();
      const div = String(item.Division || item.div || item.Department || item.dep || "").toLowerCase();
      return sno.includes(q) || name.includes(q) || div.includes(q);
    });
  }, [listData, searchQuery]);

  // Helper to parse date info from an API item
  const getItemDateInfo = (row) => {
    if (!row) return null;
    const rawDate =
      row.Date ||
      row.AttDate ||
      row.attDate ||
      row.date ||
      row.ATT_DATE ||
      row.Att_Date ||
      row.Adate ||
      row.adate;

    if (!rawDate) return null;
    const parsed = dayjs(rawDate);
    if (parsed.isValid()) {
      return {
        dayNum: parsed.date(),
        monthNum: parsed.month() + 1,
        yearNum: parsed.year(),
        dayName: parsed.format("ddd").toUpperCase(),
      };
    }
    const num = Number(rawDate);
    if (!isNaN(num) && num >= 1 && num <= 31) {
      return {
        dayNum: num,
        monthNum: null,
        yearNum: null,
        dayName: (row.Day || row.day || "").toString().substring(0, 3).toUpperCase(),
      };
    }
    return null;
  };

  // Generate rows for all dates of the month (1 to 28..31), identifying Today's date
  const monthRows = useMemo(() => {
    let targetYear = year;
    let targetMonth = month;

    if (!targetYear || !targetMonth) {
      for (const item of listData) {
        const info = getItemDateInfo(item);
        if (info && info.yearNum && info.monthNum) {
          targetYear = String(info.yearNum);
          targetMonth = String(info.monthNum).padStart(2, "0");
          break;
        }
      }
    }

    if (!targetYear) targetYear = dayjs().format("YYYY");
    if (!targetMonth) targetMonth = dayjs().format("MM");

    const formattedMonth = String(targetMonth).padStart(2, "0");
    const totalDays = dayjs(`${targetYear}-${formattedMonth}-01`).daysInMonth() || 31;

    const today = dayjs();
    const todayDayNum = today.date();
    const todayMonthNum = today.month() + 1;
    const todayYearNum = today.year();

    const isCurrentMonthYear =
      Number(targetYear) === todayYearNum &&
      Number(targetMonth) === todayMonthNum;

    // Group filtered items by day number (1..totalDays)
    const itemsByDay = {};
    filteredData.forEach((item) => {
      const info = getItemDateInfo(item);
      const dNum = info ? info.dayNum : null;
      if (dNum && dNum >= 1 && dNum <= totalDays) {
        if (!itemsByDay[dNum]) itemsByDay[dNum] = [];
        itemsByDay[dNum].push(item);
      }
    });

    const resultRows = [];

    for (let d = 1; d <= totalDays; d++) {
      const currentDate = dayjs(`${targetYear}-${formattedMonth}-${String(d).padStart(2, "0")}`);
      const isValidDate = currentDate.isValid();
      const dayName = isValidDate
        ? currentDate.format("ddd").toUpperCase()
        : "";
      const isSat = isValidDate ? currentDate.day() === 6 : false;
      const isSun = isValidDate ? currentDate.day() === 0 : false;
      const isToday = isCurrentMonthYear && d === todayDayNum;

      const dayItems = itemsByDay[d];

      if (dayItems && dayItems.length > 0) {
        dayItems.forEach((item) => {
          resultRows.push({
            dateNum: d,
            dayName,
            isSat,
            isSun,
            isToday,
            apiRecord: item,
            hasData: true,
          });
        });
      } else {
        resultRows.push({
          dateNum: d,
          dayName,
          isSat,
          isSun,
          isToday,
          apiRecord: null,
          hasData: false,
        });
      }
    }

    return resultRows;
  }, [filteredData, listData, year, month]);

  const tableContent = useMemo(() => {
    if (!monthRows || monthRows.length === 0) return null;

    return (
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: "100%",
          maxHeight: 420,
          overflowY: "auto",
          overflowX: "auto",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0",
        }}
      >
        <Table stickyHeader sx={{ width: "100%", minWidth: 320, tableLayout: "fixed" }} aria-label="attendance table">
          <TableHead>
            <TableRow sx={{ height: "28px" }}>
              <StyledTableCell align="center" rowSpan={2} sx={{ width: "20%", top: 0, zIndex: 4, height: "56px" }}>
                Day
              </StyledTableCell>
              <StyledTableCell align="center" rowSpan={2} sx={{ width: "30%", top: 0, zIndex: 4, height: "56px" }}>
                Service No
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={2} sx={{ width: "50%", top: 0, zIndex: 4, height: "28px" }}>
                Attendance
              </StyledTableCell>
            </TableRow>
            <TableRow sx={{ height: "28px" }}>
              <StyledTableCell align="center" sx={{ width: "25%", top: "28px", zIndex: 3, height: "28px" }}>
                IN
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: "25%", top: "28px", zIndex: 3, height: "28px" }}>
                OUT
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {monthRows.map((rowItem, index) => {
              const { dateNum, dayName, isSat, isSun, isToday, apiRecord, hasData } = rowItem;

              let serviceNo = "-";
              let inTime = "";
              let outTime = "";
              let leaveReason = null;

              if (hasData && apiRecord) {
                serviceNo =
                  apiRecord.ServiceNo ||
                  apiRecord.serviceNo ||
                  apiRecord.Service_No ||
                  apiRecord.Service_no ||
                  apiRecord.SERVICE_NO ||
                  apiRecord.ServiceNumber ||
                  apiRecord.serviceNumber ||
                  apiRecord.ServNo ||
                  apiRecord.servNo ||
                  apiRecord.Sno ||
                  apiRecord.sno ||
                  apiRecord.SNO ||
                  apiRecord.EmpNo ||
                  apiRecord.empNo ||
                  apiRecord.Emp_No ||
                  apiRecord.EMP_NO ||
                  apiRecord.Name ||
                  apiRecord.name ||
                  apiRecord.EmpName ||
                  apiRecord.empName ||
                  apiRecord.EmployeeName ||
                  apiRecord.employeeName ||
                  apiRecord.NAME ||
                  "-";

                const formatTime = (t) => {
                  if (!t || t === "—" || t === null) return "";
                  const str = String(t).trim();
                  if (!str || str === "—") return "";
                  const parsed = dayjs(str, ["hh:mm A", "HH:mm", "HH:mm:ss", "YYYY-MM-DDTHH:mm:ss"]);
                  return parsed.isValid() ? parsed.format("HH:mm") : str;
                };

                inTime = formatTime(
                  apiRecord.InTime || apiRecord.inTime || apiRecord.In_Time || apiRecord.IN_TIME || apiRecord.intime || apiRecord.In || apiRecord.in
                );

                outTime = formatTime(
                  apiRecord.OutTime || apiRecord.outTime || apiRecord.Out_Time || apiRecord.OUT_TIME || apiRecord.outtime || apiRecord.Out || apiRecord.out
                );

                leaveReason =
                  apiRecord.LeaveReason ||
                  apiRecord.leaveReason ||
                  apiRecord.LeaveType ||
                  apiRecord.leaveType ||
                  apiRecord.Leave_Reason;
              }

              return (
                <StyledTableRow
                  key={index}
                  issat={isSat.toString()}
                  issun={isSun.toString()}
                  istoday={isToday.toString()}
                >
                  {/* Day Column */}
                  <StyledTableCell component="th" scope="row" align="center">
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isToday ? "#1A5D28" : "#e8f5e9",
                        border: isToday ? "1px solid #1A5D28" : "1px solid #c8e6c9",
                        borderRadius: "8px",
                        py: 0.4,
                        px: 0.8,
                        mx: "auto",
                        maxWidth: "54px",
                        boxShadow: isToday ? "0 2px 6px rgba(26, 93, 40, 0.35)" : "none",
                      }}
                    >
                      <Typography
                        fontSize={13}
                        fontWeight={700}
                        sx={{ color: isToday ? "#ffffff" : "#1A5D28", lineHeight: 1 }}
                      >
                        {dateNum}
                      </Typography>
                      {dayName && (
                        <Typography
                          fontSize={8}
                          fontWeight={700}
                          sx={{ color: isToday ? "#ffffff" : "#2e7d32", lineHeight: 1, mt: "2px" }}
                        >
                          {isToday ? "TODAY" : dayName}
                        </Typography>
                      )}
                    </Box>
                  </StyledTableCell>

                  {/* Service No */}
                  <StyledTableCell align="center">
                    <Typography fontSize={13} fontWeight={isToday ? 700 : 600} color="#1e293b">
                      {serviceNo}
                    </Typography>
                  </StyledTableCell>

                  {/* Leave Reason or IN / OUT */}
                  {leaveReason && !inTime && !outTime ? (
                    <StyledTableCell
                      align="center"
                      colSpan={2}
                      sx={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#c62828",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#ffebee",
                          color: "#c62828",
                          fontWeight: 700,
                          py: 0.3,
                          px: 1,
                          borderRadius: "6px",
                          display: "inline-block",
                          fontSize: 12,
                        }}
                      >
                        {leaveReason}
                      </Box>
                    </StyledTableCell>
                  ) : (
                    <>
                      {/* Attendance IN */}
                      <StyledTableCell align="center">
                        {inTime ? (
                          <Box
                            sx={{
                              backgroundColor: "#e8f5e9",
                              color: "#1b5e20",
                              fontWeight: 700,
                              py: 0.3,
                              px: 1,
                              borderRadius: "6px",
                              display: "inline-block",
                              fontSize: 12,
                            }}
                          >
                            {inTime}
                          </Box>
                        ) : (
                          "—"
                        )}
                      </StyledTableCell>

                      {/* Attendance OUT */}
                      <StyledTableCell align="center">
                        {outTime ? (
                          <Box
                            sx={{
                              backgroundColor: "#e3f2fd",
                              color: "#0d47a1",
                              fontWeight: 700,
                              py: 0.3,
                              px: 1,
                              borderRadius: "6px",
                              display: "inline-block",
                              fontSize: 12,
                            }}
                          >
                            {outTime}
                          </Box>
                        ) : (
                          "—"
                        )}
                      </StyledTableCell>
                    </>
                  )}
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }, [monthRows]);

  return loading ? (
    <Loader />
  ) : (
    <Box sx={{ width: "100%", mt: 1 }}>
      {monthRows && monthRows.length > 0 ? (
        tableContent
      ) : (
        <NotFound text={msg || (searchQuery ? "No matching records found" : undefined)} />
      )}
    </Box>
  );
}
