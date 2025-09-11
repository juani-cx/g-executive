import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || process.env.API_KEY || "default_key" });

export interface CampaignGenerationRequest {
  imageBase64: string;
  brandTone: string;
  targetPlatforms: string[];
  campaignFocus: string;
}

export interface CampaignAssets {
  socialMediaPosts: Array<{
    platform: string;
    caption: string;
    hashtags: string[];
    dimensions: string;
  }>;
  adCopy: Array<{
    platform: string;
    headline: string;
    body: string;
    cta: string;
  }>;
  emailCampaign: {
    subject: string;
    content: string;
    preheader: string;
  };
  linkedinArticle: {
    title: string;
    content: string;
    summary: string;
  };
}

export interface ProductEnrichment {
  title: string;
  description: string;
  seoTitle: string;
  seoKeywords: string[];
  seoDescription: string;
  features: string[];
  benefits: string[];
}

export async function analyzeImageForCampaign(base64Image: string): Promise<{
  description: string;
  suggestedTones: string[];
  visualElements: string[];
  quotaExceeded?: boolean;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert marketing analyst. Analyze images and provide insights for campaign creation. Respond with JSON in this format: { 'description': string, 'suggestedTones': string[], 'visualElements': string[] }",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image for marketing campaign potential. Describe what you see, suggest appropriate brand tones, and identify key visual elements that could be leveraged in a campaign."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      description: result.description || "Unable to analyze image",
      suggestedTones: result.suggestedTones || [],
      visualElements: result.visualElements || [],
    };
  } catch (error) {
    // Check if it's a quota/billing error
    if ((error as any).status === 429 || (error as Error).message?.includes('quota') || (error as Error).message?.includes('billing') || (error as Error).message?.includes('429')) {
      return {
        description: "Image uploaded successfully. AI analysis temporarily unavailable due to API quota limits.",
        suggestedTones: ["Professional & Trustworthy", "Innovative & Bold", "Friendly & Approachable"],
        visualElements: ["Image uploaded and ready for campaign creation"]
      };
    }
    throw new Error("Failed to analyze image: " + (error as Error).message);
  }
}

export async function generateCampaignAssets(request: CampaignGenerationRequest): Promise<any[]> {
  try {
    console.log('Starting campaign asset generation for platforms:', request.targetPlatforms);
    
    // Skip the prompt generation step for now and go directly to image generation
    // to avoid the base64 validation issue in the first API call
    const platformDimensions: Record<string, string> = {
      'Instagram': '1080x1080',
      'Facebook': '1200x630', 
      'Twitter': '1200x675',
      'LinkedIn': '1200x627',
      'TikTok': '1080x1920',
      'YouTube': '1280x720'
    };

    const imagePrompts = request.targetPlatforms.map(platform => ({
      platform,
      prompt: `Create a professional ${request.brandTone.toLowerCase()} marketing image for ${platform} focusing on ${request.campaignFocus.toLowerCase()}. Modern, clean design with compelling visuals and marketing appeal. High quality, professional composition.`,
      dimensions: platformDimensions[platform] || '1024x1024'
    }));

    // Generate actual images using DALL-E
    const generatedAssets = [];
    console.log(`Starting DALL-E generation for ${imagePrompts.length} prompts`);
    
    for (const promptData of imagePrompts) {
      console.log(`Generating image for ${promptData.platform} with prompt: ${promptData.prompt?.substring(0, 100)}...`);
      try {
        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: promptData.prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        });

        console.log(`Image generated successfully for ${promptData.platform}:`, imageResponse.data?.[0]?.url);
        if (imageResponse.data?.[0]?.url) {
          generatedAssets.push({
            type: 'image',
            platform: promptData.platform,
            title: `${promptData.platform} Campaign Visual`,
            url: imageResponse.data[0].url,
            content: promptData.prompt,
            dimensions: promptData.dimensions || '1024x1024'
          });
        }
      } catch (imageError) {
        console.error(`Failed to generate image for ${promptData.platform}:`, imageError);
        // Add a fallback text asset if image generation fails
        generatedAssets.push({
          type: 'copy',
          platform: promptData.platform,
          title: `${promptData.platform} Campaign Content`,
          content: `${request.brandTone} campaign content for ${promptData.platform} focusing on ${request.campaignFocus}. Image generation error: ${(imageError as Error).message}`,
          dimensions: promptData.dimensions || '1024x1024'
        });
      }
    }
    
    console.log(`Generated ${generatedAssets.length} total assets, ${generatedAssets.filter(a => a.type === 'image').length} images`);
    
    // If no images were generated, ensure we have fallback prompts for direct generation
    if (generatedAssets.filter(a => a.type === 'image').length === 0) {
      console.log('No images generated via prompts, trying direct generation...');
      for (const platform of request.targetPlatforms) {
        try {
          const directPrompt = `Create a professional ${request.brandTone.toLowerCase()} marketing image for ${platform} focusing on ${request.campaignFocus.toLowerCase()}. Modern, clean design with compelling visuals.`;
          const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: directPrompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
          });

          if (imageResponse.data?.[0]?.url) {
            generatedAssets.push({
              type: 'image',
              platform: platform,
              title: `${platform} Campaign Visual`,
              url: imageResponse.data[0].url,
              content: directPrompt,
              dimensions: '1024x1024'
            });
            console.log(`Direct generation successful for ${platform}`);
          }
        } catch (error) {
          console.error(`Direct generation failed for ${platform}:`, error);
        }
      }
    }

    return generatedAssets;

  } catch (error) {
    console.error("Campaign asset generation error:", error);
    
    // Return fallback assets if generation fails
    const platformDimensions: Record<string, string> = {
      'Instagram': '1080x1080',
      'Facebook': '1200x630',
      'Twitter': '1200x675',
      'LinkedIn': '1200x627',
      'TikTok': '1080x1920',
      'YouTube': '1280x720'
    };

    return request.targetPlatforms.map(platform => ({
      type: 'copy',
      platform: platform,
      title: `${platform} Campaign`,
      content: `${request.brandTone} campaign content for ${platform} focusing on ${request.campaignFocus}. Visual assets will be generated.`,
      dimensions: platformDimensions[platform] || '1200x630'
    }));
  }
}

export async function enrichProductDescription(imageBase64: string, productName: string, category: string): Promise<ProductEnrichment> {
  try {
    const prompt = `Analyze this product image and create comprehensive e-commerce content:

Product Name: ${productName}
Category: ${category}

Generate product enrichment data in JSON format:
{
  "title": "SEO-optimized product title",
  "description": "Detailed product description (300-500 words)",
  "seoTitle": "SEO title (50-60 characters)",
  "seoKeywords": ["keyword1", "keyword2", "keyword3"],
  "seoDescription": "Meta description (150-160 characters)",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"]
}

Create professional, SEO-optimized content that would convert browsers into buyers. Focus on benefits, use persuasive language, and include relevant keywords naturally.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert e-commerce copywriter and SEO specialist. Create compelling product descriptions that drive sales."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as ProductEnrichment;
  } catch (error) {
    throw new Error("Failed to enrich product description: " + (error as Error).message);
  }
}

// Generate lightweight preview assets with visual concepts
export async function generatePreviewAssets(params: CampaignGenerationRequest): Promise<any[]> {
  try {
    const { imageBase64, brandTone, targetPlatforms, campaignFocus } = params;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a creative director. Generate visual campaign concepts based on the image. Respond with JSON: { "assets": [{ "type": "image", "platform": string, "title": string, "content": string, "imagePrompt": string, "dimensions": string }] }`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Create visual campaign concepts for these parameters:
              - Brand Tone: ${brandTone}
              - Target Platforms: ${targetPlatforms.join(', ')}
              - Campaign Focus: ${campaignFocus}
              
              For each platform, create an image concept with:
              - A brief description of the visual concept
              - A detailed DALL-E prompt for image generation
              - Appropriate dimensions for the platform`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    const previewAssets = result.assets || [];
    
    // Ensure we have visual concepts for each platform
    const platformDimensions: Record<string, string> = {
      'Instagram': '1080x1080',
      'Facebook': '1200x630',
      'Twitter': '1200x675',
      'LinkedIn': '1200x627',
      'TikTok': '1080x1920',
      'YouTube': '1280x720'
    };

    targetPlatforms.forEach(platform => {
      if (!previewAssets.find((asset: any) => asset.platform === platform)) {
        previewAssets.push({
          type: 'image',
          platform: platform,
          title: `${platform} Visual Campaign`,
          content: `${brandTone} visual concept for ${platform} focusing on ${campaignFocus}. Will generate high-quality images in final campaign.`,
          imagePrompt: `Create a ${brandTone} marketing image for ${platform}, focusing on ${campaignFocus}, professional quality, modern design`,
          dimensions: platformDimensions[platform] || '1200x630'
        });
      }
    });

    return previewAssets;
  } catch (error: any) {
    console.error("Preview generation error:", error);
    
    // Return fallback visual concepts
    const platformDimensions: Record<string, string> = {
      'Instagram': '1080x1080',
      'Facebook': '1200x630',
      'Twitter': '1200x675',
      'LinkedIn': '1200x627',
      'TikTok': '1080x1920',
      'YouTube': '1280x720'
    };

    return params.targetPlatforms.map(platform => ({
      type: 'image',
      platform: platform,
      title: `${platform} Visual Campaign`,
      content: `${params.brandTone} visual concept for ${platform} focusing on ${params.campaignFocus}. Preview concept ready for approval.`,
      imagePrompt: `Create a ${params.brandTone} marketing image for ${platform}, focusing on ${params.campaignFocus}`,
      dimensions: platformDimensions[platform] || '1200x630'
    }));
  }
}

export async function generateImage(prompt: string): Promise<{ url: string }> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return { url: response.data?.[0]?.url || "" };
  } catch (error) {
    throw new Error("Failed to generate image: " + (error as Error).message);
  }
}

export async function generateCampaignCoverImage(campaignName: string, brandTone: string, campaignFocus: string): Promise<{ url: string }> {
  console.log(`Generating campaign cover image for: ${campaignName}`);
  
  try {
    const imagePrompt = `Professional marketing campaign cover image for "${campaignName}". ${brandTone} brand tone, focusing on ${campaignFocus}. Modern, clean design, high-quality visual, suitable for campaign thumbnail. Professional composition, engaging visuals.`;
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return { url: response.data?.[0]?.url || "" };
  } catch (error) {
    console.error("Error generating campaign cover image:", error);
    throw new Error(`Failed to generate cover image for ${campaignName}: ${(error as Error).message}`);
  }
}

export async function generatePlatformSpecificContent(platform: string, campaignName: string, brandTone: string, campaignFocus: string): Promise<{ content: any; imageUrl?: string }> {
  console.log(`Generating ${platform} content for campaign: ${campaignName}`);
  
  try {
    let content: any = {};
    let shouldGenerateImage = false;
    let designPrompt = "";
    let imagePrompt = "";

    switch (platform.toLowerCase()) {
      case "linkedin":
        designPrompt = `Create professional LinkedIn post content for "${campaignName}" campaign. Brand tone: ${brandTone}. Focus: ${campaignFocus}. Include engaging copy, professional insights, and relevant hashtags. Format as JSON with: headline, body, hashtags array.`;
        imagePrompt = `Professional LinkedIn post image for "${campaignName}" with ${brandTone} tone, focusing on ${campaignFocus}. Business professional style, clean design, corporate branding.`;
        shouldGenerateImage = true;
        break;
      case "instagram":
        designPrompt = `Create Instagram post content for "${campaignName}" campaign. Brand tone: ${brandTone}. Focus: ${campaignFocus}. Include engaging caption, story elements, and trending hashtags. Format as JSON with: caption, hashtags array, story_concept.`;
        imagePrompt = `Instagram post image for "${campaignName}" with ${brandTone} aesthetic, focusing on ${campaignFocus}. Social media optimized, visually appealing, engaging composition.`;
        shouldGenerateImage = true;
        break;
      case "email":
        designPrompt = `Create email campaign content for "${campaignName}". Brand tone: ${brandTone}. Focus: ${campaignFocus}. Include subject line, preheader, header, body content, and call-to-action. Format as JSON with: subject, preheader, header, body, cta.`;
        break;
      case "landing":
      case "landing page":
      case "website":
        designPrompt = `Create landing page content for "${campaignName}" campaign. Brand tone: ${brandTone}. Focus: ${campaignFocus}. Include headline, subheadline, key benefits, features, and call-to-action. Format as JSON with: headline, subheadline, benefits array, cta.`;
        imagePrompt = `Landing page hero image for "${campaignName}" with ${brandTone} design, focusing on ${campaignFocus}. Web optimized, professional, conversion-focused visual.`;
        shouldGenerateImage = true;
        break;
      case "facebook":
        designPrompt = `Create Facebook post content for "${campaignName}" campaign. Brand tone: ${brandTone}. Focus: ${campaignFocus}. Include engaging copy and call-to-action. Format as JSON with: text, cta, engagement_hook.`;
        imagePrompt = `Facebook post image for "${campaignName}" with ${brandTone} style, focusing on ${campaignFocus}. Social media friendly, eye-catching, shareable design.`;
        shouldGenerateImage = true;
        break;
      case "twitter":
      case "x":
        designPrompt = `Create Twitter/X post content for "${campaignName}" campaign. Brand tone: ${brandTone}. Focus: ${campaignFocus}. Include tweet under 280 characters and hashtags. Format as JSON with: tweet, hashtags array.`;
        break;
      default:
        designPrompt = `Create marketing content for "${campaignName}" campaign on ${platform}. Brand tone: ${brandTone}. Focus: ${campaignFocus}. Format as JSON with relevant fields.`;
    }

    // Generate text content
    const textResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a creative marketing expert. Generate compelling, professional marketing content that is engaging and conversion-focused. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: designPrompt
        }
      ],
      max_tokens: 500,
    });

    try {
      content = JSON.parse(textResponse.choices[0].message.content || "{}");
    } catch (parseError) {
      // Fallback if JSON parsing fails
      content = { text: textResponse.choices[0].message.content || "" };
    }

    // Generate image if needed
    let imageUrl: string | undefined;
    if (shouldGenerateImage && imagePrompt) {
      try {
        const imageResult = await generateImage(imagePrompt);
        imageUrl = imageResult.url;
      } catch (imageError) {
        console.error(`Error generating image for ${platform}:`, imageError);
        // Continue without image if generation fails
      }
    }

    return { content, imageUrl };
  } catch (error) {
    console.error(`Error generating ${platform} content:`, error);
    throw new Error(`Failed to generate ${platform} content: ${(error as Error).message}`);
  }
}

export async function generateCardDesign(cardType: string, prompt: string, shouldGenerateImage: boolean = true): Promise<{ content: string; imageUrl?: string }> {
  console.log(`Generating ${cardType} design for prompt:`, prompt);
  
  try {
    let designPrompt = "";
    let shouldGenerateImage = true; // Always generate images for all card types

    switch (cardType) {
      case "slides":
        designPrompt = `Create slide content for: ${prompt}. Include title, bullet points, and key messaging.`;
        break;
      case "landing":
        designPrompt = `Create landing page content for: ${prompt}. Include headline, subheadline, key benefits, and call-to-action.`;
        break;
      case "linkedin":
        designPrompt = `Create LinkedIn post content for: ${prompt}. Include engaging copy, hashtags, and professional tone.`;
        break;
      case "instagram":
        designPrompt = `Create Instagram post content for: ${prompt}. Include caption, hashtags, and visual description.`;
        break;
      case "twitter":
        designPrompt = `Create Twitter/X post content for: ${prompt}. Include engaging tweet under 280 characters and relevant hashtags.`;
        break;
      case "facebook":
        designPrompt = `Create Facebook post content for: ${prompt}. Include engaging copy and call-to-action.`;
        break;
      case "email":
        designPrompt = `Create email campaign content for: ${prompt}. Include subject line, header, body content, and call-to-action.`;
        break;
      case "ads":
        designPrompt = `Create ad copy and visual concept for: ${prompt}. Include headline, description, and visual elements.`;
        break;
      case "blog":
        designPrompt = `Create blog post outline and introduction for: ${prompt}. Include title, key points, and engaging introduction.`;
        break;
      case "youtube":
        designPrompt = `Create YouTube video content for: ${prompt}. Include title, description, key points, and thumbnail concept.`;
        break;
      default:
        designPrompt = `Create marketing content for: ${prompt}`;
    }

    // Generate text content
    const textResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a creative marketing expert. Generate compelling, professional marketing content that is engaging and conversion-focused."
        },
        {
          role: "user",
          content: designPrompt
        }
      ],
      max_tokens: 500,
    });

    const content = textResponse.choices[0].message.content || "";

    // Generate platform-specific image for all card types
    let imageUrl: string | undefined;
    if (shouldGenerateImage) {
      try {
        let imagePrompt = "";
        
        switch (cardType) {
          case "slides":
            imagePrompt = `Professional presentation slide design for: ${prompt}. Clean corporate layout, modern typography, business presentation style, high quality.`;
            break;
          case "landing":
            imagePrompt = `Modern landing page hero image for: ${prompt}. Web optimized, conversion-focused design, professional layout, engaging visuals.`;
            break;
          case "linkedin":
            imagePrompt = `Professional LinkedIn post image for: ${prompt}. Business network style, corporate branding, professional atmosphere, clean design.`;
            break;
          case "instagram":
            imagePrompt = `Instagram post image for: ${prompt}. Social media optimized, visually appealing, engaging composition, trending aesthetic.`;
            break;
          case "twitter":
            imagePrompt = `Twitter/X post image for: ${prompt}. Social media friendly, concise visual message, shareable design, modern style.`;
            break;
          case "facebook":
            imagePrompt = `Facebook post image for: ${prompt}. Social media optimized, eye-catching, community-focused design, engaging visuals.`;
            break;
          case "email":
            imagePrompt = `Email newsletter header image for: ${prompt}. Email marketing design, professional layout, engaging header visual, brand-focused.`;
            break;
          case "ads":
            imagePrompt = `Advertisement visual for: ${prompt}. High-impact advertising design, attention-grabbing, conversion-focused, professional quality.`;
            break;
          case "blog":
            imagePrompt = `Blog post featured image for: ${prompt}. Content marketing visual, engaging design, blog-optimized, professional quality.`;
            break;
          case "youtube":
            imagePrompt = `YouTube video thumbnail for: ${prompt}. Video platform optimized, eye-catching design, engaging visual, thumbnail format.`;
            break;
          default:
            imagePrompt = `Professional marketing visual for ${cardType}: ${prompt}. Modern, clean design, high quality, brand-focused.`;
        }
        
        console.log(`Generating ${cardType} image with prompt: ${imagePrompt.substring(0, 100)}...`);
        const imageResult = await generateImage(imagePrompt);
        imageUrl = imageResult.url;
        console.log(`Successfully generated ${cardType} image: ${imageUrl?.substring(0, 50)}...`);
      } catch (imageError) {
        console.error(`Error generating image for ${cardType}:`, imageError);
        // Continue without image if generation fails
      }
    }

    return { content, imageUrl };
  } catch (error) {
    console.error("Error generating card design:", error);
    throw new Error(`Failed to generate ${cardType} design: ${(error as Error).message}`);
  }
}

// Image variation mapping for different card types
const IMAGE_VARIATION_MAPPING = {
  // Professional/Business content - Variation 1
  'primary': ['linkedin', 'blog', 'email', 'slides'],
  // Social content - Variation 2  
  'secondary': ['instagram', 'facebook', 'twitter'],
  // Marketing/Commercial content - Variation 3
  'tertiary': ['ads', 'landing', 'youtube']
};

// Generate reusable image variations for a campaign
export async function generateCampaignImageVariations(campaignPrompt: string) {
  const variations: { [key: string]: string } = {};
  
  try {
    // Generate primary variation (professional/business)
    const primaryPrompt = `Professional business marketing image for: ${campaignPrompt}. Clean, corporate style, modern design, high quality.`;
    const primaryResult = await generateImage(primaryPrompt);
    variations.primary = primaryResult.url;
    
    // Generate secondary variation (social media)
    const secondaryPrompt = `Social media marketing image for: ${campaignPrompt}. Engaging, vibrant, social-friendly design, trending aesthetic.`;
    const secondaryResult = await generateImage(secondaryPrompt);
    variations.secondary = secondaryResult.url;
    
    // Generate tertiary variation (marketing/commercial)
    const tertiaryPrompt = `Commercial marketing image for: ${campaignPrompt}. High-impact, conversion-focused, advertisement style, professional quality.`;
    const tertiaryResult = await generateImage(tertiaryPrompt);
    variations.tertiary = tertiaryResult.url;
    
    console.log('Generated campaign image variations:', Object.keys(variations));
    return variations;
  } catch (error) {
    console.error('Error generating campaign image variations:', error);
    return {};
  }
}

// Get appropriate image variation for a card type
export function getImageVariationForCardType(cardType: string, variations: { [key: string]: string }): string | null {
  // Find which variation group this card type belongs to
  for (const [variationKey, cardTypes] of Object.entries(IMAGE_VARIATION_MAPPING)) {
    if (cardTypes.includes(cardType)) {
      return variations[variationKey] || null;
    }
  }
  
  // Default to primary variation if card type not found
  return variations.primary || null;
}
