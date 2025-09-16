import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function NewLanding() {
  const [, navigate] = useLocation();

  const handleStartNow = () => {
    navigate('/homepage');
  };

  return (
    <div className="min-h-screen dotted-background flex items-center justify-center">
      {/* Google Logo - Top Left */}
      <div className="absolute top-8 left-8">
        <span className="text-4xl font-normal text-gray-800">Google</span>
      </div>

      {/* How it works - Top Right */}
      <div className="absolute top-8 right-8">
        <Button 
          variant="outline" 
          className="text-lg px-6 py-3 rounded-full border-gray-800 text-gray-800 hover:bg-gray-50"
          onClick={() => console.log('How it works clicked')}
        >
          How it works
        </Button>
      </div>

      {/* Main Content - Centered */}
      <div className="text-center max-w-4xl mx-auto px-8">
        <h1 className="text-8xl font-bold text-gray-800 mb-6 tracking-tight">
          Promote your product now
        </h1>
        
        <p className="text-4xl text-gray-600 mb-16">
          Executive campaign AI builder for executive people
        </p>
        
        <div className="flex items-center justify-center gap-8">
          <Button 
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 text-2xl font-semibold px-12 py-6 rounded-full min-h-[80px]"
            onClick={handleStartNow}
            data-testid="button-start-now"
          >
            Start now
          </Button>
          
          <Button 
            variant="outline" 
            className="text-2xl px-12 py-6 rounded-full border-gray-800 text-gray-800 hover:bg-gray-50 min-h-[80px]"
            onClick={() => console.log('How it works clicked')}
            data-testid="button-how-it-works"
          >
            How it works
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-xl text-gray-600">
          Executive campaign AI builder for executive people
        </p>
      </div>
    </div>
  );
}