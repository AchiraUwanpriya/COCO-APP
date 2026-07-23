import React, { useEffect, useMemo, useState } from "react";
import { Box, TextField, Button, MenuItem, IconButton, InputAdornment, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch } from "react-redux";
import AttendanceCard from "../../components/Cards/AttendanceCard";
import dayjs from "dayjs";
import { GetAttendenceDetails } from "../../action/Attendance";
import { useNavigate } from "react-router-dom";

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const Attendance = () => {
  const [year, setYear] = useState(dayjs().format("YYYY"));
  const [month, setMonth] = useState(dayjs().format("MM"));
  const [day, setDay] = useState(dayjs().format("DD")); // default = today
  const [sno, setSno] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Dynamically compute days available for selected year+month
  const daysInMonth = useMemo(() => {
    if (year && month) {
      const count = dayjs(`${year}-${month}-01`).daysInMonth();
      return Array.from({ length: count }, (_, i) =>
        String(i + 1).padStart(2, "0")
      );
    }
    return Array.from({ length: 31 }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );
  }, [year, month]);

  const buildParams = (overrideSno) => {
    const activeSno =
      typeof overrideSno === "string" || typeof overrideSno === "number"
        ? String(overrideSno)
        : sno;
    const finalSno = activeSno ? String(activeSno).trim() : "";

    // If all three (year, month, day) are selected → send as fromDate
    if (year && month && day) {
      const fromDate = `${year}-${month}-${day}`;
      return { fromDate, sno: finalSno };
    }

    // Otherwise send year + month separately
    return {
      year: year ? String(year).trim() : undefined,
      month: month ? String(month).trim() : undefined,
      sno: finalSno,
    };
  };

  const fetchAttendance = (overrideSno) => {
    dispatch(GetAttendenceDetails(buildParams(overrideSno)));
  };

  const handleSnoChange = (e) => {
    const val = e.target.value;
    setSno(val);
    if (!val.trim()) {
      fetchAttendance("");
    }
  };

  // Reset day if it exceeds days in the newly chosen month
  useEffect(() => {
    if (day && daysInMonth.length > 0 && !daysInMonth.includes(day)) {
      setDay("");
    }
  }, [year, month]);

  useEffect(() => {
    fetchAttendance();
  }, [dispatch, year, month, day]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 1,
      }}
    >
        {/* Right Side - Green Back Arrow Button */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: "#1A5D28",
            color: "#fff",
            "&:hover": { backgroundColor: "#14471e" },
            width: 36,
            height: 36,
            borderRadius: 1,
            ml: 2,
          }}
          aria-label="back"
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mt: 2,
          mx: 2,
          gap: 2,
        }}
      >
        
        {/* Left Side - Year, Month, Day & Service No Inputs */}
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
          <TextField
            label="Year"
            size="small"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{
              width: 100,
              backgroundColor: "#fff",
              borderRadius: 1,
              "& .MuiInputBase-root": {
                height: "36px",
                fontSize: "13px",
              },
            }}
          />
          <TextField
            select
            label="Month"
            size="small"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            sx={{
              minWidth: 130,
              backgroundColor: "#fff",
              borderRadius: 1,
              "& .MuiInputBase-root": {
                height: "36px",
                fontSize: "13px",
              },
            }}
          >
            {MONTHS.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>
          {/* Day selector — optional. When selected, API receives fromDate instead of year+month */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <TextField
              select
              label="Date"
              size="small"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              sx={{
                minWidth: 90,
                backgroundColor: "#fff",
                borderRadius: 1,
                "& .MuiInputBase-root": {
                  height: "36px",
                  fontSize: "13px",
                },
              }}
            >
              <MenuItem value=""><em>All Days</em></MenuItem>
              {daysInMonth.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>
            {/* Clear day button — only visible when a day is selected */}
            {day && (
              <Tooltip title="Clear day">
                <IconButton
                  size="small"
                  onClick={() => setDay("")}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #ddd",
                    width: 28,
                    height: 28,
                    "&:hover": { backgroundColor: "#ffebee", borderColor: "#e53935" },
                  }}
                >
                  <ClearIcon sx={{ fontSize: 14, color: "#e53935" }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <TextField
            label="Service No"
            size="small"
            placeholder="e.g. 700026"
            value={sno}
            onChange={handleSnoChange}
            sx={{
              width: 220,
              backgroundColor: "#fff",
              borderRadius: 1,
              "& .MuiInputBase-root": {
                height: "36px",
                fontSize: "13px",
              },
            }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={() => fetchAttendance()}
            sx={{ textTransform: "none", height: "36px", fontWeight: 600 }}
          >
            Search
          </Button>
        </Box>

      
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          marginLeft: 1,
          marginRight: 1,
          marginBottom: "70px",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
          }}
        >
          <AttendanceCard />
        </Box>
      </Box>
    </Box>
  );
};

export default Attendance;