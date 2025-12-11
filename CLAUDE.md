# AUGMTD Intelligence Platform - Claude Project Context

## Project Overview

**AUGMTD Intelligence Platform** (formerly AIR) is an enterprise-grade platform for organizational augmentation and workflow optimization. It transforms employee AI assessment data into actionable business intelligence for C-suite executives and department leaders.

### Purpose
- **Primary Users**: CIO, CTO, COO, Chief Data Officer, Heads of Operations, AI Program Managers
- **Core Value**: Single pane of glass for augmentation readiness assessment, workflow inefficiencies, and automation opportunities
- **Differentiator**: Operational focus on ROI modeling and transformation intelligence, not just maturity scoring

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Triple system (Superadmin, Admin, Assessment portals)
- **Deployment**: Vercel + Supabase (production-ready for 1000+ concurrent users)
- **Styling**: Tailwind CSS with custom enterprise design system

## Development Commands

```bash
npm run dev          # Development server
npm run build        # Build for production
npm run type-check   # Type checking
npm run lint         # Code linting
```

**Note**: Always run `npm run type-check` and `npm run lint` after making changes.

## Triple Portal Architecture

### 1. Assessment Portal (Default `/`)
- **Users**: Any employee with company access code
- **Authentication**: Work email + cohort access code (e.g., AIR-2024-Q1)
- **Purpose**: Complete Organizational Augmentation Assessment
- **Demo Access Code**: `AIR-2024-Q1` with any email

### 2. AUGMTD Intelligence Platform (`/admin`)
- **Users**: C-suite executives, department heads, AI program managers
- **Authentication**: Email/password with enterprise accounts
- **Purpose**: View aggregated results, augmentation intelligence insights, compliance monitoring

### 3. Superadmin Dashboard (`/superadmin`)
- **Users**: System administrators, platform operators
- **Authentication**: Email/password with superadmin credentials
- **Purpose**: System management, company/cohort/user CRUD operations

## Core Features ✨

### **JSON-Based Settings Architecture**
- **Single Row Per Company**: `company_settings` table with JSONB fields for AI tools and departments
- **Atomic Updates**: All settings updated in one transaction
- **Smart Tool Matching**: Handles company prefixes, AI suffixes, and 50+ tool variations
- **Real-Time Compliance**: Settings changes immediately reflected in Risk & Compliance dashboard

### **Risk & Compliance Integration**
- **Real-Time Monitoring**: AI tool usage detection from assessment responses
- **Smart Governance**: Connects assessment data with organizational policies
- **Zero False Positives**: Intelligent tool name normalization eliminates matching errors
- **Complete Workflow**: Assessment → Risk Analysis → Settings Management → Compliance Reporting

### **Assessment System**
- **Session-Based**: No pre-registration required, employees self-register with email + access code
- **Real Scoring Engine**: Dimension-agnostic scoring supports any assessment type
- **Multiple Submissions**: Users can retake assessments to track progress
- **Unique URLs**: Results accessible via shareable links `/a/{results_id}`

### **Persistent AI Analysis System**
- **Single-Row JSON Storage**: One database row per company with all analyses stored as JSONB array
- **Smart Caching**: AI-generated analysis persists across sessions, avoiding expensive regeneration
- **Intelligent Freshness**: Auto-detects when new assessment data requires analysis updates
- **User-Controlled Refresh**: Manual "Update Analysis" button for on-demand AI regeneration
- **Actionable CTAs**: Shows "Generate Analysis" prompts instead of meaningless placeholder percentages

### **Dashboard Intelligence**
- **Executive Summary**: Real AI metrics with CTA-driven user experience
- **AI-Powered Process Analysis**: OpenAI GPT-4 agent with company-specific tool context and cached results
- **Multi-Tenancy**: Data scoping ensures admins only see authorized data
- **Real-Time Updates**: Live dashboard updates as assessments complete

## Implementation Status

### ✅ **Production Ready**
- **Executive Summary**: Real dashboard metrics with CTA-driven user experience
- **Risk & Compliance**: Full compliance monitoring with smart tool matching
- **Settings Management**: JSON-based configuration with multi-tenancy
- **Assessment System**: Complete scoring engine with unique result URLs
- **AI Process Analysis**: Persistent OpenAI GPT-4 analysis with single-row JSON storage
- **Smart User Flow**: CTAs replace fake percentages until real AI analysis is generated
- **Authentication**: Triple portal system with secure session management

### 🔄 **Rich UI Ready for Data Connection**
- **Assessment Data Explorer**: Participant filtering and analytics
- **AI Readiness/Company Maturity**: Department scores and radar charts  
- **People & Skills**: Skills analysis and progress tracking (Employee Personas & AI Champions disabled with "Coming Soon")

### 📋 **Next Priority**
1. Connect remaining dashboard pages to real data
2. Enhanced workflow components and question types
3. AI report generation with OpenAI integration

## Database Schemas & Migration Files

- **`company-settings-schema.sql`**: JSON settings architecture with migration
- **`ai-process-analysis-schema.sql`**: Single-row JSON storage for persistent AI analysis
- **`JSON-SETTINGS-MIGRATION.md`**: Migration guide and testing
- **`SMART-TOOL-MATCHING.md`**: Tool name normalization system
- **`RISK-COMPLIANCE-DEBUGGING.md`**: Troubleshooting guide
- **`SETUP_DATABASE_INSTRUCTIONS.md`**: Instructions for persistent AI analysis setup

## Key Services

- **`dashboardDataService.ts`**: Real data aggregation with AI-first automation metrics (no fake fallbacks)
- **`settingsService.ts`**: JSON-based CRUD operations with smart tool matching
- **`adminDataScoping.ts`**: Multi-tenancy and permission enforcement
- **`assessmentScoring.ts`**: Dimension-agnostic scoring engine
- **`workflowIntelligence.ts`**: Programmatic analysis (disabled for automation % to avoid fake data)
- **`AITransformationPipeline.tsx`**: AI-powered processes with cached analysis and refresh controls
- **`openaiService.ts`**: OpenAI API integration service for AI agent functionality
- **`processAnalysisAgent.ts`**: Specialized AI agent for organizational process analysis
- **`cachedProcessAnalysisAgent.ts`**: Caching wrapper for AI analysis with freshness tracking
- **`aiAnalysisService.ts`**: Single-row JSON storage for persistent AI analysis

## Environment Setup

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_OPENAI_API_KEY=your-openai-api-key-here
```

## Demo Accounts

```
Superadmin: superadmin@airplatform.com / superadmin123
Admin: admin@airplatform.com / admin123
Assessment: Any email + access code "AIR-2024-Q1"
```

## Brand Assets

- **Logo**: `/public/images/augmtd-logo.png`
- **Website**: www.augmtd.ai
- **Favicon**: Updated to use AUGMTD logo

## Current Status: **95% Production Ready** 🚀

- ✅ **Core Assessment Flow**: Complete with real scoring and unique URLs
- ✅ **Compliance Monitoring**: Real-time governance with smart tool matching
- ✅ **Settings Management**: JSON architecture with atomic updates
- ✅ **Multi-Tenancy**: Secure data scoping and permissions
- ✅ **Persistent AI Analysis**: Single-row JSON storage with smart caching and refresh controls
- ✅ **Honest UX**: CTA-driven experience with no fake placeholder percentages
- ✅ **Brand Integration**: AUGMTD branding, logo, and naming updates
- 🔄 **Dashboard Completion**: 4/6 core pages fully integrated
- 📋 **Enhancement Ready**: Platform ready for advanced analytics and reporting

## Recent Updates

### ✅ **Persistent AI Analysis System (December 2024)**
- **Single-Row JSON Storage**: Refactored from multi-row to single company row with JSONB analysis array
- **Smart Caching**: AI analysis persists across sessions, cached until new assessment data available
- **User-Controlled Refresh**: Manual "Update Analysis" button replaces automatic regeneration
- **Honest User Experience**: Removed fake automation percentages, replaced with actionable CTAs
- **Freshness Indicators**: UI shows analysis age and "Update Available" when 5+ new submissions exist
- **Performance Optimization**: Eliminated expensive AI regeneration on every page load

### ✅ **AUGMTD Rebranding Complete**
- Updated platform name from "AIR Admin Dashboard" to "AUGMTD Intelligence Platform"
- Implemented new naming: "Organizational Augmentation Assessment" and "Augmentation Intelligence & Strategy"
- Updated logos, favicon, and brand assets throughout platform

### ✅ **AI-Powered Process Analysis**
- Replaced programmatic calculations with OpenAI GPT-4 intelligent analysis
- Real workflow extraction from assessment submissions (`strategic-primary_work_processes`)
- **Company-Specific Tool Context**: AI agent uses approved AI tools from Settings page for actionable recommendations
- Executive-level automation recommendations with realistic implementation paths
- Intelligent process categorization, feasibility assessment, and strategic prioritization

### 🎯 **Data Consistency Achieved**
- Automation metrics synchronized across all dashboard pages
- Business processes table displays the workflows that generate the "Workflows Analyzed" count
- Real-time data flow: Assessment → Extract Processes → Count & Display → Automation Analysis