# Campaign AI Gen - Internal SaaS Platform

## Overview

Campaign AI Gen is a comprehensive AI-powered marketing platform designed specifically for internal business usage. Unlike a public marketing tool, this is a SaaS dashboard that provides campaign generation, catalog building, and AI-powered content creation capabilities. The platform features a clean, dashboard-style interface inspired by Google Stitch, with project management, search functionality, and executive sharing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: SaaS dashboard interface (Google Stitch-inspired) over marketing landing pages.
Authentication: Simple one-click sign-in without forms - just a "Sign In" button for internal access.
Login design: 2-column layout with form on left, solid background on right for future design elements.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with clean SaaS dashboard design
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Simple one-click sign-in system with localStorage persistence (no forms required)
- **Dashboard**: Project grid layout with search, filters, and recent projects sidebar

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Design**: RESTful API with JSON responses
- **File Uploads**: Multer middleware for handling image uploads (10MB limit)
- **AI Integration**: OpenAI API for image analysis and content generation

### Database Architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Three main entities - campaigns, catalogs, and catalog_products
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon Database serverless driver for PostgreSQL

## Key Components

### Canvas-Based Creation Workspace (New - August 2025)
- **Purpose**: Instant AI asset generation in an interactive, infinite canvas environment
- **Features**: Auto-generates 4 default cards (Slides, Landing Page, LinkedIn, Instagram), pan/zoom navigation, drag-to-arrange, real-time editing
- **Workflow**: Prompt → Instant redirect to canvas → Assets appear as editable cards with live generation status
- **Tools**: Add Card templates, AI prompt editing, manual editing, export options, version control
- **Architecture**: Replaces traditional preview-confirmation flow with immediate workspace access

### Campaign Generator (Legacy)
- **Purpose**: Transform uploaded images into visual marketing campaigns with AI-generated images
- **Features**: Brand tone selection, platform targeting, DALL-E image generation, preview-first workflow
- **Output**: Platform-specific marketing visuals, social media images, ad creatives, campaign banners
- **Status**: Being phased out in favor of Canvas workflow

### Catalog Generator
- **Purpose**: Enrich e-commerce product listings with AI-generated text content and metadata
- **Features**: Product image analysis, SEO optimization, metadata generation, text enhancement
- **Output**: Enhanced product descriptions, titles, keywords, features, and SEO-optimized content

### AI Assistant
- **Purpose**: Real-time interaction and content refinement within Canvas
- **Features**: Per-card AI editing, diff previews, version management, prompt-based refinement
- **Integration**: OpenAI GPT-4o for natural language processing and asset generation

### Executive View
- **Purpose**: Shareable, presentation-ready campaign results
- **Features**: Clean interface, downloadable assets, analytics view
- **Access**: Public links for non-technical stakeholders

## Data Flow

### Canvas-Based Workflow (Current)
1. **Prompt Entry**: Users enter marketing prompt on homepage with optional image attachment
2. **Instant Redirect**: Direct navigation to Canvas view (no preview confirmation)
3. **Skeleton Generation**: Four default asset cards appear immediately (< 200ms)
4. **Staggered AI Generation**: Cards populate with content as AI completes each asset type
5. **Interactive Editing**: Real-time AI prompting, manual editing, and version management per card
6. **Continuous Autosave**: All changes persist within 1s debounce to PostgreSQL
7. **Export Options**: Per-card or bulk export in format-specific outputs

### Legacy Workflow (Campaign Generator)
1. **Image Upload**: Users upload images via drag-and-drop interface with validation
2. **AI Analysis**: Images processed through OpenAI Vision API for content understanding
3. **Asset Generation**: Based on brand tone and platform selection, AI generates marketing assets
4. **Real-time Preview**: Generated content displayed with live editing capabilities
5. **Finalization**: Assets compiled into downloadable formats and shareable links
6. **Storage**: Campaign data persisted in PostgreSQL with JSON asset storage

## External Dependencies

### Core Services
- **OpenAI API**: Primary AI service for image analysis and content generation
- **Neon Database**: Serverless PostgreSQL hosting
- **Multer**: File upload handling middleware

### UI Dependencies
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and developer experience
- **Drizzle Kit**: Database schema management
- **ESBuild**: Production bundling

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Assets**: Static files served from built frontend

### Environment Configuration
- **Database**: PostgreSQL connection via `DATABASE_URL`
- **AI Service**: OpenAI API key via `OPENAI_API_KEY` or `API_KEY`
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple

### Production Considerations
- **File Uploads**: 10MB limit with memory storage (consider cloud storage for scale)
- **AI Rate Limits**: OpenAI API rate limiting may require queue implementation
- **Database**: Drizzle ORM provides type-safe database operations
- **Security**: File validation, input sanitization, and secure session management

### Development vs Production
- **Development**: Uses Vite dev server with HMR and error overlays
- **Production**: Serves static files through Express with optimized bundles
- **Replit Integration**: Special handling for Replit environment with dev banners and cartographer