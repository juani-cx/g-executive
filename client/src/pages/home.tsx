import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageUpload from "@/components/image-upload";
import { useState } from "react";
import { Construction, Package, CheckCircle, Upload } from "lucide-react";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleImageUpload = (file: File, preview: string) => {
    if (file && preview) {
      setUploadedImage({ file, preview });
    } else {
      setUploadedImage(null);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl lg:text-6xl font-bold text-on-surface mb-6 leading-tight">
            Transform Ideas into{" "}
            <span className="text-primary">AI-Powered</span>
            <br />
            Marketing Campaigns
          </h1>
          <p className="text-xl text-on-surface-variant max-w-3xl mx-auto mb-8 leading-relaxed">
            Upload an image, choose your brand tone, and watch our AI generate comprehensive marketing campaigns 
            and e-commerce catalogs in seconds. Built for executives who demand excellence.
          </p>
          
          {/* Demo Stats */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-on-surface-variant">Faster Creation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">10+</div>
              <div className="text-sm text-on-surface-variant">Asset Formats</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">∞</div>
              <div className="text-sm text-on-surface-variant">Possibilities</div>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        {showImageUpload && (
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="shadow-2xl border border-outline-variant">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-on-surface mb-4">Upload Your Inspiration</h2>
                  <p className="text-on-surface-variant">Start with an image that captures your vision. Our AI will transform it into something amazing.</p>
                </div>

                <ImageUpload 
                  onImageUpload={handleImageUpload}
                  preview={uploadedImage?.preview}
                  className="mb-8"
                />

                {uploadedImage && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/campaign-generator">
                      <Button className="w-full flex items-center justify-center space-x-3 p-4 border border-outline-variant rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all">
                        <Construction className="text-secondary w-5 h-5" />
                        <span className="font-medium">Campaign Generator</span>
                      </Button>
                    </Link>
                    <Link href="/catalog-generator">
                      <Button className="w-full flex items-center justify-center space-x-3 p-4 border border-outline-variant rounded-xl hover:border-accent hover:bg-accent/10 transition-all">
                        <Package className="text-accent w-5 h-5" />
                        <span className="font-medium">Catalog Generator</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Path Selection Cards */}
        {!showImageUpload && (
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {/* Campaign Generator Card */}
            <Card className="group relative shadow-xl hover:shadow-2xl transition-all duration-300 border border-outline-variant hover:border-primary/30 cursor-pointer animate-slide-up">
              <CardContent className="p-8">
                <div className="w-full h-48 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl mb-6 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  <Construction className="text-secondary w-16 h-16" />
                </div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Construction className="text-secondary w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-on-surface">Campaign Generator</h3>
                </div>
                
                <p className="text-on-surface-variant mb-6 leading-relaxed">
                  Turn a single inspiration image into complete multi-channel marketing campaigns. 
                  Generate social media content, ad copy, and branded assets for TikTok, Instagram, and more.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-primary w-4 h-4" />
                    <span className="text-sm text-on-surface-variant">Multi-platform asset generation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-primary w-4 h-4" />
                    <span className="text-sm text-on-surface-variant">Brand-aligned copy and visuals</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-primary w-4 h-4" />
                    <span className="text-sm text-on-surface-variant">Downloadable assets (Images, PDFs, GIFs)</span>
                  </div>
                </div>
                
                <Link href="/campaign-generator">
                  <Button className="w-full bg-secondary text-white py-4 rounded-2xl font-semibold hover:bg-secondary/90 transition-colors group-hover:shadow-lg">
                    Start Campaign Generator
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Catalog Generator Card */}
            <Card className="group relative shadow-xl hover:shadow-2xl transition-all duration-300 border border-outline-variant hover:border-primary/30 cursor-pointer animate-slide-up">
              <CardContent className="p-8">
                <div className="w-full h-48 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl mb-6 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  <Package className="text-accent w-16 h-16" />
                </div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <Package className="text-accent w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-on-surface">Catalog Generator</h3>
                </div>
                
                <p className="text-on-surface-variant mb-6 leading-relaxed">
                  Enrich your product catalogs with AI-generated descriptions, SEO metadata, and optimized content. 
                  Perfect for e-commerce platforms and product showcases.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-primary w-4 h-4" />
                    <span className="text-sm text-on-surface-variant">SEO-optimized product descriptions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-primary w-4 h-4" />
                    <span className="text-sm text-on-surface-variant">Interactive metadata editing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-primary w-4 h-4" />
                    <span className="text-sm text-on-surface-variant">Live e-commerce preview</span>
                  </div>
                </div>
                
                <Link href="/catalog-generator">
                  <Button className="w-full bg-accent text-on-surface py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors group-hover:shadow-lg">
                    Start Catalog Generator
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alternative Image-First Flow */}
        {!showImageUpload && (
          <div className="text-center">
            <p className="text-on-surface-variant mb-6">Or start with your inspiration image first</p>
            <Button 
              onClick={() => setShowImageUpload(true)}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Image & Choose Path</span>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
