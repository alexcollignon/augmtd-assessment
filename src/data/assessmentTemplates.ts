import { AssessmentTemplate, AssessmentQuestion, AssessmentDimension } from '@/types'

export const defaultAssessmentTemplate: AssessmentTemplate = {
  id: 'default-ai-readiness-2024',
  name: 'AI Readiness Assessment 2024',
  description: 'Comprehensive AI due diligence and transformation evaluation',
  dimensions: [
    {
      id: 'promptingProficiency',
      name: 'Prompting Proficiency',
      description: 'Ability to effectively communicate with AI systems',
      maxScore: 100,
      weight: 1
    },
    {
      id: 'toolUse',
      name: 'Tool Use',
      description: 'Experience with AI tools and automation',
      maxScore: 100,
      weight: 1
    },
    {
      id: 'ethics',
      name: 'Ethics & Responsible Use',
      description: 'Understanding of responsible AI practices',
      maxScore: 100,
      weight: 1
    },
    {
      id: 'aiThinking',
      name: 'AI Thinking',
      description: 'Conceptual understanding of AI systems and data',
      maxScore: 100,
      weight: 1
    },
    {
      id: 'coIntelligence',
      name: 'Co-Intelligence',
      description: 'Human-AI collaboration and workflow integration',
      maxScore: 100,
      weight: 1.5
    }
  ],
  profile: {
    title: 'Professional Profile',
    questions: [
      {
        id: 'industry',
        text: 'What industry sector does your organization work in?',
        type: 'select',
        options: [
          { id: 'aerospace', label: 'Aerospace & Defense', value: 'Aerospace & Defense' },
          { id: 'agriculture', label: 'Agriculture & Food', value: 'Agriculture & Food' },
          { id: 'automotive', label: 'Automotive & Transportation', value: 'Automotive & Transportation' },
          { id: 'education', label: 'Education & Training', value: 'Education & Training' },
          { id: 'energy', label: 'Energy & Utilities', value: 'Energy & Utilities' },
          { id: 'financial', label: 'Financial Services & Banking', value: 'Financial Services & Banking' },
          { id: 'government', label: 'Government & Public Sector', value: 'Government & Public Sector' },
          { id: 'healthcare', label: 'Healthcare & Life Sciences', value: 'Healthcare & Life Sciences' },
          { id: 'hospitality', label: 'Hospitality & Tourism', value: 'Hospitality & Tourism' },
          { id: 'manufacturing', label: 'Manufacturing & Industrial', value: 'Manufacturing & Industrial' },
          { id: 'media', label: 'Media & Entertainment', value: 'Media & Entertainment' },
          { id: 'nonprofit', label: 'Nonprofit & NGO', value: 'Nonprofit & NGO' },
          { id: 'other', label: 'Other', value: 'Other' },
          { id: 'professional', label: 'Professional Services & Consulting', value: 'Professional Services & Consulting' },
          { id: 'real_estate', label: 'Real Estate & Construction', value: 'Real Estate & Construction' },
          { id: 'retail', label: 'Retail & E-commerce', value: 'Retail & E-commerce' },
          { id: 'technology', label: 'Technology & Software', value: 'Technology & Software' },
          { id: 'telecom', label: 'Telecommunications', value: 'Telecommunications' }
        ]
      },
      {
        id: 'department',
        text: 'Which department do you work in?',
        type: 'select',
        options: [
          { id: 'executive_office', label: 'Executive Office / Board', value: 'Executive Office / Board' },
          { id: 'strategy_innovation', label: 'Strategy, Innovation & Transformation', value: 'Strategy, Innovation & Transformation' },
          { id: 'finance_legal_risk', label: 'Finance, Legal & Risk', value: 'Finance, Legal & Risk' },
          { id: 'hr_learning_culture', label: 'HR, Learning & Culture', value: 'HR, Learning & Culture' },
          { id: 'data_ai_digital', label: 'Data, AI & Digital', value: 'Data, AI & Digital' },
          { id: 'product_rd_services', label: 'Product, R&D & Services', value: 'Product, R&D & Services' },
          { id: 'operations_delivery', label: 'Operations & Delivery', value: 'Operations & Delivery' },
          { id: 'marketing_sales_customer', label: 'Marketing, Sales & Customer', value: 'Marketing, Sales & Customer' },
          { id: 'customer_support_success', label: 'Customer Support & Success', value: 'Customer Support & Success' },
          { id: 'other_cross_functional', label: 'Other / Cross-functional', value: 'Other / Cross-functional' }
        ]
      },
      {
        id: 'role',
        text: 'What is your current role in the organization?',
        type: 'select',
        options: [
          { id: 'executive_leader', label: 'Executive / C-Level Leader', value: 'Executive / C-Level Leader' },
          { id: 'team_manager', label: 'Team or Department Manager', value: 'Team or Department Manager' },
          { id: 'product_manager', label: 'Product or Service Manager', value: 'Product or Service Manager' },
          { id: 'project_manager', label: 'Project or Program Manager', value: 'Project or Program Manager' },
          { id: 'technical_expert', label: 'Technical Expert / Engineer', value: 'Technical Expert / Engineer' },
          { id: 'data_ai_specialist', label: 'Data & AI Specialist', value: 'Data & AI Specialist' },
          { id: 'functional_specialist', label: 'Functional Specialist', value: 'Functional Specialist' },
          { id: 'customer_facing', label: 'Customer-Facing Role', value: 'Customer-Facing Role' },
          { id: 'operations_support', label: 'Operations or Support Staff', value: 'Operations or Support Staff' },
          { id: 'other', label: 'Other', value: 'Other' }
        ]
      },
      {
        id: 'experience',
        text: 'How many years of professional experience do you have?',
        type: 'radio',
        options: [
          { id: '0-2', label: '0-2 years', value: '0-2' },
          { id: '3-5', label: '3-5 years', value: '3-5' },
          { id: '6-10', label: '6-10 years', value: '6-10' },
          { id: '11-15', label: '11-15 years', value: '11-15' },
          { id: '15+', label: '15+ years', value: '15+' }
        ]
      },
      {
        id: 'technical_background',
        text: 'Which best describes your technical experience?',
        type: 'radio',
        options: [
          { id: 'business_user', label: 'Business User (use tools like Excel, PowerPoint, CRM)', value: 'Business User (use tools like Excel, PowerPoint, CRM)' },
          { id: 'intermediate', label: 'Intermediate (some coding, SQL, databases, low-code platforms)', value: 'Intermediate (some coding, SQL, databases, low-code platforms)' },
          { id: 'advanced', label: 'Advanced (develop software, use Python/R, build automations or APIs)', value: 'Advanced (develop software, use Python/R, build automations or APIs)' },
          { id: 'expert', label: 'Expert / Leader (e.g. lead tech teams, make architecture decisions, AI specialist)', value: 'Expert / Leader (e.g. lead tech teams, make architecture decisions, AI specialist)' }
        ]
      },
      {
        id: 'current_use',
        text: 'How are you currently using AI in your day-to-day work? (e.g., writing emails, analyzing data, preparing presentations)? Be as specific as possible.',
        type: 'text'
      },
      {
        id: 'primary_objectives',
        text: 'How would you like AI to support you more in the future? (e.g., helping you automate tasks, explore ideas, make decisions, communicate, or analyze data)? Be as specific as possible.',
        type: 'text'
      },
      {
        id: 'preferred_learning_style',
        text: 'How do you learn best when trying something new?',
        type: 'radio',
        options: [
          { id: 'try_it_yourself', label: 'Try it yourself (Quick tasks or practice exercises)', value: 'try_it_yourself' },
          { id: 'show_me_how', label: 'Show me how (Short videos or visual explainers)', value: 'show_me_how' },
          { id: 'let_me_read', label: 'Let me read (Quick tips, summaries, or guides)', value: 'let_me_read' },
          { id: 'let_me_listen', label: 'Let me listen (Voice notes or audio clips)', value: 'let_me_listen' },
          { id: 'mix_it_up', label: 'Mix it up (I like a bit of everything — depends on the situation)', value: 'mix_it_up' }
        ]
      },
      {
        id: 'gender',
        text: 'What is your gender?',
        type: 'radio',
        options: [
          { id: 'male', label: 'Male', value: 'male' },
          { id: 'female', label: 'Female', value: 'female' },
          { id: 'do_not_disclose', label: 'Do not disclose', value: 'do_not_disclose' }
        ]
      },
      {
        id: 'location',
        text: 'Which country are you located?',
        type: 'text'
      }
    ]
  },
  strategic: {
    title: 'AI Company Strategy',
    questions: [
      {
        id: 'genai_strategic_goals',
        text: 'Is Generative AI explicitly part of your organization\'s strategic goals or digital roadmap?',
        type: 'radio',
        options: [
          { id: 'yes', label: 'Yes', value: 'yes' },
          { id: 'no', label: 'No', value: 'no' },
          { id: 'unsure', label: 'I\'m not sure', value: 'unsure' }
        ]
      },
      {
        id: 'dedicated_teams',
        text: 'Does your organization have teams or individuals formally responsible for implementing GenAI?',
        type: 'radio',
        options: [
          { id: 'yes', label: 'Yes', value: 'yes' },
          { id: 'no', label: 'No', value: 'no' },
          { id: 'unsure', label: 'I\'m not sure', value: 'unsure' }
        ]
      },
      {
        id: 'genai_discussion_frequency',
        text: 'How frequently are Generative AI opportunities or concerns discussed in your team or department?',
        type: 'radio',
        options: [
          { id: 'never', label: 'Never', value: 'never' },
          { id: 'rarely', label: 'Rarely', value: 'rarely' },
          { id: 'sometimes', label: 'Sometimes', value: 'sometimes' },
          { id: 'often', label: 'Often', value: 'often' },
          { id: 'always', label: 'Always', value: 'always' }
        ]
      },
      {
        id: 'infrastructure_investment',
        text: 'Has your organization invested in infrastructure (e.g., cloud, APIs, security) to enable GenAI use?',
        type: 'radio',
        options: [
          { id: 'yes', label: 'Yes', value: 'yes' },
          { id: 'no', label: 'No', value: 'no' },
          { id: 'unsure', label: 'I\'m not sure', value: 'unsure' }
        ]
      },
      {
        id: 'task_automation_expectation',
        text: 'What percentage of your current tasks do you expect will be handled autonomously by AI in the next 3 years?',
        type: 'slider',
        min: 0,
        max: 100,
        step: 5,
        labels: {
          '0': '0%',
          '50': '50%',
          '100': '100%'
        }
      },
      {
        id: 'time_savings',
        text: 'Have you personally saved time or reduced workload by using AI tools?',
        type: 'radio',
        tags: ['cost_efficiency_savings'],
        options: [
          { id: 'no', label: 'No', value: 'no' },
          { id: 'little', label: 'Yes, a little (e.g., saved 1–3 hours/week)', value: 'little' },
          { id: 'significant', label: 'Yes, significantly (4+ hours/week)', value: 'significant' },
          { id: 'automated', label: 'Yes, entire workflows now run automatically', value: 'automated' }
        ]
      },
      {
        id: 'business_activities',
        text: 'In which areas has AI helped create value in your work? (Check all that apply)',
        type: 'multi_select',
        tags: ['revenue_enablement', 'productivity', 'experimentation'],
        allowMultiple: true,
        options: [
          { id: 'saved_time', label: 'Saved time on routine or repetitive tasks', value: 'saved_time' },
          { id: 'develop_or_improve_ideas', label: 'Helped us develop or improve ideas or new product offerings', value: 'develop_or_improve_ideas' },
          { id: 'improved_communication', label: 'Improved communication or collaboration', value: 'improved_communication' },
          { id: 'unlocked_insights', label: 'Unlocked insights from data or documents', value: 'unlocked_insights' },
          { id: 'automated_documentation', label: 'Automated documentation or report', value: 'automated_documentation' },
          { id: 'no_value', label: 'I haven\'t seen value yet', value: 'no_value' }
        ]
      },
      {
        id: 'decision_making',
        text: 'Has AI helped you or your team make faster or better decisions?',
        type: 'radio',
        tags: ['strategic_decision_making', 'agility'],
        options: [
          { id: 'not_yet', label: 'Not yet', value: 'not_yet' },
          { id: 'occasionally', label: 'Occasionally', value: 'occasionally' },
          { id: 'faster', label: 'Often — it helps us move faster', value: 'faster' },
          { id: 'strategic', label: 'Yes — it\'s changed how we plan and act', value: 'strategic' }
        ]
      },
      {
        id: 'roi_tracking',
        text: 'Does your team track or estimate any cost/time savings due to AI?',
        type: 'radio',
        tags: ['strategic_alignment', 'maturity'],
        options: [
          { id: 'not_tracked', label: 'No, not tracked', value: 'not_tracked' },
          { id: 'informal', label: 'Some informal estimates', value: 'informal' },
          { id: 'kpis', label: 'We track it in KPIs', value: 'kpis' },
          { id: 'business_cases', label: 'We use it as part of ROI/business cases', value: 'business_cases' }
        ]
      }
    ]
  },
  competence: {
    title: 'AI Fluency Screener',
    questions: [
      {
        id: 'prompt_multi_step',
        text: 'How often do you break a prompt into multiple steps when using AI tools (e.g., ChatGPT, Claude, Perplexity)?',
        type: 'radio',
        options: [
          { id: 'never', label: 'Never', value: 'never' },
          { id: 'rarely', label: 'Rarely', value: 'rarely' },
          { id: 'sometimes', label: 'Sometimes', value: 'sometimes' },
          { id: 'often', label: 'Often', value: 'often' },
          { id: 'always', label: 'Always', value: 'always' }
        ],
        scoring: {
          weight: 1.67,
          dimension: 'promptingProficiency',
          valueMapping: {
            'never': 1,
            'rarely': 2,
            'sometimes': 3,
            'often': 4,
            'always': 5
          }
        }
      },
      {
        id: 'prompt_role_tone_format',
        text: 'When you write a prompt, do you define the role, tone, or format the AI should take (e.g., "Act as a CFO, bullet list for executives")?',
        type: 'radio',
        options: [
          { id: 'never', label: 'Never', value: 'never' },
          { id: 'rarely', label: 'Rarely', value: 'rarely' },
          { id: 'sometimes', label: 'Sometimes', value: 'sometimes' },
          { id: 'often', label: 'Often', value: 'often' },
          { id: 'always', label: 'Always', value: 'always' }
        ],
        scoring: {
          weight: 1.67,
          dimension: 'promptingProficiency',
          valueMapping: {
            'never': 1,
            'rarely': 2,
            'sometimes': 3,
            'often': 4,
            'always': 5
          }
        }
      },
      {
        id: 'prompt_writing_approach',
        text: 'Which best describes your prompt-writing approach?',
        type: 'radio',
        options: [
          { id: 'basic', label: 'I write simple one-shot prompts', value: 'basic' },
          { id: 'structured', label: 'I sometimes add detail like role, tone, or format', value: 'structured' },
          { id: 'iterative', label: 'I refine iteratively with examples and constraints', value: 'iterative' }
        ],
        scoring: {
          weight: 1.66,
          dimension: 'promptingProficiency',
          valueMapping: {
            'basic': 1,
            'structured': 3,
            'iterative': 5
          }
        }
      },
      {
        id: 'tools_used_recently',
        text: 'Which AI tools have you used in the past month? (check all that apply)',
        type: 'multi_select',
        allowMultiple: true,
        options: [
          { id: 'chatgpt', label: 'ChatGPT', value: 'ChatGPT', score: 4 },
          { id: 'claude', label: 'Claude', value: 'Claude', score: 4 },
          { id: 'perplexity', label: 'Perplexity', value: 'Perplexity', score: 4 },
          { id: 'copilot', label: 'Microsoft Copilot', value: 'Microsoft Copilot', score: 4 },
          { id: 'gemini', label: 'Google Gemini', value: 'Google Gemini', score: 4 },
          { id: 'midjourney', label: 'Midjourney', value: 'Midjourney', score: 3 },
          { id: 'dalle', label: 'DALL·E', value: 'DALL·E', score: 3 },
          { id: 'other', label: 'Other', value: 'Other', score: 1 },
          { id: 'none', label: 'None', value: 'None', score: 0 }
        ],
        scoring: {
          weight: 1.67,
          dimension: 'toolUse'
        }
      },
      {
        id: 'ai_automation_integration',
        text: 'How do you currently integrate AI into your regular workflows?',
        type: 'radio',
        options: [
          { id: 'manual', label: 'I use AI manually for specific tasks', value: 'manual' },
          { id: 'connected', label: 'I connect AI tools to some of my work systems', value: 'connected' },
          { id: 'automated', label: 'I have automated workflows that use AI', value: 'automated' },
          { id: 'none', label: 'I don\'t integrate AI into my workflows yet', value: 'none' }
        ],
        scoring: {
          weight: 1.66,
          dimension: 'toolUse',
          valueMapping: {
            'none': 1,
            'manual': 2,
            'connected': 4,
            'automated': 5
          }
        }
      },
      {
        id: 'ai_security_awareness',
        text: 'When using AI tools for work, how often do you consider data privacy and security?',
        type: 'radio',
        options: [
          { id: 'never', label: 'Never - I don\'t think about it', value: 'never' },
          { id: 'rarely', label: 'Rarely - only for sensitive data', value: 'rarely' },
          { id: 'sometimes', label: 'Sometimes - for most work data', value: 'sometimes' },
          { id: 'often', label: 'Often - I\'m very cautious', value: 'often' },
          { id: 'always', label: 'Always - I follow strict protocols', value: 'always' }
        ],
        scoring: {
          weight: 2,
          dimension: 'ethics',
          valueMapping: {
            'never': 1,
            'rarely': 2,
            'sometimes': 3,
            'often': 4,
            'always': 5
          }
        }
      },
      {
        id: 'ai_bias_awareness',
        text: 'How do you handle potential bias or inaccuracy in AI outputs?',
        type: 'radio',
        options: [
          { id: 'trust_completely', label: 'I generally trust AI outputs completely', value: 'trust_completely' },
          { id: 'spot_check', label: 'I spot-check outputs occasionally', value: 'spot_check' },
          { id: 'verify_important', label: 'I verify outputs for important decisions', value: 'verify_important' },
          { id: 'always_verify', label: 'I always verify and cross-check AI outputs', value: 'always_verify' }
        ],
        scoring: {
          weight: 2,
          dimension: 'ethics',
          valueMapping: {
            'trust_completely': 1,
            'spot_check': 2,
            'verify_important': 4,
            'always_verify': 5
          }
        }
      },
      {
        id: 'ai_environmental_impact',
        text: 'How aware are you of the environmental impact of AI usage?',
        type: 'radio',
        options: [
          { id: 'unaware', label: 'I\'m not aware of any environmental impact', value: 'unaware' },
          { id: 'somewhat', label: 'I know AI uses energy but don\'t consider it', value: 'somewhat' },
          { id: 'aware', label: 'I\'m aware and sometimes consider it', value: 'aware' },
          { id: 'conscious', label: 'I actively try to minimize environmental impact', value: 'conscious' }
        ],
        scoring: {
          weight: 1,
          dimension: 'ethics',
          valueMapping: {
            'unaware': 1,
            'somewhat': 2,
            'aware': 3,
            'conscious': 5
          }
        }
      },
      {
        id: 'data_quality_understanding',
        text: 'How well do you understand what makes data "AI-ready"?',
        type: 'radio',
        options: [
          { id: 'no_idea', label: 'I have no idea what that means', value: 'no_idea' },
          { id: 'basic', label: 'I understand it needs to be clean and organized', value: 'basic' },
          { id: 'intermediate', label: 'I understand formats, quality, and preparation steps', value: 'intermediate' },
          { id: 'advanced', label: 'I can prepare and structure data for AI applications', value: 'advanced' }
        ],
        scoring: {
          weight: 2,
          dimension: 'aiThinking',
          valueMapping: {
            'no_idea': 1,
            'basic': 2,
            'intermediate': 4,
            'advanced': 5
          }
        }
      },
      {
        id: 'ai_concepts_understanding',
        text: 'How comfortable are you with AI concepts like embeddings, vector databases, or fine-tuning?',
        type: 'radio',
        options: [
          { id: 'unfamiliar', label: 'These terms are unfamiliar to me', value: 'unfamiliar' },
          { id: 'heard_of', label: 'I\'ve heard of them but don\'t understand them', value: 'heard_of' },
          { id: 'basic_understanding', label: 'I have a basic understanding of what they do', value: 'basic_understanding' },
          { id: 'working_knowledge', label: 'I have working knowledge and could explain them', value: 'working_knowledge' }
        ],
        scoring: {
          weight: 2,
          dimension: 'aiThinking',
          valueMapping: {
            'unfamiliar': 1,
            'heard_of': 2,
            'basic_understanding': 4,
            'working_knowledge': 5
          }
        }
      },
      {
        id: 'ai_limitations_understanding',
        text: 'How well do you understand the limitations and capabilities of current AI systems?',
        type: 'radio',
        options: [
          { id: 'minimal', label: 'Minimal understanding', value: 'minimal' },
          { id: 'basic', label: 'Basic understanding of what AI can and cannot do', value: 'basic' },
          { id: 'good', label: 'Good understanding of strengths and weaknesses', value: 'good' },
          { id: 'expert', label: 'Expert level - I can predict AI performance for new tasks', value: 'expert' }
        ],
        scoring: {
          weight: 1,
          dimension: 'aiThinking',
          valueMapping: {
            'minimal': 1,
            'basic': 2,
            'good': 4,
            'expert': 5
          }
        }
      },
      {
        id: 'ai_collaboration_approach',
        text: 'How do you typically work with AI as a thinking partner?',
        type: 'radio',
        options: [
          { id: 'task_based', label: 'I use AI for specific tasks only', value: 'task_based' },
          { id: 'iterative', label: 'I have back-and-forth conversations to refine ideas', value: 'iterative' },
          { id: 'strategic', label: 'I use AI for brainstorming and strategic thinking', value: 'strategic' },
          { id: 'integrated', label: 'AI is fully integrated into my thinking process', value: 'integrated' }
        ],
        scoring: {
          weight: 2,
          dimension: 'coIntelligence',
          valueMapping: {
            'task_based': 1,
            'iterative': 3,
            'strategic': 4,
            'integrated': 5
          }
        }
      },
      {
        id: 'ai_workflow_integration',
        text: 'How well have you integrated AI into your overall workflow and decision-making?',
        type: 'radio',
        options: [
          { id: 'not_integrated', label: 'AI is separate from my main workflow', value: 'not_integrated' },
          { id: 'occasional', label: 'I occasionally use AI for specific steps', value: 'occasional' },
          { id: 'regular', label: 'AI is regularly part of my workflow', value: 'regular' },
          { id: 'seamless', label: 'AI is seamlessly integrated throughout my work', value: 'seamless' }
        ],
        scoring: {
          weight: 2,
          dimension: 'coIntelligence',
          valueMapping: {
            'not_integrated': 1,
            'occasional': 2,
            'regular': 4,
            'seamless': 5
          }
        }
      },
      {
        id: 'ai_human_balance',
        text: 'How do you balance AI assistance with your own critical thinking and expertise?',
        type: 'radio',
        options: [
          { id: 'ai_dependent', label: 'I rely heavily on AI for most thinking tasks', value: 'ai_dependent' },
          { id: 'ai_first', label: 'I usually try AI first, then add my input', value: 'ai_first' },
          { id: 'collaborative', label: 'I use AI as a thinking partner while maintaining my expertise', value: 'collaborative' },
          { id: 'human_led', label: 'I lead the thinking and use AI to enhance my ideas', value: 'human_led' }
        ],
        scoring: {
          weight: 1,
          dimension: 'coIntelligence',
          valueMapping: {
            'ai_dependent': 2,
            'ai_first': 3,
            'collaborative': 5,
            'human_led': 4
          }
        }
      }
    ]
  }
}

// Company-specific assessment configurations
interface AssessmentConfig {
  templateId: string
  companyId: string
  companyName: string
  accessCodePrefix: string
  customizations?: {
    branding?: {
      logo?: string
      primaryColor?: string
      companyName?: string
    }
    additionalQuestions?: AssessmentQuestion[]
    modifiedDimensions?: Partial<AssessmentDimension>[]
  }
}

export const assessmentConfigs: AssessmentConfig[] = [
  {
    templateId: 'default-ai-readiness-2024',
    companyId: 'demo-company',
    companyName: 'Demo Company Inc.',
    accessCodePrefix: 'ASS2024',
    customizations: {
      branding: {
        companyName: 'Demo Company Inc.',
        primaryColor: '#3B82F6'
      }
    }
  },
  {
    templateId: 'enterprise-ai-readiness-2024',
    companyId: 'enterprise-corp',
    companyName: 'Enterprise Corp',
    accessCodePrefix: 'ENT2024',
    customizations: {
      branding: {
        companyName: 'Enterprise Corp',
        primaryColor: '#7C3AED'
      }
    }
  }
]

// Template management functions
export const assessmentTemplates = {
  default: defaultAssessmentTemplate,
  'default-ai-readiness-2024': defaultAssessmentTemplate,
  'enterprise-ai-readiness-2024': defaultAssessmentTemplate // Could be a different template
}

export function getAssessmentTemplate(templateId: string = 'default'): AssessmentTemplate {
  return assessmentTemplates[templateId as keyof typeof assessmentTemplates] || defaultAssessmentTemplate
}

export function getAssessmentConfigByAccessCode(accessCode: string): AssessmentConfig | null {
  // Extract prefix from access code (e.g., "ASS2024001" -> "ASS2024")
  const prefix = accessCode.substring(0, 7) // Assumes format like "ASS2024XXX"
  
  return assessmentConfigs.find(config => config.accessCodePrefix === prefix) || null
}

export function getAssessmentTemplateForAccessCode(accessCode: string): AssessmentTemplate {
  const config = getAssessmentConfigByAccessCode(accessCode)
  if (!config) {
    return defaultAssessmentTemplate
  }
  
  const template = getAssessmentTemplate(config.templateId)
  
  // Apply customizations if any
  if (config.customizations) {
    return {
      ...template,
      id: `${template.id}-${config.companyId}`,
      name: `${template.name} - ${config.companyName}`,
      companyId: config.companyId,
      // Add any custom questions or modified dimensions
      ...(config.customizations.additionalQuestions && {
        profile: {
          ...template.profile,
          questions: [...template.profile.questions, ...config.customizations.additionalQuestions]
        }
      })
    }
  }
  
  return template
}

export function getAssessmentTemplateForCompany(companyId: string): AssessmentTemplate {
  const config = assessmentConfigs.find(c => c.companyId === companyId)
  return config ? getAssessmentTemplate(config.templateId) : defaultAssessmentTemplate
}