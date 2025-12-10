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
- **Authentication**: Triple system (Superadmin: email/password, Admin: email/password, Assessment: email/access code)
- **Deployment**: Vercel + Supabase (production-ready for 1000+ concurrent users)
- **Styling**: Tailwind CSS with custom enterprise design system
- **Icons**: Lucide React
- **Charts**: Recharts for data visualizations
- **Build Tool**: Vite with React plugin

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (Card, Badge, MetricCard, etc.)
│   ├── assessment/     # Assessment questionnaire components
│   ├── superadmin/     # Superadmin dashboard components
│   ├── Sidebar.tsx     # Main navigation sidebar
│   ├── AssessmentAccessPage.tsx  # Assessment login interface
│   ├── AssessmentNavBar.tsx      # Assessment navigation
│   ├── LoginPage.tsx   # Admin login interface
│   └── SuperadminLoginPage.tsx # Superadmin login interface
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Admin authentication state
│   ├── AssessmentContext.tsx # Assessment session state
│   └── SuperadminContext.tsx # Superadmin authentication state
├── pages/              # Dashboard pages by category
│   ├── overview/       # Executive, maturity, risk, roadmap
│   ├── capabilities/   # AI pillars, skills, departments, personas
│   ├── operations/     # Workflows, opportunities, automation
│   └── assessments/    # Cohort data, individual responses
├── lib/                # Utility functions and services
│   ├── supabase.ts     # Database configuration
│   ├── assessmentAuth.ts # Assessment authentication service
│   ├── assessmentScoring.ts # Real assessment scoring engine
│   ├── workflowIntelligence.ts # Workflow automation analysis
│   ├── dashboardDataService.ts # Real dashboard metrics with scoping
│   ├── superadminAuth.ts # Superadmin authentication & CRUD operations
│   ├── adminDataScoping.ts # Multi-tenancy and permission scoping
│   ├── settingsService.ts # Settings management with full CRUD operations
│   └── utils.ts        # Formatters and helpers
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Code linting
npm run lint

# Preview production build
npm run preview
```

**Note**: Always run `npm run type-check` and `npm run lint` after making changes to ensure code quality.

## Authentication System

The dashboard implements a secure authentication system that protects all admin routes:

### Authentication Flow
- **Login Required**: All dashboard routes are protected and require authentication
- **Demo Accounts**: Pre-configured test accounts for different user roles
- **Session Management**: User state persisted in localStorage for development
- **Role-Based Access**: Simplified two-tier system (superadmin and admin)

### Database Configuration

**Environment Variables** (`.env.local`):
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Demo Admin Accounts
```
Superadmin (System Administrator):
- Email: superadmin@airplatform.com
- Password: superadmin123

Platform Admin:
- Email: admin@airplatform.com
- Password: admin123

Executive:
- Email: cto@company.com  
- Password: admin123
```

### Authentication Architecture
- **SuperadminContext** (`src/contexts/SuperadminContext.tsx`): System administrator authentication
- **AuthContext** (`src/contexts/AuthContext.tsx`): Admin authentication with Supabase integration
- **AssessmentContext** (`src/contexts/AssessmentContext.tsx`): Session-based assessment state
- **superadminAuth.ts** (`src/lib/superadminAuth.ts`): Superadmin authentication & CRUD operations
- **assessmentAuth.ts** (`src/lib/assessmentAuth.ts`): Standalone assessment authentication service
- **SuperadminLoginPage** (`src/components/SuperadminLoginPage.tsx`): System admin login interface
- **LoginPage** (`src/components/LoginPage.tsx`): Enterprise admin login interface
- **AssessmentAccessPage** (`src/components/AssessmentAccessPage.tsx`): Assessment access interface
- **ProtectedRoute** (`src/components/ProtectedRoute.tsx`): Route guard component

### Security Features
- **Real Database Authentication**: Supabase with Row Level Security policies
- **Multi-Tier Authentication**: Separate flows for superadmin, admin, and assessment users
- **Session-Based Assessment**: No pre-registration required for employees
- **Protected Routes**: Automatic redirect to appropriate login
- **Secure Data Storage**: Real-time persistence with proper access controls
- **Data Scoping**: Multi-tenancy with admin permission-based data filtering
- **bcrypt Password Hashing**: Production-ready password security

## Triple Portal Architecture

The platform supports three distinct access modes with assessment as the primary user flow:

### 1. Assessment Portal (Default - `/` root route)
- **Users**: Any employee with company access code
- **Authentication**: Work email + cohort access code (e.g., AIR-2024-Q1)  
- **Purpose**: Complete AI readiness assessment questionnaires
- **Access**: Direct access from root URL, no pre-registration required
- **Session-Based**: Creates assessment session automatically on first login

### 2. Admin Dashboard (`/admin`)
- **Users**: C-suite executives, department heads, AI program managers
- **Authentication**: Email/password with enterprise accounts
- **Purpose**: View aggregated assessment results, AI readiness insights, workflow analysis
- **Access**: Via "Admin Dashboard" button in assessment interface
- **Data Scoping**: Only sees data from authorized cohorts/companies

### 3. Superadmin Dashboard (`/superadmin`)
- **Users**: System administrators, platform operators
- **Authentication**: Email/password with superadmin credentials
- **Purpose**: Create companies, cohorts, admin users, system management
- **Access**: Via "Superadmin" button in assessment interface or direct URL
- **Full Access**: Complete system visibility and CRUD operations

### Routing & Navigation
- **Assessment First**: Root URL (`/`) defaults to assessment portal
- **Admin Access**: Available via button in assessment interface or direct `/admin` URL
- **Superadmin Access**: Available via button in assessment interface or direct `/superadmin` URL
- **Separate Contexts**: Independent authentication systems for each portal
- **Session Management**: Isolated session handling for superadmin vs admin vs assessment users
- **Easy Navigation**: Users can switch between portals seamlessly

### Session-Based Assessment System

#### Access Method
Employees access assessments using:
- **Work Email**: Any company email address
- **Access Code**: Cohort-level code shared by company (format: AIR-2024-Q1)

**Key Innovation**: No pre-registration required - employees self-register with their email when they first access the assessment.

#### Demo Assessment Access
```
Access Code: AIR-2024-Q1
Test Emails:
- test@company.com
- employee@company.com  
- user@company.com
- demo@company.com

Any email works with the access code!
```

#### Assessment Features
- **Session-Based Authentication**: No participant pre-registration required
- **Fresh Assessment Starts**: Each assessment begins with blank form, regardless of previous completions
- **Multiple Submissions Support**: Users can retake assessments to track learning progress over time
- **One-Shot Storage**: Complete assessment stored as single database row with JSON responses
- **Progress Tracking**: Historical submissions enable before/after comparison in results
- **Unique Shareable URLs**: Assessment results accessible via `/a/{results_id}` format
- **Comprehensive Results Interface**: Full tabbed view with Overview, Deep Dive, Tools & Use Cases, Progress, Learning Path
- **Cohort Organization**: Group assessments by company initiative/time period
- **Assessment Benefits Display**: Strategic insights, opportunity discovery, personalized results
- **eLearning Integration**: Access to AI training resources, use cases library, PowerPrompts
- **Two-Column Layout**: Benefits and eLearning (left) + assessment form and expectations (right)
- **Demo Account Quick Access**: One-click demo email selection for testing
- **Automatic URL Redirect**: Assessment completion redirects to unique shareable URL

## Dashboard Architecture

### Information Architecture (4 Main Categories)

1. **OVERVIEW** - Executive summary, company maturity, risk & compliance, strategic roadmap
2. **CAPABILITIES** - AI pillars, skills proficiency, department maturity, persona insights
3. **OPERATIONS** - Workflow insights, inefficiency analysis, automation opportunities, ROI modeling
4. **ASSESSMENTS** - Cohort overview, assessment explorer, individual responses, data exports

### Navigation Pattern
- **Sidebar Navigation**: Always visible with 4 main categories
- **Tab System**: Nested tabs within each category
- **State Management**: Category and tab state managed in `App.tsx:31-32`

## Design System

### Color Palette
```javascript
// Custom Tailwind colors defined in tailwind.config.js
navy: {         // Primary navigation and headers
  900: '#0f172a',
  800: '#1e293b',
  700: '#334155',
  // ... full scale
}
success: '#22c55e',    // Positive metrics
warning: '#f59e0b',    // Medium-risk items  
danger: '#ef4444',     // High-risk items and criticals
```

### Component Library
- **Cards**: Primary content containers with shadows (`components/ui/Card.tsx`)
- **MetricCard**: Highlighted KPI displays with icons
- **CircularProgress**: Score visualizations with color coding
- **Badge**: Status indicators and labels

### Typography & Spacing
- **Font**: Inter (clean sans-serif)
- **Hierarchy**: Strong headers with clear content separation
- **Layout**: Clean spacing, minimal clutter, insight-first design

## Implementation Status

### ✅ Fully Functional Features
- **Production Database Integration** - Supabase PostgreSQL with Row Level Security
- **Real Assessment Scoring Engine** - Dimension-agnostic scoring with actual calculated results
- **Database-Driven Templates** - Assessment configurations loaded from `assessment_templates` table with dynamic section titles
- **Session-Based Assessment Authentication** - No pre-registration required, automatic session creation
- **Triple Portal Architecture** - Assessment portal (default), admin dashboard, and superadmin dashboard
- **Real-Time Data Persistence** - Assessment responses saved directly to database
- **Scalable Architecture** - Ready for 1000+ concurrent users (Vercel + Supabase)
- **Assessment Access Interface** - Two-column layout with benefits, eLearning access, and form
- **Enhanced Assessment Questionnaire** - 40+ questions across AI readiness + workflow mapping
- **Workflow Intelligence Engine** - Real automation potential calculations from assessment data
- **Process Automation Analysis** - Infers automation % and ROI from employee responses
- **Real Dashboard Metrics** - Calculated from actual assessment data with proper scoping
- **Multiple Submissions Support** - Users can retake assessments to track learning progress over time
- **Comprehensive Assessment Results** - Full tabbed interface with real calculated scores and insights
- **Progress Tracking** - Compare results between assessments for users with multiple submissions
- **Unique Shareable URLs** - Assessment results accessible via unique URLs (format: `/a/{results_id}`)
- **Fresh Assessment Starts** - Each assessment begins with blank form, regardless of previous completions
- **Personalized Recommendations** - Dynamic insights based on actual dimension performance
- **Admin Dashboard** - Complete sidebar navigation with data scoping by permissions
- **Superadmin Dashboard** - Full system management with CRUD operations on all entities
- **Multi-Tenancy Support** - Data scoping ensures admins only see authorized cohorts/companies
- **Workshop Support** - Cross-company cohorts without company association
- **Executive Summary** (`pages/overview/ExecutiveSummary.tsx`) - Real AI metrics, workflow insights, automation opportunities
- **Company Management** - Create, view, delete companies via superadmin interface
- **Cohort Management** - Create, view, delete assessment cohorts (company or workshop)
- **Admin User Management** - Create, view, delete admin users with granular permissions
- **Company Maturity** - 5-pillar radar charts with real calculated scores
- **Risk & Compliance** - Real risk exposure calculated from security awareness responses
- **Workflow Automation Opportunities** - Generated from actual process mapping and tool availability
- **Department Breakdown** - Real maturity scores by department from assessment data
- **ROI Projections** - Calculated time savings and cost benefits per process
- **Settings Management** - Complete AI tools and organization CRUD operations with Supabase integration
- **Enterprise Styling** - Professional design system with Tailwind CSS
- **Demo Accounts** - Test accounts for assessment, admin, and superadmin portals
- **Assessment Navigation** - Back/exit buttons with proper routing

### 🚧 Placeholder Pages (Ready for Development)
- Most capabilities pages (AI pillars, skills, departments)
- Remaining operations pages (heatmaps, time/cost savings, adoption patterns)
- Assessment results and analytics pages (cohort analytics, individual responses, exports)
- eLearning platform integration
- AI-powered report generation features

### 📁 Repository Information
- **GitHub Repository**: https://github.com/alexcollignon/air-dd.git
- **Branch**: master
- **Last Updated**: Production-ready with Supabase database integration
- **Status**: Fully functional assessment system with session-based authentication
- **Scalability**: Ready for 1000+ concurrent users on Vercel + Supabase

## Database Architecture

### Production Database Schema

**Core Tables:**
- **companies** - Organization data and settings
- **assessment_templates** - Assessment configurations with JSON template data
- **cohorts** - Assessment batches with access codes (company-specific or workshop)
- **assessment_submissions** - Complete assessment submissions with responses (one row per assessment)
- **assessment_results** - Calculated scores, dimension analysis, and recommendations linked to submissions
- **admin_users** - Dashboard user accounts with simplified role-based access (admin/superadmin)
- **admin_cohort_access** - Granular permissions linking admin users to specific cohorts
- **ai_tools** - AI tools management with approval status, usage tracking, risk levels, and company scoping
- **departments** - Organization departments with company association and validation constraints

**Key Design Decisions:**
- **One-shot assessment storage** - Complete assessment stored in single row with JSON responses
- **Multiple submissions support** - Users can retake assessments, each creates new submission with incremented submission_number
- **Unique shareable URLs** - Assessment results accessible via `/a/{results_id}` format
- **No participants table** - Direct submission storage by email + cohort for simplicity
- **Access codes at cohort level** - One code shared by entire company/initiative
- **Session-based assessment** - No pre-registration required
- **Row Level Security** - Database-level access control for multi-tenancy
- **Progress tracking** - Historical submissions enable learning progress comparison
- **Flexible cohort association** - Cohorts can be company-specific OR workshop (NULL company_id)
- **Granular admin permissions** - Company-wide OR cohort-specific access via admin_cohort_access table
- **Simplified role model** - Only admin and superadmin roles (removed executive/manager complexity)

### TypeScript Interfaces (`types/index.ts`)

**Assessment Types:**
- **AssessmentTemplate**: Complete assessment structure with sections and questions
- **AssessmentResponse**: Individual question responses with metadata
- **AssessmentSession**: Session data for authenticated assessment users

**Dashboard Types:**
- **AIHealthScore**: Overall and pillar-specific scoring
- **WorkflowData**: Process analysis with automation potential
- **DepartmentMaturity**: Cross-departmental comparison data
- **SkillData**: Employee proficiency and gap analysis
- **RiskItem**: Risk categorization and severity
- **WorkflowInsights**: Automation potential, ROI projections, and process bottlenecks
- **DashboardMetrics**: Real calculated metrics from assessment submissions

## Development Guidelines

### Code Style
- **Components**: Functional components with TypeScript
- **Imports**: Use `@/` path alias for clean imports
- **Styling**: Tailwind utility classes with custom design tokens
- **Icons**: Lucide React for consistent iconography

### Best Practices
- Follow existing component patterns in the codebase
- Use TypeScript interfaces for all props and data
- Maintain design system consistency (colors, spacing, typography)
- Focus on executive-grade, insight-first design
- Ensure responsive layout for desktop and tablet

### Adding New Features
1. Check existing patterns in similar components
2. Use established TypeScript interfaces or extend them
3. Follow the design brief's requirements for visual hierarchy
4. Test with `npm run type-check` and `npm run lint`
5. Ensure consistency with enterprise design standards

## Key Features to Understand

### Executive Focus
- **Insight-First**: Distill complexity into clear, actionable insights
- **Executive-Grade**: Professional, polished interface suitable for C-level presentations
- **Decision-Making**: Prioritize clarity and business alignment over raw data

### Operational Intelligence
- **Workflow Intelligence Engine**: Real automation potential calculations from assessment responses
- **Process Bottleneck Analysis**: Identifies highest-impact automation opportunities
- **ROI Modeling**: Calculated time/cost savings with payback period projections
- **Tool-Process Matching**: Recommends specific AI tools for specific workflows
- **Department Automation Scoring**: Real automation potential by department
- **Opportunity Mapping**: Value vs effort prioritization matrix based on real data

### Enterprise Standards
- **Security Conscious**: No hardcoded sensitive data
- **Scalable Architecture**: Modular components and clear separation of concerns
- **Professional Design**: Clean, minimal, enterprise-appropriate aesthetics

## Production Deployment

### Current Status: Production-Ready ✅

The application is fully production-ready with:
- **Supabase Database**: PostgreSQL with Row Level Security
- **Vercel Deployment**: Optimized for 1000+ concurrent users  
- **Real Authentication**: Session-based assessment + admin login
- **Scalable Architecture**: Auto-scaling frontend and database

### Setup Instructions

1. **Apply Database Schema**: Run `supabase-schema.sql` for initial database setup
2. **Apply Latest Updates**: Run `allow-multiple-submissions.sql` for multiple submissions support  
3. **Update Assessment Template**: Run `complete-assessment-template.sql` for full scoring system
4. **Environment Variables**: Configure `.env.local` with Supabase credentials
5. **Deploy to Vercel**: Connect GitHub repo with environment variables
6. **Test Access**: Use access code `AIR-2024-Q1` with any email
7. **Test Features**:
   - Complete assessment → Get real calculated scores
   - Get unique URL `/a/{results_id}` with personalized results
   - Share unique URL to view full tabbed results  
   - Retake assessment → See progress tracking and improvement

### Cost Estimate (Monthly)
- **Supabase Pro**: $25/month (500+ connections)
- **Vercel Pro**: $20/month (team features)  
- **Total**: $45/month for enterprise-scale deployment

## Recent Major Updates ✨

### Superadmin Dashboard & Multi-Tenancy (Latest)
- **Complete Superadmin Interface**: Full system management dashboard with company, cohort, and user CRUD operations
- **Multi-Tenancy Implementation**: Data scoping ensures admins only see authorized cohorts/companies
- **Workshop Support**: Cross-company assessment cohorts without company association
- **Simplified Role Model**: Streamlined to admin/superadmin only (removed executive/manager roles)
- **Real CRUD Operations**: All superadmin actions connected to live Supabase database
- **Granular Permissions**: Admin users can have company-wide OR specific cohort access
- **bcrypt Authentication**: Production-ready password hashing for all admin users
- **Relationship Disambiguation**: Fixed Supabase foreign key ambiguity issues
- **Data Scoping Service**: AdminDataScopingService ensures proper permission enforcement
- **System Overview**: Real-time platform metrics and health monitoring in superadmin dashboard

### Workflow Intelligence System
- **Enhanced Assessment Template**: Added workflow mapping questions while preserving AI dimension scoring
- **Real Dashboard Data**: Admin dashboard now uses calculated metrics from actual assessment submissions
- **Workflow Intelligence Engine**: Analyzes process types, bottlenecks, tool availability to calculate automation potential
- **ROI Calculation Engine**: Generates specific time savings and cost projections per process
- **Dynamic Section Titles**: Assessment sections load titles dynamically from database template
- **Process Automation Analysis**: Maps employee responses to specific automation opportunities with feasibility scoring
- **Department Insights**: Real automation potential and maturity scores calculated per department
- **Tool Recommendation Engine**: Matches available AI tools to process automation opportunities

### Real Assessment Scoring System
- **Database-Driven Templates**: Assessment templates loaded from `assessment_templates` table with JSONB structure
- **Comprehensive Scoring Engine**: Dimension-agnostic scoring engine supports any assessment type
- **Real Calculated Results**: Replaced hardcoded random scores with actual response-based calculations
- **Enhanced Question Set**: 40+ questions across AI readiness + workflow mapping with proper scoring
- **Dynamic Recommendations**: Personalized insights based on actual performance in each dimension
- **Flexible Architecture**: Engine adapts to any dimension configuration (AI readiness, customer service, leadership, etc.)

### Assessment Template Architecture
- **Dimension-Based Scoring**: Assessment organized around configurable dimensions with weights
- **Question Mapping**: Each question maps to specific dimensions via `scoring.dimension` property
- **Weighted Calculations**: Overall scores calculated from dimension-specific weighted averages
- **Template Flexibility**: Same scoring engine works with completely different assessment types
- **Fallback System**: Graceful fallback to default template if database template incomplete

### Database Schema Evolution
- **assessment_templates Table**: Stores complete assessment structure in JSONB `template_data` column
- **Dimension Configuration**: Flexible dimension definitions with ID, name, description, maxScore, weight
- **Question Scoring**: Individual questions reference dimensions and provide scoring value mappings
- **Multiple Assessment Types**: Single codebase supports unlimited assessment configurations
- **Real-Time Loading**: Templates loaded dynamically from database during authentication

### Settings Management System (Latest Implementation)
- **Complete Supabase Integration**: Full CRUD operations for AI tools and organization management via dedicated `settingsService`
- **Settings Database Schema**: Added `ai_tools` and `departments` tables with proper UUID foreign key constraints to companies table
- **Multi-Tenancy Support**: Company-scoped data operations with automatic company_id population for company-level admin users
- **AI Tools Management**: Complete approval workflow with categorization, usage tracking, risk assessment, and user count analytics
- **Department Management**: Dynamic organization structure with validation, duplicate prevention, and real-time CRUD operations
- **Enterprise UI/UX**: Professional tabbed interface with search/filtering, batch operations, and comprehensive validation
- **Production-Ready Authentication**: Fixed RLS policies and company_id population logic for company vs cohort-based admin users
- **Error Handling & Validation**: Comprehensive error handling with user-friendly messages and optimistic UI updates

## Assessment Scoring Engine ⚙️

### Architecture Overview
The platform features a **dimension-agnostic scoring engine** that can power any type of assessment:

```typescript
// Engine adapts to any assessment configuration
const templateDimensions = [
  { id: "communication", name: "Communication Skills", weight: 1 },
  { id: "leadership", name: "Leadership Ability", weight: 1.5 }
]

// Questions map to dimensions
"scoring": {
  "dimension": "communication",
  "weight": 2,
  "valueMapping": { "poor": 1, "excellent": 5 }
}
```

### Supported Assessment Types
- **AI Readiness**: 5 dimensions (prompting, tools, ethics, thinking, co-intelligence)
- **Leadership Assessment**: Vision, team building, decision making
- **Customer Service**: Communication, problem solving, empathy  
- **Technical Skills**: Programming, architecture, debugging
- **Any Custom Configuration**: Engine adapts automatically

### Scoring Features
- **Weighted Calculations**: Dimensions can have different importance levels
- **Question Mapping**: Each question contributes to specific dimension scores
- **Value Mapping**: Different response options have configured score values
- **Aggregated Results**: Overall score calculated from dimension averages
- **Personalized Insights**: Recommendations based on performance patterns

### Template Structure
```json
{
  "dimensions": [
    {
      "id": "promptingProficiency",
      "name": "Prompting Proficiency", 
      "description": "Ability to effectively communicate with AI systems",
      "maxScore": 100,
      "weight": 1
    },
    {
      "id": "coIntelligence",
      "name": "Co-Intelligence",
      "description": "Human-AI collaboration and workflow integration", 
      "maxScore": 100,
      "weight": 1.5
    }
  ],
  "strategic": {
    "title": "AI Company Strategy & Workflows",
    "questions": [
      {
        "id": "primary_work_processes",
        "text": "Which processes are you involved with?",
        "type": "multi_select",
        "tags": ["workflow_mapping"],
        "scoring": {
          "dimension": "coIntelligence",
          "weight": 2
        }
      }
    ]
  }
}
```

## Workflow Intelligence Engine Architecture

### Core Components

**WorkflowIntelligenceEngine** (`src/lib/workflowIntelligence.ts`):
- **calculateAutomationPotential()**: Combines process types, technical skills, tool availability
- **calculateROIProjections()**: Generates time/cost savings projections per process
- **identifyProcessBottlenecks()**: Maps bottlenecks to automation opportunities
- **generateWorkflowOpportunities()**: Ranks opportunities by ROI and feasibility

**DashboardDataService** (`src/lib/dashboardDataService.ts`):
- **calculateDashboardMetrics()**: Aggregates real data from assessment submissions
- **calculatePillarScores()**: Real AI dimension scores from assessment responses
- **calculateWorkflowMetrics()**: Automation potential and estimated savings
- **calculateRiskExposure()**: Security risk from awareness responses

### Data Flow
```
Assessment Responses → Workflow Engine → Automation Analysis → Dashboard Metrics
     ↓                      ↓                   ↓                    ↓
 AI Dimensions        Process Mapping      ROI Calculations    Executive KPIs
 Tool Usage          Bottlenecks          Time Savings         Opportunities
 Department           Technical Skills     Cost Projections    Risk Exposure
```

### Calculation Examples

**Automation Potential** = Base Process Automation × Technical Multiplier × Tool Availability × Current Level
- Customer Support + Basic User + Microsoft Copilot + Manual Processes = 45% automation potential
- Invoice Processing + Advanced + Any Tool + Some Automation = 78% automation potential

**ROI Projections** = Process Hours × Time Savings % × 52 weeks × $75/hour
- Document Processing: 8 hrs/week × 70% savings × 52 × $75 = $21,840/year
- Customer Onboarding: 12 hrs/week × 65% savings × 52 × $75 = $30,420/year

## Dashboard Data Integration Status & Roadmap

### ✅ **Currently Working with Real Database Data**
- **ExecutiveSummary** (`src/pages/overview/ExecutiveSummary.tsx`) - Uses `dashboardDataService.calculateDashboardMetrics()` with proper admin scoping

### 📊 **Rich UI Built, Needs Database Integration** (Priority 1-2)

#### **Priority 1: Core Dashboard Pages** (High Impact)

**1. RiskCompliance** (`src/pages/overview/RiskCompliance.tsx:19-37`)
- **Current**: Hardcoded security heatmap, Shadow AI tools list
- **Needs**: 
  ```typescript
  async calculateSecurityHeatmap(adminUser?: AdminUser): Promise<SecurityHeatmap[]>
  async getDetectedAITools(adminUser?: AdminUser): Promise<ShadowAITool[]>
  async calculateRiskExposureByDepartment(adminUser?: AdminUser): Promise<DepartmentRisk[]>
  ```
- **Data Sources**: Security awareness from assessment responses, AI tool usage patterns

**2. AssessmentData** (`src/pages/AssessmentData.tsx:30-220`)
- **Current**: Hardcoded participant data with rich filtering/pagination UI
- **Needs**: 
  ```typescript
  async getFilteredParticipants(filters: ParticipantFilters, adminUser?: AdminUser): Promise<ParticipantData[]>
  async getCohortStatistics(adminUser?: AdminUser): Promise<CohortStats[]>
  async getDepartmentCompletionRates(adminUser?: AdminUser): Promise<DepartmentStats[]>
  ```
- **Data Sources**: `assessment_submissions` + `assessment_results` tables with admin scoping

**3. AIReadiness/Company Maturity** (`src/pages/AIReadiness.tsx:10-18`)
- **Current**: Hardcoded department scores, radar charts, maturity levels
- **Needs**: 
  ```typescript
  async calculateDepartmentMaturityScores(adminUser?: AdminUser): Promise<DepartmentMaturity[]>
  async getMaturityRadarData(adminUser?: AdminUser): Promise<RadarData[]>
  async calculateIndustryBenchmarks(): Promise<BenchmarkData[]>
  ```
- **Data Sources**: Dimension scores from assessment results grouped by department

**4. PeopleSkills** (`src/pages/PeopleSkills.tsx:40-347`)
- **Current**: Complex multi-tab UI with hardcoded personas, skills heatmap, progress tracking
- **Needs**: 
  ```typescript
  async calculateSkillsHeatmap(adminUser?: AdminUser): Promise<SkillsHeatmap>
  async generateEmployeePersonas(adminUser?: AdminUser): Promise<PersonaProfile[]>
  async getProgressData(adminUser?: AdminUser): Promise<ProgressData[]>
  async getEmployeeFeedback(adminUser?: AdminUser): Promise<FeedbackInsights[]>
  ```
- **Data Sources**: Skills breakdown from dimension scores, persona generation from score ranges

#### **Priority 2: Assessment Management** (Medium Impact)

**5. Settings** (`src/pages/Settings.tsx`) ✅ **COMPLETED**
- **Status**: Fully integrated with Supabase database via `settingsService.ts`
- **Features**: Complete CRUD operations for AI tools and departments with multi-tenancy support
- **Technical**: Company-scoped data operations, RLS configuration, and comprehensive validation

### 🚧 **Placeholder Pages** (Need Full Implementation)

#### **Capabilities Section** (All use `PlaceholderPage`)
- `AIPillars.tsx` - Six-pillar AI maturity framework analysis
- `SkillsProficiency.tsx` - Employee AI skill assessment and training recommendations  
- `DepartmentMaturity.tsx` - AI maturity assessment by department with comparative analysis
- `PersonaInsights.tsx` - Role-based AI readiness analysis and personalized recommendations
- `ProgressTime.tsx` - Progress tracking and time-based analytics

#### **Operations Section** (Mixed - 1 implemented, rest placeholder)
- ✅ `OpportunityMap.tsx` - **IMPLEMENTED** with hardcoded data (Value vs effort matrix)
- 🚧 `AutomationOpportunities.tsx` - Placeholder
- 🚧 `InefficiencyHeatmap.tsx` - Placeholder  
- 🚧 `TimeCostSavings.tsx` - Placeholder
- 🚧 `AdoptionPatterns.tsx` - Placeholder
- 🚧 `InvestmentEconomics.tsx` - Placeholder

#### **Assessment Section** (All use `PlaceholderPage`)
- `CohortOverview.tsx` - Assessment completion rates and participant analytics
- `AssessmentExplorer.tsx` - Searchable and filterable assessment data with analytics  
- `IndividualResponses.tsx` - Individual response viewer and analysis
- `Exports.tsx` - CSV/PDF export functionality

### 🛠 **Implementation Requirements**

#### **Data Service Extensions Needed**
1. **Extend DashboardDataService** (`src/lib/dashboardDataService.ts`) with methods listed above
2. **Create Specialized Services**:
   - `src/lib/riskAnalysisService.ts` - Risk & compliance calculations
   - `src/lib/peopleAnalyticsService.ts` - Personas, skills, progress tracking
   - `src/lib/assessmentExplorerService.ts` - Assessment search & filtering
   - `src/lib/exportService.ts` - CSV/PDF generation

#### **Database Query Requirements**
- All new services must use `adminDataScopingService.getAccessibleSubmissions(adminUser)` for proper multi-tenancy
- Add comprehensive TypeScript interfaces in `src/types/index.ts`
- Follow existing error handling and loading state patterns
- Include proper database indexing for performance

#### **Implementation Order Recommendation**
1. **RiskCompliance** - Extends existing real data patterns
2. **AssessmentData** - High user value, simpler database queries
3. **AIReadiness** - Complex but builds on dimension calculations  
4. **PeopleSkills** - Most complex, requires all previous patterns
5. **Assessment Management & Operations** - Lower priority features

### 📈 **Current Dashboard Status**: 1 page fully integrated, 4 pages with rich UI ready for data connection, 15+ pages need full implementation

## Next Steps for Enhancement

1. **Complete Priority 1 Database Integrations** - Connect RiskCompliance, AssessmentData, AIReadiness, PeopleSkills to real data
2. **Enhanced Workflow Components**: Build slider_group and other advanced question types
3. **Multiple Assessment Types**: Deploy leadership, customer service, technical assessments using same engine
4. **AI Report Generation**: OpenAI integration for personalized insights from real workflow data
5. **Advanced Process Mapping**: Visual workflow diagrams with automation annotations
6. **Predictive Analytics**: Machine learning models for automation ROI prediction
7. **Export Functionality**: PDF reports and CSV exports with real calculated data
8. **Mobile Optimization**: Tablet-friendly responsive design for assessments
9. **Real-Time Monitoring**: Live dashboard updates as new assessments complete
10. **Custom Branding**: Company logos and color scheme customization
11. **Template Builder**: Visual interface for creating new assessment types and workflow mappings

## Support & Documentation

- **Design Brief**: Full requirements available in project documentation
- **Component Library**: Reusable UI components in `src/components/ui/`
- **Workflow Intelligence**: Business logic in `src/lib/workflowIntelligence.ts`
- **Dashboard Service**: Real data aggregation in `src/lib/dashboardDataService.ts`
- **Scoring Engine**: Assessment calculations in `src/lib/assessmentScoring.ts`
- **Settings Service**: Complete CRUD operations in `src/lib/settingsService.ts`
- **Admin Data Scoping**: Multi-tenancy support in `src/lib/adminDataScoping.ts`
- **Utility Functions**: Formatters and helpers in `src/lib/utils.ts`
- **Type Definitions**: Complete data models in `src/types/index.ts`