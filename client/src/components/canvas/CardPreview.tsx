import { CanvasCard } from "@/types/canvas";
import { Instagram, Twitter, Facebook, Mail, FileText, Youtube, Newspaper, Globe, FileImage, Sparkles } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CardPreviewProps {
  card: CanvasCard;
}

export default function CardPreview({ card }: CardPreviewProps) {
  const [hoveredInput, setHoveredInput] = useState<string | null>(null);
  const [editableContent, setEditableContent] = useState({
    title: card.title || "",
    introduction: "Hook: The power of first impressions in marketing.",
    outline1: "Understanding Marketing Assets",
    outline2: "Identifying Your Target Audience", 
    outline3: "Creating Compelling Visual Content",
    outline4: "Measuring Success",
    wordCount: "1200",
    readTime: "5",
    images: "3"
  });
  
  const handleContentChange = (field: string, value: string) => {
    setEditableContent(prev => ({...prev, [field]: value}));
  };
  
  const handleAISuggestion = (field: string) => {
    // AI suggestion logic here
    console.log(`AI suggestion for ${field}`);
  };
  
  const EditableInput = ({ field, value, placeholder, multiline = false, label }: { field: string, value: string, placeholder: string, multiline?: boolean, label: string }) => (
    <div className="relative group">
      <label className="text-xs font-medium text-gray-700 mb-1 block">{label}</label>
      <div 
        className="relative"
        onMouseEnter={() => setHoveredInput(field)}
        onMouseLeave={() => setHoveredInput(null)}
      >
        {multiline ? (
          <Textarea
            value={value}
            onChange={(e) => handleContentChange(field, e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[60px] text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => handleContentChange(field, e.target.value)}
            placeholder={placeholder}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        )}
        {hoveredInput === field && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleAISuggestion(field)}
          >
            <Sparkles className="w-3 h-3 text-violet-600" />
          </Button>
        )}
      </div>
    </div>
  );
  
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
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Title Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <EditableInput 
                field="title"
                value={editableContent.title}
                placeholder="Blog Post Title..."
                label="Blog Post Title"
              />
            </div>
            
            {/* Introduction Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <EditableInput 
                field="introduction"
                value={editableContent.introduction}
                placeholder="Write your introduction hook..."
                multiline
                label="Introduction"
              />
            </div>
            
            {/* Content Outline */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Content Outline</h4>
              <div className="space-y-3">
                <EditableInput 
                  field="outline1"
                  value={editableContent.outline1}
                  placeholder="Section 1..."
                  label="1."
                />
                <EditableInput 
                  field="outline2"
                  value={editableContent.outline2}
                  placeholder="Section 2..."
                  label="2."
                />
                <EditableInput 
                  field="outline3"
                  value={editableContent.outline3}
                  placeholder="Section 3..."
                  label="3."
                />
                <EditableInput 
                  field="outline4"
                  value={editableContent.outline4}
                  placeholder="Section 4..."
                  label="4."
                />
              </div>
            </div>
            
            {/* Metrics Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Content Metrics</h4>
              <div className="grid grid-cols-3 gap-4">
                <EditableInput 
                  field="wordCount"
                  value={editableContent.wordCount}
                  placeholder="1200"
                  label="Word Count"
                />
                <EditableInput 
                  field="readTime"
                  value={editableContent.readTime}
                  placeholder="5"
                  label="Read Time (min)"
                />
                <EditableInput 
                  field="images"
                  value={editableContent.images}
                  placeholder="3"
                  label="Images"
                />
              </div>
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