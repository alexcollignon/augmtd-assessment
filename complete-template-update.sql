-- Complete assessment template update with full structure
UPDATE assessment_templates 
SET template_data = '{
  "dimensions": [
    {
      "id": "promptingProficiency",
      "name": "Prompting Proficiency", 
      "description": "Ability to effectively communicate with AI systems",
      "maxScore": 100,
      "weight": 1
    },
    {
      "id": "toolUse",
      "name": "Tool Use",
      "description": "Experience with AI tools and automation", 
      "maxScore": 100,
      "weight": 1
    },
    {
      "id": "ethics",
      "name": "Ethics & Responsible Use",
      "description": "Understanding of responsible AI practices",
      "maxScore": 100,
      "weight": 1
    },
    {
      "id": "aiThinking", 
      "name": "AI Thinking",
      "description": "Conceptual understanding of AI systems and data",
      "maxScore": 100,
      "weight": 1
    },
    {
      "id": "coIntelligence",
      "name": "Co-Intelligence", 
      "description": "Human-AI collaboration and workflow integration",
      "maxScore": 100,
      "weight": 1.5
    }
  ],
  "profile": {
    "title": "Professional Profile",
    "questions": [
      {
        "id": "industry",
        "text": "What industry sector does your organization work in?",
        "type": "select",
        "options": [
          {"id": "technology", "label": "Technology & Software", "value": "Technology & Software"},
          {"id": "financial", "label": "Financial Services & Banking", "value": "Financial Services & Banking"},
          {"id": "healthcare", "label": "Healthcare & Life Sciences", "value": "Healthcare & Life Sciences"}, 
          {"id": "manufacturing", "label": "Manufacturing & Industrial", "value": "Manufacturing & Industrial"},
          {"id": "other", "label": "Other", "value": "Other"}
        ]
      },
      {
        "id": "department",
        "text": "Which department do you work in?",
        "type": "select", 
        "options": [
          {"id": "executive_office", "label": "Executive Office / Board", "value": "Executive Office / Board"},
          {"id": "data_ai_digital", "label": "Data, AI & Digital", "value": "Data, AI & Digital"},
          {"id": "product_rd_services", "label": "Product, R&D & Services", "value": "Product, R&D & Services"},
          {"id": "operations_delivery", "label": "Operations & Delivery", "value": "Operations & Delivery"},
          {"id": "marketing_sales_customer", "label": "Marketing, Sales & Customer", "value": "Marketing, Sales & Customer"}
        ]
      },
      {
        "id": "role", 
        "text": "What is your current role in the organization?",
        "type": "select",
        "options": [
          {"id": "executive_leader", "label": "Executive / C-Level Leader", "value": "Executive / C-Level Leader"},
          {"id": "team_manager", "label": "Team or Department Manager", "value": "Team or Department Manager"},
          {"id": "technical_expert", "label": "Technical Expert / Engineer", "value": "Technical Expert / Engineer"},
          {"id": "data_ai_specialist", "label": "Data & AI Specialist", "value": "Data & AI Specialist"},
          {"id": "other", "label": "Other", "value": "Other"}
        ]
      },
      {
        "id": "experience",
        "text": "How many years of professional experience do you have?",
        "type": "radio",
        "options": [
          {"id": "0-2", "label": "0-2 years", "value": "0-2"},
          {"id": "3-5", "label": "3-5 years", "value": "3-5"},
          {"id": "6-10", "label": "6-10 years", "value": "6-10"},
          {"id": "11-15", "label": "11-15 years", "value": "11-15"},
          {"id": "15+", "label": "15+ years", "value": "15+"}
        ]
      }
    ]
  },
  "strategic": {
    "title": "AI Company Strategy",
    "questions": [
      {
        "id": "genai_strategic_goals",
        "text": "Is Generative AI explicitly part of your organizations strategic goals or digital roadmap?",
        "type": "radio",
        "options": [
          {"id": "yes", "label": "Yes", "value": "yes"},
          {"id": "no", "label": "No", "value": "no"},
          {"id": "unsure", "label": "I am not sure", "value": "unsure"}
        ]
      },
      {
        "id": "dedicated_teams",
        "text": "Does your organization have teams or individuals formally responsible for implementing GenAI?", 
        "type": "radio",
        "options": [
          {"id": "yes", "label": "Yes", "value": "yes"},
          {"id": "no", "label": "No", "value": "no"},
          {"id": "unsure", "label": "I am not sure", "value": "unsure"}
        ]
      }
    ]
  },
  "competence": {
    "title": "AI Fluency Screener",
    "questions": [
      {
        "id": "prompt_multi_step",
        "text": "How often do you break a prompt into multiple steps when using AI tools (e.g., ChatGPT, Claude, Perplexity)?",
        "type": "radio",
        "options": [
          {"id": "never", "label": "Never", "value": "never"},
          {"id": "rarely", "label": "Rarely", "value": "rarely"},
          {"id": "sometimes", "label": "Sometimes", "value": "sometimes"},
          {"id": "often", "label": "Often", "value": "often"},
          {"id": "always", "label": "Always", "value": "always"}
        ],
        "scoring": {
          "weight": 1.67,
          "dimension": "promptingProficiency",
          "valueMapping": {
            "never": 1,
            "rarely": 2, 
            "sometimes": 3,
            "often": 4,
            "always": 5
          }
        }
      },
      {
        "id": "prompt_role_tone_format",
        "text": "When you write a prompt, do you define the role, tone, or format the AI should take (e.g., \"Act as a CFO, bullet list for executives\")?",
        "type": "radio",
        "options": [
          {"id": "never", "label": "Never", "value": "never"},
          {"id": "rarely", "label": "Rarely", "value": "rarely"},
          {"id": "sometimes", "label": "Sometimes", "value": "sometimes"},
          {"id": "often", "label": "Often", "value": "often"},
          {"id": "always", "label": "Always", "value": "always"}
        ],
        "scoring": {
          "weight": 1.67,
          "dimension": "promptingProficiency",
          "valueMapping": {
            "never": 1,
            "rarely": 2,
            "sometimes": 3,
            "often": 4,
            "always": 5
          }
        }
      }
    ]
  }
}'::jsonb
WHERE id = '660e8400-e29b-41d4-a716-446655440000';