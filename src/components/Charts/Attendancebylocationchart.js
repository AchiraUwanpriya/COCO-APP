import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { LocationOn, CalendarToday, Download } from "@mui/icons-material";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const isPresent = (emp) => emp.inn && emp.inn !== "NR" && emp.inn !== "";

const getRateColor = (rate) => {
  if (rate >= 80) return "#16a34a";
  if (rate >= 60) return "#d97706";
  return "#dc2626";
};

const getRateBg = (rate) => {
  if (rate >= 80) return "#dcfce7";
  if (rate >= 60) return "#fef3c7";
  return "#fee2e2";
};

/* ─── Custom Tooltip ──────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const present  = payload.find((p) => p.dataKey === "present")?.value  || 0;
  const absent   = payload.find((p) => p.dataKey === "absent")?.value   || 0;
  const strength = present + absent;
  const rate     = strength > 0 ? Math.round((present / strength) * 100) : 0;
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        px: 1.8,
        py: 1.4,
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        minWidth: 160,
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#004AAD", mb: 0.8 }}>
        <LocationOn sx={{ fontSize: 13, mr: 0.3, verticalAlign: "middle" }} />
        {label}
      </Typography>
      {[
        { label: "Strength", value: strength, color: "#475569" },
        { label: "Present",  value: present,  color: "#16a34a" },
        { label: "Absent",   value: absent,   color: "#dc2626" },
      ].map(({ label: l, value, color }) => (
        <Box key={l} sx={{ display: "flex", justifyContent: "space-between", gap: 3, mb: 0.3 }}>
          <Typography sx={{ fontSize: "0.72rem", color: "#64748b" }}>{l}</Typography>
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color }}>{value}</Typography>
        </Box>
      ))}
      <Box sx={{ mt: 0.8, pt: 0.8, borderTop: "0.5px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "0.72rem", color: "#64748b" }}>Rate</Typography>
        <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: getRateColor(rate) }}>
          {rate}%
        </Typography>
      </Box>
    </Box>
  );
};

/* ─── Rate Label (rendered inside bar chart) ──────────────────────────────── */
const RateLabel = (props) => {
  const { x, y, width, height, value } = props;
  if (!value) return null;
  const color = getRateColor(value);
  return (
    <text
      x={x + width + 8}
      y={y + height / 2}
      fill={color}
      fontSize={11}
      fontWeight="700"
      dominantBaseline="middle"
      fontFamily="inherit"
    >
      {value}%
    </text>
  );
};

/* ─── AttendanceByLocationChart ───────────────────────────────────────────── */
const AttendanceByLocationChart = ({ data = [], selectedDivision = null }) => {
  const today = new Date().toISOString().split("T")[0];

  /* Build chart data from props */
  const chartData = useMemo(() => {
    if (!selectedDivision) return [];
    const divEmps = data.filter((d) => d.division === selectedDivision);
    const locationMap = {};
    divEmps.forEach((emp) => {
      const loc = emp.loc?.trim() || "Unknown";
      if (!locationMap[loc]) locationMap[loc] = { present: 0, total: 0 };
      locationMap[loc].total++;
      if (isPresent(emp)) locationMap[loc].present++;
    });
    return Object.entries(locationMap)
      .map(([name, { present, total }]) => ({
        name,
        present,
        absent: total - present,
        strength: total,
        rate: total > 0 ? Math.round((present / total) * 100) : 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data, selectedDivision]);

  /* Totals */
  const totals = useMemo(() => {
    const strength = chartData.reduce((s, d) => s + d.strength, 0);
    const present  = chartData.reduce((s, d) => s + d.present,  0);
    const absent   = strength - present;
    const rate     = strength > 0 ? Math.round((present / strength) * 100) : 0;
    return { strength, present, absent, rate };
  }, [chartData]);

  const chartHeight = Math.max(220, chartData.length * 44 + 60);

  if (!selectedDivision) {
    return (
      <Box sx={{ textAlign: "center", py: 6, color: "#94a3b8", fontSize: "0.85rem" }}>
        Select a division to view attendance by location
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,74,173,0.06)",
      }}
    >
      {/* ── Header ── */}
      <Box sx={{ p: "16px 20px 12px" }}>
        {/* Top row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.2, flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b", lineHeight: 1.2 }}>
              {selectedDivision}
            </Typography>
            <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", mt: 0.2 }}>
              Attendance by location ({chartData.length} locations)
            </Typography>
          </Box>
          <Chip
            icon={<CalendarToday sx={{ fontSize: "13px !important" }} />}
            label={today}
            size="small"
            sx={{
              fontSize: "0.7rem", fontWeight: 600, height: 26,
              bgcolor: "#f1f5f9", color: "#475569", border: "0.5px solid #e2e8f0",
              "& .MuiChip-icon": { color: "#64748b" },
            }}
          />
        </Box>

        {/* Stat row */}
        <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 3 }, flexWrap: "wrap" }}>
          {[
            { label: "Strength", value: totals.strength, color: "#185FA5" },
            { label: "Present",  value: totals.present,  color: "#16a34a" },
            { label: "Absent",   value: totals.absent,   color: "#dc2626" },
            {
              label: "Rate",
              value: `${totals.rate}%`,
              color: getRateColor(totals.rate),
              bg: getRateBg(totals.rate),
            },
          ].map(({ label, value, color, bg }) => (
            <Box key={label} sx={{ textAlign: "center", minWidth: 52 }}>
              <Typography
                sx={{
                  fontSize: { xs: "1.35rem", sm: "1.6rem" },
                  fontWeight: 700,
                  color,
                  lineHeight: 1,
                  ...(bg && { bgcolor: bg, borderRadius: "8px", px: 1.2, py: 0.3 }),
                }}
              >
                {value}
              </Typography>
              <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", mt: 0.4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Action buttons ── */}
      <Box sx={{ px: "20px", pb: 1.5, display: "flex", gap: 1 }}>
        <Button
          size="small"
          startIcon={<Download sx={{ fontSize: 15 }} />}
          sx={{
            bgcolor: "#004AAD", color: "#fff", borderRadius: "8px",
            fontSize: "0.72rem", fontWeight: 600, textTransform: "none",
            px: 1.8, py: 0.6,
            "&:hover": { bgcolor: "#0057d0" },
          }}
        >
          Chart PDF
        </Button>
        <Button
          size="small"
          startIcon={<Download sx={{ fontSize: 15 }} />}
          sx={{
            bgcolor: "#16a34a", color: "#fff", borderRadius: "8px",
            fontSize: "0.72rem", fontWeight: 600, textTransform: "none",
            px: 1.8, py: 0.6,
            "&:hover": { bgcolor: "#15803d" },
          }}
        >
          Table PDF
        </Button>
      </Box>

      {/* ── Chart ── */}
      <Box sx={{ px: "12px", pb: 1 }}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 52, left: 8, bottom: 4 }}
            barCategoryGap="28%"
            barGap={2}
          >
            <CartesianGrid horizontal={false} stroke="#f1f5f9" strokeDasharray="3 3" />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={40}
              tick={{ fontSize: 12, fontWeight: 600, fill: "#334155" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,74,173,0.04)" }} />

            {/* Present bar */}
            <Bar dataKey="present" name="Present" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={18}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill="#3B7DD8" />
              ))}
            </Bar>

            {/* Absent bar — rounded right corners on top */}
            <Bar dataKey="absent" name="Absent" stackId="a" radius={[0, 4, 4, 0]} maxBarSize={18}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill="#fca5a5" />
              ))}
              {/* Rate label after the bar */}
              <LabelList dataKey="rate" content={<RateLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* ── Legend ── */}
      <Box sx={{ px: "20px", pb: "14px", display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        {[
          { color: "#3B7DD8", label: "Present" },
          { color: "#fca5a5", label: "Absent"  },
        ].map(({ color, label }) => (
          <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "2px", bgcolor: color }} />
            <Typography sx={{ fontSize: "0.68rem", color: "#64748b" }}>{label}</Typography>
          </Box>
        ))}
        <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
          {[
            { color: "#16a34a", bg: "#dcfce7", label: "≥80%" },
            { color: "#d97706", bg: "#fef3c7", label: "60–79%" },
            { color: "#dc2626", bg: "#fee2e2", label: "<60%"  },
          ].map(({ color, bg, label }) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.5, bgcolor: bg, borderRadius: "6px", px: 0.9, py: 0.3 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: color }} />
              <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color }}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default AttendanceByLocationChart;
 