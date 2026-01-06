import { AssessmentQuestion as QuestionType } from '@/types'
import { cn } from '@/lib/utils'

interface SliderQuestionProps {
  question: QuestionType
  value?: number
  onChange: (value: number) => void
  error?: string
}

export function SliderQuestion({ question, value = 0, onChange, error }: SliderQuestionProps) {
  const min = question.min || 0
  const max = question.max || 100
  const step = question.step || 1

  // Get labels for key positions
  const getLabels = () => {
    if (question.labels) {
      return Object.entries(question.labels).map(([pos, label]) => ({
        position: parseInt(pos),
        label
      }))
    }
    return [
      { position: min, label: min.toString() },
      { position: max, label: max.toString() }
    ]
  }

  const labels = getLabels()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {question.text}
        </h3>
        
        <div className="space-y-6">
          {/* Current value display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {value}{question.max === 100 ? '%' : ''}
            </div>
          </div>
          
          {/* Slider container */}
          <div className="relative px-3">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value))}
              className={cn(
                "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
                "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600",
                "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg",
                "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full",
                "[&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer",
                "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg"
              )}
            />
            
            {/* Progress track */}
            <div 
              className="absolute top-1/2 left-3 h-2 bg-blue-600 rounded-lg pointer-events-none transform -translate-y-1/2"
              style={{ width: `${((value - min) / (max - min)) * 100}%` }}
            />
          </div>
          
          {/* Labels */}
          <div className="relative px-3">
            <div className="flex justify-between text-sm text-gray-600">
              {labels.map((label, index) => (
                <div 
                  key={index}
                  className="text-center"
                  style={{ 
                    position: labels.length === 2 ? 'relative' : 'absolute',
                    left: labels.length > 2 ? `${((label.position - min) / (max - min)) * 100}%` : 'auto',
                    transform: labels.length > 2 ? 'translateX(-50%)' : 'none'
                  }}
                >
                  <div className="font-medium">{label.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  )
}