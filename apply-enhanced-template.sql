-- Apply Enhanced Assessment Template with Workflow Mapping
-- This updates the existing template to include the enhanced strategic section with workflow questions

-- First, let's update just the strategic section title to verify the dynamic loading works
UPDATE assessment_templates 
SET template_data = jsonb_set(
  template_data,
  '{strategic,title}',
  '"AI Company Strategy & Workflows"'
)
WHERE id = '660e8400-e29b-41d4-a716-446655440000';

-- Verify the update worked
SELECT 
  id, 
  name,
  template_data -> 'strategic' ->> 'title' as strategic_section_title,
  jsonb_array_length(template_data -> 'strategic' -> 'questions') as strategic_question_count
FROM assessment_templates 
WHERE id = '660e8400-e29b-41d4-a716-446655440000';

COMMIT;