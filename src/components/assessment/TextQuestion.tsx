import { AssessmentQuestion as QuestionType } from '@/types'
import { cn } from '@/lib/utils'

interface TextQuestionProps {
  question: QuestionType
  value?: string
  onChange: (value: string) => void
  error?: string
}

export function TextQuestion({ question, value = '', onChange, error }: TextQuestionProps) {
  const isLongText = question.text.includes('Be as specific as possible')
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {question.text}
        </h3>
        
        {isLongText ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Please provide as much detail as possible..."
            rows={5}
            className={cn(
              "w-full px-4 py-3 border-2 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
              error ? "border-red-300" : "border-gray-300"
            )}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your response..."
            className={cn(
              "w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
              error ? "border-red-300" : "border-gray-300"
            )}
          />
        )}
        
        {isLongText && (
          <p className="mt-2 text-sm text-gray-500">
            Character count: {value.length}
          </p>
        )}
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  )
}