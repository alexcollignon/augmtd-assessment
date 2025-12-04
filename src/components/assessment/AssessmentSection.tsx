import React, { useState, useEffect } from 'react'
import { AssessmentSection as SectionType, AssessmentQuestion as QuestionType } from '@/types'
import { useAssessment } from '@/contexts/AssessmentContext'
import { AssessmentQuestion } from './AssessmentQuestion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AssessmentSectionProps {
  sectionId: string
  section: SectionType
  onNext?: () => void
  onPrevious?: () => void
  showNavigation?: boolean
  isFirstSection?: boolean
  isLastSection?: boolean
}

export function AssessmentSection({ 
  sectionId, 
  section, 
  onNext, 
  onPrevious, 
  showNavigation = true,
  isFirstSection = false,
  isLastSection = false 
}: AssessmentSectionProps) {
  const { saveResponse, getResponse } = useAssessment()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [responses, setResponses] = useState<Record<string, string | string[] | number>>({})

  // Load existing responses on mount
  useEffect(() => {
    const existingResponses: Record<string, string | string[] | number> = {}
    section.questions.forEach(question => {
      const response = getResponse(sectionId, question.id)
      if (response) {
        existingResponses[question.id] = response.value
      }
    })
    setResponses(existingResponses)
  }, [sectionId, section.questions, getResponse])

  // Calculate completion percentage for this section
  const completedQuestions = section.questions.filter(question => {
    const value = responses[question.id]
    return value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
  }).length

  const completionPercentage = Math.round((completedQuestions / section.questions.length) * 100)

  // Handle question response
  const handleQuestionChange = (questionId: string, value: string | string[] | number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
    saveResponse(sectionId, questionId, value)
    
    // Clear error for this question
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  // Validate section completion
  const validateSection = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    section.questions.forEach(question => {
      const value = responses[question.id]
      const isEmpty = value === undefined || value === '' || (Array.isArray(value) && value.length === 0)
      
      if (isEmpty) {
        newErrors[question.id] = 'This question is required'
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  // Handle next button
  const handleNext = () => {
    if (validateSection() && onNext) {
      onNext()
    }
  }

  // Handle previous button  
  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{section.title}</h1>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>{completedQuestions} of {section.questions.length} completed</span>
          </div>
          <div className="text-blue-600 font-medium">
            {completionPercentage}% complete
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {section.questions.map((question: QuestionType, index) => (
          <Card key={question.id} className="shadow-sm">
            <CardContent className="p-8">
              <AssessmentQuestion
                question={question}
                value={responses[question.id]}
                onChange={(value) => handleQuestionChange(question.id, value)}
                error={errors[question.id]}
                showQuestionNumber={true}
                questionNumber={index + 1}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Validation Errors Summary */}
      {Object.keys(errors).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-900 mb-2">
                  Please complete all required questions
                </h3>
                <p className="text-sm text-red-700">
                  {Object.keys(errors).length} question{Object.keys(errors).length !== 1 ? 's' : ''} still need{Object.keys(errors).length === 1 ? 's' : ''} to be answered before you can continue.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {showNavigation && (
        <div className="flex justify-between items-center py-8">
          {!isFirstSection ? (
            <button
              onClick={handlePrevious}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Section
            </button>
          ) : (
            <div /> // Empty div for spacing
          )}

          {!isLastSection ? (
            <button
              onClick={handleNext}
              className={cn(
                "flex items-center px-8 py-3 rounded-lg font-medium transition-all",
                completionPercentage === 100
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
              disabled={completionPercentage !== 100}
            >
              Next Section
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={cn(
                "flex items-center px-8 py-3 rounded-lg font-medium transition-all",
                completionPercentage === 100
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
              disabled={completionPercentage !== 100}
            >
              Complete Assessment
              <CheckCircle className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}