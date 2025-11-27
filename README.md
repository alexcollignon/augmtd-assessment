# AIR Admin Dashboard

A world-class, enterprise-grade dashboard for AI readiness assessment and due diligence.

## 🎯 Overview

The AIR (AI Readiness) Admin Dashboard provides organizations with a comprehensive view of their AI maturity, workflow inefficiencies, automation opportunities, and strategic roadmap for AI transformation.

### Key Features

- **Executive Summary**: High-level AI health score and strategic insights
- **Company Maturity**: Six-pillar AI maturity assessment framework
- **Risk & Compliance**: AI risk management and regulatory compliance tracking
- **Workflow Insights**: Deep analysis of business processes and inefficiencies
- **Opportunity Mapping**: Value vs effort matrix for automation prioritization
- **Assessment Analytics**: Employee assessment data and insights

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone or download the project
```bash
cd "AI DD"
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Card, Badge, etc.)
│   └── Sidebar.tsx     # Main navigation sidebar
├── pages/              # Dashboard pages organized by category
│   ├── overview/       # Executive, maturity, risk, roadmap
│   ├── capabilities/   # AI pillars, skills, departments
│   ├── operations/     # Workflows, opportunities, automation
│   └── assessments/    # Cohort data, individual responses
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## 📊 Dashboard Categories

### 1. OVERVIEW
- **Executive Summary**: AI health score, top strengths/risks, opportunities
- **Company Maturity**: Six-pillar radar chart and gap analysis
- **Risk & Compliance**: Security heatmap, shadow AI detection
- **Roadmap**: 30/90-day plans and strategic milestones

### 2. CAPABILITIES  
- **AI Pillars**: Strategy, Cost, Organization, Technology, Data, Security
- **Skills & Proficiency**: Employee skill levels and training needs
- **Department Maturity**: Comparative maturity across departments
- **Persona Insights**: Role-based AI readiness analysis

### 3. OPERATIONS (Core Differentiator)
- **Workflow Insights**: Process analysis and automation potential
- **Inefficiency Heatmap**: Visual bottleneck identification
- **Opportunity Map**: Value/effort matrix for prioritization
- **Time & Cost Savings**: ROI projections and business case

### 4. ASSESSMENTS
- **Cohort Overview**: Assessment completion and participation
- **Assessment Explorer**: Searchable employee response data
- **Individual Responses**: Detailed personal profiles
- **Exports**: Data export and executive reporting

## 🎨 Design System

### Colors
- **Navy**: Primary navigation and headers (#0f172a to #475569)
- **Success**: Positive metrics and achievements (#22c55e)
- **Warning**: Medium-risk items and cautions (#f59e0b) 
- **Danger**: High-risk items and critical issues (#ef4444)

### Components
- **Cards**: Primary content containers with shadows
- **Metric Cards**: Highlighted KPI displays with icons
- **Badges**: Status indicators and labels
- **Circular Progress**: Score visualizations with color coding

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom design system
- **Recharts**: Interactive data visualizations
- **Lucide React**: Consistent icon library
- **Vite**: Fast development and build tooling

## 📱 Features Implemented

### ✅ Completed
- [x] Executive Summary with AI health score and key metrics
- [x] Company Maturity radar charts and gap analysis  
- [x] Risk & Compliance dashboard with security heatmaps
- [x] Strategic Roadmap with 30/90-day plans
- [x] Workflow Insights with process analysis
- [x] Opportunity Map with value/effort matrix
- [x] Responsive sidebar navigation
- [x] Enterprise-grade design system
- [x] Interactive data visualizations

### 🚧 Placeholder Pages (Ready for Development)
- [ ] AI Pillars detailed breakdown
- [ ] Skills & Proficiency analytics
- [ ] Department Maturity comparisons
- [ ] Persona-based insights
- [ ] Progress tracking over time
- [ ] Inefficiency heatmap visualizations
- [ ] Automation opportunity rankings
- [ ] Time & cost savings calculators
- [ ] Adoption pattern analysis
- [ ] Investment economics modeling
- [ ] Assessment cohort analytics
- [ ] Individual response details
- [ ] Export functionality

## 🎯 Design Goals Achieved

✅ **Executive-grade**: Clean, professional interface suitable for C-level presentations
✅ **Data-rich yet intuitive**: Complex information presented clearly
✅ **Modular**: Clear category separation with nested tab structure
✅ **Insight-first**: Focus on actionable business intelligence
✅ **Credible**: Aligned with AI due diligence best practices
✅ **Operational**: Workflow and ROI focused

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🌐 Live Demo

The dashboard is running at: `http://localhost:3000`

Navigate through the sidebar to explore:
1. **Overview > Executive Summary** - Fully functional showcase
2. **Overview > Company Maturity** - Interactive radar charts
3. **Overview > Risk & Compliance** - Security and governance
4. **Operations > Workflow Insights** - Process analysis  
5. **Operations > Opportunity Map** - Value/effort matrix

## 💡 Next Steps

1. Connect to real assessment data APIs
2. Implement remaining placeholder pages
3. Add user authentication and role-based access
4. Integrate with existing enterprise systems
5. Add export and reporting functionality
6. Mobile optimization for tablet access

---

**Built with ❤️ for enterprise AI transformation**