import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/contexts/AuthContext'
import { dashboardDataService } from '@/lib/dashboardDataService'
import { 
  Zap, 
  Star, 
  Clock, 
  DollarSign,
  Users,
  TrendingUp,
  Building2,
  MessageSquare,
  FileText,
  BarChart3,
  Shield,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Play,
  BookOpen
} from 'lucide-react'

interface UseCase {
  id: string
  name: string
  department: string
  category: string
  maturity: 'Quick Win' | 'Moderate' | 'Advanced'
  description: string
  impact: 'High' | 'Medium' | 'Low'
  effort: 'Low' | 'Medium' | 'High'
  timeSavings: string
  costSavings: string
  employeesImpacted: number
  roiTimeframe: string
  toolsNeeded: string[]
  skills: string[]
  successMetrics: string[]
  implementationSteps: string[]
  businessValue: string
}

interface UseCaseStats {
  totalUseCases: number
  quickWins: number
  totalSavings: number
  avgROI: string
  processesAnalyzed: number
  employeesImpacted: number
  avgTimeSavings: number
}

export function AIUseCases() {
  const { user } = useAuth()
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedMaturity, setSelectedMaturity] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [useCases, setUseCases] = useState<UseCase[]>([])
  const [stats, setStats] = useState<UseCaseStats>({
    totalUseCases: 0,
    quickWins: 0,
    totalSavings: 0,
    avgROI: '0x',
    processesAnalyzed: 0,
    employeesImpacted: 0,
    avgTimeSavings: 0
  })

  useEffect(() => {
    loadUseCaseData()
  }, [user])

  const loadUseCaseData = async () => {
    try {
      setIsLoading(true)
      
      // Get dashboard metrics to align with overview data
      const dashboardMetrics = await dashboardDataService.calculateDashboardMetrics(user || undefined)
      
      // Generate AI use cases from actual assessment workflows
      const generatedUseCases = await generateUseCasesFromAssessments()
      setUseCases(generatedUseCases)
      
      // Calculate comprehensive stats from real workflow data
      const totalSavings = generatedUseCases.reduce((sum, uc) => {
        const savings = parseInt(uc.costSavings.replace(/[^0-9]/g, ''))
        return sum + (savings || 0)
      }, 0)
      
      const quickWins = generatedUseCases.filter(uc => uc.maturity === 'Quick Win').length
      const totalEmployeesImpacted = generatedUseCases.reduce((sum, uc) => sum + uc.employeesImpacted, 0)
      const avgTimeSavings = generatedUseCases.length > 0 
        ? generatedUseCases.reduce((sum, uc) => {
            const timeSavings = parseFloat(uc.timeSavings.split('-')[0]) || 0
            return sum + timeSavings
          }, 0) / generatedUseCases.length
        : 0
      
      // Get total processes analyzed from dashboard metrics
      const processesAnalyzed = dashboardMetrics?.workflowInsights?.totalProcesses || generatedUseCases.length
      
      setStats({
        totalUseCases: generatedUseCases.length,
        quickWins,
        totalSavings,
        avgROI: calculateAverageROI(generatedUseCases),
        processesAnalyzed,
        employeesImpacted: totalEmployeesImpacted,
        avgTimeSavings: Math.round(avgTimeSavings * 10) / 10
      })
      
    } catch (error) {
      console.error('Error loading use case data:', error)
      // Set fallback data if there's an error
      setUseCases([])
      setStats({ 
        totalUseCases: 0, 
        quickWins: 0, 
        totalSavings: 0, 
        avgROI: '0x', 
        processesAnalyzed: 0, 
        employeesImpacted: 0, 
        avgTimeSavings: 0 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAverageROI = (useCases: UseCase[]): string => {
    if (useCases.length === 0) return '0x'
    
    const totalROI = useCases.reduce((sum, uc) => {
      const savings = parseInt(uc.costSavings.replace(/[^0-9]/g, ''))
      const employees = uc.employeesImpacted
      const costPerEmployee = 75000 // Average employee cost
      const investment = employees * costPerEmployee * 0.1 // 10% of employee cost for implementation
      return sum + (investment > 0 ? savings / investment : 0)
    }, 0)
    
    return `${(totalROI / useCases.length).toFixed(1)}x`
  }

  const generateUseCasesFromAssessments = async (): Promise<UseCase[]> => {
    try {
      // Get assessment submissions to analyze actual workflows
      const submissions = await dashboardDataService.getRecentSubmissions(100, user || undefined)
      
      // Extract actual processes and workflows from assessment responses
      const workflowData = extractWorkflowsFromAssessments(submissions)
      
      // Generate AI use cases for each identified workflow
      return workflowData.map((workflow, index) => ({
        id: `workflow-${index + 1}`,
        name: `AI-Enhanced ${workflow.processName}`,
        department: workflow.department,
        category: categorizeProcess(workflow.processName),
        maturity: determineMaturity(workflow),
        description: `Apply AI to ${workflow.processName.toLowerCase()} - identified from ${workflow.userCount} employee responses`,
        impact: workflow.painLevel > 3 ? 'High' as const : 'Medium' as const,
        effort: workflow.complexity > 3 ? 'High' as const : 'Medium' as const,
        timeSavings: `${workflow.estimatedTimeSavings} hours/week per person`,
        costSavings: `$${Math.round(workflow.estimatedTimeSavings * workflow.userCount * 52 * 50 / 1000)}K annually`,
        employeesImpacted: workflow.userCount,
        roiTimeframe: workflow.complexity > 3 ? '6 months' : '3 months',
        toolsNeeded: suggestToolsForProcess(workflow.processName),
        skills: suggestSkillsForProcess(workflow.processName),
        successMetrics: generateMetricsForProcess(workflow),
        implementationSteps: generateStepsForProcess(workflow),
        businessValue: workflow.businessImpact
      }))
      
    } catch (error) {
      console.error('Error generating real use cases from assessments:', error)
      return []
    }
  }

  const extractWorkflowsFromAssessments = (submissions: any[]) => {
    const workflows: { [key: string]: any } = {}
    
    submissions.forEach(submission => {
      if (!submission.responses) return
      
      // Extract processes from workflow mapping questions
      const processes = submission.responses['primary_work_processes'] || []
      const department = submission.responses['profile-department'] || 'Unknown'
      const timeSpent = submission.responses['time_spent_on_processes'] || {}
      const painPoints = submission.responses['biggest_process_challenges'] || []
      
      if (Array.isArray(processes)) {
        processes.forEach((process: string) => {
          if (!workflows[process]) {
            workflows[process] = {
              processName: process,
              department,
              userCount: 0,
              totalTimeSpent: 0,
              painPoints: new Set(),
              complexity: 1,
              painLevel: 1
            }
          }
          
          workflows[process].userCount++
          workflows[process].totalTimeSpent += timeSpent[process] || 5 // default 5 hours
          
          if (Array.isArray(painPoints)) {
            painPoints.forEach((pain: string) => workflows[process].painPoints.add(pain))
          }
        })
      }
    })
    
    // Convert to array and calculate metrics
    return Object.values(workflows).map((workflow: any) => ({
      ...workflow,
      estimatedTimeSavings: Math.min(workflow.totalTimeSpent / workflow.userCount * 0.4, 15), // 40% time savings, max 15h
      painLevel: workflow.painPoints.size, // More pain points = higher pain level
      complexity: workflow.processName.includes('analysis') || workflow.processName.includes('review') ? 4 : 2,
      businessImpact: `Streamline ${workflow.processName.toLowerCase()} for ${workflow.userCount} employees`,
      painPoints: Array.from(workflow.painPoints)
    })).filter(w => w.userCount >= 2) // Only include workflows used by multiple people
      .sort((a, b) => (b.userCount * b.painLevel) - (a.userCount * a.painLevel)) // Sort by impact
      .slice(0, 8) // Top 8 most impactful workflows
  }

  const categorizeProcess = (processName: string): string => {
    const name = processName.toLowerCase()
    if (name.includes('email') || name.includes('communication')) return 'Communication'
    if (name.includes('document') || name.includes('report')) return 'Document Processing'
    if (name.includes('data') || name.includes('analysis')) return 'Analytics'
    if (name.includes('customer') || name.includes('support')) return 'Customer Service'
    if (name.includes('meeting') || name.includes('schedule')) return 'Productivity'
    return 'Workflow Automation'
  }

  const determineMaturity = (workflow: any): 'Quick Win' | 'Moderate' | 'Advanced' => {
    if (workflow.complexity <= 2 && workflow.userCount >= 10) return 'Quick Win'
    if (workflow.complexity <= 3) return 'Moderate'
    return 'Advanced'
  }

  const suggestToolsForProcess = (processName: string): string[] => {
    const name = processName.toLowerCase()
    if (name.includes('email')) return ['Email AI platform', 'Automation tools']
    if (name.includes('document')) return ['Document AI', 'OCR platform']
    if (name.includes('data') || name.includes('analysis')) return ['Analytics platform', 'Data visualization']
    if (name.includes('meeting')) return ['Meeting transcription', 'Calendar integration']
    return ['Workflow automation', 'AI platform']
  }

  const suggestSkillsForProcess = (processName: string): string[] => {
    const name = processName.toLowerCase()
    if (name.includes('data') || name.includes('analysis')) return ['Data analysis', 'AI insights']
    if (name.includes('document')) return ['Document automation', 'Template creation']
    return ['AI prompting', 'Workflow setup']
  }

  const generateMetricsForProcess = (workflow: any): string[] => {
    return [
      `Process time -${Math.min(40 + workflow.painLevel * 10, 80)}%`,
      `User satisfaction +${Math.min(20 + workflow.userCount * 2, 60)}%`,
      `Error reduction -${Math.min(30 + workflow.complexity * 10, 70)}%`
    ]
  }

  const generateStepsForProcess = (workflow: any): string[] => {
    return [
      `Map current ${workflow.processName.toLowerCase()} workflow`,
      'Identify automation opportunities',
      'Configure AI tools for process',
      'Train affected team members',
      'Deploy and monitor results'
    ]
  }

  // Generate dynamic data based on real use cases
  const departmentStats = useCases.reduce((acc: any[], useCase) => {
    const existing = acc.find(d => d.dept === useCase.department)
    if (existing) {
      existing.useCases++
      if (useCase.maturity === 'Quick Win') existing.quickWins++
    } else {
      acc.push({
        dept: useCase.department,
        useCases: 1,
        quickWins: useCase.maturity === 'Quick Win' ? 1 : 0,
        avgROI: '3.2x',
        topUseCase: useCase.name
      })
    }
    return acc
  }, [])

  const categories = [
    { name: 'Communication', count: useCases.filter(uc => uc.category === 'Communication').length, avgImpact: 'High', icon: MessageSquare },
    { name: 'Document Processing', count: useCases.filter(uc => uc.category === 'Document Processing').length, avgImpact: 'High', icon: FileText },
    { name: 'Analytics', count: useCases.filter(uc => uc.category === 'Analytics').length, avgImpact: 'Medium', icon: BarChart3 },
    { name: 'Productivity', count: useCases.filter(uc => uc.category === 'Productivity').length, avgImpact: 'Medium', icon: Zap },
    { name: 'Security', count: useCases.filter(uc => uc.category === 'Security').length, avgImpact: 'High', icon: Shield },
    { name: 'Customer Service', count: useCases.filter(uc => uc.category === 'Customer Service').length, avgImpact: 'High', icon: Users }
  ].filter(cat => cat.count > 0)

  const filteredUseCases = useCases.filter(useCase => {
    const deptMatch = selectedDepartment === 'all' || useCase.department === selectedDepartment || useCase.department === 'All'
    const maturityMatch = selectedMaturity === 'all' || useCase.maturity === selectedMaturity
    return deptMatch && maturityMatch
  })

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case 'Quick Win': return 'success'
      case 'Moderate': return 'warning'
      case 'Advanced': return 'info'
      default: return 'default'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'success'
      case 'Medium': return 'warning'
      case 'Low': return 'default'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Use Cases</h1>
          <p className="text-gray-600 mt-2">Loading use cases from your assessment data...</p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading use case analysis...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Use Cases</h1>
        <p className="text-gray-600 mt-2">
          AI opportunities for your team's actual workflows and processes, identified from employee assessment responses
        </p>
      </div>

      {/* Quick Stats - Real workflow analysis metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{stats.processesAnalyzed}</div>
            <p className="text-sm text-gray-600">Workflows Analyzed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{stats.employeesImpacted}</div>
            <p className="text-sm text-gray-600">Employees Impacted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{stats.avgTimeSavings}h</div>
            <p className="text-sm text-gray-600">Avg Time Savings/Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">${Math.round(stats.totalSavings/1000)}K</div>
            <p className="text-sm text-gray-600">Annual Savings Potential</p>
          </CardContent>
        </Card>
      </div>

      {/* Use Case Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
            Use Case Categories
          </CardTitle>
          <p className="text-sm text-gray-600">AI applications organized by business function</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.count} use cases</p>
                    </div>
                  </div>
                  <Badge variant={getImpactColor(category.avgImpact)} size="sm">
                    {category.avgImpact} Impact
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 text-purple-600 mr-2" />
            Department AI Opportunities
          </CardTitle>
          <p className="text-sm text-gray-600">Use case potential and ROI by department</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{dept.dept}</h4>
                  <Badge variant="info" size="sm">{dept.avgROI} ROI</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Use Cases</span>
                    <div className="font-medium text-gray-900">{dept.useCases}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Quick Wins</span>
                    <div className="font-medium text-green-600">{dept.quickWins}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Top Opportunity:</strong> {dept.topUseCase}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Department:</span>
              <select 
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="IT">IT</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Maturity:</span>
              <select 
                value={selectedMaturity}
                onChange={(e) => setSelectedMaturity(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="Quick Win">Quick Win</option>
                <option value="Moderate">Moderate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Use Cases Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 text-green-600 mr-2" />
            AI Use Cases Library
          </CardTitle>
          <p className="text-sm text-gray-600">Detailed implementation guides for each use case</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredUseCases.map((useCase, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">{useCase.name}</h3>
                      <div className="flex space-x-2">
                        <Badge variant={getMaturityColor(useCase.maturity)} size="sm">
                          {useCase.maturity}
                        </Badge>
                        <Badge variant={getImpactColor(useCase.impact)} size="sm">
                          {useCase.impact} Impact
                        </Badge>
                        <Badge variant="info" size="sm">{useCase.department}</Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{useCase.description}</p>
                  </div>
                  <button className="ml-4 p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-blue-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Time Savings</div>
                      <div className="text-sm text-gray-600">{useCase.timeSavings}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Cost Savings</div>
                      <div className="text-sm text-gray-600">{useCase.costSavings}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-purple-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">People Impacted</div>
                      <div className="text-sm text-gray-600">{useCase.employeesImpacted} employees</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-orange-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">ROI Timeframe</div>
                      <div className="text-sm text-gray-600">{useCase.roiTimeframe}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Implementation Steps</h4>
                      <ol className="text-sm text-gray-600 space-y-1">
                        {useCase.implementationSteps.slice(0, 3).map((step, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-500 mr-2 font-medium">{idx + 1}.</span>
                            {step}
                          </li>
                        ))}
                        {useCase.implementationSteps.length > 3 && (
                          <li className="text-blue-600 font-medium">
                            + {useCase.implementationSteps.length - 3} more steps
                          </li>
                        )}
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Success Metrics</h4>
                      <div className="space-y-1">
                        {useCase.successMetrics.map((metric, idx) => (
                          <div key={idx} className="flex items-center text-sm">
                            <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                            <span className="text-gray-600">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {useCase.skills.map((skill, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Business Value:</strong> {useCase.businessValue}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}