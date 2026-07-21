// import React, { useEffect } from "react";
// import { Box, Typography } from "@mui/material";
// import { useMediaQuery, useTheme } from "@mui/material";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   LabelList,
// } from "recharts";
// import { useDispatch, useSelector } from "react-redux";
// import { GetCDLCategoryAtt } from "../../action/Attendance";
// import { CDPLCCustomTooltip } from "./ChartUtils";

// const seriesColors = {
//   strength: "#e07b39",
//   attendance: "#4472c4",
// };

// export function CDPLCBreakdown({
//   cdplcData: propCdplcData,
//   radialData: propRadialData,
//   hadDate,
// }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const categorySpacing = 12; 
//   const dispatch = useDispatch();
//   const {
//     cdplcData: reduxCdplcData,
//     loading,
//     msg,
//   } = useSelector((state) => state.attendanceCard);
 
//   const apiData =
//     reduxCdplcData && reduxCdplcData.length > 0
//       ? reduxCdplcData
//       : propCdplcData;

//   useEffect(() => { 
//     const dateToFetch = hadDate || new Date().toISOString().split("T")[0];
//     console.log("CDPLCBreakdown: Fetching data for date:", dateToFetch);
//     dispatch(GetCDLCategoryAtt(dateToFetch));
//   }, [dispatch, hadDate]);
 

// const transformedCdplc = apiData
//   ? apiData
//       .filter((item) => item.Type && item.Type.toUpperCase() !== "TOTAL")
//       .map((item) => {
//         const typeName = item.Type.toUpperCase();
//         const attendance = item.Attendance || 0;
//         const strength = item.EligibleStrength || item.Strength || 0;
//         return {
//           name: typeName,
//           attendance,
//           absent: Math.max(0, strength - attendance),   
//           strength,
//           actualPct: item.ActualPercentage,
//           eligiblePct: item.EligiblePercentage
//         };
//       })
//   : [];

//   const totalItem = apiData?.find(
//     (item) => item.Type && item.Type.toUpperCase() === "TOTAL",
//   );
//   const overallPercentage = totalItem ? totalItem.ActualPercentage : "N/A";
 
//   const totalStrength =
//     totalItem?.EligibleStrength ||
//     transformedCdplc.reduce((acc, cur) => acc + (Number(cur.strength) || 0), 0);
//   const totalAttendance =
//     totalItem?.Attendance ||
//     transformedCdplc.reduce((acc, cur) => acc + (Number(cur.attendance) || 0), 0);
//   const totalPercentage =
//     totalStrength > 0 ? Math.round((totalAttendance / totalStrength) * 100) : "N/A";
 
//     const formatNumber = (value) => {
//       if (value === null || value === undefined || value === "") return "-";
//       return Number(value).toLocaleString();
//     };


//   console.log("CDPLCBreakdown: loaded data", {
//     apiData,
//     transformedCdplc,
//     overallPercentage,
//     loading,
//     msg,
//     reduxCdplcData,
//   });

 
//   if (loading && !apiData) {
//     return (
//       <Box
//         sx={{
//           animation: `fadeInUp 0.5s ease-out 0.2s forwards`,
//           opacity: 0,
//           "@keyframes fadeInUp": {
//             "0%": { opacity: 0, transform: "translateY(24px)" },
//             "100%": { opacity: 1, transform: "translateY(0)" },
//           }
//         }}
//       >
//         <Box
//           sx={{
//             overflow: "hidden",
//             backgroundColor: "#ffffff",
//             borderRadius: "12px",
//             padding: "24px",
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
//             border: "1px solid #e2e8f0",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             minHeight: "400px",
//           }}
//         >
//           <Typography sx={{ color: "#64748b" }}>
//             Loading chart data...
//           </Typography>
//         </Box>
//       </Box>
//     );
//   }

//   // Show error state
//   if (msg && !apiData) {
//     return (
//       <Box
//         sx={{
//           animation: `fadeInUp 0.5s ease-out 0.2s forwards`,
//           opacity: 0,
//           "@keyframes fadeInUp": {
//             "0%": { opacity: 0, transform: "translateY(24px)" },
//             "100%": { opacity: 1, transform: "translateY(0)" },
//           },
//         }}
//       >
//         <Box
//           sx={{
//             overflow: "hidden",
//             backgroundColor: "#ffffff",
//             borderRadius: "12px",
//             padding: "24px",
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
//             border: "1px solid #e2e8f0",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             minHeight: "400px",
//           }}
//         >
//           <Typography sx={{ color: "#ef4444" }}>
//             Error loading chart data: {msg}
//           </Typography>
//         </Box>
//       </Box>
//     );
//   }

//   // Show empty state
//   if (!apiData || (transformedCdplc && transformedCdplc.length === 0)) {
//     return (
//       <Box
//         sx={{
//           animation: `fadeInUp 0.5s ease-out 0.2s forwards`,
//           opacity: 0,
//           "@keyframes fadeInUp": {
//             "0%": { opacity: 0, transform: "translateY(24px)" },
//             "100%": { opacity: 1, transform: "translateY(0)" },
//           },
//         }}
//       >
//         <Box
//           sx={{
//             overflow: "hidden",
//             backgroundColor: "#ffffff",
//             borderRadius: "12px",
//             padding: "24px",
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
//             border: "1px solid #e2e8f0",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             minHeight: "400px",
//           }}
//         >
//           <Typography sx={{ color: "#64748b" }}>
//             No data available for the selected date
//           </Typography>
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         animation: `fadeInUp 0.5s ease-out 0.2s forwards`,
//         opacity: 0,
//         "@keyframes fadeInUp": {
//           "0%": { opacity: 0, transform: "translateY(24px)" },
//           "100%": { opacity: 1, transform: "translateY(0)" },
//         },
//       }}
//     >
//       <Box
//         sx={{
//           overflow: "hidden",
//           backgroundColor: "#ffffff",
//           borderRadius: "12px",
//           padding: "24px",
//           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
//           border: "1px solid #e2e8f0",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "flex-start",
//             justifyContent: "space-between",
//             marginBottom: "24px",
//           }}
//         >
//           <Box>
//             <Typography
//               sx={{
//                 fontSize: "18px",
//                 fontWeight: 600,
//                 color: "#1a2d4d",
//               }}
//             >
//               CDPLC Employee Strength 
//             </Typography>
            
//           </Box>
//         </Box>

//         {/* Chart */}
//         <Box sx={{ height: "200px", width: "100%", marginBottom: "16px" }}>
//           <ResponsiveContainer width="100%" height="100%">
//             {/* Previous chart (radial) */}
//             {/*
//             <RadialBarChart
//               cx="50%"
//               cy="50%"
//               innerRadius="20%"
//               outerRadius="90%"
//               data={radialData}
//               startAngle={90}
//               endAngle={-270}
//             >
//               <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
//               <RadialBar
//                 dataKey="value"
//                 cornerRadius={6}
//                 background={{
//                   fill: "rgba(0, 0, 0, 0.04)",
//                 }}
//                 label={false}
//               />
//               <Tooltip
//                 content={(props) => (
//                   <CDPLCCustomTooltip {...props} cdplcData={transformedCdplc} />
//                 )}
//               />
//             </RadialBarChart>
//             */}

//             {/* Current chart (bar) */}
//             <BarChart
//   data={transformedCdplc}
//   layout="vertical"
//   margin={{ top: 5, right: isMobile ? 20 : 100, left: 0, bottom: 10 }}
//   barCategoryGap={categorySpacing}
//   barGap={2}
// >
//   <CartesianGrid
//     strokeDasharray="3 3"
//     stroke="rgba(0,0,0,0.08)"
//     horizontal={false}
//   />
//   <XAxis
//     type="number"
//     axisLine={false}
//     tickLine={false}
//     tick={{ fill: "#64748b", fontSize: 11 }}
//     tickFormatter={(value) => Number(value).toLocaleString()}
//   />
//   <YAxis
//     type="category"
//     dataKey="name"
//     width={isMobile ? 70 : 90}
//     axisLine={false}
//     tickLine={false}
//     tick={{ fill: "#475569", fontSize: 10 }}
//   />
//   <Tooltip
//     content={(props) => (
//       <CDPLCCustomTooltip {...props} cdplcData={transformedCdplc} />
//     )}
//   />

//   {/* ── STACKED: Attendance (present) ── */}
//   <Bar
//     dataKey="attendance"
//     name="Attendance"
//     fill={seriesColors.attendance}     
//     stackId="stack"                     
//     radius={[0, 0, 0, 0]}               
//     barSize={isMobile ? 14 : 18}
//   >
//     <LabelList
//       dataKey="attendance"
//       position="insideRight"            
//       style={{ fill: "#ffffff" }}
//       fontSize={11}
//       fontWeight={600}
//       formatter={formatNumber}
//     />
//   </Bar>

//   {/* ── STACKED: Absent (remaining strength) ── */}
//   <Bar
//     dataKey="absent"
//     name="Absent"
//     fill={seriesColors.strength}     
//     stackId="stack"                      
//     radius={[0, 8, 8, 0]}              
//     barSize={isMobile ? 14 : 18}
//   >
//     <LabelList
//       dataKey="strength"                
//       position="right"
//       style={{ fill: "#0f0f0f" }}
//       fontSize={11}
//       fontWeight={700}
//       formatter={formatNumber}
//     />
//   </Bar>
// </BarChart>
//           </ResponsiveContainer>
//         </Box>

//         {/* Legend */}
//         <Box
//           sx={{
//             display: "flex",
//             flexWrap: "wrap",
//             justifyContent: "center",
//             gap: "16px",
//             marginTop: "8px",
//           }}
//         >
//           {[
//             { label: "Eligible Strength", color: seriesColors.strength },
//             { label: "Attendance", color: seriesColors.attendance },
//           ].map((item) => (
//             <Box
//               key={item.label}
//               sx={{ display: "flex", alignItems: "center", gap: "6px" }}
//             >
//               <Box
//                 sx={{
//                   width: "10px",
//                   height: "10px",
//                   borderRadius: "3px",
//                   backgroundColor: item.color,
//                 }}
//               />
//               <Typography sx={{ fontSize: "12px", color: "#64748b" }}>
//                 {item.label}
//               </Typography>
//             </Box>
//           ))}
//         </Box>

//         {/* Summary row (totals) */}
//         {/* <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             gap: 2,
//             mt: 2,
//             pt: 2,
//             borderTop: "1px solid #eef2f6",
//             alignItems: "center",
//             flexWrap: "wrap",
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Box sx={{ width: 8, height: 8, borderRadius: 2, bgcolor: seriesColors.strength }} />
//             <Box>
//               <Typography sx={{ fontSize: 12, color: "#64748b" }}>Total Strength</Typography>
//               <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1a2d4d" }}>
//                 {totalStrength.toLocaleString()}
//               </Typography>
//             </Box>
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Box sx={{ width: 8, height: 8, borderRadius: 2, bgcolor: seriesColors.attendance }} />
//             <Box>
//               <Typography sx={{ fontSize: 12, color: "#64748b" }}>Total Attendance</Typography>
//               <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1a2d4d" }}>
//                 {totalAttendance.toLocaleString()}
//               </Typography>
//             </Box>
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Box sx={{ width: 8, height: 8, borderRadius: 2, bgcolor: "#f59e0b" }} />
//             <Box>
//               <Typography sx={{ fontSize: 12, color: "#64748b" }}>Percentage</Typography>
//               <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1a2d4d" }}>
//                 {typeof totalPercentage === "number" ? `${totalPercentage}%` : totalPercentage}
//               </Typography>
//             </Box>
//           </Box>
//         </Box> */}
//       </Box>
//     </Box>
//   );
// }



import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { GetCDLCategoryAtt } from "../../action/Attendance";

const seriesColors = {
  strength: "#e07b39",
  attendance: "#4472c4",
};

export function CDPLCBreakdown({
  cdplcData: propCdplcData,
  radialData: propRadialData,
  hadDate,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const categorySpacing = 12;
  const dispatch = useDispatch();
  const {
    cdplcData: reduxCdplcData,
    loading,
    msg,
  } = useSelector((state) => state.attendanceCard);

  const apiData =
    reduxCdplcData && reduxCdplcData.length > 0
      ? reduxCdplcData
      : propCdplcData;

  useEffect(() => {
    const dateToFetch = hadDate || new Date().toISOString().split("T")[0];
    console.log("CDPLCBreakdown: Fetching data for date:", dateToFetch);
    dispatch(GetCDLCategoryAtt(dateToFetch));
  }, [dispatch, hadDate]);

  const transformedCdplc = apiData
    ? apiData
        .filter((item) => item.Type && item.Type.toUpperCase() !== "TOTAL")
        .map((item) => {
          const typeName = item.Type.toUpperCase();
          const attendance = item.Attendance || 0;
          const strength = item.EligibleStrength || item.Strength || 0;
          return {
            name: typeName,
            attendance,
            absent: Math.max(0, strength - attendance),
            strength,
            actualPct: item.ActualPercentage,
            eligiblePct: item.EligiblePercentage,
          };
        })
    : [];

  const totalItem = apiData?.find(
    (item) => item.Type && item.Type.toUpperCase() === "TOTAL"
  );
  const overallPercentage = totalItem ? totalItem.ActualPercentage : "N/A";

  const totalStrength =
    totalItem?.EligibleStrength ||
    transformedCdplc.reduce((acc, cur) => acc + (Number(cur.strength) || 0), 0);
  const totalAttendance =
    totalItem?.Attendance ||
    transformedCdplc.reduce(
      (acc, cur) => acc + (Number(cur.attendance) || 0),
      0
    );
  const totalPercentage =
    totalStrength > 0
      ? Math.round((totalAttendance / totalStrength) * 100)
      : "N/A";

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    return Number(value).toLocaleString();
  };

  console.log("CDPLCBreakdown: loaded data", {
    apiData,
    transformedCdplc,
    overallPercentage,
    loading,
    msg,
    reduxCdplcData,
  });

  // Show loading state
  if (loading && !apiData) {
    return (
      <Box
        sx={{
          animation: `fadeInUp 0.5s ease-out 0.2s forwards`,
          opacity: 0,
          "@keyframes fadeInUp": {
            "0%": { opacity: 0, transform: "translateY(24px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Box
          sx={{
            overflow: "hidden",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
          }}
        >
          <Typography sx={{ color: "#64748b" }}>
            Loading chart data...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (msg && !apiData) {
    return (
      <Box
        sx={{
          animation: `fadeInUp 0.5s ease-out 0.2s forwards`,
          opacity: 0,
          "@keyframes fadeInUp": {
            "0%": { opacity: 0, transform: "translateY(24px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Box
          sx={{
            overflow: "hidden",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
          }}
        >
          <Typography sx={{ color: "#ef4444" }}>
            Error loading chart data: {msg}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Show empty state
  if (!apiData || (transformedCdplc && transformedCdplc.length === 0)) {
    return (
      <Box
        sx={{
          animation: `fadeInUp 0.5s ease-out 0.2s forwards`,
          opacity: 0,
          "@keyframes fadeInUp": {
            "0%": { opacity: 0, transform: "translateY(24px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Box
          sx={{
            overflow: "hidden",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
          }}
        >
          <Typography sx={{ color: "#64748b" }}>
            No data available for the selected date
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        animation: `fadeInUp 0.5s ease-out 0.2s forwards`,
        opacity: 0,
        "@keyframes fadeInUp": {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#1a2d4d",
              }}
            >
              CDPLC Attendance Based on Category
            </Typography>
          </Box>
        </Box>

        {/* Chart */}
        <Box sx={{ height: "250px", width: "100%", marginBottom: "16px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={transformedCdplc}
              layout="vertical"
              margin={{ top: 5, right: isMobile ? 20 : 100, left: 0, bottom: 10 }}
              barCategoryGap={categorySpacing}
              barGap={2}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.08)"
                horizontal={false}
              />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(value) => Number(value).toLocaleString()}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={isMobile ? 70 : 90}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#475569", fontSize: 10 }}
              />

              {/* ── STACKED: Attendance (present) ── */}
              <Bar
                dataKey="attendance"
                name="Attendance"
                fill={seriesColors.attendance}
                stackId="stack"
                radius={[0, 0, 0, 0]}
                barSize={isMobile ? 14 : 18}
              >
                {/* Attendance count shown ABOVE the bar */}
                <LabelList
                  dataKey="attendance"
                  position="top"
                  style={{ fill: "#4472c4" }}
                  fontSize={11}
                  fontWeight={600}
                  formatter={formatNumber}
                />
              </Bar>

              {/* ── STACKED: Absent (remaining strength) ── */}
              <Bar
                dataKey="absent"
                name="Absent"
                fill={seriesColors.strength}
                stackId="stack"
                radius={[0, 8, 8, 0]}
                barSize={isMobile ? 14 : 18}
              >
                {/* Eligible Strength + rounded % OUTSIDE right — strength in orange, % in dark */}
                <LabelList
                  dataKey="strength"
                  position="right"
                  content={(props) => {
                    const { x, y, width, height, index } = props;
                    const item = transformedCdplc[index];
                    if (!item) return null;
                    const strengthLabel = formatNumber(item.strength);
                    const rawPct = item.actualPct;
                    const rounded =
                      rawPct != null && rawPct !== ""
                        ? Math.round(parseFloat(rawPct))
                        : null;
                    const startX = x + width + 6;
                    const midY = y + height / 2;
                    return (
                      <text dominantBaseline="middle" fontSize={11} fontWeight={700}>
                        <tspan x={startX} y={midY} fill={seriesColors.strength}>
                          {strengthLabel}
                        </tspan>
                        {rounded != null && (
                          <tspan fill="#1a2d4d" dx={3}>
                            {` (${rounded}%)`}
                          </tspan>
                        )}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "16px",
            marginTop: "8px",
          }}
        >
          {[
            { label: "Eligible Strength", color: seriesColors.strength },
            { label: "Attendance", color: seriesColors.attendance },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "3px",
                  backgroundColor: item.color,
                }}
              />
              <Typography sx={{ fontSize: "12px", color: "#64748b" }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}