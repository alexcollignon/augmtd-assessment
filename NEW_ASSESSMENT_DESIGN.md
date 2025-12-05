# Simplified One-Shot Assessment Design

## Problem with Old Design
- **One row per question response** = Thousands of rows for a few assessments
- **Difficult analysis** = Need complex joins to see complete assessments
- **Poor performance** = Many database operations per assessment
- **Unnecessary complexity** = Progress tracking for one-shot assessment

## New Design: Ultra-Simple One Table

### assessment_submissions Table
**One row per completed assessment** - raw responses!

```sql
CREATE TABLE assessment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  cohort_id UUID NOT NULL REFERENCES cohorts(id),
  
  -- All responses in one JSON field (submitted only when complete)
  responses JSONB NOT NULL,
  
  -- Essential timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Ensure one submission per email per cohort
  UNIQUE (email, cohort_id)
);
```

### assessment_results Table
**One row per assessment** - calculated scores and reports!

```sql
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  cohort_id UUID NOT NULL REFERENCES cohorts(id),
  
  -- Calculated scores by dimension (JSON)
  dimension_scores JSONB,
  
  -- Overall score (0-100)
  overall_score INTEGER,
  
  -- AI-generated recommendation report (JSON)
  recommendation_report JSONB,
  
  -- Timestamps
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  report_generated_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE (email, cohort_id)
);
```

## JSON Response Format

### Example responses field:
```json
{
  "profile-name": "John Smith",
  "profile-department": "Engineering", 
  "profile-role": "Senior Developer",
  "strategic-ai_strategy": "Yes, we have a comprehensive AI strategy",
  "competence-ai_experience": "Advanced - I regularly use AI tools"
}
```

### Key format: `{sectionId}-{questionId}`

## How It Works

1. **User fills out assessment** - responses stored locally (no database writes)
2. **User clicks "Complete Assessment"** - INSERT new submission with sequential number
3. **Progress tracking** - Each new submission gets submission_number (1, 2, 3...)
4. **Learning journey** - Compare results over time to track improvement

## Benefits

✅ **Progress tracking**: Multiple submissions per user to track learning  
✅ **Learning analytics**: Compare before/after training results  
✅ **Easy analysis**: All responses in one JSON field per submission  
✅ **Sequential numbering**: submission_number tracks attempt sequence  
✅ **Clean data**: Only completed assessments in database  
✅ **Growth insights**: See improvement over time in existing results tab  

## Migration

1. **Run**: `redesign-assessment-storage.sql`
2. **Test**: Complete an assessment - should submit only at the end
3. **Verify**: Check Supabase dashboard for single row with JSON responses

## Admin Dashboard Benefits

- **Cohort Analysis**: `SELECT * FROM assessment_submissions WHERE cohort_id = ?`
- **Individual Responses**: JSON field contains everything
- **Reporting**: Easy aggregation of JSON responses
- **Export**: Single table = simple CSV/PDF generation

This is the simplest design that could possibly work!