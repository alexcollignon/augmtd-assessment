import React from 'react'
import { AssessmentQuestion as QuestionType } from '@/types'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectQuestionProps {
  question: QuestionType
  value?: string
  onChange: (value: string) => void
  error?: string
}

export function SelectQuestion({ question, value, onChange, error }: SelectQuestionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {question.text}
        </h3>
        
        <div className="relative">
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "w-full px-4 py-3 border-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none",
              error ? "border-red-300" : "border-gray-300"
            )}
          >
            <option value="" disabled>
              Select an option...
            </option>
            {question.options?.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  )
}