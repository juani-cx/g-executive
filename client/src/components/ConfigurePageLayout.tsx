import { ReactNode } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/PageShell";

interface ConfigurePageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  uploadedImage?: string;
  onBack?: () => void;
  onRandomize?: () => void;
  onCreate?: () => void;
  isCreateDisabled?: boolean;
  backRoute?: string;
  createButtonText?: string;
}

export function ConfigurePageLayout({
  children,
  title = "Configure",
  subtitle = "Set up your campaign details",
  uploadedImage,
  onBack,
  onRandomize,
  onCreate,
  isCreateDisabled = false,
  backRoute,
  createButtonText = "Create campaign"
}: ConfigurePageLayoutProps) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backRoute) {
      navigate(backRoute);
    }
  };

  return (
    <PageShell title={title} subtitle={subtitle}>
      <div className="hidden">
        <Button
          variant="outline"
          className="text-gray-600 border-gray-300 hover:bg-gray-50"
          onClick={handleBack}
          data-testid="button-back-to-upload"
        >
          Back to home
        </Button>
      </div>

      {/* Main Content */}
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
        <div
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          {/* Content Area */}
          <div className="mx-auto" style={{ width: "2000px", maxWidth: "80%" }}>
            {/* White card container */}
            <div
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mx-auto w-full overflow-hidden"
              style={{ height: "840px" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start overflow-hidden">
                {/* Left Column - Image */}
                <div className="flex justify-center overflow-hidden">
                  <div
                    className="w-full bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center"
                    style={{ height: "100%" }}
                  >
                    {uploadedImage ? (
                      <img
                        src={uploadedImage}
                        alt="Uploaded product"
                        className="w-full h-full object-cover"
                        data-testid="img-uploaded-preview"
                      />
                    ) : (
                      <div className="text-gray-500 text-center p-4" data-testid="text-no-image">
                        <div className="text-4xl mb-2">📋</div>
                        <div>Ready to configure</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Configuration */}
                <div className="space-y-2">
                  {/* Form Fields - Passed as children */}
                  <div>
                    {children}
                  </div>

                  {/* Buttons Row - Left aligned with consistent styling */}
                  <div className="mt-12 flex gap-4 justify-start">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="text-gray-600 border-gray-300 hover:bg-gray-50 rounded-full"
                      style={{
                        fontSize: "28px",
                        fontWeight: "500",
                        padding: "16px 36px",
                        height: "auto",
                        lineHeight: "1.2",
                      }}
                      data-testid="button-back"
                    >
                      Back
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={onRandomize}
                      className="text-gray-600 border-gray-300 hover:bg-gray-50 rounded-full"
                      style={{
                        fontSize: "28px",
                        fontWeight: "500",
                        padding: "16px 36px",
                        height: "auto",
                        lineHeight: "1.2",
                      }}
                      data-testid="button-randomize-all"
                    >
                      Randomize
                    </Button>

                    <Button
                      onClick={onCreate}
                      disabled={isCreateDisabled}
                      className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full transition-all duration-200"
                      style={{
                        fontSize: "28px",
                        fontWeight: "500",
                        padding: "16px 36px",
                        height: "auto",
                        lineHeight: "1.2",
                      }}
                      data-testid="button-create-campaign"
                    >
                      {createButtonText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}