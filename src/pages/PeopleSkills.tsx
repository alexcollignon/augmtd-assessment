import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { 
  Users, 
  TrendingUp, 
  Star, 
  Award,
  Target,
  Clock,
  Brain,
  BookOpen,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export function PeopleSkills() {
  const [selectedRole, setSelectedRole] = useState('all')
  
  const roleData = {
    'Software Engineer': { count: 45, avgSkill: 89, topSkills: ['AI Tool Proficiency', 'Process Automation', 'Data Analysis'] },
    'Marketing Specialist': { count: 28, avgSkill: 84, topSkills: ['Creative Applications', 'Prompt Engineering', 'AI Tool Proficiency'] },
    'Sales Representative': { count: 32, avgSkill: 71, topSkills: ['AI Tool Proficiency', 'Creative Applications', 'Prompt Engineering'] },
    'Financial Analyst': { count: 18, avgSkill: 79, topSkills: ['Data Analysis', 'Process Automation', 'AI Tool Proficiency'] },
    'Project Manager': { count: 24, avgSkill: 73, topSkills: ['Process Automation', 'AI Tool Proficiency', 'Data Analysis'] },
    'HR Specialist': { count: 16, avgSkill: 68, topSkills: ['AI Ethics & Bias', 'AI Tool Proficiency', 'Process Automation'] }
  }

  const skillCategories = [
    {
      category: 'AI Tool Proficiency',
      avgScore: 78,
      trend: '+12%',
      topPerformers: 23,
      strugglers: 18,
      description: 'Basic to advanced usage of AI tools like ChatGPT, Copilot, etc.'
    },
    {
      category: 'Prompt Engineering', 
      avgScore: 74,
      trend: '+8%',
      topPerformers: 19,
      strugglers: 23,
      description: 'Crafting effective prompts for optimal AI responses'
    },
    {
      category: 'Data Analysis with AI',
      avgScore: 72,
      trend: '+15%', 
      topPerformers: 15,
      strugglers: 22,
      description: 'Using AI for data processing, visualization, and insights'
    },
    {
      category: 'Process Automation',
      avgScore: 69,
      trend: '+6%',
      topPerformers: 12,
      strugglers: 35,
      description: 'Identifying and implementing workflow automation opportunities'
    },
    {
      category: 'AI Ethics & Bias',
      avgScore: 80,
      trend: '+3%',
      topPerformers: 34,
      strugglers: 13,
      description: 'Understanding responsible AI use and bias detection'
    },
    {
      category: 'Creative Applications',
      avgScore: 77,
      trend: '+18%',
      topPerformers: 21,
      strugglers: 22,
      description: 'Using AI for creative tasks like content generation, design'
    }
  ]

  const personaProfiles = [
    {
      persona: 'AI Champions',
      count: 89,
      percentage: 7,
      avgScore: 92,
      description: 'Advanced users leading AI adoption in their teams',
      characteristics: ['Experiment with new AI tools', 'Mentor colleagues', 'Drive innovation'],
      nextSteps: ['Become internal AI trainers', 'Lead pilot projects', 'Evaluate new AI solutions']
    },
    {
      persona: 'Active Adopters',
      count: 312,
      percentage: 25,
      avgScore: 81,
      description: 'Regular AI users with solid foundational skills',
      characteristics: ['Use AI tools daily', 'Comfortable with basics', 'Open to learning'],
      nextSteps: ['Advanced skill workshops', 'Cross-functional projects', 'Automation training']
    },
    {
      persona: 'Cautious Learners',
      count: 498,
      percentage: 40,
      avgScore: 67,
      description: 'Interested but need guidance and support',
      characteristics: ['Occasional AI use', 'Want more training', 'Need clear guidelines'],
      nextSteps: ['Structured learning paths', 'Hands-on workshops', 'Peer mentoring']
    },
    {
      persona: 'Resistant Users',
      count: 234,
      percentage: 19,
      avgScore: 45,
      description: 'Skeptical about AI value or lack confidence',
      characteristics: ['Minimal AI use', 'Prefer traditional methods', 'Need convincing'],
      nextSteps: ['Show quick wins', 'Address concerns', 'Start with simple tools']
    },
    {
      persona: 'Non-Users',
      count: 114,
      percentage: 9,
      avgScore: 28,
      description: 'Have not engaged with AI tools yet',
      characteristics: ['No current AI use', 'May lack awareness', 'Need basic introduction'],
      nextSteps: ['AI awareness sessions', 'Basic tool training', 'Success story sharing']
    }
  ]

  const progressData = [
    { month: 'Jan 2024', avgScore: 62, assessmentCount: 987 },
    { month: 'Feb 2024', avgScore: 64, assessmentCount: 1089 },
    { month: 'Mar 2024', avgScore: 67, assessmentCount: 1156 },
    { month: 'Apr 2024', avgScore: 70, assessmentCount: 1203 },
    { month: 'May 2024', avgScore: 74, assessmentCount: 1247 },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">People & Skills</h1>
        <p className="text-gray-600 mt-2">
          Employee AI capabilities, personas, and development progress across the organization
        </p>
      </div>

      {/* Skills Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <p className="text-sm text-gray-600">Employees Assessed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <Brain className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">74%</div>
            <p className="text-sm text-gray-600">Average AI Skill Level</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">89</div>
            <p className="text-sm text-gray-600">AI Champions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">+12%</div>
            <p className="text-sm text-gray-600">Growth This Quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Skill Categories Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 text-blue-600 mr-2" />
            AI Skills Performance by Category
          </CardTitle>
          <p className="text-sm text-gray-600">Average proficiency across six key AI skill areas</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {skillCategories.map((skill, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{skill.category}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant={skill.avgScore >= 80 ? 'success' : skill.avgScore >= 70 ? 'warning' : 'danger'} size="sm">
                      {skill.avgScore}%
                    </Badge>
                    <span className="text-sm text-green-600 font-medium">{skill.trend}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">{skill.topPerformers} top performers (80%+)</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                    <span className="text-gray-700">{skill.strugglers} need support (&lt;60%)</span>
                  </div>
                </div>
                <div className="mt-3 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      skill.avgScore >= 80 ? 'bg-green-500' : 
                      skill.avgScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${skill.avgScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employee Personas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 text-purple-600 mr-2" />
            Employee AI Personas
          </CardTitle>
          <p className="text-sm text-gray-600">Workforce segmentation based on AI adoption and skill levels</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {personaProfiles.map((persona, index) => (
              <div key={index} className="p-5 border-l-4 border-purple-400 bg-purple-50 rounded-r-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">{persona.persona}</h3>
                    <Badge variant={
                      persona.avgScore >= 85 ? 'success' : 
                      persona.avgScore >= 70 ? 'warning' : 
                      persona.avgScore >= 50 ? 'info' : 'danger'
                    }>
                      {persona.avgScore}% avg
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-700">{persona.count}</div>
                    <div className="text-sm text-gray-600">{persona.percentage}% of workforce</div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{persona.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Characteristics:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {persona.characteristics.map((char, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-purple-500 mr-2">•</span>
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Recommended Next Steps:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {persona.nextSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start">
                          <ArrowRight className="w-3 h-3 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role-Based Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 text-orange-600 mr-2" />
            Performance by Role
          </CardTitle>
          <p className="text-sm text-gray-600">AI skill levels across different job functions</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(roleData).map(([role, data], index) => (
              <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{role}</h4>
                  <CircularProgress value={data.avgSkill} size="sm" />
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">{data.count}</span> employees
                </div>
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-1">Top Skills:</h5>
                  <div className="flex flex-wrap gap-1">
                    {data.topSkills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="text-xs bg-white px-2 py-1 rounded border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 text-green-600 mr-2" />
            Progress Over Time
          </CardTitle>
          <p className="text-sm text-gray-600">AI skill development trajectory across the organization</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Monthly Progress</h4>
              <div className="space-y-4">
                {progressData.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{month.month}</div>
                      <div className="text-sm text-gray-600">{month.assessmentCount} assessments</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{month.avgScore}%</div>
                      {index > 0 && (
                        <div className="text-sm text-green-600">
                          +{month.avgScore - progressData[index-1].avgScore}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Key Achievements</h4>
              <div className="space-y-4">
                {[
                  { achievement: '312 employees moved from Cautious to Active adopters', impact: 'High', timeframe: 'Last 3 months' },
                  { achievement: '89 AI Champions identified and engaged', impact: 'High', timeframe: 'Last 2 months' },
                  { achievement: '23% reduction in employees needing foundational training', impact: 'Medium', timeframe: 'Last quarter' },
                  { achievement: 'Creative Applications saw +18% improvement', impact: 'Medium', timeframe: 'Last month' },
                  { achievement: '67% of workforce now actively using AI tools', impact: 'High', timeframe: 'Current' }
                ].map((achievement, index) => (
                  <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm text-gray-700 flex-1">{achievement.achievement}</p>
                      <Badge variant={achievement.impact === 'High' ? 'success' : 'warning'} size="sm">
                        {achievement.impact}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">{achievement.timeframe}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning & Development Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 text-indigo-600 mr-2" />
            Learning & Development Priorities
          </CardTitle>
          <p className="text-sm text-gray-600">Targeted training recommendations based on assessment data</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Immediate Priorities (Next 30 days)</h4>
              <div className="space-y-3">
                {[
                  { priority: 'Process Automation Training for 35 employees', urgency: 'High', effort: 'Medium' },
                  { priority: 'Prompt Engineering Workshop for Marketing team', urgency: 'High', effort: 'Low' },
                  { priority: 'AI Tool Proficiency basics for 48 non-users', urgency: 'Medium', effort: 'Low' }
                ].map((item, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.priority}</span>
                      <div className="flex space-x-2">
                        <Badge variant={item.urgency === 'High' ? 'danger' : 'warning'} size="sm">
                          {item.urgency}
                        </Badge>
                        <Badge variant={item.effort === 'Low' ? 'success' : 'warning'} size="sm">
                          {item.effort} effort
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Long-term Development (Next 90 days)</h4>
              <div className="space-y-3">
                {[
                  { priority: 'Advanced AI applications for Champions', impact: 'High', timeline: '6-8 weeks' },
                  { priority: 'Cross-departmental AI mentorship program', impact: 'High', timeline: '8-12 weeks' },
                  { priority: 'AI ethics certification for all employees', impact: 'Medium', timeline: '4-6 weeks' }
                ].map((item, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.priority}</span>
                      <Badge variant={item.impact === 'High' ? 'success' : 'info'} size="sm">
                        {item.impact} impact
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">{item.timeline}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}