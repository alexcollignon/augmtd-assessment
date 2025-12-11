# Database Setup Instructions

## Create AI Process Analysis Table (Single Row Per Company)

To enable the persistent AI analysis caching system, you need to run the following SQL script in your Supabase SQL Editor:

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `ai-process-analysis-schema.sql`
3. Run the SQL script

The script will create:
- `ai_process_analysis` table with **ONE ROW PER COMPANY**
- All process analyses stored as JSON array in `process_analyses` column
- Cached summary statistics for performance
- Indexes for performance optimization
- Automatic timestamp update triggers

## Key Benefits of Single-Row Design:

✅ **Simplified Data Model**: One row per company instead of many rows per process  
✅ **Atomic Updates**: All analyses updated together in single transaction  
✅ **Better Performance**: Fewer database rows and optimized JSON queries  
✅ **Easier Management**: Company-centric approach aligns with business model  
✅ **Efficient Storage**: JSON compression and reduced overhead

## What this enables:

✅ **Persistent Analysis**: All AI-generated process analyses stored in single JSON column  
✅ **Performance**: No expensive AI regeneration on every page load  
✅ **Smart Updates**: Analysis refreshes only when new assessment data is available  
✅ **Freshness Tracking**: UI indicators show when analysis was last updated  
✅ **Manual Refresh**: "Update Analysis" button for on-demand refresh  
✅ **Atomic Operations**: All company analyses updated together for consistency  
✅ **Cached Statistics**: Pre-computed totals and averages for dashboard performance  

## Usage in the app:

- AI analysis is now cached automatically
- Green dot = using cached analysis 
- Blue dot = fresh analysis generated
- Orange "Update Available" appears when 5+ new submissions exist
- Click "Update Analysis" to force refresh with latest data

## Database Schema Overview:

```sql
ai_process_analysis (
  company_id UUID UNIQUE,           -- One row per company
  process_analyses JSONB,           -- Array of all AI analyses
  total_processes INTEGER,          -- Cached count
  avg_automation_percentage DECIMAL, -- Cached average
  based_on_submissions INTEGER,     -- Submission tracking
  updated_at TIMESTAMP             -- Freshness tracking
)
```

This completes the implementation of the **single-row persistent AI analysis system** as requested - much cleaner and more efficient than the multi-row approach!