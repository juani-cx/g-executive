import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function NewLanding() {
  const [, navigate] = useLocation();

  const handleStartNow = () => {
    navigate('/homepage');
  };

  return (
    <div className="min-h-screen dotted-background relative overflow-hidden">
      {/* Animated SVG Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ellipse SVG - Bottom Left */}
        <div className="absolute opacity-100" style={{
          width: '530px',
          height: 'auto',
          left: '-100px',
          bottom: '-30%'
        }}>
          <svg width="100%" height="100%" viewBox="0 0 1068 1068" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="#D96756" strokeWidth="67" d="M34,534A500,500 0,1,1 1034,534A500,500 0,1,1 34,534" className="WxGoLpNe_0"/>
            <style dangerouslySetInnerHTML={{__html: `.WxGoLpNe_0{stroke-dasharray:3143 3145;stroke-dashoffset:3144;animation:WxGoLpNe_draw_0 7200ms ease-in-out 0ms infinite,WxGoLpNe_fade 7200ms linear 0ms infinite;}@keyframes WxGoLpNe_draw{100%{stroke-dashoffset:0;}}@keyframes WxGoLpNe_fade{0%{stroke-opacity:1;}94.44444444444444%{stroke-opacity:1;}100%{stroke-opacity:0;}}@keyframes WxGoLpNe_draw_0{11.11111111111111%{stroke-dashoffset: 3144}38.88888888888889%{ stroke-dashoffset: 0;}100%{ stroke-dashoffset: 0;}}`}} />
          </svg>
        </div>
        {/* Triangle SVG - Top Right */}
        <div className="absolute top-20 w-72 h-72 opacity-100" style={{ right: '-70px' }}>
          <svg width="100%" height="100%" viewBox="0 0 780 675" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M721.688 641.5H58.3125L390 66.999L721.688 641.5Z" stroke="#69AD6E" strokeWidth="67" className="STajmnwW_0"/>
            <style dangerouslySetInnerHTML={{__html: `.STajmnwW_0{stroke-dasharray:1991 1993;stroke-dashoffset:1992;animation:STajmnwW_draw_0 6900ms ease-in-out 0ms infinite,STajmnwW_fade 6900ms linear 0ms infinite;}@keyframes STajmnwW_draw{100%{stroke-dashoffset:0;}}@keyframes STajmnwW_fade{0%{stroke-opacity:1;}97.10144927536231%{stroke-opacity:1;}100%{stroke-opacity:0;}}@keyframes STajmnwW_draw_0{2.898550724637681%{stroke-dashoffset: 1992}68.11594202898551%{ stroke-dashoffset: 0;}100%{ stroke-dashoffset: 0;}}`}} />
          </svg>
        </div>
      </div>

      {/* Google Logo - Top Left */}
      <div className="absolute top-8 left-8 z-10">
        <svg width="150" height="88" viewBox="0 0 249 147" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M106.675 75.4022C106.675 87.1756 97.465 95.8513 86.1618 95.8513C74.8586 95.8513 65.6482 87.1756 65.6482 75.4022C65.6482 63.5458 74.8586 54.9531 86.1618 54.9531C97.465 54.9531 106.675 63.5458 106.675 75.4022ZM97.6955 75.4022C97.6955 68.045 92.3574 63.0111 86.1618 63.0111C79.9662 63.0111 74.6281 68.045 74.6281 75.4022C74.6281 82.6857 79.9662 87.7933 86.1618 87.7933C92.3574 87.7933 97.6955 82.6765 97.6955 75.4022Z" fill="#1E1E1E"/>
          <path d="M150.929 75.4022C150.929 87.1756 141.719 95.8513 130.415 95.8513C119.112 95.8513 109.902 87.1756 109.902 75.4022C109.902 63.555 119.112 54.9531 130.415 54.9531C141.719 54.9531 150.929 63.5458 150.929 75.4022ZM141.949 75.4022C141.949 68.045 136.611 63.0111 130.415 63.0111C124.22 63.0111 118.882 68.045 118.882 75.4022C118.882 82.6857 124.22 87.7933 130.415 87.7933C136.611 87.7933 141.949 82.6765 141.949 75.4022Z" fill="#1E1E1E"/>
          <path d="M193.337 56.1886V92.901C193.337 108.003 184.431 114.171 173.903 114.171C163.991 114.171 158.026 107.542 155.777 102.121L163.595 98.8661C164.987 102.194 168.398 106.122 173.893 106.122C180.633 106.122 184.809 101.964 184.809 94.1364V91.1954H184.496C182.486 93.6754 178.614 95.842 173.727 95.842C163.503 95.842 154.136 86.9359 154.136 75.476C154.136 63.933 163.503 54.9531 173.727 54.9531C178.605 54.9531 182.477 57.1197 184.496 59.526H184.809V56.1978H193.337V56.1886ZM185.446 75.476C185.446 68.2754 180.642 63.0111 174.53 63.0111C168.334 63.0111 163.143 68.2754 163.143 75.476C163.143 82.6027 168.334 87.7933 174.53 87.7933C180.642 87.7933 185.446 82.6027 185.446 75.476Z" fill="#1E1E1E"/>
          <path d="M207.4 34.6689V94.5963H198.641V34.6689H207.4Z" fill="#1E1E1E"/>
          <path d="M241.528 82.131L248.498 86.7777C246.249 90.1059 240.828 95.8405 231.461 95.8405C219.844 95.8405 211.168 86.8606 211.168 75.3915C211.168 63.2308 219.918 54.9424 230.456 54.9424C241.067 54.9424 246.258 63.3875 247.955 67.9512L248.886 70.2746L221.55 81.5962C223.642 85.699 226.897 87.7918 231.461 87.7918C236.034 87.7918 239.205 85.5422 241.528 82.131ZM220.074 74.7737L238.348 67.186C237.343 64.6322 234.319 62.8528 230.76 62.8528C226.196 62.8528 219.844 66.8818 220.074 74.7737Z" fill="#1E1E1E"/>
          <path d="M32.495 70.08V61.4044H61.7303C62.0161 62.9164 62.1636 64.705 62.1636 66.6411C62.1636 73.1501 60.3842 81.1988 54.6497 86.9334C49.0718 92.7418 41.945 95.8396 32.5042 95.8396C15.0054 95.8396 0.290894 81.5861 0.290894 64.0873C0.290894 46.5885 15.0054 32.335 32.5042 32.335C42.1848 32.335 49.081 36.1334 54.2624 41.0844L48.1406 47.2062C44.4251 43.7212 39.3912 41.0106 32.495 41.0106C19.7166 41.0106 9.72254 51.3089 9.72254 64.0873C9.72254 76.8656 19.7166 87.1639 32.495 87.1639C40.7834 87.1639 45.5038 83.8356 48.5278 80.8116C50.9803 78.3592 52.5937 74.8558 53.2298 70.0708L32.495 70.08Z" fill="#1E1E1E"/>
        </svg>
      </div>

      {/* How it works - Top Right */}
      <div className="absolute top-8 right-8 z-10">
        <Button 
          variant="outline" 
          className="text-lg px-6 py-3 rounded-full border-gray-800 text-gray-800 hover:bg-gray-50"
          onClick={() => console.log('How it works clicked')}
        >
          How it works
        </Button>
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center w-full px-8">
          <h1 className="text-[120px] font-bold text-gray-800 tracking-tight leading-none">
            Promote your product now
          </h1>
          
          <p className="text-gray-600 leading-none" style={{ margin: '44px', fontSize: '54px', lineHeight: '1' }}>
            Executive campaign AI builder for executive people
          </p>
          
          <div className="flex items-center justify-center gap-8">
            <Button 
              className="bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold rounded-full"
              style={{ fontSize: '30px', lineHeight: '1', padding: '24px 76px', height: 'auto' }}
              onClick={handleStartNow}
              data-testid="button-start-now"
            >
              Start now
            </Button>
            
            <Button 
              variant="outline" 
              className="border-gray-800 text-gray-800 hover:bg-gray-50 rounded-full font-semibold"
              style={{ fontSize: '30px', lineHeight: '1', padding: '24px 76px', height: 'auto' }}
              onClick={() => console.log('How it works clicked')}
              data-testid="button-how-it-works"
            >
              How it works
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <p className="text-xl text-gray-600">
          Executive campaign AI builder for executive people
        </p>
      </div>
    </div>
  );
}