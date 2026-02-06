# AI-Powered Product Search & Recommendations

This module provides AI-enhanced search and personalized recommendations for the Saleor storefront.

## Features

- **Natural Language Search**: Understand user queries like "flowy dress for outdoor summer wedding"
- **Intent Extraction**: Parse queries into structured search parameters
- **Relevance Scoring**: Rank products by AI-determined relevance with explanations
- **Personalized Recommendations**: "Frequently Bought Together", "Similar Items", and more
- **User Preferences**: Track browse history for personalization

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9.4+
- Azure OpenAI access (or configure mock mode for development)

### Environment Setup

Create a `.env.local` file:

```env
# Required for AI features
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=gpt-4o

# Optional
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AI_SEARCH_ENABLED=true
RECOMMENDATIONS_ENABLED=true
```

### Running Locally

```bash
pnpm install
pnpm run dev
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js App Router                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Search Page │  │  Homepage   │  │    Product Page         │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                     │                 │
│         ▼                ▼                     ▼                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   AI Service Layer                         │ │
│  │  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐   │ │
│  │  │ AI Search  │  │ Recommend-   │  │ User Preference  │   │ │
│  │  │ Provider   │  │ ation Engine │  │ Service          │   │ │
│  │  └────────────┘  └──────────────┘  └──────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                    │                 │
                    ▼                 ▼
            ┌───────────────┐  ┌─────────────────┐
            │ Azure OpenAI  │  │ Saleor GraphQL  │
            └───────────────┘  └─────────────────┘
```

## API Endpoints

### Search

```
GET /api/search?q=summer+dress&channel=default-channel
```

Returns AI-enhanced search results with:
- Extracted intent
- Relevance scores
- Match explanations
- Suggested refinements

### Recommendations

```
GET /api/recommendations/similar?productId=xxx&channel=default-channel
GET /api/recommendations/homepage?channel=default-channel
GET /api/recommendations/pdp?productId=xxx&channel=default-channel
```

### User Preferences

```
GET /api/preferences         # Get current preferences
POST /api/preferences        # Update preferences
DELETE /api/preferences      # Clear preferences
```

## Components

### AI Search Components

- `AISearchResults` - Display search results with relevance info
- `IntentExplanation` - Show how the query was understood
- `RefinementChips` - Suggested query refinements
- `RelevanceBadge` - Product relevance indicator

### Recommendation Components

- `HomepageRecommendations` - Personalized homepage sections
- `PDPRecommendations` - Product page recommendations
- `FrequentlyBought` - Bundle offer component
- `SimilarProducts` - Find similar items

## Configuration

See `src/config/ai.ts` for configuration options:

```typescript
const aiSearchConfig = {
  minConfidenceThreshold: 0.3,    // Fallback threshold
  maxCandidateProducts: 100,      // Products to fetch before ranking
  defaultLimit: 20,               // Default results per page
  fallbackOnError: true,          // Fall back to standard search
};
```

## Testing

```bash
# Run all tests
pnpm test

# Run AI-related tests
pnpm test --grep "AI|intent|relevance"

# Run with coverage
pnpm test --coverage
```

## Infrastructure

Deploy Azure resources using Bicep:

```bash
cd infra
az deployment sub create \
  --location eastus2 \
  --template-file main.bicep \
  --parameters main.bicepparam
```

## Troubleshooting

### AI search returns standard results

- Check `AI_SEARCH_ENABLED=true` in environment
- Verify Azure OpenAI credentials are set
- Check if query complexity is below threshold (simple queries use standard search)

### High latency

- Consider using `gpt-4o-mini` for development
- Enable caching (default: 5 minutes)
- Check Azure OpenAI quota

### Recommendations not appearing

- Check `RECOMMENDATIONS_ENABLED=true`
- Verify user has browse history (for personalized recommendations)
- Check confidence thresholds in config

## License

MIT
