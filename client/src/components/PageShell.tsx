import { ReactNode } from "react";
import { AppShell, PageHeader, PageBody, PageFooter } from "@/components/layout";
import TopNavigation from "@/components/TopNavigation";
import { PageTitle } from "@/components/PageTitle";

interface PageShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showNavigation?: boolean;
  showFooter?: boolean;
  footerContent?: ReactNode;
  centerContent?: boolean;
  className?: string;
  style?: React.CSSProperties;
  pageBodyClassName?: string;
  pageBodyStyle?: React.CSSProperties;
  isLandingPage?: boolean;
  pageTitleClassName?: string;
}

export function PageShell({ 
  children, 
  title,
  subtitle,
  showNavigation = true,
  showFooter = false,
  footerContent,
  centerContent = false,
  className = "",
  style = {},
  pageBodyClassName = "",
  pageBodyStyle = {},
  isLandingPage = false,
  pageTitleClassName = ""
}: PageShellProps) {
  const baseClassName = "dotted-background";
  const baseStyle = {
    fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 'var(--font-size-base)',
    ...style
  };

  return (
    <AppShell
      className={`${baseClassName} ${className}`}
      style={baseStyle}
      mainStyle={isLandingPage ? { paddingTop: '10%' } : {}}
      header={
        showNavigation ? (
          <PageHeader>
            <TopNavigation isLandingPage={isLandingPage} />
          </PageHeader>
        ) : undefined
      }
      footer={
        showFooter ? (
          <PageFooter>
            {footerContent || (
              <p className="footer-text text-gray-600">
                Create multi-channel assets in an instant
              </p>
            )}
          </PageFooter>
        ) : undefined
      }
    >
      {/* Title Section - positioned at top touching header */}
      {title && (
        <div className="w-full text-center py-8 border-b border-gray-100">
          <PageTitle
            title={title}
            subtitle={subtitle}
            className={`flex flex-col justify-center items-center gap-4 w-full ${pageTitleClassName}`}
          />
        </div>
      )}
      
      <PageBody 
        centerContent={centerContent}
        className={`flex-1 ${pageBodyClassName}`}
        style={pageBodyStyle}
      >
        {children}
      </PageBody>
    </AppShell>
  );
}