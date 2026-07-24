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
    backgroundColor: theme.palette.primary.main || "#1976d2",
    color: theme.palette.common.white,
    fontSize: 13,
    fontWeight: 700,
    padding: "6px 4px",
    lineHeight: "1.2",
    textAlign: "center",
    borderRight: "1px solid rgba(255, 255, 255, 0.3)",
    "&:last-child": {
      borderRight: "none",
    },
  },
  "&.MuiTableCell-body": {
    fontSize: 13,
    color: "#000000",
    padding: "6px 4px",
    lineHeight: "1.2",
    textAlign: "center",
    borderRight: "1px solid #e0e0e0",
    borderBottom: "1px solid #e0e0e0",
    "&:last-child": {
      borderRight: "none",
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ issat, issun }) => {
  let bgColor = "#ffffff";
  if (issun === "true") {
    bgColor = "#dce4f7";
  } else if (issat === "true") {
    bgColor = "#ebf2fc";
  }

  return {
    backgroundColor: bgColor,
    "&:hover": {
      backgroundColor: issun === "true" ? "#d0dbf5" : issat === "true" ? "#e1ebfa" : "#f5f5f5",
    },
    "& td, & th": {
      backgroundColor: "inherit",
    },
  };
});

export default function AttendanceCard() {
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

  const tableContent = useMemo(() => {
    if (!listData || listData.length === 0) return null;

    return (
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          overflowX: "auto",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e0e0e0",
        }}
      >
        <Table sx={{ width: "100%", minWidth: 320, tableLayout: "fixed" }} aria-label="attendance table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" rowSpan={2} sx={{ width: "20%" }}>
                Day
              </StyledTableCell>
              <StyledTableCell align="center" rowSpan={2} sx={{ width: "30%" }}>
                Service No
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={2} sx={{ width: "50%" }}>
                Attendance
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell align="center" sx={{ width: "25%" }}>
                IN
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: "25%" }}>
                OUT
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {listData.map((row, index) => {
              const rawDate =
                row.Date ||
                row.AttDate ||
                row.attDate ||
                row.date ||
                row.ATT_DATE ||
                row.Att_Date ||
                row.Adate ||
                row.adate;

              const attDate = rawDate ? dayjs(rawDate) : null;
              const isValidDate = attDate && attDate.isValid();

              const dateNum = isValidDate
                ? attDate.format("D")
                : rawDate
                ? String(rawDate)
                : "-";

              const dayName = isValidDate
                ? attDate.format("ddd").toUpperCase()
                : row.Day || row.day
                ? String(row.Day || row.day).substring(0, 3).toUpperCase()
                : "";

              const isSat = isValidDate
                ? attDate.day() === 6
                : dayName.includes("SAT");

              const isSun = isValidDate
                ? attDate.day() === 0
                : dayName.includes("SUN");

              const serviceNo =
                row.ServiceNo ||
                row.serviceNo ||
                row.Service_No ||
                row.Service_no ||
                row.SERVICE_NO ||
                row.ServiceNumber ||
                row.serviceNumber ||
                row.ServNo ||
                row.servNo ||
                row.Sno ||
                row.sno ||
                row.SNO ||
                row.EmpNo ||
                row.empNo ||
                row.Emp_No ||
                row.EMP_NO ||
                row.Name ||
                row.name ||
                row.EmpName ||
                row.empName ||
                row.EmployeeName ||
                row.employeeName ||
                row.NAME ||
                "-";

              const formatTime = (t) => {
                if (!t || t === "—" || t === null) return "";
                const str = String(t).trim();
                if (!str || str === "—") return "";
                const parsed = dayjs(str, ["hh:mm A", "HH:mm", "HH:mm:ss", "YYYY-MM-DDTHH:mm:ss"]);
                return parsed.isValid() ? parsed.format("HH:mm") : str;
              };

              const inTime = formatTime(
                row.InTime || row.inTime || row.In_Time || row.IN_TIME || row.intime || row.In || row.in
              );

              const outTime = formatTime(
                row.OutTime || row.outTime || row.Out_Time || row.OUT_TIME || row.outtime || row.Out || row.out
              );

              const leaveReason =
                row.LeaveReason ||
                row.leaveReason ||
                row.LeaveType ||
                row.leaveType ||
                row.Leave_Reason;

              return (
                <StyledTableRow
                  key={index}
                  issat={isSat.toString()}
                  issun={isSun.toString()}
                >
                  {/* Day Column */}
                  <StyledTableCell component="th" scope="row" align="center">
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#B5E8FF",
                        borderRadius: "8px",
                        py: 0.4,
                        px: 0.8,
                        mx: "auto",
                        maxWidth: "54px",
                      }}
                    >
                      <Typography
                        fontSize={13}
                        fontWeight={700}
                        sx={{ color: "#000000", lineHeight: 1 }}
                      >
                        {dateNum}
                      </Typography>
                      {dayName && (
                        <Typography
                          fontSize={9}
                          fontWeight={700}
                          sx={{ color: "#000000", lineHeight: 1, mt: "2px" }}
                        >
                          {dayName}
                        </Typography>
                      )}
                    </Box>
                  </StyledTableCell>

                  {/* Service No */}
                  <StyledTableCell align="center">
                    <Typography fontSize={12} fontWeight={600} color="#000000">
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
                        color: "#000000",
                      }}
                    >
                      {leaveReason}
                    </StyledTableCell>
                  ) : (
                    <>
                      {/* Attendance IN */}
                      <StyledTableCell align="center">{inTime}</StyledTableCell>

                      {/* Attendance OUT */}
                      <StyledTableCell align="center">{outTime}</StyledTableCell>
                    </>
                  )}
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }, [listData]);

  return loading ? (
    <Loader />
  ) : (
    <Box sx={{ width: "100%", mt: 1 }}>
      {listData && listData.length > 0 ? tableContent : <NotFound text={msg} />}
    </Box>
  );
}
