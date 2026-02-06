# Storefront Proto - AI-Powered Product Search & Recommendations

A proof-of-concept e-commerce storefront demonstrating AI-powered natural language search and personalized product recommendations using **Azure OpenAI** and **Next.js 15**.

## 🎯 Overview

This project transforms traditional keyword-based product search into an intelligent, conversational experience. Customers can search using natural language queries like:

- *"Blue dress for a summer wedding under $200"*
- *"Comfortable work shoes for someone who stands all day"*
- *"Gift for my daughter who loves vintage fashion"*

The AI understands intent, extracts relevant attributes, and returns precisely matched products with explanations of why each was selected.

## ✨ Key Features

### AI-Powered Search
- **Natural Language Understanding**: Converts conversational queries into structured search intent
- **Intent Extraction**: Identifies occasion, style, category, price range, and other attributes
- **Relevance Scoring**: AI ranks products by match quality with explanations
- **Smart Fallback**: Gracefully degrades to keyword search when AI confidence is low

### Personalized Recommendations
- **Similar Products**: Find items like ones you're viewing
- **Frequently Bought Together**: Complementary product suggestions
- **Complete the Look**: Style-based outfit/collection recommendations
- **Based on History**: Personalized suggestions from browse patterns

### Developer Experience
- **Standalone Mock Data**: 80-product catalog for testing without backend dependencies
- **Type-Safe**: Full TypeScript with strict mode
- **Azure Integration**: Microsoft Entra ID or API key authentication
- **Infrastructure as Code**: Bicep templates for Azure deployment

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js App                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────────┐  ┌───────────────────┐  │
│  │  Demo Page  │  │  API Routes      │  │  UI Components    │  │
│  │  /demo      │  │  /api/search     │  │  AISearchResults  │  │
│  │             │  │  /api/recommend  │  │  Recommendations  │  │
│  └─────────────┘  └──────────────────┘  └───────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                        Core Libraries                            │
│  ┌─────────────┐  ┌──────────────────┐  ┌───────────────────┐  │
│  │  AI Client  │  │  Search Provider │  │  Recommendation   │  │
│  │  Azure AOAI │  │  Intent Extract  │  │  Engine           │  │
│  │  Entra Auth │  │  Relevance Score │  │  Strategies       │  │
│  └─────────────┘  └──────────────────┘  └───────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                        Data Layer                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Mock Data Service (80 products)  OR  Saleor GraphQL     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │       Azure OpenAI            │
              │  • GPT-4o for Intent          │
              │  • GPT-4o for Scoring         │
              │  • Entra ID Auth              │
              └───────────────────────────────┘
```

## 📁 Project Structure

```
storefront-proto/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   ├── search/           # AI search endpoint
│   │   │   ├── recommendations/  # Recommendation endpoints
│   │   │   └── preferences/      # User preference API
│   │   ├── demo/                 # Demo page for testing
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home (redirects to /demo)
│   │
│   ├── config/
│   │   └── ai.ts                 # AI configuration & feature flags
│   │
│   ├── lib/
│   │   ├── ai/                   # Azure OpenAI integration
│   │   │   ├── client.ts         # OpenAI client with Entra auth
│   │   │   ├── intent-extractor.ts
│   │   │   ├── relevance-scorer.ts
│   │   │   ├── prompts/          # System prompts
│   │   │   └── types.ts
│   │   │
│   │   ├── mock-data/            # Standalone test data
│   │   │   ├── products.ts       # 80-product catalog
│   │   │   └── index.ts          # Search & filter functions
│   │   │
│   │   ├── recommendations/      # Recommendation engine
│   │   │   ├── engine.ts         # Main orchestrator
│   │   │   ├── strategies/       # Recommendation algorithms
│   │   │   │   ├── similar.ts
│   │   │   │   ├── frequently-bought.ts
│   │   │   │   ├── complete-the-look.ts
│   │   │   │   └── based-on-history.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── search/               # Search provider
│   │   │   ├── ai-provider.ts    # AI-enhanced search
│   │   │   └── types.ts
│   │   │
│   │   └── user/                 # User preferences
│   │
│   └── ui/
│       └── components/           # React components
│           ├── ai-search/        # Search result components
│           └── recommendations/  # Recommendation widgets
│
├── infra/                        # Azure infrastructure
│   ├── main.bicep                # Main deployment template
│   └── modules/
│       ├── openai.bicep          # Azure OpenAI resource
│       ├── keyvault.bicep        # Key Vault for secrets
│       └── monitoring.bicep      # Application Insights
│
├── docs/
│   └── implementation-plan.md    # Detailed feature spec
│
└── constitution.md               # Project principles & guidelines
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x (see `.nvmrc`)
- **pnpm** 9.4+ (package manager)
- **Azure CLI** (for Entra authentication)
- **Azure OpenAI** resource with a GPT-4o deployment

### Installation

```bash
# Clone the repository
git clone https://github.com/bobjac/storefront-proto.git
cd storefront-proto

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env
```

### Configuration

Edit `.env` with your Azure OpenAI settings:

```env
# Azure OpenAI (required)
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Authentication (choose one)
AZURE_OPENAI_API_KEY=your-api-key          # Option 1: API Key
AZURE_OPENAI_USE_ENTRA_AUTH=true           # Option 2: Entra ID (recommended)

# Feature flags
AI_SEARCH_ENABLED=true
RECOMMENDATIONS_ENABLED=true
```

#### Using Entra ID Authentication

If using `AZURE_OPENAI_USE_ENTRA_AUTH=true`:

1. Log in to Azure CLI:
   ```bash
   az login
   az account set --subscription "your-subscription-id"
   ```

2. Ensure your user has the **Cognitive Services OpenAI User** role on the Azure OpenAI resource

### Running the Application

```bash
# Development server
pnpm dev

# Open http://localhost:3000
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests once (CI mode)
pnpm test:run

# Type checking
pnpm exec tsc --noEmit
```

## 🔧 Core Modules

### AI Client (`src/lib/ai/client.ts`)

The Azure OpenAI client handles authentication and API communication:

```typescript
import { getOpenAIClient } from "@/lib/ai";

const client = getOpenAIClient();

// Chat completion with JSON response
const result = await client.createChatCompletion<MyType>({
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Extract the color from: blue dress" }
  ],
  temperature: 0.3,
  maxTokens: 500,
  responseFormat: "json_object"
});

if (result.ok) {
  console.log(result.data);
}
```

**Features:**
- Supports both API key and Entra ID authentication
- Token caching for Entra auth
- Automatic retries with exponential backoff
- Timeout handling
- Rate limit awareness

### Intent Extractor (`src/lib/ai/intent-extractor.ts`)

Converts natural language queries into structured search parameters:

```typescript
import { getIntentExtractor } from "@/lib/ai";

const extractor = getIntentExtractor();

// Check if query needs AI processing
if (extractor.isComplexQuery("blue dress for summer wedding")) {
  const result = await extractor.extract({
    query: "blue dress for summer wedding under $200"
  });
  
  if (result.ok) {
    console.log(result.data.intent);
    // {
    //   rawQuery: "blue dress for summer wedding under $200",
    //   category: "dresses",
    //   occasion: "wedding",
    //   attributes: { color: ["blue"] },
    //   priceRange: { max: 200 },
    //   confidence: 0.92
    // }
  }
}
```

### Search Provider (`src/lib/search/ai-provider.ts`)

Orchestrates the AI-powered search flow:

```typescript
import { aiSearchProducts } from "@/lib/search";

const results = await aiSearchProducts({
  query: "comfortable work shoes",
  channel: "default-channel",
  limit: 20
});

// Results include:
// - products: ranked by AI relevance
// - intent: extracted search parameters
// - intentExplanation: "Looking for comfortable shoes for work"
// - suggestedRefinements: ["Show me more colors", "Under $100"]
```

**Search Flow:**
1. Extract intent from natural language query
2. Check confidence threshold (fallback to keyword search if low)
3. Fetch candidate products from data source
4. Score products by relevance using AI
5. Return ranked results with explanations

### Recommendation Engine (`src/lib/recommendations/engine.ts`)

Provides personalized product recommendations:

```typescript
import { getRecommendationEngine } from "@/lib/recommendations";

const engine = getRecommendationEngine();

// Similar products
const similar = await engine.getSimilarProducts({
  productId: "prod-123",
  channel: "default-channel",
  limit: 6
});

// PDP recommendations (complete the look, frequently bought, similar)
const pdpRecs = await engine.getPDPRecommendations({
  productId: "prod-123",
  channel: "default-channel"
});

// Homepage recommendations
const homeRecs = await engine.getHomepageRecommendations({
  channel: "default-channel",
  userId: "user-456" // optional
});
```

### Mock Data Service (`src/lib/mock-data/`)

80-product catalog for standalone testing:

```typescript
import {
  searchProducts,
  searchByIntent,
  getSimilarProducts,
  getFrequentlyBoughtTogether,
  getTrendingProducts
} from "@/lib/mock-data";

// Keyword search
const results = searchProducts({
  query: "summer dress",
  category: "Dresses",
  priceRange: { max: 150 },
  sortBy: "price-asc",
  limit: 10
});

// Intent-based search (for AI)
const intentResults = searchByIntent({
  rawQuery: "wedding guest outfit",
  occasion: "wedding",
  style: "elegant",
  confidence: 0.9
}, 20);

// Recommendations
const similar = getSimilarProducts("prod-123", 6);
const fbt = getFrequentlyBoughtTogether("prod-123", 3);
const trending = getTrendingProducts(8);
```

## 📊 API Routes

### `POST /api/search`

AI-powered product search:

```typescript
// Request
{
  "query": "blue dress for summer wedding",
  "channel": "default-channel",
  "limit": 20
}

// Response
{
  "products": [...],
  "intent": {
    "rawQuery": "blue dress for summer wedding",
    "category": "dresses",
    "occasion": "wedding",
    "attributes": { "color": ["blue"] },
    "confidence": 0.91
  },
  "intentExplanation": "Looking for blue dresses for a summer wedding",
  "suggestedRefinements": ["Show more options", "Under $150"],
  "queryTimeMs": 342
}
```

### `GET /api/recommendations/similar`

Get similar products:

```typescript
// Request: /api/recommendations/similar?productId=prod-123&limit=6

// Response
{
  "type": "similar",
  "title": "Similar Items",
  "products": [...],
  "confidence": 0.85
}
```

### `GET /api/recommendations/pdp`

Get PDP recommendations:

```typescript
// Request: /api/recommendations/pdp?productId=prod-123

// Response
{
  "frequentlyBoughtTogether": {...},
  "completeTheLook": {...},
  "similarItems": {...}
}
```

### `GET /api/recommendations/homepage`

Get homepage recommendations:

```typescript
// Request: /api/recommendations/homepage

// Response
{
  "sections": [
    {
      "type": "based_on_history",
      "title": "Recommended For You",
      "products": [...]
    },
    {
      "type": "trending",
      "title": "Trending Now",
      "products": [...]
    }
  ]
}
```

## ☁️ Azure Infrastructure

Deploy Azure resources using Bicep:

```bash
# Deploy to Azure
az deployment sub create \
  --location eastus2 \
  --template-file infra/main.bicep \
  --parameters environmentName=dev

# Get deployment outputs
az deployment sub show \
  --name main \
  --query properties.outputs
```

**Resources Deployed:**
- **Azure OpenAI**: GPT-4o deployment for AI processing
- **Key Vault**: Secure storage for API keys
- **Application Insights**: Monitoring and telemetry

## 🧪 Testing

### Unit Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run
```

### Manual Testing

1. Start the dev server: `pnpm dev`
2. Open http://localhost:3000
3. Try search queries:
   - "blue dress for summer wedding"
   - "comfortable work pants under $100"
   - "gift for someone who loves vintage style"

## 📝 Configuration

### AI Search Configuration

From `src/config/ai.ts`:

```typescript
export const aiSearchConfig = {
  minConfidenceThreshold: 0.3,    // Fallback to keyword below this
  maxCandidateProducts: 100,       // Products to fetch before ranking
  defaultLimit: 20,                // Default results per page
  maxLimit: 50,                    // Maximum results
  cacheTtlSeconds: 300,            // Intent cache duration
  enabled: true,                   // Feature flag
  fallbackOnError: true            // Use keyword search on AI error
};
```

### Recommendation Configuration

```typescript
export const recommendationConfig = {
  similarProductsLimit: 6,
  frequentlyBoughtLimit: 3,
  completeTheLookLimit: 4,
  homepageSectionsLimit: 3,
  productsPerSection: 8,
  minConfidenceThreshold: 0.5,
  cacheTtlSeconds: 600,
  enabled: true
};
```

## 🔐 Security

- **Entra ID Authentication**: Preferred for production (no API keys in environment)
- **Key Vault Integration**: Store secrets securely in Azure
- **Environment Variables**: Never commit `.env` files

## 📚 Related Documentation

- [Implementation Plan](docs/implementation-plan.md) - Detailed feature specification
- [AI Search README](docs/ai-search/README.md) - Search feature documentation
- [Constitution](constitution.md) - Project principles and guidelines

## 🛣️ Roadmap

### Phase 1 (Current)
- ✅ Natural language search
- ✅ Intent extraction
- ✅ Relevance scoring
- ✅ Product recommendations
- ✅ Mock data for standalone testing

### Phase 2 (Planned)
- [ ] Saleor GraphQL integration
- [ ] Redis caching
- [ ] User authentication
- [ ] A/B testing framework

### Phase 3 (Future)
- [ ] Voice search
- [ ] Image/visual search
- [ ] Real-time inventory integration

## 📄 License

This project is a proof-of-concept for demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test:run`
5. Submit a pull request

---

Built with ❤️ using [Next.js](https://nextjs.org), [Azure OpenAI](https://azure.microsoft.com/products/ai-services/openai-service), and [TypeScript](https://www.typescriptlang.org).
