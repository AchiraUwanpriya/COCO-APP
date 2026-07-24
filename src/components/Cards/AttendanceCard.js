import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import Loader from "../Utility/Loader";
import NotFound from "../Utility/NotFound";

// MUI Icons
import PeopleIcon from "@mui/icons-material/People";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import GridViewIcon from "@mui/icons-material/GridView";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BadgeIcon from "@mui/icons-material/Badge";

// Styled Components for Monthly Table (Individual View)
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
      backgroundColor:
        istoday === "true"
          ? "#c8e6c9"
          : issun === "true"
          ? "#dceddc"
          : issat === "true"
          ? "#e4f2e4"
          : "#f8fafc",
    },
    "& td, & th": {
      backgroundColor: "inherit",
    },
  };
});

// Helper: Format raw time string to readable format (e.g., 08:30 AM)
const formatTime = (t) => {
  if (!t || t === "—" || t === null) return "";
  const str = String(t).trim();
  if (!str || str === "—") return "";
  const parsed = dayjs(str, [
    "hh:mm A",
    "HH:mm",
    "HH:mm:ss",
    "YYYY-MM-DDTHH:mm:ss",
  ]);
  return parsed.isValid() ? parsed.format("hh:mm A") : str;
};

// Helper: Calculate shift duration
const calculateDuration = (rawIn, rawOut) => {
  if (!rawIn || !rawOut) return null;
  const parseIn = dayjs(String(rawIn).trim(), [
    "hh:mm A",
    "HH:mm",
    "HH:mm:ss",
    "YYYY-MM-DDTHH:mm:ss",
  ]);
  const parseOut = dayjs(String(rawOut).trim(), [
    "hh:mm A",
    "HH:mm",
    "HH:mm:ss",
    "YYYY-MM-DDTHH:mm:ss",
  ]);
  if (!parseIn.isValid() || !parseOut.isValid()) return null;
  let diffMin = parseOut.diff(parseIn, "minute");
  if (diffMin < 0) diffMin += 24 * 60;
  const hrs = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  if (hrs === 0 && mins === 0) return null;
  return `${hrs}h ${mins}m`;
};

// Helper: Standardize item property extraction
const parseRecord = (item) => {
  if (!item) return {};

  const serviceNo = String(
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
      item.Emp_No ||
      item.EMP_NO ||
      "-"
  );

  const name = String(
    item.Name ||
      item.name ||
      item.EmpName ||
      item.empName ||
      item.EmployeeName ||
      item.employeeName ||
      item.NAME ||
      ""
  );

  const division = String(
    item.Division ||
      item.div ||
      item.Department ||
      item.dep ||
      item.DIV ||
      item.DEP ||
      item.DepartmentName ||
      ""
  );

  const rawIn =
    item.InTime ||
    item.inTime ||
    item.In_Time ||
    item.IN_TIME ||
    item.intime ||
    item.In ||
    item.in;

  const rawOut =
    item.OutTime ||
    item.outTime ||
    item.Out_Time ||
    item.OUT_TIME ||
    item.outtime ||
    item.Out ||
    item.out;

  const inTime = formatTime(rawIn);
  const outTime = formatTime(rawOut);

  const leaveReason =
    item.LeaveReason ||
    item.leaveReason ||
    item.LeaveType ||
    item.leaveType ||
    item.Leave_Reason ||
    null;

  let status = "NOT_CHECKED_IN";
  if (leaveReason) {
    status = "ON_LEAVE";
  } else if (inTime && outTime) {
    status = "CHECKED_OUT";
  } else if (inTime) {
    status = "CHECKED_IN";
  }

  return {
    raw: item,
    serviceNo,
    name,
    division,
    inTime,
    outTime,
    leaveReason,
    status,
    duration: calculateDuration(rawIn, rawOut),
  };
};

// Generate initials for employee avatar
const getInitials = (name, serviceNo) => {
  if (name && name.trim()) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  if (serviceNo && serviceNo !== "-") {
    return serviceNo.substring(0, 2).toUpperCase();
  }
  return "EM";
};

export default function AttendanceCard({
  searchQuery = "",
  year,
  month,
  isTodayView = false,
}) {
  const { attendenceDetails, responseBody, loading, msg } = useSelector(
    (state) => state.attendanceCard
  );

  // Status Filter State for Today View: "ALL" | "CHECKED_IN" | "CHECKED_OUT" | "ON_LEAVE"
  const [statusFilter, setStatusFilter] = useState("ALL");

  const listData = useMemo(() => {
    if (Array.isArray(attendenceDetails) && attendenceDetails.length > 0) {
      return attendenceDetails;
    }
    if (Array.isArray(responseBody) && responseBody.length > 0) {
      return responseBody;
    }
    return [];
  }, [attendenceDetails, responseBody]);

  // Filtered by Search Query
  const filteredData = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return listData;
    const q = searchQuery.trim().toLowerCase();
    return listData.filter((item) => {
      const rec = parseRecord(item);
      return (
        rec.serviceNo.toLowerCase().includes(q) ||
        rec.name.toLowerCase().includes(q) ||
        rec.division.toLowerCase().includes(q)
      );
    });
  }, [listData, searchQuery]);

  // Today View parsed records & summary counts
  const parsedRecords = useMemo(() => {
    return filteredData.map(parseRecord);
  }, [filteredData]);

  const summaryCounts = useMemo(() => {
    return {
      total: parsedRecords.length,
      checkedIn: parsedRecords.filter((r) => r.status === "CHECKED_IN").length,
      checkedOut: parsedRecords.filter((r) => r.status === "CHECKED_OUT").length,
      onLeave: parsedRecords.filter((r) => r.status === "ON_LEAVE").length,
    };
  }, [parsedRecords]);

  // Filter by Status Filter in Today View
  const displayedTodayRecords = useMemo(() => {
    if (statusFilter === "CHECKED_IN") {
      return parsedRecords.filter((r) => r.status === "CHECKED_IN");
    }
    if (statusFilter === "CHECKED_OUT") {
      return parsedRecords.filter((r) => r.status === "CHECKED_OUT");
    }
    if (statusFilter === "ON_LEAVE") {
      return parsedRecords.filter((r) => r.status === "ON_LEAVE");
    }
    return parsedRecords;
  }, [parsedRecords, statusFilter]);

  // Monthly Rows for Individual View (Tab 1)
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
        dayName: (row.Day || row.day || "")
          .toString()
          .substring(0, 3)
          .toUpperCase(),
      };
    }
    return null;
  };

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
    const totalDays =
      dayjs(`${targetYear}-${formattedMonth}-01`).daysInMonth() || 31;

    const today = dayjs();
    const todayDayNum = today.date();
    const todayMonthNum = today.month() + 1;
    const todayYearNum = today.year();

    const isCurrentMonthYear =
      Number(targetYear) === todayYearNum &&
      Number(targetMonth) === todayMonthNum;

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
      const currentDate = dayjs(
        `${targetYear}-${formattedMonth}-${String(d).padStart(2, "0")}`
      );
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

  if (loading) {
    return <Loader />;
  }

  // ==========================================
  // RENDER: TODAY'S ATTENDANCE MODERN VIEW (Tab 0)
  // ==========================================
  if (isTodayView) {
    if (!listData || listData.length === 0) {
      return <NotFound text={msg || "No attendance records found for today"} />;
    }

    return (
      <Box sx={{ width: "100%", pb: 2 }}>
        {/* Status Filter Chips Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 1.2,
            mb: 1.5,
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              flexWrap: "nowrap",
              overflowX: "auto",
              maxWidth: "100%",
              py: 0.2,
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <Chip
              label={`All (${summaryCounts.total})`}
              onClick={() => setStatusFilter("ALL")}
              sx={{
                fontWeight: 700,
                fontSize: "11.5px",
                height: 30,
                px: 0.8,
                borderRadius: "7px",
                flexShrink: 0,
                backgroundColor: statusFilter === "ALL" ? "#1A5D28" : "#f1f5f9",
                color: statusFilter === "ALL" ? "#ffffff" : "#475569",
                boxShadow: statusFilter === "ALL" ? "0 2px 6px rgba(26, 93, 40, 0.25)" : "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: statusFilter === "ALL" ? "#14471e" : "#e2e8f0",
                },
              }}
            />
            <Chip
              icon={<LoginIcon style={{ fontSize: 14 }} />}
              label={`Checked In (${summaryCounts.checkedIn})`}
              onClick={() => setStatusFilter("CHECKED_IN")}
              sx={{
                fontWeight: 700,
                fontSize: "11.5px",
                height: 30,
                px: 0.8,
                borderRadius: "7px",
                flexShrink: 0,
                backgroundColor: statusFilter === "CHECKED_IN" ? "#15803d" : "#f1f5f9",
                color: statusFilter === "CHECKED_IN" ? "#ffffff" : "#475569",
                boxShadow: statusFilter === "CHECKED_IN" ? "0 2px 6px rgba(21, 128, 61, 0.25)" : "none",
                transition: "all 0.2s ease",
                "& .MuiChip-icon": {
                  color: statusFilter === "CHECKED_IN" ? "#ffffff" : "#15803d",
                },
                "&:hover": {
                  backgroundColor: statusFilter === "CHECKED_IN" ? "#166534" : "#e2e8f0",
                },
              }}
            />
            <Chip
              icon={<LogoutIcon style={{ fontSize: 14 }} />}
              label={`Checked Out (${summaryCounts.checkedOut})`}
              onClick={() => setStatusFilter("CHECKED_OUT")}
              sx={{
                fontWeight: 700,
                fontSize: "11.5px",
                height: 30,
                px: 0.8,
                borderRadius: "7px",
                flexShrink: 0,
                backgroundColor: statusFilter === "CHECKED_OUT" ? "#0284c7" : "#f1f5f9",
                color: statusFilter === "CHECKED_OUT" ? "#ffffff" : "#475569",
                boxShadow: statusFilter === "CHECKED_OUT" ? "0 2px 6px rgba(2, 132, 199, 0.25)" : "none",
                transition: "all 0.2s ease",
                "& .MuiChip-icon": {
                  color: statusFilter === "CHECKED_OUT" ? "#ffffff" : "#0284c7",
                },
                "&:hover": {
                  backgroundColor: statusFilter === "CHECKED_OUT" ? "#0369a1" : "#e2e8f0",
                },
              }}
            />
          </Box>

          <Typography fontSize={12} fontWeight={600} color="#64748b" sx={{ flexShrink: 0 }}>
            Showing {displayedTodayRecords.length} record{displayedTodayRecords.length !== 1 ? "s" : ""}
          </Typography>
        </Paper>

        {/* Display Content: Modern Attractive List View Only */}
        {displayedTodayRecords.length === 0 ? (
          <NotFound text="No matching attendance records found for selected filter" />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
            {displayedTodayRecords.map((item, index) => {
              const initials = getInitials(item.name, item.serviceNo);

              return (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    py: 1.2,
                    px: 1.5,
                    borderRadius: "10px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderLeft: "4px solid #1A5D28",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 14px rgba(26, 93, 40, 0.1)",
                      borderColor: "#1A5D28",
                      borderLeftColor: "#1A5D28",
                      backgroundColor: "#fafcf9",
                    },
                  }}
                >
                  {/* Top Section: Left Employee Info, Right Status Badge */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    {/* Left: Avatar, Name, Service No & Division */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flex: 1, minWidth: 0 }}>
                      <Avatar
                        sx={{
                          background: "linear-gradient(135deg, #1A5D28 0%, #2e7d32 100%)",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: 13,
                          width: 36,
                          height: 36,
                          boxShadow: "0 2px 6px rgba(26, 93, 40, 0.2)",
                          border: "1.5px solid #ffffff",
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography fontSize={13.5} fontWeight={700} color="#1e293b" sx={{ lineHeight: 1.2 }}>
                          {item.name || `Employee ${item.serviceNo}`}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.3, flexWrap: "wrap" }}>
                          <Chip
                            icon={<BadgeIcon style={{ fontSize: 12, color: "#1A5D28" }} />}
                            label={`SNO: ${item.serviceNo}`}
                            size="small"
                            sx={{
                              backgroundColor: "#e8f5e9",
                              color: "#1A5D28",
                              fontWeight: 700,
                              fontSize: "10.5px",
                              height: 22,
                              borderRadius: "5px",
                              "& .MuiChip-label": { px: 0.8 },
                            }}
                          />

                          {item.division && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                              <BusinessIcon sx={{ fontSize: 13, color: "#64748b" }} />
                              <Typography fontSize={11.5} fontWeight={600} color="#64748b">
                                {item.division}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    {/* Top Right: Status Badge */}
                    <Box sx={{ flexShrink: 0 }}>
                      {item.status === "ON_LEAVE" ? (
                        <Chip
                          icon={<EventBusyIcon style={{ fontSize: 13, color: "#c62828" }} />}
                          label={item.leaveReason || "On Leave"}
                          size="small"
                          sx={{
                            backgroundColor: "#ffebee",
                            color: "#c62828",
                            fontWeight: 700,
                            fontSize: "11px",
                            borderRadius: "6px",
                            height: 25,
                          }}
                        />
                      ) : item.status === "CHECKED_OUT" ? (
                        <Chip
                          icon={<CheckCircleIcon style={{ fontSize: 13, color: "#0284c7" }} />}
                          label="Checked Out"
                          size="small"
                          sx={{
                            backgroundColor: "#e0f2fe",
                            color: "#0284c7",
                            fontWeight: 700,
                            fontSize: "11px",
                            borderRadius: "6px",
                            height: 25,
                          }}
                        />
                      ) : item.status === "CHECKED_IN" ? (
                        <Chip
                          icon={
                            <Box
                              sx={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                backgroundColor: "#15803d",
                                ml: 0.6,
                                boxShadow: "0 0 6px #15803d",
                              }}
                            />
                          }
                          label="Checked In"
                          size="small"
                          sx={{
                            backgroundColor: "#dcfce7",
                            color: "#15803d",
                            fontWeight: 700,
                            fontSize: "11px",
                            borderRadius: "6px",
                            height: 25,
                          }}
                        />
                      ) : (
                        <Chip
                          label="Not Checked In"
                          size="small"
                          sx={{
                            backgroundColor: "#f1f5f9",
                            color: "#64748b",
                            fontWeight: 600,
                            fontSize: "11px",
                            borderRadius: "6px",
                            height: 25,
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Bottom Row: IN & OUT Punch Time Cards */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1, width: "100%", flexWrap: "wrap" }}>
                    {/* IN Time Pill */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        py: 0.4,
                        px: 1.2,
                        borderRadius: "7px",
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      <LoginIcon sx={{ fontSize: 14, color: "#15803d" }} />
                      <Box>
                        <Typography fontSize={9} fontWeight={700} color="#15803d" textTransform="uppercase" sx={{ lineHeight: 1 }}>
                          IN TIME
                        </Typography>
                        <Typography fontSize={11.5} fontWeight={700} color={item.inTime ? "#166534" : "#94a3b8"} sx={{ lineHeight: 1.1 }}>
                          {item.inTime || "—"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* OUT Time Pill */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        py: 0.4,
                        px: 1.2,
                        borderRadius: "7px",
                        backgroundColor: "#f0f9ff",
                        border: "1px solid #bae6fd",
                      }}
                    >
                      <LogoutIcon sx={{ fontSize: 14, color: "#0284c7" }} />
                      <Box>
                        <Typography fontSize={9} fontWeight={700} color="#0284c7" textTransform="uppercase" sx={{ lineHeight: 1 }}>
                          OUT TIME
                        </Typography>
                        <Typography fontSize={11.5} fontWeight={700} color={item.outTime ? "#0369a1" : "#94a3b8"} sx={{ lineHeight: 1.1 }}>
                          {item.outTime || "—"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Duration Badge if available */}
                    {item.duration && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.4,
                          py: 0.4,
                          px: 1,
                          borderRadius: "7px",
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 13, color: "#64748b" }} />
                        <Typography fontSize={11} fontWeight={700} color="#475569">
                          {item.duration}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>
    );
  }

  // ==========================================
  // RENDER: INDIVIDUAL MONTHLY TABLE VIEW (Tab 1)
  // ==========================================
  if (!monthRows || monthRows.length === 0) {
    return <NotFound text={msg || (searchQuery ? "No matching records found" : undefined)} />;
  }

  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: "100%",
          maxHeight: 450,
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
                const parsedRec = parseRecord(apiRecord);
                serviceNo = parsedRec.serviceNo;
                inTime = parsedRec.inTime;
                outTime = parsedRec.outTime;
                leaveReason = parsedRec.leaveReason;
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
    </Box>
  );
}
