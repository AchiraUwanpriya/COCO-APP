import React from "react";
import { useLocation } from "react-router-dom";

import AdminCollectionPage from "./Admincollectionpage";
import ChaserCollectionPage from "./Chasercollectionpage";

export default function DailyCollectionSheet() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get("type");

  const isChaser = typeParam === "chaser";

  return isChaser ? <ChaserCollectionPage /> : <AdminCollectionPage />;
}



// import React, { useEffect, useState } from "react";
// import AdminCollectionPage from "./Admincollectionpage";
// import ChaserCollectionPage from "./Chasercollectionpage"; 
// import api from "../../service/CommonService";
// const TARGET_COMPONENT_ID = "EMOBCE0004";

// export default function DailyCollectionSheet() {
//   const [accessLevel, setAccessLevel] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api
//       .GetAccessHeadComponent()
//       .then((res) => {
//         const list = res.data?.ResultSet ?? [];

//         const row = list.find(
//           (x) => x?.ComponentId === TARGET_COMPONENT_ID
//         );

//         const level =
//           row?.AccessLevel != null
//             ? String(row.AccessLevel)
//             : "";

//         setAccessLevel(level);
//       })
//       .catch((err) => {
//         console.error("Access level fetch failed", err);
//         setAccessLevel("");
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return accessLevel === "1"
//     ? <ChaserCollectionPage />
//     : <AdminCollectionPage />;
// }