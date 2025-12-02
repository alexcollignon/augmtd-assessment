import React, { useState, useEffect } from 'react'
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
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedScoreRange, setSelectedScoreRange] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  
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
      completionDate: '2024-05-15',
      score: 84,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 92, tools: 85, responsibleUse: 78, aiThinking: 81, coIntelligence: 86 }
    },
    {
      name: 'Mike Chen',
      email: 'mike.c@company.com', 
      department: 'Engineering',
      role: 'Senior Developer',
      completionDate: '2024-05-12',
      score: 92,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 89, tools: 96, responsibleUse: 85, aiThinking: 94, coIntelligence: 91 }
    },
    {
      name: 'Jennifer Walsh',
      email: 'jennifer.w@company.com',
      department: 'HR',
      role: 'HR Business Partner',
      completionDate: '2024-05-18',
      score: 76,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 74, tools: 69, responsibleUse: 88, aiThinking: 71, coIntelligence: 78 }
    },
    {
      name: 'Alex Rodriguez',
      email: 'alex.r@company.com',
      department: 'Engineering',
      role: 'Software Engineer',
      completionDate: '2024-05-14',
      score: 88,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 85, tools: 93, responsibleUse: 82, aiThinking: 90, coIntelligence: 87 }
    },
    {
      name: 'Emma Wilson',
      email: 'emma.w@company.com',
      department: 'Marketing',
      role: 'Content Specialist',
      completionDate: '2024-05-16',
      score: 79,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 88, tools: 76, responsibleUse: 75, aiThinking: 72, coIntelligence: 84 }
    },
    {
      name: 'Robert Johnson',
      email: 'robert.j@company.com',
      department: 'Finance',
      role: 'Senior Analyst',
      completionDate: '2024-05-13',
      score: 82,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 78, tools: 81, responsibleUse: 91, aiThinking: 87, coIntelligence: 83 }
    },
    {
      name: 'Maria Garcia',
      email: 'maria.g@company.com',
      department: 'Operations',
      role: 'Operations Manager',
      completionDate: '2024-05-17',
      score: 73,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 71, tools: 75, responsibleUse: 76, aiThinking: 68, coIntelligence: 75 }
    },
    {
      name: 'James Miller',
      email: 'james.m@company.com',
      department: 'Sales',
      role: 'Sales Director',
      completionDate: '2024-05-11',
      score: 71,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 68, tools: 72, responsibleUse: 74, aiThinking: 65, coIntelligence: 76 }
    },
    {
      name: 'Lisa Rodriguez',
      email: 'lisa.r@company.com',
      department: 'Sales',
      role: 'Account Executive',
      completionDate: '2024-05-19',
      score: 69,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 65, tools: 70, responsibleUse: 72, aiThinking: 64, coIntelligence: 74 }
    },
    {
      name: 'David Kim',
      email: 'david.k@company.com',
      department: 'Finance',
      role: 'Financial Analyst',
      completionDate: '2024-05-20',
      score: 85,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 82, tools: 87, responsibleUse: 89, aiThinking: 83, coIntelligence: 84 }
    },
    {
      name: 'Amanda Foster',
      email: 'amanda.f@company.com',
      department: 'Engineering',
      role: 'Product Engineer',
      completionDate: '2024-05-21',
      score: 90,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 87, tools: 94, responsibleUse: 86, aiThinking: 92, coIntelligence: 91 }
    },
    {
      name: 'Carlos Mendez',
      email: 'carlos.m@company.com',
      department: 'Marketing',
      role: 'Digital Marketer',
      completionDate: '2024-05-22',
      score: 81,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 89, tools: 78, responsibleUse: 79, aiThinking: 76, coIntelligence: 83 }
    },
    {
      name: 'Rachel Green',
      email: 'rachel.g@company.com',
      department: 'HR',
      role: 'Talent Specialist',
      completionDate: '2024-05-23',
      score: 77,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 76, tools: 71, responsibleUse: 85, aiThinking: 73, coIntelligence: 80 }
    },
    {
      name: 'Kevin Walsh',
      email: 'kevin.w@company.com',
      department: 'Operations',
      role: 'Process Analyst',
      completionDate: '2024-05-24',
      score: 75,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 72, tools: 77, responsibleUse: 78, aiThinking: 70, coIntelligence: 78 }
    },
    {
      name: 'Diana Liu',
      email: 'diana.l@company.com',
      department: 'Engineering',
      role: 'Frontend Developer',
      completionDate: '2024-05-25',
      score: 86,
      cohort: 'Q2 2024 Full Workforce',
      skillScores: { prompting: 84, tools: 91, responsibleUse: 81, aiThinking: 88, coIntelligence: 86 }
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

  const departments = ['Marketing', 'Engineering', 'Sales', 'Finance', 'HR', 'Operations']

  const filteredParticipants = participantData.filter(participant => {
    const departmentMatch = selectedDepartment === 'all' || participant.department === selectedDepartment
    const searchMatch = searchTerm === '' || 
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.role.toLowerCase().includes(searchTerm.toLowerCase())
    
    let scoreMatch = true
    if (selectedScoreRange !== 'all') {
      switch (selectedScoreRange) {
        case 'high':
          scoreMatch = participant.score >= 85
          break
        case 'medium':
          scoreMatch = participant.score >= 70 && participant.score < 85
          break
        case 'low':
          scoreMatch = participant.score < 70
          break
      }
    }
    
    return departmentMatch && searchMatch && scoreMatch
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredParticipants.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedParticipants = filteredParticipants.slice(startIndex, endIndex)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedDepartment, selectedScoreRange, rowsPerPage])

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Assessment Data</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive view of AI assessment completion, participant data, and export capabilities
        </p>
      </div>

      {/* Participant Explorer */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 text-green-600 mr-2" />
                  Participant Explorer
                </CardTitle>
                <p className="text-sm text-gray-600">Individual participant data and completion status</p>
              </div>
              <div className="text-sm text-gray-600">
                {filteredParticipants.length} of {participantData.length} participants
              </div>
            </div>
            
            {/* Enhanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score Range</label>
                <select 
                  value={selectedScoreRange}
                  onChange={(e) => setSelectedScoreRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Scores</option>
                  <option value="high">High (85-100%)</option>
                  <option value="medium">Medium (70-84%)</option>
                  <option value="low">Low (0-69%)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rows per page</label>
                <select 
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 rows</option>
                  <option value={50}>50 rows</option>
                  <option value={100}>100 rows</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedDepartment('all')
                    setSelectedScoreRange('all')
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors w-full"
                >
                  Clear Filters
                </button>
              </div>
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
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Completion Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedParticipants.map((participant, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100 transition-colors hover:bg-blue-50 cursor-pointer"
                    onClick={() => setSelectedParticipant(participant)}
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{participant.name}</div>
                        <div className="text-sm text-gray-500">{participant.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{participant.department}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{participant.role}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        participant.score >= 85 ? 'text-green-600' : 
                        participant.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {participant.score}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {participant.completionDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredParticipants.length)} of {filteredParticipants.length} participants
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 text-sm rounded-md ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {filteredParticipants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No participants match the selected filters.
              </div>
            )}
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Click on any participant to view their detailed AI skills radar chart.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participant Detail Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedParticipant.name}</h3>
                  <p className="text-gray-600">{selectedParticipant.role} • {selectedParticipant.department}</p>
                  <p className="text-sm text-gray-500">{selectedParticipant.email}</p>
                </div>
                <button
                  onClick={() => setSelectedParticipant(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overall Score */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Overall AI Readiness</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-1">{selectedParticipant.score}%</div>
                  <p className="text-sm text-gray-600">Completed on {selectedParticipant.completionDate}</p>
                </div>
                
                {/* Skills Breakdown */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Skills Breakdown</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Prompting', score: selectedParticipant.skillScores.prompting },
                      { name: 'Tools', score: selectedParticipant.skillScores.tools },
                      { name: 'Responsible Use', score: selectedParticipant.skillScores.responsibleUse },
                      { name: 'AI Thinking', score: selectedParticipant.skillScores.aiThinking },
                      { name: 'Co-Intelligence', score: selectedParticipant.skillScores.coIntelligence }
                    ].map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{skill.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                skill.score >= 85 ? 'bg-green-500' : 
                                skill.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${skill.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{skill.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Radar Chart */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-4">AI Skills Radar Chart</h4>
                <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center" style={{ height: '300px' }}>
                  <svg width="280" height="280" viewBox="0 0 280 280">
                    {/* Pentagon grid lines */}
                    {[1, 2, 3, 4, 5].map(level => (
                      <g key={level}>
                        <polygon
                          points="140,40 210,110 180,200 100,200 70,110"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                          transform={`scale(${level * 0.2}) translate(${140 - 140 * level * 0.2}, ${140 - 140 * level * 0.2})`}
                        />
                      </g>
                    ))}
                    
                    {/* Axis lines */}
                    <line x1="140" y1="140" x2="140" y2="40" stroke="#d1d5db" strokeWidth="1" />
                    <line x1="140" y1="140" x2="210" y2="110" stroke="#d1d5db" strokeWidth="1" />
                    <line x1="140" y1="140" x2="180" y2="200" stroke="#d1d5db" strokeWidth="1" />
                    <line x1="140" y1="140" x2="100" y2="200" stroke="#d1d5db" strokeWidth="1" />
                    <line x1="140" y1="140" x2="70" y2="110" stroke="#d1d5db" strokeWidth="1" />
                    
                    {/* Data polygon */}
                    <polygon
                      points={[
                        [140, 40 + (100 - selectedParticipant.skillScores.prompting)],
                        [140 + (70 * selectedParticipant.skillScores.tools / 100), 110 - (30 * selectedParticipant.skillScores.tools / 100)],
                        [140 + (40 * selectedParticipant.skillScores.aiThinking / 100), 200 - (60 * selectedParticipant.skillScores.aiThinking / 100)],
                        [140 - (40 * selectedParticipant.skillScores.coIntelligence / 100), 200 - (60 * selectedParticipant.skillScores.coIntelligence / 100)],
                        [140 - (70 * selectedParticipant.skillScores.responsibleUse / 100), 110 - (30 * selectedParticipant.skillScores.responsibleUse / 100)]
                      ].map(point => `${point[0]},${point[1]}`).join(' ')}
                      fill="rgba(59, 130, 246, 0.3)"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    
                    {/* Data points */}
                    {[
                      { x: 140, y: 40 + (100 - selectedParticipant.skillScores.prompting), label: 'Prompting' },
                      { x: 140 + (70 * selectedParticipant.skillScores.tools / 100), y: 110 - (30 * selectedParticipant.skillScores.tools / 100), label: 'Tools' },
                      { x: 140 + (40 * selectedParticipant.skillScores.aiThinking / 100), y: 200 - (60 * selectedParticipant.skillScores.aiThinking / 100), label: 'AI Thinking' },
                      { x: 140 - (40 * selectedParticipant.skillScores.coIntelligence / 100), y: 200 - (60 * selectedParticipant.skillScores.coIntelligence / 100), label: 'Co-Intelligence' },
                      { x: 140 - (70 * selectedParticipant.skillScores.responsibleUse / 100), y: 110 - (30 * selectedParticipant.skillScores.responsibleUse / 100), label: 'Responsible Use' }
                    ].map((point, index) => (
                      <circle key={index} cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
                    ))}
                    
                    {/* Labels */}
                    <text x="140" y="30" textAnchor="middle" className="text-xs fill-gray-600" fontWeight="600">Prompting</text>
                    <text x="220" y="115" textAnchor="middle" className="text-xs fill-gray-600" fontWeight="600">Tools</text>
                    <text x="190" y="215" textAnchor="middle" className="text-xs fill-gray-600" fontWeight="600">AI Thinking</text>
                    <text x="90" y="215" textAnchor="middle" className="text-xs fill-gray-600" fontWeight="600">Co-Intelligence</text>
                    <text x="50" y="115" textAnchor="middle" className="text-xs fill-gray-600" fontWeight="600">Responsible Use</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}