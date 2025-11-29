import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  FileText, 
  Users, 
  Calendar, 
  Download, 
  CheckCircle,
  AlertCircle,
  Clock,
  Building2,
  Search,
  Filter,
  TrendingUp,
  BarChart3
} from 'lucide-react'

export function AssessmentData() {
  const [selectedCohort, setSelectedCohort] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  
  const cohortData = [
    {
      id: 'cohort-2024-q1',
      name: 'Q1 2024 Leadership Assessment',
      startDate: '2024-01-15',
      endDate: '2024-03-30',
      totalInvited: 156,
      completed: 142,
      inProgress: 8,
      notStarted: 6,
      completionRate: 91,
      departments: ['Executive', 'Management', 'Department Heads']
    },
    {
      id: 'cohort-2024-q2',
      name: 'Q2 2024 Full Workforce Assessment',
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      totalInvited: 1247,
      completed: 1089,
      inProgress: 94,
      notStarted: 64,
      completionRate: 87,
      departments: ['All Departments']
    },
    {
      id: 'cohort-2024-pilot',
      name: 'Engineering Pilot Program',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      totalInvited: 45,
      completed: 45,
      inProgress: 0,
      notStarted: 0,
      completionRate: 100,
      departments: ['Engineering']
    }
  ]

  const participantData = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      department: 'Marketing',
      role: 'Marketing Manager',
      status: 'Completed',
      completionDate: '2024-05-15',
      score: 84,
      cohort: 'Q2 2024 Full Workforce'
    },
    {
      name: 'Mike Chen',
      email: 'mike.c@company.com', 
      department: 'Engineering',
      role: 'Senior Developer',
      status: 'Completed',
      completionDate: '2024-05-12',
      score: 92,
      cohort: 'Q2 2024 Full Workforce'
    },
    {
      name: 'Lisa Rodriguez',
      email: 'lisa.r@company.com',
      department: 'Sales',
      role: 'Account Executive',
      status: 'In Progress',
      completionDate: null,
      score: null,
      cohort: 'Q2 2024 Full Workforce'
    },
    {
      name: 'David Kim',
      email: 'david.k@company.com',
      department: 'Finance',
      role: 'Financial Analyst',
      status: 'Not Started',
      completionDate: null,
      score: null,
      cohort: 'Q2 2024 Full Workforce'
    },
    {
      name: 'Jennifer Walsh',
      email: 'jennifer.w@company.com',
      department: 'HR',
      role: 'HR Business Partner',
      status: 'Completed',
      completionDate: '2024-05-18',
      score: 76,
      cohort: 'Q2 2024 Full Workforce'
    }
  ]

  const departmentStats = [
    { dept: 'Engineering', invited: 156, completed: 145, rate: 93 },
    { dept: 'Marketing', invited: 89, completed: 84, rate: 94 },
    { dept: 'Sales', invited: 234, completed: 198, rate: 85 },
    { dept: 'Finance', invited: 67, completed: 58, rate: 87 },
    { dept: 'HR', invited: 45, completed: 42, rate: 93 },
    { dept: 'Operations', invited: 123, completed: 101, rate: 82 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success'
      case 'In Progress': return 'warning'
      case 'Not Started': return 'danger'
      default: return 'default'
    }
  }

  const filteredParticipants = participantData.filter(participant => {
    const statusMatch = selectedStatus === 'all' || participant.status.toLowerCase().includes(selectedStatus)
    return statusMatch
  })

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Assessment Data</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive view of AI assessment completion, participant data, and export capabilities
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">1,448</div>
            <p className="text-sm text-gray-600">Total Participants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">1,276</div>
            <p className="text-sm text-gray-600">Completed Assessments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">102</div>
            <p className="text-sm text-gray-600">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">88%</div>
            <p className="text-sm text-gray-600">Overall Completion Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
            Assessment Cohorts
          </CardTitle>
          <p className="text-sm text-gray-600">Assessment waves and completion statistics</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cohortData.map((cohort, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cohort.name}</h3>
                    <p className="text-sm text-gray-600">
                      {cohort.startDate} to {cohort.endDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{cohort.completionRate}%</div>
                    <p className="text-sm text-gray-600">completion</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Total Invited</span>
                    <div className="font-medium text-gray-900">{cohort.totalInvited}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Completed</span>
                    <div className="font-medium text-green-600">{cohort.completed}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">In Progress</span>
                    <div className="font-medium text-orange-600">{cohort.inProgress}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Not Started</span>
                    <div className="font-medium text-red-600">{cohort.notStarted}</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${cohort.completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cohort.departments.map((dept, idx) => (
                    <Badge key={idx} variant="info" size="sm">{dept}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Completion Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 text-purple-600 mr-2" />
            Completion by Department
          </CardTitle>
          <p className="text-sm text-gray-600">Assessment participation across organizational departments</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{dept.dept}</h4>
                  <Badge variant={dept.rate >= 90 ? 'success' : dept.rate >= 85 ? 'warning' : 'danger'}>
                    {dept.rate}%
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {dept.completed} of {dept.invited} completed
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      dept.rate >= 90 ? 'bg-green-500' : 
                      dept.rate >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${dept.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Participant Explorer */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 text-green-600 mr-2" />
                Participant Explorer
              </CardTitle>
              <p className="text-sm text-gray-600">Individual participant data and completion status</p>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="progress">In Progress</option>
                <option value="not">Not Started</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Completion Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.slice(0, 10).map((participant, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{participant.name}</div>
                        <div className="text-sm text-gray-500">{participant.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{participant.department}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{participant.role}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusColor(participant.status)} size="sm">
                        {participant.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {participant.score ? (
                        <span className={`font-medium ${
                          participant.score >= 80 ? 'text-green-600' : 
                          participant.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {participant.score}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {participant.completionDate || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredParticipants.length > 10 && (
              <div className="mt-4 text-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Load More Participants
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="w-5 h-5 text-indigo-600 mr-2" />
            Data Export & Reports
          </CardTitle>
          <p className="text-sm text-gray-600">Download assessment data and generate custom reports</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Complete Assessment Results',
                description: 'All participant responses and scores',
                format: 'CSV/Excel',
                size: '~2.3MB',
                icon: BarChart3,
                color: 'blue'
              },
              {
                title: 'Executive Summary Report',
                description: 'High-level insights and key metrics',
                format: 'PDF',
                size: '~450KB',
                icon: FileText,
                color: 'green'
              },
              {
                title: 'Department Analysis',
                description: 'Breakdown by organizational unit',
                format: 'PDF/CSV',
                size: '~1.1MB',
                icon: Building2,
                color: 'purple'
              },
              {
                title: 'Individual Scorecards', 
                description: 'Personal results for each participant',
                format: 'ZIP (PDFs)',
                size: '~8.7MB',
                icon: Users,
                color: 'orange'
              },
              {
                title: 'Training Recommendations',
                description: 'Personalized learning paths',
                format: 'CSV/PDF',
                size: '~650KB',
                icon: CheckCircle,
                color: 'indigo'
              },
              {
                title: 'Raw Survey Data',
                description: 'Unprocessed responses for analysis',
                format: 'JSON/CSV',
                size: '~1.8MB',
                icon: Download,
                color: 'gray'
              }
            ].map((export_, index) => {
              const Icon = export_.icon
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 bg-${export_.color}-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-${export_.color}-200 transition-colors`}>
                      <Icon className={`w-5 h-5 text-${export_.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{export_.title}</h4>
                      <p className="text-xs text-gray-500">{export_.format} • {export_.size}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{export_.description}</p>
                  <button className={`w-full py-2 px-3 bg-${export_.color}-50 border border-${export_.color}-200 text-${export_.color}-700 rounded-md text-sm hover:bg-${export_.color}-100 transition-colors`}>
                    Download
                  </button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}