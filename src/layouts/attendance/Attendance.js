import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import PeopleIcon from "@mui/icons-material/People";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import SearchIcon from "@mui/icons-material/Search";
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
  // Tab state: 0 = Today's Attendance (All), 1 = Individual Search
  const [tabValue, setTabValue] = useState(0);

  // Tab 0 State: Quick search filter
  const [quickSearch, setQuickSearch] = useState("");

  // Tab 1 State: Individual employee filters (defaults to current month and year)
  const [year, setYear] = useState(dayjs().format("YYYY"));
  const [month, setMonth] = useState(dayjs().format("MM"));
  const [sno, setSno] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Build params for Individual Search (Tab 1) - queries entire month
  const buildIndividualParams = (overrideSno) => {
    const activeSno =
      typeof overrideSno === "string" || typeof overrideSno === "number"
        ? String(overrideSno)
        : sno;
    const finalSno = activeSno ? String(activeSno).trim() : "";

    if (!finalSno) return null;

    return {
      year: year ? String(year).trim() : dayjs().format("YYYY"),
      month: month ? String(month).trim() : dayjs().format("MM"),
      sno: finalSno,
    };
  };

  // Fetch for Tab 0: Automatically load today's attendance for all employees
  const fetchTodayAttendance = () => {
    const todayDate = dayjs().format("YYYY-MM-DD");
    dispatch(GetAttendenceDetails({ fromDate: todayDate, sno: "" }));
  };

  // Fetch for Tab 1: Filter individual employee
  const fetchIndividualAttendance = (overrideSno) => {
    const params = buildIndividualParams(overrideSno);
    if (params) {
      dispatch(GetAttendenceDetails(params));
    }
  };

  const handleSnoChange = (e) => {
    const val = e.target.value;
    setSno(val);
    if (val.trim()) {
      fetchIndividualAttendance(val);
    }
  };

  // Trigger data load based on current active tab & filters
  useEffect(() => {
    if (tabValue === 0) {
      fetchTodayAttendance();
    } else {
      if (sno.trim()) {
        fetchIndividualAttendance();
      }
    }
  }, [tabValue, year, month, sno]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 1,
        px: 1,
      }}
    >
      {/* Top Navigation & Tabs Bar */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          p: 1.5,
          mx: 1,
          mt: 1,
          gap: 2,
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Back Arrow Button */}
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: "#1A5D28",
              color: "#fff",
              "&:hover": { backgroundColor: "#14471e" },
              width: 36,
              height: 36,
              borderRadius: "10px",
            }}
            aria-label="back"
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>

          <Typography fontSize={18} fontWeight={700} color="#1A5D28">
            Attendance
          </Typography>
        </Box>

        {/* Modern Styled Pill Tabs */}
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            minHeight: 40,
            backgroundColor: "#f4f6f8",
            borderRadius: "12px",
            p: "4px",
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab
            icon={<PeopleIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Today's Attendance"
            sx={{
              minHeight: 36,
              py: 0.5,
              px: 2,
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              color: "#555",
              transition: "all 0.2s ease",
              "&.Mui-selected": {
                backgroundColor: "#1A5D28",
                color: "#ffffff",
                boxShadow: "0 2px 8px rgba(26, 93, 40, 0.3)",
              },
            }}
          />
          <Tab
            icon={<PersonSearchIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Individual"
            sx={{
              minHeight: 36,
              py: 0.5,
              px: 4,
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              color: "#555",
              transition: "all 0.2s ease",
              "&.Mui-selected": {
                backgroundColor: "#1A5D28",
                color: "#ffffff",
                boxShadow: "0 2px 8px rgba(26, 93, 40, 0.3)",
              },
            }}
          />
        </Tabs>
      </Paper>

      {/* Tab 0 Controls: Quick Search Bar for Today's Attendance */}
      {tabValue === 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mt: 2,
            mx: 1,
            p: 1.5,
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
          }}
        >
          <Typography fontSize={14} fontWeight={600} color="#1A5D28">
            Today's Attendance Records ({dayjs().format("DD MMM YYYY")})
          </Typography>

          {/* Real-time Quick Filter */}
          <TextField
            size="small"
            placeholder="Quick search (Service No / Name)..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "#1A5D28" }} />
                </InputAdornment>
              ),
              endAdornment: quickSearch && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setQuickSearch("")}>
                    <ClearIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 260,
              backgroundColor: "#fff",
              borderRadius: "8px",
              "& .MuiInputBase-root": {
                height: "36px",
                fontSize: "13px",
              },
            }}
          />
        </Box>
      )}

      {/* Tab 1 Controls: Individual Search Filter Bar */}
      {tabValue === 1 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
            mt: 2,
            mx: 1,
            p: 1.5,
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
          }}
        >
          <TextField
            label="Service No *"
            size="small"
            placeholder="e.g. 700026"
            value={sno}
            onChange={handleSnoChange}
            sx={{
              width: 200,
              backgroundColor: "#fff",
              borderRadius: 1,
              "& .MuiInputBase-root": {
                height: "36px",
                fontSize: "13px",
              },
            }}
          />
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
        </Box>
      )}

      {/* Main Table Content Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          mx: 1,
          mt: 2,
          marginBottom: "70px",
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {tabValue === 1 && !sno.trim() ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <PersonSearchIcon sx={{ fontSize: 48, color: "#1A5D28", mb: 1, opacity: 0.8 }} />
              <Typography fontSize={16} fontWeight={600} color="#1E293B" mb={0.5}>
                Please Enter Service Number
              </Typography>
              <Typography fontSize={13} color="#64748B">
                Enter an employee Service Number above to view monthly attendance records.
              </Typography>
            </Paper>
          ) : (
            <AttendanceCard searchQuery={tabValue === 0 ? quickSearch : ""} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Attendance;