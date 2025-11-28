import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MetricCard } from '@/components/ui/MetricCard'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  FileText, 
  Users,
  Database,
  Settings,
  CheckCircle,
  XCircle,
  ArrowDown,
  Check,
  X,
  Globe,
  Building2,
  Calendar,
  Edit3,
  Save,
  Plus,
  Minus
} from 'lucide-react'

export function RiskCompliance() {
  const overallRiskScore = 68
  
  const responsibleAIMetrics = [
    { name: 'Fairness', score: 72, icon: Users },
    { name: 'Explainability', score: 58, icon: Eye },
    { name: 'Bias Monitoring', score: 64, icon: Settings },
    { name: 'Safety Controls', score: 81, icon: Shield },
  ]

  const securityHeatmap = [
    { department: 'Operations', score: 45, level: 'Low' },
    { department: 'Sales', score: 58, level: 'Medium' },
    { department: 'Marketing', score: 62, level: 'Medium' },
    { department: 'HR', score: 74, level: 'High' },
    { department: 'Engineering', score: 85, level: 'High' },
    { department: 'Finance', score: 91, level: 'High' },
  ]

  const [toolApprovals, setToolApprovals] = useState([
    { tool: 'ChatGPT', usage: 'High', risk: 'Medium', users: 127, approved: false },
    { tool: 'Claude', usage: 'Medium', risk: 'Low', users: 43, approved: true },
    { tool: 'GitHub Copilot', usage: 'High', risk: 'Low', users: 89, approved: true },
    { tool: 'Grammarly AI', usage: 'Medium', risk: 'Low', users: 156, approved: true },
    { tool: 'Midjourney', usage: 'Low', risk: 'High', users: 12, approved: false },
  ])
  
  const handleToolApproval = (toolName: string) => {
    setToolApprovals(prev => 
      prev.map(tool => 
        tool.tool === toolName 
          ? { ...tool, approved: !tool.approved }
          : tool
      )
    )
  }

  const governanceGaps = [
    'AI ethics committee not established',
    'Data lineage tracking incomplete',
    'Model monitoring framework missing',
    'Incident response plan undefined',
    'Third-party AI vendor assessments lacking'
  ]

  // Company profile state for dynamic compliance
  const [companyProfile, setCompanyProfile] = useState({
    regions: ['North America', 'Europe'],
    industry: 'Technology',
    companyType: 'Public',
    dataTypes: ['Personal Data', 'Financial Data']
  })

  // Editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editProfile, setEditProfile] = useState({ ...companyProfile })

  // Available options for dropdowns
  const availableOptions = {
    regions: [
      'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Africa', 'Middle East',
      'United States', 'California', 'Canada', 'United Kingdom', 'Germany', 'France',
      'China', 'Japan', 'Australia', 'Brazil', 'India'
    ],
    industries: [
      'Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 'Retail',
      'Education', 'Government', 'Energy', 'Transportation', 'Media', 'Real Estate',
      'Consulting', 'Non-Profit', 'Other'
    ],
    companyTypes: ['Public', 'Private', 'Non-Profit', 'Government'],
    dataTypes: [
      'Personal Data', 'Financial Data', 'Health Data', 'Payment Card Data',
      'Intellectual Property', 'Employee Data', 'Customer Data', 'Biometric Data'
    ]
  }

  const handleSaveProfile = () => {
    setCompanyProfile({ ...editProfile })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditProfile({ ...companyProfile })
    setIsEditing(false)
  }

  const toggleSelection = (field: keyof typeof editProfile, value: string) => {
    if (field === 'industry' || field === 'companyType') {
      setEditProfile(prev => ({ ...prev, [field]: value }))
    } else {
      const currentArray = editProfile[field] as string[]
      if (currentArray.includes(value)) {
        setEditProfile(prev => ({
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        }))
      } else {
        setEditProfile(prev => ({
          ...prev,
          [field]: [...currentArray, value]
        }))
      }
    }
  }

  // Dynamic compliance frameworks based on company profile
  const getApplicableCompliance = () => {
    const frameworks = []
    
    // Universal/Common Frameworks
    frameworks.push(
      { 
        category: 'Information Security', 
        regulation: 'ISO 27001', 
        status: 'Good Awareness', 
        statusColor: 'success',
        keyMetric: '84% employees know security policies',
        nextAction: 'Train 23 new hires on security procedures',
        businessImpact: 'Reduces human error security risks',
        required: false, 
        reason: 'Industry best practice',
        type: 'awareness'
      }
    )
    
    // Region-specific compliance
    if (companyProfile.regions.includes('Europe') || companyProfile.regions.some(r => ['United Kingdom', 'Germany', 'France'].includes(r))) {
      frameworks.push(
        { 
          category: 'Data Privacy', 
          regulation: 'GDPR', 
          status: 'Strong Readiness', 
          statusColor: 'success',
          keyMetric: '89% workforce understands data handling rules',
          nextAction: 'Complete privacy training for 12 marketing staff',
          businessImpact: 'Reduces data breach and violation risks',
          required: true, 
          reason: 'EU operations or EU citizen data',
          type: 'awareness'
        },
        { 
          category: 'AI Governance', 
          regulation: 'EU AI Act', 
          status: 'Low Awareness', 
          statusColor: 'danger',
          keyMetric: 'Only 34% of AI teams know requirements',
          nextAction: 'Urgent: AI governance training for tech teams',
          businessImpact: 'Risk of non-compliant AI system deployment',
          required: true, 
          reason: 'AI systems deployed in EU',
          type: 'awareness'
        }
      )
    }
    
    if (companyProfile.regions.includes('California') || companyProfile.regions.includes('United States')) {
      frameworks.push(
        { 
          category: 'Data Privacy', 
          regulation: 'CCPA', 
          status: 'Mixed Awareness', 
          statusColor: 'warning',
          keyMetric: '67% customer service team aware of rights',
          nextAction: 'Train sales team on consumer privacy rights',
          businessImpact: 'Reduces consumer complaint risks',
          required: true, 
          reason: 'California consumer data',
          type: 'awareness'
        }
      )
    }
    
    if (companyProfile.regions.includes('Canada')) {
      frameworks.push(
        { 
          category: 'Data Privacy', 
          regulation: 'PIPEDA', 
          status: 'Good Understanding', 
          statusColor: 'success',
          keyMetric: '78% employees know privacy procedures',
          nextAction: 'Refresh training for remote workers',
          businessImpact: 'Maintains privacy compliance culture',
          required: true, 
          reason: 'Canadian privacy law',
          type: 'awareness'
        }
      )
    }
    
    if (companyProfile.regions.includes('Australia')) {
      frameworks.push(
        { 
          category: 'Data Privacy', 
          regulation: 'Privacy Act', 
          status: 'Needs Improvement', 
          statusColor: 'warning',
          keyMetric: '58% know breach reporting procedures',
          nextAction: 'Priority training on incident response',
          businessImpact: 'Reduces regulatory penalty risks',
          required: true, 
          reason: 'Australian privacy law',
          type: 'awareness'
        }
      )
    }
    
    if (companyProfile.regions.includes('China')) {
      frameworks.push(
        { 
          category: 'Data Protection', 
          regulation: 'PIPL', 
          status: 'Very Low Awareness', 
          statusColor: 'danger',
          keyMetric: 'Only 23% of teams understand requirements',
          nextAction: 'Immediate PIPL awareness training needed',
          businessImpact: 'Risk of non-compliant data handling',
          required: true, 
          reason: 'Chinese personal information law',
          type: 'awareness'
        }
      )
    }
    
    // Company type specific
    if (companyProfile.companyType === 'Public') {
      frameworks.push(
        { 
          category: 'Financial Reporting', 
          regulation: 'SOX', 
          status: 'High Compliance Knowledge', 
          statusColor: 'success',
          keyMetric: '94% finance team understands controls',
          nextAction: 'Train 3 new finance hires on SOX requirements',
          businessImpact: 'Supports accurate financial reporting',
          required: true, 
          reason: 'Publicly traded company',
          type: 'awareness'
        }
      )
    }
    
    // Industry specific
    if (companyProfile.industry === 'Healthcare') {
      frameworks.push(
        { 
          category: 'Healthcare Privacy', 
          regulation: 'HIPAA', 
          status: 'Excellent Knowledge', 
          statusColor: 'success',
          keyMetric: '91% clinical staff understand PHI rules',
          nextAction: 'Train 4 new administrative hires',
          businessImpact: 'Protects patient privacy and trust',
          required: true, 
          reason: 'Healthcare industry',
          type: 'awareness'
        }
      )
    }
    
    if (companyProfile.industry === 'Financial Services') {
      frameworks.push(
        { 
          category: 'Financial Regulation', 
          regulation: 'GLBA', 
          status: 'Strong Compliance Culture', 
          statusColor: 'success',
          keyMetric: '87% staff know customer privacy rules',
          nextAction: 'Update procedures training for tellers',
          businessImpact: 'Maintains customer data protection',
          required: true, 
          reason: 'Financial services industry',
          type: 'awareness'
        },
        { 
          category: 'Banking Security', 
          regulation: 'FFIEC', 
          status: 'Moderate Understanding', 
          statusColor: 'warning',
          keyMetric: '68% IT staff understand cyber requirements',
          nextAction: 'Cybersecurity awareness for all IT teams',
          businessImpact: 'Reduces operational security risks',
          required: true, 
          reason: 'Financial institution',
          type: 'awareness'
        }
      )
    }
    
    if (companyProfile.industry === 'Government') {
      frameworks.push(
        { 
          category: 'Federal Security', 
          regulation: 'FedRAMP', 
          status: 'Limited Awareness', 
          statusColor: 'warning',
          keyMetric: '52% cloud teams understand requirements',
          nextAction: 'Federal security training for cloud operations',
          businessImpact: 'Supports federal contract compliance',
          required: true, 
          reason: 'Government cloud services',
          type: 'awareness'
        }
      )
    }
    
    // Data type specific
    if (companyProfile.dataTypes.includes('Payment Card Data')) {
      frameworks.push(
        { 
          category: 'Payment Security', 
          regulation: 'PCI DSS', 
          status: 'Good Security Awareness', 
          statusColor: 'warning',
          keyMetric: '72% payment staff know security rules',
          nextAction: 'Train e-commerce team on card data handling',
          businessImpact: 'Reduces payment security incidents',
          required: true, 
          reason: 'Payment card data processing',
          type: 'awareness'
        }
      )
    }
    
    if (companyProfile.dataTypes.includes('Health Data')) {
      frameworks.push(
        { 
          category: 'Health Privacy', 
          regulation: 'HIPAA', 
          status: 'Excellent Knowledge', 
          statusColor: 'success',
          keyMetric: '91% staff handling health data trained',
          nextAction: 'Annual refresher for research teams',
          businessImpact: 'Protects health information privacy',
          required: true, 
          reason: 'Health information processing',
          type: 'awareness'
        }
      )
    }
    
    if (companyProfile.dataTypes.includes('Biometric Data')) {
      frameworks.push(
        { 
          category: 'Biometric Privacy', 
          regulation: 'BIPA', 
          status: 'Poor Understanding', 
          statusColor: 'danger',
          keyMetric: 'Only 31% know biometric consent rules',
          nextAction: 'Urgent: biometric privacy training required',
          businessImpact: 'High risk of privacy violations',
          required: true, 
          reason: 'Biometric data collection',
          type: 'awareness'
        }
      )
    }
    
    // Remove duplicates based on regulation name
    const uniqueFrameworks = frameworks.filter((framework, index, self) =>
      index === self.findIndex(f => f.regulation === framework.regulation)
    )
    
    return uniqueFrameworks
  }

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'success'
    if (score >= 50) return 'warning'
    return 'danger'
  }

  const getUsageColor = (usage: string) => {
    switch (usage) {
      case 'High': return 'danger'
      case 'Medium': return 'warning'
      default: return 'success'
    }
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'danger'
      case 'Medium': return 'warning'
      default: return 'success'
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Risk & Compliance</h1>
        <p className="text-gray-600 mt-2">
          AI risk assessment, responsible AI metrics, and governance status
        </p>
      </div>

      {/* Risk Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="mb-6">
              <CircularProgress value={overallRiskScore} size="lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Risk Score</h2>
            <p className="text-gray-600 mb-4">Overall ethical AI risk posture</p>
            <div className="flex items-center justify-center text-gray-400 mt-6 pt-4 border-t border-gray-200">
              <ArrowDown className="w-4 h-4 mr-1" />
              <span className="text-xs">Based on 4 metrics below</span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex items-center justify-center">
          <CardContent className="text-center py-5">
            <AlertTriangle className="w-6 h-6 text-danger-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">High-Risk Areas</p>
            <div className="text-3xl font-bold text-gray-900">3</div>
            <p className="text-xs text-gray-500 mt-1">Shadow AI, governance gaps, bias</p>
          </CardContent>
        </Card>
        <Card className="flex items-center justify-center">
          <CardContent className="text-center py-5">
            <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">Compliance Score</p>
            <div className="text-3xl font-bold text-gray-900">74%</div>
            <p className="text-xs text-gray-500 mt-1">Regulatory alignment</p>
          </CardContent>
        </Card>
        <Card className="flex items-center justify-center">
          <CardContent className="text-center py-5">
            <Eye className="w-6 h-6 text-warning-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">Shadow AI Tools</p>
            <div className="text-3xl font-bold text-gray-900">5</div>
            <p className="text-xs text-gray-500 mt-1">Detected in use</p>
          </CardContent>
        </Card>
      </div>

      {/* Responsible AI Radar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            Responsible AI Assessment
          </CardTitle>
          <p className="text-sm text-gray-600">Key ethical AI metrics and controls</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {responsibleAIMetrics.map((metric) => {
              const Icon = metric.icon
              return (
                <div key={metric.name} className="text-center">
                  <div className="mb-4">
                    <CircularProgress value={metric.score} size="md" />
                  </div>
                  <div className="flex justify-center mb-2">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">{metric.name}</h4>
                  <p className="text-sm text-gray-600">{metric.score}%</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              Risk Heatmap by Department
            </CardTitle>
            <p className="text-sm text-gray-600">AI risk scores across organizational departments</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityHeatmap.map((dept) => (
                <div key={dept.department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3" 
                         style={{ 
                           backgroundColor: dept.score >= 75 ? '#10b981' : 
                                          dept.score >= 50 ? '#f59e0b' : '#ef4444' 
                         }}
                    />
                    <span className="font-medium text-gray-900">{dept.department}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">{dept.score}%</span>
                    <Badge variant={getRiskColor(dept.score)}>{dept.level}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shadow AI Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 text-warning-600 mr-2" />
              AI Tool Governance
            </CardTitle>
            <p className="text-sm text-gray-600">Manage approved tools and monitor shadow AI usage</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {toolApprovals.map((tool) => (
                <div key={tool.tool} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleToolApproval(tool.tool)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        tool.approved 
                          ? 'bg-success-100 text-success-600 hover:bg-success-200' 
                          : 'bg-danger-100 text-danger-600 hover:bg-danger-200'
                      }`}
                      title={tool.approved ? 'Click to revoke approval' : 'Click to approve tool'}
                    >
                      {tool.approved ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                    <div>
                      <h4 className="font-medium text-gray-900">{tool.tool}</h4>
                      <p className="text-sm text-gray-600">{tool.users} users</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={tool.approved ? 'success' : 'danger'} size="sm">
                      {tool.approved ? 'Approved' : 'Unapproved'}
                    </Badge>
                    <Badge variant={getUsageColor(tool.usage)} size="sm">
                      {tool.usage} Usage
                    </Badge>
                    <Badge variant={getRiskBadgeColor(tool.risk)} size="sm">
                      {tool.risk} Risk
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Click the approval buttons to manage which AI tools are permitted for use in your organization.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Governance Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <XCircle className="w-5 h-5 text-danger-600 mr-2" />
            Top 5 Governance Gaps
          </CardTitle>
          <p className="text-sm text-gray-600">Critical areas requiring immediate attention</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {governanceGaps.map((gap, index) => (
              <div key={index} className="p-4 border-2 border-danger-200 bg-danger-50 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-danger-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-danger-800">{gap}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
            Applicable Regulatory Compliance
          </CardTitle>
          <p className="text-sm text-gray-600">Based on your company profile and operational scope</p>
        </CardHeader>
        <CardContent>
          {/* Company Profile Summary */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Company Profile</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center px-3 py-1 text-sm bg-success-600 text-white rounded hover:bg-success-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {!isEditing ? (
              // Display Mode
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Globe className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-gray-600">Regions:</span>
                  <span className="ml-1 font-medium">{companyProfile.regions.join(', ')}</span>
                </div>
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-gray-600">Industry:</span>
                  <span className="ml-1 font-medium">{companyProfile.industry}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-1 font-medium">{companyProfile.companyType}</span>
                </div>
                <div className="flex items-center">
                  <Database className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-gray-600">Data:</span>
                  <span className="ml-1 font-medium">{companyProfile.dataTypes.join(', ')}</span>
                </div>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-6">
                {/* Regions */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 text-blue-600 mr-2" />
                    Operating Regions
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {availableOptions.regions.map(region => (
                      <button
                        key={region}
                        onClick={() => toggleSelection('regions', region)}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                          editProfile.regions.includes(region)
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 text-blue-600 mr-2" />
                    Industry
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {availableOptions.industries.map(industry => (
                      <button
                        key={industry}
                        onClick={() => toggleSelection('industry', industry)}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                          editProfile.industry === industry
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Company Type */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-blue-600 mr-2" />
                    Company Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableOptions.companyTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => toggleSelection('companyType', type)}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                          editProfile.companyType === type
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Data Types */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Database className="w-4 h-4 text-blue-600 mr-2" />
                    Data Types Processed
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableOptions.dataTypes.map(dataType => (
                      <button
                        key={dataType}
                        onClick={() => toggleSelection('dataTypes', dataType)}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                          editProfile.dataTypes.includes(dataType)
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {dataType}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Applicable Compliance Frameworks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getApplicableCompliance().map((item) => (
              <div key={item.regulation} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.regulation}</h4>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge 
                      variant={item.statusColor}
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                    {item.required && (
                      <Badge variant="info" size="sm">Required</Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-3">{item.reason}</p>
                
                {/* Executive Compliance Metrics */}
                <div className="space-y-3">
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">Key Metric</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{item.keyMetric}</p>
                  </div>
                  
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-blue-700">Next Action</span>
                    </div>
                    <p className="text-xs text-blue-800">{item.nextAction}</p>
                  </div>
                  
                  <div className="p-2 bg-orange-50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-orange-700">Business Impact</span>
                    </div>
                    <p className="text-xs text-orange-800">{item.businessImpact}</p>
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