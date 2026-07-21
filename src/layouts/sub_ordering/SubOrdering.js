// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Button,
//   Typography,
//   CircularProgress,
//   Alert,
//   Stack,
//   InputAdornment,
//   Chip,
//   Divider,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import BadgeIcon from '@mui/icons-material/Badge';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';


// const AttendanceCard = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [records, setRecords] = useState([]);
//   const [month, setMonth] = useState('');
//   const [sno, setSno] = useState('2004867'); 

//   const serviceNoOptions = [
//     { value: '2004866', label: '2004866' },
//     { value: '2004867', label: '2004867' },
//   ];

//   const generateMonthOptions = () => {
//     const options = [];
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth();

//     for (let i = 0; i < 12; i++) {
//       const date = new Date(currentYear, currentMonth - i, 1);
//       const year = date.getFullYear();
//       const monthNum = String(date.getMonth() + 1).padStart(2, '0');
//       const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//       options.push({
//         value: `${year}-${monthNum}`,
//         label: monthName,
//       });
//     }
//     return options;
//   };

//   const monthOptions = generateMonthOptions();

//   useEffect(() => {
//     const currentDate = new Date();
//     const year = currentDate.getFullYear();
//     const monthNum = String(currentDate.getMonth() + 1).padStart(2, '0');
//     setMonth(`${year}-${monthNum}`);
//   }, []);

//   const readAuthKey = () => {
//     const raw = sessionStorage.getItem('token');
//     if (!raw) return '';
//     try {
//       const parsed = JSON.parse(raw);
//       return parsed || raw;
//     } catch (err) {
//       return raw;
//     }
//   };

//   const fetchAttendance = async () => {
//     if (!month || !sno) {
//       setError('Please enter both Month and Service No.');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const url = `https://esystems.cdl.lk/backend/BizTrack/Attendance/GetsubOrderingAttendanceCard?P_MONTH=${month}&p_sno=${sno}`;

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'auth-key': readAuthKey(),
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.StatusCode === 200 && data.ResultSet) {
//         setRecords(data.ResultSet);
//       } else {
//         setError('No data found or invalid response.');
//         setRecords([]);
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to fetch attendance data.');
//       setRecords([]);
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     if (month && sno) {
//       fetchAttendance();
//     }
//   }, [month, sno]); 

// const formatTime24 = (time) => {
//   if (!time || time === "—") return "—";

//   if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
//     return time.substring(0, 5);
//   }

//   const match = time.match(
//     /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i
//   );

//   if (match) {
//     let hour = parseInt(match[1], 10);
//     const minute = match[2];
//     const period = match[3].toUpperCase();

//     if (period === "PM" && hour !== 12) hour += 12;
//     if (period === "AM" && hour === 12) hour = 0;

//     return `${String(hour).padStart(2, "0")}:${minute}`;
//   }
//   return time;
// };
//   const tableRows = [...records]
//     .sort((a, b) => new Date(a.Date) - new Date(b.Date))
//     .map((rec) => {
//       const dateObj = new Date(rec.Date);
//       const dayNumber = dateObj.getDate();
//       const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
//       const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
//       const dow = dateObj.getDay();

//       return {
//         day: `${dayNumber} ${dayName}`, 
//         fullDay: `${dayNumber} ${dayName}`,
//         month: monthName,
//         inTime: formatTime24(rec.InTime || '—'),
//         outTime: formatTime24(rec.OutTime || '—'),
//         clock: `${rec.InClockno || '—'} / ${rec.OutClockno || '—'}`,
//         VIn: formatTime24(rec.VIn || '—'),
//         VOut: formatTime24(rec.VOut || '—'),
//         isSat: dow === 6,
//         isSun: dow === 0,
//       };
//     });

//   const getRowSx = (row) => {
//     if (row.isSun) {
//       return {
//         bgcolor: '#d5dbe8',
//         '& .MuiTableCell-root': { 
//           color: '#2623c5', 
//           fontWeight: 700,
//           borderBottom: '1px solid #c5cde0'
//         },
//       };
//     }
//     if (row.isSat) {
//       return {
//         bgcolor: '#f0edf8',
//         '& .MuiTableCell-root': { 
//           color: '#4a2d7a', 
//           fontWeight: 600,
//           borderBottom: '1px solid #e5e0f0'
//         },
//       };
//     }
//     return { 
//       bgcolor: '#ffffff',
//       '& .MuiTableCell-root': {
//         borderBottom: '1px solid #f0f0f0'
//       }
//     };
//   };

//   const getDayChipColor = (row) => {
//     if (row.isSun) return { bgcolor: '#8f9bc9', color: '#1e2a4a' };
//     if (row.isSat) return { bgcolor: '#d4c8ec', color: '#4a2d7a' };
//     return { bgcolor: '#e8ecf1', color: '#333' };
//   };

//   return (
//     <Box sx={{ 
//       maxWidth: { xs: '100%', sm: 480, md: 520 }, 
//       mx: 'auto', 
//       p: { xs: 1, sm: 2 }, 
//       bgcolor: '#f5f7fa', 
//       display: 'flex',
//       alignItems: 'center',
//       width: '100%'
//     }}>
//       <Paper elevation={3} sx={{ 
//         borderRadius: 4, 
//         overflow: 'hidden',
//         width: '100%'
//       }}>
//         {/* Search Section - Single Line */}
//         <Box sx={{ p: 2, bgcolor: '#ffffff' }}>
//           <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
//             {/* Month Select */}
//             <FormControl size="small" sx={{ minWidth: 120, flexShrink: 0 }}>
//               <InputLabel id="month-select-label">Month</InputLabel>
//               <Select
//                 labelId="month-select-label"
//                 value={month}
//                 label="Month"
//                 onChange={(e) => setMonth(e.target.value)}
//                 sx={{
//                   borderRadius: 2,
//                   bgcolor: '#fafafa',
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#2623c5',
//                   },
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#e0e0e0',
//                   },
//                 }}
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <CalendarTodayIcon fontSize="small" sx={{ color: '#2623c5' }} />
//                   </InputAdornment>
//                 }
//               >
//                 {monthOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* Service No. Dropdown */}
//             <FormControl size="small" sx={{ minWidth: 120, flexShrink: 0 }}>
//               <InputLabel id="service-select-label">Service No.</InputLabel>
//               <Select
//                 labelId="service-select-label"
//                 value={sno}
//                 label="Service No."
//                 onChange={(e) => setSno(e.target.value)}
//                 sx={{
//                   borderRadius: 2,
//                   bgcolor: '#fafafa',
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#2623c5',
//                   },
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#e0e0e0',
//                   },
//                 }}
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <BadgeIcon fontSize="small" sx={{ color: '#2623c5' }} />
//                   </InputAdornment>
//                 }
//               >
//                 {serviceNoOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Stack>

//           {error && (
//             <Alert severity="error" sx={{ borderRadius: 2, mt: 1 }}>
//               {error}
//             </Alert>
//           )}
//         </Box>

//         <Divider />

//         {/* Attendance Table */}
        
//         <TableContainer sx={{ maxHeight: 600, overflowY: 'auto', bgcolor: '#fafafa' }}>
//           <Table size="small" stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ 
//                   fontWeight: 700, 
//                   color: '#2623c5', 
//                   bgcolor: '#f0f2f5',
//                   borderBottom: '2px solid #2623c5',
//                   fontSize: '0.7rem',
//                   py: 0.75,
//                   px: 1,
//                   whiteSpace: 'nowrap'
//                 }}>
//                   DAY
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 700, 
//                   color: '#2623c5', 
//                   bgcolor: '#f0f2f5',
//                   borderBottom: '2px solid #2623c5',
//                   fontSize: '0.7rem',
//                   py: 0.75,
//                   px: 1,
//                   whiteSpace: 'nowrap'
//                 }}>
//                   <AccessTimeIcon fontSize="small" sx={{ fontSize: 12, mr: 0.5 }} />
//                   IN
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 700, 
//                   color: '#2623c5', 
//                   bgcolor: '#f0f2f5',
//                   borderBottom: '2px solid #2623c5',
//                   fontSize: '0.7rem',
//                   whiteSpace: 'nowrap',
//                   py: 0.75,
//                   px: 1
//                 }}>
//                   <AccessTimeIcon fontSize="small" sx={{ fontSize: 12, mr: 0.5 }} />
//                   OUT
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 700, 
//                   color: '#2623c5', 
//                   bgcolor: '#f0f2f5',
//                   borderBottom: '2px solid #2623c5',
//                   fontSize: '0.7rem',
//                   py: 0.75,
//                   px: 1,
//                   whiteSpace: 'nowrap'
//                 }}>
//                   Clock IN/OUT
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 700, 
//                   color: '#2623c5', 
//                   bgcolor: '#f0f2f5',
//                   borderBottom: '2px solid #2623c5',
//                   fontSize: '0.7rem',
//                   py: 0.75,
//                   px: 1,
//                   whiteSpace: 'nowrap'
//                 }}>
//                   <DirectionsCarIcon fontSize="small" sx={{ fontSize: 12, mr: 0.5 }} />
//                   V-IN
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 700, 
//                   color: '#2623c5', 
//                   bgcolor: '#f0f2f5',
//                   borderBottom: '2px solid #2623c5',
//                   fontSize: '0.7rem',
//                   py: 0.75,
//                   px: 1,
//                   whiteSpace: 'nowrap'
//                 }}>
//                   <DirectionsCarIcon fontSize="small" sx={{ fontSize: 12, mr: 0.5 }} />
//                   V-OUT
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {tableRows.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.disabled' }}>
//                     <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                       🔍 No attendance records found
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       Please search with valid month and service number
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 tableRows.map((row, index) => (
//                   <TableRow 
//                     key={index} 
//                     hover 
//                     sx={getRowSx(row)}
//                   >
//                     <TableCell sx={{ py: 0.5, px: 1 }}>
//                       <Chip 
//                         label={row.day}
//                         size="small"
//                         sx={{
//                           ...getDayChipColor(row),
//                           fontWeight: 700,
//                           fontSize: '0.65rem',
//                           minWidth: 44,
//                           height: 20,
//                           borderRadius: 1
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.72rem', py: 0.5, px: 1 }}>
//                       {row.inTime}
//                     </TableCell>
//                     <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.72rem', py: 0.5, px: 1 }}>
//                       {row.outTime}
//                     </TableCell>
//                     <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.72rem', py: 0.5, px: 1 }}>
//                       {row.clock}
//                     </TableCell>
//                     <TableCell sx={{ fontSize: '0.72rem', py: 0.5, px: 1 }}>
//                       {row.VIn}
//                     </TableCell>
//                     <TableCell sx={{ fontSize: '0.72rem', py: 0.5, px: 1 }}>
//                       {row.VOut}
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Footer */}
//         {tableRows.length > 0 && (
//           <Box sx={{ 
//             p: 2, 
//             bgcolor: '#f5f7fa',
//             borderTop: '1px solid #e0e0e0',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}>
//             <Typography variant="caption" color="text.secondary">
//               📊 Showing {tableRows.length} records
//             </Typography>
//             <Box sx={{ display: 'flex', gap: 1 }}>
//               <Chip 
//                 label="Sun" 
//                 size="small" 
//                 sx={{ bgcolor: '#8f9bc9', color: '#1e2a4a', fontWeight: 600, fontSize: '0.6rem' }}
//               />
//               <Chip 
//                 label="Sat" 
//                 size="small" 
//                 sx={{ bgcolor: '#d4c8ec', color: '#4a2d7a', fontWeight: 600, fontSize: '0.6rem' }}
//               />
//             </Box>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default AttendanceCard;





import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetsubOrderingAttendanceCard } from '../../action/Attendance';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  InputAdornment,
  Chip,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';


const AttendanceCard = () => {
  const dispatch = useDispatch();
  const { subOrderingAttendance: records = [], loading, msg } = useSelector(
    (state) => state.attendanceCard
  );

  const [localError, setLocalError] = useState(null);
  const [month, setMonth] = useState('');
  const [sno, setSno] = useState('2004867'); 

  const serviceNoOptions = [
    { value: '2004866', label: '2004866/H.M.R Sriyantha' },
    { value: '2004867', label: '2004867/R.I.P Dissanayake' },
  ];

  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const year = date.getFullYear();
      const monthNum = String(date.getMonth() + 1).padStart(2, '0');
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({
        value: `${year}-${monthNum}`,
        label: monthName,
      });
    }
    return options;
  };

  const monthOptions = generateMonthOptions();

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const monthNum = String(currentDate.getMonth() + 1).padStart(2, '0');
    setMonth(`${year}-${monthNum}`);
  }, []);

  const fetchAttendance = () => {
    if (!month || !sno) {
      setLocalError('Please enter both Month and Service No.');
      return;
    }

    setLocalError(null);
    dispatch(GetsubOrderingAttendanceCard(month, sno));
  };

  useEffect(() => {
    if (month && sno) {
      fetchAttendance();
    }
  }, [month, sno]); 

  const error = localError || msg;

const formatTime24 = (time) => {
  if (!time || time === "—") return "—";

  if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
    return time.substring(0, 5);
  }

  const match = time.match(
    /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i
  );

  if (match) {
    let hour = parseInt(match[1], 10);
    const minute = match[2];
    const period = match[3].toUpperCase();

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return `${String(hour).padStart(2, "0")}:${minute}`;
  }
  return time;
};
  const tableRows = [...records]
    .sort((a, b) => new Date(a.Date) - new Date(b.Date))
    .map((rec) => {
      const dateObj = new Date(rec.Date);
      const dayNumber = dateObj.getDate();
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const dow = dateObj.getDay();

      return {
        day: `${dayNumber} ${dayName}`, 
        fullDay: `${dayNumber} ${dayName}`,
        month: monthName,
        inTime: formatTime24(rec.InTime || '—'),
        outTime: formatTime24(rec.OutTime || '—'),
        clock: `${rec.InClockno || '—'} / ${rec.OutClockno || '—'}`,
        VIn: formatTime24(rec.VIn || '—'),
        VOut: formatTime24(rec.VOut || '—'),
        isSat: dow === 6,
        isSun: dow === 0,
      };
    });

  const getRowSx = (row) => {
    if (row.isSun) {
      return {
        bgcolor: '#d5dbe8',
        '& .MuiTableCell-root': { 
          color: '#2623c5', 
          fontWeight: 700,
          borderBottom: '1px solid #c5cde0'
        },
      };
    }
    if (row.isSat) {
      return {
        bgcolor: '#f0edf8',
        '& .MuiTableCell-root': { 
          color: '#4a2d7a', 
          fontWeight: 600,
          borderBottom: '1px solid #e5e0f0'
        },
      };
    }
    return { 
      bgcolor: '#ffffff',
      '& .MuiTableCell-root': {
        borderBottom: '1px solid #f0f0f0'
      }
    };
  };

  const getDayChipColor = (row) => {
    if (row.isSun) return { bgcolor: '#8f9bc9', color: '#1e2a4a' };
    if (row.isSat) return { bgcolor: '#d4c8ec', color: '#4a2d7a' };
    return { bgcolor: '#e8ecf1', color: '#333' };
  };

  return (
    <Box sx={{ 
      maxWidth: { xs: '100%', sm: 480, md: 520 }, 
      mx: 'auto', 
      p: { xs: 1, sm: 2 }, 
      bgcolor: '#f5f7fa', 
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    }}>
      <Paper elevation={3} sx={{ 
        borderRadius: 4, 
        overflow: 'hidden',
        width: '100%'
      }}>
        {/* Search Section - Single Line */}
        <Box sx={{ p: 2, bgcolor: '#ffffff' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
            {/* Month Select */}
            <FormControl size="small" sx={{ minWidth: 120, flexShrink: 0 }}>
              <InputLabel id="month-select-label" sx={{ fontSize: '0.75rem' }}>Month</InputLabel>
              <Select
                labelId="month-select-label"
                value={month}
                label="Month"
                onChange={(e) => setMonth(e.target.value)}
                sx={{
                  borderRadius: 2,
                  bgcolor: '#fafafa',
                  fontSize: '0.75rem',
                  '& .MuiSelect-select': {
                    fontSize: '0.75rem',
                    py: 0.75,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2623c5',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" sx={{ color: '#2623c5', fontSize: '0.85rem' }} />
                  </InputAdornment>
                }
              >
                {monthOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Service No. Dropdown */}
            <FormControl size="small" sx={{ minWidth: 120, flexShrink: 0 }}>
              <InputLabel id="service-select-label" sx={{ fontSize: '0.75rem' }}>Service No.</InputLabel>
              <Select
                labelId="service-select-label"
                value={sno}
                label="Service No."
                onChange={(e) => setSno(e.target.value)}
                sx={{
                  borderRadius: 2,
                  bgcolor: '#fafafa',
                  fontSize: '0.75rem',
                  '& .MuiSelect-select': {
                    fontSize: '0.75rem',
                    py: 0.75,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2623c5',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <BadgeIcon fontSize="small" sx={{ color: '#2623c5', fontSize: '0.85rem' }} />
                  </InputAdornment>
                }
              >
                {serviceNoOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2, mt: 1 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Divider />

        {/* Attendance Table */}
        
        <TableContainer sx={{ maxHeight: 600, overflowY: 'auto', bgcolor: '#fafafa' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#2623c5', 
                  bgcolor: '#f0f2f5',
                  borderBottom: '2px solid #2623c5',
                  fontSize: '0.7rem',
                  py: 0.75,
                  px: 1,
                  whiteSpace: 'nowrap'
                }}>
                  DAY
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#2623c5', 
                  bgcolor: '#f0f2f5',
                  borderBottom: '2px solid #2623c5',
                  fontSize: '0.7rem',
                  py: 0.75,
                  px: 1,
                  whiteSpace: 'nowrap'
                }}>
                  <AccessTimeIcon fontSize="small" sx={{ fontSize: 12, mr: 0.5 }} />
                  IN
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#2623c5', 
                  bgcolor: '#f0f2f5',
                  borderBottom: '2px solid #2623c5',
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap',
                  py: 0.75,
                  px: 1
                }}>
                  <AccessTimeIcon fontSize="small" sx={{ fontSize: 12, mr: 0.5 }} />
                  OUT
                </TableCell>
                {/* <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#2623c5', 
                  bgcolor: '#f0f2f5',
                  borderBottom: '2px solid #2623c5',
                  fontSize: '0.7rem',
                  py: 0.75,
                  px: 1,
                  whiteSpace: 'nowrap'
                }}>
                  Clock IN/OUT
                </TableCell> */}
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#2623c5', 
                  bgcolor: '#f0f2f5',
                  borderBottom: '2px solid #2623c5',
                  fontSize: '0.7rem',
                  py: 0.75,
                  px: 1,
                  whiteSpace: 'nowrap'
                }}>
                  <DirectionsCarIcon fontSize="small" sx={{ fontSize: 12, mr: 0.5 }} />
                  V-IN
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#2623c5', 
                  bgcolor: '#f0f2f5',
                  borderBottom: '2px solid #2623c5',
                  fontSize: '0.7rem',
                  py: 0.75,
                  px: 1,
                  whiteSpace: 'nowrap'
                }}>
                  <DirectionsCarIcon fontSize="small" sx={{ fontSize: 12, mr: 0.5 }} />
                  V-OUT
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.disabled' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      🔍 No attendance records found
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Please search with valid month and service number
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tableRows.map((row, index) => (
                  <TableRow 
                    key={index} 
                    hover 
                    sx={getRowSx(row)}
                  >
                    <TableCell sx={{ py: 0.5, px: 1 }}>
                      <Chip 
                        label={row.day}
                        size="small"
                        sx={{
                          ...getDayChipColor(row),
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          minWidth: 44,
                          height: 20,
                          borderRadius: 1
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.72rem', py: 0.5, px: 1 }}>
                      {row.inTime}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.72rem', py: 0.5, px: 1 }}>
                      {row.outTime}
                    </TableCell>
                    {/* <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.72rem', py: 0.5, px: 1 }}>
                      {row.clock}
                    </TableCell> */}
                    <TableCell sx={{ fontSize: '0.72rem', py: 0.5, px: 1 }}>
                      {row.VIn}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', py: 0.5, px: 1 }}>
                      {row.VOut}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        {tableRows.length > 0 && (
          <Box sx={{ 
            p: 2, 
            bgcolor: '#f5f7fa',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="caption" color="text.secondary">
              📊 Showing {tableRows.length} records
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label="Sun" 
                size="small" 
                sx={{ bgcolor: '#8f9bc9', color: '#1e2a4a', fontWeight: 600, fontSize: '0.6rem' }}
              />
              <Chip 
                label="Sat" 
                size="small" 
                sx={{ bgcolor: '#d4c8ec', color: '#4a2d7a', fontWeight: 600, fontSize: '0.6rem' }}
              />
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AttendanceCard;