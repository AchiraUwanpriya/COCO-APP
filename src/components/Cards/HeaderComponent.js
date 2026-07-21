 

// // 2026/02/25

// import React, { useState, useEffect } from "react";
// import Card from "@mui/material/Card";
// import Typography from "@mui/material/Typography";
// import { Box, CardActionArea, Grid, Grow, Fade } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";
 
// export default function HeaderComponent() {
//   const [ads, setAds] = useState([]);
//   const [currentAd, setCurrentAd] = useState(0);
//   const [fadeIn, setFadeIn] = useState(true);
//   const { loading, headComponent } = useSelector(
//     (state) => state.headComponent
//   );
//   let navigate = useNavigate();

//   const isComponentIdAvailable = (componentId) => {
//     return headComponent.some((item) => item.ComponentId === componentId);
//   };

//   // useEffect(() => {
//   //   const fetchAds = async () => {
//   //     try {
//   //       const response = await axios.get(`${axios.defaults.baseURL}/Notification/GetNews`);
//   //       const fetchedAds = response.data.ResultSet.map((ad) => ad.Message);
//   //       setAds(fetchedAds);
//   //     } catch (error) {
//   //       console.error("Error fetching ads:", error);
//   //     }
//   //   };

//   //   fetchAds();
//   // }, []);

  
//   useEffect(() => {
//     const fetchAds = async () => {
//       try {
//         const response = await axios.get(
//           `${axios.defaults.baseURL}Notification/GetNews`
//         );

//         // Check the null messages
//         const validAds = response.data.ResultSet.map((ad) => ad.Message).filter(
//           (message) => message && message.trim() !== ""
//         );

//         setAds(validAds); 
//       } catch (error) {
//         console.error("Error fetching ads:", error);
//       }
//     };

//     fetchAds();
//   }, []);

//   useEffect(() => {
//     if (ads.length === 0) return;

//     const interval = setInterval(() => {
//       setFadeIn(false);
//       setTimeout(() => {
//         setCurrentAd((prev) => (prev + 1) % ads.length);
//         setFadeIn(true);
//       }, 500);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [ads]);

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           width: "100%",
//           overflow: "auto",
//         }}
//       >
//         {/* <Typography
//           gutterBottom
//           variant="h6"
//           component="div"
//           style={{ marginLeft: 6 }}
//         >
//           Service
//         </Typography> */}
//         <div style={{ height: "5px" }}></div>
//         <Box
//           sx={{
//             width: "100%",
//             background: "linear-gradient(90deg, #F0F8FF 0%, #E6E6FA 100%)",
//             padding: "12px",
//             textAlign: "center",
            
//             borderRadius: 2,
//             marginBottom: 2,
//             minHeight: "50px",
//             display: ads.length > 0 ? "block" : "none",
//             border: "1px solid #dcdcf5",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
//           }}
//         >
//           {ads.length > 0 && (
//             <Fade in={fadeIn} timeout={500}>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   color: "#4b3d8f",
//                   fontSize: 14,
//                   fontWeight: 600,

//                 }}
//               >
//                 {ads[currentAd]}
//               </Typography>
//             </Fade>
//           )}
//         </Box>

//         <Grid container rowSpacing={0.1}>
//           {isComponentIdAvailable("EMOBCI0002") ? (
//             <Grow
//               in={isComponentIdAvailable("EMOBCI0002")}
//               style={{ transformOrigin: "0 0 0" }}
//               {...(isComponentIdAvailable("EMOBCI0002")
//                 ? { timeout: 1600 }
//                 : {})}
//             >
//               <Grid
//                 item
//                 xs={4}
//                 sx={{
//                   padding: 1,
//                 }}
//               >
//                 <Card
//                   sx={{
//                     padding: 2,
//                     boxShadow: 0,
//                     borderRadius: 2,
//                     height: 100,
//                   }}
//                 >
//                   <CardActionArea
//                     onClick={() => {
//                       navigate("/personal");
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         height: 90,
//                       }}
//                     >
//                       <img
//                         className="d-block w-50"
//                         src={require("../../assets/icons/user.png")}
//                         alt="Personal"
//                         style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
//                       />
//                       <Typography
//                         gutterBottom
//                         fontSize={14}
//                         fontWeight={600}
//                         component="div"
//                         style={{ opacity: "40%" , marginTop: "8px"}}
//                       >
//                         Personal
//                       </Typography>
//                     </div>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             </Grow>
//           ) : (
//             <></>
//           )}
//           {isComponentIdAvailable("EMOBCI0011") ? (
//             <Grow
//               in={isComponentIdAvailable("EMOBCI0011")}
//               style={{ transformOrigin: "0 0 0" }}
//               {...(isComponentIdAvailable("EMOBCI0011")
//                 ? { timeout: 2800 }
//                 : {})}
//             >
//               <Grid
//                 item
//                 xs={4}
//                 sx={{
//                   padding: 1,
//                 }}
//               >
//                 <Card
//                   sx={{
//                     padding: 2,
//                     boxShadow: 0,
//                     borderRadius: 2,
//                     height: 100,
//                   }}
//                 >
//                   <CardActionArea
//                     onClick={() => {
//                       navigate("/Telephone");
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         height: 90,
//                       }}
//                     >
//                       <img
//                         className="d-block w-50"
//                         src={require("../../assets/icons/telephonedirectory.png")}
//                         alt="Telephone"
//                         style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
//                       />
//                       <Typography
//                         gutterBottom
//                         fontSize={14}
//                         fontWeight={600}
//                         component="div"
//                         style={{ opacity: "40%" , marginTop: "8px"}}
//                       >
//                         Telephone
//                       </Typography>
//                     </div>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             </Grow>
//           ) : (
//             <></>
//           )}
//           {isComponentIdAvailable("EMOBCI0006") ? (
//             <Grow
//               in={isComponentIdAvailable("EMOBCI0006")}
//               style={{ transformOrigin: "0 0 0" }}
//               {...(isComponentIdAvailable("EMOBCI0006")
//                 ? { timeout: 2500 }
//                 : {})}
//             >
//               <Grid
//                 item
//                 xs={4}
//                 sx={{
//                   padding: 1,
//                 }}
//               >
//                 <Card
//                   sx={{
//                     padding: 2,
//                     boxShadow: 0,
//                     borderRadius: 2,
//                     height: 100,
//                   }}
//                 >
//                   <CardActionArea
//                     onClick={() => {
//                       navigate("/budgetshop");
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         height: 90,
//                       }}
//                     >
//                       <img
//                         className="d-block w-50"
//                         src={require("../../assets/icons/store.png")}
//                         alt="Sahanasala"
//                         style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
//                       />
//                       <Typography
//                         gutterBottom
//                         fontSize={14}
//                         fontWeight={600}
//                         component="div"
//                         style={{ opacity: "40%", marginTop: "8px" }}
//                       >
//                         Sahanasala
//                       </Typography>
//                     </div>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             </Grow>
//           ) : (
//             <></>
//           )}
//           {isComponentIdAvailable("EMOBCE0002") ? (
//             <Grow
//               in={isComponentIdAvailable("EMOBCE0002")}
//               style={{ transformOrigin: "0 0 0" }}
//               {...(isComponentIdAvailable("EMOBCE0002")
//                 ? { timeout: 1900 }
//                 : {})}
//             >
//               <Grid
//                 item
//                 xs={4}
//                 sx={{
//                   padding: 1,
//                 }}
//               >
//                 <Card
//                   sx={{
//                     padding: 2,
//                     boxShadow: 0,
//                     borderRadius: 2,
//                     height: 110,
//                   }}
//                 >
//                   <CardActionArea
//                     onClick={() => {
//                       navigate("/approvals");
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         height: 90,
//                       }}
//                     >
//                       <img
//                         className="d-block w-50"
//                         src={require("../../assets/icons/approval.png")}
//                         alt="Approvals"
//                         style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
//                       />
//                       <Typography
//                         gutterBottom
//                         fontSize={14}
//                         fontWeight={600}
//                         component="div"
//                         style={{ opacity: "40%", marginTop: "8px" }}
//                       >
//                         Approvals
//                       </Typography>
//                     </div>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             </Grow>
//           ) : (
//             <></>
//           )}
//           {isComponentIdAvailable("EMOBCE0001") ? (
//             <Grow
//               in={isComponentIdAvailable("EMOBCE0001")}
//               style={{ transformOrigin: "0 0 0" }}
//               {...(isComponentIdAvailable("EMOBCE0001")
//                 ? { timeout: 2500 }
//                 : {})}
//             >
//               <Grid
//                 item
//                 xs={4}
//                 sx={{
//                   padding: 1,
//                 }}
//               >
//                 <Card
//                   sx={{
//                     padding: 2,
//                     boxShadow: 0,
//                     borderRadius: 2,
//                     height: 110,
//                   }}
//                 >
//                   <CardActionArea
//                     onClick={() => {
//                       navigate("/Jobs");
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         height: 90,
//                       }}
//                     >
//                       <img
//                         className="d-block w-50"
//                         src={require("../../assets/icons/briefcase.png")}
//                         alt="Job Allocation"
//                         style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
//                       />
//                       <Typography
//                         align="center"
//                         fontSize={14}
//                         fontWeight={600}
//                         component="div"
//                         style={{ opacity: "40%" }}
//                       >
//                         Job Allocation
//                       </Typography>
//                     </div>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             </Grow>
//           ) : (
//             <></>
//           )}
//           {isComponentIdAvailable("EMOBCI0010") ? (
//             <Grow
//               in={isComponentIdAvailable("EMOBCI0010")}
//               style={{ transformOrigin: "0 0 0" }}
//               {...(isComponentIdAvailable("EMOBCI0010")
//                 ? { timeout: 2500 }
//                 : {})}
//             >
//               <Grid
//                 item
//                 xs={4}
//                 sx={{
//                   padding: 1,
//                 }}
//               >
//                 <Card
//                   sx={{
//                     padding: 2,
//                     boxShadow: 0,
//                     borderRadius: 2,
//                     height: 110,
//                   }}
//                 >
//                   <CardActionArea
//                     onClick={() => {
//                       navigate("/reservation");
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         height: 90,
//                       }}
//                     >
//                       <img
//                         className="d-block w-50"
//                         src={require("../../assets/icons/reservation.png")}
//                         alt="NEHB Reservation"
//                         style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
//                       />
//                       <Typography
//                         align="center"
//                         gutterBottom
//                         fontSize={14}
//                         fontWeight={600}
//                         component="div"
//                         style={{ opacity: "40%" }}
//                       >
//                         NEHB Reservation
//                       </Typography>
//                     </div>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             </Grow>
//           ) : (
//             <></>
//           )}
          
//           {/* {isComponentIdAvailable("EMOBCI0011") ? (
//             <Grow
//               in={isComponentIdAvailable("EMOBCI0011")}
//               style={{ transformOrigin: "0 0 0" }}
//               {...(isComponentIdAvailable("EMOBCI0011")
//                 ? { timeout: 2500 }
//                 : {})}
//             >
//               <Grid
//                 item
//                 xs={4}
//                 sx={{
//                   padding: 1,
//                 }}
//               >
//                 <Card
//                   sx={{
//                     padding: 2,
//                     boxShadow: 0,
//                     borderRadius: 2,
//                     height: 120,
//                   }}
//                 >
//                   <CardActionArea
//                     onClick={() => {
//                       navigate("/nwhb-reservation");
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         height: 90,
//                       }}
//                     >
//                       <img
//                         className="d-block w-50"
//                         src={require("../../assets/icons/booking.png")}
//                         alt="NWHB Reservation"
//                         style={{ opacity: "80%", maxHeight: 70, maxWidth: 70 }}
//                       />
//                       <Typography
//                         gutterBottom
//                         align="center"
//                         fontSize={14}
//                         fontWeight={600}
//                         component="div"
//                         style={{ opacity: "40%" }}
//                       >
//                         NWHB Reservation
//                       </Typography>
//                     </div>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             </Grow>
//           ) : (
//             <></>
//           )} */}


//           {isComponentIdAvailable("EMOBCI0012") ? (
//             <Grow
//               in={isComponentIdAvailable("EMOBCI0012")}
//               style={{ transformOrigin: "0 0 0" }}
//               {...(isComponentIdAvailable("EMOBCI0012")
//                 ? { timeout: 2500 }
//                 : {})}
//             >
//               <Grid
//                 item
//                 xs={4}
//                 sx={{
//                   padding: 1,
//                 }}
//               >
//                 <Card
//                   sx={{
//                     padding: 2,
//                     boxShadow: 0,
//                     borderRadius: 2,
//                     height: 110,
//                   }}
//                 >
//                   <CardActionArea
//                     onClick={() => {
//                       navigate("/rfid-attendence");
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         height: 90,
//                       }}
//                     >
//                       <img
//                         className="d-block w-50"
//                         src={require("../../assets/icons/user-check.png")}
//                         alt="Remote Attendance"
//                         style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
//                       />
//                       <Typography
//                         align="center"
//                         gutterBottom
//                         fontSize={14}
//                         fontWeight={600}
//                         component="div"
//                         style={{ opacity: "40%" }}
//                       >
//                         Remote Attendance
//                       </Typography>
//                     </div>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             </Grow>
//           ) : (
//             <></>
//           )}
//           {isComponentIdAvailable("EMOBCE0003") ? (
//             <Grow
//               in={isComponentIdAvailable("EMOBCE0003")}
//               style={{ transformOrigin: "0 0 0" }}
//               {...(isComponentIdAvailable("EMOBCE0003")
//                 ? { timeout: 2500 }
//                 : {})}
//             >
//               <Grid
//                 item
//                 xs={4}
//                 sx={{
//                   padding: 1,
//                 }}
//               >
//                 <Card
//                   sx={{
//                     padding: 2,
//                     boxShadow: 0,
//                     borderRadius: 2,
//                     height: 110,
//                   }}
//                 >
//                   <CardActionArea
//                     onClick={() => {
//                       navigate("/file-attachments");
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         height: 90,
//                       }}
//                     >
//                       <img
//                         className="d-block w-50"
//                         src={require("../../assets/icons/gallery.png")}
//                         alt="Gallery"
//                         style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
//                       />
//                       <Typography
//                         align="center"
//                         gutterBottom
//                         fontSize={14}
//                         fontWeight={600}
//                         component="div"
//                         style={{ opacity: "40%" , marginTop: "8px" }}
//                       >
//                         Gallery
//                       </Typography>
//                     </div>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             </Grow>
//           ) : (
//             <></>
//           )}


//           {/* --------------------------------------------Todo list---------- */}
//           {isComponentIdAvailable("EMOBCE0003") ? (
//             <Grow
//               in={isComponentIdAvailable("EMOBCE0003")}
//               style={{ transformOrigin: "0 0 0" }}
//               {...(isComponentIdAvailable("EMOBCE0003")
//                 ? { timeout: 2500 }
//                 : {})}
//             >
//               <Grid
//                 item
//                 xs={4}
//                 sx={{
//                   padding: 1,
//                 }}
//               >
//                 <Card
//                   sx={{
//                     padding: 2,
//                     boxShadow: 0,
//                     borderRadius: 2,
//                     height: 110,
//                   }}
//                 >
//                   <CardActionArea
//                     onClick={() => {
//                       navigate("/collectForm");
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         height: 90,
//                       }}
//                     >
//                       <img
//                         className="d-block w-50"
//                         src={require("../../assets/icons/to-do-list.png")}
//                         alt="ToDO List"
//                         style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
//                       />
//                       <Typography
//                         align="center"
//                         gutterBottom
//                         fontSize={14}
//                         fontWeight={600}
//                         component="div"
//                         style={{ opacity: "40%" , marginTop: "8px" }}
//                       >
//                         To-Do List
//                       </Typography>
//                     </div>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             </Grow>
//           ) : (
//             <></>
//           )}
//           {/* {isComponentIdAvailable("EMOBCE0001") ? (
//             <Grow
//               in={isComponentIdAvailable("EMOBCE0001")}
//               style={{ transformOrigin: "0 0 0" }}
//               {...(isComponentIdAvailable("EMOBCE0001")
//                 ? { timeout: 2500 }
//                 : {})}
//             >
//               <Grid
//                 item
//                 xs={4}
//                 sx={{
//                   padding: 1,
//                 }}
//               >
//                 <Card sx={{ padding: 2, boxShadow: 0, borderRadius: 2 }}>
//                   <CardActionArea
//                     onClick={() => {
//                       navigate("/MaintenancePage"); 
//                     }}
//                   >
//                     <div
//                       style={{
//                         height: 90,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                       }}
//                     >
//                       <img
//                         className="d-block w-50"
//                         src={require("../../assets/icons/maintenance.png")}
//                         alt="Maintain"
//                         style={{ opacity: "70%" }}
//                       />
//                       <Typography
//                         align="center"
//                         gutterBottom
//                         fontSize={14}
//                         fontWeight={600}
//                         component="div"
//                         style={{ opacity: "40%" }}
//                       >
//                         Maintain
//                       </Typography>
//                     </div>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             </Grow>
//           ) : (
//             <></>
//           )} */}
//         </Grid>
//       </Box>
//     </>
//   );
// }





import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea, Grid, Grow, Fade, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
 
export default function HeaderComponent() {
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [pendingEwoCount, setPendingEwoCount] = useState(0);
  const { loading, headComponent } = useSelector(
    (state) => state.headComponent
  );
  let navigate = useNavigate();

  const isComponentIdAvailable = (componentId) => {
    return headComponent.some((item) => item.ComponentId === componentId);
  };

  // Fetch EWO pending count
  const fetchPendingEwoCount = async () => {
    try {
      const response = await axios.get("Approvals/GetEWODetails");
      const resultSet = response.data.ResultSet;
      if (resultSet) {
        // Count items with status "P" (Pending)
        const pendingCount = resultSet.filter(item => item.EWOStatus === "P").length;
        setPendingEwoCount(pendingCount);
      }
    } catch (error) {
      console.error("Error fetching EWO count", error);
      setPendingEwoCount(0);
    }
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get(
          `${axios.defaults.baseURL}Notification/GetNews`
        );

        const validAds = response.data.ResultSet.map((ad) => ad.Message).filter(
          (message) => message && message.trim() !== ""
        );

        setAds(validAds); 
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
    fetchPendingEwoCount(); 
 
    const interval = setInterval(fetchPendingEwoCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentAd((prev) => (prev + 1) % ads.length);
        setFadeIn(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [ads]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflow: "auto",
        }}
      >
        <div style={{ height: "5px" }}></div>
        <Box
          sx={{
            width: "100%",
            background: "linear-gradient(90deg, #F0F8FF 0%, #E6E6FA 100%)",
            padding: "12px",
            textAlign: "center",
            borderRadius: 2,
            marginBottom: 2,
            minHeight: "50px",
            display: ads.length > 0 ? "block" : "none",
            border: "1px solid #dcdcf5",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          {ads.length > 0 && (
            <Fade in={fadeIn} timeout={500}>
              <Typography
                variant="body1"
                sx={{
                  color: "#4b3d8f",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {ads[currentAd]}
              </Typography>
            </Fade>
          )}
        </Box>

        <Grid container rowSpacing={0.1}>
          {isComponentIdAvailable("EMOBCI0002") ? (
            <Grow
              in={isComponentIdAvailable("EMOBCI0002")}
              style={{ transformOrigin: "0 0 0" }}
              {...(isComponentIdAvailable("EMOBCI0002")
                ? { timeout: 1600 }
                : {})}
            >
              <Grid
                item
                xs={4}
                sx={{
                  padding: 1,
                }}
              >
                <Card
                  sx={{
                    padding: 2,
                    boxShadow: 0,
                    borderRadius: 2,
                    height: 100,
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      navigate("/personal");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        height: 90,
                      }}
                    >
                      <img
                        className="d-block w-50"
                        src={require("../../assets/icons/user.png")}
                        alt="Personal"
                        style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
                      />
                      <Typography
                        gutterBottom
                        fontSize={14}
                        fontWeight={600}
                        component="div"
                        style={{ opacity: "40%" , marginTop: "8px"}}
                      >
                        Personal
                      </Typography>
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grow>
          ) : (
            <></>
          )}
          {isComponentIdAvailable("EMOBCI0011") ? (
            <Grow
              in={isComponentIdAvailable("EMOBCI0011")}
              style={{ transformOrigin: "0 0 0" }}
              {...(isComponentIdAvailable("EMOBCI0011")
                ? { timeout: 2800 }
                : {})}
            >
              <Grid
                item
                xs={4}
                sx={{
                  padding: 1,
                }}
              >
                <Card
                  sx={{
                    padding: 2,
                    boxShadow: 0,
                    borderRadius: 2,
                    height: 100,
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      navigate("/Telephone");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        height: 90,
                      }}
                    >
                      <img
                        className="d-block w-50"
                        src={require("../../assets/icons/telephonedirectory.png")}
                        alt="Telephone"
                        style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
                      />
                      <Typography
                        gutterBottom
                        fontSize={14}
                        fontWeight={600}
                        component="div"
                        style={{ opacity: "40%" , marginTop: "8px"}}
                      >
                        Telephone
                      </Typography>
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grow>
          ) : (
            <></>
          )}
          {isComponentIdAvailable("EMOBCI0006") ? (
            <Grow
              in={isComponentIdAvailable("EMOBCI0006")}
              style={{ transformOrigin: "0 0 0" }}
              {...(isComponentIdAvailable("EMOBCI0006")
                ? { timeout: 2500 }
                : {})}
            >
              <Grid
                item
                xs={4}
                sx={{
                  padding: 1,
                }}
              >
                <Card
                  sx={{
                    padding: 2,
                    boxShadow: 0,
                    borderRadius: 2,
                    height: 100,
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      navigate("/budgetshop");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        height: 90,
                      }}
                    >
                      <img
                        className="d-block w-50"
                        src={require("../../assets/icons/store.png")}
                        alt="Sahanasala"
                        style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
                      />
                      <Typography
                        gutterBottom
                        fontSize={14}
                        fontWeight={600}
                        component="div"
                        style={{ opacity: "40%", marginTop: "8px" }}
                      >
                        Sahanasala
                      </Typography>
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grow>
          ) : (
            <></>
          )}
          {isComponentIdAvailable("EMOBCE0002") ? (
            <Grow
              in={isComponentIdAvailable("EMOBCE0002")}
              style={{ transformOrigin: "0 0 0" }}
              {...(isComponentIdAvailable("EMOBCE0002")
                ? { timeout: 1900 }
                : {})}
            >
              <Grid
                item
                xs={4}
                sx={{
                  padding: 1,
                }}
              >
                <Card
                  sx={{
                    padding: 2,
                    boxShadow: 0,
                    borderRadius: 2,
                    height: 110,
                    position: "relative",
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      navigate("/approvals");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        height: 90,
                        position: "relative",
                      }}
                    >
                      <img
                        className="d-block w-50"
                        src={require("../../assets/icons/approval.png")}
                        alt="Approvals"
                        style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
                      />
                      <Typography
                        gutterBottom
                        fontSize={14}
                        fontWeight={600}
                        component="div"
                        style={{ opacity: "40%", marginTop: "8px" }}
                      >
                        Approvals
                      </Typography>
                      
                      {/* Red Badge for pending EWO count */}
                      {pendingEwoCount > 0 && (
                        <Badge
                          badgeContent={pendingEwoCount}
                          color="error"
                          sx={{
                            position: "absolute",
                            top: -5,
                            right: -5,
                            "& .MuiBadge-badge": {
                              fontSize: 11,
                              height: 20,
                              minWidth: 20,
                              backgroundColor: "#f44336",
                              color: "white",
                              fontWeight: "bold",
                            },
                          }}
                        />
                      )}
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grow>
          ) : (
            <></>
          )}
          {isComponentIdAvailable("EMOBCE0001") ? (
            <Grow
              in={isComponentIdAvailable("EMOBCE0001")}
              style={{ transformOrigin: "0 0 0" }}
              {...(isComponentIdAvailable("EMOBCE0001")
                ? { timeout: 2500 }
                : {})}
            >
              <Grid
                item
                xs={4}
                sx={{
                  padding: 1,
                }}
              >
                <Card
                  sx={{
                    padding: 2,
                    boxShadow: 0,
                    borderRadius: 2,
                    height: 110,
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      navigate("/Jobs");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        height: 90,
                      }}
                    >
                      <img
                        className="d-block w-50"
                        src={require("../../assets/icons/briefcase.png")}
                        alt="Job Allocation"
                        style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
                      />
                      <Typography
                        align="center"
                        fontSize={14}
                        fontWeight={600}
                        component="div"
                        style={{ opacity: "40%" }}
                      >
                        Job Allocation
                      </Typography>
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grow>
          ) : (
            <></>
          )}
          {isComponentIdAvailable("EMOBCI0010") ? (
            <Grow
              in={isComponentIdAvailable("EMOBCI0010")}
              style={{ transformOrigin: "0 0 0" }}
              {...(isComponentIdAvailable("EMOBCI0010")
                ? { timeout: 2500 }
                : {})}
            >
              <Grid
                item
                xs={4}
                sx={{
                  padding: 1,
                }}
              >
                <Card
                  sx={{
                    padding: 2,
                    boxShadow: 0,
                    borderRadius: 2,
                    height: 110,
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      navigate("/reservation");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        height: 90,
                      }}
                    >
                      <img
                        className="d-block w-50"
                        src={require("../../assets/icons/reservation.png")}
                        alt="NEHB Reservation"
                        style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
                      />
                      <Typography
                        align="center"
                        gutterBottom
                        fontSize={14}
                        fontWeight={600}
                        component="div"
                        style={{ opacity: "40%" }}
                      >
                        NEHB Reservation
                      </Typography>
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grow>
          ) : (
            <></>
          )}
          
          {isComponentIdAvailable("EMOBCI0012") ? (
            <Grow
              in={isComponentIdAvailable("EMOBCI0012")}
              style={{ transformOrigin: "0 0 0" }}
              {...(isComponentIdAvailable("EMOBCI0012")
                ? { timeout: 2500 }
                : {})}
            >
              <Grid
                item
                xs={4}
                sx={{
                  padding: 1,
                }}
              >
                <Card
                  sx={{
                    padding: 2,
                    boxShadow: 0,
                    borderRadius: 2,
                    height: 110,
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      navigate("/rfid-attendence");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        height: 90,
                      }}
                    >
                      <img
                        className="d-block w-50"
                        src={require("../../assets/icons/user-check.png")}
                        alt="Remote Attendance"
                        style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
                      />
                      <Typography
                        align="center"
                        gutterBottom
                        fontSize={14}
                        fontWeight={600}
                        component="div"
                        style={{ opacity: "40%" }}
                      >
                        Remote Attendance
                      </Typography>
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grow>
          ) : (
            <></>
          )}
          {isComponentIdAvailable("EMOBCE0003") ? (
            <Grow
              in={isComponentIdAvailable("EMOBCE0003")}
              style={{ transformOrigin: "0 0 0" }}
              {...(isComponentIdAvailable("EMOBCE0003")
                ? { timeout: 2500 }
                : {})}
            >
              <Grid
                item
                xs={4}
                sx={{
                  padding: 1,
                }}
              >
                <Card
                  sx={{
                    padding: 2,
                    boxShadow: 0,
                    borderRadius: 2,
                    height: 110,
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      navigate("/file-attachments");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        height: 90,
                      }}
                    >
                      <img
                        className="d-block w-50"
                        src={require("../../assets/icons/gallery.png")}
                        alt="Gallery"
                        style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
                      />
                      <Typography
                        align="center"
                        gutterBottom
                        fontSize={14}
                        fontWeight={600}
                        component="div"
                        style={{ opacity: "40%" , marginTop: "8px" }}
                      >
                        Gallery
                      </Typography>
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grow>
          ) : (
            <></>
          )}

          {/* To-Do List */}
          

              {/* {isComponentIdAvailable("EMOBCE0003") ? (
            <Grow
              in={isComponentIdAvailable("EMOBCE0003")}
              style={{ transformOrigin: "0 0 0" }}
              {...(isComponentIdAvailable("EMOBCE0003") */}
            {isComponentIdAvailable("EMOBCE0004") ? (
            <Grow
              in={isComponentIdAvailable("EMOBCE0004")}
              style={{ transformOrigin: "0 0 0" }}
              {...(isComponentIdAvailable("EMOBCE0004")
                ? { timeout: 2500 }
                : {})}
            >
              <Grid
                item
                xs={4}
                sx={{
                  padding: 1,
                }}
              >
                <Card
                  sx={{
                    padding: 2,
                    boxShadow: 0,
                    borderRadius: 2,
                    height: 110,
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      navigate("/collectChoice");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        height: 90,
                      }}
                    >
                      <img
                        className="d-block w-50"
                        src={require("../../assets/icons/to-do-list.png")}
                        alt="ToDO List"
                        style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
                      />
                      <Typography
                        align="center"
                        gutterBottom
                        fontSize={14}
                        fontWeight={600}
                        component="div"
                        style={{ opacity: "40%" , marginTop: "8px" }}
                      >
                        To-Do List
                      </Typography>
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grow>
          ) : (
            <></>
          )}

          {/* Sub Ordering Attendance */}
          {isComponentIdAvailable("EMOBCI0014") ? (
            <Grow
              in={isComponentIdAvailable("EMOBCI0014")}
              style={{ transformOrigin: "0 0 0" }}
              {...(isComponentIdAvailable("EMOBCI0014")
                ? { timeout: 2500 }
                : {})}
            >
              <Grid
                item
                xs={4}
                sx={{
                  padding: 1,
                }}
              >
                <Card
                  sx={{
                    padding: 2,
                    boxShadow: 0,
                    borderRadius: 2,
                    height: 110,
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      navigate("/subordering");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        height: 90,
                      }}
                    >
                      <img
                        className="d-block w-50"
                        src={require("../../assets/icons/attendance.png")}
                        alt="Sub Ordering"
                        style={{ opacity: "70%", maxHeight: 70, maxWidth: 70 }}
                      />
                      <Typography
                        align="center"
                        gutterBottom
                        fontSize={14}
                        fontWeight={600}
                        component="div"
                        style={{ opacity: "40%" , marginTop: "8px" }}
                      >
                        Subordinates
                      </Typography>
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grow>
          ) : (
            <></>
          )}
        </Grid>
      </Box>
    </>
  );
}






