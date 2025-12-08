import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/contexts/AuthContext'
import { dashboardDataService, AssessmentCohort, ParticipantData } from '@/lib/dashboardDataService'
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
  BarChart3,
  ChevronRight
} from 'lucide-react'

export function AssessmentData() {
  const { user } = useAuth()
  const [selectedCohort, setSelectedCohort] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedScoreRange, setSelectedScoreRange] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [cohortData, setCohortData] = useState<AssessmentCohort[]>([])
  const [participants, setParticipants] = useState<ParticipantData[]>([])

  useEffect(() => {
    loadAssessmentData()
  }, [user])

  useEffect(() => {
    loadParticipants()
  }, [selectedCohort, selectedDepartment, selectedScoreRange, searchTerm, user])

  const loadAssessmentData = async () => {
    try {
      setIsLoading(true)
      const cohorts = await dashboardDataService.getAssessmentCohorts(user || undefined)
      setCohortData(cohorts)
    } catch (error) {
      console.error('Error loading assessment data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadParticipants = async () => {
    try {
      const filters = {
        cohort: selectedCohort,
        department: selectedDepartment,
        scoreRange: selectedScoreRange,
        searchTerm: searchTerm.trim()
      }
      
      const participantData = await dashboardDataService.getFilteredParticipants(filters, user || undefined)
      setParticipants(participantData)
    } catch (error) {
      console.error('Error loading participants:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success'
      case 'In Progress': return 'warning'
      case 'Not Started': return 'danger'
      default: return 'default'
    }
  }

  const departments = ['Marketing', 'Engineering', 'Sales', 'Finance', 'HR', 'Operations']

  const filteredParticipants = participants.filter(participant => {
    const departmentMatch = selectedDepartment === 'all' || participant.department === selectedDepartment
    const searchMatch = searchTerm === '' || 
      (participant.name || participant.email).toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.role.toLowerCase().includes(searchTerm.toLowerCase())
    
    let scoreMatch = true
    if (selectedScoreRange !== 'all') {
      const score = participant.overallScore || 0
      switch (selectedScoreRange) {
        case 'high':
          scoreMatch = score >= 85
          break
        case 'medium':
          scoreMatch = score >= 70 && score < 85
          break
        case 'low':
          scoreMatch = score < 70
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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 text-green-600 mr-2" />
                  Participant Explorer
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Individual participant data and completion status</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center px-4 py-2 bg-white border border-green-300 text-green-700 text-sm font-medium rounded-lg hover:bg-green-50 hover:border-green-400 transition-all duration-200 shadow-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 hover:shadow-md transition-all duration-200 shadow-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Executive Report
                </button>
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
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedParticipants.map((participant, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100 transition-colors hover:bg-blue-50 cursor-pointer group"
                    onClick={() => setSelectedParticipant(participant)}
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{participant.name || participant.email}</div>
                        <div className="text-sm text-gray-500">{participant.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{participant.department}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{participant.role}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        (participant.overallScore || 0) >= 85 ? 'text-green-600' : 
                        (participant.overallScore || 0) >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {Math.round(participant.overallScore || 0)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {participant.completedDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
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
                  <h3 className="text-xl font-bold text-gray-900">{selectedParticipant.name || selectedParticipant.email}</h3>
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
                  <div className="text-3xl font-bold text-blue-600 mb-1">{Math.round(selectedParticipant.overallScore || 0)}%</div>
                  <p className="text-sm text-gray-600">Completed on {selectedParticipant.completedDate}</p>
                </div>
                
                {/* Skills Breakdown */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Skills Breakdown</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Prompting', score: selectedParticipant.dimensionScores?.promptingProficiency || 0 },
                      { name: 'Tools', score: selectedParticipant.dimensionScores?.toolProficiency || 0 },
                      { name: 'Responsible Use', score: selectedParticipant.dimensionScores?.responsibleUsage || 0 },
                      { name: 'AI Thinking', score: selectedParticipant.dimensionScores?.criticalThinking || 0 },
                      { name: 'Co-Intelligence', score: selectedParticipant.dimensionScores?.coIntelligence || 0 }
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
                <div className="bg-gray-50 rounded-lg p-6" style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      {
                        pillar: 'Prompting',
                        score: selectedParticipant.dimensionScores?.promptingProficiency || 0
                      },
                      {
                        pillar: 'Tools',
                        score: selectedParticipant.dimensionScores?.toolProficiency || 0
                      },
                      {
                        pillar: 'Responsible Use',
                        score: selectedParticipant.dimensionScores?.responsibleUsage || 0
                      },
                      {
                        pillar: 'AI Thinking',
                        score: selectedParticipant.dimensionScores?.criticalThinking || 0
                      },
                      {
                        pillar: 'Co-Intelligence',
                        score: selectedParticipant.dimensionScores?.coIntelligence || 0
                      }
                    ]}>
                      <PolarGrid gridType="polygon" radialLines={true} />
                      <PolarAngleAxis 
                        dataKey="pillar" 
                        tick={{ fontSize: 12, fontWeight: 'bold' }}
                        className="text-gray-700"
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]} 
                        tick={{ fontSize: 10 }}
                        tickCount={6}
                        className="text-gray-500"
                      />
                      <Radar 
                        dataKey="score" 
                        stroke="#3b82f6" 
                        fill="rgba(59, 130, 246, 0.2)" 
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#3b82f6' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}