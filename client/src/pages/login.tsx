import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, LogIn, Shield, Zap, TrendingUp } from "lucide-react";

export default function Login() {
  const handleSignIn = () => {
    // Simple sign in - set auth and redirect
    localStorage.setItem('campaign-ai-auth', 'true');
    window.location.reload(); // Force reload to trigger auth check
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Login Form */}
      <div className="flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-md-sys-color-primary to-md-sys-color-tertiary rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-md-sys-color-on-surface mb-3 tracking-tight">
              Campaign AI
            </h1>
            <p className="text-md-sys-color-on-surface-variant text-lg mb-8">
              AI-powered marketing platform for creating stunning campaigns and catalogs
            </p>
          </div>

          <Card className="surface-elevation-2 border-md-sys-color-outline-variant overflow-hidden">
            <CardContent className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-md-sys-color-on-surface mb-2">
                  Welcome back
                </h2>
                <p className="text-md-sys-color-on-surface-variant">
                  Sign in to access your marketing workspace
                </p>
              </div>

              <Button 
                onClick={handleSignIn}
                className="w-full fab-style py-4 rounded-2xl font-medium text-lg transition-all duration-200 hover:scale-105"
              >
                <LogIn className="w-5 h-5 mr-3" />
                Sign In to Continue
              </Button>
              
              <div className="mt-8 pt-6 border-t border-md-sys-color-outline-variant">
                <div className="flex items-center justify-center space-x-6 text-sm text-md-sys-color-on-surface-variant">
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-md-sys-color-primary" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-md-sys-color-secondary" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-md-sys-color-tertiary" />
                    <span>Fast</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-md-sys-color-on-surface-variant">
            Transform your marketing with intelligent automation
          </p>
        </div>
      </div>

      {/* Right side - Visual Design */}
      <div className="hidden lg:flex items-center justify-center gradient-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-md-sys-color-primary/20 via-md-sys-color-secondary/20 to-md-sys-color-tertiary/20"></div>
        
        {/* Floating Cards Animation */}
        <div className="relative z-10 max-w-lg">
          <div className="space-y-6">
            {/* Feature Card 1 */}
            <Card className="surface-elevation-3 border-0 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-md-sys-color-on-surface">
                      AI Campaign Generation
                    </h3>
                    <p className="text-sm text-md-sys-color-on-surface-variant">
                      Create stunning visuals instantly
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="surface-elevation-3 border-0 transform -rotate-2 hover:rotate-0 transition-transform duration-500 ml-8">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-md-sys-color-on-surface">
                      Smart Catalog Builder
                    </h3>
                    <p className="text-sm text-md-sys-color-on-surface-variant">
                      Enhance products automatically
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="surface-elevation-3 border-0 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-md-sys-color-on-surface">
                      Performance Analytics
                    </h3>
                    <p className="text-sm text-md-sys-color-on-surface-variant">
                      Track and optimize results
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-md-sys-color-primary/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-md-sys-color-tertiary/20 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
}