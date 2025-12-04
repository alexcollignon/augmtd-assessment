import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DimensionScore } from '@/types'
import { 
  MessageSquare, 
  Wrench, 
  Shield, 
  Brain, 
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Lightbulb,
  Clock,
  Zap
} from 'lucide-react'
import { cn, getScoreColor } from '@/lib/utils'

interface DimensionDeepDiveProps {
  dimension: DimensionScore
  userRole?: string
  userDepartment?: string
}

interface DimensionInsight {
  title: string
  description: string
  icon: React.ComponentType<any>
  businessImpact: string
  whatItMeans: string
  nextSteps: string[]
  commonChallenges: string[]
  businessValue: string
}

export function DimensionDeepDive({ dimension, userRole, userDepartment }: DimensionDeepDiveProps) {
  
  const getDimensionInsights = (dimensionName: string, score: number): DimensionInsight => {
    const insights: Record<string, DimensionInsight> = {
      'Prompting Proficiency': {
        title: 'AI Communication Skills',
        description: 'Your ability to effectively communicate with AI tools to get the results you need.',
        icon: MessageSquare,
        businessImpact: score >= 70 
          ? 'You can consistently get high-quality outputs from AI tools, saving 2-4 hours per week on routine tasks.'
          : score >= 40
            ? 'You get decent results from AI but often need multiple attempts, limiting time savings.'
            : 'You struggle to get useful outputs, missing out on significant productivity gains.',
        whatItMeans: score >= 70
          ? 'You understand how to structure requests, provide context, and iterate effectively with AI tools.'
          : score >= 40
            ? 'You have basic prompting skills but lack advanced techniques for complex tasks.'
            : 'You need foundational training in AI communication to unlock productivity benefits.',
        nextSteps: score >= 70
          ? ['Share your prompting expertise with teammates', 'Explore advanced prompt engineering patterns', 'Create prompt templates for your team']
          : score >= 40
            ? ['Practice multi-step prompting techniques', 'Learn to define AI roles and output formats', 'Study successful prompt examples in your field']
            : ['Start with basic prompting fundamentals', 'Use simple, specific requests', 'Practice with everyday tasks like email drafting'],
        commonChallenges: score >= 70
          ? ['Keeping up with new AI model capabilities', 'Training others effectively']
          : score >= 40
            ? ['Getting consistent quality outputs', 'Handling complex, multi-part requests']
            : ['Getting AI to understand what I want', 'Knowing how to structure questions'],
        businessValue: score >= 70
          ? '15-25% productivity boost on knowledge work'
          : score >= 40
            ? '8-15% productivity boost potential'
            : '5-10% productivity boost with training'
      },
      
      'Tool Use': {
        title: 'AI Tool Adoption & Integration',
        description: 'How effectively you use and integrate AI tools into your daily workflows.',
        icon: Wrench,
        businessImpact: score >= 70
          ? 'You leverage multiple AI tools efficiently, creating automated workflows that save significant time.'
          : score >= 40
            ? 'You use some AI tools regularly but haven\'t fully integrated them into your processes.'
            : 'You rarely use AI tools, missing opportunities to streamline your work.',
        whatItMeans: score >= 70
          ? 'You actively seek out and adopt new AI tools that solve specific business problems.'
          : score >= 40
            ? 'You\'re comfortable with basic AI tools but could expand your toolkit.'
            : 'You\'re hesitant to try new AI tools or don\'t know which ones would help.',
        nextSteps: score >= 70
          ? ['Become an AI champion for your department', 'Evaluate enterprise AI solutions', 'Build custom AI integrations']
          : score >= 40
            ? ['Experiment with 2-3 new AI tools monthly', 'Automate one repetitive task with AI', 'Share tool recommendations with colleagues']
            : ['Start with one reliable AI tool (like ChatGPT)', 'Identify your top 3 time-consuming tasks', 'Ask colleagues which tools they use'],
        commonChallenges: score >= 70
          ? ['Keeping track of too many tools', 'Helping others catch up']
          : score >= 40
            ? ['Finding the right tool for specific tasks', 'Data security concerns']
            : ['Not knowing which tools to trust', 'Feeling overwhelmed by options'],
        businessValue: score >= 70
          ? '20-30% efficiency gains through tool mastery'
          : score >= 40
            ? '10-20% efficiency gains possible'
            : '5-15% efficiency gains with basic adoption'
      },
      
      'Ethics & Responsible Use': {
        title: 'Responsible AI Practices',
        description: 'Your understanding of ethical AI use, data privacy, and responsible deployment.',
        icon: Shield,
        businessImpact: score >= 70
          ? 'You help ensure your organization avoids AI-related risks and compliance issues.'
          : score >= 40
            ? 'You have basic awareness but could strengthen risk management practices.'
            : 'You may unknowingly expose your organization to AI-related risks.',
        whatItMeans: score >= 70
          ? 'You actively consider ethical implications and guide others in responsible AI use.'
          : score >= 40
            ? 'You understand basic principles but need more practical application knowledge.'
            : 'You need fundamental education on AI ethics and risk management.',
        nextSteps: score >= 70
          ? ['Lead AI ethics discussions in your team', 'Develop AI use guidelines', 'Monitor emerging ethical standards']
          : score >= 40
            ? ['Review your company\'s AI policies', 'Learn about bias detection', 'Practice identifying sensitive data']
            : ['Understand basic data privacy principles', 'Learn to recognize AI limitations', 'Ask before sharing sensitive information'],
        commonChallenges: score >= 70
          ? ['Balancing innovation with caution', 'Educating resistant colleagues']
          : score >= 40
            ? ['Knowing where to draw ethical lines', 'Keeping up with regulations']
            : ['Understanding what data is safe to use', 'Knowing when AI output might be biased'],
        businessValue: score >= 70
          ? 'Significant risk reduction and compliance assurance'
          : score >= 40
            ? 'Moderate risk reduction with room for improvement'
            : 'High risk exposure without proper training'
      },
      
      'AI Thinking': {
        title: 'AI Systems Understanding',
        description: 'Your grasp of how AI works and how to prepare data for AI applications.',
        icon: Brain,
        businessImpact: score >= 70
          ? 'You can design AI solutions and prepare high-quality data for AI initiatives.'
          : score >= 40
            ? 'You understand AI basics but need deeper technical knowledge for advanced applications.'
            : 'You lack the foundation to contribute effectively to AI initiatives.',
        whatItMeans: score >= 70
          ? 'You understand AI capabilities and limitations, enabling strategic AI decisions.'
          : score >= 40
            ? 'You have conceptual understanding but struggle with practical implementation.'
            : 'You need foundational knowledge about how AI systems work.',
        nextSteps: score >= 70
          ? ['Lead AI strategy discussions', 'Mentor others on AI concepts', 'Evaluate AI vendor solutions']
          : score >= 40
            ? ['Learn about data quality requirements', 'Understand AI model limitations', 'Study AI applications in your industry']
            : ['Take an AI fundamentals course', 'Learn basic data concepts', 'Understand what makes data "AI-ready"'],
        commonChallenges: score >= 70
          ? ['Explaining complex concepts simply', 'Staying current with rapid changes']
          : score >= 40
            ? ['Translating concepts into practice', 'Understanding technical trade-offs']
            : ['Feeling intimidated by technical jargon', 'Not knowing where to start learning'],
        businessValue: score >= 70
          ? 'Strategic AI leadership and solution design capability'
          : score >= 40
            ? 'Contributing meaningfully to AI initiatives'
            : 'Building foundation for future AI involvement'
      },
      
      'Co-Intelligence': {
        title: 'Human-AI Collaboration',
        description: 'How well you work alongside AI to amplify your capabilities and decision-making.',
        icon: Users,
        businessImpact: score >= 70
          ? 'You seamlessly blend human judgment with AI capabilities, achieving breakthrough productivity.'
          : score >= 40
            ? 'You occasionally collaborate well with AI but haven\'t made it systematic.'
            : 'You primarily use AI as a basic tool rather than a collaborative partner.',
        whatItMeans: score >= 70
          ? 'You treat AI as an intelligent collaborator, leveraging both human and AI strengths.'
          : score >= 40
            ? 'You see AI\'s potential but haven\'t developed consistent collaboration patterns.'
            : 'You view AI as just another software tool rather than a thinking partner.',
        nextSteps: score >= 70
          ? ['Design human-AI workflows for your team', 'Experiment with AI co-creation', 'Develop decision-making frameworks']
          : score >= 40
            ? ['Practice iterative problem-solving with AI', 'Use AI for brainstorming sessions', 'Develop quality review processes']
            : ['Start using AI for ideation', 'Practice delegating routine tasks to AI', 'Learn to verify AI outputs'],
        commonChallenges: score >= 70
          ? ['Maintaining human oversight', 'Teaching others collaboration skills']
          : score >= 40
            ? ['Knowing when to trust AI vs. human judgment', 'Building consistent workflows']
            : ['Understanding what AI can and cannot do', 'Overcoming reluctance to rely on AI'],
        businessValue: score >= 70
          ? '25-40% productivity boost through true collaboration'
          : score >= 40
            ? '10-25% productivity boost potential'
            : '5-15% productivity boost with mindset shift'
      }
    }

    return insights[dimensionName] || insights['Prompting Proficiency']
  }

  const insight = getDimensionInsights(dimension.dimension, dimension.percentage)
  const IconComponent = insight.icon

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { label: 'Advanced', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    if (score >= 60) return { label: 'Proficient', color: 'bg-blue-100 text-blue-800', icon: Target }
    if (score >= 40) return { label: 'Developing', color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp }
    return { label: 'Beginner', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
  }

  const scoreLevel = getScoreLevel(dimension.percentage)
  const ScoreLevelIcon = scoreLevel.icon

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{insight.title}</CardTitle>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={cn("text-3xl font-bold", getScoreColor(dimension.percentage))}>
              {dimension.percentage}%
            </div>
            <Badge className={cn("text-xs", scoreLevel.color)}>
              <ScoreLevelIcon className="w-3 h-3 mr-1" />
              {scoreLevel.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Business Impact */}
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Business Impact</h4>
              <p className="text-sm text-blue-800">{insight.businessImpact}</p>
              <div className="mt-2 text-xs font-medium text-blue-700">
                Expected Value: {insight.businessValue}
              </div>
            </div>
          </div>
        </div>

        {/* What This Means */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <h4 className="font-semibold text-gray-900">What This Means</h4>
            </div>
            <p className="text-sm text-gray-700">{insight.whatItMeans}</p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <h4 className="font-semibold text-gray-900">Common Challenges</h4>
            </div>
            <ul className="space-y-1">
              {insight.commonChallenges.map((challenge, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-gray-900">Your Next Steps</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {insight.nextSteps.map((step, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-sm text-green-800">{step}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role-Specific Insights */}
        {userRole && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">For {userRole}s</h4>
                <p className="text-sm text-purple-800">
                  {getRoleSpecificInsight(dimension.dimension, userRole, dimension.percentage)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getRoleSpecificInsight(dimension: string, role: string, score: number): string {
  const insights: Record<string, Record<string, string>> = {
    'Prompting Proficiency': {
      'Executive / C-Level Leader': score >= 70 
        ? 'Champion AI adoption across your organization and set strategic direction for AI communication standards.'
        : 'Focus on understanding AI capabilities to make informed strategic decisions and lead by example.',
      'Team or Department Manager': score >= 70
        ? 'Train your team on effective AI communication and establish best practices for your department.'
        : 'Develop your skills first, then create learning opportunities for your team members.',
      'Technical Expert / Engineer': score >= 70
        ? 'Help integrate AI tools into technical workflows and assist colleagues with advanced prompting.'
        : 'Apply your technical mindset to understand prompt engineering as a new form of programming.',
    },
    'Tool Use': {
      'Executive / C-Level Leader': score >= 70
        ? 'Evaluate enterprise AI platforms and drive organization-wide tool adoption strategies.'
        : 'Start with executive-focused AI tools for research, analysis, and strategic planning.',
      'Team or Department Manager': score >= 70
        ? 'Identify which tools would benefit your team most and create adoption plans.'
        : 'Test tools yourself before recommending them to your team members.',
      'Technical Expert / Engineer': score >= 70
        ? 'Explore AI development tools and help integrate AI capabilities into existing systems.'
        : 'Focus on AI tools that enhance your technical productivity and code quality.',
    }
  }

  return insights[dimension]?.[role] || `As a ${role}, focus on applying ${dimension.toLowerCase()} skills to your specific responsibilities and team needs.`
}