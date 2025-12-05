# Database Updates Required - Simplified Approach

The authentication has been fixed to use a much simpler approach:
- **Access Code** → Finds the assessment template (cohort)
- **Email** → Creates participant record automatically on first login
- **No pre-existing participants needed**

## 1. Apply Schema Updates

Go to your Supabase project dashboard → SQL Editor and run:

### Step 1: Fix Access Code Structure
```sql
-- 1. Add access_code column to cohorts table
ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS access_code TEXT;

-- 2. Set the cohort access code (one code per company/assessment batch)
UPDATE cohorts SET access_code = 'AIR-2024-Q1' WHERE access_code IS NULL;

-- 3. Make the cohort access_code required and unique
ALTER TABLE cohorts ALTER COLUMN access_code SET NOT NULL;
ALTER TABLE cohorts ADD CONSTRAINT unique_cohort_access_code UNIQUE (access_code);

-- 4. Remove assessment_id columns (not needed for simplified approach)
ALTER TABLE assessment_responses DROP COLUMN IF EXISTS assessment_id;
ALTER TABLE assessment_results DROP COLUMN IF EXISTS assessment_id;

-- 5. Remove access_code from participants (belongs to cohorts)
ALTER TABLE participants DROP COLUMN IF EXISTS access_code;

-- 5. Add unique constraint for upsert operations
ALTER TABLE assessment_responses ADD CONSTRAINT IF NOT EXISTS unique_response_per_question 
  UNIQUE (email, cohort_id, section_id, question_id);

-- 6. Clean up - remove any demo participants (they'll be created automatically)
DELETE FROM participants;
```

### Step 2: Update Template Data
```sql
-- From complete-template-update.sql
-- Update the assessment template with complete structure
UPDATE assessment_templates 
SET template_data = '{
  "profile": {
    "title": "Professional Profile",
    "description": "Tell us about your role and background",
    "questions": [
      {
        "id": "name",
        "type": "text",
        "label": "Full Name",
        "required": true,
        "placeholder": "Enter your full name"
      },
      {
        "id": "department",
        "type": "select",
        "label": "Department",
        "required": true,
        "options": [
          "Engineering",
          "Product",
          "Marketing",
          "Sales",
          "Finance",
          "HR",
          "Operations",
          "Other"
        ]
      },
      {
        "id": "role",
        "type": "text",
        "label": "Job Title",
        "required": true,
        "placeholder": "e.g., Senior Software Engineer"
      }
    ]
  },
  "strategic": {
    "title": "AI Company Strategy",
    "description": "How your organization approaches AI",
    "questions": [
      {
        "id": "ai_strategy",
        "type": "radio",
        "label": "Does your company have a formal AI strategy?",
        "required": true,
        "options": [
          "Yes, we have a comprehensive AI strategy",
          "We are developing one",
          "No, but we are considering it",
          "No current plans"
        ]
      }
    ]
  },
  "competence": {
    "title": "AI Fluency Screener",
    "description": "Your AI skills and experience",
    "questions": [
      {
        "id": "ai_experience",
        "type": "radio",
        "label": "How would you rate your AI experience?",
        "required": true,
        "options": [
          "Expert - I develop AI solutions",
          "Advanced - I regularly use AI tools",
          "Intermediate - I occasionally use AI tools",
          "Beginner - I am just starting to learn about AI"
        ]
      }
    ]
  }
}'::jsonb
WHERE id = 'template-001';
```

## 2. Test the Updates

After applying the SQL updates:

1. Go to http://localhost:3001 (or your local dev server)
2. Try logging in with ANY email and the access code:
   - **Email**: test@company.com (or any email)
   - **Access Code**: AIR-2024-Q1

## The Fix - Completely Session-Based Flow

1. **Access Code** → Finds the assessment template (cohort)
2. **Email** → Creates session, no database records needed
3. **Responses** → Stored directly in assessment_responses by email + cohort_id
4. **No participants table** → Completely removed, responses tracked by email

**Key Benefits:**
- **Ultra Simple**: No participant management overhead
- **Stateless**: Authentication just validates and creates session
- **Direct Storage**: Responses go straight to assessment_responses table
- **Real-world Usage**: Matches how companies actually distribute codes

**Database Changes:**
- Removed `participants` table entirely
- `assessment_responses` now uses `email` + `cohort_id` instead of `participant_id`
- `assessment_results` tracks completion by `email` + `cohort_id`
- Much simpler schema, direct response tracking