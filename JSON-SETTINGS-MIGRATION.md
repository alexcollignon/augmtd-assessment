# Settings Migration to JSON Architecture

## Overview

The Settings system has been migrated from individual table rows to a single JSON-based `company_settings` table. This provides better performance and cleaner data structure while maintaining the same UI experience.

## Database Changes

### New Schema
- **Table**: `company_settings`
- **Structure**: One row per company with JSON fields for `ai_tools` and `departments`
- **Migration**: Automatic migration script in `company-settings-schema.sql`

### Migration Steps

1. **Apply the new schema**:
   ```bash
   # Run the schema file in your Supabase SQL editor
   psql -f company-settings-schema.sql
   ```

2. **Verify migration**:
   ```sql
   SELECT company_id, 
          jsonb_array_length(ai_tools) as tools_count,
          jsonb_array_length(departments) as dept_count
   FROM company_settings;
   ```

3. **Test the Settings page** to ensure everything works

## Code Changes

### Backend Service (`settingsService.ts`)

**New Methods Added**:
- `getCompanySettings()` - Get full settings for company
- `ensureCompanySettings()` - Create settings if they don't exist
- `toggleAIToolApprovalByName()` - Toggle by tool name instead of ID
- `deleteAIToolByName()` - Delete by tool name instead of ID  
- `deleteDepartmentByName()` - Delete by department name instead of ID

**Legacy Methods Updated**:
- `getAITools()` - Now reads from JSON and converts to legacy format
- `createAITool()` - Now updates JSON array
- `updateAITool()` - Now updates item in JSON array
- `getDepartments()` - Now reads from JSON and converts to legacy format
- `createDepartment()` - Now updates JSON array
- `updateDepartment()` - Now updates item in JSON array

### Frontend Changes (`Settings.tsx`)

**Updated Methods**:
- `handleToolApproval()` - Uses `toggleAIToolApprovalByName()`
- `removeToolFromList()` - Uses `deleteAIToolByName()`
- `handleDeleteDepartment()` - Uses `deleteDepartmentByName()`

## Data Structure

### Old Structure (Multiple Rows)
```sql
ai_tools:
  id | tool_name | category | approved | company_id
  1  | ChatGPT   | Chat     | false    | uuid-1
  2  | Claude    | Chat     | true     | uuid-1

departments:
  id | name       | company_id
  1  | Marketing  | uuid-1
  2  | Engineering| uuid-1
```

### New Structure (Single Row with JSON)
```sql
company_settings:
  company_id | ai_tools                          | departments
  uuid-1     | [{"tool_name":"ChatGPT",...},...] | [{"name":"Marketing"},...] 
```

## Benefits

✅ **Single Row Per Company**: Cleaner data model
✅ **Atomic Updates**: Update all settings in one transaction
✅ **Better Performance**: One query instead of joins
✅ **Flexible Schema**: Easy to add new fields
✅ **UI Unchanged**: Existing Settings page works identically

## Considerations

⚠️ **Method Changes**: Some methods now require tool/department names instead of IDs
⚠️ **Company Context**: All operations now require company ID
⚠️ **Array Indexing**: IDs are now array positions (still works for UI)

## Testing

The Settings page should work exactly the same way:
1. ✅ View AI tools and departments
2. ✅ Add new tools and departments  
3. ✅ Edit department names
4. ✅ Toggle tool approval
5. ✅ Delete tools and departments
6. ✅ Company-scoped data isolation

## Rollback Plan

If issues occur, the old `ai_tools` and `departments` tables are preserved. To rollback:
1. Update `settingsService.ts` to use old table methods
2. Revert UI changes
3. Optionally drop `company_settings` table

The migration script can be run multiple times safely.