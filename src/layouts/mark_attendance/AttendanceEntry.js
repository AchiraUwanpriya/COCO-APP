// import React, { useState, useEffect } from 'react';
// import {
//   Container, Paper, TextField, Button, Box, Typography, Alert,
//   CircularProgress, Card, CardContent, Grid, Divider,
//   FormControlLabel, Checkbox, FormGroup, Dialog, DialogTitle,
//   DialogContent, DialogActions, DialogContentText, Chip,
// } from '@mui/material';
// import {
//   CheckCircle, LocationOn, AccessTime, Person, Logout, Login,
//   Warning, MyLocation, Send,
// } from '@mui/icons-material';
// import bgImage from "../../assets/images/Attend.jpg";
// import axios from "axios";


// const getAuthHeaders = () => ({
//   'Content-Type': 'application/json',
//    'auth-key': JSON.parse(sessionStorage.getItem('token') || '""'),
// });

// // ─── LOCATION OUTSIDE POPUP ──────────────────────────────────────────────────

// const LocationOutsideDialog = ({ open, distanceMeters, onAccept, onCancel, loading }) => {
//   const [reason, setReason] = useState('');
//   const [reasonError, setReasonError] = useState('');

//   const handleAccept = () => {
//     if (!reason.trim()) {
//       setReasonError('Please provide a reason for being outside the site location.');
//       return;
//     }
//     setReasonError('');
//     onAccept(reason.trim());
//   };

//   const handleClose = () => {
//     setReason('');
//     setReasonError('');
//     onCancel();
//   };

//   return (
//     <Dialog open={open} maxWidth="sm" fullWidth onClose={handleClose}>
//       <DialogTitle
//         sx={{
//           backgroundColor: '#fff3e0',
//           display: 'flex',
//           alignItems: 'center',
//           gap: 1,
//           color: '#e65100',
//           fontWeight: 'bold',
//         }}
//       >
//         <Warning sx={{ color: '#f57c00' }} />
//         Outside Site Location
//       </DialogTitle>

//       <DialogContent sx={{ pt: 3 }}>
//         <Box
//           sx={{
//             backgroundColor: '#fff8e1',
//             border: '1px solid #ffe082',
//             borderRadius: 2,
//             p: 2,
//             mb: 3,
//             display: 'flex',
//             alignItems: 'center',
//             gap: 2,
//           }}
//         >
//           <MyLocation sx={{ color: '#f57c00', fontSize: 36 }} />
//           <Box>
//             <Typography variant="subtitle1" fontWeight="bold" color="#e65100">
//               You are outside the allowed area
//             </Typography>
//             <Typography variant="body2" color="#bf360c">
//               You are approximately{' '}
//               <strong>{Math.round(distanceMeters)} meters</strong> away from your
//               assigned site location.
//             </Typography>
//             <Chip
//               size="small"
//               label={`${Math.round(distanceMeters)} m from site`}
//               sx={{
//                 mt: 1,
//                 backgroundColor: '#ffccbc',
//                 color: '#bf360c',
//                 fontWeight: 'bold',
//               }}
//               icon={<LocationOn sx={{ color: '#bf360c !important', fontSize: 14 }} />}
//             />
//           </Box>
//         </Box>

//         <DialogContentText sx={{ mb: 2, color: '#555' }}>
//           You can still submit your attendance, but it will be sent for{' '}
//           <strong>Reprting Officer approval</strong>. Please provide a reason for being
//           outside the site location.
//         </DialogContentText>

//         <TextField
//           fullWidth
//           multiline
//           rows={3}
//           label="Reason for being outside location *"
//           placeholder="e.g. On-site visit to client, Field work, Supervisor instructed off-site duty..."
//           value={reason}
//           onChange={(e) => {
//             setReason(e.target.value);
//             if (e.target.value.trim()) setReasonError('');
//           }}
//           error={!!reasonError}
//           helperText={reasonError}
//           sx={{ mb: 1 }}
//         />
//       </DialogContent>

//       <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
//         <Button
//           variant="outlined"
//           onClick={handleClose}
//           disabled={loading}
//           sx={{ borderColor: '#999', color: '#666', fontWeight: 'bold' }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleAccept}
//           disabled={loading}
//           startIcon={
//             loading ? <CircularProgress size={18} color="inherit" /> : <Send />
//           }
//           sx={{
//             backgroundColor: '#f57c00',
//             fontWeight: 'bold',
//             '&:hover': { backgroundColor: '#ef6c00' },
//           }}
//         >
//           {loading ? 'Submitting for Approval...' : 'Submit for Approval'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// // ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

// const AttendanceEntry = () => {
//   const [currentScreen, setCurrentScreen] = useState('main');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const [checkedIn, setCheckedIn] = useState(false);
//   const [checkedOut, setCheckedOut] = useState(false);
//   const [checkInTime, setCheckInTime] = useState(null);
//   const [checkOutTime, setCheckOutTime] = useState(null);
//   const [attendanceRecord, setAttendanceRecord] = useState(null);

//   const [siteProNo, setSiteProNo] = useState('');
//   const [location, setLocation] = useState(null);
//   const [validatingLocation, setValidatingLocation] = useState(false);

//   // ── Outside location popup state ──
//   const [outsideDialog, setOutsideDialog] = useState({
//     open: false,
//     distanceMeters: 0,
//     pendingAction: null,    
//     pendingPayload: null,   
//     dialogLoading: false,
//   });

//   const [manualData, setManualData] = useState({
//     date: '', checkInTime: '', checkOutTime: '', reason: '',
//     submitCheckIn: true, submitCheckOut: false,
//   });

//   // ─── HELPERS ──────────────────────────────────────────────────────────────

//   const getCurrentDate = () => new Date().toISOString().split('T')[0];
//   const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

//   const formatDateTimeForAPI = (date = new Date()) => {
//     const pad = (n) => String(n).padStart(2, '0');
//     const month = pad(date.getMonth() + 1);
//     const day = pad(date.getDate());
//     const year = date.getFullYear();
//     let hours = date.getHours();
//     const minutes = pad(date.getMinutes());
//     const seconds = pad(date.getSeconds());
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12 || 12;
//     return `${month}/${day}/${year} ${pad(hours)}:${minutes}:${seconds} ${ampm}`;
//   };

//   const calculateWorkHours = (checkIn, checkOut) => {
//     const [inHour, inMin] = checkIn.split(':').map(Number);
//     const [outHour, outMin] = checkOut.split(':').map(Number);
//     let hours = outHour - inHour;
//     let minutes = outMin - inMin;
//     if (minutes < 0) { hours--; minutes += 60; }
//     return `${hours}h ${minutes}m`;
//   };

//   // ─── DISTANCE CALCULATION (returns meters) ────────────────────────────────

//   const getDistanceMeters = (lat1, lng1, lat2, lng2) => {
//     const R = 6371000; 
//     const dLat = (lat1 - lat2) * (Math.PI / 180);
//     const dLng = (lng1 - lng2) * (Math.PI / 180);
//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.cos(lat1 * (Math.PI / 180)) *
//       Math.sin(dLng / 2) ** 2;
//     return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   };

//   const ALLOWED_RADIUS_M = 100; // ----------------------------------------------100 meters allowed radius----------------------------------///

//   const validateLocationWithinSite = (deviceLat, deviceLng, siteLat, siteLng) => {
//     return getDistanceMeters(deviceLat, deviceLng, siteLat, siteLng) <= ALLOWED_RADIUS_M;
//   };


//   const fetchSiteLocation = async () => {
//     const serviceNo = localStorage.getItem('ServiceNo');
//     if (!serviceNo) throw new Error('Service number not found. Please log in again.');

//     const response = await fetch(
//       `${axios.defaults.baseURL}Attendance/GetLocbySno?p_sno=${serviceNo}`,
//       { headers: getAuthHeaders() }
//     );
//     if (!response.ok) throw new Error('Failed to fetch site location.');

//     const data = await response.json();
//     if (data.StatusCode !== 200 || !data.ResultSet || data.ResultSet.length === 0) {
//       throw new Error('No site location found for your service number.');
//     }

//     const record = data.ResultSet[0];
//     setSiteProNo(record.Pro_no);
//     return { lat: parseFloat(record.Lat), lon: parseFloat(record.Lon), proNo: record.Pro_no };
//   };

//   // ─── GET DEVICE LOCATION ─────────────────────────────────────────────────

//   const getDeviceLocation = () =>
//     new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error('Geolocation is not supported by your browser.'));
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         ({ coords: { latitude, longitude } }) => {
//           setLocation({ latitude, longitude });
//           resolve({ latitude, longitude });
//         },
//         () => reject(new Error('Unable to access location. Please enable location services.'))
//       );
//     });

//   // ─── API: POST ATTENDANCE ─────────────────────────────────────────────────

//   const postAttendance = async ({
//     barcodeNo, barcodeDate, pStatus, hstatus,
//     latitude, longitude, reason = ' ', clockNo,
//   }) => {
//     const body = {
//       p_barcode_no: barcodeNo,
//       p_barcode_date: barcodeDate,
//       p_employee_type: '0',
//       p_clock_no: clockNo,
//       p_status: pStatus,
//       p_hstatus: hstatus,
//       p_latitude: String(latitude),
//       p_longitude: String(longitude),
//       p_reason: reason,
//     };

//     const response = await fetch(
//       `${axios.defaults.baseURL}Attendance/PostAttendance`,
//       { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }
//     );
//     if (!response.ok) throw new Error('Failed to submit attendance. Please try again.');

//     const data = await response.json();
//     if (data.StatusCode && data.StatusCode !== 200 && data.StatusCode !== 201) {
//       throw new Error(data.Result || 'Attendance submission failed.');
//     }
//     return data;
//   };

//   // ─── OUTSIDE DIALOG: ACCEPT WITH REASON ──────────────────────────────────

//   const handleOutsideAccept = async (reason) => {
//     const { pendingAction, pendingPayload } = outsideDialog;
//     setOutsideDialog((prev) => ({ ...prev, dialogLoading: true }));

//     try {
//       await postAttendance({ ...pendingPayload, hstatus: 'B', clockNo: 33, reason });

//       if (pendingAction === 'checkin') {
//         const currentTime = pendingPayload.currentTime;
//         setAttendanceRecord({
//           checkInTime: currentTime,
//           checkInDate: getCurrentDate(),
//           checkInLocation: pendingPayload.device,
//           status: 'checked_in',
//         });
//         setCheckedIn(true);
//         setCheckInTime(currentTime);
//         setMessage({
//           type: 'warning',
//           text: `Check-in submitted for approval (outside site by ${Math.round(pendingPayload.distanceMeters)} m). Time: ${currentTime}`,
//         });
//       } else {
//         const checkoutTime = pendingPayload.currentTime;
//         const totalHours = checkInTime ? calculateWorkHours(checkInTime, checkoutTime) : null;
//         setAttendanceRecord((prev) => ({
//           ...prev,
//           checkOutTime: checkoutTime,
//           checkOutDate: getCurrentDate(),
//           checkOutLocation: pendingPayload.device,
//           status: 'completed',
//           totalHours,
//         }));
//         setCheckedOut(true);
//         setMessage({
//           type: 'warning',
//           text: `Check-out submitted for approval (outside site by ${Math.round(pendingPayload.distanceMeters)} m). Time: ${checkoutTime}.${totalHours ? ` Total hours: ${totalHours}` : ''}`,
//         });
//       }

//       setOutsideDialog({ open: false, distanceMeters: 0, pendingAction: null, pendingPayload: null, dialogLoading: false });
//     } catch (error) {
//       setOutsideDialog((prev) => ({ ...prev, dialogLoading: false }));
//       setMessage({ type: 'error', text: error.message });
//     }
//   };

//   const handleOutsideCancel = () => {
//     setOutsideDialog({ open: false, distanceMeters: 0, pendingAction: null, pendingPayload: null, dialogLoading: false });
//     setLoading(false);
//     setMessage({ type: 'info', text: 'Attendance has already been marked for today. Please confirm with your reporting officer and try again.' });
//   };

//   // ─── CHECK IN HANDLER ─────────────────────────────────────────────────────

//   const handleCheckIn = async () => {
//     setLoading(true);
//     setMessage({ type: '', text: '' });
//     try {
//       setValidatingLocation(true);
//       const site = await fetchSiteLocation();
//       const device = await getDeviceLocation();
//       setValidatingLocation(false);

//       const distanceMeters = getDistanceMeters(device.latitude, device.longitude, site.lat, site.lon);
//       const isWithin = distanceMeters <= ALLOWED_RADIUS_M;
//       const now = new Date();
//       const barcodeDate = formatDateTimeForAPI(now);
//       const currentTime = getCurrentTime();

//       if (!isWithin) { 
//         setOutsideDialog({
//           open: true,
//           distanceMeters,
//           pendingAction: 'checkin',
//           pendingPayload: {
//             barcodeNo: site.proNo,
//             barcodeDate,
//             pStatus: 'I',
//             latitude: device.latitude,
//             longitude: device.longitude,
//             currentTime,
//             device,
//             distanceMeters,
//           },
//           dialogLoading: false,
//         });
//         setLoading(false);
//         return;
//       }
 
//       await postAttendance({
//         barcodeNo: site.proNo,
//         barcodeDate,
//         pStatus: 'I',
//         hstatus: 'I',
//         latitude: device.latitude,
//         longitude: device.longitude,
//         clockNo: 38,
//       });

//       setAttendanceRecord({
//         checkInTime: currentTime,
//         checkInDate: getCurrentDate(),
//         checkInLocation: device,
//         status: 'checked_in',
//       });
//       setCheckedIn(true);
//       setCheckInTime(currentTime);
//       setMessage({ type: 'success', text: `Check-in successful! Time: ${currentTime}` });
//     } catch (error) {
//       setMessage({ type: 'error', text: error.message });
//     }
//     setValidatingLocation(false);
//     setLoading(false);
//   };

//   // ─── CHECK OUT HANDLER ────────────────────────────────────────────────────

//   const handleCheckOut = async () => {
//     setLoading(true);
//     setMessage({ type: '', text: '' });
//     try {
//       setValidatingLocation(true);
//       const site = await fetchSiteLocation();
//       const device = await getDeviceLocation();
//       setValidatingLocation(false);

//       const distanceMeters = getDistanceMeters(device.latitude, device.longitude, site.lat, site.lon);
//       const isWithin = distanceMeters <= ALLOWED_RADIUS_M;
//       const now = new Date();
//       const barcodeDate = formatDateTimeForAPI(now);
//       const checkoutTime = getCurrentTime();

//       if (!isWithin) { 
//         setOutsideDialog({
//           open: true,
//           distanceMeters,
//           pendingAction: 'checkout',
//           pendingPayload: {
//             barcodeNo: site.proNo,
//             barcodeDate,
//             pStatus: 'O',
//             latitude: device.latitude,
//             longitude: device.longitude,
//             currentTime: checkoutTime,
//             device,
//             distanceMeters,
//           },
//           dialogLoading: false,
//         });
//         setLoading(false);
//         return;
//       }
 
//       await postAttendance({
//         barcodeNo: site.proNo,
//         barcodeDate,
//         pStatus: 'O',
//         hstatus: 'O',
//         latitude: device.latitude,
//         longitude: device.longitude,
//         clockNo: 39,
//       });

//       const totalHours = checkInTime ? calculateWorkHours(checkInTime, checkoutTime) : null;
//       setAttendanceRecord((prev) => ({
//         ...prev,
//         checkOutTime: checkoutTime,
//         checkOutDate: getCurrentDate(),
//         checkOutLocation: device,
//         status: 'completed',
//         totalHours,
//       }));
//       setCheckedOut(true);
//       setCheckOutTime(checkoutTime);
//       setMessage({
//         type: 'success',
//         text: `Check-out successful! Time: ${checkoutTime}.${totalHours ? ` Total hours: ${totalHours}` : ''}`,
//       });
//     } catch (error) {
//       setMessage({ type: 'error', text: error.message });
//     }
//     setValidatingLocation(false);
//     setLoading(false);
//   };

 

//   const handleManualSubmit = async () => {
//     const { date, checkInTime: ciTime, checkOutTime: coTime, reason, submitCheckIn, submitCheckOut } = manualData;

//     if (!date || !reason) {
//       setMessage({ type: 'error', text: 'Please fill in the date and reason.' });
//       return;
//     }
//     if (!submitCheckIn && !submitCheckOut) {
//       setMessage({ type: 'error', text: 'Please select at least Check-In or Check-Out.' });
//       return;
//     }
//     if (submitCheckIn && !ciTime) {
//       setMessage({ type: 'error', text: 'Please provide a Check-In time.' });
//       return;
//     }
//     if (submitCheckOut && !coTime) {
//       setMessage({ type: 'error', text: 'Please provide a Check-Out time.' });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const site = await fetchSiteLocation();
//       const device = await getDeviceLocation();
//       const [year, month, day] = date.split('-');

//       if (submitCheckIn) {
//         const [inHour, inMin] = ciTime.split(':');
//         const checkInDT = new Date(year, month - 1, day, inHour, inMin, 0);
//         await postAttendance({
//           barcodeNo: site.proNo,
//           barcodeDate: formatDateTimeForAPI(checkInDT),
//           pStatus: 'I',
//           hstatus: 'P',
//           latitude: device.latitude,
//           longitude: device.longitude,
//           reason,
//           clockNo: 33,
//         });
//       }

//       if (submitCheckOut) {
//         const [outHour, outMin] = coTime.split(':');
//         const checkOutDT = new Date(year, month - 1, day, outHour, outMin, 0);
//         await postAttendance({
//           barcodeNo: site.proNo,
//           barcodeDate: formatDateTimeForAPI(checkOutDT),
//           pStatus: 'O',
//           hstatus: 'P',
//           latitude: device.latitude,
//           longitude: device.longitude,
//           reason,
//           clockNo: 33,
//         });
//       }

//       const submitted = [submitCheckIn && 'Check-In', submitCheckOut && 'Check-Out'].filter(Boolean).join(' & ');
//       setMessage({ type: 'success', text: `Manual ${submitted} submitted for approval. Date: ${date}` });
//       setManualData({ date: '', checkInTime: '', checkOutTime: '', reason: '', submitCheckIn: true, submitCheckOut: false });
//       setTimeout(() => setCurrentScreen('main'), 2000);
//     } catch (error) {
//       setMessage({ type: 'error', text: error.message });
//     }

//     setLoading(false);
//   };

  
//   const resetForm = () => {
//     setCheckedIn(false);
//     setCheckedOut(false);
//     setCheckInTime(null);
//     setCheckOutTime(null);
//     setLocation(null);
//     setSiteProNo('');
//     setAttendanceRecord(null);
//     setMessage({ type: '', text: '' });
//     setOutsideDialog({ open: false, distanceMeters: 0, pendingAction: null, pendingPayload: null, dialogLoading: false });
//   };
 

//   const renderMainScreen = () => (
//     <Container maxWidth="sm" sx={{ py: 1 }}>
//       <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
//         <Box
//           sx={{
//             backgroundImage: `url(${bgImage})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             height: 100,
//             borderRadius: 2,
//             mb: 3,
//             display: 'flex',
//             alignItems: 'flex-end',
//             justifyContent: 'flex-start',
//             padding: 2,
//             boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//           }}
//         />

//         {message.text && (
//           <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
//             {message.text}
//           </Alert>
//         )}

//         {validatingLocation && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <CircularProgress size={16} />
//               Validating your location...
//             </Box>
//           </Alert>
//         )}

//         {checkedIn && !checkedOut && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             <strong>Currently Checked In</strong><br />
//             Check-in time: {checkInTime}
//           </Alert>
//         )}

//         {checkedOut && (
//           <Alert severity="success" sx={{ mb: 2 }}>
//             <strong>Attendance Completed for Today</strong><br />
//             Check-in: {attendanceRecord?.checkInTime || checkInTime} | Check-out: {attendanceRecord?.checkOutTime}<br />
//             {attendanceRecord?.totalHours && <>Total Hours: {attendanceRecord.totalHours}</>}
//           </Alert>
//         )}

//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <Button
//               fullWidth variant="contained" size="large"
//               sx={{
//                 py: 2, fontSize: '1.1rem', fontWeight: 'bold',
//                 backgroundColor: '#1976d2',
//                 '&:hover': { backgroundColor: '#1565c0' },
//               }}
//               onClick={handleCheckIn}
//               disabled={loading || checkedIn}
//               startIcon={
//                 loading ? <CircularProgress size={20} color="inherit" />
//                   : checkedIn ? <CheckCircle /> : <Login />
//               }
//             >
//               {checkedIn ? 'Checked In' : loading ? 'Processing...' : 'Check In'}
//             </Button>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <Button
//               fullWidth variant="contained" size="large"
//               sx={{
//                 py: 2, fontSize: '1.1rem', fontWeight: 'bold',
//                 backgroundColor: '#f57c00',
//                 '&:hover': { backgroundColor: '#ef6c00' },
//               }}
//               onClick={handleCheckOut}
//               disabled={loading || checkedOut}
//               startIcon={
//                 loading ? <CircularProgress size={20} color="inherit" />
//                   : checkedOut ? <CheckCircle /> : <Logout />
//               }
//             >
//               {checkedOut ? 'Checked Out' : loading ? 'Processing...' : 'Check Out'}
//             </Button>
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 3 }} />

//         <Card sx={{ mb: 2, backgroundColor: '#f5f5f5' }}>
//           <CardContent>
//             <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2' }}>
//               Today's Attendance
//             </Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//               <AccessTime sx={{ mr: 1, color: '#1976d2' }} />
//               <Typography variant="body2">Current Time: {getCurrentTime()}</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//               <LocationOn sx={{ mr: 1, color: '#1976d2' }} />
//               <Typography variant="body2">
//                 {location
//                   ? `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
//                   : 'Location: Not detected'}
//               </Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <Person sx={{ mr: 1, color: '#1976d2' }} />
//               <Typography variant="body2">
//                 Device: {localStorage.getItem('deviceName') || 'Mobile Device'}
//               </Typography>
//             </Box>
//           </CardContent>
//         </Card>

//         {/* <Button
//           fullWidth variant="outlined"
//           sx={{ py: 1.5, mb: 2, borderColor: '#1976d2', color: '#1976d2', fontWeight: 'bold', '&:hover': { backgroundColor: '#f0f7ff' } }}
//           onClick={() => setCurrentScreen('manual')}
//         >
//           Manual Attendance Request
//         </Button> */}
//       </Paper>

//       {/* ── OUTSIDE LOCATION DIALOG ── */}
//       <LocationOutsideDialog
//         open={outsideDialog.open}
//         distanceMeters={outsideDialog.distanceMeters}
//         onAccept={handleOutsideAccept}
//         onCancel={handleOutsideCancel}
//         loading={outsideDialog.dialogLoading}
//       />
//     </Container>
//   );

//   // ─── MANUAL SCREEN ────────────────────────────────────────────────────────

//   const renderManualScreen = () => (
//     <Container maxWidth="sm" sx={{ py: 4 }}>
//       <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
//         <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
//           Manual Attendance Request
//         </Typography>
//         <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
//           Select what you need to submit. Your current location will be recorded.
//         </Typography>

//         {message.text && (
//           <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>
//         )}

//         <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Submit for:</Typography>
//         <FormGroup row sx={{ mb: 2 }}>
//           <FormControlLabel
//             control={<Checkbox checked={manualData.submitCheckIn}
//               onChange={(e) => setManualData({ ...manualData, submitCheckIn: e.target.checked })} color="primary" />}
//             label="Check-In"
//           />
//           <FormControlLabel
//             control={<Checkbox checked={manualData.submitCheckOut}
//               onChange={(e) => setManualData({ ...manualData, submitCheckOut: e.target.checked })} color="warning" />}
//             label="Check-Out"
//           />
//         </FormGroup>

//         <TextField fullWidth type="date" label="Date" value={manualData.date}
//           onChange={(e) => setManualData({ ...manualData, date: e.target.value })}
//           InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />

//         {manualData.submitCheckIn && (
//           <TextField fullWidth type="time" label="Check-In Time" value={manualData.checkInTime}
//             onChange={(e) => setManualData({ ...manualData, checkInTime: e.target.value })}
//             InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
//         )}

//         {manualData.submitCheckOut && (
//           <TextField fullWidth type="time" label="Check-Out Time" value={manualData.checkOutTime}
//             onChange={(e) => setManualData({ ...manualData, checkOutTime: e.target.value })}
//             InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
//         )}

//         <TextField fullWidth multiline rows={4} label="Reason for Manual Request"
//           placeholder="Forgot to check in/out, Technical issues, etc."
//           value={manualData.reason}
//           onChange={(e) => setManualData({ ...manualData, reason: e.target.value })}
//           sx={{ mb: 3 }} />

//         <Button fullWidth variant="contained" size="large"
//           sx={{ py: 1.5, mb: 1, backgroundColor: '#1976d2', fontWeight: 'bold', '&:hover': { backgroundColor: '#1565c0' } }}
//           onClick={handleManualSubmit} disabled={loading}
//           startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}>
//           {loading ? 'Submitting...' : 'Submit for Approval'}
//         </Button>

//         <Button fullWidth variant="outlined"
//           sx={{ py: 1.5, borderColor: '#999', color: '#666', fontWeight: 'bold' }}
//           onClick={() => { setCurrentScreen('main'); setMessage({ type: '', text: '' }); }} disabled={loading}>
//           Cancel
//         </Button>
//       </Paper>
//     </Container>
//   );

//   return (
//     <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
//       {currentScreen === 'main' && renderMainScreen()}
//       {currentScreen === 'manual' && renderManualScreen()}
//     </Box>
//   );
// };

// export default AttendanceEntry;













import React, { useState, useEffect } from 'react';
import {
  Container, Paper, TextField, Button, Box, Typography, Alert,
  CircularProgress, Card, CardContent, Grid, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
} from '@mui/material';
import {
  CheckCircle, LocationOn, AccessTime, Person, Logout, Login,
  Warning, MyLocation,
} from '@mui/icons-material';
import bgImage from "../../assets/images/Attend.jpg";
import axios from "axios";


const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
   'auth-key': JSON.parse(sessionStorage.getItem('token') || '""'),
});

// ─── LOCATION OUTSIDE DIALOG ──────────────────────────────────────────────────

const LocationOutsideDialog = ({ open, distanceMeters, onClose }) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle
        sx={{
          backgroundColor: '#ffebee',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: '#c62828',
          fontWeight: 'bold',
        }}
      >
        <Warning sx={{ color: '#d32f2f' }} />
        Outside Allowed Location
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box
          sx={{
            backgroundColor: '#ffebee',
            border: '1px solid #ef9a9a',
            borderRadius: 2,
            p: 2,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <MyLocation sx={{ color: '#d32f2f', fontSize: 36 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="#c62828">
              You are outside the allowed area
            </Typography>
           
            <Typography variant="body2" color="#b71c1c" sx={{ mt: 1, fontWeight: 'bold' }}>
              ⚠️ You must be within 50 meters of a site location to check in/out.
            </Typography>
          </Box>
        </Box>

        <DialogContentText sx={{ color: '#555' }}>
          Please move closer to your site location and try again. 
          The allowed radius is <strong>50 meters</strong> from any of your assigned site locations.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            backgroundColor: '#d32f2f',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#c62828' },
          }}
        >
          OK, I Understand
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const AttendanceEntry = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [attendanceRecord, setAttendanceRecord] = useState(null);

  const [siteLocations, setSiteLocations] = useState([]);
  const [location, setLocation] = useState(null);
  const [validatingLocation, setValidatingLocation] = useState(false);

  // ── Location outside dialog state ──
  const [outsideDialog, setOutsideDialog] = useState({
    open: false,
    distanceMeters: 0,
  });

  // ─── HELPERS ──────────────────────────────────────────────────────────────

  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

  const formatDateTimeForAPI = (date = new Date()) => {
    const pad = (n) => String(n).padStart(2, '0');
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${month}/${day}/${year} ${pad(hours)}:${minutes}:${seconds} ${ampm}`;
  };

  const calculateWorkHours = (checkIn, checkOut) => {
    const [inHour, inMin] = checkIn.split(':').map(Number);
    const [outHour, outMin] = checkOut.split(':').map(Number);
    let hours = outHour - inHour;
    let minutes = outMin - inMin;
    if (minutes < 0) { hours--; minutes += 60; }
    return `${hours}h ${minutes}m`;
  };

  // ─── DISTANCE CALCULATION (returns meters) ────────────────────────────────

  const getDistanceMeters = (lat1, lng1, lat2, lng2) => {
    const R = 6371000; 
    const dLat = (lat1 - lat2) * (Math.PI / 180);
    const dLng = (lng1 - lng2) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const ALLOWED_RADIUS_M = 50;

  const validateLocationWithinAnySite = (deviceLat, deviceLng, siteLocations) => {
    for (let site of siteLocations) {
      const distance = getDistanceMeters(deviceLat, deviceLng, 
        parseFloat(site.Lat), parseFloat(site.Lon));
      if (distance <= ALLOWED_RADIUS_M) {
        return { isWithin: true, site: site, distance: distance };
      }
    }
    let minDistance = Infinity;
    let nearestSite = null;
    for (let site of siteLocations) {
      const distance = getDistanceMeters(deviceLat, deviceLng, 
        parseFloat(site.Lat), parseFloat(site.Lon));
      if (distance < minDistance) {
        minDistance = distance;
        nearestSite = site;
      }
    }
    return { isWithin: false, site: nearestSite, distance: minDistance };
  };

  const fetchSiteLocations = async () => {
    const serviceNo = localStorage.getItem('ServiceNo');
    if (!serviceNo) throw new Error('Service number not found. Please log in again.');

    const response = await fetch(
      `${axios.defaults.baseURL}Attendance/GetLocbySno?p_sno=${serviceNo}`,
      { headers: getAuthHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch site location.');

    const data = await response.json();
    if (data.StatusCode !== 200 || !data.ResultSet || data.ResultSet.length === 0) {
      throw new Error('No site location found for your service number.');
    }

    setSiteLocations(data.ResultSet);
    return data.ResultSet;
  };

  // ─── GET DEVICE LOCATION ─────────────────────────────────────────────────

  const getDeviceLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setLocation({ latitude, longitude });
          resolve({ latitude, longitude });
        },
        () => reject(new Error('Unable to access location. Please enable location services.'))
      );
    });

  // ─── API: POST ATTENDANCE ─────────────────────────────────────────────────

  const postAttendance = async ({
    barcodeNo, barcodeDate, pStatus, hstatus,
    latitude, longitude, clockNo,
  }) => {
    const body = {
      p_barcode_no: barcodeNo,
      p_barcode_date: barcodeDate,
      p_employee_type: '0',
      p_clock_no: clockNo,
      p_status: pStatus,
      p_hstatus: hstatus,
      p_latitude: String(latitude),
      p_longitude: String(longitude),
      p_reason: ' ',
    };

    const response = await fetch(
      `${axios.defaults.baseURL}Attendance/BizPostAttendance`,
      { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }
    );
    if (!response.ok) throw new Error('Failed to submit attendance. Please try again.');

    const data = await response.json();
    if (data.StatusCode && data.StatusCode !== 200 && data.StatusCode !== 201) {
      throw new Error(data.Result || 'Attendance submission failed.');
    }
    return data;
  };

  // ─── CHECK IN HANDLER ─────────────────────────────────────────────────────

  const handleCheckIn = async () => {
    if (checkedIn) {
      setMessage({ type: 'info', text: 'You are already checked in!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      setValidatingLocation(true);
      const sites = await fetchSiteLocations();
      const device = await getDeviceLocation();
      setValidatingLocation(false);

      const validationResult = validateLocationWithinAnySite(
        device.latitude, 
        device.longitude, 
        sites
      );

      const now = new Date();
      const barcodeDate = formatDateTimeForAPI(now);
      const currentTime = getCurrentTime();

      if (!validationResult.isWithin) {
        // Show outside dialog - BLOCK check-in
        setOutsideDialog({
          open: true,
          distanceMeters: validationResult.distance,
        });
        setLoading(false);
        return;
      }

      await postAttendance({
        barcodeNo: validationResult.site.Pro_no,
        barcodeDate,
        pStatus: 'I',
        hstatus: 'I',
        latitude: device.latitude,
        longitude: device.longitude,
        clockNo: 38,
      });

      setAttendanceRecord({
        checkInTime: currentTime,
        checkInDate: getCurrentDate(),
        checkInLocation: device,
        status: 'checked_in',
      });
      setCheckedIn(true);
      setCheckInTime(currentTime);
      setMessage({ type: 'success', text: `Check-in successful! Time: ${currentTime}` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
    setValidatingLocation(false);
    setLoading(false);
  };

  // ─── CHECK OUT HANDLER ────────────────────────────────────────────────────

  const handleCheckOut = async () => {
    if (checkedOut) {
      setMessage({ type: 'info', text: 'You are already checked out!' });
      return;
    }
    

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      setValidatingLocation(true);
      const sites = await fetchSiteLocations();
      const device = await getDeviceLocation();
      setValidatingLocation(false);

      const validationResult = validateLocationWithinAnySite(
        device.latitude, 
        device.longitude, 
        sites
      );

      const now = new Date();
      const barcodeDate = formatDateTimeForAPI(now);
      const checkoutTime = getCurrentTime();

      if (!validationResult.isWithin) {
        setOutsideDialog({
          open: true,
          distanceMeters: validationResult.distance,
        });
        setLoading(false);
        return;
      }

      await postAttendance({
        barcodeNo: validationResult.site.Pro_no,
        barcodeDate,
        pStatus: 'O',
        hstatus: 'O',
        latitude: device.latitude,
        longitude: device.longitude,
        clockNo: 39,
      });

      const totalHours = checkInTime ? calculateWorkHours(checkInTime, checkoutTime) : null;
      setAttendanceRecord((prev) => ({
        ...prev,
        checkOutTime: checkoutTime,
        checkOutDate: getCurrentDate(),
        checkOutLocation: device,
        status: 'completed',
        totalHours,
      }));
      setCheckedOut(true);
      setCheckOutTime(checkoutTime);
      setMessage({
        type: 'success',
        text: `Check-out successful! Time: ${checkoutTime}.${totalHours ? ` Total hours: ${totalHours}` : ''}`,
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
    setValidatingLocation(false);
    setLoading(false);
  };

  const resetForm = () => {
    setCheckedIn(false);
    setCheckedOut(false);
    setCheckInTime(null);
    setCheckOutTime(null);
    setLocation(null);
    setSiteLocations([]);
    setAttendanceRecord(null);
    setMessage({ type: '', text: '' });
    setOutsideDialog({ open: false, distanceMeters: 0 });
  };

  const renderMainScreen = () => (
    <Container maxWidth="sm" sx={{ py: 1 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Box
          sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: 100,
            borderRadius: 2,
            mb: 3,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            padding: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        />

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}

        {validatingLocation && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              Validating your location...
            </Box>
          </Alert>
        )}

        {checkedIn && !checkedOut && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Currently Checked In</strong><br />
            Check-in time: {checkInTime}
          </Alert>
        )}

        {checkedOut && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <strong>Attendance Completed for Today</strong><br />
            Check-in: {attendanceRecord?.checkInTime || checkInTime} | Check-out: {attendanceRecord?.checkOutTime}<br />
            {attendanceRecord?.totalHours && <>Total Hours: {attendanceRecord.totalHours}</>}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth variant="contained" size="large"
              sx={{
                py: 2, fontSize: '1.1rem', fontWeight: 'bold',
                backgroundColor: checkedIn ? '#4caf50' : '#1976d2',
                '&:hover': { 
                  backgroundColor: checkedIn ? '#388e3c' : '#1565c0' 
                },
              }}
              onClick={handleCheckIn}
              disabled={loading || checkedIn}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" />
                  : checkedIn ? <CheckCircle /> : <Login />
              }
            >
              {checkedIn ? 'Checked In ✓' : loading ? 'Processing...' : 'Check In'}
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              fullWidth variant="contained" size="large"
              sx={{
                py: 2, fontSize: '1.1rem', fontWeight: 'bold',
                backgroundColor: checkedOut ? '#4caf50' : '#f57c00',
                '&:hover': { 
                  backgroundColor: checkedOut ? '#388e3c' : '#ef6c00' 
                },
              }}
              onClick={handleCheckOut}
              disabled={loading || checkedOut}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" />
                  : checkedOut ? <CheckCircle /> : <Logout />
              }
            >
              {checkedOut ? 'Checked Out ✓' : loading ? 'Processing...' : 'Check Out'}
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          
          {checkedOut && (
            <Typography variant="caption" color="success.main">
              ✅ Attendance completed for today
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Card sx={{ mb: 2, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2' }}>
              Today's Attendance
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="body2">Current Time: {getCurrentTime()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="body2">
                {location
                  ? `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                  : 'Location: Not detected'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="body2">
                Device: {localStorage.getItem('deviceName') || 'Mobile Device'}
              </Typography>
            </Box>
            {siteLocations.length > 0 && (
              <Box sx={{ mt: 1, p: 1, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  {siteLocations.length} site location(s) available (50m radius)
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Paper>

      {/* ── OUTSIDE LOCATION DIALOG (BLOCKED) ── */}
      <LocationOutsideDialog
        open={outsideDialog.open}
        distanceMeters={outsideDialog.distanceMeters}
        onClose={() => setOutsideDialog({ open: false, distanceMeters: 0 })}
      />
    </Container>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {renderMainScreen()}
    </Box>
  );
};

export default AttendanceEntry;