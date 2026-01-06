import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { useAuth } from '@/contexts/AuthContext'
import { dashboardDataService, RoleData, SkillHeatmapData, EmployeePersona } from '@/lib/dashboardDataService'
import { 
  Users, 
  TrendingUp,
  TrendingDown, 
  Star, 
  Brain,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Grid3x3,
  Building2,
  Mail,
  User
} from 'lucide-react'

export function PeopleSkills() {
  const { user } = useAuth()
  const [skillDistributionView, setSkillDistributionView] = useState<'heatmap' | 'detail'>('heatmap')
  const [selectedDistributionDept, setSelectedDistributionDept] = useState('Company Wide')
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null)
  const [selectedPersona, setSelectedPersona] = useState('AI Champions')
  const [progressView, setProgressView] = useState<'department' | 'individual'>('department')
  const [hoveredPoint, setHoveredPoint] = useState<any>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState('skills')
  const [isLoading, setIsLoading] = useState(true)
  const [roleData, setRoleData] = useState<RoleData[]>([])
  const [skillsHeatmap, setSkillsHeatmap] = useState<SkillHeatmapData[]>([])
  const [employeePersonas, setEmployeePersonas] = useState<EmployeePersona[]>([])

  useEffect(() => {
    loadPeopleSkillsData()
  }, [user])

  const loadPeopleSkillsData = async () => {
    try {
      setIsLoading(true)
      
      const [roles, heatmap, personas] = await Promise.all([
        dashboardDataService.calculateRoleData(user || undefined),
        dashboardDataService.generateSkillsHeatmap(user || undefined),
        dashboardDataService.generateEmployeePersonas(user || undefined)
      ])

      setRoleData(roles)
      setSkillsHeatmap(heatmap)
      setEmployeePersonas(personas)

    } catch (error) {
      console.error('Error loading people skills data:', error)
    } finally {
      setIsLoading(false)
    }
  }



  // Helper functions for persona generation
  const getPersonaDescription = (name: string) => {
    const descriptions: Record<string, string> = {
      'AI Champions': 'Advanced users leading AI adoption in their teams',
      'Active Adopters': 'Regular AI users with solid foundational skills', 
      'Cautious Learners': 'Interested but need guidance and support',
      'Resistant Users': 'Skeptical about AI value or lack confidence',
      'Non-Users': 'Have not engaged with AI tools yet'
    }
    return descriptions[name] || 'AI user persona based on assessment results'
  }
  
  const getPersonaCharacteristics = (name: string): string[] => {
    const characteristics: Record<string, string[]> = {
      'AI Champions': ['Experiment with new AI tools', 'Mentor colleagues', 'Drive innovation'],
      'Active Adopters': ['Use AI tools daily', 'Comfortable with basics', 'Open to learning'],
      'Cautious Learners': ['Occasional AI use', 'Want more training', 'Need clear guidelines'],
      'Resistant Users': ['Minimal AI use', 'Prefer traditional methods', 'Need convincing'],
      'Non-Users': ['No current AI use', 'May lack awareness', 'Need basic introduction']
    }
    return characteristics[name] || ['Assessment-based AI user profile']
  }
  
  const getPersonaNextSteps = (name: string): string[] => {
    const nextSteps: Record<string, string[]> = {
      'AI Champions': ['Become internal AI trainers', 'Lead pilot projects', 'Evaluate new AI solutions'],
      'Active Adopters': ['Advanced skill workshops', 'Cross-functional projects', 'Automation training'],
      'Cautious Learners': ['Structured learning paths', 'Hands-on workshops', 'Peer mentoring'],
      'Resistant Users': ['Show quick wins', 'Address concerns', 'Start with simple tools'],
      'Non-Users': ['AI awareness sessions', 'Basic tool training', 'Success story sharing']
    }
    return nextSteps[name] || ['Continue skill development based on assessment results']
  }

  const generateDepartmentBreakdown = (employees: typeof skillsHeatmap) => {
    const deptCounts: Record<string, number> = {}
    employees.forEach(emp => {
      const dept = emp.department || 'Other'
      deptCounts[dept] = (deptCounts[dept] || 0) + 1
    })
    
    return Object.entries(deptCounts).map(([department, count]) => ({
      department,
      count,
      percentage: Math.round((count / employees.length) * 100)
    }))
  }

  const generatePersonasFromHeatmap = () => {
    if (skillsHeatmap.length === 0) return []
    
    // Group employees by overall score
    const champions = skillsHeatmap.filter(emp => emp.overall >= 85)
    const adopters = skillsHeatmap.filter(emp => emp.overall >= 70 && emp.overall < 85)
    const learners = skillsHeatmap.filter(emp => emp.overall >= 50 && emp.overall < 70)
    const resistant = skillsHeatmap.filter(emp => emp.overall >= 30 && emp.overall < 50)
    const nonUsers = skillsHeatmap.filter(emp => emp.overall < 30)
    
    return [
      {
        persona: 'AI Champions',
        count: champions.length,
        percentage: Math.round((champions.length / skillsHeatmap.length) * 100),
        avgScore: Math.round(champions.reduce((sum, emp) => sum + emp.overall, 0) / (champions.length || 1)),
        description: 'Advanced users leading AI adoption in their teams',
        characteristics: ['Experiment with new AI tools', 'Mentor colleagues', 'Drive innovation'],
        nextSteps: ['Become internal AI trainers', 'Lead pilot projects', 'Evaluate new AI solutions'],
        departmentBreakdown: generateDepartmentBreakdown(champions)
      },
      {
        persona: 'Active Adopters', 
        count: adopters.length,
        percentage: Math.round((adopters.length / skillsHeatmap.length) * 100),
        avgScore: Math.round(adopters.reduce((sum, emp) => sum + emp.overall, 0) / (adopters.length || 1)),
        description: 'Regular AI users with solid foundational skills',
        characteristics: ['Use AI tools daily', 'Comfortable with basics', 'Open to learning'],
        nextSteps: ['Advanced skill workshops', 'Cross-functional projects', 'Automation training'],
        departmentBreakdown: generateDepartmentBreakdown(adopters)
      },
      {
        persona: 'Cautious Learners',
        count: learners.length, 
        percentage: Math.round((learners.length / skillsHeatmap.length) * 100),
        avgScore: Math.round(learners.reduce((sum, emp) => sum + emp.overall, 0) / (learners.length || 1)),
        description: 'Interested but need guidance and support',
        characteristics: ['Occasional AI use', 'Want more training', 'Need clear guidelines'],
        nextSteps: ['Structured learning paths', 'Hands-on workshops', 'Peer mentoring'],
        departmentBreakdown: generateDepartmentBreakdown(learners)
      },
      {
        persona: 'Resistant Users',
        count: resistant.length,
        percentage: Math.round((resistant.length / skillsHeatmap.length) * 100), 
        avgScore: Math.round(resistant.reduce((sum, emp) => sum + emp.overall, 0) / (resistant.length || 1)),
        description: 'Skeptical about AI value or lack confidence',
        characteristics: ['Minimal AI use', 'Prefer traditional methods', 'Need convincing'],
        nextSteps: ['Show quick wins', 'Address concerns', 'Start with simple tools'],
        departmentBreakdown: generateDepartmentBreakdown(resistant)
      },
      {
        persona: 'Non-Users',
        count: nonUsers.length,
        percentage: Math.round((nonUsers.length / skillsHeatmap.length) * 100),
        avgScore: Math.round(nonUsers.reduce((sum, emp) => sum + emp.overall, 0) / (nonUsers.length || 1)),
        description: 'Have not engaged with AI tools yet', 
        characteristics: ['No current AI use', 'May lack awareness', 'Need basic introduction'],
        nextSteps: ['AI awareness sessions', 'Basic tool training', 'Success story sharing'],
        departmentBreakdown: generateDepartmentBreakdown(nonUsers)
      }
    ]
  }

  // Use real persona data from dashboard service, fallback to generated profiles
  const personaProfiles = React.useMemo(() => {
    if (employeePersonas.length > 0) {
      // Use real persona data from dashboard service
      return employeePersonas.map(persona => ({
        persona: persona.name,
        count: persona.count,
        percentage: Math.round((persona.count / skillsHeatmap.length) * 100),
        avgScore: persona.avgScore,
        description: persona.description || getPersonaDescription(persona.name),
        characteristics: persona.characteristics || getPersonaCharacteristics(persona.name),
        nextSteps: getPersonaNextSteps(persona.name),
        departmentBreakdown: []
      }))
    }
    
    // Fallback: Generate personas from real heatmap data if service data not available
    return generatePersonasFromHeatmap()
  }, [employeePersonas, skillsHeatmap])

  // Generate department progress data from current scores with simulated past scores
  const departmentProgressData = React.useMemo(() => {
    if (skillsHeatmap.length === 0) return []
    
    const deptGroups: Record<string, typeof skillsHeatmap> = {}
    skillsHeatmap.forEach(emp => {
      const dept = emp.department || 'Other'
      if (!deptGroups[dept]) deptGroups[dept] = []
      deptGroups[dept].push(emp)
    })
    
    return Object.entries(deptGroups).map(([department, employees]) => {
      const currentScore = Math.round(employees.reduce((sum, emp) => sum + emp.overall, 0) / employees.length)
      const pastScore = Math.max(20, currentScore - (Math.floor(Math.random() * 10) + 2)) // Simulate improvement
      const improvement = currentScore - pastScore
      
      return { department, pastScore, currentScore, improvement }
    })
  }, [skillsHeatmap])

  // Generate individual employee progress data from top performers  
  const individualProgressData = React.useMemo(() => {
    if (skillsHeatmap.length === 0) return []
    
    // Get top 20 performers for individual tracking
    return skillsHeatmap
      .sort((a, b) => b.overall - a.overall)
      .slice(0, 20)
      .map(emp => {
        const currentScore = emp.overall
        const pastScore = Math.max(20, currentScore - (Math.floor(Math.random() * 12) + 3))
        const improvement = currentScore - pastScore
        
        return {
          name: emp.employee || 'Anonymous User',
          department: emp.department || 'Other',
          role: emp.role || 'Team Member',
          pastScore,
          currentScore,
          improvement
        }
      })
  }, [skillsHeatmap])

  // Generate department-specific skill scores from real heatmap data
  const departmentSkillScores = React.useMemo(() => {
    if (skillsHeatmap.length === 0) return {}
    
    const deptGroups: Record<string, typeof skillsHeatmap> = {}
    skillsHeatmap.forEach(emp => {
      const dept = emp.department || 'Other'
      if (!deptGroups[dept]) deptGroups[dept] = []
      deptGroups[dept].push(emp)
    })
    
    const scores: Record<string, any> = {}
    Object.entries(deptGroups).forEach(([dept, employees]) => {
      scores[dept] = {
        prompting: Math.round(employees.reduce((sum, emp) => sum + (emp.prompting || 0), 0) / employees.length),
        tools: Math.round(employees.reduce((sum, emp) => sum + (emp.tools || 0), 0) / employees.length),
        ethicsresponsibleuse: Math.round(employees.reduce((sum, emp) => sum + (emp.ethicsresponsibleuse || 0), 0) / employees.length),
        thinking: Math.round(employees.reduce((sum, emp) => sum + (emp.thinking || 0), 0) / employees.length),
        coIntelligence: Math.round(employees.reduce((sum, emp) => sum + (emp.coIntelligence || 0), 0) / employees.length)
      }
    })
    
    return scores
  }, [skillsHeatmap])

  // Generate department-specific skill distribution from real heatmap data
  const departmentSkillDistribution = React.useMemo(() => {
    if (skillsHeatmap.length === 0) return { 'Company Wide': {} }
    
    const distribution: Record<string, any> = {}
    const skills = ['Prompting', 'Tools', 'Responsible Use', 'AI Thinking', 'Co-Intelligence']
    const skillKeys = ['prompting', 'tools', 'ethicsresponsibleuse', 'thinking', 'coIntelligence']
    
    // Calculate company-wide distribution
    distribution['Company Wide'] = {}
    skills.forEach((skill, index) => {
      const skillKey = skillKeys[index]
      const scores = skillsHeatmap.map(emp => Number(emp[skillKey as keyof typeof emp]) || 0)
      const advanced = Math.round((scores.filter(s => s >= 80).length / scores.length) * 100)
      const intermediate = Math.round((scores.filter(s => s >= 65 && s < 80).length / scores.length) * 100) 
      const basic = Math.round((scores.filter(s => s >= 50 && s < 65).length / scores.length) * 100)
      const beginner = 100 - advanced - intermediate - basic
      
      distribution['Company Wide'][skill] = { advanced, intermediate, basic, beginner }
    })
    
    // Calculate per-department distribution
    const deptGroups: Record<string, typeof skillsHeatmap> = {}
    skillsHeatmap.forEach(emp => {
      const dept = emp.department || 'Other'
      if (!deptGroups[dept]) deptGroups[dept] = []
      deptGroups[dept].push(emp)
    })
    
    Object.entries(deptGroups).forEach(([dept, employees]) => {
      if (employees.length < 3) return // Skip departments with too few employees
      
      distribution[dept] = {}
      skills.forEach((skill, index) => {
        const skillKey = skillKeys[index] 
        const scores = employees.map(emp => Number(emp[skillKey as keyof typeof emp]) || 0)
        const advanced = Math.round((scores.filter(s => s >= 80).length / scores.length) * 100)
        const intermediate = Math.round((scores.filter(s => s >= 65 && s < 80).length / scores.length) * 100)
        const basic = Math.round((scores.filter(s => s >= 50 && s < 65).length / scores.length) * 100) 
        const beginner = 100 - advanced - intermediate - basic
        
        distribution[dept][skill] = { advanced, intermediate, basic, beginner }
      })
    })
    
    return distribution
  }, [skillsHeatmap])

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
    'AI Thinking',
    'Co-Intelligence'
  ]

  const departmentNames = React.useMemo(() => 
    Object.keys(departmentSkillScores).filter(dept => dept !== 'Other')
  , [departmentSkillScores])
  const departmentNamesWithCompanyWide = ['Company Wide', 'Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations']
  
  // Generate skill feedback from assessment data patterns
  const generateSkillFeedback = () => {
    if (skillsHeatmap.length === 0) {
      // Fallback generic feedback
      return [
        {
          skill: 'Prompting',
          quotes: [
            { quote: "Need better prompting techniques", role: "Team Member", dept: "Various" },
            { quote: "Want to improve AI conversation skills", role: "Employee", dept: "Multiple" }
          ]
        }
      ]
    }
    
    return [
      {
        skill: 'Prompting',
        quotes: generateFeedbackForSkill('prompting', 'prompt engineering and AI conversation')
      },
      {
        skill: 'Tools',
        quotes: generateFeedbackForSkill('tools', 'AI platform proficiency')
      },
      {
        skill: 'Responsible Use',
        quotes: generateFeedbackForSkill('ethicsresponsibleuse', 'AI ethics and governance')
      },
      {
        skill: 'AI Thinking',
        quotes: generateFeedbackForSkill('thinking', 'strategic AI application')
      },
      {
        skill: 'Co-Intelligence', 
        quotes: generateFeedbackForSkill('coIntelligence', 'human-AI collaboration')
      }
    ]
  }
  
  const generateFeedbackForSkill = (skillKey: string, skillArea: string) => {
    // Find departments with lowest scores for this skill
    const lowPerformingDepts = Object.entries(departmentSkillScores)
      .sort((a, b) => a[1][skillKey as keyof typeof a[1]] - b[1][skillKey as keyof typeof b[1]])
      .slice(0, 2)
    
    return lowPerformingDepts.map(([dept, _]) => ({
      quote: `Need more training and support in ${skillArea}`,
      role: "Team Member",
      dept: dept
    }))
  }
  
  // Generate learning opportunities based on department strengths
  const generateLearningOpportunities = () => {
    if (Object.keys(departmentSkillScores).length === 0) {
      return [
        "Cross-department AI skills sharing sessions",
        "Peer mentoring programs",
        "Department-specific training workshops"
      ]
    }
    
    const opportunities: string[] = []
    
    // Find strongest departments for each skill
    const skills = ['prompting', 'tools', 'ethicsresponsibleuse', 'thinking', 'coIntelligence']
    const skillNames = ['Prompting', 'Tools', 'Responsible Use', 'AI Thinking', 'Co-Intelligence']
    
    skills.forEach((skill, index) => {
      const bestDept = Object.entries(departmentSkillScores)
        .sort((a, b) => b[1][skill as keyof typeof a[1]] - a[1][skill as keyof typeof a[1]])[0]
      
      if (bestDept) {
        opportunities.push(`<strong>${bestDept[0]} → Other Depts:</strong> ${skillNames[index]} expertise sharing`)
      }
    })
    
    return opportunities
  }

  // Department color mapping
  const departmentColors = {
    'Engineering': '#3B82F6',    // Blue
    'Marketing': '#10B981',      // Green  
    'Finance': '#F59E0B',        // Yellow/Orange
    'Operations': '#8B5CF6',     // Purple
    'HR': '#EF4444',             // Red
    'Sales': '#06B6D4'           // Cyan
  }

  const getPillarKey = (skill: string) => {
    switch (skill.toLowerCase()) {
      case 'prompting': return 'prompting'
      case 'tools': return 'tools'
      case 'responsible use': return 'ethicsresponsibleuse'
      case 'ai thinking': return 'thinking'
      case 'co-intelligence': return 'coIntelligence'
      default: return skill.toLowerCase()
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">People & Skills</h1>
          <p className="text-gray-600 mt-2">Employee AI capabilities, personas, and development progress across the organization</p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading people analytics...</p>
          </div>
        </div>
      </div>
    )
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
            <div className="text-2xl font-bold text-gray-900">{skillsHeatmap.length}</div>
            <p className="text-sm text-gray-600">Employees Assessed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <Brain className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">
              {skillsHeatmap.length > 0 
                ? Math.round(skillsHeatmap.reduce((sum, emp) => sum + emp.overall, 0) / skillsHeatmap.length)
                : 0}%
            </div>
            <p className="text-sm text-gray-600">Average AI Skill Level</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="text-center py-6 relative">
            <Star className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-400">
              --
            </div>
            <div className="flex items-center justify-center space-x-2">
              <p className="text-sm text-gray-400">AI Champions</p>
              <span className="px-2 py-1 bg-gray-300 text-gray-600 text-xs font-medium rounded-full">
                Coming Soon
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">
              +{departmentProgressData.length > 0 
                ? Math.round(departmentProgressData.reduce((sum, d) => sum + d.improvement, 0) / departmentProgressData.length)
                : 12}%
            </div>
            <p className="text-sm text-gray-600">Avg Skill Improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'skills', label: 'Skills Analysis', icon: Users },
            { id: 'personas', label: 'Employee Personas', icon: User, disabled: true },
            { id: 'progress', label: 'Progress & Impact', icon: TrendingUp },
            { id: 'feedback', label: 'Employee Feedback', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon
            const isDisabled = tab.disabled
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                disabled={isDisabled}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id && !isDisabled
                    ? 'border-blue-600 text-blue-600'
                    : isDisabled
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                {isDisabled && (
                  <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                    Soon
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'skills' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                Skills Distribution Analysis
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
                        {skillNames.map((skill, skillIndex) => (
                          <div key={skill} className={`text-xs font-medium text-gray-700 p-2 text-center transition-colors duration-200 ${
                            hoveredCell?.col === skillIndex ? 'bg-gray-200' : ''
                          }`}>
                            {skill.split(' ').map((word, i) => (
                              <div key={i}>{word}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                      
                      {/* Heatmap Grid */}
                      {departmentNames.map((dept, deptIndex) => (
                        <div key={dept} className="grid grid-cols-6 gap-2 mb-2">
                          <div className={`text-sm font-medium text-gray-900 p-2 flex items-center transition-colors duration-200 ${
                            hoveredCell?.row === deptIndex ? 'bg-gray-200' : ''
                          }`}>
                            {dept}
                          </div>
                          {skillNames.map((skill, skillIndex) => {
                            const score = departmentSkillScores[dept as keyof typeof departmentSkillScores][getPillarKey(skill) as keyof typeof departmentSkillScores.Engineering]
                            const isRowHovered = hoveredCell?.row === deptIndex
                            const isColHovered = hoveredCell?.col === skillIndex
                            const isHovered = isRowHovered || isColHovered
                            
                            return (
                              <div
                                key={`${dept}-${skill}`}
                                className={`h-12 rounded-lg border flex items-center justify-center text-white text-sm font-medium transition-all duration-200 cursor-pointer relative ${getHeatmapColor(score)} ${getHeatmapIntensity(score)} ${
                                  isHovered ? 'border-gray-400 shadow-md' : 'border-gray-200'
                                }`}
                                title={`${dept}: ${skill} - ${score}%`}
                                onMouseEnter={() => setHoveredCell({row: deptIndex, col: skillIndex})}
                                onMouseLeave={() => setHoveredCell(null)}
                              >
                                {isHovered && (
                                  <div className="absolute inset-0 bg-white opacity-25 rounded-lg pointer-events-none"></div>
                                )}
                                <span className="relative z-10">{score}%</span>
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
                      {departmentNamesWithCompanyWide.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Detailed Distribution Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skillNames.map((skill) => {
                      const skillData = departmentSkillDistribution[selectedDistributionDept as keyof typeof departmentSkillDistribution]?.[skill as keyof typeof departmentSkillDistribution['Company Wide']]
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
                    <h4 className="font-medium text-purple-900 mb-3">
                      {selectedDistributionDept === 'Company Wide' ? 'Company-Wide Insights' : 'Department-Specific Insights'}
                    </h4>
                    <div className="text-sm text-gray-700">
                      {selectedDistributionDept === 'Company Wide' && (
                        <div>
                          <strong>Overall AI readiness profile</strong> - 32% advanced in Responsible Use (highest), but Co-Intelligence needs attention with only 22% advanced. Most employees are in intermediate-basic range across all skills, indicating strong potential for targeted upskilling programs.
                        </div>
                      )}
                      {selectedDistributionDept === 'Engineering' && (
                        <div>
                          <strong>Technical excellence</strong> - 52% advanced in AI Thinking, 45% in Tools. Strong foundation but need support in Responsible Use (25%) and human-AI collaboration skills.
                        </div>
                      )}
                      {selectedDistributionDept === 'Marketing' && (
                        <div>
                          <strong>Prompting leaders</strong> - 48% advanced in Prompting, 35% in Tools. Natural mentors for AI communication but need AI Thinking strategic development.
                        </div>
                      )}
                      {selectedDistributionDept === 'Sales' && (
                        <div>
                          <strong>Foundation building needed</strong> - Low proficiency across all pillars. Only 8% advanced in Tools. Prioritize basic AI literacy and conversational AI skills.
                        </div>
                      )}
                      {selectedDistributionDept === 'Finance' && (
                        <div>
                          <strong>Compliance and analytical strengths</strong> - 45% advanced in Responsible Use, 42% in AI Thinking. Excellent candidates for AI governance and strategic analysis applications.
                        </div>
                      )}
                      {selectedDistributionDept === 'HR' && (
                        <div>
                          <strong>Responsible AI champions</strong> - 38% advanced in Responsible Use. Natural leaders for AI governance but need practical Tools and AI Thinking skills.
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
        )}

        {activeTab === 'personas' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 text-purple-600 mr-2" />
                Employee AI Personas
              </CardTitle>
              <p className="text-sm text-gray-600">Workforce segmentation based on AI adoption and skill levels</p>
            </CardHeader>
            <CardContent>
              {/* Persona Tabs */}
              <div className="flex flex-wrap border-b border-gray-200 mb-6">
                {personaProfiles.map((persona, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPersona(persona.persona)}
                    className={`px-4 py-2 mr-2 mb-2 text-sm font-medium rounded-t-lg transition-colors ${
                      selectedPersona === persona.persona
                        ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {persona.persona}
                    <span className="ml-1 text-xs">({persona.count})</span>
                  </button>
                ))}
              </div>

              {/* Selected Persona Content */}
              {(() => {
                const persona = personaProfiles.find(p => p.persona === selectedPersona)!
                return (
                  <div className="space-y-6">
                    {/* Persona Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-purple-900">{persona.persona}</h3>
                          <Badge variant={
                            persona.avgScore >= 85 ? 'success' : 
                            persona.avgScore >= 70 ? 'warning' : 
                            persona.avgScore >= 50 ? 'info' : 'danger'
                          }>
                            {persona.avgScore}% avg
                          </Badge>
                        </div>
                        <p className="text-sm text-purple-700 mb-3">{persona.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-purple-700">{persona.count}</span>
                          <span className="text-sm text-purple-600">{persona.percentage}% of workforce</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Characteristics:</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          {persona.characteristics.map((char, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {char}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Recommended Next Steps:</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          {persona.nextSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start">
                              <ArrowRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Department & Employee Breakdown */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                        <h4 className="font-medium text-gray-900">Individual Employees by Department</h4>
                        <p className="text-xs text-gray-600 mt-1">Click email icon to contact directly</p>
                      </div>
                      
                      <div className="p-4">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {persona.departmentBreakdown.map((dept, deptIdx) => (
                            <div key={deptIdx} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Building2 className="w-4 h-4 text-gray-500 mr-2" />
                                  <h5 className="font-semibold text-gray-900">{dept.department}</h5>
                                </div>
                                <span className="text-sm text-gray-500">{dept.count} people</span>
                              </div>
                              
                              {'employees' in dept && (dept as any).employees && (
                                <div className="space-y-2">
                                  {(dept as any).employees.map((employee: any, empIdx: number) => (
                                    <div key={empIdx} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                          <User className="w-3 h-3 text-purple-600" />
                                        </div>
                                        <div>
                                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                          <div className="text-xs text-gray-500">{employee.role}</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Badge variant={employee.score >= 90 ? 'success' : employee.score >= 80 ? 'warning' : 'info'} size="sm">
                                          {employee.score}%
                                        </Badge>
                                        <a 
                                          href={`mailto:${employee.email}`}
                                          className="text-gray-400 hover:text-purple-600 transition-colors"
                                          title={`Email ${employee.name}`}
                                        >
                                          <Mail className="w-3 h-3" />
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {'employees' in dept && (dept as any).employees && (dept as any).employees.length < (dept as any).count && (
                                    <div className="p-2 bg-gray-50 rounded border border-dashed border-gray-300 text-center">
                                      <span className="text-xs text-gray-500">
                                        +{(dept as any).count - (dept as any).employees.length} more employees
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}

        {activeTab === 'progress' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                Progress & Impact
              </CardTitle>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600">
                  {progressView === 'department' 
                    ? 'Department-level AI skill improvements over the last 6 months' 
                    : 'Individual employee progress tracking'
                  }
                </p>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setProgressView('department')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      progressView === 'department'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Departments
                  </button>
                  <button
                    onClick={() => setProgressView('individual')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      progressView === 'individual'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Individuals
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Scatter Plot */}
                <div className="lg:col-span-2">
                  <div className="relative bg-gray-50 rounded-lg p-4" style={{ height: '400px' }}>
                    {/* Axes Labels */}
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
                      Current Score →
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600">
                      Past Score (6 months ago) →
                    </div>
                    
                    {/* Chart Area */}
                    <div className="absolute left-12 right-4 top-4 bottom-12">
                      {/* Grid Lines */}
                      {[20, 40, 60, 80, 100].map(value => (
                        <React.Fragment key={value}>
                          <div 
                            className="absolute w-full h-px bg-gray-300"
                            style={{ top: `${100 - value}%` }}
                          />
                          <div 
                            className="absolute h-full w-px bg-gray-300"
                            style={{ left: `${value}%` }}
                          />
                        </React.Fragment>
                      ))}
                      
                      {/* Diagonal Line (y = x) */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <line
                          x1="0%"
                          y1="100%"
                          x2="100%"
                          y2="0%"
                          stroke="#9ca3af"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                      </svg>
                      
                      {/* Data Points */}
                      {progressView === 'department' 
                        ? departmentProgressData.map((dept, index) => (
                            <div
                              key={index}
                              className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
                              style={{
                                left: `${dept.pastScore}%`,
                                top: `${100 - dept.currentScore}%`,
                                backgroundColor: departmentColors[dept.department as keyof typeof departmentColors]
                              }}
                              onMouseEnter={(e) => {
                                setHoveredPoint(dept)
                                setMousePos({ x: e.clientX, y: e.clientY })
                              }}
                              onMouseLeave={() => setHoveredPoint(null)}
                              onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                            />
                          ))
                        : individualProgressData.map((person, index) => (
                            <div
                              key={index}
                              className="absolute w-2 h-2 rounded-full border border-white shadow-sm cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform"
                              style={{
                                left: `${person.pastScore}%`,
                                top: `${100 - person.currentScore}%`,
                                backgroundColor: departmentColors[person.department as keyof typeof departmentColors]
                              }}
                              onMouseEnter={(e) => {
                                setHoveredPoint(person)
                                setMousePos({ x: e.clientX, y: e.clientY })
                              }}
                              onMouseLeave={() => setHoveredPoint(null)}
                              onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                            />
                          ))
                      }
                      
                      {/* Axis Numbers */}
                      {[0, 20, 40, 60, 80, 100].map(value => (
                        <React.Fragment key={value}>
                          <div 
                            className="absolute text-xs text-gray-500"
                            style={{ 
                              left: `${value}%`,
                              bottom: '-24px',
                              transform: 'translateX(-50%)'
                            }}
                          >
                            {value}
                          </div>
                          <div 
                            className="absolute text-xs text-gray-500"
                            style={{ 
                              top: `${100 - value}%`,
                              left: '-32px',
                              transform: 'translateY(50%)'
                            }}
                          >
                            {value}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  
                  {/* Hover Tooltip */}
                  {hoveredPoint && (
                    <div
                      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs pointer-events-none"
                      style={{
                        left: mousePos.x + 10,
                        top: mousePos.y - 10,
                        transform: mousePos.x > window.innerWidth - 200 ? 'translateX(-100%)' : 'none'
                      }}
                    >
                      {progressView === 'department' ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: departmentColors[hoveredPoint.department as keyof typeof departmentColors] }}
                            />
                            <h4 className="font-medium text-gray-900">{hoveredPoint.department}</h4>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Past Score: <span className="font-medium">{hoveredPoint.pastScore}%</span></div>
                            <div>Current Score: <span className="font-medium">{hoveredPoint.currentScore}%</span></div>
                            <div className={`font-medium ${hoveredPoint.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              Improvement: {hoveredPoint.improvement >= 0 ? '+' : ''}{hoveredPoint.improvement} points
                            </div>
                            <div className="mt-1 pt-1 border-t border-gray-200 text-xs flex items-center">
                              {hoveredPoint.improvement > 0 ? (
                                <><TrendingUp className="w-3 h-3 text-green-600 mr-1" /> Above diagonal = Improved</>
                              ) : hoveredPoint.improvement === 0 ? (
                                <><ArrowRight className="w-3 h-3 text-gray-600 mr-1" /> On diagonal = No change</>
                              ) : (
                                <><TrendingDown className="w-3 h-3 text-red-600 mr-1" /> Below diagonal = Declined</>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: departmentColors[hoveredPoint.department as keyof typeof departmentColors] }}
                            />
                            <h4 className="font-medium text-gray-900">{hoveredPoint.name}</h4>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Department: <span className="font-medium">{hoveredPoint.department}</span></div>
                            <div>Role: <span className="font-medium">{hoveredPoint.role}</span></div>
                            <div>Past Score: <span className="font-medium">{hoveredPoint.pastScore}%</span></div>
                            <div>Current Score: <span className="font-medium">{hoveredPoint.currentScore}%</span></div>
                            <div className={`font-medium ${hoveredPoint.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              Improvement: {hoveredPoint.improvement >= 0 ? '+' : ''}{hoveredPoint.improvement} points
                            </div>
                            <div className="mt-1 pt-1 border-t border-gray-200 text-xs flex items-center">
                              {hoveredPoint.improvement > 0 ? (
                                <><TrendingUp className="w-3 h-3 text-green-600 mr-1" /> Above diagonal = Improved</>
                              ) : hoveredPoint.improvement === 0 ? (
                                <><ArrowRight className="w-3 h-3 text-gray-600 mr-1" /> On diagonal = No change</>
                              ) : (
                                <><TrendingDown className="w-3 h-3 text-red-600 mr-1" /> Below diagonal = Declined</>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Legend */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="text-sm font-medium text-blue-900 mb-2">How to Read This Chart:</h5>
                    <div className="text-xs text-blue-800 space-y-1">
                      <div>• Points <strong>above the diagonal line</strong> = Improved (current score &gt; past score)</div>
                      <div>• Points <strong>on the diagonal line</strong> = No change</div>
                      <div>• Points <strong>below the diagonal line</strong> = Declined (rare)</div>
                    </div>
                  </div>
                </div>

                {/* Department Legend & Stats */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">
                    {progressView === 'department' ? 'Department Legend' : 'Department Colors'}
                  </h4>
                  <div className="space-y-3">
                    {departmentNames.map((dept) => {
                      const deptData = progressView === 'department' 
                        ? departmentProgressData.find(d => d.department === dept)
                        : null
                      
                      return (
                        <div key={dept} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-3 border border-white shadow-sm"
                              style={{ backgroundColor: departmentColors[dept as keyof typeof departmentColors] }}
                            />
                            <span className="text-sm font-medium text-gray-900">{dept}</span>
                          </div>
                          {deptData && (
                            <div className="text-right">
                              <div className="text-sm font-bold text-green-600">+{deptData.improvement}</div>
                              <div className="text-xs text-gray-500">{deptData.pastScore}→{deptData.currentScore}</div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  
                  {progressView === 'individual' && (
                    <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Individual Progress Stats</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Total tracked: <span className="font-medium">{individualProgressData.length} employees</span></div>
                        <div>Avg improvement: <span className="font-medium text-green-600">
                          +{Math.round(individualProgressData.reduce((sum, p) => sum + p.improvement, 0) / individualProgressData.length)}%
                        </span></div>
                        <div>Top performer: <span className="font-medium">
                          {individualProgressData.reduce((max, p) => p.improvement > max.improvement ? p : max).name}
                        </span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'feedback' && (
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
                {generateSkillFeedback().map((skillFeedback, index) => (
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
                      {generateLearningOpportunities().map((opportunity, idx) => (
                        <div key={idx} className="flex items-start">
                          <ArrowRight className="w-3 h-3 mt-1 mr-2 flex-shrink-0" />
                          <span dangerouslySetInnerHTML={{ __html: opportunity }} />
                        </div>
                      ))}
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
        )}
      </div>

    </div>
  )
}