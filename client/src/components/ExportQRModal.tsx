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
      <DialogContent className="max-w-lg bg-white p-8" style={{ zIndex: 10001 }}>
        <DialogHeader>
          <DialogTitle style={{ fontSize: '24px', lineHeight: 1, fontWeight: 500, margin: '16px 0 8px', fontFamily: 'Google Sans', textAlign: 'center' }}>
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center text-center">
          {/* QR Component */}
          <div style={{
            boxSizing: 'border-box',
            background: '#e6ebf2',
            border: '27px solid #fff',
            borderRadius: '15px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            width: '400px',
            height: '340px',
            margin: '16px 0'
          }}>
            <QRCode
              value={qrUrl}
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
            />
          </div>

          <p style={{
            color: '#5c5c5c',
            fontSize: '18px',
            marginBottom: '12px',
            fontFamily: 'Google Sans',
            fontWeight: 400
          }}>
            {description}
          </p>

          <Button
            onClick={onClose}
            className="mt-4 bg-[#4285F4] hover:bg-[#3367D6] text-white px-8 py-2 rounded-full"
            data-testid="button-close-export-modal"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}