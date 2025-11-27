# AIR Admin Dashboard - Claude Project Context

## Project Overview

**AIR (AI Readiness) Admin Dashboard** is an enterprise-grade platform for AI due diligence and workflow optimization. It transforms employee AI assessment data into actionable business intelligence for C-suite executives and department leaders.

### Purpose
- **Primary Users**: CIO, CTO, COO, Chief Data Officer, Heads of Operations, AI Program Managers
- **Core Value**: Single pane of glass for AI readiness assessment, workflow inefficiencies, and automation opportunities
- **Differentiator**: Operational focus on ROI modeling and workflow intelligence, not just maturity scoring

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom enterprise design system
- **Icons**: Lucide React
- **Charts**: Recharts for data visualizations
- **Build Tool**: Vite with React plugin

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (Card, Badge, MetricCard, etc.)
│   └── Sidebar.tsx     # Main navigation sidebar
├── pages/              # Dashboard pages by category
│   ├── overview/       # Executive, maturity, risk, roadmap
│   ├── capabilities/   # AI pillars, skills, departments, personas
│   ├── operations/     # Workflows, opportunities, automation
│   └── assessments/    # Cohort data, individual responses
├── lib/                # Utility functions (formatters, styling)
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

### Demo User Accounts
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
- **AuthContext** (`src/contexts/AuthContext.tsx`): Centralized auth state management
- **LoginPage** (`src/components/LoginPage.tsx`): Enterprise-styled login interface
- **ProtectedRoute** (`src/components/ProtectedRoute.tsx`): Route guard component
- **User Management**: Profile display and logout functionality in sidebar

### Security Features
- Protected routes with automatic redirect to login
- Secure session handling with loading states
- Enterprise-grade login interface with demo account access
- User profile display with role-based information

## Dual Portal Architecture

The platform supports two distinct access modes with assessment as the primary user flow:

### 1. Assessment Portal (Default - `/` root route)
- **Users**: Workforce/employees taking AI readiness assessments
- **Authentication**: Work email + access code system  
- **Purpose**: Complete individual AI assessment questionnaires
- **Access**: Direct access from root URL

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

### Assessment Access System

#### Access Method
Employees access assessments using:
- **Work Email**: Their company email address
- **Access Code**: Unique code provided by HR/IT (format: ASS2024XXX)

#### Demo Assessment Accounts
```
John Smith (Engineering):
- Email: john.smith@company.com
- Code: ASS2024001
- Status: Not Started

Sarah Jones (Marketing):  
- Email: sarah.jones@company.com
- Code: ASS2024002
- Status: 45% Complete

Mike Wilson (Finance):
- Email: mike.wilson@company.com  
- Code: ASS2024003
- Status: Completed

Lisa Chen (HR):
- Email: lisa.chen@company.com
- Code: ASS2024004
- Status: Not Started
```

#### Assessment Features
- **Progress Tracking**: Automatic save of completion percentage
- **Session Management**: Resume where left off
- **Participant Info**: Name, department, role tracking
- **Cohort Organization**: Group assessments by time period/initiative
- **Assessment Benefits Display**: Strategic insights, opportunity discovery, personalized results
- **eLearning Integration**: Access to AI training resources, use cases library, PowerPrompts
- **Two-Column Layout**: Benefits and eLearning (left) + assessment form and expectations (right)
- **Demo Account Quick Access**: One-click demo participant selection for testing

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
- **Dual Portal Architecture** - Assessment portal (default) and admin dashboard
- **Authentication Systems** - Separate auth for employees (email+code) and admins (email+password)
- **Assessment Access Interface** - Two-column layout with benefits, eLearning access, and form
- **Admin Dashboard** - Complete sidebar navigation and page routing
- **Executive Summary** (`pages/overview/ExecutiveSummary.tsx`) - AI health scoring, KPIs, opportunities
- **Company Maturity** - 6-pillar radar charts and gap analysis
- **Risk & Compliance** - Security heatmaps and governance tracking
- **Workflow Insights** (`pages/operations/WorkflowInsights.tsx`) - Process analysis with automation indicators
- **Opportunity Map** - Value/effort matrix for prioritization
- **Enterprise Styling** - Professional design system with Tailwind CSS
- **Demo Accounts** - Test accounts for both assessment and admin portals

### 🚧 Placeholder Pages (Ready for Development)
- Assessment questionnaire implementation
- Most capabilities pages (AI pillars, skills, departments)
- Remaining operations pages (heatmaps, time/cost savings, adoption patterns)
- Assessment pages (cohort analytics, individual responses, exports)
- eLearning platform integration

### 📁 Repository Information
- **GitHub Repository**: https://github.com/alexcollignon/air-dd.git
- **Branch**: master
- **Last Updated**: Clean project setup with dual portal architecture
- **Status**: Production-ready foundation with demo accounts

## Data Models & Types

Key TypeScript interfaces defined in `types/index.ts`:

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

## Next Steps for Development

1. **Assessment Questionnaire**: Implement the actual assessment questions and scoring logic
2. **eLearning Platform**: Build out the AI training platform with use cases and PowerPrompts
3. **Connect Real Data**: Replace mock data with API integrations
4. **Complete Placeholder Pages**: Implement remaining dashboard pages per design brief
5. **Export Functionality**: PDF reports and CSV exports for executives
6. **Mobile Optimization**: Tablet-friendly responsive design
7. **Advanced Analytics**: Real-time assessment analytics and participant progress tracking

## Support & Documentation

- **Design Brief**: Full requirements available in project documentation
- **Component Library**: Reusable UI components in `src/components/ui/`
- **Utility Functions**: Formatters and helpers in `src/lib/utils.ts`
- **Type Definitions**: Complete data models in `src/types/index.ts`