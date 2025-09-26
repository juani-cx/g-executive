import { useLocation } from "wouter";
// Use images from public folder
const campaignImage = "/images/cards-campaign.png";
const catalogImage = "/images/cards-catalog.png";
import TopNavigation from "@/components/TopNavigation";
import { AppShell, PageHeader, PageBody, PageFooter } from "@/components/layout";
import { PageTitle } from "@/components/PageTitle";

export default function Landing() {
  const [, navigate] = useLocation();

  const handleOptionSelect = (optionType: "marketing" | "catalog") => {
    // Store the selected type
    localStorage.setItem("selectedAppType", optionType);
    localStorage.setItem(
      "workflowType",
      optionType === "marketing" ? "campaign" : "catalog",
    );

    if (optionType === "marketing") {
      // Navigate to the campaign upload page
      navigate("/upload-campaign");
    } else {
      // Navigate to the catalog upload page
      navigate("/upload-catalog");
    }
  };

  return (
    <AppShell
      className="landing-page dotted-background"
      style={{
        fontFamily:
          'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
      header={
        <PageHeader>
          <TopNavigation isLandingPage={true} />
        </PageHeader>
      }
      footer={
        <PageFooter>
          <p className="footer-text text-gray-600">
            Create multi-channel assets in an instant
          </p>
        </PageFooter>
      }
    >
      <PageBody>

      {/* Main Container - Fixed dimensions based on Figma */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 56px",
          boxSizing: "border-box",
          paddingTop: "0",
        }}
      >
        {/* Title Section - Using PageTitle component */}
        <PageTitle
          title="The Gemini launchpad: Campaigns and Products"
          subtitle="Campaign and product listings, built instantly from a single image"
          className="flex flex-col justify-center items-center gap-4 w-full max-w-7xl"
        />

        {/* Content Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "52px",
            width: "100%",
            maxWidth: "1006px",
            flex: 1,
          }}
        >
          {/* Cards Container */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "52px",
              width: "100%",
              justifyContent: "center",
              marginTop: "40px",
              height: "100%",
            }}
          >
            {/* Marketing Campaign Card */}
            <div
              className="landing-card"
              style={{
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                flex: "1 0 0",
                alignItems: "flex-start",
                width: "100%",
                cursor: "pointer",
                maxWidth: "none",
                height: "100%",
              }}
              onClick={() => handleOptionSelect("marketing")}
              data-testid="card-marketing-option"
            >
              {/* Card Header */}
              <div
                style={{

                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "4px",
                  width: "100%",
                  paddingBottom: "24px",
                  boxSizing: "border-box",
                }}
              >
                <span
                  className="landing-card-title"
                  style={{
                    color: "#000",
                    flex: "1 0 0",
                    fontFamily: "Google Sans",
                  }}
                >
                  Launch a<br />
                  campaign
                </span>
              </div>

              {/* Card Content */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "16px",
                  width: "100%",
                }}
              >
                {/* Image Container */}
                <div
                  className="landing-card-height landing-card-image"
                  style={{
                    background: "#e6ebf2",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    paddingBottom: "4px",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    height: "100%",
                  }}
                >
                  <img
                    src={campaignImage}
                    alt="Marketing Campaign"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Description */}
                <span
                  className="landing-card-description"
                  style={{
                    color: "#000",
                    fontFamily: "Google Sans",
                  }}
                >
                  Transform your inspiration into complete multi-channel
                  campaigns.
                </span>
              </div>
            </div>

            {/* Catalog Enrichment Card */}
            <div
              className="landing-card"
              style={{
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                flex: "1 0 0",
                alignItems: "flex-start",
                width: "100%",
                cursor: "pointer",
                maxWidth: "none",
                height: "100%",
              }}
              onClick={() => handleOptionSelect("catalog")}
              data-testid="card-catalog-option"
            >
              {/* Card Header */}
              <div
                style={{

                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "4px",
                  width: "100%",
                  paddingBottom: "24px",
                  boxSizing: "border-box",
                }}
              >
                <span
                  className="landing-card-title"
                  style={{
                    color: "#000",
                    flex: "1 0 0",
                    fontFamily: "Google Sans",
                  }}
                >
                  Launch a<br />
                  product
                </span>
              </div>

              {/* Card Content */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "16px",
                  width: "100%",
                }}
              >
                {/* Image Container */}
                <div
                  className="landing-card-height landing-card-image"
                  style={{
                    background: "#e6ebf2",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    paddingBottom: "4px",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    height: "100%",
                  }}
                >
                  <img
                    src={catalogImage}
                    alt="Catalog Enrichment"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Description */}
                <span
                  className="landing-card-description"
                  style={{
                    color: "#000",
                    fontFamily: "Google Sans",
                  }}
                >
                  Generate high-quality SEO metadata instantly.
                </span>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div
            style={{
              border: "none",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              padding: "6px 20px",
              boxSizing: "border-box",
            }}
          >
            <span
              style={{
                color: "#5c5c5c",
                fontFamily: "Google Sans",
                fontSize: "24px",
                fontWeight: "400",
                lineHeight: "28px",
              }}
              data-testid="text-footer-cta"
            >
              Choose an experience to get started
            </span>
          </div>
        </div>
      </div>
      </PageBody>
    </AppShell>
  );
}
