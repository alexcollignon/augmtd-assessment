import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { 
  Building2, 
  Users, 
  AlertTriangle,
  Clock,
  DollarSign,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompanyAIMaturityProps {
  companyName?: string
}

interface MaturityLevel {
  level: string
  description: string
  characteristics: string[]
  nextPhase: string
  typicalTimeframe: string
  investmentLevel: string
  riskLevel: 'low' | 'medium' | 'high'
}

export function CompanyAIMaturity({ companyName = "your organization" }: CompanyAIMaturityProps) {
  
  // Mock company data - in real implementation, this would come from aggregated assessment results
  const companyMetrics = {
    overallMaturity: 58,
    participationRate: 73,
    totalParticipants: 247,
    departmentScores: {
      'Data, AI & Digital': 78,
      'Strategy, Innovation & Transformation': 71,
      'Product, R&D & Services': 65,
      'Executive Office / Board': 62,
      'Marketing, Sales & Customer': 54,
      'Finance, Legal & Risk': 51,
      'Operations & Delivery': 48,
      'HR, Learning & Culture': 45,
      'Customer Support & Success': 42
    },
    timeToValue: '6-12 months',
    investmentNeeded: 'Moderate',
    keyRisks: ['Skills gaps', 'Change resistance', 'Data quality']
  }

  const getMaturityLevel = (score: number): MaturityLevel => {
    if (score >= 75) {
      return {
        level: 'AI-Advanced',
        description: 'Sophisticated AI integration with enterprise-wide adoption and innovation',
        characteristics: [
          'AI strategy integrated into business strategy',
          'Cross-functional AI teams and governance',
          'Advanced AI use cases in production',
          'Strong data infrastructure and MLOps',
          'Cultural embrace of human-AI collaboration'
        ],
        nextPhase: 'AI Leadership & Innovation',
        typicalTimeframe: 'Continuous evolution',
        investmentLevel: 'Strategic',
        riskLevel: 'low'
      }
    } else if (score >= 60) {
      return {
        level: 'AI-Scaling',
        description: 'Expanding AI adoption across departments with growing organizational capabilities',
        characteristics: [
          'Multiple AI initiatives underway',
          'Dedicated AI teams and budget',
          'Standardized AI tools and processes',
          'Growing employee AI literacy',
          'Clear AI success metrics'
        ],
        nextPhase: 'Enterprise AI Integration',
        typicalTimeframe: '12-18 months',
        investmentLevel: 'Significant',
        riskLevel: 'medium'
      }
    } else if (score >= 40) {
      return {
        level: 'AI-Adopting',
        description: 'Early AI adoption with pockets of success and growing awareness',
        characteristics: [
          'Pilot AI projects showing value',
          'Basic AI tools in use by some teams',
          'Initial AI training programs',
          'Leadership support for AI initiatives',
          'Foundation data infrastructure'
        ],
        nextPhase: 'Systematic AI Deployment',
        typicalTimeframe: '9-15 months',
        investmentLevel: 'Moderate',
        riskLevel: 'medium'
      }
    } else {
      return {
        level: 'AI-Exploring',
        description: 'Beginning to explore AI potential with limited current implementation',
        characteristics: [
          'Individual AI experimentation',
          'Basic awareness of AI opportunities',
          'Limited formal AI strategy',
          'Traditional workflows predominate',
          'Cautious approach to AI adoption'
        ],
        nextPhase: 'Structured AI Piloting',
        typicalTimeframe: '6-12 months',
        investmentLevel: 'Low to Moderate',
        riskLevel: 'high'
      }
    }
  }

  const maturityLevel = getMaturityLevel(companyMetrics.overallMaturity)

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }


  return (
    <div className="space-y-6">
      {/* Maturity Overview Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>{companyName}'s AI Maturity Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Score */}
            <div className="text-center">
              <CircularProgress 
                value={companyMetrics.overallMaturity} 
                size={120}
                strokeWidth={8}
                className="mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall Maturity</h3>
              <Badge className="bg-blue-100 text-blue-800 mb-2">
                {maturityLevel.level}
              </Badge>
              <p className="text-sm text-gray-600">{maturityLevel.description}</p>
            </div>

            {/* Key Metrics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Participation</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{companyMetrics.participationRate}%</div>
                  <div className="text-xs text-gray-500">{companyMetrics.totalParticipants} employees</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Time to Value</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{companyMetrics.timeToValue}</div>
                  <div className="text-xs text-gray-500">Expected timeline</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">Investment</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{companyMetrics.investmentNeeded}</div>
                  <div className="text-xs text-gray-500">Resource requirement</div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-orange-600" />
                Key Implementation Risks
              </h4>
              <div className="space-y-2">
                {companyMetrics.keyRisks.map((risk, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-700">{risk}</span>
                  </div>
                ))}
              </div>
              <Badge className={cn("mt-3", getRiskColor(maturityLevel.riskLevel))}>
                {maturityLevel.riskLevel.toUpperCase()} Risk Level
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}