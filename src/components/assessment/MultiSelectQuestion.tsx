import React from 'react'
import { AssessmentQuestion as QuestionType, QuestionOption } from '@/types'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface MultiSelectQuestionProps {
  question: QuestionType
  value?: string[]
  onChange: (value: string[]) => void
  error?: string
}

export function MultiSelectQuestion({ question, value = [], onChange, error }: MultiSelectQuestionProps) {
  const handleOptionToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {question.text}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Check all that apply
        </p>
        
        <div className="space-y-3">
          {question.options?.map((option: QuestionOption) => {
            const isSelected = value.includes(option.value)
            
            return (
              <label
                key={option.id}
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50",
                  isSelected 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200"
                )}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleOptionToggle(option.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  {isSelected && (
                    <Check className="absolute inset-0 w-4 h-4 text-blue-600 pointer-events-none" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                </div>
              </label>
            )
          })}
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  )
}