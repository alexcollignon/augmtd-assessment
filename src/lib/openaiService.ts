interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

class OpenAIService {
  private apiKey: string
  private baseURL = 'https://api.openai.com/v1'

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || ''
    if (!this.apiKey) {
      console.warn('OpenAI API key not found in environment variables')
    }
  }

  async createChatCompletion(
    messages: OpenAIMessage[],
    model: string = 'gpt-4',
    temperature: number = 0.3,
    maxTokens: number = 2000
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          response_format: { type: 'json_object' }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
      }

      const data: OpenAIResponse = await response.json()
      return data.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('OpenAI API call failed:', error)
      throw error
    }
  }

  async analyzeText(
    prompt: string,
    systemMessage?: string,
    model: string = 'gpt-4'
  ): Promise<string> {
    const messages: OpenAIMessage[] = []
    
    if (systemMessage) {
      messages.push({ role: 'system', content: systemMessage })
    }
    
    messages.push({ role: 'user', content: prompt })

    return this.createChatCompletion(messages, model)
  }
}

export const openaiService = new OpenAIService()