import TopNavigation from "@/components/TopNavigation";

interface FixedHeaderLayoutProps {
  children: React.ReactNode;
  isLandingPage?: boolean;
}

export default function FixedHeaderLayout({ children, isLandingPage = false }: FixedHeaderLayoutProps) {
  return (
    <div className="fixed-header-layout" style={{ minHeight: '100vh', width: '100vw' }}>
      {/* Fixed Header */}
      <div 
        className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm"
        style={{ 
          width: '100vw',
          borderBottom: '1px solid rgba(229, 231, 235, 0.3)'
        }}
      >
        <TopNavigation isLandingPage={isLandingPage} />
      </div>
      
      {/* Content Area */}
      <div 
        className="content-area"
        style={{
          position: 'absolute',
          top: isLandingPage ? '120px' : '100px',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          overflow: 'auto',
          paddingBottom: '2rem'
        }}
      >
        {children}
      </div>
    </div>
  );
}