import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { CanvasCard, CardType } from "@/types/canvas";

interface StructuredContentEditorProps {
  card: CanvasCard;
  onSave?: (content: any) => void;
}

interface ContentSection {
  id: string;
  type: string;
  title: string;
  content: string;
}

const getDefaultSections = (cardType: CardType): ContentSection[] => {
  switch (cardType) {
    case "landing":
      return [
        { id: "hero", type: "hero", title: "Hero Section", content: "Compelling headline with value prop" },
        { id: "features", type: "features", title: "Features", content: "3-column benefits layout" },
        { id: "cta", type: "cta", title: "Call to Action", content: "Get Started Free button with social proof" }
      ];
    case "slides":
      return [
        { id: "slide1", type: "slide", title: "Slide 1", content: "Campaign Title — Unlock Savings" },
        { id: "slide2", type: "slide", title: "Slide 2", content: "Pain Points → Value" },
        { id: "slide3", type: "slide", title: "Slide 3", content: "Proof" }
      ];
    case "instagram":
      return [
        { id: "copy", type: "copy", title: "Copy Text", content: "Visual: Product showcase with lifestyle background" },
        { id: "image", type: "image", title: "Image Description", content: "Text Overlay: Limited time offer with countdown timer" }
      ];
    case "linkedin":
      return [
        { id: "hook", type: "hook", title: "Hook", content: "3 lessons from our product launch" },
        { id: "body", type: "body", title: "Body", content: "Bullet points with insights" },
        { id: "cta", type: "cta", title: "Call to Action", content: "What's your experience with launches?" }
      ];
    default:
      return [
        { id: "content", type: "content", title: "Content", content: "Content goes here" }
      ];
  }
};

export default function StructuredContentEditor({ card, onSave }: StructuredContentEditorProps) {
  const [sections, setSections] = useState<ContentSection[]>(() => getDefaultSections(card.type));
  const [title, setTitle] = useState(card.title);

  const updateSection = (id: string, field: 'title' | 'content', value: string) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const addSection = () => {
    const newSection: ContentSection = {
      id: `section_${Date.now()}`,
      type: card.type === "slides" ? "slide" : "section",
      title: card.type === "slides" ? `Slide ${sections.length + 1}` : `Section ${sections.length + 1}`,
      content: ""
    };
    setSections(prev => [...prev, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    setSections(prev => {
      const index = prev.findIndex(section => section.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newSections = [...prev];
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
      return newSections;
    });
  };

  const handleSave = () => {
    const structuredContent = {
      title,
      sections,
      summary: sections.map(s => `**${s.title}:** ${s.content}`).join(' | ')
    };
    onSave?.(structuredContent);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Title</label>
        <Input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white border-gray-300 text-gray-900"
        />
      </div>

      {/* Content Sections */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Content Sections</label>
          <Button 
            onClick={addSection}
            size="sm"
            variant="outline"
            className="h-8 px-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add {card.type === "slides" ? "Slide" : "Section"}
          </Button>
        </div>

        {sections.map((section, index) => (
          <Card key={section.id} className="p-4 bg-gray-50 border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Input
                  value={section.title}
                  onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                  className="flex-1 mr-2 bg-white border-gray-300 text-gray-900 font-medium"
                  placeholder="Section title..."
                />
                <div className="flex items-center space-x-1">
                  <Button
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={index === 0}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <MoveUp className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={index === sections.length - 1}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <MoveDown className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => removeSection(section.id)}
                    disabled={sections.length === 1}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={section.content}
                onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                className="bg-white border-gray-300 text-gray-900 min-h-[80px]"
                placeholder={
                  card.type === "landing" && section.type === "hero" ? "Enter compelling headline and value proposition..." :
                  card.type === "landing" && section.type === "features" ? "Describe key features and benefits..." :
                  card.type === "landing" && section.type === "cta" ? "Write call-to-action text..." :
                  card.type === "instagram" && section.type === "copy" ? "Enter post copy text..." :
                  card.type === "instagram" && section.type === "image" ? "Describe the image/visual content..." :
                  card.type === "linkedin" && section.type === "hook" ? "Write an engaging opening hook..." :
                  card.type === "linkedin" && section.type === "body" ? "Add main content with insights..." :
                  card.type === "slides" ? "Enter slide content..." :
                  "Enter section content..."
                }
                rows={3}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex space-x-2 pt-4">
        <Button 
          onClick={handleSave}
          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}