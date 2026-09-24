import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Dialog,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import GradeRoundedIcon from "@mui/icons-material/GradeRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import { GetEmployees, GetEmployeeById } from "../../action/EmployeeAction";

// ---- Design tokens (match the app's green theme) ----
const BRAND = "#1A5D28";
const TEXT = "#101828";
const SUBTEXT = "#667085";
const MUTED = "#98a2b3";
const BORDER = "#e4e7ec";
const SURFACE = "#ffffff";

const getInitials = (name, serviceNo) => {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.trim().substring(0, 2).toUpperCase();
  }
  if (serviceNo) return String(serviceNo).substring(0, 2).toUpperCase();
  return "EM";
};

// One detail row in the employee dialog
const DetailRow = ({ icon, label, value, onClick, action }) => {
  const clickable = Boolean(onClick && value);
  return (
    <Box
      onClick={clickable ? onClick : undefined}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        py: 1.1,
        px: 0.25,
        cursor: clickable ? "pointer" : "default",
        "&:active": clickable ? { opacity: 0.7 } : {},
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: "9px",
          backgroundColor: "#eef3ef",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: BRAND,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography fontSize={11} fontWeight={600} color={MUTED} sx={{ textTransform: "uppercase", letterSpacing: "0.03em" }}>
          {label}
        </Typography>
        <Typography
          fontSize={13.5}
          fontWeight={600}
          color={clickable ? BRAND : TEXT}
          sx={{ wordBreak: "break-word" }}
        >
          {value || "—"}
        </Typography>
      </Box>
      {action ? action : clickable && <ChevronRightIcon sx={{ fontSize: 18, color: MUTED }} />}
    </Box>
  );
};

const EmployeesSection = () => {
  const dispatch = useDispatch();
  const {
    responseBody,
    loading,
    msg,
    selectedEmployee,
    detailLoading,
    detailMsg,
  } = useSelector(
    (state) =>
      state.employees || {
        responseBody: [],
        loading: false,
        msg: null,
        selectedEmployee: null,
        detailLoading: false,
        detailMsg: null,
      }
  );

  const [search, setSearch] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    // Dedicated Employee slice: action → EmployeeService.GetEmployees → GetEmployees reducer
    dispatch(GetEmployees());
  }, [dispatch]);

  // Map to display fields, keeping the id needed for the by-id lookup
  const rows = useMemo(() => {
    const list = Array.isArray(responseBody) ? responseBody : [];
    return list
      // Only active employees
      .filter((e) => e.HED_IS_ACTIVE === true)
      // Hide this specific service no from the list (requested exclusion)
      .filter((e) => String(e.HED_SERVICE_NO || "").trim() !== "0004086")
      .map((e) => ({
        id: e.HED_EMPLOYEE_ID,
        name: e.HED_REPORT_NAME || "",
        serviceNo: e.HED_SERVICE_NO || "",
        department: e.HDD_DEPARTMENT_NAME || "",
      }));
  }, [responseBody]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.serviceNo.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q)
    );
  }, [rows, search]);

  // Tap an employee → load full details by HED_EMPLOYEE_ID and open the dialog
  const handleSelect = (emp) => {
    if (emp.id === undefined || emp.id === null) return;
    setDetailOpen(true);
    dispatch(GetEmployeeById(emp.id));
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
  };

  const mobileNo = selectedEmployee?.HED_MOBILE_NO || "";

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* Section header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25, px: 0.5 }}>
        <PeopleAltRoundedIcon sx={{ fontSize: 20, color: BRAND }} />
        <Typography fontSize={16} fontWeight={700} color={TEXT}>
          Employees
        </Typography>
        {!loading && rows.length > 0 && (
          <Typography fontSize={12} fontWeight={600} color={MUTED} sx={{ ml: "auto" }}>
            {filtered.length}/{rows.length}
          </Typography>
        )}
      </Box>

      {/* Search */}
      <TextField
        size="small"
        fullWidth
        placeholder="Search by name, service no. or department"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18, color: SUBTEXT }} />
            </InputAdornment>
          ),
          endAdornment: search && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearch("")}>
                <ClearIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 1.25,
          backgroundColor: SURFACE,
          "& .MuiOutlinedInput-root": {
            height: 42,
            fontSize: "13.5px",
            borderRadius: "10px",
            "& fieldset": { borderColor: BORDER },
            "&:hover fieldset": { borderColor: "#c7cdd3" },
            "&.Mui-focused fieldset": { borderColor: BRAND, borderWidth: "1.5px" },
          },
        }}
      />

      {/* States */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress size={26} sx={{ color: BRAND }} />
        </Box>
      ) : msg ? (
        <Paper
          elevation={0}
          sx={{ py: 4, textAlign: "center", borderRadius: "14px", border: `1px solid ${BORDER}` }}
        >
          <Typography fontSize={13} color="#c1121f" fontWeight={600}>
            {msg}
          </Typography>
        </Paper>
      ) : filtered.length === 0 ? (
        <Paper
          elevation={0}
          sx={{ py: 5, textAlign: "center", borderRadius: "14px", border: `1px dashed ${BORDER}` }}
        >
          <Typography fontSize={13.5} fontWeight={600} color={TEXT}>
            {rows.length === 0 ? "No employees found" : "No matching employees"}
          </Typography>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{ borderRadius: "14px", border: `1px solid ${BORDER}`, overflow: "hidden" }}
        >
          {filtered.map((emp, index) => (
            <Box
              key={`${emp.serviceNo}-${index}`}
              onClick={() => handleSelect(emp)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                py: 1.1,
                px: 1.4,
                cursor: "pointer",
                borderBottom: index === filtered.length - 1 ? "none" : `1px solid ${BORDER}`,
                transition: "background-color 0.12s ease",
                "&:active": { backgroundColor: "#f2f8f3" },
                "&:hover": { backgroundColor: "#f7faf8" },
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: "#eef3ef",
                  color: BRAND,
                  fontWeight: 700,
                  fontSize: 12,
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                }}
              >
                {getInitials(emp.name, emp.serviceNo)}
              </Avatar>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography fontSize={13.5} fontWeight={600} color={TEXT} noWrap>
                  {emp.name || `Employee ${emp.serviceNo}`}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
                  <Typography fontSize={11.5} fontWeight={500} color={SUBTEXT} noWrap>
                    {emp.serviceNo || "—"}
                  </Typography>
                  {emp.department && (
                    <>
                      <Box sx={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: MUTED }} />
                      <Typography fontSize={11.5} fontWeight={500} color={SUBTEXT} noWrap>
                        {emp.department}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>

              <ChevronRightIcon sx={{ fontSize: 20, color: MUTED, flexShrink: 0 }} />
            </Box>
          ))}
        </Paper>
      )}

      {/* Employee detail dialog */}
      <Dialog
        open={detailOpen}
        onClose={handleCloseDetail}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: "18px", m: 2 } }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            p: 2,
            background: "linear-gradient(135deg, #1A5D28 0%, #2f7d3f 100%)",
            color: "#fff",
          }}
        >
          <Avatar
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              width: 46,
              height: 46,
            }}
          >
            {getInitials(selectedEmployee?.HED_REPORT_NAME, selectedEmployee?.HED_SERVICE_NO)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography fontSize={15} fontWeight={700} noWrap>
              {detailLoading
                ? "Loading…"
                : selectedEmployee?.HED_REPORT_NAME || "Employee"}
            </Typography>
            {!detailLoading && selectedEmployee?.HED_SERVICE_NO && (
              <Typography fontSize={12} sx={{ opacity: 0.9 }} noWrap>
                Service No {selectedEmployee.HED_SERVICE_NO}
              </Typography>
            )}
          </Box>
          <IconButton size="small" onClick={handleCloseDetail} sx={{ color: "#fff" }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ p: 2 }}>
          {detailLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={26} sx={{ color: BRAND }} />
            </Box>
          ) : detailMsg ? (
            <Typography fontSize={13} color="#c1121f" fontWeight={600} textAlign="center" py={3}>
              {detailMsg}
            </Typography>
          ) : selectedEmployee ? (
            <>
              <DetailRow
                icon={<BadgeRoundedIcon sx={{ fontSize: 18 }} />}
                label="Name"
                value={selectedEmployee.HED_REPORT_NAME}
              />
              <Divider sx={{ borderColor: BORDER }} />
              <DetailRow
                icon={<PlaceRoundedIcon sx={{ fontSize: 18 }} />}
                label="Location"
                value={selectedEmployee.HLD_LOCATION_NAME}
              />
              <Divider sx={{ borderColor: BORDER }} />
              <DetailRow
                icon={<WorkRoundedIcon sx={{ fontSize: 18 }} />}
                label="Designation"
                value={selectedEmployee.HED_DESIGNATION_NAME}
              />
              <Divider sx={{ borderColor: BORDER }} />
              <DetailRow
                icon={<GradeRoundedIcon sx={{ fontSize: 18 }} />}
                label="Grade"
                value={selectedEmployee.HGD_GRADE_NAME}
              />
              <Divider sx={{ borderColor: BORDER }} />
              <DetailRow
                icon={<CategoryRoundedIcon sx={{ fontSize: 18 }} />}
                label="Category"
                value={selectedEmployee.HEC_CATEGORY_NAME}
              />
              <Divider sx={{ borderColor: BORDER }} />
              <DetailRow
                icon={<PhoneRoundedIcon sx={{ fontSize: 18 }} />}
                label="Mobile No"
                value={mobileNo}
                onClick={mobileNo ? () => { window.location.href = `tel:${mobileNo}`; } : undefined}
                action={
                  mobileNo ? (
                    <Box
                      component="a"
                      href={`tel:${mobileNo}`}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Call ${mobileNo}`}
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        backgroundColor: BRAND,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        textDecoration: "none",
                        boxShadow: "0 2px 8px rgba(26,93,40,0.30)",
                        "&:active": { opacity: 0.85 },
                      }}
                    >
                      <PhoneRoundedIcon sx={{ fontSize: 19 }} />
                    </Box>
                  ) : undefined
                }
              />
            </>
          ) : (
            <Typography fontSize={13} color={SUBTEXT} textAlign="center" py={3}>
              No details available
            </Typography>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default EmployeesSection;