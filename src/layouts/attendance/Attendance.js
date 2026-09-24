// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   TextField,
//   MenuItem,
//   IconButton,
//   Tabs,
//   Tab,
//   Typography,
//   Paper,
//   InputAdornment,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ClearIcon from "@mui/icons-material/Clear";
// import PeopleIcon from "@mui/icons-material/People";
// import PersonSearchIcon from "@mui/icons-material/PersonSearch";
// import SearchIcon from "@mui/icons-material/Search";
// import { useDispatch } from "react-redux";
// import AttendanceCard from "../../components/Cards/AttendanceCard";
// import dayjs from "dayjs";
// import { GetAttendenceDetails } from "../../action/Attendance";
// import { useNavigate } from "react-router-dom";

// const MONTHS = [
//   { value: "01", label: "January" },
//   { value: "02", label: "February" },
//   { value: "03", label: "March" },
//   { value: "04", label: "April" },
//   { value: "05", label: "May" },
//   { value: "06", label: "June" },
//   { value: "07", label: "July" },
//   { value: "08", label: "August" },
//   { value: "09", label: "September" },
//   { value: "10", label: "October" },
//   { value: "11", label: "November" },
//   { value: "12", label: "December" },
// ];

// const Attendance = () => {
//   // Tab state: 0 = Today's Attendance (All), 1 = Individual Search
//   const [tabValue, setTabValue] = useState(0);

//   // Tab 0 State: Quick search filter
//   const [quickSearch, setQuickSearch] = useState("");

//   // Tab 1 State: Individual employee filters (defaults to current month and year)
//   const [year, setYear] = useState(dayjs().format("YYYY"));
//   const [month, setMonth] = useState(dayjs().format("MM"));
//   const [sno, setSno] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Build params for Individual Search (Tab 1) - queries entire month
//   const buildIndividualParams = (overrideSno) => {
//     const activeSno =
//       typeof overrideSno === "string" || typeof overrideSno === "number"
//         ? String(overrideSno)
//         : sno;
//     const finalSno = activeSno ? String(activeSno).trim() : "";

//     if (!finalSno) return null;

//     return {
//       year: year ? String(year).trim() : dayjs().format("YYYY"),
//       month: month ? String(month).trim() : dayjs().format("MM"),
//       sno: finalSno,
//     };
//   };

//   // Fetch for Tab 0: Load attendance for the current date
//   const fetchTodayAttendance = () => {
//     const activeDate = dayjs().format("YYYY-MM-DD");
//     dispatch(GetAttendenceDetails({ fromDate: activeDate, sno: "" }));
//   };

//   // Fetch for Tab 1: Filter individual employee
//   const fetchIndividualAttendance = (overrideSno) => {
//     const params = buildIndividualParams(overrideSno);
//     if (params) {
//       dispatch(GetAttendenceDetails(params));
//     }
//   };

//   const handleSnoChange = (e) => {
//     const val = e.target.value;
//     setSno(val);
//     if (val.trim()) {
//       fetchIndividualAttendance(val);
//     }
//   };

//   // Trigger data load based on current active tab & filters
//   useEffect(() => {
//     if (tabValue === 0) {
//       fetchTodayAttendance();
//     } else {
//       if (sno.trim()) {
//         fetchIndividualAttendance();
//       }
//     }
//   }, [tabValue, year, month, sno]);

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         mt: 0.5,
//         px: 1,
//       }}
//     >
//       {/* Top Navigation & Tabs Bar */}
//       <Paper
//         elevation={0}
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           flexWrap: "wrap",
//           p: 1.5,
//           mx: 1,
//           mt: 1,
//           gap: 2,
//           borderRadius: "16px",
//           backgroundColor: "#ffffff",
//           boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
//           border: "1px solid rgba(0,0,0,0.06)",
//         }}
//       >
//         {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          
//           <IconButton
//             onClick={() => navigate(-1)}
//             sx={{
//               backgroundColor: "#1A5D28",
//               color: "#fff",
//               "&:hover": { backgroundColor: "#14471e" },
//               width: 36,
//               height: 36,
//               borderRadius: "10px",
//             }}
//             aria-label="back"
//           >
//             <ArrowBackIcon fontSize="small" />
//           </IconButton>

//           <Typography fontSize={18} fontWeight={700} color="#1A5D28">
//             Attendance
//           </Typography>
//         </Box> */}

//         {/* Modern Styled Pill Tabs */}
//         <Tabs
//           value={tabValue}
//           onChange={(e, newValue) => setTabValue(newValue)}
//           variant="fullWidth"
//           sx={{
//             width: "100%",
//             minHeight: 40,
//             backgroundColor: "#f4f6f8",
//             borderRadius: "12px",
//             p: "4px",
//             "& .MuiTabs-indicator": {
//               display: "none",
//             },
//           }}
//         >
//           <Tab
//             icon={<PeopleIcon sx={{ fontSize: 18 }} />}
//             iconPosition="start"
//             label="Today's Attendance"
//             sx={{
//               flex: 1,
//               minHeight: 36,
//               py: 0.5,
//               px: 2,
//               fontSize: "13px",
//               fontWeight: 600,
//               borderRadius: "8px",
//               textTransform: "none",
//               color: "#555",
//               transition: "all 0.2s ease",
//               "&.Mui-selected": {
//                 backgroundColor: "#1A5D28",
//                 color: "#ffffff",
//                 boxShadow: "0 2px 8px rgba(26, 93, 40, 0.3)",
//               },
//             }}
//           />
//           <Tab
//             icon={<PersonSearchIcon sx={{ fontSize: 18 }} />}
//             iconPosition="start"
//             label="Individual"
//             sx={{
//               flex: 1,
//               minHeight: 36,
//               py: 0.5,
//               px: 2,
//               fontSize: "13px",
//               fontWeight: 600,
//               borderRadius: "8px",
//               textTransform: "none",
//               color: "#555",
//               transition: "all 0.2s ease",
//               "&.Mui-selected": {
//                 backgroundColor: "#1A5D28",
//                 color: "#ffffff",
//                 boxShadow: "0 2px 8px rgba(26, 93, 40, 0.3)",
//               },
//             }}
//           />
//         </Tabs>
//       </Paper>

//       {/* Tab 0 Controls: Quick Search Bar for Today's Attendance */}
//       {tabValue === 0 && (
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//             gap: 2,
//             mt: 2,
//             mx: 1,
//             p: 1.5,
//             backgroundColor: "#ffffff",
//             borderRadius: "12px",
//             border: "1px solid #e2e8f0",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
//           }}
//         >
//           <Typography fontSize={14} fontWeight={600} color="#1A5D28">
//             Today's Attendance Records ({dayjs().format("DD MMM YYYY")})
//           </Typography>

//           {/* Real-time Quick Filter */}
//           <TextField
//             size="small"
//             placeholder="Quick search (Service No / Name)"
//             value={quickSearch}
//             onChange={(e) => setQuickSearch(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ fontSize: 18, color: "#1A5D28" }} />
//                 </InputAdornment>
//               ),
//               endAdornment: quickSearch && (
//                 <InputAdornment position="end">
//                   <IconButton size="small" onClick={() => setQuickSearch("")}>
//                     <ClearIcon sx={{ fontSize: 14 }} />
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//             sx={{
//               minWidth: 260,
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               "& .MuiInputBase-root": {
//                 height: "36px",
//                 fontSize: "13px",
//               },
//             }}
//           />
//         </Box>
//       )}

//       {/* Tab 1 Controls: Individual Search Filter Bar */}
//       {tabValue === 1 && (
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             flexWrap: "nowrap",
//             gap: 1,
//             mt: 2,
//             mx: 1,
//             p: 1.2,
//             backgroundColor: "#ffffff",
//             borderRadius: "12px",
//             border: "1px solid #e2e8f0",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
//             overflowX: "auto",
//             "&::-webkit-scrollbar": { display: "none" },
//             msOverflowStyle: "none",
//             scrollbarWidth: "none",
//           }}
//         >
         
//           <TextField
//             label="Year"
//             size="small"
//             type="number"
//             value={year}
//             onChange={(e) => setYear(e.target.value)}
//             sx={{
//               width: 75,
//               flexShrink: 0,
//               backgroundColor: "#fff",
//               borderRadius: 1,
//               "& .MuiInputBase-root": {
//                 height: "36px",
//                 fontSize: "13px",
//               },
//             }}
//           />
//           <TextField
//             select
//             label="Month"
//             size="small"
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//             sx={{
//               width: 105,
//               flexShrink: 0,
//               backgroundColor: "#fff",
//               borderRadius: 1,
//               "& .MuiInputBase-root": {
//                 height: "36px",
//                 fontSize: "13px",
//               },
//             }}
//           >
//             {MONTHS.map((m) => (
//               <MenuItem key={m.value} value={m.value}>
//                 {m.label}
//               </MenuItem>
//             ))}
//           </TextField>
//            <TextField
//             label="Service No *"
//             size="small"
//             placeholder="e.g. 700026"
//             value={sno}
//             onChange={handleSnoChange}
//             sx={{
//               flex: 1,
//               minWidth: 110,
//               backgroundColor: "#fff",
//               borderRadius: 1,
//               "& .MuiInputBase-root": {
//                 height: "36px",
//                 fontSize: "13px",
//               },
//             }}
//           />
//         </Box>
//       )}

//       {/* Main Table Content Container */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           flexGrow: 1,
//           mx: 1,
//           mt: 2,
//           marginBottom: "10px",
//           overflow: "hidden",
//         }}
//       >
//         <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
//           {tabValue === 1 && !sno.trim() ? (
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 4,
//                 textAlign: "center",
//                 backgroundColor: "#ffffff",
//                 borderRadius: "12px",
//                 border: "1px solid #e2e8f0",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//               }}
//             >
//               <PersonSearchIcon sx={{ fontSize: 48, color: "#1A5D28", mb: 1, opacity: 0.8 }} />
//               <Typography fontSize={16} fontWeight={600} color="#1E293B" mb={0.5}>
//                 Please Enter Service Number
//               </Typography>
//               <Typography fontSize={13} color="#64748B">
//                 Enter an employee Service Number above to view monthly attendance records.
//               </Typography>
//             </Paper>
//           ) : (
//             <AttendanceCard
//               isTodayView={tabValue === 0}
//               year={year}
//               month={month}
//               searchQuery={tabValue === 0 ? quickSearch : ""}
//             />
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Attendance;


import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, IconButton, Typography, InputAdornment, Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import AttendanceCard from "../../components/Cards/AttendanceCard";
import dayjs from "dayjs";
import { GetAttendenceDetails } from "../../action/Attendance";
import { useNavigate } from "react-router-dom";

// ---- Design tokens ----
const BRAND = "#1A5D28";
const TEXT = "#101828";
const SUBTEXT = "#667085";
const BORDER = "#e4e7ec";
const PAGE_BG = "#f7f8f7";
const SURFACE = "#ffffff";

const fieldSx = {
  backgroundColor: SURFACE,
  "& .MuiOutlinedInput-root": {
    height: "42px",
    fontSize: "13.5px",
    borderRadius: "10px",
    "& fieldset": { borderColor: BORDER },
    "&:hover fieldset": { borderColor: "#c7cdd3" },
    "&.Mui-focused fieldset": { borderColor: BRAND, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": { fontSize: "13px" },
};

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
  const [tabValue, setTabValue] = useState(0); // 0 = Today, 1 = Individual
  const [quickSearch, setQuickSearch] = useState("");
  const [year, setYear] = useState(dayjs().format("YYYY"));
  const [month, setMonth] = useState(dayjs().format("MM"));

  // Today tab: which date's attendance to show — defaults to today.
  const [todayDate, setTodayDate] = useState(dayjs().format("YYYY-MM-DD"));

  // Individual tab: queryInput is what's typed live, activeQuery is what
  // was actually submitted (Search button / Enter) — the API call only
  // fires on submit, never on every keystroke.
  const [queryInput, setQueryInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // The single search box accepts either a service number or a name.
  // Backend has "Name"/"ServiceNo" query params swapped, so:
  //   - a mostly-numeric value is treated as a real service number
  //     and must be sent as "searchServiceNo" (service layer maps this to
  //     the "Name" query param)
  //   - anything else is treated as a real name and sent as "searchName"
  //     (service layer maps this to the "ServiceNo" query param)
  const buildIndividualParams = (rawQuery) => {
    const finalQuery = rawQuery ? String(rawQuery).trim() : "";
    if (!finalQuery) return null;

    const isServiceNo = /^\d+$/.test(finalQuery);

    return {
      year: year ? String(year).trim() : dayjs().format("YYYY"),
      month: month ? String(month).trim() : dayjs().format("MM"),
      ...(isServiceNo
        ? { searchServiceNo: finalQuery }
        : { searchName: finalQuery }),
    };
  };

  const fetchTodayAttendance = () => {
    const activeDate = todayDate || dayjs().format("YYYY-MM-DD");
    dispatch(GetAttendenceDetails({ fromDate: activeDate, sno: "" }));
  };

  const fetchIndividualAttendance = (rawQuery) => {
    const query = rawQuery !== undefined ? rawQuery : activeQuery;
    const params = buildIndividualParams(query);
    if (params) {
      // A specific employee was searched → server-side filter
      dispatch(GetAttendenceDetails(params));
    } else {
      // No search term → load the whole month for ALL employees
      dispatch(
        GetAttendenceDetails({
          year: year ? String(year).trim() : dayjs().format("YYYY"),
          month: month ? String(month).trim() : dayjs().format("MM"),
          sno: "",
        })
      );
    }
  };

  const handleSearch = () => {
    setActiveQuery(queryInput.trim());
  };

  const handleQueryKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearQuery = () => {
    setQueryInput("");
    setActiveQuery("");
  };

  // Tapping an employee in the directory list → search that person by their
  // real service number (numeric → sent as searchServiceNo) and show their
  // monthly attendance.
  const handleSelectEmployee = (emp) => {
    if (!emp) return;
    const key = emp.serviceNo && emp.serviceNo !== "-" ? emp.serviceNo : emp.name || "";
    setQueryInput(key);
    setActiveQuery(String(key).trim());
  };

  useEffect(() => {
    if (tabValue === 0) {
      fetchTodayAttendance();
    } else {
      // Individual tab: load all employees for the month by default;
      // fetchIndividualAttendance narrows to one employee when activeQuery is set.
      fetchIndividualAttendance(activeQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue, year, month, activeQuery, todayDate]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: PAGE_BG, minHeight: "100%" }}>
      {/* Page header */}
      <Box sx={{ px: 2, pt: 1.75, pb: 1.25 }}>
        <Typography fontSize={18} fontWeight={700} color={TEXT} sx={{ lineHeight: 1.2 }}>
          Attendance
        </Typography>
        <Typography fontSize={12.5} fontWeight={500} color={SUBTEXT} sx={{ mt: 0.25 }}>
          {dayjs().format("dddd, DD MMM YYYY")}
        </Typography>
      </Box>

      {/* Full-width segmented control */}
      <Box sx={{ px: 2, mb: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            backgroundColor: "#eef1ee",
            borderRadius: "11px",
            p: "3px",
          }}
        >
          {[
            { value: 0, label: "Today" },
            { value: 1, label: "Individual" },
          ].map((t) => (
            <Box
              key={t.value}
              onClick={() => setTabValue(t.value)}
              sx={{
                flex: 1,
                textAlign: "center",
                cursor: "pointer",
                py: 1,
                borderRadius: "9px",
                fontSize: "13.5px",
                fontWeight: 600,
                color: tabValue === t.value ? "#ffffff" : SUBTEXT,
                backgroundColor: tabValue === t.value ? BRAND : "transparent",
                transition: "all 0.15s ease",
              }}
            >
              {t.label}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Filter row */}
      <Box sx={{ px: 2, mb: 1.5 }}>
        {tabValue === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {/* Date picker for Today tab — defaults to today */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                type="date"
                size="small"
                label="Date"
                value={todayDate}
                onChange={(e) => setTodayDate(e.target.value || dayjs().format("YYYY-MM-DD"))}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, ...fieldSx }}
              />
              {todayDate !== dayjs().format("YYYY-MM-DD") && (
                <Button
                  onClick={() => setTodayDate(dayjs().format("YYYY-MM-DD"))}
                  variant="outlined"
                  size="small"
                  sx={{
                    height: 42,
                    px: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "12.5px",
                    color: BRAND,
                    borderColor: BORDER,
                    borderRadius: "10px",
                    whiteSpace: "nowrap",
                    "&:hover": { borderColor: BRAND, backgroundColor: "#f2f8f3" },
                  }}
                >
                  Today
                </Button>
              )}
            </Box>

            <TextField
              size="small"
              fullWidth
              placeholder="Search by name or service no."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: SUBTEXT }} />
                  </InputAdornment>
                ),
                endAdornment: quickSearch && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setQuickSearch("")}>
                      <ClearIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={fieldSx}
            />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Year"
                size="small"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                sx={{ flex: 1, ...fieldSx }}
              />
              <TextField
                select
                label="Month"
                size="small"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                sx={{ flex: 1.3, ...fieldSx }}
              >
                {MONTHS.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Service No or Name"
                size="small"
                fullWidth
                placeholder="e.g. 700026 or Amila"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={handleQueryKeyDown}
                InputProps={{
                  endAdornment: queryInput && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearQuery}>
                        <ClearIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />
              <Button
                onClick={handleSearch}
                disabled={!queryInput.trim()}
                variant="contained"
                disableElevation
                sx={{
                  minWidth: 42,
                  width: 42,
                  height: 42,
                  borderRadius: "10px",
                  backgroundColor: BRAND,
                  "&:hover": { backgroundColor: "#14471e" },
                  "&.Mui-disabled": { backgroundColor: "#e4e7ec" },
                }}
              >
                <SearchIcon sx={{ fontSize: 19, color: "#ffffff" }} />
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ px: 2, pb: 3, flexGrow: 1 }}>
        <AttendanceCard
          isTodayView={tabValue === 0}
          year={year}
          month={month}
          searchQuery={tabValue === 0 ? quickSearch : activeQuery}
          directoryFilter={tabValue === 1 ? queryInput : ""}
          onSelectEmployee={tabValue === 1 ? handleSelectEmployee : undefined}
        />
      </Box>
    </Box>
  );
};

export default Attendance;