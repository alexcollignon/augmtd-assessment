# AIR Admin Dashboard - Claude Project Context

## Project Overview

**AIR (AI Readiness) Admin Dashboard** is an enterprise-grade platform for AI due diligence and workflow optimization. It transforms employee AI assessment data into actionable business intelligence for C-suite executives and department leaders.

### Purpose
- **Primary Users**: CIO, CTO, COO, Chief Data Officer, Heads of Operations, AI Program Managers
- **Core Value**: Single pane of glass for AI readiness assessment, workflow inefficiencies, and automation opportunities
- **Differentiator**: Operational focus on ROI modeling and workflow intelligence, not just maturity scoring

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
- **Purpose**: Complete AI readiness assessments
- **Demo Access Code**: `AIR-2024-Q1` with any email

### 2. Admin Dashboard (`/admin`)
- **Users**: C-suite executives, department heads, AI program managers
- **Authentication**: Email/password with enterprise accounts
- **Purpose**: View aggregated results, AI readiness insights, compliance monitoring

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

### **Dashboard Intelligence**
- **Executive Summary**: Real AI metrics, workflow insights, automation opportunities
- **Workflow Analysis**: ROI calculations, process bottleneck identification
- **Multi-Tenancy**: Data scoping ensures admins only see authorized data
- **Real-Time Updates**: Live dashboard updates as assessments complete

## Implementation Status

### ✅ **Production Ready**
- **Executive Summary**: Real dashboard metrics with admin scoping
- **Risk & Compliance**: Full compliance monitoring with smart tool matching
- **Settings Management**: JSON-based configuration with multi-tenancy
- **Assessment System**: Complete scoring engine with unique result URLs
- **Authentication**: Triple portal system with secure session management

### 🔄 **Rich UI Ready for Data Connection**
- **Assessment Data Explorer**: Participant filtering and analytics
- **AI Readiness/Company Maturity**: Department scores and radar charts  
- **People & Skills**: Persona analysis and skills heatmaps

### 📋 **Next Priority**
1. Connect remaining dashboard pages to real data
2. Enhanced workflow components and question types
3. AI report generation with OpenAI integration

## Recent Migration Files

- **`company-settings-schema.sql`**: JSON settings architecture with migration
- **`JSON-SETTINGS-MIGRATION.md`**: Migration guide and testing
- **`SMART-TOOL-MATCHING.md`**: Tool name normalization system
- **`RISK-COMPLIANCE-DEBUGGING.md`**: Troubleshooting guide

## Key Services

- **`dashboardDataService.ts`**: Real data aggregation with compliance integration
- **`settingsService.ts`**: JSON-based CRUD operations with smart tool matching
- **`adminDataScoping.ts`**: Multi-tenancy and permission enforcement
- **`assessmentScoring.ts`**: Dimension-agnostic scoring engine
- **`workflowIntelligence.ts`**: Automation analysis and ROI calculations

## Environment Setup

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Demo Accounts

```
Superadmin: superadmin@airplatform.com / superadmin123
Admin: admin@airplatform.com / admin123
Assessment: Any email + access code "AIR-2024-Q1"
```

## Current Status: **85% Production Ready** 🚀

- ✅ **Core Assessment Flow**: Complete with real scoring and unique URLs
- ✅ **Compliance Monitoring**: Real-time governance with smart tool matching
- ✅ **Settings Management**: JSON architecture with atomic updates
- ✅ **Multi-Tenancy**: Secure data scoping and permissions
- 🔄 **Dashboard Completion**: 2/6 core pages fully integrated
- 📋 **Enhancement Ready**: Platform ready for AI agent integration and advanced analytics