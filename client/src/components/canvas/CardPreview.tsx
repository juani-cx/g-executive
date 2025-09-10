import { CanvasCard } from "@/types/canvas";
import { Instagram, Twitter, Facebook, Mail, FileText, Youtube, Newspaper, Globe, FileImage } from "lucide-react";

interface CardPreviewProps {
  card: CanvasCard;
}

export default function CardPreview({ card }: CardPreviewProps) {
  const getPreviewContent = () => {
    const content = (card as any).content?.text || card.summary || "Generated content will appear here";
    
    switch (card.type) {
      case "instagram":
        return (
          <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* Instagram Header */}
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">B</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">yourbrand</p>
                <p className="text-xs text-gray-500">Sponsored</p>
              </div>
            </div>
            
            {/* Instagram Image */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <img 
                src={card.thumbnailUrl || "/api/placeholder/400/400"} 
                alt="Instagram post"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Instagram Content */}
            <div className="px-4 py-3">
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex space-x-3">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                </div>
              </div>
              <p className="text-sm text-gray-900 line-clamp-3">
                <span className="font-semibold">yourbrand</span> {content.substring(0, 100)}...
              </p>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
            </div>
          </div>
        );
        
      case "linkedin":
        return (
          <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* LinkedIn Header */}
            <div className="flex items-center px-4 py-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">YB</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">Your Brand</p>
                <p className="text-xs text-gray-500">Company • 1st</p>
                <p className="text-xs text-gray-500">2h • 🌐</p>
              </div>
            </div>
            
            {/* LinkedIn Content */}
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-900 mb-3">{content}</p>
              {card.thumbnailUrl && (
                <img 
                  src={card.thumbnailUrl} 
                  alt="LinkedIn post image"
                  className="w-full h-48 object-cover rounded border border-gray-200"
                />
              )}
            </div>
          </div>
        );
        
      case "facebook" as any:
        return (
          <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* Facebook Header */}
            <div className="flex items-center px-4 py-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">YB</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">Your Brand</p>
                <p className="text-xs text-gray-500">2 hrs • 🌐</p>
              </div>
            </div>
            
            {/* Facebook Content */}
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-900 mb-3">{content}</p>
              {card.thumbnailUrl && (
                <img 
                  src={card.thumbnailUrl} 
                  alt="Facebook post image"
                  className="w-full h-64 object-cover rounded border border-gray-200"
                />
              )}
            </div>
          </div>
        );
        
      case "twitter" as any:
        return (
          <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* Twitter Header */}
            <div className="flex items-start px-4 py-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600 font-bold">YB</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-sm text-gray-900">Your Brand</span>
                  <span className="text-gray-500 text-sm">@yourbrand</span>
                  <span className="text-gray-500 text-sm">·</span>
                  <span className="text-gray-500 text-sm">2h</span>
                </div>
                <p className="text-sm text-gray-900 mt-1">{content}</p>
                {card.thumbnailUrl && (
                  <img 
                    src={card.thumbnailUrl} 
                    alt="Tweet image"
                    className="w-full h-48 object-cover rounded-lg mt-3 border border-gray-200"
                  />
                )}
              </div>
            </div>
          </div>
        );
        
      case "email" as any:
        return (
          <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* Email Header */}
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>From: your-brand@company.com</span>
                <span>2 hours ago</span>
              </div>
              <h3 className="font-semibold text-sm text-gray-900 mt-1">
                {card.title}
              </h3>
            </div>
            
            {/* Email Content */}
            <div className="px-4 py-4">
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
              </div>
            </div>
          </div>
        );
        
      case "ads" as any:
        return (
          <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="text-xs text-gray-500 px-3 py-1 bg-gray-50 border-b">Sponsored</div>
            {card.thumbnailUrl && (
              <img 
                src={card.thumbnailUrl} 
                alt="Ad image"
                className="w-full h-40 object-cover"
              />
            )}
            <div className="px-3 py-3">
              <h4 className="font-semibold text-sm text-gray-900 mb-1">{card.title}</h4>
              <p className="text-xs text-gray-600 mb-2">{content.substring(0, 80)}...</p>
              <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded font-medium">
                Learn More
              </button>
            </div>
          </div>
        );
        
      case "landing":
        return (
          <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {card.thumbnailUrl && (
              <img 
                src={card.thumbnailUrl} 
                alt="Landing page hero"
                className="w-full h-32 object-cover"
              />
            )}
            <div className="px-4 py-4 text-center">
              <h2 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h2>
              <p className="text-sm text-gray-600 mb-4">{content.substring(0, 120)}...</p>
              <button className="bg-violet-600 text-white px-4 py-2 rounded-lg font-medium">
                Get Started
              </button>
            </div>
          </div>
        );
        
      case "slides":
        return (
          <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-video bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center p-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h2>
                <p className="text-sm text-gray-600">{content.substring(0, 100)}...</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-gray-50 flex items-center justify-center">
              <div className="flex space-x-1">
                {[1,2,3].map(i => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-violet-600' : 'bg-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-4 py-6 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600">{content}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <FileImage className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Preview</span>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        {getPreviewContent()}
      </div>
    </div>
  );
}