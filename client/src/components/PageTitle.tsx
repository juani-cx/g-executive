import { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageTitle({ title, subtitle, className = "" }: PageTitleProps) {
  return (
    <div
      className={className}
      style={{
        maxWidth: 'none',
        padding: '0px',
        marginBottom: '32px'
      }}
    >
      <h1
        style={{
          fontSize: '118px',
          fontWeight: '500',
          lineHeight: '1',
          margin: '0px',
          color: '#000',
          textAlign: 'center',
          fontFamily: 'Google Sans'
        }}
        data-testid="text-main-title"
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: '48px',
            fontWeight: '400',
            lineHeight: '1',
            margin: '30px 0 0 0',
            color: '#5c5c5c',
            textAlign: 'center',
            fontFamily: 'Google Sans'
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}