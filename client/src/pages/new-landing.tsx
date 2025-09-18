import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TopNavigation from "@/components/TopNavigation";

export default function NewLanding() {
  const [, navigate] = useLocation();

  const handleStartNow = () => {
    navigate('/homepage');
  };

  return (
    <div className="dotted-background relative overflow-hidden" style={{ height: '100vh' }}>
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


      {/* Top Navigation */}
      <TopNavigation isLandingPage={true} />

      {/* Main Content - Centered */}
      <div className="relative z-10 flex items-center justify-center" style={{ height: 'calc(100vh - 120px)' }}>
        <div className="text-center w-full px-8">
          <h1 className="text-[120px] text-gray-800 tracking-tight leading-none" style={{ fontWeight: '475', marginTop: '-80px' }}>
            Promote your product now
          </h1>
          
          <h2 className="text-gray-600 leading-none" style={{ margin: '44px', fontSize: '54px', lineHeight: '1', fontWeight: '400' }}>
            Executive campaign AI builder for executive people
          </h2>
          
          <div className="flex items-center justify-center gap-8">
            <Button 
              className="bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold rounded-full"
              style={{ fontSize: '30px', lineHeight: '1', padding: '24px 76px', height: 'auto' }}
              onClick={handleStartNow}
              data-testid="button-start-now"
            >
              Start now
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