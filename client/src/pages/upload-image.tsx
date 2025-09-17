import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";

export default function UploadImage() {
  const [, navigate] = useLocation();
  const [uploadMode, setUploadMode] = useState<'qr' | 'computer'>('qr');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the uploaded file and navigate to configure page
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        localStorage.setItem('uploadedImage', imageData);
        localStorage.setItem('uploadedFileName', file.name);
        navigate('/configure');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // For demo purposes, simulate camera capture
    console.log('Camera capture would be implemented here');
    // In real implementation, this would open camera modal
  };

  return (
    <div className="h-screen max-h-screen dotted-background overflow-hidden">
      {/* Header */}
      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-center gap-4">
          <img src="/Google_logo.svg" alt="Google" className="h-10" />
        </div>
      </div>

      <div className="absolute top-8 right-8 z-10">
        <Button 
          variant="outline" 
          className="text-gray-600 border-gray-300 hover:bg-gray-50"
          onClick={() => navigate('/homepage')}
          data-testid="button-back-to-home"
        >
          Back to home
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-screen max-h-screen p-8">
        <div className="text-center w-full max-w-2xl">
          <h1 className="text-6xl text-gray-800 mb-4 tracking-tight" style={{ fontWeight: '475' }}>
            Upload your image
          </h1>
          
          <p className="text-2xl text-gray-600 mb-16" style={{ fontWeight: '400' }}>
            Executive campaign AI builder for executive people
          </p>

          {uploadMode === 'qr' ? (
            <div className="mb-12">
              {/* QR Code Area */}
              <div className="w-80 h-80 mx-auto bg-[#4285F4] rounded-3xl flex items-center justify-center mb-8">
                {/* QR Code Pattern */}
                <svg width="200" height="200" viewBox="0 0 200 200" className="text-white">
                  <rect x="0" y="0" width="30" height="30" fill="currentColor"/>
                  <rect x="10" y="10" width="10" height="10" fill="transparent"/>
                  <rect x="170" y="0" width="30" height="30" fill="currentColor"/>
                  <rect x="180" y="10" width="10" height="10" fill="transparent"/>
                  <rect x="0" y="170" width="30" height="30" fill="currentColor"/>
                  <rect x="10" y="180" width="10" height="10" fill="transparent"/>
                  
                  {/* QR Pattern squares */}
                  <rect x="40" y="0" width="10" height="10" fill="currentColor"/>
                  <rect x="60" y="0" width="10" height="10" fill="currentColor"/>
                  <rect x="80" y="0" width="10" height="10" fill="currentColor"/>
                  <rect x="120" y="0" width="10" height="10" fill="currentColor"/>
                  <rect x="140" y="0" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="0" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="20" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="40" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="60" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="120" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="160" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="180" y="40" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="20" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="60" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="80" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="140" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="180" y="60" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="40" y="80" width="10" height="10" fill="currentColor"/>
                  <rect x="80" y="80" width="10" height="10" fill="currentColor"/>
                  <rect x="120" y="80" width="10" height="10" fill="currentColor"/>
                  <rect x="160" y="80" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="0" y="100" width="10" height="10" fill="currentColor"/>
                  <rect x="40" y="100" width="10" height="10" fill="currentColor"/>
                  <rect x="60" y="100" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="100" width="10" height="10" fill="currentColor"/>
                  <rect x="140" y="100" width="10" height="10" fill="currentColor"/>
                  <rect x="180" y="100" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="20" y="120" width="10" height="10" fill="currentColor"/>
                  <rect x="60" y="120" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="120" width="10" height="10" fill="currentColor"/>
                  <rect x="120" y="120" width="10" height="10" fill="currentColor"/>
                  <rect x="160" y="120" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="0" y="140" width="10" height="10" fill="currentColor"/>
                  <rect x="40" y="140" width="10" height="10" fill="currentColor"/>
                  <rect x="80" y="140" width="10" height="10" fill="currentColor"/>
                  <rect x="120" y="140" width="10" height="10" fill="currentColor"/>
                  <rect x="160" y="140" width="10" height="10" fill="currentColor"/>
                  <rect x="190" y="140" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="40" y="160" width="10" height="10" fill="currentColor"/>
                  <rect x="60" y="160" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="160" width="10" height="10" fill="currentColor"/>
                  <rect x="140" y="160" width="10" height="10" fill="currentColor"/>
                  <rect x="180" y="160" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="40" y="180" width="10" height="10" fill="currentColor"/>
                  <rect x="80" y="180" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="180" width="10" height="10" fill="currentColor"/>
                  <rect x="140" y="180" width="10" height="10" fill="currentColor"/>
                  <rect x="180" y="180" width="10" height="10" fill="currentColor"/>
                  <rect x="190" y="180" width="10" height="10" fill="currentColor"/>
                </svg>
              </div>
              
              <h2 className="text-3xl text-gray-800 mb-4" style={{ fontWeight: '475' }}>
                Scan this code<br />to upload your image
              </h2>
              
              <p className="text-lg text-gray-600" style={{ fontWeight: '400' }}>
                Scan the QR code to visit our<br />upload service
              </p>
            </div>
          ) : (
            <div className="mb-12">
              <div className="w-80 h-80 mx-auto border-2 border-dashed border-gray-300 rounded-3xl flex items-center justify-center mb-8">
                <div className="text-center">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">Click to upload or drag and drop</p>
                </div>
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                data-testid="input-file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-block bg-[#4285F4] hover:bg-[#3367D6] text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors"
                data-testid="button-choose-file"
              >
                Choose File
              </label>
            </div>
          )}

          {/* Bottom buttons */}
          <div className="flex items-center justify-center gap-8">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setUploadMode(uploadMode === 'qr' ? 'computer' : 'qr')}
              className="w-16 h-16 rounded-full bg-gray-100 hover:bg-gray-200 p-0"
              data-testid="button-toggle-upload"
            >
              <Upload className="w-8 h-8 text-gray-600" />
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={handleCameraCapture}
              className="w-16 h-16 rounded-full bg-gray-100 hover:bg-gray-200 p-0"
              data-testid="button-camera-capture"
            >
              <Camera className="w-8 h-8 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}