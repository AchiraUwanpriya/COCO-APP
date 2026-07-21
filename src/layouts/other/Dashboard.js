
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Box,
//   Typography,
//   Fade,
//   Drawer,
//   IconButton,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   useMediaQuery,
//   useTheme,
//   Paper,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
// import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import CompanyDashboard from "./companyDashboad/index";
// import { DivisionBreakdown } from "../../components/Charts/DivisionBreakdown";
// import { TraineesDivisionBreakdown } from "../../components/Charts/TraineesDivisionBreakdown";
// import WeeklyAttendanceTrend from "../../components/Charts/WeeklyAttendanceTrend";
// import { EmployeeTypeChart } from "../../components/Charts/EmployeeTypeChart";
// import { CDPLCBreakdown } from "../../components/Charts/CDPLCBreakdown";
// import { CDLLocBaseAttendance } from "../../components/Charts/CDLLocBaseAttendance";
// import {EmployeeTypeKpiGrid} from "../../components/Charts/EmployeeTypeKpiGrid"
// import {CDLLocationAttendanceChart} from "../../components/Charts/CDLLocationAttendanceChart";
// import CDLLocationChart from "../../components/Charts/CDLLocationAttendanceChart";
// import {
//   GetCdlBasedDivison,
//   GetTraineeBasedTypes,
//   GetTraineeDivisionAttendance,
//   GetAllAttendance,
//   GetCDLWeekAttendance,
//   GetCDLYearlyAttendance,
//   GetCDLMonthlyAttendance
// } from "../../action/Attendance";
// import { Person } from "@material-ui/icons";

// // ─── Type normalization ───────────────────────────────────────────────────────
// const normalizeType = (value) => {
//   const s = (value || "").toString().trim().toLowerCase();
//   if (s.includes("cdplc")) return "CDPLC";
//   if (s.includes("trainee")) return "Trainee";
//   if (s.includes("sub") && s.includes("l")) return "Sub (L)";
//   if (s.includes("sub") && s.includes("f")) return "Sub (F)";
//   if (s.includes("kry") || s.includes("site")) return "KRY Site";
//   return (value || "").toString().trim();
// };

// const TYPE_ORDER  = { CDPLC: 1, "Sub (L)": 2, "Sub (F)": 3, Trainee: 4, "KRY Site": 5 };
// const CARD_TYPES  = ["CDPLC","Trainee", "Sub (L)", "Sub (F)", ];

// // ─── Card color config ────────────────────────────────────────────────────────
// const TYPE_CONFIG = {
//   CDPLC:      { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#c9ddf7", numColor: "#222427", rateColor: "#0314fa" },
//   Trainee:    { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
//   "Sub (L)":  { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
//   "Sub (F)":  { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
//   "KRY Site": { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
// };

// // ─── Build per-type breakdown ─────────────────────────────────────────────────
// const buildTypeBreakdown = (allAttendance = []) => {
//   const transformed = (allAttendance || [])
//     .filter((item) => {
//       const t = (item?.Type || item?.TYPE || item?.EmployeeType || item?.employeeType || "").toString().trim();
//       return t && t.toUpperCase() !== "TOTAL";
//     })
//     .map((item) => {
//       const type       = normalizeType(item?.Type || item?.TYPE || item?.EmployeeType || "Unknown");
//       const strength   = parseInt(item?.ActualStrength || item?.Strength || 0) || 0;
//       const eligible   = parseInt(item?.EligibleStrength || item?.Eligible || item?.EligibleCount || item?.EligibleAttendance || 0) || 0;
//       const attendance = parseInt(item?.Attendance || 0) || 0;
//       return { type, strength, eligible, attendance };
//     });

//   const merged = {};
//   transformed.forEach((row) => {
//     if (!merged[row.type]) merged[row.type] = { ...row };
//     else {
//       merged[row.type].strength   += row.strength;
//       merged[row.type].eligible   += row.eligible;
//       merged[row.type].attendance += row.attendance;
//     }
//   });

//   return Object.values(merged).sort(
//     (a, b) => (TYPE_ORDER[a.type] || 99) - (TYPE_ORDER[b.type] || 99)
//   );
// };

// // ─── Arc Gauge SVG ────────────────────────────────────────────────────────────
// const ARC_LENGTH = Math.PI * 42;  

// const ArcGauge = ({ rate, color, trackColor }) => {
//   const offset = ARC_LENGTH - (ARC_LENGTH * Math.min(rate, 100)) / 100;
//   return (
//     <Box sx={{ display: "flex", justifyContent: "center", px: 2, pb: 1.5, pt: 0.5 }}>
//       <svg width="100" height="54" viewBox="0 0 100 54" style={{ overflow: "visible" }}>
//         <path
//           d="M8,50 A42,42 0 0,1 92,50"
//           fill="none"
//           stroke={trackColor}
//           strokeWidth="7"
//           strokeLinecap="round"
//         />
//         <path
//           d="M8,50 A42,42 0 0,1 92,50"
//           fill="none"
//           stroke={color}
//           strokeWidth="7"
//           strokeLinecap="round"
//           strokeDasharray={ARC_LENGTH}
//           strokeDashoffset={offset}
//           style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
//         />
//       </svg>
//     </Box>
//   );
// };

// // ─── Single Attendance KPI Card ───────────────────────────────────────────────
// const AttendanceKpiCard = ({ type, strength, eligible, attendance, onClick }) => {
//   const cfg  = TYPE_CONFIG[type] || TYPE_CONFIG["CDPLC"];
//   const rate = eligible > 0 ? Math.round((attendance / eligible) * 100) : 0;
//   const isInteractive = Boolean(onClick);

//   const handleKeyDown = (event) => {
//     if (!isInteractive) return;
//     if (event.key === "Enter" || event.key === " ") {
//       event.preventDefault();
//       onClick();
//     }
//   };

//   return (
//     <Paper
//       elevation={0}
//       onClick={onClick}
//       onKeyDown={handleKeyDown}
//       role={isInteractive ? "button" : undefined}
//       tabIndex={isInteractive ? 0 : undefined}
//       sx={{
//         borderRadius: "16px",
//         overflow: "hidden",
//         border: "0.5px solid",
//         borderColor: "divider",
//         backgroundColor: "background.paper",
//         transition: "transform 0.2s, box-shadow 0.2s",
//         cursor: isInteractive ? "pointer" : "default",
//         "&:hover": {
//           transform: "translateY(-4px)",
//           boxShadow: "0 8px 28px rgba(0,0,0,0.09)",
//         },
//       }}
//     >
//       {/* ── Header: type pill + rate ── */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-start",
//           px: "16px",
//           pt: "14px",
//           pb: "12px",
//         }}
//       >
//         <Box
//           sx={{
//             display: "inline-block",
//             px: "9px",
//             py: "3px",
//             borderRadius: "20px",
//             backgroundColor: cfg.pill,
//           }}
//         >
//           <Typography sx={{ fontSize: "14px", fontWeight: 700, color: cfg.pillText }}>
//             {type}
//           </Typography>
//         </Box>

//         <Box sx={{ textAlign: "right" }}>
//           <Typography sx={{ fontSize: "20px", fontWeight: 700, color: cfg.rateColor, lineHeight: 1 }}>
//             {rate}%
//           </Typography>
//           <Typography sx={{ fontSize: "10px", color: cfg.rateColor, mt: "1px" }}>
           
//           </Typography>
//         </Box>
//       </Box>
//       <Divider />

//       {/* ── Attendance number (hero) ── */}
//       <Box sx={{ textAlign: "center", pt: "14px", pb: 0 }}>
//         <Typography
//           sx={{
//             fontSize: "10px",
//             color: "text.secondary",
//             fontWeight: 600,
//             textTransform: "uppercase",
//             letterSpacing: "0.5px",
//             mb: "4px",
//           }}
//         >
//           Attendance
//         </Typography>
//         <Typography
//           sx={{
//             fontSize: "32px",
//             fontWeight: 700,
//             color: cfg.numColor,
//             lineHeight: 1,
//           }}
//         >
//           {(attendance || 0).toLocaleString()}
//         </Typography>
//       </Box>

//       {/* ── Arc gauge ── */}
//       <ArcGauge rate={rate} color={cfg.arc} trackColor={cfg.arcTrack} />

//       {/* ── Strength + Eligible ── */}
//       <Divider />
//       <Box sx={{ px: "16px", pt: "10px", pb: "14px", display: "flex", flexDirection: "column", gap: "7px" }}>
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <Typography sx={{ fontSize: "11px", color: "text.secondary" ,fontWeight: 600}}>Eligible Strength</Typography>
//           <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.primary" }}>
//             {(eligible || 0).toLocaleString()}
//           </Typography>
//         </Box>
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <Typography sx={{ fontSize: "11px", color: "text.secondary" ,fontWeight: 600}}>Actual Strength</Typography>
//           <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.primary" }}>
//             {(strength || 0).toLocaleString()}
//           </Typography>
//         </Box>
        
//       </Box>
//     </Paper>
//   );
// };

// // ─── KPI Card Skeleton ────────────────────────────────────────────────────────
// const KpiCardSkeleton = () => (
//   <Box
//     sx={{
//       position: "relative",
//       background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%)",
//       borderRadius: "16px",
//       padding: "16px",
//       overflow: "hidden",
//       border: "1px solid rgba(255,255,255,0.8)",
//       height: 220,
//       "@keyframes shimmer": {
//         "0%":   { backgroundPosition: "-200% 0" },
//         "100%": { backgroundPosition: "200% 0"  },
//       },
//       "&::after": {
//         content: '""',
//         position: "absolute",
//         inset: 0,
//         background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
//         backgroundSize: "200% 100%",
//         animation: "shimmer 1.8s infinite",
//         borderRadius: "16px",
//       },
//     }}
//   >
//     <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//       <Box sx={{ width: "40%", height: 22, backgroundColor: "rgba(0,74,173,0.1)", borderRadius: "10px" }} />
//       <Box sx={{ width: "20%", height: 22, backgroundColor: "rgba(0,74,173,0.08)", borderRadius: "6px"  }} />
//     </Box>
//     <Box sx={{ width: "50%", height: 36, backgroundColor: "rgba(0,74,173,0.12)", borderRadius: "6px", mx: "auto", mb: 1 }} />
//     <Box sx={{ width: 100,    height: 54, backgroundColor: "rgba(0,74,173,0.07)", borderRadius: "50px", mx: "auto", mb: 2 }} />
//     {[1, 2].map((i) => (
//       <Box key={i} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
//         <Box sx={{ width: "30%", height: 11, backgroundColor: "rgba(0,74,173,0.06)", borderRadius: "6px" }} />
//         <Box sx={{ width: "25%", height: 11, backgroundColor: "rgba(0,74,173,0.10)", borderRadius: "6px" }} />
//       </Box>
//     ))}
//   </Box>
// );

// // ─── Chart Skeleton ───────────────────────────────────────────────────────────
// const ChartSkeleton = ({ height = 300 }) => (
//   <Box
//     sx={{
//       position: "relative",
//       background: "linear-gradient(135deg, #f7f9ff 0%, #eef2ff 100%)",
//       borderRadius: "20px",
//       padding: "24px",
//       height,
//       overflow: "hidden",
//       border: "1px solid rgba(0,74,173,0.06)",
//       "@keyframes shimmer2": {
//         "0%":   { backgroundPosition: "-200% 0" },
//         "100%": { backgroundPosition: "200% 0"  },
//       },
//       "&::after": {
//         content: '""',
//         position: "absolute",
//         inset: 0,
//         background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
//         backgroundSize: "200% 100%",
//         animation: "shimmer2 1.8s infinite",
//         borderRadius: "20px",
//       },
//     }}
//   >
//     <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
//       <Box sx={{ width: "28%", height: 20, backgroundColor: "rgba(0,74,173,0.1)",  borderRadius: "6px" }} />
//       <Box sx={{ width: "16%", height: 20, backgroundColor: "rgba(0,74,173,0.07)", borderRadius: "6px" }} />
//     </Box>
//     <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: "70%" }}>
//       {[65, 80, 50, 90, 70, 85, 60].map((h, i) => (
//         <Box key={i} sx={{ flex: 1, height: `${h}%`, backgroundColor: "rgba(0,74,173,0.08)", borderRadius: "6px 6px 0 0" }} />
//       ))}
//     </Box>
//   </Box>
// );



// // ─── Navigation Drawer ────────────────────────────────────────────────────────
// const NavigationDrawer = ({ open, onClose, activeTab, onTabChange }) => {
//   const theme    = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const overviewItems = [
//     { id: 4, label: "Company", icon: <DashboardIcon />, color: "#ef4444", isBold: true },
//     { id: 5, label: "Own",     icon: <Person />,        color: "#f59e0b", isBold: true, disabled: true },
//   ];
//   const mainItems = [
//     { id: 0, label: "HR Dashboard",       icon: <PeopleAltIcon />,     color: "#004AAD", description: "Employee attendance and performance metrics" },
//     { id: 1, label: "Financial Dashboard", icon: <AccountBalanceIcon />, color: "#10b981", description: "Budget tracking and fiscal overview",        disabled: true },
//     { id: 2, label: "Sales Performance",   icon: <TrendingUp />,        color: "#f59e0b", description: "Sales metrics and targets",                  disabled: true },
//     { id: 3, label: "Customer Support",    icon: <Users />,             color: "#8b5cf6", description: "Support ticket analytics",                   disabled: true },
//   ];
//   const otherKpisItems = [
//     { id: 7, label: "Operational KPIs", icon: <Clock />,      color: "#06b6d4", description: "Operational efficiency metrics", disabled: true },
//     { id: 8, label: "Quality Metrics",  icon: <UserCheck />,  color: "#8b5cf6", description: "Quality assurance indicators",   disabled: true },
//     { id: 9, label: "Project Status",   icon: <TrendingUp />, color: "#f43f5e", description: "Project completion rates",       disabled: true },
//   ];

//   const handleTabClick = (tabId) => { onTabChange(tabId); onClose(); };

//   const renderMenuItems = (items, showDivider = false) => (
//     <>
//       <List sx={{ p: 0 }}>
//         {items.map((item) => (
//           <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
//             <ListItemButton
//               onClick={() => handleTabClick(item.id)}
//               disabled={item.disabled}
//               selected={activeTab === item.id}
//               sx={{
//                 borderRadius: "12px", py: 1.5, px: 2, transition: "all 0.2s ease",
//                 ...(item.isBold && { borderLeft: "4px solid", borderLeftColor: item.color, backgroundColor: "rgba(239,68,68,0.04)" }),
//                 "&.Mui-selected": {
//                   backgroundColor: `${item.color}12`,
//                   "&:hover": { backgroundColor: `${item.color}20` },
//                   "& .MuiListItemIcon-root": { color: item.color },
//                   "& .MuiListItemText-primary": { color: item.color, fontWeight: 600 },
//                 },
//                 "&:hover": { backgroundColor: "rgba(0,74,173,0.04)", transform: "translateX(4px)" },
//                 "&.Mui-disabled": { opacity: 0.5 },
//               }}
//             >
//               <ListItemIcon sx={{ minWidth: 40, color: activeTab === item.id ? item.color : "#64748b", transition: "color 0.2s ease" }}>
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText
//                 primary={item.label}
//                 secondary={item.description}
//                 primaryTypographyProps={{
//                   fontSize: "0.95rem",
//                   fontWeight: item.isBold ? 700 : activeTab === item.id ? 600 : 500,
//                   ...(item.isBold && { color: item.color }),
//                 }}
//                 secondaryTypographyProps={{ fontSize: "0.75rem", sx: { color: "text.secondary", mt: 0.5 } }}
//               />
//               {item.disabled && (
//                 <Typography variant="caption" sx={{ bgcolor: "rgba(0,0,0,0.04)", px: 1, py: 0.5, borderRadius: "4px", color: "text.secondary", fontSize: "0.7rem" }}>
//                   Coming Soon
//                 </Typography>
//               )}
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//       {showDivider && <Divider sx={{ my: 2, borderColor: "rgba(0,74,173,0.08)" }} />}
//     </>
//   );

//   return (
//     <Drawer
//       anchor="left"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: isMobile ? "85%" : 320,
//           maxWidth: 320,
//           borderTopRightRadius: 20,
//           borderBottomRightRadius: 20,
//           background: "linear-gradient(135deg, #ffffff 0%, #fafcff 100%)",
//           boxShadow: "8px 0 32px rgba(0,74,173,0.12)",
//         },
//       }}
//     >
//       <Box sx={{ p: 3 }}>
//         <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Box sx={{ width: 32, height: 32, borderRadius: "10px", background: "linear-gradient(135deg, #004AAD 0%, #3b82f6 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <DashboardIcon sx={{ color: "white", fontSize: 18 }} />
//             </Box>
//             <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, background: "linear-gradient(135deg, #004AAD 0%, #3b82f6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
//               Dashboards
//             </Typography>
//           </Box>
//           <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
//         </Box>

//         <Divider sx={{ mb: 2, borderColor: "rgba(0,74,173,0.08)" }} />

//         <Typography variant="subtitle2" sx={{ px: 2, mb: 1, color: "#ef4444", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
//           KPI'S OVERVIEW
//         </Typography>
//         {renderMenuItems(overviewItems, true)}

//         {/* <Typography variant="subtitle2" sx={{ px: 2, mb: 1, color: "#004AAD", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
//           KPI'S
//         </Typography> */}
//         {renderMenuItems(mainItems, false)}

//         <Divider sx={{ my: 2, borderColor: "rgba(0,74,173,0.12)", borderBottomWidth: 2 }} />

//         <Typography variant="subtitle2" sx={{ px: 2, mb: 1, color: "#f43f5e", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
//           OTHER KPIs
//         </Typography>
//         {renderMenuItems(otherKpisItems, false)}
//       </Box>
//     </Drawer>
//   );
// };

// // ─── Main Dashboard ───────────────────────────────────────────────────────────
// const Dashboard = () => {
//   const dispatch  = useDispatch();
//   const navigate  = useNavigate();
//   const location  = useLocation();
//   const [activeTab, setActiveTab] = useState(0);
//   const theme     = useTheme();
//   const isMobile  = useMediaQuery(theme.breakpoints.down("sm"));

//   const {
//     divisionData,
//     traineeTypes,
//     traineeDivision,
//     allAttendance,
//     loading,
//     weeklyAttendance, 
//     monthlyAttendance,  
//     yearlyAttendance,
//   } = useSelector((state) => state.attendanceCard);

//   const [drawerOpen, setDrawerOpen]                   = useState(false);
//   const [cachedAllAttendance, setCachedAllAttendance] = useState(null);
//   const [cachedTraineeTypes, setCachedTraineeTypes]   = useState(null);
//   const cdplcChartRef = useRef(null);
//   const traineeTypeChartRef = useRef(null);

//   const [loadingStates, setLoadingStates] = useState({
//     divisionData:     true,
//     traineeTypes:     true,
//     traineeDivision:  true,
//     allAttendance:    true,
//     weeklyAttendance: true,
//   });

//   const today = new Date().toISOString().split("T")[0];

//   useEffect(() => {
//     const cachedTrainee = localStorage.getItem("dashboard_traineeTypes");
//     if (cachedTrainee) {
//       setCachedTraineeTypes(JSON.parse(cachedTrainee));
//       setLoadingStates((prev) => ({ ...prev, traineeTypes: false }));
//     }
//   }, []);

//   useEffect(() => { if (divisionData?.length > 0)    setLoadingStates((p) => ({ ...p, divisionData:    false })); }, [divisionData]);
//   useEffect(() => {
//     if (traineeTypes?.length > 0) {
//       setLoadingStates((p) => ({ ...p, traineeTypes: false }));
//       localStorage.setItem("dashboard_traineeTypes", JSON.stringify(traineeTypes));
//     }
//   }, [traineeTypes]);
//   useEffect(() => { if (traineeDivision?.length > 0)  setLoadingStates((p) => ({ ...p, traineeDivision:  false })); }, [traineeDivision]);
//   useEffect(() => {
//     if (allAttendance?.length > 0) {
//       setLoadingStates((p) => ({ ...p, allAttendance: false }));
//       localStorage.setItem("dashboard_allAttendance", JSON.stringify(allAttendance));
//     }
//   }, [allAttendance]);
//   useEffect(() => { if (weeklyAttendance?.length > 0) setLoadingStates((p) => ({ ...p, weeklyAttendance: false })); }, [weeklyAttendance]);

//   useEffect(() => {
//     const metaThemeColor = document.querySelector('meta[name="theme-color"]');
//     if (metaThemeColor) metaThemeColor.setAttribute("content", "#004AAD");
//     const fetchData = async () => {
//       try {
//         if (!cachedAllAttendance) dispatch(GetAllAttendance(today, today));
//         if (!cachedTraineeTypes)  dispatch(GetTraineeBasedTypes(today));
//         dispatch(GetCdlBasedDivison(today, today));
//         dispatch(GetTraineeDivisionAttendance(today, today));
//         dispatch(GetCDLWeekAttendance(today));
//         dispatch(GetCDLMonthlyAttendance( ));    
//         dispatch(GetCDLYearlyAttendance( ));
        
//       } catch (error) {
//         console.error("Error dispatching actions:", error);
//       }
//     };
//     fetchData();
//   }, [dispatch, cachedAllAttendance, cachedTraineeTypes, today]);

//   const transformedDivisionData =
//     divisionData?.map((item) => ({
//       division: item.HLD_DIV_CODE || "Unknown",
//       rate: parseFloat(item.PERCENTAGE_EXECUTIVE) || 0,
//       categories: {
//         executive:   { st: parseInt(item.STRENGTH_EXECUTIVE)   || 0, at: parseInt(item.ATTENDANCE_EXECUTIVE)   || 0, percent: parseFloat(item.PERCENTAGE_EXECUTIVE)   || 0 },
//         supervisory: { st: parseInt(item.STRENGTH_SUPERVISORY) || 0, at: parseInt(item.ATTENDANCE_SUPERVISORY) || 0, percent: parseFloat(item.PERCENTAGE_SUPERVISORY) || 0 },
//         clerical: item.STRENGTH_CLERICAL ? { st: parseInt(item.STRENGTH_CLERICAL) || 0, at: 0, percent: 0 } : null,
//       },
//     })) || [];

//   const employeeTypeData  = cachedTraineeTypes || traineeTypes || [];
//   const apiWeek           = weeklyAttendance || [];
//   const attendanceFromApi = apiWeek.map((item) => ({ v: parseInt(item.Attendance) || 0, dayName: item.DayName || "" }));
//   const eligibleFromApi   = apiWeek.map((item) => ({ v: parseInt(item.Eligible)   || 0, dayName: item.DayName || "" }));
//   const rateForChart      = attendanceFromApi.map((a, i) => {
//     const el = eligibleFromApi[i]?.v || 0;
//     return { v: el ? Math.max(0, Math.min(100, Math.round((a.v / el) * 100))) : 0, dayName: a.dayName };
//   });

//   const attendanceData = cachedAllAttendance || allAttendance || [];

//   const handleAttendanceCardClick = (type) => {
//     if (type === "CDPLC") {
//       setActiveTab(0);
//       requestAnimationFrame(() => {
//         cdplcChartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//       });
//       return;
//     }
//     if (type === "Trainee") {
//       setActiveTab(0);
//       requestAnimationFrame(() => {
//         traineeTypeChartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//       });
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "calc(100vh - 120px)",
//         backgroundColor: "#f8faff",
//         padding: { xs: "20px 14px", sm: "28px 20px", md: "36px 28px" },
//         backgroundImage: "radial-gradient(rgba(0,74,173,0.06) 1px, transparent 1px)",
//         backgroundSize: "28px 28px",
//         overflow: "hidden",
//       }}
//     >
//       {/* ── Header ── */}
//       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexShrink: 0 }}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <IconButton
//             onClick={() => setDrawerOpen(true)}
//             sx={{
//               backgroundColor: "#ffffff",
//               boxShadow: "0 2px 8px rgba(0,74,173,0.12)",
//               borderRadius: "12px",
//               padding: "10px",
//               "&:hover": { backgroundColor: "#f5f5f5", transform: "scale(1.05)" },
//               transition: "all 0.2s ease",
//             }}
//           >
//             <MenuIcon sx={{ color: "#004AAD" }} />
//           </IconButton>
//           <Typography
//             variant="h5"
//             sx={{
//               fontWeight: 700,
//               background: "linear-gradient(135deg, #004AAD 0%, #3b82f6 100%)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               fontSize: { xs: "1.2rem", sm: "1.5rem" },
//             }}
//           >
//             {activeTab === 0 ? "HR Dashboard"
//               : activeTab === 1 ? "Financial Dashboard"
//               : activeTab === 4 ? "Company Overview"
//               : activeTab === 5 ? "Own Overview"
//               : "Dashboard"}
//           </Typography>
//         </Box>
//         <Typography
//           variant="body2"
//           sx={{
//             color: "#64748b",
//             backgroundColor: "#ffffff",
//             padding: "6px 12px",
//             borderRadius: "20px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//             display: { xs: "none", sm: "block" },
//           }}
//         >
//           {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
//         </Typography>
//       </Box>

//       <NavigationDrawer
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         activeTab={activeTab}
//         onTabChange={setActiveTab}
//       />

//       {/* ── Scrollable content ── */}
//       <Box
//         sx={{
//           flex: 1,
//           overflowY: "auto",
//           overflowX: "hidden",
//           pr: { xs: 0, sm: 1 },
//           "&::-webkit-scrollbar": { width: "0px" },
//         }}
//       >
//         {/* ── HR Dashboard ── */}
//         {activeTab === 0 && (
//           <Fade in timeout={600}>
//             <Box>

//               {/* ── Attendance KPI Cards ── */}
//               <EmployeeTypeKpiGrid
//                 allAttendance={attendanceData}
//                 loading={loadingStates.allAttendance}
//                 onCardClick={handleAttendanceCardClick}
//               />

              

//               {/* ── CDPLC Breakdown ── */}
//               <Box ref={cdplcChartRef} sx={{ mb: "24px" }}>
//                 {loadingStates.divisionData ? <ChartSkeleton height={300} /> : <CDPLCBreakdown hadDate={today} />}
//               </Box>

//               {/* cdl LocationChat Att */}
//               {/* <Box sx={{ mb: "24px" }}>
//                 <CDLLocationChart  />
//               </Box> */}

//               {/* ── CDPLC Divition Attendance ── */}
//               <Box sx={{ mb: "24px" }}>
//                 <CDLLocBaseAttendance />
//               </Box>

              

//               {/* ──--------- Division Breakdown -----------── */}
//               {/* <Box sx={{ mb: "24px" }}>
//                 {loadingStates.divisionData ? (
//                   <ChartSkeleton height={400} />
//                 ) : (
//                   transformedDivisionData.length > 0 && (
//                     <DivisionBreakdown divisionData={transformedDivisionData} />
//                   )
//                 )}
//               </Box> */}

//               {/* ── Employee Type Chart ── */}
//               <Box ref={traineeTypeChartRef} sx={{ mb: "24px" }}>
//                 {loadingStates.traineeTypes ? <ChartSkeleton height={300} /> : <EmployeeTypeChart employeeTypeData={employeeTypeData} />}
//               </Box>

//               {/* ── Trainees Division Breakdown ── */}
//               <Box sx={{ mb: "24px" }}>
//                 {loadingStates.traineeDivision ? <ChartSkeleton height={400} /> : <TraineesDivisionBreakdown traineeDivisionData={traineeDivision} />}
//               </Box>
//               {/* ── Weekly Attendance ── */}
//               <Box sx={{ mb: "24px" }}>
//                 {loadingStates.weeklyAttendance ? (
//                       <ChartSkeleton height={400} />
//                     ) : (
//                       <WeeklyAttendanceTrend
//                         weeklyApiData={weeklyAttendance || []}
//                         targetEligible={1700}
//                         targetRate={75}
//                       />
//                     )}
//               </Box>
//               {/* <Box sx={{ mb: "24px" }}>
//                 <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: "16px" }}>
//                   <Box>
//                     {loadingStates.weeklyAttendance ? (
//                       <ChartSkeleton height={400} />
//                     ) : (
//                       <WeeklyAttendanceTrend
//                         weeklyApiData={weeklyAttendance || []}
//                         targetEligible={1700}
//                         targetRate={75}
//                       />
//                     )}
//                   </Box>
//                 </Box>
//               </Box> */}

//               <Box sx={{ height: "20px" }} />
//             </Box>
//           </Fade>
//         )}

//         {/* ── Financial Dashboard ── */}
//         {activeTab === 1 && (
//           <Fade in timeout={500}>
//             <Box sx={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white", padding: "40px 36px", borderRadius: "20px", mb: "32px", boxShadow: "0 8px 40px rgba(16,185,129,0.25)" }}>
//               <Typography variant="h4" sx={{ fontWeight: 700, mb: "8px", fontSize: "28px" }}>Financial Dashboard</Typography>
//               <Typography sx={{ fontSize: "16px", opacity: 0.85 }}>Financial metrics, budgets, and fiscal performance overview.</Typography>
//               <Typography sx={{ mt: "24px", fontSize: "14px", opacity: 0.75, fontStyle: "italic" }}>Financial dashboard content coming soon...</Typography>
//             </Box>
//           </Fade>
//         )}

//         {/* ── Company Overview ── */}
//         {activeTab === 4 && (
//           <Fade in timeout={600}>
//             <Box>
//               <CompanyDashboard selectedYear="2026" />
//             </Box>
//           </Fade>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;















import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Fade,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Paper,
  TextField,
  Button,
  Stack,
  Popover,
  Chip,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import CompanyDashboard from "./companyDashboad/index";
import { DivisionBreakdown } from "../../components/Charts/DivisionBreakdown";
import { TraineesDivisionBreakdown } from "../../components/Charts/TraineesDivisionBreakdown";
import WeeklyAttendanceTrend from "../../components/Charts/WeeklyAttendanceTrend";
import { EmployeeTypeChart } from "../../components/Charts/EmployeeTypeChart";
import { CDPLCBreakdown } from "../../components/Charts/CDPLCBreakdown";
import { CDLLocBaseAttendance } from "../../components/Charts/CDLLocBaseAttendance";
import { EmployeeTypeKpiGrid } from "../../components/Charts/EmployeeTypeKpiGrid";
import { CDLLocationAttendanceChart } from "../../components/Charts/CDLLocationAttendanceChart";
import CDLLocationChart from "../../components/Charts/CDLLocationAttendanceChart";
import {
  GetCdlBasedDivison,
  GetTraineeBasedTypes,
  GetTraineeDivisionAttendance,
  GetAllAttendance,
  GetCDLWeekAttendance,
  GetCDLYearlyAttendance,
  GetCDLMonthlyAttendance
} from "../../action/Attendance";
import { Person } from "@material-ui/icons";

// ─── Type normalization ───────────────────────────────────────────────────────
const normalizeType = (value) => {
  const s = (value || "").toString().trim().toLowerCase();
  if (s.includes("cdplc")) return "CDPLC";
  if (s.includes("trainee")) return "Trainee";
  if (s.includes("sub") && s.includes("l")) return "Sub (L)";
  if (s.includes("sub") && s.includes("f")) return "Sub (F)";
  if (s.includes("kry") || s.includes("site")) return "KRY Site";
  return (value || "").toString().trim();
};

const TYPE_ORDER = { CDPLC: 1, "Sub (L)": 2, "Sub (F)": 3, Trainee: 4, "KRY Site": 5 };
const CARD_TYPES = ["CDPLC", "Trainee", "Sub (L)", "Sub (F)",];

// ─── Card color config ────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  CDPLC: { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#c9ddf7", numColor: "#222427", rateColor: "#0314fa" },
  Trainee: { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
  "Sub (L)": { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
  "Sub (F)": { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
  "KRY Site": { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
};

// ─── Build per-type breakdown ─────────────────────────────────────────────────
const buildTypeBreakdown = (allAttendance = []) => {
  const transformed = (allAttendance || [])
    .filter((item) => {
      const t = (item?.Type || item?.TYPE || item?.EmployeeType || item?.employeeType || "").toString().trim();
      return t && t.toUpperCase() !== "TOTAL";
    })
    .map((item) => {
      const type = normalizeType(item?.Type || item?.TYPE || item?.EmployeeType || "Unknown");
      const strength = parseInt(item?.ActualStrength || item?.Strength || 0) || 0;
      const eligible = parseInt(item?.EligibleStrength || item?.Eligible || item?.EligibleCount || item?.EligibleAttendance || 0) || 0;
      const attendance = parseInt(item?.Attendance || 0) || 0;
      return { type, strength, eligible, attendance };
    });

  const merged = {};
  transformed.forEach((row) => {
    if (!merged[row.type]) merged[row.type] = { ...row };
    else {
      merged[row.type].strength += row.strength;
      merged[row.type].eligible += row.eligible;
      merged[row.type].attendance += row.attendance;
    }
  });

  return Object.values(merged).sort(
    (a, b) => (TYPE_ORDER[a.type] || 99) - (TYPE_ORDER[b.type] || 99)
  );
};

// ─── Arc Gauge SVG ────────────────────────────────────────────────────────────
const ARC_LENGTH = Math.PI * 42;

const ArcGauge = ({ rate, color, trackColor }) => {
  const offset = ARC_LENGTH - (ARC_LENGTH * Math.min(rate, 100)) / 100;
  return (
    <Box sx={{ display: "flex", justifyContent: "center", px: 2, pb: 1.5, pt: 0.5 }}>
      <svg width="100" height="54" viewBox="0 0 100 54" style={{ overflow: "visible" }}>
        <path
          d="M8,50 A42,42 0 0,1 92,50"
          fill="none"
          stroke={trackColor}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M8,50 A42,42 0 0,1 92,50"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
    </Box>
  );
};

// ─── Single Attendance KPI Card ───────────────────────────────────────────────
const AttendanceKpiCard = ({ type, strength, eligible, attendance, onClick }) => {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG["CDPLC"];
  const rate = eligible > 0 ? Math.round((attendance / eligible) * 100) : 0;
  const isInteractive = Boolean(onClick);

  const handleKeyDown = (event) => {
    if (!isInteractive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        border: "0.5px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: isInteractive ? "pointer" : "default",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 28px rgba(0,0,0,0.09)",
        },
      }}
    >
      {/* ── Header: type pill + rate ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          px: "16px",
          pt: "14px",
          pb: "12px",
        }}
      >
        <Box
          sx={{
            display: "inline-block",
            px: "9px",
            py: "3px",
            borderRadius: "20px",
            backgroundColor: cfg.pill,
          }}
        >
          <Typography sx={{ fontSize: "14px", fontWeight: 700, color: cfg.pillText }}>
            {type}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ fontSize: "20px", fontWeight: 700, color: cfg.rateColor, lineHeight: 1 }}>
            {rate}%
          </Typography>
        </Box>
      </Box>
      <Divider />

      {/* ── Attendance number (hero) ── */}
      <Box sx={{ textAlign: "center", pt: "14px", pb: 0 }}>
        <Typography
          sx={{
            fontSize: "10px",
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            mb: "4px",
          }}
        >
          Attendance
        </Typography>
        <Typography
          sx={{
            fontSize: "32px",
            fontWeight: 700,
            color: cfg.numColor,
            lineHeight: 1,
          }}
        >
          {(attendance || 0).toLocaleString()}
        </Typography>
      </Box>

      {/* ── Arc gauge ── */}
      <ArcGauge rate={rate} color={cfg.arc} trackColor={cfg.arcTrack} />

      {/* ── Strength + Eligible ── */}
      <Divider />
      <Box sx={{ px: "16px", pt: "10px", pb: "14px", display: "flex", flexDirection: "column", gap: "7px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontSize: "11px", color: "text.secondary", fontWeight: 600 }}>Eligible Strength</Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.primary" }}>
            {(eligible || 0).toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontSize: "11px", color: "text.secondary", fontWeight: 600 }}>Actual Strength</Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.primary" }}>
            {(strength || 0).toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

// ─── KPI Card Skeleton ────────────────────────────────────────────────────────
const KpiCardSkeleton = () => (
  <Box
    sx={{
      position: "relative",
      background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%)",
      borderRadius: "16px",
      padding: "16px",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.8)",
      height: 220,
      "@keyframes shimmer": {
        "0%": { backgroundPosition: "-200% 0" },
        "100%": { backgroundPosition: "200% 0" },
      },
      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s infinite",
        borderRadius: "16px",
      },
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Box sx={{ width: "40%", height: 22, backgroundColor: "rgba(0,74,173,0.1)", borderRadius: "10px" }} />
      <Box sx={{ width: "20%", height: 22, backgroundColor: "rgba(0,74,173,0.08)", borderRadius: "6px" }} />
    </Box>
    <Box sx={{ width: "50%", height: 36, backgroundColor: "rgba(0,74,173,0.12)", borderRadius: "6px", mx: "auto", mb: 1 }} />
    <Box sx={{ width: 100, height: 54, backgroundColor: "rgba(0,74,173,0.07)", borderRadius: "50px", mx: "auto", mb: 2 }} />
    {[1, 2].map((i) => (
      <Box key={i} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ width: "30%", height: 11, backgroundColor: "rgba(0,74,173,0.06)", borderRadius: "6px" }} />
        <Box sx={{ width: "25%", height: 11, backgroundColor: "rgba(0,74,173,0.10)", borderRadius: "6px" }} />
      </Box>
    ))}
  </Box>
);

// ─── Chart Skeleton ───────────────────────────────────────────────────────────
const ChartSkeleton = ({ height = 300 }) => (
  <Box
    sx={{
      position: "relative",
      background: "linear-gradient(135deg, #f7f9ff 0%, #eef2ff 100%)",
      borderRadius: "20px",
      padding: "24px",
      height,
      overflow: "hidden",
      border: "1px solid rgba(0,74,173,0.06)",
      "@keyframes shimmer2": {
        "0%": { backgroundPosition: "-200% 0" },
        "100%": { backgroundPosition: "200% 0" },
      },
      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer2 1.8s infinite",
        borderRadius: "20px",
      },
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Box sx={{ width: "28%", height: 20, backgroundColor: "rgba(0,74,173,0.1)", borderRadius: "6px" }} />
      <Box sx={{ width: "16%", height: 20, backgroundColor: "rgba(0,74,173,0.07)", borderRadius: "6px" }} />
    </Box>
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: "70%" }}>
      {[65, 80, 50, 90, 70, 85, 60].map((h, i) => (
        <Box key={i} sx={{ flex: 1, height: `${h}%`, backgroundColor: "rgba(0,74,173,0.08)", borderRadius: "6px 6px 0 0" }} />
      ))}
    </Box>
  </Box>
);

// ─── Navigation Drawer ────────────────────────────────────────────────────────
const NavigationDrawer = ({ open, onClose, activeTab, onTabChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const overviewItems = [
    { id: 4, label: "Company", icon: <DashboardIcon />, color: "#ef4444", isBold: true },
    { id: 5, label: "Own", icon: <Person />, color: "#f59e0b", isBold: true, disabled: true },
  ];
  const mainItems = [
    { id: 0, label: "HR Dashboard", icon: <PeopleAltIcon />, color: "#004AAD", description: "Employee attendance and performance metrics" },
    { id: 1, label: "Financial Dashboard", icon: <AccountBalanceIcon />, color: "#10b981", description: "Budget tracking and fiscal overview", disabled: true },
    { id: 2, label: "Sales Performance", icon: <TrendingUp />, color: "#f59e0b", description: "Sales metrics and targets", disabled: true },
    { id: 3, label: "Customer Support", icon: <Users />, color: "#8b5cf6", description: "Support ticket analytics", disabled: true },
  ];
  const otherKpisItems = [
    { id: 7, label: "Operational KPIs", icon: <Clock />, color: "#06b6d4", description: "Operational efficiency metrics", disabled: true },
    { id: 8, label: "Quality Metrics", icon: <UserCheck />, color: "#8b5cf6", description: "Quality assurance indicators", disabled: true },
    { id: 9, label: "Project Status", icon: <TrendingUp />, color: "#f43f5e", description: "Project completion rates", disabled: true },
  ];

  const handleTabClick = (tabId) => { onTabChange(tabId); onClose(); };

  const renderMenuItems = (items, showDivider = false) => (
    <>
      <List sx={{ p: 0 }}>
        {items.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleTabClick(item.id)}
              disabled={item.disabled}
              selected={activeTab === item.id}
              sx={{
                borderRadius: "12px", py: 1.5, px: 2, transition: "all 0.2s ease",
                ...(item.isBold && { borderLeft: "4px solid", borderLeftColor: item.color, backgroundColor: "rgba(239,68,68,0.04)" }),
                "&.Mui-selected": {
                  backgroundColor: `${item.color}12`,
                  "&:hover": { backgroundColor: `${item.color}20` },
                  "& .MuiListItemIcon-root": { color: item.color },
                  "& .MuiListItemText-primary": { color: item.color, fontWeight: 600 },
                },
                "&:hover": { backgroundColor: "rgba(0,74,173,0.04)", transform: "translateX(4px)" },
                "&.Mui-disabled": { opacity: 0.5 },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: activeTab === item.id ? item.color : "#64748b", transition: "color 0.2s ease" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.description}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: item.isBold ? 700 : activeTab === item.id ? 600 : 500,
                  ...(item.isBold && { color: item.color }),
                }}
                secondaryTypographyProps={{ fontSize: "0.75rem", sx: { color: "text.secondary", mt: 0.5 } }}
              />
              {item.disabled && (
                <Typography variant="caption" sx={{ bgcolor: "rgba(0,0,0,0.04)", px: 1, py: 0.5, borderRadius: "4px", color: "text.secondary", fontSize: "0.7rem" }}>
                  Coming Soon
                </Typography>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {showDivider && <Divider sx={{ my: 2, borderColor: "rgba(0,74,173,0.08)" }} />}
    </>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "85%" : 320,
          maxWidth: 320,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          background: "linear-gradient(135deg, #ffffff 0%, #fafcff 100%)",
          boxShadow: "8px 0 32px rgba(0,74,173,0.12)",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: "10px", background: "linear-gradient(135deg, #004AAD 0%, #3b82f6 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DashboardIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, background: "linear-gradient(135deg, #004AAD 0%, #3b82f6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Dashboards
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Box>

        <Divider sx={{ mb: 2, borderColor: "rgba(0,74,173,0.08)" }} />

        <Typography variant="subtitle2" sx={{ px: 2, mb: 1, color: "#ef4444", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          KPI'S OVERVIEW
        </Typography>
        {renderMenuItems(overviewItems, true)}

        {renderMenuItems(mainItems, false)}

        <Divider sx={{ my: 2, borderColor: "rgba(0,74,173,0.12)", borderBottomWidth: 2 }} />

        <Typography variant="subtitle2" sx={{ px: 2, mb: 1, color: "#f43f5e", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          OTHER KPIs
        </Typography>
        {renderMenuItems(otherKpisItems, false)}
      </Box>
    </Drawer>
  );
};

// ─── Date Filter Component ───────────────────────────────────────────────────
const DateFilter = ({ selectedDate, onDateChange, onApply, onClear, loading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempDate, setTempDate] = useState(selectedDate);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setTempDate(selectedDate);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    onApply(tempDate);
    handleClose();
  };

  const handleClear = () => {
    const today = new Date().toISOString().split("T")[0];
    setTempDate(today);
    onClear();
    handleClose();
  };

  // Format date for display (MM/DD/YYYY)
  const formatDateDisplay = (date) => {
    if (!date) return "Select Date";
    const parts = date.split("-");
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  };

  return (
    <>
      <Badge
        color="primary"
        variant="dot"
        invisible={selectedDate === new Date().toISOString().split("T")[0]}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: "#004AAD",
          },
        }}
      >
        <Button
          variant="outlined"
          onClick={handleOpen}
          startIcon={<DateRangeIcon />}
          disabled={loading}
          sx={{
            borderRadius: "12px",
            borderColor: "#004AAD20",
            color: "#004AAD",
            textTransform: "none",
            fontWeight: 600,
            minWidth: "130px",
            "&:hover": {
              borderColor: "#004AAD",
              backgroundColor: "#004AAD08",
            },
          }}
        >
          {loading ? "Loading..." : formatDateDisplay(selectedDate)}
        </Button>
      </Badge>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            p: 3,
            borderRadius: "16px",
            minWidth: 320,
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            border: "1px solid rgba(0,74,173,0.08)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>
            Filter by Date
          </Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <TextField
          type="date"
          label="Select Date"
          value={tempDate}
          onChange={(e) => setTempDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#004AAD",
              },
            },
          }}
        />

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={handleClear}
            startIcon={<ClearIcon />}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              color: "#64748b",
              borderColor: "#e2e8f0",
              "&:hover": {
                borderColor: "#94a3b8",
                backgroundColor: "#f1f5f9",
              },
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              flex: 1,
              backgroundColor: "#004AAD",
              "&:hover": {
                backgroundColor: "#003b8f",
              },
            }}
          >
            Apply Filter
          </Button>
        </Stack>

        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {["Today", "Yesterday"].map((label) => {
            const date = label === "Today" ? new Date() : new Date(Date.now() - 86400000);
            const dateStr = date.toISOString().split("T")[0];
            return (
              <Chip
                key={label}
                label={label}
                size="small"
                onClick={() => setTempDate(dateStr)}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: tempDate === dateStr ? "#004AAD10" : "transparent",
                  borderColor: tempDate === dateStr ? "#004AAD" : "#e2e8f0",
                  color: tempDate === dateStr ? "#004AAD" : "#64748b",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#004AAD08",
                  },
                }}
              />
            );
          })}
          {selectedDate !== new Date().toISOString().split("T")[0] && (
            <Chip
              label={`Selected: ${selectedDate}`}
              size="small"
              sx={{
                borderRadius: "8px",
                backgroundColor: "#004AAD10",
                color: "#004AAD",
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      </Popover>
    </>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ─── Central Date State ──────────────────────────────────────────────────────
  
  const [selectedDate, setSelectedDate] = useState(() => {
   // const saved = localStorage.getItem("dashboard_selected_date");
    return new Date().toISOString().split("T")[0];
  });

  const {
    divisionData,
    traineeTypes,
    traineeDivision,
    allAttendance,
    loading,
    weeklyAttendance,
    monthlyAttendance,
    yearlyAttendance,
  } = useSelector((state) => state.attendanceCard);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cachedAllAttendance, setCachedAllAttendance] = useState(null);
  const [cachedTraineeTypes, setCachedTraineeTypes] = useState(null);
  const cdplcChartRef = useRef(null);
  const traineeTypeChartRef = useRef(null);

  const [loadingStates, setLoadingStates] = useState({
    divisionData: true,
    traineeTypes: true,
    traineeDivision: true,
    allAttendance: true,
    weeklyAttendance: true,
  });

  // ─── Fetch Data based on selected date ──────────────────────────────────────
  const fetchDashboardData = (date) => {
    setLoadingStates({
      divisionData: true,
      traineeTypes: true,
      traineeDivision: true,
      allAttendance: true,
      weeklyAttendance: true,
    });

    // Fetch all data with the selected date
    dispatch(GetAllAttendance(date, date));
    dispatch(GetTraineeBasedTypes(date));
    dispatch(GetCdlBasedDivison(date, date));
    dispatch(GetTraineeDivisionAttendance(date, date));
    dispatch(GetCDLWeekAttendance(date));
    dispatch(GetCDLMonthlyAttendance());
    dispatch(GetCDLYearlyAttendance());
  };

  // ─── Handle Date Change ─────────────────────────────────────────────────────
  const handleDateApply = (newDate) => {
    setSelectedDate(newDate);
    //localStorage.setItem("dashboard_selected_date", newDate);
    fetchDashboardData(newDate);
  };

  const handleDateClear = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    //localStorage.setItem("dashboard_selected_date", today);
    fetchDashboardData(today);
  };

  // ─── Load cached data on mount ─────────────────────────────────────────────
  useEffect(() => {
    const cachedTrainee = localStorage.getItem("dashboard_traineeTypes");
    if (cachedTrainee) {
      setCachedTraineeTypes(JSON.parse(cachedTrainee));
      setLoadingStates((prev) => ({ ...prev, traineeTypes: false }));
    }
  }, []);

  // ─── Initial data fetch ─────────────────────────────────────────────────────
  useEffect(() => {
    fetchDashboardData(selectedDate);
  }, []); // Only run once on mount

  // ─── Update loading states when data arrives ──────────────────────────────
  useEffect(() => {
    if (divisionData?.length > 0) {
      setLoadingStates((p) => ({ ...p, divisionData: false }));
    }
  }, [divisionData]);

  useEffect(() => {
    if (traineeTypes?.length > 0) {
      setLoadingStates((p) => ({ ...p, traineeTypes: false }));
      localStorage.setItem("dashboard_traineeTypes", JSON.stringify(traineeTypes));
    }
  }, [traineeTypes]);

  useEffect(() => {
    if (traineeDivision?.length > 0) {
      setLoadingStates((p) => ({ ...p, traineeDivision: false }));
    }
  }, [traineeDivision]);

  useEffect(() => {
    if (allAttendance?.length > 0) {
      setLoadingStates((p) => ({ ...p, allAttendance: false }));
      localStorage.setItem("dashboard_allAttendance", JSON.stringify(allAttendance));
    }
  }, [allAttendance]);

  useEffect(() => {
    if (weeklyAttendance?.length > 0) {
      setLoadingStates((p) => ({ ...p, weeklyAttendance: false }));
    }
  }, [weeklyAttendance]);

  // ─── Page title effect ──────────────────────────────────────────────────────
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute("content", "#004AAD");
  }, []);

  const transformedDivisionData =
    divisionData?.map((item) => ({
      division: item.HLD_DIV_CODE || "Unknown",
      rate: parseFloat(item.PERCENTAGE_EXECUTIVE) || 0,
      categories: {
        executive: { st: parseInt(item.STRENGTH_EXECUTIVE) || 0, at: parseInt(item.ATTENDANCE_EXECUTIVE) || 0, percent: parseFloat(item.PERCENTAGE_EXECUTIVE) || 0 },
        supervisory: { st: parseInt(item.STRENGTH_SUPERVISORY) || 0, at: parseInt(item.ATTENDANCE_SUPERVISORY) || 0, percent: parseFloat(item.PERCENTAGE_SUPERVISORY) || 0 },
        clerical: item.STRENGTH_CLERICAL ? { st: parseInt(item.STRENGTH_CLERICAL) || 0, at: 0, percent: 0 } : null,
      },
    })) || [];

  const employeeTypeData = cachedTraineeTypes || traineeTypes || [];
  const apiWeek = weeklyAttendance || [];
  const attendanceFromApi = apiWeek.map((item) => ({ v: parseInt(item.Attendance) || 0, dayName: item.DayName || "" }));
  const eligibleFromApi = apiWeek.map((item) => ({ v: parseInt(item.Eligible) || 0, dayName: item.DayName || "" }));
  const rateForChart = attendanceFromApi.map((a, i) => {
    const el = eligibleFromApi[i]?.v || 0;
    return { v: el ? Math.max(0, Math.min(100, Math.round((a.v / el) * 100))) : 0, dayName: a.dayName };
  });

  const attendanceData = cachedAllAttendance || allAttendance || [];

  const isDataLoading = Object.values(loadingStates).some(state => state === true);

  const handleAttendanceCardClick = (type) => {
    if (type === "CDPLC") {
      setActiveTab(0);
      requestAnimationFrame(() => {
        cdplcChartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }
    if (type === "Trainee") {
      setActiveTab(0);
      requestAnimationFrame(() => {
        traineeTypeChartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
        backgroundColor: "#f8faff",
        padding: { xs: "20px 14px", sm: "28px 20px", md: "36px 28px" },
        backgroundImage: "radial-gradient(rgba(0,74,173,0.06) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 8px rgba(0,74,173,0.12)",
              borderRadius: "12px",
              padding: "10px",
              "&:hover": { backgroundColor: "#f5f5f5", transform: "scale(1.05)" },
              transition: "all 0.2s ease",
            }}
          >
            <MenuIcon sx={{ color: "#004AAD" }} />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #004AAD 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
            }}
          >
            {activeTab === 0 ? "HR Dashboard"
              : activeTab === 1 ? "Financial Dashboard"
              : activeTab === 4 ? "Company Overview"
              : activeTab === 5 ? "Own Overview"
              : "Dashboard"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* ── Date Filter ── */}
          <DateFilter
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onApply={handleDateApply}
            onClear={handleDateClear}
            loading={isDataLoading}
          />

          {/* ── Date Display ── */}
          
        </Box>
      </Box>

      <NavigationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* ── Scrollable content ── */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          pr: { xs: 0, sm: 1 },
          "&::-webkit-scrollbar": { width: "0px" },
        }}
      >
        {/* ── HR Dashboard ── */}
        {activeTab === 0 && (
          <Fade in timeout={600}>
            <Box>
              {/* ── Attendance KPI Cards ── */}
              <EmployeeTypeKpiGrid
                allAttendance={attendanceData}
                loading={loadingStates.allAttendance}
                onCardClick={handleAttendanceCardClick}
              />

              {/* ── CDPLC Breakdown ── */}
              <Box ref={cdplcChartRef} sx={{ mb: "24px" }}>
                {loadingStates.divisionData ? (
                  <ChartSkeleton height={300} />
                ) : (
                  <CDPLCBreakdown hadDate={selectedDate} />
                )}
              </Box>

              {/* ── CDLLocationChart ── */}
              <Box sx={{ mb: "24px" }}>
                <CDLLocBaseAttendance  hadDate={selectedDate} />
              </Box>

              {/* ── Employee Type Chart ── */}
              <Box ref={traineeTypeChartRef} sx={{ mb: "24px" }}>
                {loadingStates.traineeTypes ? (
                  <ChartSkeleton height={300} />
                ) : (
                  <EmployeeTypeChart employeeTypeData={employeeTypeData} />
                )}
              </Box>

              {/* ── Trainees Division Breakdown ── */}
              <Box sx={{ mb: "24px" }}>
                {loadingStates.traineeDivision ? (
                  <ChartSkeleton height={400} />
                ) : (
                  <TraineesDivisionBreakdown traineeDivisionData={traineeDivision} />
                )}
              </Box>

              {/* ── Weekly Attendance ── */}
              <Box sx={{ mb: "24px" }}>
                {loadingStates.weeklyAttendance ? (
                  <ChartSkeleton height={400} />
                ) : (
                  <WeeklyAttendanceTrend
                    weeklyApiData={weeklyAttendance || []}
                    targetEligible={1700}
                    targetRate={75}
                  />
                )}
              </Box>

              <Box sx={{ height: "20px" }} />
            </Box>
          </Fade>
        )}

        {/* ── Financial Dashboard ── */}
        {activeTab === 1 && (
          <Fade in timeout={500}>
            <Box sx={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white", padding: "40px 36px", borderRadius: "20px", mb: "32px", boxShadow: "0 8px 40px rgba(16,185,129,0.25)" }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: "8px", fontSize: "28px" }}>Financial Dashboard</Typography>
              <Typography sx={{ fontSize: "16px", opacity: 0.85 }}>Financial metrics, budgets, and fiscal performance overview.</Typography>
              <Typography sx={{ mt: "24px", fontSize: "14px", opacity: 0.75, fontStyle: "italic" }}>Financial dashboard content coming soon...</Typography>
            </Box>
          </Fade>
        )}

        {/* ── Company Overview ── */}
        {activeTab === 4 && (
          <Fade in timeout={600}>
            <Box>
              <CompanyDashboard selectedYear="2026" />
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;