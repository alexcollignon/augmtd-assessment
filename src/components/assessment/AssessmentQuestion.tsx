import { AssessmentQuestion as QuestionType } from '@/types'
import { RadioQuestion } from './RadioQuestion'
import { SelectQuestion } from './SelectQuestion'
import { MultiSelectQuestion } from './MultiSelectQuestion'
import { SliderQuestion } from './SliderQuestion'
import { TextQuestion } from './TextQuestion'

interface AssessmentQuestionProps {
  question: QuestionType
  value?: string | string[] | number
  onChange: (value: string | string[] | number) => void
  error?: string
  showQuestionNumber?: boolean
  questionNumber?: number
}

export function AssessmentQuestion({ 
  question, 
  value, 
  onChange, 
  error,
  showQuestionNumber = false,
  questionNumber
}: AssessmentQuestionProps) {
  // Render question number if requested
  const questionHeader = showQuestionNumber && questionNumber && (
    <div className="mb-2">
      <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
        Question {questionNumber}
      </span>
    </div>
  )

  // Render the appropriate question component based on type
  const renderQuestionComponent = () => {
    switch (question.type) {
      case 'radio':
        return (
          <RadioQuestion
            question={question}
            value={value as string}
            onChange={onChange as (value: string) => void}
            error={error}
          />
        )
      
      case 'select':
        return (
          <SelectQuestion
            question={question}
            value={value as string}
            onChange={onChange as (value: string) => void}
            error={error}
          />
        )
      
      case 'multi_select':
        return (
          <MultiSelectQuestion
            question={question}
            value={value as string[]}
            onChange={onChange as (value: string[]) => void}
            error={error}
          />
        )
      
      case 'slider':
        return (
          <SliderQuestion
            question={question}
            value={value as number}
            onChange={onChange as (value: number) => void}
            error={error}
          />
        )
      
      case 'text':
        return (
          <TextQuestion
            question={question}
            value={value as string}
            onChange={onChange as (value: string) => void}
            error={error}
          />
        )
      
      default:
        return (
          <div className="text-red-600">
            Unsupported question type: {question.type}
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {questionHeader}
      {renderQuestionComponent()}
    </div>
  )
}