// import React, { useState } from "react";
// import { 
//   Box, 
//   Typography, 
//   Chip, 
//   useMediaQuery, 
//   useTheme,
//   Paper,
//   IconButton,
//   Tooltip,
//   Divider,
//   alpha,
//   ButtonGroup,
//   Button
// } from "@mui/material";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip as RechartsTooltip,
//   Legend,
//   CartesianGrid,
//   Line,
//   ComposedChart
// } from "recharts";
// import TrendingUpIcon from '@mui/icons-material/TrendingUp'; 
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import PeopleIcon from '@mui/icons-material/People';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import EventAvailableIcon from '@mui/icons-material/EventAvailable';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import DownloadIcon from '@mui/icons-material/Download';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import ShowChartIcon from '@mui/icons-material/ShowChart';
// import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
 
// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload || !payload.length) return null;

//   // Helper function to get color value
//   const getColorValue = (color) => {
//     if (color && color.startsWith('url(#')) {
//       // Return default colors based on dataKey
//       if (payload[0]?.dataKey === 'strength') return '#3b82f6';
//       if (payload[0]?.dataKey === 'eligible') return '#8b5cf6';
//       if (payload[0]?.dataKey === 'attendance') return '#10b981';
//       if (payload[0]?.dataKey === 'kryAttendance') return '#f59e0b';
//       return '#64748b';
//     }
//     return color || '#64748b';
//   };

//   return (
//     <Paper
//       elevation={6}
//       sx={{
//         backgroundColor: "#0f172a",
//         borderRadius: "16px",
//         padding: "14px 18px",
//         border: "1px solid #334155",
//         minWidth: "200px",
//         backdropFilter: "blur(8px)",
//       }}
//     >
//       <Typography
//         sx={{
//           color: "#f1f5f9",
//           fontWeight: 700,
//           marginBottom: "10px",
//           fontSize: "13px",
//           borderBottom: "1px solid #334155",
//           pb: 1,
//           display: 'flex',
//           alignItems: 'center',
//           gap: 1
//         }}
//       >
//         <Box 
//           sx={{ 
//             width: 4, 
//             height: 16, 
//             bgcolor: '#3b82f6', 
//             borderRadius: 2 
//           }} 
//         />
//         {label}
//       </Typography>

//       {payload.map((entry, index) => (
//         <Box
//           key={`${entry.dataKey}-${index}`}
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: "16px",
//             marginBottom: "8px",
//             '&:last-child': { mb: 0 }
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <Box
//               sx={{
//                 width: "10px",
//                 height: "10px",
//                 borderRadius: "4px",
//                 backgroundColor: getColorValue(entry.color),
//                 boxShadow: `0 0 10px ${getColorValue(entry.color)}`,
//               }}
//             />
//             <Typography sx={{ color: "#94a3b8", fontSize: "12px", fontWeight: 500 }}>
//               {entry.name}:
//             </Typography>
//           </Box>
//           <Typography
//             sx={{ 
//               color: "#f1f5f9", 
//               fontWeight: 700, 
//               fontSize: "13px",
//               fontFamily: "'Inter', monospace",
//               bgcolor: alpha(getColorValue(entry.color), 0.15),
//               px: 1,
//               py: 0.5,
//               borderRadius: "6px"
//             }}
//           >
//             {Number(entry.value || 0).toLocaleString()}
//           </Typography>
//         </Box>
//       ))}
      
       
//     </Paper>
//   );
// };

// const StatCard = ({ icon: Icon, label, value, color, trend, subtitle }) => (
//   <motion.div
//     whileHover={{ y: -3 }}
//     transition={{ type: "spring", stiffness: 400 }}
//   >
//     <Paper
//       elevation={0}
//       sx={{
//         p: 2,
//         borderRadius: "14px",
//         border: "1px solid #eef2f6",
//         background: `linear-gradient(135deg, ${alpha(color, 0.02)} 0%, #ffffff 100%)`,
//         transition: 'all 0.3s ease',
//         position: 'relative',
//         overflow: 'hidden',
//         '&::before': {
//           content: '""',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           height: '3px',
//           background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})`,
//         },
//         '&:hover': {
//           borderColor: color,
//           boxShadow: `0 8px 20px ${alpha(color, 0.15)}`,
//         }
//       }}
//     >
//       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//           <Box
//             sx={{
//               width: 42,
//               height: 42,
//               borderRadius: '12px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
//               color: color,
//             }}
//           >
//             <Icon sx={{ fontSize: 22 }} />
//           </Box>
//           <Box>
//             <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, letterSpacing: '0.5px' }}>
//               {label}
//             </Typography>
//             <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
//               {typeof value === 'number' ? value.toLocaleString() : value}
//             </Typography>
//             {trend && (
//               <Typography variant="caption" sx={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                 <TrendingUpIcon sx={{ fontSize: 12 }} />
//                 {trend}
//               </Typography>
//             )}
//           </Box>
//         </Box>
//         {subtitle && (
//           <Typography variant="caption" sx={{ color: '#94a3b8' }}>
//             {subtitle}
//           </Typography>
//         )}
//       </Box>
//     </Paper>
//   </motion.div>
// );

// export function EmployeeStrengthAttendanceChart({ allAttendance = [] }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [chartType, setChartType] = useState('bar');
//   const [showEligible, setShowEligible] = useState(true);
//   const [showAttendance, setShowAttendance] = useState(true);
//   const [showStrength, setShowStrength] = useState(true);
//   const [showKRY, setShowKRY] = useState(true);

//   // Color constants
//   const colors = {
//     strength: '#3b82f6',
//     eligible: '#8b5cf6',
//     attendance: '#10b981',
//     kry: '#f59e0b',
//     accent: '#f59e0b'
//   };

//   // Normalize employee type labels
//   const normalizeType = (value) => {
//     const str = (value || "").toString().trim().toLowerCase();
//     if (str.includes("cdplc")) return "CDPLC";
//     if (str.includes("trainee")) return "Trainee";
//     if (str.includes("sub") && str.includes("l")) return "Sub (L)";
//     if (str.includes("sub") && str.includes("f")) return "Sub (F)";
//     if (str.includes("kry") || str.includes("site")) return "KRY Site";
//     return (value || "").toString().trim();
//   };

  
//   const transformedData = (allAttendance || [])
//     .filter((item) => {
//       const typeValue = (
//         item?.Type || item?.TYPE || item?.EmployeeType || item?.employeeType || ""
//       ).toString().trim();
//       return typeValue && typeValue.toUpperCase() !== "TOTAL";
//     })
//     .map((item) => {
//       const strength = parseInt(item?.ActualStrength || item?.Strength || 0) || 0;
//       const attendance = parseInt(item?.Attendance || 0) || 0;
//       const eligible = parseInt(
//         item?.EligibleStrength || item?.Eligible || item?.EligibleCount || item?.EligibleAttendance || 0,
//       ) || 0;
      
//       const type = normalizeType(item?.Type || item?.TYPE || item?.EmployeeType || "Unknown");
      
//       // If it's KRY type, put attendance in kryAttendance field
//       if (type === "KRY Site") {
//         return {
//           type,
//           strength,
//           attendance: 0, // Regular attendance 0 for KRY
//           eligible,
//           kryAttendance: attendance, // KRY attendance
//         };
//       }

//       return {
//         type,
//         strength,
//         attendance,
//         eligible,
//         kryAttendance: 0, // Default 0 for non-KRY types
//       };
//     });

//   const chartData = transformedData.length > 0 ? transformedData : [];

//   // Ensure all expected categories are shown
//   const expectedCategories = ["CDPLC", "Trainee", "Sub (L)", "Sub (F)", "KRY Site"];
//   const existingTypes = new Set(chartData.map((item) => item.type));

//   const enrichedChartData = [
//     ...chartData,
//     ...expectedCategories
//       .filter((cat) => !existingTypes.has(cat))
//       .map((cat) => ({
//         type: cat,
//         strength: 0,
//         attendance: 0,
//         eligible: 0,
//         kryAttendance: cat === "KRY Site" ? 0 : undefined,
//       })),
//   ].sort((a, b) => {
//     const order = { "CDPLC": 1, "Trainee": 2, "Sub (L)": 3, "Sub (F)": 4, "KRY Site": 5 };
//     return (order[a.type] || 99) - (order[b.type] || 99);
//   });

//   // Calculate totals
//   const totals = enrichedChartData.reduce(
//     (acc, item) => ({
//       strength: acc.strength + (item.strength || 0),
//       eligible: acc.eligible + (item.eligible || 0),
//       attendance: acc.attendance + (item.attendance || 0),
//       kryAttendance: acc.kryAttendance + (item.kryAttendance || 0),
//     }),
//     { strength: 0, eligible: 0, attendance: 0, kryAttendance: 0 },
//   );

//   // Render chart based on selected type
//   const renderChart = () => {
//     const commonProps = {
//       data: enrichedChartData,
//       margin: {
//         top: 20,
//         right: isMobile ? 15 : 25,
//         left: isMobile ? 0 : 5,
//         bottom: isMobile ? 30 : 20,
//       },
//     };

//     switch(chartType) {
//       case 'bar':
//         return (
//           <BarChart {...commonProps}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
            
//             <XAxis 
//               dataKey="type" 
//               axisLine={false} 
//               tickLine={false}
//               tick={{ fill: "#64748b", fontSize: isMobile ? 10 : 12 }}
//               dy={isMobile ? 4 : 8}
//             />
            
//             <YAxis 
//               axisLine={false} 
//               tickLine={false}
//               tick={{ fill: "#64748b", fontSize: isMobile ? 9 : 11 }}
//               width={isMobile ? 35 : 45}
//             />
            
//             <RechartsTooltip content={<CustomTooltip />} />
            
//             <Legend 
//               wrapperStyle={{ 
//                 paddingTop: 20,
//                 fontSize: isMobile ? '10px' : '12px'
//               }} 
//             />
            
//             {showStrength && (
//               <Bar 
//                 dataKey="strength" 
//                 name="Actual Strength" 
//                 fill={colors.strength}
//                 radius={[6, 6, 0, 0]} 
//                 maxBarSize={50} 
//               />
//             )}
//             {showEligible && (
//               <Bar 
//                 dataKey="eligible" 
//                 name="Eligible Strength" 
//                 fill={colors.eligible}
//                 radius={[6, 6, 0, 0]} 
//                 maxBarSize={50} 
//               />
//             )}
//             {showAttendance && (
//               <Bar 
//                 dataKey="attendance" 
//                 name="Regular Attendance" 
//                 fill={colors.attendance}
//                 radius={[6, 6, 0, 0]} 
//                 maxBarSize={50} 
//               />
//             )}
//             {showKRY && (
//               <Bar 
//                 dataKey="kryAttendance" 
//                 name="KRY Site Attendance" 
//                 fill={colors.kry}
//                 radius={[6, 6, 0, 0]} 
//                 maxBarSize={50} 
//               />
//             )}
//           </BarChart>
//         );
 
//     }
//   };

//   const totalAttendance = totals.attendance + totals.kryAttendance;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
//     >
//       <Paper
//         elevation={0}
//         sx={{
//           overflow: "hidden",
//           backgroundColor: "#ffffff",
//           borderRadius: "20px",
//           padding: { xs: "16px", sm: "20px", md: "24px" },
//           boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
//           border: "1px solid #edf2f7",
//         }}
//       >
//         {/* Header Section */}
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: { xs: "column", sm: "row" },
//             alignItems: { xs: "flex-start", sm: "center" },
//             justifyContent: "space-between",
//             marginBottom: "24px",
//             gap: { xs: "16px", sm: "12px" },
//           }}
//         >
//           <Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
//               <Typography
//                 sx={{
//                   fontSize: { xs: "18px", sm: "20px", md: "22px" },
//                   fontWeight: 700,
//                   color: "#0f172a",
//                   letterSpacing: '-0.01em'
//                 }}
//               >
//                 Employee Strength Overview
//               </Typography>
//               <Tooltip title="Real-time workforce data including KRY Site">
//                 <InfoOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8', cursor: 'help' }} />
//               </Tooltip>
//             </Box>
             
//           </Box>
          
//         </Box>

//         {/* Chart Controls - Add KRY toggle */}
        

//         {/* Chart Section */}
//         <Box
//           sx={{
//             height: { xs: "320px", sm: "360px", md: "400px" },
//             width: "100%",
//             position: 'relative',
//             mt: 1
//           }}
//         >
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={chartType}
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               transition={{ duration: 0.3 }}
//               style={{ width: '100%', height: '100%' }}
//             >
//               <ResponsiveContainer width="100%" height="100%">
//                 {renderChart()}
//               </ResponsiveContainer>
//             </motion.div>
//           </AnimatePresence>
//         </Box>

//         {/* Footer */}
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             mt: 3,
//             pt: 2,
//             borderTop: '1px solid #eef2f6',
//             flexWrap: 'wrap',
//             gap: 2
//           }}
//         > 
//           <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: colors.strength }} />
//               <Typography variant="caption" sx={{ color: '#475569' }}>Actual: {totals.strength}</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: colors.eligible }} />
//               <Typography variant="caption" sx={{ color: '#475569' }}>Eligible: {totals.eligible}</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: colors.attendance }} />
//               <Typography variant="caption" sx={{ color: '#475569' }}>Regular: {totals.attendance}</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: colors.kry }} />
//               <Typography variant="caption" sx={{ color: '#475569' }}>KRY Site: {totals.kryAttendance}</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: colors.accent }} />
//               <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
//                 TOTAL: {totalAttendance}
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Paper>
//     </motion.div>
//   );
// }








// import React, { useState } from "react";
// import { 
//   Box, 
//   Typography, 
//   Chip, 
//   useMediaQuery, 
//   useTheme,
//   Paper,
//   IconButton,
//   Tooltip,
//   Divider,
//   alpha,
//   ButtonGroup,
//   Button
// } from "@mui/material";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip as RechartsTooltip,
//   Legend,
//   CartesianGrid,
// } from "recharts";
// import TrendingUpIcon from '@mui/icons-material/TrendingUp'; 
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import PeopleIcon from '@mui/icons-material/People';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import EventAvailableIcon from '@mui/icons-material/EventAvailable';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import DownloadIcon from '@mui/icons-material/Download';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import ShowChartIcon from '@mui/icons-material/ShowChart';
// import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
 
// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload || !payload.length) return null;
 
//   const getColorValue = (color) => {
//     if (color && color.startsWith('url(#')) {
//       if (payload[0]?.dataKey === 'strength') return '#3b82f6';
//       if (payload[0]?.dataKey === 'eligible') return '#8b5cf6';
//       if (payload[0]?.dataKey === 'attendance') return '#10b981';
//       if (payload[0]?.dataKey === 'kryAttendance') return '#f59e0b';
//       return '#64748b';
//     }
//     return color || '#64748b';
//   };

//   return (
//     <Paper
//       elevation={6}
//       sx={{
//         backgroundColor: "#f2f4f7",
//         borderRadius: "16px",
//         padding: "14px 18px",
//         border: "1px solid #334155",
//         minWidth: "200px",
//         backdropFilter: "blur(8px)",
//       }}
//     >
//       <Typography
//         sx={{
//           color: "#02090f",
//           fontWeight: 700,
//           marginBottom: "10px",
//           fontSize: "13px",
//           borderBottom: "1px solid #334155",
//           pb: 1,
//           display: 'flex',
//           alignItems: 'center',
//           gap: 1
//         }}
//       >
//         <Box 
//           sx={{ 
//             width: 4, 
//             height: 16, 
//             bgcolor: '#3b82f6', 
//             borderRadius: 2 
//           }} 
//         />
//         {label}
//       </Typography>

//       {payload.map((entry, index) => (
//         <Box
//           key={`${entry.dataKey}-${index}`}
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: "16px",
//             marginBottom: "8px",
//             '&:last-child': { mb: 0 }
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <Box
//               sx={{
//                 width: "10px",
//                 height: "10px",
//                 borderRadius: "4px",
//                 backgroundColor: getColorValue(entry.color),
//                // boxShadow: `0 0 10px ${getColorValue(entry.color)}`,
//               }}
//             />
//             <Typography sx={{ color: "#02070f", fontSize: "12px", fontWeight: 500 }}>
//               {entry.name}:
//             </Typography>
//           </Box>
//           <Typography
//             sx={{ 
//               //color: "#f1f5f9", 
//               fontWeight: 700, 
//               fontSize: "13px",
//               fontFamily: "'Inter', monospace",
//              // bgcolor: alpha(getColorValue(entry.color), 0.15),
//               px: 1,
//               py: 0.5,
//               borderRadius: "6px"
//             }}
//           >
//             {Number(entry.value || 0).toLocaleString()}
//           </Typography>
//         </Box>
//       ))}
      
//     </Paper>
//   );
// };

// const StatCard = ({ icon: Icon, label, value, color, trend, subtitle }) => (
//   <motion.div
//     whileHover={{ y: -3 }}
//     transition={{ type: "spring", stiffness: 400 }}
//   >
//     <Paper
//       elevation={0}
//       sx={{
//         p: 2,
//         borderRadius: "14px",
//         border: "1px solid #eef2f6",
//         background: `linear-gradient(135deg, ${alpha(color, 0.02)} 0%, #ffffff 100%)`,
//         transition: 'all 0.3s ease',
//         position: 'relative',
//         overflow: 'hidden',
//         '&::before': {
//           content: '""',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           height: '3px',
//           background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})`,
//         },
//         '&:hover': {
//           borderColor: color,
//           boxShadow: `0 8px 20px ${alpha(color, 0.15)}`,
//         }
//       }}
//     >
//       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//           <Box
//             sx={{
//               width: 42,
//               height: 42,
//               borderRadius: '12px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
//               color: color,
//             }}
//           >
//             <Icon sx={{ fontSize: 22 }} />
//           </Box>
//           <Box>
//             <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, letterSpacing: '0.5px' }}>
//               {label}
//             </Typography>
//             <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
//               {typeof value === 'number' ? value.toLocaleString() : value}
//             </Typography>
//             {trend && (
//               <Typography variant="caption" sx={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                 <TrendingUpIcon sx={{ fontSize: 12 }} />
//                 {trend}
//               </Typography>
//             )}
//           </Box>
//         </Box>
//         {subtitle && (
//           <Typography variant="caption" sx={{ color: '#94a3b8' }}>
//             {subtitle}
//           </Typography>
//         )}
//       </Box>
//     </Paper>
//   </motion.div>
// );

// export function EmployeeStrengthAttendanceChart({ allAttendance = [] }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [showEligible, setShowEligible] = useState(true);
//   const [showAttendance, setShowAttendance] = useState(true);
//   const [showStrength, setShowStrength] = useState(true);
//   const [showKRY, setShowKRY] = useState(true);
 
//   const colors = {
//     strength: '#E63946',
//     eligible: '#F4D03F',
//     attendance: '#3498DB',
//     kry: '#0b0ff5',
//     accent: '#f59e0b'
//   };
 
//   const normalizeType = (value) => {
//     const str = (value || "").toString().trim().toLowerCase();
//     if (str.includes("cdplc")) return "CDPLC";
//     if (str.includes("trainee")) return "Trainee";
//     if (str.includes("sub") && str.includes("l")) return "Sub (L)";
//     if (str.includes("sub") && str.includes("f")) return "Sub (F)";
//     if (str.includes("kry") || str.includes("site")) return "KRY Site";
//     return (value || "").toString().trim();
//   };

//   const transformedData = (allAttendance || [])
//     .filter((item) => {
//       const typeValue = (
//         item?.Type || item?.TYPE || item?.EmployeeType || item?.employeeType || ""
//       ).toString().trim();
//       return typeValue && typeValue.toUpperCase() !== "TOTAL";
//     })
//     .map((item) => {
//       const strength = parseInt(item?.ActualStrength || item?.Strength || 0) || 0;
//       const attendance = parseInt(item?.Attendance || 0) || 0;
//       const eligible = parseInt(
//         item?.EligibleStrength || item?.Eligible || item?.EligibleCount || item?.EligibleAttendance || 0,
//       ) || 0;
      
//       const type = normalizeType(item?.Type || item?.TYPE || item?.EmployeeType || "Unknown");
      
//       if (type === "KRY Site") {
//         return {
//           type,
//           strength,
//           attendance: 0,
//           eligible,
//           kryAttendance: attendance,
//         };
//       }

//       return {
//         type,
//         strength,
//         attendance,
//         eligible,
//         kryAttendance: 0,
//       };
//     });

//   const chartData = transformedData.length > 0 ? transformedData : [];

//   const expectedCategories = ["CDPLC", "Trainee", "Sub (L)", "Sub (F)", "KRY Site"];
//   const existingTypes = new Set(chartData.map((item) => item.type));

//   const enrichedChartData = [
//     ...chartData,
//     ...expectedCategories
//       .filter((cat) => !existingTypes.has(cat))
//       .map((cat) => ({
//         type: cat,
//         strength: 0,
//         attendance: 0,
//         eligible: 0,
//         kryAttendance: cat === "KRY Site" ? 0 : undefined,
//       })),
//   ].sort((a, b) => {
//     const order = { "CDPLC": 1, "Trainee": 2, "Sub (L)": 3, "Sub (F)": 4, "KRY Site": 5 };
//     return (order[a.type] || 99) - (order[b.type] || 99);
//   });
 
//   const totals = enrichedChartData.reduce(
//     (acc, item) => ({
//       strength: acc.strength + (item.strength || 0),
//       eligible: acc.eligible + (item.eligible || 0),
//       attendance: acc.attendance + (item.attendance || 0),
//       kryAttendance: acc.kryAttendance + (item.kryAttendance || 0),
//     }),
//     { strength: 0, eligible: 0, attendance: 0, kryAttendance: 0 },
//   );
 
//   const horizontalChartData = enrichedChartData.map(item => ({
//     ...item, 
//   }));
 
//   const renderHorizontalChart = () => {
//     return (
//       <BarChart
//         data={horizontalChartData}
//         layout="vertical"  
//         margin={{
//           top: 20,
//           right: isMobile ? 0 : 40,
//           left: isMobile ? 0 : 100, 
//           bottom: isMobile ? 30 : 40,
//         }}
//       >
//         <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" horizontal={true} vertical={false} />
        
//         {/* Y-axis now shows the categories (employee types) */}
//         <YAxis 
//           type="category"
//           dataKey="type" 
//           axisLine={false} 
//           tickLine={false}
//           tick={{ fill: "#64748b", fontSize: isMobile ? 10 : 12 }}
//           width={isMobile ? 80 : 100}
//           interval={0} 
//         />
        
//         {/* X-axis now shows the values */}
//         <XAxis 
//           type="number"
//           axisLine={false} 
//           tickLine={false}
//           tick={{ fill: "#64748b", fontSize: isMobile ? 9 : 11 }}
//           height={isMobile ? 30 : 40}
//         />
        
//         <RechartsTooltip content={<CustomTooltip />} />
        
//         <Legend 
//           wrapperStyle={{ 
//             paddingTop: 20,
//             fontSize: isMobile ? '10px' : '12px'
//           }} 
//         />
        
//         {showStrength && (
//           <Bar 
//             dataKey="strength" 
//             name="Actual Strength" 
//             fill={colors.strength}
//             radius={[0, 6, 6, 0]} 
//             barSize={isMobile ? 15 : 20}
//             layout="vertical"
//           />
//         )}
//         {showEligible && (
//           <Bar 
//             dataKey="eligible" 
//             name="Eligible Strength" 
//             fill={colors.eligible}
//             radius={[0, 6, 6, 0]} 
//             barSize={isMobile ? 15 : 20}
//             layout="vertical"
//           />
//         )}
//         {showAttendance && (
//           <Bar 
//             dataKey="attendance" 
//             name="Regular Attendance" 
//             fill={colors.attendance}
//             radius={[0, 6, 6, 0]} 
//             barSize={isMobile ? 15 : 20}
//             layout="vertical"
//           />
//         )}
//         {showKRY && (
//           <Bar 
//             dataKey="kryAttendance" 
//             name="KRY Site Attendance" 
//             fill={colors.kry}
//             radius={[0, 6, 6, 0]} 
//             barSize={isMobile ? 15 : 20}
//             layout="vertical"
//           />
//         )}
//       </BarChart>
//     );
//   };

//   const totalAttendance = totals.attendance + totals.kryAttendance;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
//     >
//       <Paper
//         elevation={0}
//         sx={{
//           overflow: "hidden",
//           backgroundColor: "#ffffff",
//           borderRadius: "20px",
//           padding: { xs: "16px", sm: "20px", md: "24px" },
//           boxShadow: "0 10px 30px rgba(212, 202, 202, 0.08)",
//           border: "1px solid #edf2f7",
//         }}
//       >
//         {/* Header Section */}
        
//           <Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
//               <Typography
//                 sx={{
//                   fontSize: { xs: "18px", sm: "20px", md: "22px" },
//                   fontWeight: 700,
//                   color: "#0f172a",
//                   letterSpacing: '-0.01em'
//                 }}
//               >
//                 Employee Strength Overview 
//               </Typography>
//             </Box>
//           </Box>
       
//         {/* Chart Section */}
//         <Box
//           sx={{
//             height: { xs: "350px", sm: "450px", md: "500px" }, 
//             width: "100%",
//             position: 'relative',
//             mt: 1
//           }}
//         >
//           <AnimatePresence mode="wait">
//             <motion.div
//               key="horizontal-chart"
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               transition={{ duration: 0.3 }}
//               style={{ width: '100%', height: '100%' }}
//             >
//               <ResponsiveContainer width="100%" height="100%">
//                 {renderHorizontalChart()}
//               </ResponsiveContainer>
//             </motion.div>
//           </AnimatePresence>
//         </Box>

//         {/* Footer */}
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             mt: 3,
//             pt: 2,
//             borderTop: '1px solid #eef2f6',
//             flexWrap: 'wrap',
//             gap: 2
//           }}
//         > 
//           <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: colors.strength }} />
//               <Typography variant="caption" sx={{ color: '#475569' }}>Actual: {totals.strength}</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: colors.eligible }} />
//               <Typography variant="caption" sx={{ color: '#475569' }}>Eligible: {totals.eligible}</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: colors.attendance }} />
//               <Typography variant="caption" sx={{ color: '#475569' }}>Regular: {totals.attendance}</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: colors.kry }} />
//               <Typography variant="caption" sx={{ color: '#475569' }}>KRY Site: {totals.kryAttendance}</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: colors.accent }} />
//               <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
//                 TOTAL: {totalAttendance}
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Paper>
//     </motion.div>
//   );
// }






import React, { useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  alpha,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  LabelList,
} from "recharts";

// ─── Color palette (blue family) ─────────────────────────────────────────────
const COLORS = {
  strength:   "#1E3A8A",
  eligible:   "#2563EB",
  attendance: "#38BDF8",
  kry:        "#6EE7B7",
  accent:     "#93C5FD",
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────
const DK_COLOR = {
  strength:      COLORS.strength,
  eligible:      COLORS.eligible,
  attendance:    COLORS.attendance,
  kryAttendance: COLORS.kry,
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper
      elevation={4}
      sx={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "12px 16px",
        border: "1px solid #BFDBFE",
        minWidth: "190px",
      }}
    >
      <Typography
        sx={{ fontWeight: 700, fontSize: 13, color: "#1E3A8A", mb: 1,
          borderBottom: "1px solid #BFDBFE", pb: 0.8 }}
      >
        {label}
      </Typography>
      {payload.map((entry, i) => (
        <Box key={i} sx={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", mb: 0.6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Box sx={{ width: 9, height: 9, borderRadius: "3px",
              bgcolor: DK_COLOR[entry.dataKey] || entry.color }} />
            <Typography sx={{ fontSize: 12, color: "#334155" }}>{entry.name}:</Typography>
          </Box>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A" }}>
            {Number(entry.value || 0).toLocaleString()}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

// ─── Legend ───────────────────────────────────────────────────────────────────
const SERIES = [
  { key: "showStrength",   dataKey: "strength",      label: "Actual Strength",     color: COLORS.strength },
  { key: "showEligible",   dataKey: "eligible",      label: "Eligible Strength",   color: COLORS.eligible },
  { key: "showAttendance", dataKey: "attendance",    label: "Regular Attendance",  color: COLORS.attendance },
  { key: "showKRY",        dataKey: "kryAttendance", label: "KRY Site Attendance", color: COLORS.kry },
];

const CustomLegend = ({ visibility, onToggle }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2, justifyContent: "center" }}>
    {SERIES.map(({ key, label, color }) => (
      <Box key={key} onClick={() => onToggle(key)}
        sx={{ display: "flex", alignItems: "center", gap: 0.8, cursor: "pointer",
          opacity: visibility[key] ? 1 : 0.35, transition: "opacity 0.2s" }}>
        <Box sx={{ width: 12, height: 12, borderRadius: "3px", bgcolor: color }} />
        <Typography sx={{ fontSize: 12, color: "#475569", userSelect: "none" }}>{label}</Typography>
      </Box>
    ))}
  </Box>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const normalizeType = (value) => {
  const s = (value || "").toString().trim().toLowerCase();
  if (s.includes("cdplc"))                    return "CDPLC";
  if (s.includes("trainee"))                  return "Trainee";
  if (s.includes("sub") && s.includes("l"))   return "Sub (L)";
  if (s.includes("sub") && s.includes("f"))   return "Sub (F)";
  if (s.includes("kry") || s.includes("site"))return "KRY Site";
  return (value || "").toString().trim();
};

const TYPE_ORDER = { CDPLC: 1, Trainee: 2, "Sub (L)": 3, "Sub (F)": 4, "KRY Site": 5 };
const EXPECTED   = ["CDPLC", "Trainee", "Sub (L)", "Sub (F)", "KRY Site"];

// ─── Main ─────────────────────────────────────────────────────────────────────
export function EmployeeStrengthAttendanceChart({ allAttendance = [] }) {
  const theme   = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [vis, setVis] = useState({
    showStrength: true, showEligible: true,
    showAttendance: true, showKRY: true,
  });

  const toggleVis = (key) => setVis((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Build chart data ──
  const transformed = (allAttendance || [])
    .filter((item) => {
      const t = (item?.Type || item?.TYPE || item?.EmployeeType || item?.employeeType || "").toString().trim();
      return t && t.toUpperCase() !== "TOTAL";
    })
    .map((item) => {
      const strength   = parseInt(item?.ActualStrength || item?.Strength || 0) || 0;
      const attendance = parseInt(item?.Attendance || 0) || 0;
      const eligible   = parseInt(
        item?.EligibleStrength || item?.Eligible ||
        item?.EligibleCount   || item?.EligibleAttendance || 0
      ) || 0;
      const type = normalizeType(item?.Type || item?.TYPE || item?.EmployeeType || "Unknown");
      const rate = strength > 0 ? Math.round((attendance / strength) * 100) : 0;
      return type === "KRY Site"
        ? { type, strength, attendance: 0, eligible, kryAttendance: attendance, attendanceRate: rate }
        : { type, strength, attendance, eligible, kryAttendance: 0,             attendanceRate: rate };
    });

  const existingTypes = new Set(transformed.map((d) => d.type));
  const allData = [
    ...transformed,
    ...EXPECTED
      .filter((c) => !existingTypes.has(c))
      .map((c) => ({ type: c, strength: 0, attendance: 0, eligible: 0, kryAttendance: 0, attendanceRate: 0 })),
  ].sort((a, b) => (TYPE_ORDER[a.type] || 99) - (TYPE_ORDER[b.type] || 99));
 
  const activeSeries = SERIES.filter((s) => vis[s.key]);
  const chartData = allData.filter((row) =>
    activeSeries.some((s) => (row[s.dataKey] || 0) > 0)
  );
 
  const totals = allData.reduce(
    (acc, d) => ({
      strength:      acc.strength      + (d.strength      || 0),
      eligible:      acc.eligible      + (d.eligible      || 0),
      attendance:    acc.attendance    + (d.attendance    || 0),
      kryAttendance: acc.kryAttendance + (d.kryAttendance || 0),
    }),
    { strength: 0, eligible: 0, attendance: 0, kryAttendance: 0 }
  );
  const totalAttendance = totals.attendance + totals.kryAttendance;
 
  const fmtVal = (v) => (v > 0 ? v.toLocaleString() : "");
  const fmtStr = (v) => {
    if (!v || v === 0) return "";
    const item = allData.find((d) => d.strength === v);
    const rate = item?.attendanceRate;
    return rate ? `${v.toLocaleString()} (${rate}%)` : v.toLocaleString();
  };
 
  const nBars       = activeSeries.length;
  const barSize     = isMobile ? 14 : 18;

  const rowHeight   = nBars * (barSize ) + 30;
  const chartHeight = chartData.length * rowHeight ; 
  const YAXIS_W     = isMobile ? 72 : 90;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          backgroundColor: "#F8FAFF",
          borderRadius: "20px",
          padding: { xs: "16px", sm: "20px", md: "24px" },
          border: "1px solid #BFDBFE",
          boxShadow: "0 4px 24px rgba(37,99,235,0.07)",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{
            fontSize: { xs: "17px", sm: "19px", md: "21px" },
            fontWeight: 700, color: "#1E3A8A", letterSpacing: "-0.01em",
          }}>
            Employee Strength Overview
          </Typography>
        </Box>

        {/* Chart — height shrinks/grows with visible rows */}
        <Box sx={{ width: "100%", height: Math.max(chartHeight, 160) }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`chart-${Object.values(vis).join("")}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: "100%", height: "100%" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 8, right: isMobile ? 72 : 112, left: 0, bottom: 8 }}
                  barCategoryGap="30%"   // percentage of row height → consistent spacing
                  barGap={3}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#DBEAFE" horizontal={false} vertical={true} />

                  <YAxis
                    type="category"
                    dataKey="type"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#1E3A8A", fontSize: isMobile ? 11 : 13, fontWeight: 600 }}
                    width={YAXIS_W}
                    interval={0}
                  />

                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: isMobile ? 9 : 11 }}
                    tickFormatter={(v) => v.toLocaleString()}
                  />

                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: alpha("#2563EB", 0.05) }} />

                  {vis.showStrength && (
                    <Bar dataKey="strength" name="Actual Strength"
                      fill={COLORS.strength} radius={[0, 5, 5, 0]} barSize={barSize}>
                      <LabelList dataKey="strength" position="right" formatter={fmtStr}
                        style={{ fill: "#1E3A8A", fontSize: isMobile ? 9 : 11, fontWeight: 700 }} />
                    </Bar>
                  )}
                  {vis.showEligible && (
                    <Bar dataKey="eligible" name="Eligible Strength"
                      fill={COLORS.eligible} radius={[0, 5, 5, 0]} barSize={barSize}>
                      <LabelList dataKey="eligible" position="right" formatter={fmtVal}
                        style={{ fill: "#2563EB", fontSize: isMobile ? 9 : 11, fontWeight: 700 }} />
                    </Bar>
                  )}
                  {vis.showAttendance && (
                    <Bar dataKey="attendance" name="Regular Attendance"
                      fill={COLORS.attendance} radius={[0, 5, 5, 0]} barSize={barSize}>
                      <LabelList dataKey="attendance" position="right" formatter={fmtVal}
                        style={{ fill: "#0284c7", fontSize: isMobile ? 9 : 11, fontWeight: 700 }} />
                    </Bar>
                  )}
                  {vis.showKRY && (
                    <Bar dataKey="kryAttendance" name="KRY Site Attendance"
                      fill={COLORS.kry} radius={[0, 5, 5, 0]} barSize={barSize}>
                      <LabelList dataKey="kryAttendance" position="right" formatter={fmtVal}
                        style={{ fill: "#0f766e", fontSize: isMobile ? 9 : 11, fontWeight: 700 }} />
                    </Bar>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Legend */}
        <CustomLegend visibility={vis} onToggle={toggleVis} />

        {/* Footer totals */}
        <Box sx={{
          display: "flex", flexWrap: "wrap", gap: 2, mt: 2, pt: 2,
          borderTop: "1px solid #BFDBFE",
          justifyContent: { xs: "flex-start", sm: "flex-end" },
        }}>
          {[
            { color: COLORS.strength,   label: "Actual",   value: totals.strength },
            { color: COLORS.eligible,   label: "Eligible", value: totals.eligible },
            { color: COLORS.attendance, label: "Regular",  value: totals.attendance },
            { color: COLORS.kry,        label: "KRY Site", value: totals.kryAttendance },
            { color: COLORS.accent,     label: "TOTAL",    value: totalAttendance, bold: true },
          ].map(({ color, label, value, bold }) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <Box sx={{ width: 9, height: 9, borderRadius: "3px",
                bgcolor: color, border: "1px solid #BFDBFE" }} />
              <Typography variant="caption" sx={{ color: "#475569", fontWeight: bold ? 700 : 400 }}>
                {label}: <strong style={{ color: "#1E3A8A" }}>{value.toLocaleString()}</strong>
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </motion.div>
  );
}