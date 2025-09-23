import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/image-upload";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Star, Heart, Share2, Plus, Monitor, Tablet, Smartphone, RefreshCw } from "lucide-react";
import { type CatalogProduct } from "@shared/schema";

interface ProductFormData {
  name: string;
  price: string;
  category: string;
  description: string;
  seoTitle: string;
  seoKeywords: string;
}

const CATEGORIES = [
  "Electronics",
  "Computers", 
  "Accessories",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors"
];

export default function CatalogGenerator() {
  const { toast } = useToast();
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    category: "",
    description: "",
    seoTitle: "",
    seoKeywords: ""
  });

  // Product enrichment mutation
  const enrichProductMutation = useMutation({
    mutationFn: async ({ file, productName, category }: { file: File; productName: string; category: string }) => {
      const formDataObj = new FormData();
      formDataObj.append('image', file);
      formDataObj.append('productName', productName);
      formDataObj.append('category', category);
      
      const response = await apiRequest('POST', '/api/enrich-product', formDataObj);
      return response.json();
    },
    onSuccess: (data) => {
      setFormData(prev => ({
        ...prev,
        name: data.title || prev.name,
        description: data.description || prev.description,
        seoTitle: data.seoTitle || prev.seoTitle,
        seoKeywords: data.seoKeywords?.join(', ') || prev.seoKeywords
      }));
      toast({
        title: "Product enriched successfully!",
        description: "AI has generated optimized content for your product.",
      });
    },
    onError: (error) => {
      toast({
        title: "Enrichment failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleImageUpload = (file: File, preview: string) => {
    if (file && preview) {
      setUploadedImage({ file, preview });
    } else {
      setUploadedImage(null);
    }
  };

  const handleEnrichProduct = () => {
    if (!uploadedImage?.file || !formData.name || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please upload an image and provide product name and category.",
        variant: "destructive",
      });
      return;
    }

    enrichProductMutation.mutate({
      file: uploadedImage.file,
      productName: formData.name,
      category: formData.category
    });
  };

  const getPreviewWidth = () => {
    switch(previewMode) {
      case 'desktop': return 'w-full';
      case 'tablet': return 'w-96 mx-auto';
      case 'mobile': return 'w-80 mx-auto';
      default: return 'w-full';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-accent/5">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <Card className="shadow-lg border border-outline-variant mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-on-surface">E-Commerce Catalog Builder</h2>
                <p className="text-on-surface-variant">AI-powered product descriptions and SEO optimization</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="border-outline-variant">
                  Save Draft
                </Button>
                <Button className="bg-accent text-on-surface hover:shadow-lg">
                  Export Catalog
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Product Editor */}
          <div className="space-y-6">
            <Card className="shadow-lg border border-outline-variant">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-on-surface mb-6">Product Information</h3>
                
                {/* Product Image */}
                <div className="mb-6">
                  <Label className="text-sm font-medium text-on-surface mb-2 block">Product Image</Label>
                  <ImageUpload 
                    onImageUpload={handleImageUpload}
                    preview={uploadedImage?.preview}
                  />
                </div>

                {/* Product Details Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="product-name" className="text-sm font-medium text-on-surface">Product Name</Label>
                    <Input
                      id="product-name"
                      placeholder="Enter product name..."
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price" className="text-sm font-medium text-on-surface">Price</Label>
                      <Input
                        id="price"
                        placeholder="$0.00"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-on-surface">Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-on-surface">AI-Generated Description</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEnrichProduct}
                        disabled={enrichProductMutation.isPending || !uploadedImage?.file || !formData.name || !formData.category}
                      >
                        {enrichProductMutation.isPending ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3 h-3" />
                        )}
                        <span className="ml-1">Enrich</span>
                      </Button>
                    </div>
                    <Textarea
                      rows={6}
                      placeholder="Product description will be generated here..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-on-surface-variant">
                        Characters: {formData.description.length}/500
                      </span>
                    </div>
                  </div>

                  {/* SEO Fields */}
                  <div className="border-t border-outline-variant pt-4">
                    <h4 className="font-semibold text-on-surface mb-3">SEO Optimization</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-on-surface">Meta Title</Label>
                        <Input
                          placeholder="SEO-optimized title..."
                          value={formData.seoTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                          className="mt-1"
                        />
                        <span className="text-xs text-on-surface-variant">
                          {formData.seoTitle.length}/60 characters
                        </span>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-on-surface">Keywords</Label>
                        <Input
                          placeholder="keyword1, keyword2, keyword3..."
                          value={formData.seoKeywords}
                          onChange={(e) => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card className="shadow-lg border border-outline-variant">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-on-surface">E-Commerce Preview</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={previewMode === 'tablet' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('tablet')}
                    >
                      <Tablet className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={previewMode === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Product Preview */}
                <div className={`border border-outline-variant rounded-xl p-6 bg-surface/30 ${getPreviewWidth()}`}>
                  {uploadedImage?.preview ? (
                    <img 
                      src={uploadedImage.preview} 
                      alt="Product preview"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center text-on-surface-variant">
                      Upload product image
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-on-surface">
                      {formData.name || "Product Name"}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">
                        {formData.price || "$0.00"}
                      </span>
                      <span className="text-sm text-on-surface-variant line-through">
                        {formData.price && `$${(parseFloat(formData.price.replace('$', '')) * 1.25).toFixed(2)}`}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        20% OFF
                      </Badge>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-2">
                      <div className="flex text-accent">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-on-surface-variant">(247 reviews)</span>
                    </div>

                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {formData.description || "Product description will appear here..."}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <Button className="flex-1 bg-primary text-white hover:shadow-lg">
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* SEO Preview */}
                <div className="mt-6 p-4 bg-surface rounded-xl border border-outline-variant">
                  <h5 className="text-sm font-semibold text-on-surface mb-2">Google Search Preview</h5>
                  <div className="space-y-1">
                    <div className="text-sm text-primary hover:underline cursor-pointer">
                      {formData.seoTitle || "SEO title will appear here"}
                    </div>
                    <div className="text-xs text-green-600">
                      www.yourstore.com › products › {formData.name.toLowerCase().replace(/\s+/g, '-') || 'product-name'}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {formData.description.substring(0, 160) || "Product description preview..."}
                      {formData.description.length > 160 && '...'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Products Grid */}
            <Card className="shadow-lg border border-outline-variant">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-on-surface">Catalog Overview</h3>
                  <Button className="flex items-center space-x-2 bg-accent text-on-surface hover:shadow-md">
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: '40px', marginBottom: '56px' }}>
                  {/* Mock products for demonstration */}
                  {[
                    { name: "Wireless Mouse Pro", description: "Ergonomic design", price: "$79", category: "Accessories" },
                    { name: "4K Monitor", description: "Ultra HD display", price: "$459", category: "Electronics" },
                    { name: "Mechanical Keyboard", description: "Tactile switches", price: "$149", category: "Accessories" },
                  ].map((product, index) => (
                    <Card key={index} className="border border-outline-variant hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="w-full h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-3" />
                        <h4 className="font-semibold text-on-surface text-sm mb-1">{product.name}</h4>
                        <p className="text-xs text-on-surface-variant mb-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-primary">{product.price}</span>
                          <Badge variant="outline" className="text-xs">{product.category}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
