import { useEffect } from "react";
import { useLocation } from "wouter";
import GoogleLogoAnimation from "@/components/GoogleLogoAnimation";
import { PageShell } from "@/components/PageShell";

export default function Loading() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Check workflow type to determine which canvas to navigate to
    const workflowType = localStorage.getItem("workflowType");
    const targetPath =
      workflowType === "catalog" ? "/catalog-canvas" : "/canvas";

    // Redirect after 8 seconds to show full animation
    const timer = setTimeout(() => {
      navigate(targetPath);
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageShell 
      showNavigation={false}
      showFooter={false}
      centerContent={true}
      className="loading-page"
      style={{
        backgroundColor: "#f5f5f5",
        height: "100vh",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {/* Centered content container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: "0 40px",
          gap: "40px",
        }}
      >
        {/* Simple Loading Animation */}
        <GoogleLogoAnimation size={120} />

        {/* Loading Text */}
        <h1
          style={{
            color: "#5f6368",
            textAlign: "center",
            fontFamily: "Google Sans",
            fontSize: "64px",
            fontWeight: "400",
            lineHeight: "80px",
            margin: 0,
            maxWidth: "1200px",
          }}
        >
          Working on it... you'll see results shortly.
        </h1>
        <h3
          style={{
            color: "#5f6368",
            textAlign: "center",
            fontFamily: "Google Sans",
            fontSize: "40px",
            fontWeight: "200",
            lineHeight: "64px",
            margin: 0,
            maxWidth: "1200px",
          }}
        >
          AI results can be imperfect or may fail.
        </h3>
      </div>

      {/* Decorative Shapes */}
      <div
        className="shapes-container"
        style={{
          position: "absolute",
          bottom: "80px",
          left: "0",
          right: "0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          padding: "0 80px",
          pointerEvents: "none",
        }}
      >
        {/* Green Triangle */}
        <div
          style={{
            width: "0",
            height: "0",
            borderLeft: "80px solid transparent",
            borderRight: "80px solid transparent",
            borderBottom: "120px solid #34A853",
            opacity: "0.8",
          }}
        />

        {/* Orange Circle */}
        <div
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
            opacity: "0.8",
          }}
        />
      </div>
    </PageShell>
  );
}
