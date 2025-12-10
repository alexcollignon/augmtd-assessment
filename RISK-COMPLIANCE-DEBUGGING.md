# Risk & Compliance Integration - Debugging & Troubleshooting

## Issue Analysis Summary

After reviewing the assessment data storage system, I identified several issues with the Risk & Compliance integration:

### ❌ **Problems Found**

1. **Wrong Question ID**: Dashboard service was looking for `'strategic-ai_tools_used'` but the actual question ID is `'tools_used_recently'`

2. **Wrong Section**: Question is in the `competence` section, not `strategic`

3. **Response Format**: Assessment responses are stored as `"section-questionId"` format (e.g., `"competence-tools_used_recently"`)

4. **Tool Name Mismatches**: Assessment values like `"ChatGPT"`, `"Claude"` need proper normalization

5. **Array vs String Handling**: Multi-select responses are arrays, but single responses might be strings

## ✅ **Fixes Implemented**

### **1. Fixed Question ID and Section**
```typescript
// Before (wrong)
submission.responses?.['strategic-ai_tools_used']

// After (correct)
submission.responses?.['competence-tools_used_recently']
```

### **2. Added Multiple Format Support**
```typescript
const toolsUsedOptions = [
  submission.responses?.['competence-tools_used_recently'],
  submission.responses?.['strategic-ai_tools_used'],      // legacy fallback
  submission.responses?.['tooluse-tools_used_recently']   // alternative section
]
```

### **3. Improved Tool Name Normalization**
```typescript
private normalizeToolName(toolName: string): string {
  const commonMappings = {
    'chatgpt': 'chatgpt',
    'chat gpt': 'chatgpt',
    'microsoft copilot': 'microsoft_copilot',
    'copilot': 'microsoft_copilot',
    'dall·e': 'dalle',
    // ... comprehensive mapping
  }
  return commonMappings[normalized] || normalized
}
```

### **4. Added Comprehensive Debug Logging**
- Logs first 3 assessment submissions with full response structure
- Shows available response keys for each submission
- Tracks tool normalization process
- Displays final tool usage map

## 🧪 **Testing Steps**

### **Step 1: Check Console Logs**

1. **Open Risk & Compliance page**
2. **Open browser console** (F12)
3. **Look for debug logs**:
   ```
   Approved tools from settings: ['chatgpt', 'claude']
   Processing X assessment submissions...
   Submission 1 for user@example.com:
   Available response keys: ['profile-industry', 'competence-tools_used_recently', ...]
   Found tools array in option 0: ['ChatGPT', 'Claude', 'Perplexity']
   Tool: "ChatGPT" -> normalized: "chatgpt"
   Final tool usage map: ['chatgpt', 'claude', 'perplexity']
   ```

### **Step 2: Verify Assessment Data Structure**

1. **Complete a test assessment** with AI tools selected
2. **Check database** `assessment_submissions` table:
   ```sql
   SELECT responses->'competence-tools_used_recently' as tools_used 
   FROM assessment_submissions 
   LIMIT 5;
   ```
3. **Expected format**: Array like `["ChatGPT", "Claude", "Microsoft Copilot"]`

### **Step 3: Test Settings Integration**

1. **Go to Settings → AI Tools**
2. **Add tools** that match assessment options:
   - Add "ChatGPT" → Mark as Approved
   - Add "Claude" → Mark as Approved
   - Add "Perplexity" → Leave Unapproved
3. **Return to Risk & Compliance**
4. **Verify**:
   - ChatGPT shows as "Approved" (green)
   - Perplexity shows as "Unauthorized" (red)
   - Metrics reflect correct counts

### **Step 4: Verify Real-Time Updates**

1. **Note current approval counts** in Risk & Compliance
2. **Change tool approval status** in Settings
3. **Refresh Risk & Compliance page**
4. **Verify counts update** immediately

## 🔍 **Common Issues & Solutions**

### **Issue: No tools showing up at all**
**Debug**: Check console for "Processing X assessment submissions"
- If X = 0: No assessment data available
- If X > 0 but no tools: Wrong question format

**Solution**: 
1. Complete test assessment with AI tools selected
2. Verify question ID is `tools_used_recently` in assessment template

### **Issue: Tools show but wrong approval status**
**Debug**: Check console for "Approved tools from settings"
- If empty array: No company settings configured
- If has tools but wrong status: Tool name mismatch

**Solution**:
1. Add AI tools in Settings with exact names from assessment
2. Check tool name normalization in debug logs

### **Issue: Company context not available**
**Debug**: Check console for "No company ID provided for approved tools lookup"
**Solution**: Verify admin user has `company_id` in auth context

### **Issue: Assessment question format changed**
**Debug**: Check console for "Available response keys"
**Solution**: Add new format to `toolsUsedOptions` array

## 🎯 **Assessment Template Reference**

### **Current Tool Question** (`competence` section):
```typescript
{
  id: 'tools_used_recently',
  text: 'Which AI tools have you used in the past month? (check all that apply)',
  type: 'multi_select',
  options: [
    { id: 'chatgpt', label: 'ChatGPT', value: 'ChatGPT' },
    { id: 'claude', label: 'Claude', value: 'Claude' },
    { id: 'perplexity', label: 'Perplexity', value: 'Perplexity' },
    { id: 'copilot', label: 'Microsoft Copilot', value: 'Microsoft Copilot' },
    { id: 'gemini', label: 'Google Gemini', value: 'Google Gemini' },
    { id: 'midjourney', label: 'Midjourney', value: 'Midjourney' },
    { id: 'dalle', label: 'DALL·E', value: 'DALL·E' },
    { id: 'other', label: 'Other', value: 'Other' },
    { id: 'none', label: 'None', value: 'None' }
  ]
}
```

### **Response Storage Format**:
```json
{
  "competence-tools_used_recently": ["ChatGPT", "Claude", "Microsoft Copilot"]
}
```

## 🚀 **Expected Results**

After fixes, the Risk & Compliance page should:

1. ✅ **Show real tool usage** from assessment responses
2. ✅ **Display accurate approval status** from Settings
3. ✅ **Update immediately** when Settings change
4. ✅ **Handle tool name variations** correctly
5. ✅ **Provide meaningful metrics** for compliance decisions

The integration creates a complete governance workflow:
**Assessments → Risk Analysis → Settings Management → Compliance Reporting**