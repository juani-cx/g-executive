import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TopNavigation from "@/components/TopNavigation";
import { useLocation } from "wouter";

export default function Canvas() {
  const [, navigate] = useLocation();

  return (
    <div className="dotted-background overflow-hidden" style={{ 
      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      height: '100vh'
    }}>
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Main Content */}
      <div className="flex items-start justify-center p-4 sm:p-8 overflow-y-auto pt-16" style={{ height: 'calc(100vh - 120px)', minHeight: 'auto', marginTop: '-80px' }}>
        <div className="w-full max-w-6xl text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-6xl text-gray-800 mb-4 tracking-tight"
              style={{ fontWeight: '475' }}
              data-testid="text-main-title"
            >
              Canvas
            </h1>
            <p 
              className="text-2xl text-gray-600 mb-16"
              style={{ fontWeight: '400' }}
            >
              Create and edit your campaign assets
            </p>
          </div>

          {/* Content Area */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-lg">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-4xl">🎨</div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Canvas Workspace</h3>
                <p className="text-gray-600 mb-8">Your AI-powered campaign creation workspace</p>
                
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/configure')}
                    className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-6 py-2 rounded-full"
                    data-testid="button-configure"
                  >
                    Configure Campaign
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="text-gray-600 border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-full"
                    data-testid="button-back-home"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}