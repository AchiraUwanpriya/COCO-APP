import React from "react";
import "./loader.css";
import { useAuth } from "../../context/AuthContext";
import cocoLogo from "../../assets/images/nutrinuts-logo.png";

export default function Loader({ text }) {
  const { isOnline } = useAuth();
  return (
    <>
      {isOnline ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "30%",
          }}
        >
          <div className="loader">
            <div className="spinner"></div>
            <img src={cocoLogo} alt="COCO Logo" />
          </div>
          {text && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
                textAlign: "center",
                color: "#1A5D28",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {text}
            </div>
          )}
        </div>
      ) : (
        <div className="loadingMain">
          <div className="loading-text">
            <img
              src={require("../../assets/icons/connectionError.png")}
              alt="Logo"
              style={{ height: "30%" }}
            />
            <div className="loading-text-words">Connection Error...!</div>
            <div>
              <span className="loading-text-words">C</span>
              <span className="loading-text-words">o</span>
              <span className="loading-text-words">n</span>
              <span className="loading-text-words">n</span>
              <span className="loading-text-words">e</span>
              <span className="loading-text-words">c</span>
              <span className="loading-text-words">t</span>
              <span className="loading-text-words">i</span>
              <span className="loading-text-words">n</span>
              <span className="loading-text-words">g</span>
              <span className="loading-text-words">.</span>
              <span className="loading-text-words">.</span>
              <span className="loading-text-words">.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

