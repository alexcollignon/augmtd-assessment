# Smart Tool Name Matching System

## Overview

Enhanced the Risk & Compliance integration with intelligent tool name normalization to handle company prefixes, "AI" suffixes, and naming variations.

## 🧠 **Smart Normalization Features**

### **1. Company Prefix Removal**
Automatically removes common company prefixes:
```typescript
// Examples of what gets normalized:
"Microsoft Copilot" → "copilot"
"Google Gemini" → "gemini" 
"OpenAI ChatGPT" → "chatgpt"
"Adobe Firefly AI" → "firefly"
"Salesforce Einstein" → "einstein"
```

### **2. AI Suffix Removal**
Strips common AI-related suffixes:
```typescript
// Examples:
"Grammarly AI" → "grammarly"
"Notion AI" → "notion"
"Character AI" → "character"
"Jasper AI Assistant" → "jasper"
```

### **3. Fuzzy Core Matching**
Matches tools even with partial or varied names:
```typescript
// Examples:
"GPT-4" → "chatgpt"
"GPT-3.5 Turbo" → "chatgpt"
"Dall-E 2" → "dalle"
"Midjourney v5" → "midjourney"
"GitHub Copilot X" → "github_copilot"
```

### **4. Comprehensive Tool Database**
Handles 50+ popular AI tools and their variations:

**Core AI Models:**
- ChatGPT, GPT-4, GPT-3
- Claude, Claude AI
- Google Gemini, Bard
- Microsoft Copilot, GitHub Copilot

**Image Generation:**
- DALL·E, Dall-E 2, OpenAI DALL·E
- Midjourney, Mid Journey
- Stable Diffusion

**Writing Tools:**
- Grammarly AI, Jasper AI, Copy.ai
- Notion AI, Slack AI

**Design & Productivity:**
- Canva AI, Figma AI
- Character.AI, Replika

## 💡 **How It Works**

### **Step 1: Preprocessing**
```typescript
// Input: "Microsoft Copilot AI Assistant"
// Remove prefix: "copilot ai assistant"
// Remove suffix: "copilot"
```

### **Step 2: Core Tool Matching**
```typescript
// Direct mapping check:
coreToolMappings = {
  'copilot': 'microsoft_copilot',
  'chatgpt': 'chatgpt',
  'claude': 'claude'
}
```

### **Step 3: Fuzzy Matching**
```typescript
// If no direct match, try partial matching:
// "gpt-4 turbo" contains "gpt" → maps to "chatgpt"
// "dall-e 3" contains "dalle" → maps to "dalle"
```

### **Step 4: Display Formatting**
```typescript
// Convert back to readable format:
'microsoft_copilot' → 'Microsoft Copilot'
'chatgpt' → 'ChatGPT'  
'dalle' → 'DALL·E'
```

## 🧪 **Testing Examples**

### **Assessment Response Variations**
```json
{
  "competence-tools_used_recently": [
    "OpenAI ChatGPT-4",           // → chatgpt
    "Microsoft Copilot AI",       // → microsoft_copilot  
    "Google Bard AI Assistant",   // → gemini
    "Anthropic Claude AI",        // → claude
    "Adobe Firefly AI",           // → firefly
    "Grammarly AI Writing",       // → grammarly_ai
    "Midjourney v5.2"            // → midjourney
  ]
}
```

### **Settings Tool Names**
```json
{
  "ai_tools": [
    {"tool_name": "ChatGPT", "approved": true},
    {"tool_name": "Microsoft Copilot", "approved": true},
    {"tool_name": "Google Gemini", "approved": false},
    {"tool_name": "Claude AI", "approved": true}
  ]
}
```

### **Matching Results**
All variations correctly match their corresponding approved tools:
- ✅ "OpenAI ChatGPT-4" matches "ChatGPT" setting → **Approved**
- ✅ "Microsoft Copilot AI" matches "Microsoft Copilot" → **Approved**  
- ❌ "Google Bard AI Assistant" matches "Google Gemini" → **Unauthorized**

## 🔧 **Configuration Options**

### **Add New Tool Mappings**
To support new tools, add to `coreToolMappings`:
```typescript
// In normalizeToolName method:
'new_tool': 'new_tool',
'new tool ai': 'new_tool',
'company new tool': 'new_tool',
```

### **Add Company Prefixes**
To handle new company prefixes:
```typescript
const companyPrefixes = [
  'microsoft ', 'google ', 'openai ', 
  'new_company ',  // Add here
]
```

### **Add Display Names**
For proper display formatting:
```typescript
const toolNameMapping = {
  'new_tool': 'New Tool AI',  // Add here
}
```

## 🎯 **Business Benefits**

### **Before Enhancement**
- ❌ "Microsoft Copilot AI" vs "Copilot" → **No Match**
- ❌ "GPT-4" vs "ChatGPT" → **No Match**  
- ❌ "Google Bard" vs "Gemini" → **No Match**
- ❌ Manual tool entry required for every variation

### **After Enhancement**  
- ✅ **Intelligent matching** across name variations
- ✅ **Automatic normalization** of company/AI suffixes
- ✅ **Reduced manual configuration** needed
- ✅ **Accurate compliance reporting** regardless of naming

## 🔍 **Debug Information**

Enhanced debug logging shows the full normalization process:

```
Console Output:
Tool: "Microsoft Copilot AI" -> normalized: "microsoft_copilot" -> approved: true
Tool: "OpenAI ChatGPT-4" -> normalized: "chatgpt" -> approved: true
Tool: "Google Bard Assistant" -> normalized: "gemini" -> approved: false
```

This helps identify:
- **Name variations** being processed
- **Normalization results** 
- **Approval status matching**
- **Any unmatched tools** needing configuration

## 📋 **Supported Tool Categories**

**✅ Core AI Models** (15+ variations)
**✅ Image Generation** (10+ variations)  
**✅ Writing & Content** (12+ variations)
**✅ Code & Development** (8+ variations)
**✅ Design & Creative** (6+ variations)
**✅ Productivity & Business** (10+ variations)

The system automatically handles the most common AI tools used in enterprise environments, with easy extensibility for new tools as they emerge.

## 🚀 **Future Enhancements**

- **Machine Learning**: Could train on tool usage patterns
- **Alias Learning**: Automatically detect new name variations
- **Category Detection**: Auto-categorize unknown tools
- **Usage Analytics**: Track which normalizations are most common