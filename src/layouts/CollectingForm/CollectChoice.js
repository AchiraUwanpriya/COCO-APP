import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Truck } from "lucide-react";

export default function CollectChoice() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 12, fontSize: 18, fontWeight: 700 }}>Choose role</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div
          role="button"
          onClick={() => navigate("/collectForm?type=admin&view=form")}
          style={{
            cursor: "pointer",
            flex: 1,
            minWidth: 200,
            background: "linear-gradient(135deg,#004AAD 0%,#1d4ed8 100%)",
            color: "#fff",
            padding: 18,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Admin</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Manage collection items</div>
          </div>
        </div>

        <div
          role="button"
          onClick={() => navigate("/collectForm?type=chaser")}
          style={{
            cursor: "pointer",
            flex: 1,
            minWidth: 200,
            background: "linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%)",
            color: "#fff",
            padding: 18,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Truck color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Chaser</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Collect and remark</div>
          </div>
        </div>

        <div
          role="button"
          onClick={() => navigate("/executive")}
          style={{
            cursor: "pointer",
            flex: 1,
            minWidth: 200,
            background: "linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)",
            color: "#fff",
            padding: 18,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Truck color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Executive</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>View collection details</div>
          </div>
        </div>
      </div>
    </div>
  );
}