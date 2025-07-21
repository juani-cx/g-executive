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

export async function generateCampaignAssets(request: CampaignGenerationRequest): Promise<CampaignAssets> {
  try {
    const prompt = `Create comprehensive marketing campaign assets based on this image analysis and requirements:

Brand Tone: ${request.brandTone}
Target Platforms: ${request.targetPlatforms.join(", ")}
Campaign Focus: ${request.campaignFocus}

Generate assets in JSON format with this structure:
{
  "socialMediaPosts": [
    {
      "platform": "Instagram",
      "caption": "Engaging caption text",
      "hashtags": ["relevant", "hashtags"],
      "dimensions": "1080x1080"
    }
  ],
  "adCopy": [
    {
      "platform": "Facebook",
      "headline": "Compelling headline",
      "body": "Persuasive ad copy",
      "cta": "Call to action"
    }
  ],
  "emailCampaign": {
    "subject": "Email subject line",
    "content": "Full email content with HTML structure",
    "preheader": "Preview text"
  },
  "linkedinArticle": {
    "title": "Professional article title",
    "content": "Full article content",
    "summary": "Article summary"
  }
}

Create content that is professional, engaging, and aligned with the brand tone. Include specific CTAs and ensure all copy is ready for immediate use.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert marketing copywriter and campaign strategist. Create comprehensive, professional marketing assets."
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
                url: `data:image/jpeg;base64,${request.imageBase64}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as CampaignAssets;
  } catch (error) {
    throw new Error("Failed to generate campaign assets: " + (error as Error).message);
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
