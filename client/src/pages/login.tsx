import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function Login() {
  const handleLogin = () => {
    // Simple sign in - set auth and redirect
    localStorage.setItem('campaign-ai-auth', 'true');
    window.location.reload(); // Force reload to trigger auth check
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center space-y-6 mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome to Campaign AI Gen</h1>
              <p className="text-gray-600 mt-2">Your AI-powered marketing workspace</p>
            </div>
          </div>
          
          <Card className="shadow-lg border-0 bg-gray-50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">Sign in to continue</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Button 
                onClick={handleLogin} 
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 font-semibold text-lg"
              >
                Sign In
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Click to access your internal workspace
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Right side - Solid background for future design */}
      <div className="flex-1 bg-gradient-to-br from-primary to-primary/80 hidden lg:block">
        {/* Empty space for future design elements */}
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-white/20">
            {/* Future design elements will go here */}
          </div>
        </div>
      </div>
    </div>
  );
}