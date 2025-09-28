import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/PageTitle";
import { PageShell } from "@/components/PageShell";
import { Upload, Camera, XCircle } from "lucide-react";

interface CategoryTab {
  id: string;
  label: string;
  icon?: string;
}

interface UploadPageLayoutProps {
  title: string;
  subtitle: string;
  
  // Category tabs (for campaign workflow)
  categories?: CategoryTab[];
  selectedCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  isTransitioning?: boolean;
  showCategoryTabs?: boolean;
  
  // Content area
  children: ReactNode;
  contentHeight?: string;
  contentMarginTop?: string;
  
  // Bottom action tabs
  activeTab: 'qr' | 'computer' | 'ai' | 'predefined';
  onTabChange: (tab: 'qr' | 'computer' | 'ai' | 'predefined') => void;
  
  // Continue button
  showContinueButton?: boolean;
  continueDisabled?: boolean;
  onContinue?: () => void;
  continueText?: string;
}

export function UploadPageLayout({
  title,
  subtitle,
  categories = [],
  selectedCategory,
  onCategoryChange,
  isTransitioning = false,
  showCategoryTabs = false,
  children,
  contentHeight = "900px",
  contentMarginTop = "-70px",
  activeTab,
  onTabChange,
  showContinueButton = true,
  continueDisabled = true,
  onContinue,
  continueText = "Continue with this selection"
}: UploadPageLayoutProps) {
  
  return (
    <PageShell
      centerContent={false}
      pageBodyClassName="flex flex-col items-center"
      pageBodyStyle={{
        minHeight: "calc(100vh - 120px)",
        padding: "24px 56px",
        paddingTop: "0",
      }}
    >
      {/* Main Content */}
      <div className="w-full text-center flex flex-col items-center" style={{ height: "70%" }}>
        {/* Header */}
        <PageTitle
          title={title}
          subtitle={subtitle}
          className="flex flex-col justify-center items-center gap-4 w-full max-w-7xl mb-8"
        />

        {/* Category Tabs - Only show for campaign workflow */}
        {showCategoryTabs && (
          <div
            className="flex justify-center"
            style={{ height: "auto", marginTop: "24px", marginBottom: "98px" }}
          >
            <div
              className="flex items-center bg-white rounded-full shadow-lg relative z-20"
              style={{ padding: "22px", height: "auto" }}
            >
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className={`rounded-full font-medium transition-colors px-6 py-1 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600"
                  }`}
                  style={{
                    fontSize: "32px",
                    lineHeight: "2",
                  }}
                  onClick={() => onCategoryChange?.(category.id)}
                  disabled={isTransitioning}
                  data-testid={`tab-${category.id}`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div
          className="relative w-full flex justify-center"
          style={{ height: contentHeight, marginTop: contentMarginTop }}
        >
          {children}
        </div>

        {/* Continue Button */}
        {showContinueButton && (
          <div className="text-center mt-8">
            <Button
              size="lg"
              onClick={onContinue}
              disabled={continueDisabled}
              className={`rounded-full font-medium shadow-lg transition-colors ${
                !continueDisabled
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              style={{
                fontSize: "34px",
                lineHeight: "2",
                height: "auto",
                padding: "14px 60px",
              }}
              data-testid="button-continue-predefined"
            >
              {continueText}
            </Button>
          </div>
        )}

        {/* Bottom Action Tabs */}
        <div
          className="relative flex justify-center items-center gap-6"
          style={{
            height: "290px",
            marginTop: "24px",
            marginBottom: "98px",
            padding: "22px",
          }}
        >
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-2 px-6 py-4 font-medium transition-colors w-48 ${
              activeTab === "computer" ? "text-blue-600" : "text-gray-600"
            }`}
            style={{
              fontSize: "52px",
              lineHeight: "2",
              width: "520px",
            }}
            onClick={() => onTabChange("computer")}
            data-testid="tab-upload"
          >
            <Upload
              className="w-12 h-12"
              style={{ width: "76px", height: "auto" }}
            />
            Upload your images
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-2 px-6 py-4 font-medium transition-colors w-48 ${
              activeTab === "ai" ? "text-blue-600" : "text-gray-600"
            }`}
            style={{
              fontSize: "52px",
              lineHeight: "2",
              width: "520px",
            }}
            onClick={() => onTabChange("ai")}
            data-testid="tab-ai"
          >
            <Camera
              className="w-12 h-12"
              style={{ width: "76px", height: "auto" }}
            />
            Take a photo
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-2 px-6 py-4 font-medium transition-colors w-48 ${
              activeTab === "predefined" ? "text-blue-600" : "text-gray-600"
            }`}
            style={{
              fontSize: "52px",
              lineHeight: "2",
              width: "520px",
            }}
            onClick={() => onTabChange("predefined")}
            data-testid="tab-preselected"
          >
            <XCircle
              className="w-12 h-12"
              style={{ width: "76px", height: "auto" }}
            />
            I don't want to use my photos
          </Button>
        </div>
      </div>
    </PageShell>
  );
}