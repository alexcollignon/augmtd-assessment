-- Fix the slider_group question by replacing it with individual questions
-- This replaces question 11 (daily_work_breakdown) with regular multi_select

UPDATE assessment_templates 
SET template_data = jsonb_set(
  template_data,
  '{strategic,questions,10}',
  '{
    "id": "daily_work_breakdown",
    "text": "What percentage of your time is typically spent on these types of activities? (Select all that represent 20% or more of your time)",
    "type": "multi_select",
    "allowMultiple": true,
    "tags": ["workflow_mapping"],
    "options": [
      { "id": "communication", "label": "Email, meetings, coordination (20%+ of time)", "value": "communication" },
      { "id": "data_processing", "label": "Reviewing, entering, or analyzing data (20%+ of time)", "value": "data_processing" },
      { "id": "document_work", "label": "Creating, reviewing, or processing documents (20%+ of time)", "value": "document_work" },
      { "id": "customer_interaction", "label": "Direct customer/client interaction (20%+ of time)", "value": "customer_interaction" },
      { "id": "strategic_planning", "label": "Planning, strategy, decision-making (20%+ of time)", "value": "strategic_planning" },
      { "id": "hands_on_work", "label": "Hands-on technical or operational work (20%+ of time)", "value": "hands_on_work" }
    ]
  }'::jsonb
)
WHERE id = '660e8400-e29b-41d4-a716-446655440000';

-- Verify the fix
SELECT 
  template_data -> 'strategic' -> 'questions' -> 10 ->> 'type' as question_11_type,
  template_data -> 'strategic' -> 'questions' -> 10 ->> 'text' as question_11_text
FROM assessment_templates 
WHERE id = '660e8400-e29b-41d4-a716-446655440000';

COMMIT;