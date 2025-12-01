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
  AlertCircle,
  BarChart3,
  Grid3x3,
  Building2
} from 'lucide-react'

export function PeopleSkills() {
  const [selectedRole, setSelectedRole] = useState('all')
  const [skillDistributionView, setSkillDistributionView] = useState<'heatmap' | 'detail'>('heatmap')
  const [selectedDistributionDept, setSelectedDistributionDept] = useState('Engineering')
  
  const roleData = {
    'Software Engineer': { count: 45, avgSkill: 89, topSkills: ['Tools', 'Data', 'Co-Intelligence'] },
    'Marketing Specialist': { count: 28, avgSkill: 84, topSkills: ['Prompting', 'Tools', 'Co-Intelligence'] },
    'Sales Representative': { count: 32, avgSkill: 71, topSkills: ['Prompting', 'Tools', 'Co-Intelligence'] },
    'Financial Analyst': { count: 18, avgSkill: 79, topSkills: ['Data', 'Tools', 'Responsible Use'] },
    'Project Manager': { count: 24, avgSkill: 73, topSkills: ['Co-Intelligence', 'Tools', 'Data'] },
    'HR Specialist': { count: 16, avgSkill: 68, topSkills: ['Responsible Use', 'Tools', 'Co-Intelligence'] }
  }

  const skillCategories = [
    {
      category: 'Prompting',
      avgScore: 74,
      trend: '+8%',
      topPerformers: 19,
      strugglers: 23,
      description: 'Crafting effective prompts and conversing with AI systems'
    },
    {
      category: 'Tools',
      avgScore: 78,
      trend: '+12%',
      topPerformers: 23,
      strugglers: 18,
      description: 'Proficiency with AI platforms, applications, and integrations'
    },
    {
      category: 'Responsible Use',
      avgScore: 80,
      trend: '+3%',
      topPerformers: 34,
      strugglers: 13,
      description: 'Understanding AI ethics, bias awareness, and governance'
    },
    {
      category: 'Data',
      avgScore: 72,
      trend: '+15%', 
      topPerformers: 15,
      strugglers: 22,
      description: 'Data literacy, quality assessment, and AI-driven analysis'
    },
    {
      category: 'Co-Intelligence',
      avgScore: 69,
      trend: '+6%',
      topPerformers: 12,
      strugglers: 35,
      description: 'Human-AI collaboration and augmented decision-making'
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

  // Department-specific skill scores for heatmap
  const departmentSkillScores = {
    Engineering: { prompting: 85, tools: 89, responsibleUse: 76, data: 92, coIntelligence: 88 },
    Sales: { prompting: 68, tools: 72, responsibleUse: 71, data: 58, coIntelligence: 64 },
    Marketing: { prompting: 91, tools: 84, responsibleUse: 78, data: 67, coIntelligence: 79 },
    Finance: { prompting: 71, tools: 76, responsibleUse: 89, data: 88, coIntelligence: 82 },
    HR: { prompting: 74, tools: 69, responsibleUse: 85, data: 61, coIntelligence: 68 },
    Operations: { prompting: 73, tools: 81, responsibleUse: 82, data: 79, coIntelligence: 91 },
  }

  // Department-specific skill distribution (Advanced/Intermediate/Basic/Beginner percentages)
  const departmentSkillDistribution = {
    Engineering: {
      'Prompting': { advanced: 38, intermediate: 30, basic: 22, beginner: 10 },
      'Tools': { advanced: 45, intermediate: 35, basic: 15, beginner: 5 },
      'Responsible Use': { advanced: 25, intermediate: 35, basic: 30, beginner: 10 },
      'Data': { advanced: 52, intermediate: 28, basic: 15, beginner: 5 },
      'Co-Intelligence': { advanced: 42, intermediate: 35, basic: 18, beginner: 5 }
    },
    Sales: {
      'Prompting': { advanced: 5, intermediate: 18, basic: 38, beginner: 39 },
      'Tools': { advanced: 8, intermediate: 25, basic: 35, beginner: 32 },
      'Responsible Use': { advanced: 18, intermediate: 28, basic: 32, beginner: 22 },
      'Data': { advanced: 3, intermediate: 15, basic: 32, beginner: 50 },
      'Co-Intelligence': { advanced: 5, intermediate: 12, basic: 28, beginner: 55 }
    },
    Marketing: {
      'Prompting': { advanced: 48, intermediate: 30, basic: 15, beginner: 7 },
      'Tools': { advanced: 35, intermediate: 32, basic: 22, beginner: 11 },
      'Responsible Use': { advanced: 28, intermediate: 32, basic: 25, beginner: 15 },
      'Data': { advanced: 18, intermediate: 28, basic: 35, beginner: 19 },
      'Co-Intelligence': { advanced: 22, intermediate: 35, basic: 28, beginner: 15 }
    },
    Finance: {
      'Prompting': { advanced: 15, intermediate: 28, basic: 35, beginner: 22 },
      'Tools': { advanced: 22, intermediate: 35, basic: 28, beginner: 15 },
      'Responsible Use': { advanced: 45, intermediate: 30, basic: 18, beginner: 7 },
      'Data': { advanced: 42, intermediate: 32, basic: 18, beginner: 8 },
      'Co-Intelligence': { advanced: 32, intermediate: 28, basic: 25, beginner: 15 }
    },
    HR: {
      'Prompting': { advanced: 18, intermediate: 25, basic: 32, beginner: 25 },
      'Tools': { advanced: 15, intermediate: 28, basic: 32, beginner: 25 },
      'Responsible Use': { advanced: 38, intermediate: 35, basic: 20, beginner: 7 },
      'Data': { advanced: 8, intermediate: 22, basic: 38, beginner: 32 },
      'Co-Intelligence': { advanced: 12, intermediate: 25, basic: 35, beginner: 28 }
    },
    Operations: {
      'Prompting': { advanced: 20, intermediate: 28, basic: 32, beginner: 20 },
      'Tools': { advanced: 28, intermediate: 32, basic: 25, beginner: 15 },
      'Responsible Use': { advanced: 32, intermediate: 28, basic: 25, beginner: 15 },
      'Data': { advanced: 25, intermediate: 35, basic: 28, beginner: 12 },
      'Co-Intelligence': { advanced: 48, intermediate: 30, basic: 15, beginner: 7 }
    }
  }

  // Helper functions for skill distribution
  const getHeatmapColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 65) return 'bg-blue-500' 
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getHeatmapIntensity = (score: number) => {
    if (score >= 80) return 'opacity-100'
    if (score >= 65) return 'opacity-80'
    if (score >= 50) return 'opacity-60'
    return 'opacity-40'
  }

  const skillNames = [
    'Prompting',
    'Tools',
    'Responsible Use',
    'Data',
    'Co-Intelligence'
  ]

  const departmentNames = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations']

  const getPillarKey = (skill: string) => {
    switch (skill.toLowerCase()) {
      case 'prompting': return 'prompting'
      case 'tools': return 'tools'
      case 'responsible use': return 'responsibleUse'
      case 'data': return 'data'
      case 'co-intelligence': return 'coIntelligence'
      default: return skill.toLowerCase()
    }
  }

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
          <p className="text-sm text-gray-600">Average proficiency across five key AI skill pillars</p>
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

      {/* Detailed Skills Analysis by Department */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            Detailed Skills Analysis by Department
          </CardTitle>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-600">
              {skillDistributionView === 'heatmap' 
                ? 'Department performance comparison across all skills' 
                : `Detailed skill distribution for ${selectedDistributionDept} department`
              }
            </p>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSkillDistributionView('heatmap')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center ${
                  skillDistributionView === 'heatmap'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3x3 className="w-4 h-4 mr-1" />
                Heatmap
              </button>
              <button
                onClick={() => setSkillDistributionView('detail')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center ${
                  skillDistributionView === 'detail'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Detail
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {skillDistributionView === 'heatmap' ? (
            /* Department Skills Heatmap */
            <div className="space-y-6">
              {/* Department vs Skills Heatmap */}
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Headers */}
                  <div className="grid grid-cols-6 gap-2 mb-2">
                    <div className="text-xs font-medium text-gray-500 p-2"></div>
                    {skillNames.map((skill) => (
                      <div key={skill} className="text-xs font-medium text-gray-700 p-2 text-center">
                        {skill.split(' ').map((word, i) => (
                          <div key={i}>{word}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                  
                  {/* Heatmap Grid */}
                  {departmentNames.map((dept) => (
                    <div key={dept} className="grid grid-cols-6 gap-2 mb-2">
                      <div className="text-sm font-medium text-gray-900 p-2 flex items-center">
                        {dept}
                      </div>
                      {skillNames.map((skill) => {
                        const score = departmentSkillScores[dept as keyof typeof departmentSkillScores][getPillarKey(skill) as keyof typeof departmentSkillScores.Engineering]
                        return (
                          <div
                            key={`${dept}-${skill}`}
                            className={`h-12 rounded-lg border border-gray-200 flex items-center justify-center text-white text-sm font-medium ${getHeatmapColor(score)} ${getHeatmapIntensity(score)}`}
                            title={`${dept}: ${skill} - ${score}%`}
                          >
                            {score}%
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span>Advanced (80%+)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <span>Intermediate (65-79%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                  <span>Basic (50-64%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <span>Beginner (Below 50%)</span>
                </div>
              </div>
              
              {/* Key Insights from Heatmap */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Key Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span className="font-medium text-gray-900">Departmental Strengths:</span>
                    </div>
                    <ul className="space-y-1 text-gray-700">
                      <li>• <strong>Engineering:</strong> Data (92%), Tools (89%)</li>
                      <li>• <strong>Marketing:</strong> Prompting (91%), Tools (84%)</li>
                      <li>• <strong>Operations:</strong> Co-Intelligence (91%), Responsible Use (82%)</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                      <span className="font-medium text-gray-900">Areas for Improvement:</span>
                    </div>
                    <ul className="space-y-1 text-gray-700">
                      <li>• <strong>Sales:</strong> Needs foundational support across all pillars</li>
                      <li>• <strong>HR:</strong> Data literacy (61%) and Co-Intelligence (68%) need development</li>
                      <li>• <strong>All Depts:</strong> Co-Intelligence shows lowest average scores</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Department Detail View */
            <div className="space-y-6">
              {/* Department Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Department:</span>
                <select 
                  value={selectedDistributionDept}
                  onChange={(e) => setSelectedDistributionDept(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departmentNames.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              {/* Detailed Distribution Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillNames.map((skill) => {
                  const skillData = departmentSkillDistribution[selectedDistributionDept as keyof typeof departmentSkillDistribution]?.[skill]
                  if (!skillData) return null
                  
                  return (
                    <div key={skill} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">{skill}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700">Advanced</span>
                          <span className="text-sm font-medium">{skillData.advanced}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${skillData.advanced}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Intermediate</span>
                          <span className="text-sm font-medium">{skillData.intermediate}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${skillData.intermediate}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-yellow-700">Basic</span>
                          <span className="text-sm font-medium">{skillData.basic}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${skillData.basic}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-red-700">Beginner</span>
                          <span className="text-sm font-medium">{skillData.beginner}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: `${skillData.beginner}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Department-Specific Insights */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-3">Department-Specific Insights</h4>
                <div className="text-sm text-gray-700">
                  {selectedDistributionDept === 'Engineering' && (
                    <div>
                      <strong>Technical excellence</strong> - 52% advanced in Data, 45% in Tools. Strong foundation but need support in Responsible Use (25%) and human-AI collaboration skills.
                    </div>
                  )}
                  {selectedDistributionDept === 'Marketing' && (
                    <div>
                      <strong>Prompting leaders</strong> - 48% advanced in Prompting, 35% in Tools. Natural mentors for AI communication but need Data literacy development.
                    </div>
                  )}
                  {selectedDistributionDept === 'Sales' && (
                    <div>
                      <strong>Foundation building needed</strong> - Low proficiency across all pillars. Only 8% advanced in Tools. Prioritize basic AI literacy and conversational AI skills.
                    </div>
                  )}
                  {selectedDistributionDept === 'Finance' && (
                    <div>
                      <strong>Compliance and data strengths</strong> - 45% advanced in Responsible Use, 42% in Data. Excellent candidates for AI governance and analytical applications.
                    </div>
                  )}
                  {selectedDistributionDept === 'HR' && (
                    <div>
                      <strong>Responsible AI champions</strong> - 38% advanced in Responsible Use. Natural leaders for AI governance but need practical Tools and Data skills.
                    </div>
                  )}
                  {selectedDistributionDept === 'Operations' && (
                    <div>
                      <strong>Co-Intelligence leaders</strong> - 48% advanced in Co-Intelligence. Perfect candidates for human-AI workflow optimization and collaborative AI implementation.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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

      {/* Employee Feedback Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 text-purple-600 mr-2" />
            Employee Feedback Insights
          </CardTitle>
          <p className="text-sm text-gray-600">Direct feedback from assessment responses across departments</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                skill: 'Prompting',
                quotes: [
                  { quote: "My prompts are too generic, I get mediocre results", role: "Sales Manager", dept: "Sales" },
                  { quote: "I know advanced techniques but my team doesn't", role: "Content Manager", dept: "Marketing" }
                ]
              },
              {
                skill: 'Tools', 
                quotes: [
                  { quote: "I use ChatGPT daily but struggle with complex workflows", role: "Marketing Specialist", dept: "Marketing" },
                  { quote: "Need training on GitHub Copilot features beyond autocomplete", role: "Software Engineer", dept: "Engineering" }
                ]
              },
              {
                skill: 'Responsible Use',
                quotes: [
                  { quote: "We need clear guidelines on what's acceptable AI use", role: "HR Director", dept: "HR" },
                  { quote: "Concerned about bias in our AI-generated content", role: "Content Strategist", dept: "Marketing" }
                ]
              },
              {
                skill: 'Data',
                quotes: [
                  { quote: "I want to use AI for Excel analysis but don't know how", role: "Financial Analyst", dept: "Finance" },
                  { quote: "AI helps with basic charts, but I need advanced analytics training", role: "Operations Manager", dept: "Operations" }
                ]
              },
              {
                skill: 'Co-Intelligence',
                quotes: [
                  { quote: "I see collaboration opportunities but don't know how to structure them", role: "HR Coordinator", dept: "HR" },
                  { quote: "Want to work with AI as a partner, not just a tool", role: "Operations Specialist", dept: "Operations" }
                ]
              }
            ].map((skillFeedback, index) => (
              <div key={index} className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-3">{skillFeedback.skill}</h4>
                <div className="space-y-3">
                  {skillFeedback.quotes.map((feedback, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border-l-4 border-purple-400">
                      <p className="text-sm italic text-gray-700 mb-2">"{feedback.quote}"</p>
                      <p className="text-xs text-gray-500">{feedback.role}, {feedback.dept}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Cross-Department Learning Opportunities */}
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-4">
              <Building2 className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-900">Cross-Department Learning Opportunities</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-medium text-green-800 mb-3">Knowledge Sharing Opportunities:</h5>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-start">
                    <ArrowRight className="w-3 h-3 mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Marketing → Sales:</strong> Prompt engineering techniques for personalized outreach</span>
                  </div>
                  <div className="flex items-start">
                    <ArrowRight className="w-3 h-3 mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Engineering → Operations:</strong> Process automation workshops and technical training</span>
                  </div>
                  <div className="flex items-start">
                    <ArrowRight className="w-3 h-3 mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Finance → All Depts:</strong> Data analysis best practices and Excel AI integration</span>
                  </div>
                  <div className="flex items-start">
                    <ArrowRight className="w-3 h-3 mt-1 mr-2 flex-shrink-0" />
                    <span><strong>HR → All Depts:</strong> AI ethics guidelines and responsible AI governance</span>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-green-800 mb-3">Internal Mentorship Programs:</h5>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-start">
                    <CheckCircle className="w-3 h-3 mt-1 mr-2 flex-shrink-0" />
                    <span>89 AI Champions available as mentors across departments</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-3 h-3 mt-1 mr-2 flex-shrink-0" />
                    <span>312 Active Adopters ready for peer learning groups</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-3 h-3 mt-1 mr-2 flex-shrink-0" />
                    <span>Department-specific "lunch and learn" sessions based on strengths</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-3 h-3 mt-1 mr-2 flex-shrink-0" />
                    <span>Cross-functional project teams to share AI use cases</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}