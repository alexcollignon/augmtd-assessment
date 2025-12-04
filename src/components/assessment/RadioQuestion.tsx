import React from 'react'
import { AssessmentQuestion as QuestionType, QuestionOption } from '@/types'
import { cn } from '@/lib/utils'

interface RadioQuestionProps {
  question: QuestionType
  value?: string
  onChange: (value: string) => void
  error?: string
}

export function RadioQuestion({ question, value, onChange, error }: RadioQuestionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {question.text}
        </h3>
        
        <div className="space-y-3">
          {question.options?.map((option: QuestionOption) => (
            <label
              key={option.id}
              className={cn(
                "flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50",
                value === option.value 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200"
              )}
            >
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  {option.label}
                </span>
              </div>
            </label>
          ))}
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  )
}