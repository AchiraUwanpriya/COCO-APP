// import React, { useEffect ,useState,useMemo} from "react";
// import {
//   Box,
//   Typography,
//   Divider,
//   Paper,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import {
//   Users,
//   CalendarOff,
//   CheckCircle2,
//   XCircle,
//   UsersRound,
//   Building2,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { GetOTEntered } from "../../action/Attendance";

 
// const normalizeType = (value) => {
//   const s = (value || "").toString().trim().toLowerCase();
//   if (s.includes("cdplc")) return "CDPLC";
//   if (s.includes("trainee(naita)")) return "Trainee(NAITA)";
//   if (s.includes("trainee(other)")) return "Trainee (Other)";
//   if (s.includes("trainee")) return "Trainee";
//   if (s.includes("sub") && s.includes("l")) return "Sub (Local)";
//   if (s.includes("sub") && s.includes("f")) return "Sub (Foreign)";
//   if (s.includes("kry") || s.includes("site")) return "KRY Site";
//   return (value || "").toString().trim();
// };

// const TYPE_ORDER = { 
//   CDPLC: 1, 
//   "Sub (Local)": 2, 
//   "Sub (Foreign)": 3, 
//   "Trainee(NAITA)": 4, 
//   "Trainee (Other)": 5,
//   Trainee: 6, 
//   "KRY Site": 7 
// };

// // ─── Card color config ────────────────────────────────────────────────────────
// const TYPE_CONFIG = {
//   CDPLC:      { pill: "#a3cff8", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#c9ddf7", numColor: "#222427", rateColor: "#0314fa" },
//   "Trainee(NAITA)":    { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
//   "Trainee (Other)":    { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
//   "Trainee":    { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
//   "Sub (Local)":  { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
//   "Sub (Foreign)":  { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
//   "KRY Site": { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
// };

// // ─── Build per-type breakdown ─────────────────────────────────────────────────
// const buildTypeBreakdown = (allAttendance = []) => {
//   const transformed = (allAttendance || [])
//     .filter((item) => {
//       const t = (item?.EmployeeType || item?.Type || item?.TYPE || item?.employeeType || "").toString().trim();
//       return t && t.toUpperCase() !== "TOTAL";
//     })
//     .map((item) => {
//       const type       = normalizeType(item?.EmployeeType || item?.Type || item?.TYPE || item?.employeeType || "Unknown");
//       const strength   = parseInt(item?.ActualStrength   || item?.Strength   || 0) || 0;
//       const eligible   = parseInt(item?.EligibleStrength || item?.Eligible   || item?.EligibleCount || item?.EligibleAttendance || 0) || 0;
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

// // ─── Hook: fetch CDPLC live / OT data ────────────────────────────────────────
// const useCdplcLiveData = () => {
//   const dispatch = useDispatch();
//   const { otData } = useSelector((state) => state.attendanceCard);

//   useEffect(() => {
//     dispatch(GetOTEntered());
//   }, [dispatch]);

//   return otData;
// };

// // ─── Arc Gauge SVG (full size — used by CDPLC desktop) ───────────────────────
// const ARC_LENGTH = Math.PI * 42;

// const ArcGauge = ({ rate, color, trackColor }) => {
//   const offset = ARC_LENGTH - (ARC_LENGTH * Math.min(rate, 100)) / 100;
//   return (
//     <Box sx={{ display: "flex", justifyContent: "center", px: 2, pb: 1.5, pt: 0.5 }}>
//       <svg width="100" height="54" viewBox="0 0 100 54" style={{ overflow: "visible" }}>
//         <path
//           d="M8,50 A42,42 0 0,1 92,50"
//           fill="none" stroke={trackColor} strokeWidth="7" strokeLinecap="round"
//         />
//         <path
//           d="M8,50 A42,42 0 0,1 92,50"
//           fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
//           strokeDasharray={ARC_LENGTH} strokeDashoffset={offset}
//           style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
//         />
//       </svg>
//     </Box>
//   );
// };

// const ARC_LENGTH_SM = Math.PI * 34;

// const ArcGaugeSmall = ({ rate, color, trackColor }) => {
//   const offset = ARC_LENGTH_SM - (ARC_LENGTH_SM * Math.min(rate, 100)) / 100;
//   return (
//     <Box sx={{ display: "flex", justifyContent: "center", pb: "4px", pt: "2px" }}>
//       <svg width="80" height="44" viewBox="0 0 80 44" style={{ overflow: "visible" }}>
//         <path
//           d="M6,40 A34,34 0 0,1 74,40"
//           fill="none" stroke={trackColor} strokeWidth="5" strokeLinecap="round"
//         />
//         <path
//           d="M6,40 A34,34 0 0,1 74,40"
//           fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
//           strokeDasharray={ARC_LENGTH_SM} strokeDashoffset={offset}
//           style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
//         />
//       </svg>
//     </Box>
//   );
// };

// // ─── CdplcKpiCard (full-width) ────────────────────────────────────────────────
// export const CdplcKpiCard = ({ strength, eligible, attendance, liveData, onClick }) => {
//   const cfg  = TYPE_CONFIG["CDPLC"];
//   const rate = eligible > 0 ? Math.round((attendance / eligible) * 100) : 0;

//   const liveRows = [
//     { label: "Live Employees", value: liveData?.liveEmployees, color: "#0314fa", icon: <Users       size={14} strokeWidth={2} /> },
//     { label: "Duty Off",       value: liveData?.dutyOff,       color: "#f59e0b", icon: <CalendarOff  size={14} strokeWidth={2} /> },
//     { label: "OT Entered",     value: liveData?.otEntered,     color: "#10b981", icon: <CheckCircle2 size={14} strokeWidth={2} /> },
//     { label: "OT Not Entered", value: liveData?.otNotEntered,  color: "#e53935", icon: <XCircle      size={14} strokeWidth={2} /> },
//   ];

//   const strengthRows = [
//     { label: "Eligible Strength", value: eligible, icon: <UsersRound size={13} strokeWidth={2} /> },
//     { label: "Actual Strength",   value: strength, icon: <Building2  size={13} strokeWidth={2} /> },
//   ];

//   return (
//     <Paper
//       elevation={0}
//       onClick={onClick}
//       sx={{
//         borderRadius: "16px",
//         overflow: "hidden",
//         border: "0.5px solid",
//         borderColor: "divider",
//         background: "linear-gradient(135deg, #EEF2FF 0%)",
//         transition: "transform 0.2s, box-shadow 0.2s",
//         cursor: onClick ? "pointer" : "default",
//         mb: { xs: "10px", sm: "12px", md: "14px" },
//         "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 28px rgba(0,0,0,0.09)" },
//       }}
//     >
//       {/* Header */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "16px", pt: "14px", pb: "12px" }}>
//         <Box sx={{ display: "inline-block", px: "9px", py: "3px", borderRadius: "20px", backgroundColor: cfg.pill }}>
//           <Typography sx={{ fontSize: "14px", fontWeight: 700, color: cfg.pillText }}>CDPLC</Typography>
//         </Box>
//         <Typography sx={{ fontSize: "20px", fontWeight: 700, color: cfg.rateColor, lineHeight: 1 }}>
//           {rate}%
//         </Typography>
//       </Box>

//       <Divider />

//       {/* Mobile view */}
//       <Box sx={{ display: { xs: "block", sm: "none" } }}>
//         <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto 1fr" }}>

//           {/* LEFT COLUMN */}
//           <Box sx={{ display: "flex", flexDirection: "column" }}>
//             <Box sx={{ textAlign: "center", pt: "14px", pb: "12px", px: "8px" }}>
//               <Typography sx={{ fontSize: "10px", color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", mb: "4px" }}>
//                 TOTAL Attendance
//               </Typography>
//               <Typography sx={{ fontSize: "36px", fontWeight: 700, color: cfg.numColor, lineHeight: 1 }}>
//                 {(attendance || 0).toLocaleString()}
//               </Typography>
//               <ArcGauge rate={rate} color={cfg.arc} trackColor={cfg.arcTrack} />
//             </Box>

//             <Divider sx={{ mx: 2, borderBottomWidth: "3px", borderColor: "divider" }} />

//             <Box sx={{ px: "14px", py: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
//               {strengthRows.map(({ label, value, icon }) => (
//                 <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
//                     <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center" }}>{icon}</Box>
//                     <Typography sx={{ fontSize: "11px", color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
//                   </Box>
//                   <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>
//                     {(value || 0).toLocaleString()}
//                   </Typography> 
//                 </Box>
//               ))}
//             </Box>
//           </Box>

//           <Divider orientation="vertical" flexItem sx={{ backgroundColor: "divider", mx: 0 }} />

//           {/* RIGHT COLUMN */}
//           <Box sx={{ display: "flex", flexDirection: "column" }}>
//             <Box sx={{ px: "14px", py: "14px", display: "flex", flexDirection: "column", gap: "8px", justifyContent: "flex-start" }}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: "5px", mb: "2px" }}>
//                 <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#e53935" }} />
//                 <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#e53935", letterSpacing: "0.8px" }}>LIVE</Typography>
//               </Box>
//               {liveRows.map(({ label, value, color, icon }) => (
//                 <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
//                     <Box sx={{ color, display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</Box>
//                     <Typography sx={{ fontSize: "11px", color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
//                   </Box>
//                   <Typography sx={{ fontSize: "13px", fontWeight: 700, color }}>
//                     {value != null ? value.toLocaleString() : "—"}
//                   </Typography>
//                 </Box>
//               ))}
//             </Box>
//             <Box sx={{ flex: 1 }} />
//           </Box>
//         </Box>
//       </Box>

//       {/* Desktop view */}
//       <Box sx={{ display: { xs: "none", sm: "block" } }}>
//         <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", alignItems: "stretch" }}>
//           <Box sx={{ textAlign: "center", pt: "14px", pb: 0, px: "8px" }}>
//             <Typography sx={{ fontSize: "10px", color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", mb: "4px" }}>
//               Attendance
//             </Typography>
//             <Typography sx={{ fontSize: "36px", fontWeight: 700, color: cfg.numColor, lineHeight: 1 }}>
//               {(attendance || 0).toLocaleString()}
//             </Typography>
//             <ArcGauge rate={rate} color={cfg.arc} trackColor={cfg.arcTrack} />
//           </Box>

//           <Divider orientation="vertical" flexItem sx={{ backgroundColor: "divider", my: "12px" }} />
//           <Box sx={{ px: "14px", py: "14px", display: "flex", flexDirection: "column", gap: "9px", justifyContent: "center" }}>
//             <Typography sx={{ fontSize: "10px", color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", mb: "2px" }}>
//               Strength
//             </Typography>
//             {strengthRows.map(({ label, value, icon }) => (
//               <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
//                   <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</Box>
//                   <Typography sx={{ fontSize: "11px", color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
//                 </Box>
//                 <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>
//                   {(value || 0).toLocaleString()}
//                 </Typography>
//               </Box>
//             ))}
//           </Box>

//           <Divider orientation="vertical" flexItem sx={{ backgroundColor: "divider", my: "12px" }} />

//           <Box sx={{ px: "14px", py: "14px", display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: "5px", mb: "2px" }}>
//               <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#e53935" }} />
//               <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#e53935", letterSpacing: "0.8px" }}>LIVE</Typography>
//             </Box>
//             {liveRows.map(({ label, value, color, icon }) => (
//               <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
//                   <Box sx={{ color, display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</Box>
//                   <Typography sx={{ fontSize: "11px", color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
//                 </Box>
//                 <Typography sx={{ fontSize: "13px", fontWeight: 700, color }}>
//                   {value != null ? value.toLocaleString() : "—"}
//                 </Typography>
//               </Box>
//             ))}
//           </Box>

          

          
//         </Box>
//       </Box>
//     </Paper>
//   );
// };

// // ─── AttendanceKpiCard (small card - for Trainee NAITA/OTHER, Sub L/F) ────
// export const AttendanceKpiCard = ({ type, strength, eligible, attendance, onClick }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const cfg  = TYPE_CONFIG[type] || TYPE_CONFIG["CDPLC"];
//   const rate = eligible > 0 ? Math.round((attendance / eligible) * 100) : 0;
//   const isInteractive = Boolean(onClick);

//   const handleKeyDown = (e) => {
//     if (!isInteractive) return;
//     if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }
//   };

//   return (
//     <Paper
//       elevation={0}
//       onClick={onClick}
//       onKeyDown={handleKeyDown}
//       role={isInteractive ? "button" : undefined}
//       tabIndex={isInteractive ? 0 : undefined}
//       sx={{
//         borderRadius: "12px",
//         overflow: "hidden",
//         border: "0.5px solid",
//         borderColor: "divider",
//         backgroundColor: "background.paper",
//         transition: "transform 0.2s, box-shadow 0.2s",
//         cursor: isInteractive ? "pointer" : "default",
//         height: "100%",
//           backgroundColor: ["Sub (Local)", "Sub (Foreign)"].includes(type)
//       ? "#FFF0F6"
//       : "#ecf6f7",
//         display: "flex",
//         flexDirection: "column",
//         "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(0,0,0,0.08)" },
//       }}
//     >
//       {/* Header */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "8px", pt: "8px", pb: "6px", backgroundColor:
//       type === "Sub (Local)" || type === "Sub (Foreign)"
//         ? "#facddf"
//         : "#d5ebdd",  }}>
//         <Box
//   sx={{
//     display: "inline-block",
//     px: "1px",
//     py: "2px",
//     borderRadius: "16px",
//     //backgroundColor: cfg.pill,
//      border: "none",
//   }}
// >
//   <Typography
//     sx={{
//       fontSize: "10px",
//       fontWeight: 700,
//       color: cfg.pillText,
      
//     }}
//   >
//     {type}
//   </Typography>
// </Box>
//         <Typography sx={{ fontSize: "13px", fontWeight: 700, color: cfg.rateColor, lineHeight: 1 }}>
//           {rate}%
//         </Typography>
//       </Box>

//       <Divider sx={{ my: 0 }} />

//       {/* Attendance */}
//       <Box sx={{ textAlign: "center", pt: "6px", pb: "4px", px: "4px" }}>
//         <Typography sx={{ fontSize: "8px", color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px", mb: "2px" }}>
//           Attendance
//         </Typography>
//         <Typography sx={{ fontSize: "18px", fontWeight: 700, color: cfg.numColor, lineHeight: 1 }}>
//           {(attendance || 0).toLocaleString()}
//         </Typography>
//       </Box>

//       {/* Arc gauge - DESKTOP ONLY */}
//       {!isMobile && (
//         <Box sx={{ mt: "-4px", mb: "-6px" }}>
//           <ArcGaugeSmall rate={rate} color={cfg.arc} trackColor={cfg.arcTrack} />
//         </Box>
//       )}

//       {/* Strength rows */}
//       <Divider sx={{ my: "4px" }} />
//       <Box sx={{ px: "8px", py: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
//         {[
//           { label: "Eligible", value: eligible },
//           { label: "Actual",   value: strength },
//         ].map(({ label, value, icon }) => (
//           <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: "3px" }}>
//               <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center" }}>{icon}</Box>
//               <Typography sx={{ fontSize: "8px", color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
//             </Box>
//             <Typography sx={{ fontSize: "10px", fontWeight: 600, color: "text.primary" }}>
//               {(value || 0).toLocaleString()}
//             </Typography>
//           </Box>
//         ))}
//       </Box>
//     </Paper>
//   );
// };

// // ─── Skeleton components ──────────────────────────────────────────────────────
// export const KpiCardSkeleton = () => (
//   <Box sx={{ 
//     borderRadius: "12px", 
//     padding: "12px", 
//     background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%)",
//     height: "100%",
//     minHeight: 130,
//     position: "relative",
//     overflow: "hidden",
//     "@keyframes shimmer": { 
//       "0%": { backgroundPosition: "-200% 0" }, 
//       "100%": { backgroundPosition: "200% 0" } 
//     },
//     "&::after": { 
//       content: '""', 
//       position: "absolute", 
//       inset: 0, 
//       background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)", 
//       backgroundSize: "200% 100%", 
//       animation: "shimmer 1.8s infinite", 
//       borderRadius: "12px" 
//     }
//   }}>
//     <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
//       <Box sx={{ width: "35%", height: 16, backgroundColor: "rgba(0,74,173,0.1)", borderRadius: "8px" }} />
//       <Box sx={{ width: "15%", height: 16, backgroundColor: "rgba(0,74,173,0.08)", borderRadius: "4px" }} />
//     </Box>
//     <Box sx={{ width: "40%", height: 22, backgroundColor: "rgba(0,74,173,0.12)", borderRadius: "4px", mx: "auto", mb: 1 }} />
//     <Box sx={{ width: 60, height: 30, backgroundColor: "rgba(0,74,173,0.07)", borderRadius: "30px", mx: "auto", mb: 1 }} />
//     <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
//       <Box sx={{ width: "25%", height: 8, backgroundColor: "rgba(0,74,173,0.06)", borderRadius: "4px" }} />
//       <Box sx={{ width: "20%", height: 8, backgroundColor: "rgba(0,74,173,0.10)", borderRadius: "4px" }} />
//     </Box>
//     <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//       <Box sx={{ width: "25%", height: 8, backgroundColor: "rgba(0,74,173,0.06)", borderRadius: "4px" }} />
//       <Box sx={{ width: "20%", height: 8, backgroundColor: "rgba(0,74,173,0.10)", borderRadius: "4px" }} />
//     </Box>
//   </Box>
// );

// export const CdplcCardSkeleton = () => (
//   <Box sx={{ 
//     position: "relative", 
//     background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%)", 
//     borderRadius: "16px", 
//     padding: "20px", 
//     overflow: "hidden", 
//     border: "1px solid rgba(255,255,255,0.8)", 
//     height: 140, 
//     mb: { xs: "10px", sm: "12px", md: "14px" }, 
//     "@keyframes shimmer": { 
//       "0%": { backgroundPosition: "-200% 0" }, 
//       "100%": { backgroundPosition: "200% 0" } 
//     }, 
//     "&::after": { 
//       content: '""', 
//       position: "absolute", 
//       inset: 0, 
//       background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)", 
//       backgroundSize: "200% 100%", 
//       animation: "shimmer 1.8s infinite", 
//       borderRadius: "16px" 
//     }
//   }}>
//     <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//       <Box sx={{ width: "15%", height: 22, backgroundColor: "rgba(0,74,173,0.1)", borderRadius: "10px" }} />
//       <Box sx={{ width: "8%",  height: 22, backgroundColor: "rgba(0,74,173,0.08)", borderRadius: "6px" }} />
//     </Box>
//     <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
//       {[1, 2, 3].map((i) => (
//         <Box key={i}>
//           <Box sx={{ width: "60%", height: 32, backgroundColor: "rgba(0,74,173,0.12)", borderRadius: "6px", mb: 1 }} />
//           {[1, 2].map((j) => (
//             <Box key={j} sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
//               <Box sx={{ width: "45%", height: 10, backgroundColor: "rgba(0,74,173,0.06)", borderRadius: "4px" }} />
//               <Box sx={{ width: "25%", height: 10, backgroundColor: "rgba(0,74,173,0.10)", borderRadius: "4px" }} />
//             </Box>
//           ))}
//         </Box>
//       ))}
//     </Box>
//   </Box>
// );

// // ─── EmployeeTypeKpiGrid — main export ───────────────────────────────────────
// export const EmployeeTypeKpiGrid = ({ allAttendance, loading, onCardClick ,locations = [],onSearch}) => {
//   const breakdown = buildTypeBreakdown(allAttendance);
//   const byType = {};
//   breakdown.forEach((row) => { byType[row.type] = row; });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [expandedItems, setExpandedItems] = useState({});
//   const [allExpanded, setAllExpanded] = useState(false);

//   breakdown.forEach((row) => { byType[row.type] = row; });



//   const liveData = useCdplcLiveData();
//    const filteredLocations = useMemo(() => {
//     if (!searchTerm.trim()) return locations;
    
//     const term = searchTerm.toLowerCase();
//     return locations.filter(location => 
//       location.name?.toLowerCase().includes(term) ||
//       location.code?.toLowerCase().includes(term) ||
//       location.address?.toLowerCase().includes(term)
//     );
//   }, [locations, searchTerm]);

//   // Auto-expand all when searching
//   useEffect(() => {
//     if (searchTerm.trim()) {
//       // Expand all items when searching
//       const allExpandedState = {};
//       filteredLocations.forEach(location => {
//         allExpandedState[location.id] = true;
//       });
//       setExpandedItems(allExpandedState);
//       setAllExpanded(true);
//     } else {
//       // Optional: collapse all when search is cleared
//       // setExpandedItems({});
//       // setAllExpanded(false);
//     }
//   }, [searchTerm, filteredLocations]);

//   const handleSearchChange = (event) => {
//     const value = event.target.value;
//     setSearchTerm(value);
//     if (onSearch) onSearch(value);
//   };

//   const toggleExpand = (locationId) => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [locationId]: !prev[locationId]
//     }));
//   };

//   const expandAll = () => {
//     const allExpandedState = {};
//     filteredLocations.forEach(location => {
//       allExpandedState[location.id] = true;
//     });
//     setExpandedItems(allExpandedState);
//     setAllExpanded(true);
//   };

//   const collapseAll = () => {
//     setExpandedItems({});
//     setAllExpanded(false);
//   };
 
//   const cardTypes = ["Trainee(NAITA)",  "Sub (Local)", "Sub (Foreign)"];

//   return (
//     <Box sx={{ mb: "24px" }}>
//       {/* Row 1: CDPLC full width */}
//       {loading ? (
//         <CdplcCardSkeleton />
//       ) : (
//         <CdplcKpiCard
//           strength={byType["CDPLC"]?.strength   || 0}
//           eligible={byType["CDPLC"]?.eligible   || 0}
//           attendance={byType["CDPLC"]?.attendance || 0}
//           liveData={liveData}
//           onClick={onCardClick ? () => onCardClick("CDPLC") : undefined}
//         />
//       )}

//       {/* Row 2: 4 cards - ALWAYS in a single row (4 columns) on ALL screen sizes */}
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: "repeat(3, 1fr)",  
//           gap: { xs: "8px", sm: "12px", md: "14px" },
//           alignItems: "stretch",
//           mt: { xs: "8px", sm: "12px" },
//           overflowX: "auto",  
//           minWidth: 0,  
//         }}
//       >
//         {cardTypes.map((type) =>
//           loading ? (
//             <KpiCardSkeleton key={type} />
//           ) : (
//             <AttendanceKpiCard
//               key={type}
//               type={type}
//               strength={byType[type]?.strength   || 0}
//               eligible={byType[type]?.eligible   || 0}
//               attendance={byType[type]?.attendance || 0}
//               onClick={onCardClick ? () => onCardClick(type) : undefined}
//             />
//           )
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default EmployeeTypeKpiGrid;







import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  InputAdornment,
  Chip,
  CircularProgress,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Users,
  CalendarOff,
  CheckCircle2,
  XCircle,
  UsersRound,
  Building2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { GetOTEntered, GetCDLOTEmployee, GetCDLDutyoffEmployee } from "../../action/Attendance";
import axios from "axios";

const normalizeType = (value) => {
  const s = (value || "").toString().trim().toLowerCase();
  if (s.includes("cdplc")) return "CDPLC";
  if (s.includes("trainee(naita)")) return "Trainee(NAITA)";
  if (s.includes("trainee(other)")) return "Trainee (Other)";
  if (s.includes("trainee")) return "Trainee";
  if (s.includes("sub") && s.includes("l")) return "Sub (Local)";
  if (s.includes("sub") && s.includes("f")) return "Sub (Foreign)";
  if (s.includes("kry") || s.includes("site")) return "KRY Site";
  return (value || "").toString().trim();
};

const TYPE_ORDER = {
  CDPLC: 1,
  "Sub (Local)": 2,
  "Sub (Foreign)": 3,
  "Trainee(NAITA)": 4,
  "Trainee (Other)": 5,
  Trainee: 6,
  "KRY Site": 7
};

const TYPE_CONFIG = {
  CDPLC: { pill: "#a3cff8", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#c9ddf7", numColor: "#222427", rateColor: "#0314fa" },
  "Trainee(NAITA)": { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
  "Trainee (Other)": { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
  "Trainee": { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
  "Sub (Local)": { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
  "Sub (Foreign)": { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
  "KRY Site": { pill: "#E6F1FB", pillText: "#1e2225", arc: "#0314fa", arcTrack: "#DBEAFE", numColor: "#222427", rateColor: "#0314fa" },
};


const buildTypeBreakdown = (allAttendance = []) => {
  const transformed = (allAttendance || [])
    .filter((item) => {
      const t = (item?.EmployeeType || item?.Type || item?.TYPE || item?.employeeType || "").toString().trim();
      return t && t.toUpperCase() !== "TOTAL";
    })
    .map((item) => {
      const type = normalizeType(item?.EmployeeType || item?.Type || item?.TYPE || item?.employeeType || "Unknown");
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

// ─── Hook: fetch CDPLC live / OT data ────────────────────────────────────────
const useCdplcLiveData = () => {
  const dispatch = useDispatch();
  const { otData } = useSelector((state) => state.attendanceCard);

  useEffect(() => {
    dispatch(GetOTEntered());
  }, [dispatch]);

  return otData;
};

const fetchEmployeeImage = async (serviceNo) => {
  if (!serviceNo) return null;

  const cleanAuthKey = (() => {
    const raw = sessionStorage.getItem("token");
    if (!raw) return "";
    try { return JSON.parse(raw) || raw; } catch { return raw; }
  })();

  const imageUrl = `${axios.defaults.baseURL}home/GetUserImg?serviceNo=${serviceNo}&authKey=${encodeURIComponent(cleanAuthKey.replace(/"/g, ""))}`;

  try {
    const response = await fetch(imageUrl, { method: "GET" });

    if (!response.ok) {
      console.warn(`Failed to fetch image for serviceNo: ${serviceNo}`);
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.startsWith("image/")) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }

    return null;
  } catch (error) {
    console.error(`Error fetching image for ${serviceNo}:`, error);
    return null;
  }
};

const ARC_LENGTH = Math.PI * 42;

const ArcGauge = ({ rate, color, trackColor }) => {
  const offset = ARC_LENGTH - (ARC_LENGTH * Math.min(rate, 100)) / 100;
  return (
    <Box sx={{ display: "flex", justifyContent: "center", px: 2, pb: 1.5, pt: 0.5 }}>
      <svg width="100" height="54" viewBox="0 0 100 54" style={{ overflow: "visible" }}>
        <path
          d="M8,50 A42,42 0 0,1 92,50"
          fill="none" stroke={trackColor} strokeWidth="7" strokeLinecap="round"
        />
        <path
          d="M8,50 A42,42 0 0,1 92,50"
          fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={ARC_LENGTH} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
    </Box>
  );
};

const ARC_LENGTH_SM = Math.PI * 34;

const ArcGaugeSmall = ({ rate, color, trackColor }) => {
  const offset = ARC_LENGTH_SM - (ARC_LENGTH_SM * Math.min(rate, 100)) / 100;
  return (
    <Box sx={{ display: "flex", justifyContent: "center", pb: "4px", pt: "2px" }}>
      <svg width="80" height="44" viewBox="0 0 80 44" style={{ overflow: "visible" }}>
        <path
          d="M6,40 A34,34 0 0,1 74,40"
          fill="none" stroke={trackColor} strokeWidth="5" strokeLinecap="round"
        />
        <path
          d="M6,40 A34,34 0 0,1 74,40"
          fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={ARC_LENGTH_SM} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
    </Box>
  );
};

export const CdplcKpiCard = ({ strength, eligible, attendance, liveData, onClick, onMetricClick }) => {
  const cfg = TYPE_CONFIG["CDPLC"];
  const rate = eligible > 0 ? Math.round((attendance / eligible) * 100) : 0;

  const liveRows = [
    { label: "Live Employees", value: liveData?.liveEmployees, color: "#0314fa", icon: <Users size={14} strokeWidth={2} /> },
    { label: "Duty Off", value: liveData?.dutyOff, color: "#f59e0b", icon: <CalendarOff size={14} strokeWidth={2} /> },
    { label: "OT Entered", value: liveData?.otEntered, color: "#10b981", icon: <CheckCircle2 size={14} strokeWidth={2} /> },
    { label: "OT Not Entered", value: liveData?.otNotEntered, color: "#e53935", icon: <XCircle size={14} strokeWidth={2} /> },
  ];

  const strengthRows = [
    { label: "Eligible Strength", value: eligible, icon: <UsersRound size={13} strokeWidth={2} /> },
    { label: "Actual Strength", value: strength, icon: <Building2 size={13} strokeWidth={2} /> },
  ];

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        border: "0.5px solid",
        borderColor: "divider",
        background: "linear-gradient(135deg, #EEF2FF 0%)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: onClick ? "pointer" : "default",
        mb: { xs: "10px", sm: "12px", md: "14px" },
        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 28px rgba(0,0,0,0.09)" },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "16px", pt: "14px", pb: "12px" }}>
        <Box sx={{ display: "inline-block", px: "9px", py: "3px", borderRadius: "20px", backgroundColor: cfg.pill }}>
          <Typography sx={{ fontSize: "14px", fontWeight: 700, color: cfg.pillText }}>CDPLC</Typography>
        </Box>
        <Typography sx={{ fontSize: "20px", fontWeight: 700, color: cfg.rateColor, lineHeight: 1 }}>
          {rate}%
        </Typography>
      </Box>

      <Divider />

      {/* Mobile view */}
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto 1fr" }}>

          {/* LEFT COLUMN */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ textAlign: "center", pt: "14px", pb: "12px", px: "8px" }}>
              <Typography sx={{ fontSize: "10px", color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", mb: "4px" }}>
                TOTAL Attendance
              </Typography>
              <Typography sx={{ fontSize: "36px", fontWeight: 700, color: cfg.numColor, lineHeight: 1 }}>
                {(attendance || 0).toLocaleString()}
              </Typography>
              <ArcGauge rate={rate} color={cfg.arc} trackColor={cfg.arcTrack} />
            </Box>

            <Divider sx={{ mx: 2, borderBottomWidth: "3px", borderColor: "divider" }} />

            <Box sx={{ px: "14px", py: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {strengthRows.map(({ label, value, icon }) => (
                <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center" }}>{icon}</Box>
                    <Typography sx={{ fontSize: "11px", color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>
                    {(value || 0).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "divider", mx: 0 }} />

          {/* RIGHT COLUMN */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ px: "14px", py: "14px", display: "flex", flexDirection: "column", gap: "2px", justifyContent: "flex-start" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "5px", mb: "2px" }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#e53935" }} />
                <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#e53935", letterSpacing: "0.8px" }}>LIVE</Typography>
              </Box>
              {liveRows.map(({ label, value, color, icon }) => {
                const isClickable = label === "Duty Off" || label === "OT Entered";
                return (
                  <Box
                    key={label}
                    onClick={(e) => {
                      if (isClickable && onMetricClick) {
                        e.stopPropagation();
                        onMetricClick(label);
                      }
                    }}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: isClickable && onMetricClick ? "pointer" : "default",
                      padding: "2px 0px",
                      borderRadius: "4px",
                      transition: "background-color 0.2s",
                      "&:hover": {
                        backgroundColor: isClickable && onMetricClick ? "rgba(3, 20, 250, 0.08)" : "transparent",
                      }
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <Box sx={{ color, display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</Box>
                      <Typography sx={{ fontSize: "11px", color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: "13px", fontWeight: 700, color }}>
                      {value != null ? value.toLocaleString() : "—"}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Box sx={{ flex: 1 }} />
          </Box>
        </Box>
      </Box>

      {/* Desktop view */}
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", alignItems: "stretch" }}>
          <Box sx={{ textAlign: "center", pt: "14px", pb: 0, px: "8px" }}>
            <Typography sx={{ fontSize: "10px", color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", mb: "4px" }}>
              Attendance
            </Typography>
            <Typography sx={{ fontSize: "36px", fontWeight: 700, color: cfg.numColor, lineHeight: 1 }}>
              {(attendance || 0).toLocaleString()}
            </Typography>
            <ArcGauge rate={rate} color={cfg.arc} trackColor={cfg.arcTrack} />
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "divider", my: "12px" }} />
          <Box sx={{ px: "14px", py: "14px", display: "flex", flexDirection: "column", gap: "9px", justifyContent: "center" }}>
            <Typography sx={{ fontSize: "10px", color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", mb: "2px" }}>
              Strength
            </Typography>
            {strengthRows.map(({ label, value, icon }) => (
              <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</Box>
                  <Typography sx={{ fontSize: "11px", color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
                </Box>
                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>
                  {(value || 0).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "divider", my: "12px" }} />

          <Box sx={{ px: "14px", py: "14px", display: "flex", flexDirection: "column", gap: "2px", justifyContent: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px", mb: "2px" }}>
              <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#e53935" }} />
              <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#e53935", letterSpacing: "0.8px" }}>LIVE</Typography>
            </Box>
            {liveRows.map(({ label, value, color, icon }) => {
              const isClickable = label === "Duty Off" || label === "OT Entered";
              return (
                <Box
                  key={label}
                  onClick={(e) => {
                    if (isClickable && onMetricClick) {
                      e.stopPropagation();
                      onMetricClick(label);
                    }
                  }}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: isClickable && onMetricClick ? "pointer" : "default",
                    padding: "2px 0px",
                    borderRadius: "4px",
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: isClickable && onMetricClick ? "rgba(3, 20, 250, 0.08)" : "transparent",
                    }
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Box sx={{ color, display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</Box>
                    <Typography sx={{ fontSize: "11px", color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: 700, color }}>
                    {value != null ? value.toLocaleString() : "—"}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};


export const AttendanceKpiCard = ({ type, strength, eligible, attendance, onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG["CDPLC"];
  const rate = eligible > 0 ? Math.round((attendance / eligible) * 100) : 0;
  const isInteractive = Boolean(onClick);

  const handleKeyDown = (e) => {
    if (!isInteractive) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }
  };

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        border: "0.5px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: isInteractive ? "pointer" : "default",
        height: "100%",
        backgroundColor: ["Sub (Local)", "Sub (Foreign)"].includes(type)
          ? "#FFF0F6"
          : "#ecf6f7",
        display: "flex",
        flexDirection: "column",
        "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(0,0,0,0.08)" },
      }}
    >
      {/* Header */}
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: "8px",
        pt: "8px",
        pb: "6px",
        backgroundColor:
          type === "Sub (Local)" || type === "Sub (Foreign)"
            ? "#facddf"
            : "#d5ebdd",
      }}>
        <Box
          sx={{
            display: "inline-block",
            px: "1px",
            py: "2px",
            borderRadius: "16px",
            border: "none",
          }}
        >
          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: 700,
              color: cfg.pillText,
            }}
          >
            {type}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "13px", fontWeight: 700, color: cfg.rateColor, lineHeight: 1 }}>
          {rate}%
        </Typography>
      </Box>

      <Divider sx={{ my: 0 }} />

      {/* Attendance */}
      <Box sx={{ textAlign: "center", pt: "6px", pb: "4px", px: "4px" }}>
        <Typography sx={{ fontSize: "8px", color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px", mb: "2px" }}>
          Attendance
        </Typography>
        <Typography sx={{ fontSize: "18px", fontWeight: 700, color: cfg.numColor, lineHeight: 1 }}>
          {(attendance || 0).toLocaleString()}
        </Typography>
      </Box>

      {/* Arc gauge - DESKTOP ONLY */}
      {!isMobile && (
        <Box sx={{ mt: "-4px", mb: "-6px" }}>
          <ArcGaugeSmall rate={rate} color={cfg.arc} trackColor={cfg.arcTrack} />
        </Box>
      )}

      {/* Strength rows */}
      <Divider sx={{ my: "4px" }} />
      <Box sx={{ px: "8px", py: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {[
          { label: "Eligible", value: eligible },
          { label: "Actual", value: strength },
        ].map(({ label, value, icon }) => (
          <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center" }}>{icon}</Box>
              <Typography sx={{ fontSize: "8px", color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
            </Box>
            <Typography sx={{ fontSize: "10px", fontWeight: 600, color: "text.primary" }}>
              {(value || 0).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export const KpiCardSkeleton = () => (
  <Box sx={{
    borderRadius: "12px",
    padding: "12px",
    background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%)",
    height: "100%",
    minHeight: 130,
    position: "relative",
    overflow: "hidden",
    "@keyframes shimmer": {
      "0%": { backgroundPosition: "-200% 0" },
      "100%": { backgroundPosition: "200% 0" }
    },
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.8s infinite",
      borderRadius: "12px"
    }
  }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
      <Box sx={{ width: "35%", height: 16, backgroundColor: "rgba(0,74,173,0.1)", borderRadius: "8px" }} />
      <Box sx={{ width: "15%", height: 16, backgroundColor: "rgba(0,74,173,0.08)", borderRadius: "4px" }} />
    </Box>
    <Box sx={{ width: "40%", height: 22, backgroundColor: "rgba(0,74,173,0.12)", borderRadius: "4px", mx: "auto", mb: 1 }} />
    <Box sx={{ width: 60, height: 30, backgroundColor: "rgba(0,74,173,0.07)", borderRadius: "30px", mx: "auto", mb: 1 }} />
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
      <Box sx={{ width: "25%", height: 8, backgroundColor: "rgba(0,74,173,0.06)", borderRadius: "4px" }} />
      <Box sx={{ width: "20%", height: 8, backgroundColor: "rgba(0,74,173,0.10)", borderRadius: "4px" }} />
    </Box>
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "25%", height: 8, backgroundColor: "rgba(0,74,173,0.06)", borderRadius: "4px" }} />
      <Box sx={{ width: "20%", height: 8, backgroundColor: "rgba(0,74,173,0.10)", borderRadius: "4px" }} />
    </Box>
  </Box>
);


export const CdplcCardSkeleton = () => (
  <Box sx={{
    position: "relative",
    background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%)",
    borderRadius: "16px",
    padding: "20px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.8)",
    height: 140,
    mb: { xs: "10px", sm: "12px", md: "14px" },
    "@keyframes shimmer": {
      "0%": { backgroundPosition: "-200% 0" },
      "100%": { backgroundPosition: "200% 0" }
    },
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.8s infinite",
      borderRadius: "16px"
    }
  }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Box sx={{ width: "15%", height: 22, backgroundColor: "rgba(0,74,173,0.1)", borderRadius: "10px" }} />
      <Box sx={{ width: "8%", height: 22, backgroundColor: "rgba(0,74,173,0.08)", borderRadius: "6px" }} />
    </Box>
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
      {[1, 2, 3].map((i) => (
        <Box key={i}>
          <Box sx={{ width: "60%", height: 32, backgroundColor: "rgba(0,74,173,0.12)", borderRadius: "6px", mb: 1 }} />
          {[1, 2].map((j) => (
            <Box key={j} sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Box sx={{ width: "45%", height: 10, backgroundColor: "rgba(0,74,173,0.06)", borderRadius: "4px" }} />
              <Box sx={{ width: "25%", height: 10, backgroundColor: "rgba(0,74,173,0.10)", borderRadius: "4px" }} />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  </Box>
);

// ─── EmployeeTypeKpiGrid — main export ───────────────────────────────────────
export const EmployeeTypeKpiGrid = ({ allAttendance, loading, onCardClick, locations = [], onSearch }) => {
  const breakdown = buildTypeBreakdown(allAttendance);
  const byType = {};
  breakdown.forEach((row) => { byType[row.type] = row; });
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState({});
  const [allExpanded, setAllExpanded] = useState(false);

  breakdown.forEach((row) => { byType[row.type] = row; });

  const liveData = useCdplcLiveData();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [modalSearchTerm, setModalSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { otEmployees, dutyOffEmployees, loading: employeeListLoading } = useSelector(
    (state) => state.attendanceCard
  );
  const [employeeListError, setEmployeeListError] = useState(null);

  // ─── New state for employee images ──────────────────────────────────────────
  const [employeeImages, setEmployeeImages] = useState({});
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    if (!modalOpen) return;

    setEmployeeImages({});
    setEmployeeListError(null);

    if (selectedMetric === "OT Entered") {
      dispatch(GetCDLOTEmployee());
    } else if (selectedMetric === "Duty Off") {
      dispatch(GetCDLDutyoffEmployee());
    }
  }, [modalOpen, selectedMetric, dispatch]);

  useEffect(() => {
    const source = selectedMetric === "OT Entered" ? otEmployees : selectedMetric === "Duty Off" ? dutyOffEmployees : [];
    
    if (source.length > 0) {
      source.forEach((row) => {
        const serviceNo = row.servidce_no || row.service_no || row.ServiceNo;
        if (serviceNo && !employeeImages[serviceNo] && !imageLoading[serviceNo]) {
          setImageLoading(prev => ({ ...prev, [serviceNo]: true }));
          
          fetchEmployeeImage(serviceNo)
            .then(imageUrl => {
              if (imageUrl) {
                setEmployeeImages(prev => ({ ...prev, [serviceNo]: imageUrl }));
              }
              setImageLoading(prev => ({ ...prev, [serviceNo]: false }));
            })
            .catch(() => {
              setImageLoading(prev => ({ ...prev, [serviceNo]: false }));
            });
        }
      });
    }
  }, [otEmployees, dutyOffEmployees, selectedMetric]);

  useEffect(() => {
    return () => {
      Object.values(employeeImages).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  const normalizedEmployeeRows = useMemo(() => {
    const source =
      selectedMetric === "OT Entered" ? otEmployees :
        selectedMetric === "Duty Off" ? dutyOffEmployees :
          [];

    return source.map((row) => ({
      id: row.servidce_no || row.service_no || row.ServiceNo || "—",
      name:
        row.name ||
        `${row.first_name ? row.first_name.charAt(0) + "." : ""} ${row.last_name || ""}`.trim() ||
        "—",
      designation: row.dep || "—",
      location: row.loc || "—",
      division: row.div || "—",
      start_time: selectedMetric === "OT Entered"
        ? (row.start_time
          ? new Date(row.start_time).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          : "—")
        : "—",
    }));
  }, [selectedMetric, otEmployees, dutyOffEmployees]);

  const filteredEmployees = useMemo(() => {
    if (!modalSearchTerm.trim()) return normalizedEmployeeRows;
    const term = modalSearchTerm.toLowerCase();
    return normalizedEmployeeRows.filter(
      (row) =>
        row.id.toLowerCase().includes(term) ||
        row.name.toLowerCase().includes(term)
    );
  }, [normalizedEmployeeRows, modalSearchTerm]);

  const filteredLocations = useMemo(() => {
    if (!searchTerm.trim()) return locations;

    const term = searchTerm.toLowerCase();
    return locations.filter(location =>
      location.name?.toLowerCase().includes(term) ||
      location.code?.toLowerCase().includes(term) ||
      location.address?.toLowerCase().includes(term)
    );
  }, [locations, searchTerm]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const allExpandedState = {};
      filteredLocations.forEach(location => {
        allExpandedState[location.id] = true;
      });
      setExpandedItems(allExpandedState);
      setAllExpanded(true);
    } else {
    }
  }, [searchTerm, filteredLocations]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const toggleExpand = (locationId) => {
    setExpandedItems(prev => ({
      ...prev,
      [locationId]: !prev[locationId]
    }));
  };

  const expandAll = () => {
    const allExpandedState = {};
    filteredLocations.forEach(location => {
      allExpandedState[location.id] = true;
    });
    setExpandedItems(allExpandedState);
    setAllExpanded(true);
  };

  const collapseAll = () => {
    setExpandedItems({});
    setAllExpanded(false);
  };

  const cardTypes = ["Trainee(NAITA)", "Sub (Local)", "Sub (Foreign)"];

  const EmployeeRow = ({ row, index }) => {
    const serviceNo = row.id;
    const imageUrl = employeeImages[serviceNo];
    const isLoading = imageLoading[serviceNo];
    const isError = !imageUrl && !isLoading;

    return (
      <TableRow
        key={`${row.id}-${index}`}
        sx={{
          "&:nth-of-type(even)": { backgroundColor: "rgba(0, 74, 173, 0.02)" },
          "&:hover": { backgroundColor: "rgba(0, 74, 173, 0.05)" },
        }}
      >
        <TableCell sx={{ fontWeight: 600, fontSize: "12px", py: "5px", color: "#004AAD", width: { xs: "65px", sm: "80px" }, minWidth: { xs: "65px", sm: "80px" } }}>
          {row.id}
        </TableCell>
        <TableCell sx={{ fontSize: "12px", py: "5px", verticalAlign: "middle", width: { xs: "210px", sm: "250px" }, minWidth: { xs: "210px", sm: "250px" } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: "4px", sm: "6px" } }}>
            <Avatar
              src={imageUrl}
              alt={row.name}
              sx={{
                width: { xs: 26, sm: 32 },
                height: { xs: 26, sm: 32 },
                fontSize: { xs: "11px", sm: "14px" },
                fontWeight: 600,
                backgroundColor: "#004AAD",
                color: "white",
                border: "2px solid rgba(0,74,173,0.2)",
                flexShrink: 0,
              }}
            >
              {!imageUrl && !isLoading && row.name.charAt(0)}
              {isLoading && <CircularProgress size={16} sx={{ color: "white" }} />}
            </Avatar>
            <Typography sx={{ fontSize: "12px", fontWeight: 500, whiteSpace: "nowrap" }}>
              {row.name}
            </Typography>
          </Box>
        </TableCell>
        {selectedMetric === "OT Entered" && (
          <TableCell sx={{ fontSize: "12px", py: "5px", width: { xs: "90px", sm: "110px" }, minWidth: { xs: "90px", sm: "110px" }, verticalAlign: "middle", whiteSpace: "nowrap" }}>
            {row.start_time}
          </TableCell>
        )}
        <TableCell sx={{ fontSize: "12px", py: "5px", width: { xs: "70px", sm: "100px" }, minWidth: { xs: "70px", sm: "100px" } }}>
          {row.location}
        </TableCell>
        <TableCell sx={{ fontSize: "12px", py: "5px", width: { xs: "70px", sm: "100px" }, minWidth: { xs: "70px", sm: "100px" } }}>
          {row.division}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ mb: "24px" }}>
      {/* Row 1: CDPLC full width */}
      {loading ? (
        <CdplcCardSkeleton />
      ) : (
        <CdplcKpiCard
          strength={byType["CDPLC"]?.strength || 0}
          eligible={byType["CDPLC"]?.eligible || 0}
          attendance={byType["CDPLC"]?.attendance || 0}
          liveData={liveData}
          onClick={onCardClick ? () => onCardClick("CDPLC") : undefined}
          onMetricClick={(metric) => {
            setSelectedMetric(metric);
            setModalSearchTerm("");
            setModalOpen(true);
          }}
        />
      )}

      {/* Row 2: 4 cards - ALWAYS in a single row (4 columns) on ALL screen sizes */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: { xs: "8px", sm: "12px", md: "14px" },
          alignItems: "stretch",
          mt: { xs: "8px", sm: "12px" },
          overflowX: "auto",
          minWidth: 0,
        }}
      >
        {cardTypes.map((type) =>
          loading ? (
            <KpiCardSkeleton key={type} />
          ) : (
            <AttendanceKpiCard
              key={type}
              type={type}
              strength={byType[type]?.strength || 0}
              eligible={byType[type]?.eligible || 0}
              attendance={byType[type]?.attendance || 0}
              onClick={onCardClick ? () => onCardClick(type) : undefined}
            />
          )
        )}
      </Box>

      {/* Employee List Dialog Modal - ENHANCED */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,74,173,0.18)",
            background: "#fff",
            m: { xs: 1, sm: 1.5, md: 2 },
            maxHeight: "90vh",
            minHeight: "400px",
            width: "100%",
            maxWidth: {
              xs: "calc(100% - 16px)",
              sm: "calc(100% - 24px)",
              md: "calc(100% - 32px)",
              lg: "850px"
            }
          }
        }}
      >
        {/* Header */}
        <DialogTitle sx={{
          p: "12px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0,74,173,0.08)",
          backgroundColor: "#f8faff",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#004AAD" }}>
              {selectedMetric || "Employee List"}
            </Typography>
            <Chip
              label={filteredEmployees.length}
              size="small"
              sx={{
                height: "22px",
                fontSize: "12px",
                fontWeight: 700,
                backgroundColor: "rgba(0, 74, 173, 0.1)",
                color: "#004AAD",
                "& .MuiChip-label": { px: "8px" }
              }}
            />
          </Box>
          <IconButton
            size="small"
            onClick={() => setModalOpen(false)}
            sx={{
              p: "4px",
              color: "text.secondary",
              "&:hover": { color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.08)" }
            }}
          >
            <CloseIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{
          p: "14px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          overflow: "hidden",
          backgroundColor: "#fafcff",
        }}>
          {/* Search bar */}
          <TextField
            placeholder="Search by Name or Service No..."
            value={modalSearchTerm}
            onChange={(e) => setModalSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: "18px", color: "text.secondary" }} />
                </InputAdornment>
              ),
              sx: {
                fontSize: "14px",
                borderRadius: "8px",
                backgroundColor: "white",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,74,173,0.15)" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#004AAD", borderWidth: 2 },
              }
            }}
          />

          {/* Table - ENHANCED HEIGHT */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              maxHeight: "400px", 
              minHeight: "250px",
              border: "1px solid rgba(0, 74, 173, 0.08)",
              borderRadius: "8px",
              overflow: "auto",
              backgroundColor: "white",
              "&::-webkit-scrollbar": { width: "6px", height: "6px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,74,173,0.2)",
                borderRadius: "4px",
                "&:hover": { backgroundColor: "rgba(0,74,173,0.3)" }
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0,74,173,0.05)",
                borderRadius: "4px",
              }
            }}
          >
            <Table
              size="small"
              stickyHeader
              sx={{
                tableLayout: "fixed",
                width: "100%",
                "& .MuiTableCell-root": {
                  px: { xs: "6px", sm: "10px", md: "16px" },
                }
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{
                    fontWeight: 700,
                    backgroundColor: "#f0f4ff",
                    color: "#004AAD",
                    fontSize: "12px",
                    py: "8px",
                    borderBottom: "2px solid rgba(0,74,173,0.12)",
                    width: { xs: "65px", sm: "80px" },
                    minWidth: { xs: "65px", sm: "80px" },
                  }}>
                    Service No
                  </TableCell>
                  <TableCell align="center" sx={{
                    fontWeight: 700,
                    backgroundColor: "#f0f4ff",
                    color: "#004AAD",
                    fontSize: "12px",
                    py: "8px",
                    borderBottom: "2px solid rgba(0,74,173,0.12)",
                    minWidth: { xs: "210px", sm: "250px" },
                    width: { xs: "210px", sm: "250px" },
                    whiteSpace: "nowrap",
                  }}>
                    Employee
                  </TableCell>
                  {selectedMetric === "OT Entered" && (
                    <TableCell sx={{
                      fontWeight: 700,
                      backgroundColor: "#f0f4ff",
                      color: "#004AAD",
                      fontSize: "12px",
                      py: "8px",
                      borderBottom: "2px solid rgba(0,74,173,0.12)",
                      width: { xs: "90px", sm: "110px" },
                      minWidth: { xs: "90px", sm: "110px" },
                      whiteSpace: "nowrap",
                    }}>
                      Start Time
                    </TableCell>
                  )}
                  <TableCell sx={{
                    fontWeight: 700,
                    backgroundColor: "#f0f4ff",
                    color: "#004AAD",
                    fontSize: "12px",
                    py: "8px",
                    borderBottom: "2px solid rgba(0,74,173,0.12)",
                    width: { xs: "70px", sm: "100px" },
                    minWidth: { xs: "70px", sm: "100px" },
                  }}>
                    Location
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 700,
                    backgroundColor: "#f0f4ff",
                    color: "#004AAD",
                    fontSize: "12px",
                    py: "8px",
                    borderBottom: "2px solid rgba(0,74,173,0.12)",
                    width: { xs: "70px", sm: "100px" },
                    minWidth: { xs: "70px", sm: "100px" },
                  }}>
                    Division
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeListLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 6 }}>
                      <CircularProgress size={32} sx={{ color: "#004AAD" }} />
                      <Typography sx={{ mt: 1, color: "text.secondary", fontSize: "13px" }}>
                        Loading employees...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : employeeListError ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 4, color: "#e53935", fontSize: "13px" }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <XCircle size={32} color="#e53935" />
                        <Typography>{employeeListError}</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map((row, index) => (
                    <EmployeeRow key={`${row.id}-${index}`} row={row} index={index} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 4, color: "text.secondary", fontSize: "13px" }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <SearchIcon sx={{ fontSize: 32, color: "text.secondary", opacity: 0.5 }} />
                        <Typography>No employees found.</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary", opacity: 0.7 }}>
                          Try adjusting your search terms
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EmployeeTypeKpiGrid;