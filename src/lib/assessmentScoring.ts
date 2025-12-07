import { 
  AssessmentQuestion, 
  AssessmentResponse, 
  AssessmentResult, 
  DimensionScore, 
  RadarChartData,
  AssessmentDimension,
  AssessmentTemplate 
} from '@/types'

export class AssessmentScoringEngine {
  private template: AssessmentTemplate
  private responses: Map<string, AssessmentResponse>

  constructor(template: AssessmentTemplate) {
    this.template = template
    this.responses = new Map()
  }

  addResponse(response: AssessmentResponse) {
    const key = `${response.sectionId}-${response.questionId}`
    this.responses.set(key, response)
  }

  addResponses(responses: AssessmentResponse[]) {
    responses.forEach(response => this.addResponse(response))
  }

  calculateQuestionScore(question: AssessmentQuestion, value: string | string[] | number): number {
    if (!question.scoring) return 0

    const { scoring } = question

    switch (question.type) {
      case 'radio':
      case 'select':
        if (typeof value === 'string' && scoring.valueMapping) {
          return scoring.valueMapping[value] || 0
        }
        return 0

      case 'multi_select':
        if (Array.isArray(value) && question.options) {
          let totalScore = 0
          for (const selectedValue of value) {
            const option = question.options.find(opt => opt.value === selectedValue)
            if (option && option.score !== undefined) {
              totalScore += option.score
            } else if (scoring.valueMapping && scoring.valueMapping[selectedValue]) {
              totalScore += scoring.valueMapping[selectedValue]
            }
          }
          return Math.min(totalScore, 5) // Cap at max score of 5
        }
        return 0

      case 'slider':
        if (typeof value === 'number') {
          const min = question.min || 0
          const max = question.max || 100
          return ((value - min) / (max - min)) * 5 // Normalize to 0-5 scale
        }
        return 0

      case 'text':
        return 0

      default:
        return 0
    }
  }

  calculateDimensionScores(): DimensionScore[] {
    const dimensionTotals = new Map<string, { totalScore: number; totalWeight: number; maxScore: number }>()
    
    // Check if dimensions exist
    if (!this.template.dimensions || !Array.isArray(this.template.dimensions)) {
      console.error('Template dimensions missing or invalid:', this.template)
      return []
    }
    
    // Initialize dimension totals
    this.template.dimensions.forEach(dim => {
      dimensionTotals.set(dim.id, { 
        totalScore: 0, 
        totalWeight: 0, 
        maxScore: dim.maxScore 
      })
    })

    // Process all questions across all sections
    const allQuestions = [
      ...this.template.profile.questions,
      ...this.template.strategic.questions,
      ...this.template.competence.questions
    ]

    allQuestions.forEach(question => {
      if (!question.scoring) return

      const { dimension, weight } = question.scoring
      const responseKey = this.findResponseKey(question.id)
      
      if (responseKey) {
        const response = this.responses.get(responseKey)
        if (response) {
          const questionScore = this.calculateQuestionScore(question, response.value)
          const weightedScore = questionScore * weight

          const dimTotal = dimensionTotals.get(dimension)
          if (dimTotal) {
            dimTotal.totalScore += weightedScore
            dimTotal.totalWeight += weight
            dimensionTotals.set(dimension, dimTotal)
          }
        }
      }
    })

    // Calculate final dimension scores
    return Array.from(dimensionTotals.entries()).map(([dimensionId, totals]) => {
      const dimension = this.template.dimensions.find(d => d.id === dimensionId)
      const score = totals.totalWeight > 0 ? totals.totalScore / totals.totalWeight : 0
      const percentage = (score / 5) * 100 // Convert to percentage (assuming max question score is 5)

      return {
        dimension: dimension?.name || dimensionId,
        score,
        maxScore: totals.maxScore,
        percentage: Math.round(percentage)
      }
    })
  }

  calculateOverallScore(dimensionScores: DimensionScore[]): number {
    if (dimensionScores.length === 0) return 0

    const totalWeightedScore = dimensionScores.reduce((sum, dim) => {
      const dimensionWeight = this.template.dimensions.find(d => d.name === dim.dimension)?.weight || 1
      return sum + (dim.percentage * dimensionWeight)
    }, 0)

    const totalWeight = dimensionScores.reduce((sum, dim) => {
      return sum + (this.template.dimensions.find(d => d.name === dim.dimension)?.weight || 1)
    }, 0)

    return Math.round(totalWeightedScore / totalWeight)
  }

  generateRadarData(dimensionScores: DimensionScore[], peerAverages?: Record<string, number>): RadarChartData[] {
    return dimensionScores.map(dim => ({
      dimension: dim.dimension,
      userScore: dim.percentage,
      peerAverage: peerAverages?.[dim.dimension],
      maxScore: 100
    }))
  }

  generateRecommendations(dimensionScores: DimensionScore[]): string[] {
    const recommendations: string[] = []
    
    // Sort dimensions by score to identify areas for improvement
    const sortedDimensions = dimensionScores.sort((a, b) => a.percentage - b.percentage)
    
    // Generate recommendations for lowest scoring dimensions
    sortedDimensions.slice(0, 3).forEach(dim => {
      if (dim.percentage < 60) {
        recommendations.push(this.getRecommendationForDimension(dim.dimension, dim.percentage))
      }
    })

    // Add general recommendations based on overall performance
    const avgScore = dimensionScores.reduce((sum, dim) => sum + dim.percentage, 0) / dimensionScores.length
    
    if (avgScore < 40) {
      recommendations.unshift("Consider starting with foundational AI training to build core competencies across all dimensions.")
    } else if (avgScore < 70) {
      recommendations.unshift("Focus on practical application of AI tools in daily workflows to accelerate learning.")
    } else {
      recommendations.unshift("You're performing well! Consider advanced topics like AI strategy and transformation leadership.")
    }

    return recommendations
  }

  private getRecommendationForDimension(dimension: string, score: number): string {
    const recommendations: Record<string, Record<string, string>> = {
      'promptingProficiency': {
        low: 'Improve your prompting skills by practicing multi-step prompts and defining clear roles, tone, and format.',
        medium: 'Refine your prompting approach with iterative examples and constraints for better results.',
      },
      'toolUse': {
        low: 'Explore popular AI tools like ChatGPT, Claude, or Microsoft Copilot to gain hands-on experience.',
        medium: 'Experiment with automating routine tasks and integrating AI tools into your daily workflow.',
      },
      'ethics': {
        low: 'Learn about responsible AI use, including data privacy, bias recognition, and environmental impact.',
        medium: 'Develop frameworks for evaluating AI outputs for accuracy, fairness, and alignment with values.',
      },
      'aiThinking': {
        low: 'Build foundational knowledge about AI concepts like data quality, embeddings, and vector databases.',
        medium: 'Take ownership of data quality in your role and learn to prepare AI-ready datasets.',
      },
      'coIntelligence': {
        low: 'Start using AI for routine tasks like summaries and translations to build comfort and familiarity.',
        medium: 'Explore AI as a thought partner for ideation, scenario modeling, and critical review of your work.',
      }
    }

    const level = score < 40 ? 'low' : 'medium'
    return recommendations[dimension]?.[level] || `Focus on improving your ${dimension} skills through targeted practice and learning.`
  }

  private findResponseKey(questionId: string): string | undefined {
    for (const [key, response] of this.responses.entries()) {
      if (response.questionId === questionId) {
        return key
      }
    }
    return undefined
  }

  calculateResult(participantId: string, peerAverages?: Record<string, number>): AssessmentResult {
    const dimensionScores = this.calculateDimensionScores()
    const overallScore = this.calculateOverallScore(dimensionScores)
    const radarData = this.generateRadarData(dimensionScores, peerAverages)
    const recommendations = this.generateRecommendations(dimensionScores)

    return {
      participantId,
      assessmentId: this.template.id,
      scores: dimensionScores,
      overallScore,
      completionDate: new Date(),
      recommendations,
      radarData
    }
  }
}

export function createScoringEngine(template: AssessmentTemplate): AssessmentScoringEngine {
  return new AssessmentScoringEngine(template)
}