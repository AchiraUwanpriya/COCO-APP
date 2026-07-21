// import React, { useMemo } from "react";
// import { useSelector } from "react-redux";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import Checkbox from "@mui/material/Checkbox";
// import { Box, Grid, Typography } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import dayjs from "dayjs";
// import Loader from "../Utility/Loader";
// import NotFound from "../Utility/NotFound";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   "&.MuiTableCell-head": {
//     // backgroundColor: theme.palette.common.black,
//     backgroundColor: "#1976d2",
//     color: theme.palette.common.white,
//     fontSize: 12,
//     fontWeight: 600,
//     padding: "4px",
//     height: "30px",
//     lineHeight: "1",
//     borderRight: "1px solid #ddd",
//   },
//   "&.MuiTableCell-body": {
//     fontSize: 12,
//     color: "black",
//     padding: "2px 4px",
//     lineHeight: "1",
//     borderRight: "1px solid #ddd",
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ bgcolor }) => ({
//   backgroundColor: bgcolor || "inherit",
//   "& td, & th": {
//     backgroundColor: "inherit",
//     textAlign: "center",
//     padding: "2px 4px",
//     height: "30px",
//     borderBottom: "1px solid #ddd",
//   },
// }));

// export default function AttendanceCard() {
//   const { responseBody, loading, msg } = useSelector(
//     (state) => state.attendanceCard
//   );

//   const mappedItems = useMemo(() => {
//     return (
//       <TableContainer
//         component={Paper}
//         sx={{ width: "100%", overflowX: "auto" }}
//       >
//         <Table
//           sx={{ tableLayout: "fixed", width: "100%" }}
//           aria-label="attendance table"
//         >
//           <TableHead>
//             <TableRow>
//               <StyledTableCell
//                 align="center"
//                 rowSpan={2}
//                 sx={{ width: "20%", borderRight: "1px solid #ddd" }}
//               >
//                 Day
//               </StyledTableCell>
//               <StyledTableCell
//                 align="center"
//                 colSpan={3}
//                 sx={{ borderRight: "1px solid #ddd" }}
//               >
//                 Attendance
//               </StyledTableCell>
//               <StyledTableCell align="center" colSpan={2}>
//                 Vehicle
//               </StyledTableCell>
//             </TableRow>
//             <TableRow>
//               <StyledTableCell
//                 align="center"
//                 sx={{ width: "15%", borderRight: "1px solid #ddd" }}
//               >
//                 IN
//               </StyledTableCell>
//               <StyledTableCell
//                 align="center"
//                 sx={{ width: "5%", borderRight: "1px solid #ddd" }}
//               >
//                 C
//               </StyledTableCell>
//               <StyledTableCell
//                 align="center"
//                 sx={{ width: "15%", borderRight: "1px solid #ddd" }}
//               >
//                 OUT
//               </StyledTableCell>
//               <StyledTableCell
//                 align="center"
//                 sx={{ width: "15%", borderRight: "1px solid #ddd" }}
//               >
//                 IN
//               </StyledTableCell>
//               <StyledTableCell align="center" sx={{ width: "15%" }}>
//                 OUT
//               </StyledTableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {responseBody.map((row, index) => (
//               <StyledTableRow key={index} bgcolor={row.BackgroundColor}>
//                 <StyledTableCell
//                   component="th"
//                   scope="row"
//                   align="center"
//                   sx={{ borderRight: "1px solid #ddd" }}
//                 >
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       flexDirection: "column",
//                       justifyContent: "center",
//                       backgroundColor: "#B5E8FF",
//                       padding: "4px",
//                       borderRadius: 2,
//                       width: "100%",
//                       height: "30px",
//                     }}
//                   >
//                     <Typography
//                       fontSize={12}
//                       fontWeight={600}
//                       sx={{ color: "black", lineHeight: "1" }}
//                     >
//                       {new Date(row.Date).getDate()}
//                     </Typography>
//                     <Typography
//                       fontSize={9}
//                       fontWeight={600}
//                       sx={{ color: "black", lineHeight: "1" }}
//                     >
//                       {row.Day.toString().substring(0, 3)}
//                     </Typography>
//                   </Box>
//                 </StyledTableCell>

//                 {row.LeaveType !== "" ? (
//                   <StyledTableCell
//                     align="center"
//                     colSpan={5}
//                     sx={{
//                       fontWeight: "bold",
//                       fontSize: "14px",
//                       color: "black",
//                     }}
//                   >
//                     {row.LeaveReason}
//                   </StyledTableCell>
//                 ) : (
//                   <>
//                     <StyledTableCell
//                       align="center"
//                       sx={{ borderRight: "1px solid #ddd" }}
//                     >
//                       {row.InTime
//                         ? dayjs(row.InTime, "hh:mm A").format("HH:mm")
//                         : ""}
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="center"
//                       sx={{ borderRight: "1px solid #ddd" }}
//                     >
//                       {row.ContinuedStatus === "Y" ? (
//                         <Checkbox checked disabled />
//                       ) : (
//                         ""
//                       )}
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="center"
//                       sx={{ borderRight: "1px solid #ddd" }}
//                     >
//                       {row.OutTime
//                         ? dayjs(row.OutTime, "hh:mm A").format("HH:mm")
//                         : ""}
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="center"
//                       sx={{ borderRight: "1px solid #ddd" }}
//                     >
//                       {row.VIn && dayjs(row.VIn, ["hh:mm A", "HH:mm"]).isValid()
//                         ? dayjs(row.VIn, ["hh:mm A", "HH:mm"]).format("HH:mm")
//                         : ""}
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="center"
//                       sx={{ borderRight: "1px solid #ddd" }}
//                     >
//                       {row.VOut &&
//                       dayjs(row.VOut, ["hh:mm A", "HH:mm"]).isValid()
//                         ? dayjs(row.VOut, ["hh:mm A", "HH:mm"]).format("HH:mm")
//                         : ""}
//                     </StyledTableCell>
//                   </>
//                 )}
//               </StyledTableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     );
//   }, [responseBody]);

//   return loading ? (
//     <Loader />
//   ) : (
//     <Box sx={{ width: "100%" }}>
//       {responseBody.length > 0 ? mappedItems : <NotFound text={msg} />}
//     </Box>
//   );
// }

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import Loader from "../Utility/Loader";
import NotFound from "../Utility/NotFound";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    backgroundColor: "#1A5D28",
    color: theme.palette.common.white,
    fontSize: 12,
    fontWeight: 600,
    padding: "6px 8px",
    height: "32px",
    lineHeight: "1",
    borderRight: "1px solid rgba(255,255,255,0.2)",
  },
  "&.MuiTableCell-body": {
    fontSize: 12,
    color: "#333",
    padding: "4px 8px",
    lineHeight: "1",
    borderRight: "1px solid #e0e0e0",
  },
}));

const StyledTableRow = styled(TableRow)(({ iseven }) => ({
  backgroundColor: iseven === "true" ? "#f9fbe7" : "#ffffff",
  "&:hover": {
    backgroundColor: "#e8f5e9",
  },
  "& td, & th": {
    borderBottom: "1px solid #e0e0e0",
  },
}));

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
        sx={{ width: "100%", overflowX: "auto", borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Table sx={{ width: "100%", minWidth: 320 }} aria-label="attendance details table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" sx={{ width: "22%" }}>
                Date
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: "22%" }}>
                Service No
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: "28%" }}>
                IN
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: "28%", borderRight: "none" }}>
                OUT
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {listData.map((row, index) => {
              const rawDate =
                row.AttDate ||
                row.Date ||
                row.attDate ||
                row.date ||
                row.ATT_DATE ||
                row.Att_Date ||
                row.Adate ||
                row.adate;
              const attDate = rawDate ? dayjs(rawDate) : null;

              const dateLabel =
                attDate && attDate.isValid()
                  ? attDate.format("DD")
                  : rawDate
                  ? String(rawDate)
                  : "-";

              const dayLabel =
                attDate && attDate.isValid()
                  ? attDate.format("ddd")
                  : row.Day || row.day
                  ? String(row.Day || row.day).substring(0, 3)
                  : "";

              const isWeekend =
                attDate && attDate.isValid()
                  ? attDate.day() === 0 || attDate.day() === 6
                  : false;

              const serviceNo =
                row.Name ||
                row.name ||
                row.ServiceNo ||
                row.serviceNo ||
                row.Service_No ||
                row.SERVICE_NO ||
                row.Sno ||
                row.sno ||
                row.SNO ||
                row.EmpNo ||
                row.empNo ||
                "-";

              const inTimeVal =
                row.InTime ||
                row.inTime ||
                row.In_Time ||
                row.IN_TIME ||
                row.intime ||
                row.In ||
                row.in;

              const outTimeVal =
                row.OutTime ||
                row.outTime ||
                row.Out_Time ||
                row.OUT_TIME ||
                row.outtime ||
                row.Out ||
                row.out;

              const leaveReason =
                row.LeaveReason || row.leaveReason || row.LeaveType || row.leaveType;

              const formatTime = (t) => {
                if (!t) return null;
                const str = String(t).trim();
                if (!str) return null;
                const parsed = dayjs(str, ["hh:mm A", "HH:mm", "YYYY-MM-DDTHH:mm:ss"]);
                return parsed.isValid() ? parsed.format("HH:mm") : str;
              };

              const formattedIn = formatTime(inTimeVal);
              const formattedOut = formatTime(outTimeVal);

              return (
                <StyledTableRow key={index} iseven={(index % 2 === 0).toString()}>
                  {/* Date Cell */}
                  <StyledTableCell component="th" scope="row" align="center">
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isWeekend ? "#ffecb3" : "#e3f2fd",
                        borderRadius: 1.5,
                        py: 0.4,
                        px: 0.5,
                      }}
                    >
                      <Typography
                        fontSize={13}
                        fontWeight={700}
                        sx={{ color: isWeekend ? "#e65100" : "#1565c0", lineHeight: 1 }}
                      >
                        {dateLabel}
                      </Typography>
                      {dayLabel && (
                        <Typography
                          fontSize={9}
                          fontWeight={600}
                          sx={{ color: isWeekend ? "#bf360c" : "#1976d2", lineHeight: 1, mt: 0.2 }}
                        >
                          {dayLabel}
                        </Typography>
                      )}
                    </Box>
                  </StyledTableCell>

                  {/* Service No / Name */}
                  <StyledTableCell align="center">
                    <Typography fontSize={11} fontWeight={600} color="#1A5D28">
                      {serviceNo}
                    </Typography>
                  </StyledTableCell>

                  {/* IN Time / Leave Reason */}
                  {leaveReason && !formattedIn && !formattedOut ? (
                    <StyledTableCell align="center" colSpan={2} sx={{ borderRight: "none" }}>
                      <Typography fontSize={11} fontWeight={600} color="#d32f2f">
                        {leaveReason}
                      </Typography>
                    </StyledTableCell>
                  ) : (
                    <>
                      {/* IN Time */}
                      <StyledTableCell align="center">
                        {formattedIn ? (
                          <Chip
                            label={formattedIn}
                            size="small"
                            sx={{
                              fontSize: 11,
                              fontWeight: 600,
                              backgroundColor: "#e8f5e9",
                              color: "#1A5D28",
                              height: 20,
                            }}
                          />
                        ) : (
                          <Typography fontSize={11} color="#bbb">—</Typography>
                        )}
                      </StyledTableCell>

                      {/* OUT Time */}
                      <StyledTableCell align="center" sx={{ borderRight: "none" }}>
                        {formattedOut ? (
                          <Chip
                            label={formattedOut}
                            size="small"
                            sx={{
                              fontSize: 11,
                              fontWeight: 600,
                              backgroundColor: "#fce4ec",
                              color: "#c62828",
                              height: 20,
                            }}
                          />
                        ) : (
                          <Typography fontSize={11} color="#bbb">—</Typography>
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
  }, [listData]);

  return loading ? (
    <Loader />
  ) : (
    <Box sx={{ width: "100%", mt: 1 }}>
      {listData && listData.length > 0 ? tableContent : <NotFound text={msg} />}
    </Box>
  );
}
