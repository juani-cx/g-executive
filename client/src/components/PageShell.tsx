import { ReactNode } from "react";
import { AppShell, PageHeader, PageBody, PageFooter } from "@/components/layout";
import TopNavigation from "@/components/TopNavigation";

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
  isLandingPage = false
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
      <PageBody 
        centerContent={centerContent}
        className={pageBodyClassName}
        style={pageBodyStyle}
      >
        {children}
      </PageBody>
    </AppShell>
  );
}