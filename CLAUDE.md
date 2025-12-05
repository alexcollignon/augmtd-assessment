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
- **Authentication**: Dual system (Admin: email/password, Assessment: email/access code)
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
│   ├── Sidebar.tsx     # Main navigation sidebar
│   ├── AssessmentAccessPage.tsx  # Assessment login interface
│   ├── AssessmentNavBar.tsx      # Assessment navigation
│   └── LoginPage.tsx   # Admin login interface
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Admin authentication state
│   └── AssessmentContext.tsx # Assessment session state
├── pages/              # Dashboard pages by category
│   ├── overview/       # Executive, maturity, risk, roadmap
│   ├── capabilities/   # AI pillars, skills, departments, personas
│   ├── operations/     # Workflows, opportunities, automation
│   └── assessments/    # Cohort data, individual responses
├── lib/                # Utility functions and services
│   ├── supabase.ts     # Database configuration
│   ├── assessmentAuth.ts # Assessment authentication service
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
- **Role-Based Access**: Support for admin, executive, and manager roles

### Database Configuration

**Environment Variables** (`.env.local`):
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Demo Admin Accounts
```
Platform Admin:
- Email: admin@airplatform.com
- Password: admin123

Executive:
- Email: cto@company.com  
- Password: executive123

Department Manager:
- Email: manager@company.com
- Password: manager123
```

### Authentication Architecture
- **AuthContext** (`src/contexts/AuthContext.tsx`): Admin authentication with Supabase integration
- **AssessmentContext** (`src/contexts/AssessmentContext.tsx`): Session-based assessment state
- **assessmentAuth.ts** (`src/lib/assessmentAuth.ts`): Standalone assessment authentication service
- **LoginPage** (`src/components/LoginPage.tsx`): Enterprise admin login interface
- **AssessmentAccessPage** (`src/components/AssessmentAccessPage.tsx`): Assessment access interface
- **ProtectedRoute** (`src/components/ProtectedRoute.tsx`): Route guard component

### Security Features
- **Real Database Authentication**: Supabase with Row Level Security policies
- **Dual Authentication Systems**: Separate flows for admin and assessment users
- **Session-Based Assessment**: No pre-registration required for employees
- **Protected Routes**: Automatic redirect to appropriate login
- **Secure Data Storage**: Real-time persistence with proper access controls

## Dual Portal Architecture

The platform supports two distinct access modes with assessment as the primary user flow:

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

### Routing & Navigation
- **Assessment First**: Root URL (`/`) defaults to assessment portal
- **Admin Access**: Available via button in assessment interface or direct `/admin` URL
- **Separate Contexts**: Independent authentication systems for each portal
- **Session Management**: Isolated session handling for admin vs assessment users
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
- **Automatic Response Saving**: Real-time persistence to Supabase database
- **Progress Tracking**: Stored locally and in database by email + cohort
- **Resume Capability**: Continue where left off across browser sessions
- **Cohort Organization**: Group assessments by company initiative/time period
- **Assessment Benefits Display**: Strategic insights, opportunity discovery, personalized results
- **eLearning Integration**: Access to AI training resources, use cases library, PowerPrompts
- **Two-Column Layout**: Benefits and eLearning (left) + assessment form and expectations (right)
- **Demo Account Quick Access**: One-click demo email selection for testing
- **Direct Response Storage**: Responses saved by email + cohort_id (no intermediate participant records)

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
- **Session-Based Assessment Authentication** - No pre-registration required, automatic session creation
- **Dual Portal Architecture** - Assessment portal (default) and admin dashboard
- **Real-Time Data Persistence** - Assessment responses saved directly to database
- **Scalable Architecture** - Ready for 1000+ concurrent users (Vercel + Supabase)
- **Assessment Access Interface** - Two-column layout with benefits, eLearning access, and form
- **Assessment Questionnaire** - Full implementation with progress tracking and response saving
- **Admin Dashboard** - Complete sidebar navigation and page routing
- **Executive Summary** (`pages/overview/ExecutiveSummary.tsx`) - AI health scoring, KPIs, opportunities
- **Company Maturity** - 6-pillar radar charts and gap analysis
- **Risk & Compliance** - Security heatmaps and governance tracking
- **Workflow Insights** (`pages/operations/WorkflowInsights.tsx`) - Process analysis with automation indicators
- **Opportunity Map** - Value/effort matrix for prioritization
- **Enterprise Styling** - Professional design system with Tailwind CSS
- **Demo Accounts** - Test accounts for both assessment and admin portals
- **Assessment Navigation** - Back/exit buttons with proper routing
- **Response Resume** - Continue assessment where left off across sessions

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
- **cohorts** - Assessment batches with access codes (e.g., AIR-2024-Q1)
- **assessment_responses** - Individual responses stored by email + cohort_id
- **assessment_results** - Calculated scores and completion status
- **admin_users** - Dashboard user accounts with role-based access

**Key Design Decisions:**
- **No participants table** - Direct response storage by email + cohort for simplicity
- **Access codes at cohort level** - One code shared by entire company/initiative
- **Session-based assessment** - No pre-registration required
- **Row Level Security** - Database-level access control for multi-tenancy

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
- **Workflow Analysis**: Inferred business processes with automation indicators
- **ROI Modeling**: Time/cost savings with payback period calculations
- **Opportunity Mapping**: Value vs effort prioritization matrix

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

1. **Apply Database Schema**: Run `remove-participants-table.sql` and `APPLY_DATABASE_UPDATES.md`
2. **Environment Variables**: Configure `.env.local` with Supabase credentials
3. **Deploy to Vercel**: Connect GitHub repo with environment variables
4. **Test Access**: Use access code `AIR-2024-Q1` with any email

### Cost Estimate (Monthly)
- **Supabase Pro**: $25/month (500+ connections)
- **Vercel Pro**: $20/month (team features)  
- **Total**: $45/month for enterprise-scale deployment

## Next Steps for Enhancement

1. **Assessment Results Analytics**: Dashboard views of aggregated assessment data
2. **AI Report Generation**: OpenAI integration for personalized insights
3. **eLearning Platform**: Build out AI training platform with use cases and PowerPrompts
4. **Export Functionality**: PDF reports and CSV exports for executives  
5. **Mobile Optimization**: Tablet-friendly responsive design
6. **Advanced Analytics**: Real-time cohort analytics and progress tracking
7. **Custom Branding**: Company logos and color scheme customization

## Support & Documentation

- **Design Brief**: Full requirements available in project documentation
- **Component Library**: Reusable UI components in `src/components/ui/`
- **Utility Functions**: Formatters and helpers in `src/lib/utils.ts`
- **Type Definitions**: Complete data models in `src/types/index.ts`