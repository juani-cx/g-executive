import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface TimeoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStayHere: () => void;
  onGoHome: () => void;
}

export default function TimeoutModal({ isOpen, onClose, onStayHere, onGoHome }: TimeoutModalProps) {
  const [countdown, setCountdown] = useState(10);
  
  console.log('🕒 [Timeout Debug] TimeoutModal render - isOpen:', isOpen);

  // Reset countdown when modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(10);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleStayHere = () => {
    onStayHere();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-[#cbcbcb] opacity-100 relative overflow-hidden">
        <DialogDescription className="sr-only">
          Timeout warning dialog with countdown timer
        </DialogDescription>
        {/* Animated Triangle Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="absolute top-4 left-4 w-32 h-28">
            <svg width="100%" height="100%" viewBox="0 0 780 675" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M721.688 641.5H58.3125L390 66.999L721.688 641.5Z" 
                stroke="#69AD6E" 
                strokeWidth="67" 
                className="triangle-animate"
              />
              <style dangerouslySetInnerHTML={{
                __html: `.triangle-animate{
                  stroke-dasharray:1991 1993;
                  stroke-dashoffset:1992;
                  animation:triangle-draw 6900ms ease-in-out 0ms infinite, triangle-fade 6900ms linear 0ms infinite;
                }
                @keyframes triangle-draw{
                  2.898550724637681%{stroke-dashoffset: 1992}
                  68.11594202898551%{ stroke-dashoffset: 0;}
                  100%{ stroke-dashoffset: 0;}
                }
                @keyframes triangle-fade{
                  0%{stroke-opacity:0.3;}
                  97.10144927536231%{stroke-opacity:0.3;}
                  100%{stroke-opacity:0;}
                }`
              }} />
            </svg>
          </div>
          
          {/* Additional floating triangles */}
          <div className="absolute top-16 right-8 w-24 h-20 transform rotate-45">
            <svg width="100%" height="100%" viewBox="0 0 780 675" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M721.688 641.5H58.3125L390 66.999L721.688 641.5Z" 
                stroke="#D96756" 
                strokeWidth="67" 
                className="triangle-animate-2"
              />
              <style dangerouslySetInnerHTML={{
                __html: `.triangle-animate-2{
                  stroke-dasharray:1991 1993;
                  stroke-dashoffset:1992;
                  animation:triangle-draw-2 8400ms ease-in-out 1500ms infinite, triangle-fade-2 8400ms linear 1500ms infinite;
                }
                @keyframes triangle-draw-2{
                  2.898550724637681%{stroke-dashoffset: 1992}
                  68.11594202898551%{ stroke-dashoffset: 0;}
                  100%{ stroke-dashoffset: 0;}
                }
                @keyframes triangle-fade-2{
                  0%{stroke-opacity:0.2;}
                  97.10144927536231%{stroke-opacity:0.2;}
                  100%{stroke-opacity:0;}
                }`
              }} />
            </svg>
          </div>
          
          <div className="absolute bottom-8 left-12 w-20 h-16 transform -rotate-12">
            <svg width="100%" height="100%" viewBox="0 0 780 675" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M721.688 641.5H58.3125L390 66.999L721.688 641.5Z" 
                stroke="#69AD6E" 
                strokeWidth="67" 
                className="triangle-animate-3"
              />
              <style dangerouslySetInnerHTML={{
                __html: `.triangle-animate-3{
                  stroke-dasharray:1991 1993;
                  stroke-dashoffset:1992;
                  animation:triangle-draw-3 7800ms ease-in-out 3000ms infinite, triangle-fade-3 7800ms linear 3000ms infinite;
                }
                @keyframes triangle-draw-3{
                  2.898550724637681%{stroke-dashoffset: 1992}
                  68.11594202898551%{ stroke-dashoffset: 0;}
                  100%{ stroke-dashoffset: 0;}
                }
                @keyframes triangle-fade-3{
                  0%{stroke-opacity:0.15;}
                  97.10144927536231%{stroke-opacity:0.15;}
                  100%{stroke-opacity:0;}
                }`
              }} />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <DialogTitle style={{ fontSize: '24px', lineHeight: 1, fontWeight: 500, margin: '16px 0 8px', textAlign: 'center', color: '#1f2937' }}>
            Are you still there?
          </DialogTitle>
          
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-2">
                We haven't seen any activity for a while.
              </p>
              <p className="text-base text-gray-600 mb-4">
                Would you like to continue working on your project?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Auto-redirect in:</p>
                <div className="text-4xl font-bold text-red-600">{countdown} seconds</div>
              </div>
            </div>
            
            <div className="flex gap-4 w-full justify-center">
              <Button
                onClick={handleStayHere}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg transition-all"
                data-testid="button-stay-here"
              >
                Yes, I'm here!
              </Button>
              
              <Button
                onClick={onGoHome}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full text-lg font-medium transition-all"
                data-testid="button-go-home"
              >
                Take me home
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 text-center">
              You will be automatically redirected to the homepage when the timer reaches zero.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}