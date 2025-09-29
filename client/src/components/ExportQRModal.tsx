import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QRCode from "react-qr-code";

interface ExportQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrUrl: string;
  title?: string;
  description?: string;
}

export function ExportQRModal({ 
  isOpen, 
  onClose, 
  qrUrl, 
  title = "Download Your Assets",
  description = "Scan to download your assets"
}: ExportQRModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle style={{ fontSize: '48px', lineHeight: 1, fontWeight: 500, margin: '16px 0 8px', fontFamily: 'Google Sans', textAlign: 'center' }}>
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center text-center">
          {/* QR Component */}
          <div style={{
            boxSizing: 'border-box',
            background: '#e6ebf2',
            border: '54px solid #fff',
            borderRadius: '30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            width: '800px',
            height: '680px',
            margin: '32px 0'
          }}>
            <QRCode
              value={qrUrl}
              size={600}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
            />
          </div>

          <p style={{
            color: '#5c5c5c',
            fontSize: '72px',
            marginBottom: '24px',
            fontFamily: 'Google Sans',
            fontWeight: 400
          }}>
            {description}
          </p>

          <Button
            onClick={onClose}
            className="mt-4 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full focus:outline-none focus:ring-0 focus-visible:ring-0"
            style={{
              fontSize: '32px',
              lineHeight: '2',
              height: 'auto',
              padding: '0 34px'
            }}
            data-testid="button-close-export-modal"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}