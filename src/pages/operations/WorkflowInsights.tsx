import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Workflow, 
  Clock, 
  Users, 
  Settings, 
  ArrowRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react'

export function WorkflowInsights() {
  const workflows = [
    {
      id: 'wf-001',
      name: 'Customer Onboarding Process',
      department: 'Sales',
      steps: 12,
      manualSteps: 8,
      timeSpent: 240,
      complexity: 'High',
      employeesInvolved: 15,
      status: 'Inefficient'
    },
    {
      id: 'wf-002', 
      name: 'Invoice Processing',
      department: 'Finance',
      steps: 8,
      manualSteps: 6,
      timeSpent: 120,
      complexity: 'Medium',
      employeesInvolved: 8,
      status: 'Partially Automated'
    },
    {
      id: 'wf-003',
      name: 'Employee Recruitment',
      department: 'HR',
      steps: 15,
      manualSteps: 11,
      timeSpent: 480,
      complexity: 'High',
      employeesInvolved: 12,
      status: 'Manual'
    },
    {
      id: 'wf-004',
      name: 'IT Support Ticket Resolution',
      department: 'IT',
      steps: 6,
      manualSteps: 4,
      timeSpent: 90,
      complexity: 'Medium',
      employeesInvolved: 18,
      status: 'Partially Automated'
    },
    {
      id: 'wf-005',
      name: 'Marketing Campaign Creation',
      department: 'Marketing',
      steps: 10,
      manualSteps: 8,
      timeSpent: 320,
      complexity: 'High',
      employeesInvolved: 6,
      status: 'Manual'
    }
  ]

  const workflowSteps = [
    { step: 'Data Collection', type: 'manual', time: 45 },
    { step: 'Initial Review', type: 'manual', time: 30 },
    { step: 'System Entry', type: 'automated', time: 5 },
    { step: 'Validation', type: 'manual', time: 25 },
    { step: 'Approval', type: 'manual', time: 20 },
    { step: 'Documentation', type: 'manual', time: 35 },
    { step: 'Notification', type: 'automated', time: 2 },
    { step: 'Follow-up', type: 'manual', time: 40 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Efficient': return 'success'
      case 'Partially Automated': return 'warning'
      case 'Inefficient': return 'danger'
      case 'Manual': return 'danger'
      default: return 'default'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'High': return 'danger'
      case 'Medium': return 'warning'
      case 'Low': return 'success'
      default: return 'default'
    }
  }

  const getStepIcon = (type: string) => {
    return type === 'manual' ? 
      <XCircle className="w-4 h-4 text-danger-600" /> : 
      <CheckCircle className="w-4 h-4 text-success-600" />
  }

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Workflow Insights</h1>
        <p className="text-gray-600 mt-2">
          Inferred workflows and process analysis across departments
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <Workflow className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">24</div>
            <p className="text-sm text-gray-600">Workflows Identified</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">1,250</div>
            <p className="text-sm text-gray-600">Hours/Week Total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <Settings className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">68%</div>
            <p className="text-sm text-gray-600">Manual Steps</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">156</div>
            <p className="text-sm text-gray-600">Employees Involved</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
            Identified Workflows by Department
          </CardTitle>
          <p className="text-sm text-gray-600">Detailed breakdown of key business processes</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                    <p className="text-sm text-gray-600">{workflow.department} Department</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(workflow.status)} size="sm">
                      {workflow.status}
                    </Badge>
                    <Badge variant={getComplexityColor(workflow.complexity)} size="sm">
                      {workflow.complexity}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Steps</span>
                    <div className="font-medium text-gray-900">{workflow.steps}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Manual Steps</span>
                    <div className="font-medium text-danger-600">{workflow.manualSteps}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Time/Week</span>
                    <div className="font-medium text-gray-900">{workflow.timeSpent} min</div>
                  </div>
                  <div>
                    <span className="text-gray-500">People</span>
                    <div className="font-medium text-gray-900">{workflow.employeesInvolved}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Automation %</span>
                    <div className="font-medium text-success-600">
                      {Math.round(((workflow.steps - workflow.manualSteps) / workflow.steps) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Workflow Steps Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Workflow: Customer Onboarding Process</CardTitle>
          <p className="text-sm text-gray-600">Detailed step-by-step breakdown with automation indicators</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workflowSteps.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                    {index + 1}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStepIcon(step.type)}
                    <span className="font-medium text-gray-900">{step.step}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge variant={step.type === 'manual' ? 'danger' : 'success'} size="sm">
                    {step.type === 'manual' ? 'Manual' : 'Automated'}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {step.time} min
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Optimization Opportunity</h4>
                <p className="text-sm text-blue-700">
                  This workflow could be optimized by automating 5 manual steps, reducing processing time by 60% 
                  and eliminating common errors in data entry and validation phases.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Department Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { dept: 'Sales', workflows: 6, avgComplexity: 'High', manualSteps: '72%' },
              { dept: 'Finance', workflows: 4, avgComplexity: 'Medium', manualSteps: '65%' },
              { dept: 'HR', workflows: 5, avgComplexity: 'High', manualSteps: '78%' },
              { dept: 'IT', workflows: 3, avgComplexity: 'Low', manualSteps: '45%' },
              { dept: 'Marketing', workflows: 4, avgComplexity: 'Medium', manualSteps: '68%' },
              { dept: 'Operations', workflows: 2, avgComplexity: 'High', manualSteps: '82%' },
            ].map((dept) => (
              <div key={dept.dept} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">{dept.dept}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Workflows</span>
                    <span className="font-medium">{dept.workflows}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Complexity</span>
                    <Badge variant={getComplexityColor(dept.avgComplexity)} size="sm">
                      {dept.avgComplexity}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manual Steps</span>
                    <span className="font-medium text-danger-600">{dept.manualSteps}</span>
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