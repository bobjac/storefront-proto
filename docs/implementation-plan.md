# Implementation Plan: AI-Powered Product Search & Recommendations

> **Generated:** February 5, 2026
> **Feature Spec:** https://github.com/bobjac/featurestash/blob/main/saleor/ai-product-search-recommendations.md
> **Constitution:** constitution.md
> **Status:** PENDING REVIEW

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature Requirements](#2-feature-requirements)
3. [Constitution Alignment](#3-constitution-alignment)
4. [Technical Architecture](#4-technical-architecture)
5. [Data Model](#5-data-model)
6. [API Design](#6-api-design)
7. [UI Components](#7-ui-components)
8. [Azure Infrastructure](#8-azure-infrastructure)
9. [Implementation Phases](#9-implementation-phases)
10. [File Structure](#10-file-structure)
11. [Testing Strategy](#11-testing-strategy)
12. [Documentation Deliverables](#12-documentation-deliverables)
13. [Risks & Mitigations](#13-risks--mitigations)
14. [Approval Checklist](#14-approval-checklist)

---

## 1. Executive Summary

### Feature Overview

Transform the e-commerce shopping experience by enabling customers to find products through natural, conversational queries and receive personalized recommendations that anticipate their needs. This replaces keyword-based search with AI-powered intent understanding.

### Business Value

- **Increased Conversion:** Reduce time-to-purchase from 10+ minutes to under 2 minutes
- **Improved Discovery:** Help customers find products they didn't know how to search for
- **Higher AOV:** AI-powered recommendations increase basket size through "Complete the Look" and "Frequently Bought Together" suggestions
- **Reduced Bounce Rate:** Zero-result rate target under 1% vs. typical 15-20%
- **Customer Satisfaction:** Natural language removes friction for gift buyers and busy professionals

### Scope

**In Scope:**
- [x] Natural language search processing via Azure OpenAI
- [x] Intent extraction and query understanding
- [x] Relevance scoring with explanations
- [x] Personalized recommendations on homepage/PDP
- [x] "Find Similar" functionality
- [x] Search refinement suggestions
- [x] User preference tracking
- [x] "Frequently Bought Together" recommendations
- [x] Category-based smart filtering

**Out of Scope (Phase 2+):**
- [ ] Voice search integration
- [ ] Image/visual search from camera
- [ ] AR product visualization
- [ ] Proactive email recommendations
- [ ] Social shopping features
- [ ] Outfit/collection builder

### Key Deliverables Checklist

- [ ] AI Search Provider (`src/lib/search/ai-provider.ts`)
- [ ] Recommendation Service (`src/lib/recommendations/`)
- [ ] Enhanced Search Results UI with relevance explanations
- [ ] Homepage recommendation widgets
- [ ] PDP recommendation sections
- [ ] User preference management API
- [ ] Azure OpenAI integration
- [ ] Test suite with >80% coverage
- [ ] Integration documentation

---

## 2. Feature Requirements

### 2.1 Functional Requirements

| ID | Requirement | Priority | Source |
|----|-------------|----------|--------|
| FR-01 | System shall accept natural language queries up to 500 characters | P0 | Workflow 1 |
| FR-02 | System shall extract search intent (occasion, style, price range, etc.) from queries | P0 | Experience Principle 1 |
| FR-03 | System shall return results ranked by AI-determined relevance | P0 | Workflow 1 |
| FR-04 | System shall provide "Why we picked these" explanations for search results | P0 | Experience Principle 2 |
| FR-05 | System shall suggest query refinements ("Show more in blue", "Something more formal") | P1 | Workflow 1 |
| FR-06 | System shall support "Find Similar" from any product | P1 | Workflow 2 |
| FR-07 | System shall provide personalized recommendations on homepage | P1 | Workflow 5 |
| FR-08 | System shall show "Frequently Bought Together" on PDP | P1 | Recommendation Scenarios |
| FR-09 | System shall show "Customers with similar taste bought" on PDP | P1 | Workflow 5 |
| FR-10 | System shall allow users to dismiss/opt-out of recommendation types | P2 | Experience Principle 4 |
| FR-11 | System shall support gift-finder mode with guided questions | P2 | Workflow 3 |
| FR-12 | System shall extract technical requirements from queries (dimensions, specs) | P2 | Workflow 4 |
| FR-13 | System shall track user browse history for personalization | P1 | Recommendation Scenarios |
| FR-14 | System shall fall back to traditional search when AI confidence is low | P0 | Experience Principle 5 |

### 2.2 Non-Functional Requirements

| ID | Requirement | Priority | Metric |
|----|-------------|----------|--------|
| NFR-01 | Search response time < 2 seconds (P95) | P0 | Latency |
| NFR-02 | AI service availability > 99.5% | P0 | Uptime |
| NFR-03 | Zero-result rate < 1% | P0 | Quality |
| NFR-04 | Support 1000 concurrent search requests | P1 | Scalability |
| NFR-05 | Recommendation latency < 500ms | P1 | Latency |
| NFR-06 | User preference data encrypted at rest | P0 | Security |
| NFR-07 | GDPR-compliant preference management | P0 | Compliance |

### 2.3 Acceptance Criteria Checklist

- [ ] User can type "flowy dress for outdoor summer wedding" and receive relevant results
- [ ] Search results include relevance scores/explanations
- [ ] Empty/irrelevant queries gracefully fall back to category browsing
- [ ] Homepage shows personalized "Based on your style" section for logged-in users
- [ ] PDP shows "Complete the Look" recommendations
- [ ] User can click "Find Similar" and see visually/conceptually similar products
- [ ] User can manage/clear their preferences
- [ ] Search handles typos and alternative phrasings
- [ ] Mobile experience maintains <2s response time

### 2.4 User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Busy professional | Search "business casual top for navy pants" | I find matching items without browsing categories |
| US-02 | Gift buyer | Describe recipient interests to get gift ideas | I can find thoughtful gifts without knowing product names |
| US-03 | Trend-conscious shopper | Search for products by aesthetic ("cottagecore decor") | I discover items matching my style |
| US-04 | Practical researcher | Specify technical requirements in natural language | I get pre-filtered results meeting my criteria |
| US-05 | Returning customer | See personalized recommendations | I discover new products matching my taste |
| US-06 | Privacy-conscious user | View/delete my preference data | I control what the system knows about me |

---

## 3. Constitution Alignment

### 3.1 Technology Stack Comparison

| Requirement | Constitution Spec | Implementation |
|------------|-------------------|----------------|
| Language | TypeScript 5.3.3 (strict mode) | ✅ TypeScript 5.3.3 |
| Framework | Next.js 16.1.2 (App Router) | ✅ Next.js 16.1.2 |
| React | ^19.1.2 | ✅ React 19.1.2 |
| Node.js | >=20 <21 | ✅ Node.js 20.x |
| Package Manager | pnpm >=9.4.0 | ✅ pnpm |
| Testing | Vitest 4.0.17 | ✅ Vitest |
| AI Service | Azure OpenAI (recommended) | ✅ Azure OpenAI |
| Styling | Tailwind + CSS Variables | ✅ Design tokens from brand.css |

### 3.2 Patterns to Follow

| Pattern | Constitution Section | Application |
|---------|---------------------|-------------|
| Server Components default | §8.1 | AI search logic in Server Components |
| Result pattern for errors | §5.3, §14 | `GraphQLResult<T>` for all API calls |
| Swappable search provider | §5.4 | Extend `searchProducts` contract |
| Suspense boundaries | §8.1 | Wrap AI-powered components |
| Path alias `@/` | §8.5 | All imports from `src/` |
| Design tokens | §11.3 | Use `bg-card`, `text-foreground`, etc. |
| Co-located tests | §9.2 | Tests adjacent to implementation |

### 3.3 Interfaces to Implement

| Interface | Location | Purpose |
|-----------|----------|---------|
| `SearchProduct` | §14 | Search result item - EXTEND with AI fields |
| `SearchResult` | §14 | Search response container - EXTEND |
| `SearchPagination` | §14 | Pagination info |
| `GraphQLResult<T>` | §14 | API response wrapper |

### 3.4 Base Classes/Functions to Extend

| Function | Location | Extension |
|----------|----------|-----------|
| `searchProducts()` | `src/lib/search/` | Create `ai-provider.ts` |
| `executePublicGraphQL()` | `src/lib/graphql.ts` | Use for product data fetching |
| `cn()` | Utils | Class name utility |
| `formatPrice()` | `src/config/locale.ts` | Currency formatting |

### 3.5 Enums to Use

| Enum | Purpose |
|------|---------|
| `ProductOrderField` | Saleor sorting (fallback) |
| `OrderDirection` | Sort direction |
| `GraphQLErrorType` | Error categorization |
| `ButtonVariant` | UI button styling |
| `BadgeVariant` | UI badge styling |

### 3.6 Models to Match

| Model | Source | Usage |
|-------|--------|-------|
| `ProductListItemFragment` | §16 | Transform AI results to this shape |
| `ProductDetailsFragment` | §16 | PDP recommendations |
| `CategoryOption` | §16 | Filter UI |
| `ActiveFilter` | §16 | Filter state |

---

## 4. Technical Architecture

### 4.1 Architecture Overview

The AI-powered search system adds an intelligence layer between user queries and the Saleor GraphQL API. Natural language queries are processed by Azure OpenAI to extract intent, which is then used to construct optimized Saleor queries and rank results by relevance.

### 4.2 Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Next.js App Router                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐     │
│  │   Search Page   │    │   Homepage      │    │   PDP           │     │
│  │   (Suspense)    │    │   (Suspense)    │    │   (Suspense)    │     │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘     │
│           │                      │                      │               │
│           ▼                      ▼                      ▼               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    AI Search Service Layer                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │   │
│  │  │ AI Search    │  │ Recommend-   │  │ User Preference      │   │   │
│  │  │ Provider     │  │ ation Engine │  │ Service              │   │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │   │
│  └─────────┼─────────────────┼─────────────────────┼───────────────┘   │
│            │                 │                     │                    │
└────────────┼─────────────────┼─────────────────────┼────────────────────┘
             │                 │                     │
             ▼                 ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐
│  Azure OpenAI   │  │  Saleor        │  │  User Preference Store  │
│  - Intent Parse │  │  GraphQL API   │  │  (Cookies/Session)      │
│  - Embeddings   │  │  - Products    │  │                         │
│  - Ranking      │  │  - Categories  │  └─────────────────────────┘
└─────────────────┘  └─────────────────┘
```

### 4.3 Data Flow Diagram

```
User Query: "flowy dress for outdoor summer wedding"
                    │
                    ▼
┌───────────────────────────────────────┐
│ 1. Query Validation & Preprocessing   │
│    - Sanitize input                   │
│    - Check cache for similar queries  │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ 2. Intent Extraction (Azure OpenAI)   │
│    - Occasion: "summer wedding"       │
│    - Style: "flowy, semi-formal"      │
│    - Context: "outdoor, with sandals" │
│    - Category: "dresses"              │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ 3. Query Construction                 │
│    - Build Saleor GraphQL query       │
│    - Add category filters             │
│    - Include attribute filters        │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ 4. Product Fetch (Saleor API)         │
│    - Execute GraphQL query            │
│    - Retrieve candidate products      │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ 5. AI Relevance Ranking               │
│    - Score each product vs. intent    │
│    - Generate match explanations      │
│    - Sort by relevance score          │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ 6. Response Assembly                  │
│    - Format as SearchResult           │
│    - Add refinement suggestions       │
│    - Include intent explanation       │
└───────────────────┴───────────────────┘
                    │
                    ▼
           Search Results Page
```

### 4.4 Key Components Table

| Component | Type | Responsibility | Location |
|-----------|------|----------------|----------|
| AI Search Provider | Service | Process NL queries, coordinate AI ranking | `src/lib/search/ai-provider.ts` |
| Intent Extractor | Service | Call Azure OpenAI for intent parsing | `src/lib/ai/intent-extractor.ts` |
| Relevance Scorer | Service | Score products against extracted intent | `src/lib/ai/relevance-scorer.ts` |
| Recommendation Engine | Service | Generate personalized recommendations | `src/lib/recommendations/engine.ts` |
| User Preference Service | Service | Track and retrieve user preferences | `src/lib/user/preferences.ts` |
| Enhanced Search Results | Component | Display results with explanations | `src/ui/components/ai-search-results.tsx` |
| Recommendation Widget | Component | Display recommendations | `src/ui/components/recommendations/` |

### 4.5 Integration Points Table

| System | Integration Type | Purpose | Auth |
|--------|-----------------|---------|------|
| Azure OpenAI | REST API | Intent extraction, embeddings | API Key |
| Saleor GraphQL | GraphQL | Product data, categories | Public |
| Browser Cookies | HTTP Cookies | User preference storage | Session |
| Analytics (future) | Events | Track search/recommendation metrics | N/A |

---

## 5. Data Model

### 5.1 Entities Table with Constitution Model Mapping

| Entity | Constitution Model | AI Extension | Storage |
|--------|-------------------|--------------|---------|
| SearchProduct | `SearchProduct` (§14) | + relevanceScore, matchReason | In-memory |
| SearchResult | `SearchResult` (§14) | + intentExplanation, suggestedRefinements | In-memory |
| UserPreference | NEW | browseHistory, purchaseHistory, dismissals | Cookies |
| ExtractedIntent | NEW | occasion, style, category, priceRange, attributes | In-memory |
| Recommendation | NEW | products, reason, type | In-memory |

### 5.2 Entity Field Details

#### AISearchProduct (extends SearchProduct)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Saleor product ID |
| name | string | ✅ | Product name |
| slug | string | ✅ | URL slug |
| thumbnailUrl | string | ❌ | Image URL |
| thumbnailAlt | string | ❌ | Image alt text |
| price | number | ✅ | Starting price |
| currency | string | ✅ | ISO 4217 code |
| categoryName | string | ❌ | Category display name |
| **relevanceScore** | number | ❌ | 0-1 AI confidence score |
| **matchReason** | string | ❌ | Human-readable explanation |
| **matchedAttributes** | string[] | ❌ | Which query aspects matched |

#### ExtractedIntent

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| rawQuery | string | ✅ | Original user query |
| occasion | string | ❌ | Detected occasion (wedding, work) |
| style | string | ❌ | Style descriptors (flowy, minimalist) |
| category | string | ❌ | Product category |
| priceRange | { min?: number, max?: number } | ❌ | Price constraints |
| attributes | Record<string, string[]> | ❌ | Color, size, material |
| recipient | string | ❌ | Gift recipient (for gift mode) |
| confidence | number | ✅ | 0-1 extraction confidence |

#### UserPreference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | ❌ | Saleor user ID (if logged in) |
| sessionId | string | ✅ | Anonymous session ID |
| browseHistory | string[] | ❌ | Recent product IDs viewed |
| searchHistory | string[] | ❌ | Recent search queries |
| purchaseHistory | string[] | ❌ | Past purchase product IDs |
| preferredCategories | string[] | ❌ | Frequently browsed categories |
| preferredPriceRange | { min: number, max: number } | ❌ | Typical price range |
| dismissedRecommendations | string[] | ❌ | Product IDs user dismissed |
| createdAt | string | ✅ | ISO timestamp |
| updatedAt | string | ✅ | ISO timestamp |

#### Recommendation

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | RecommendationType | ✅ | Type of recommendation |
| products | AISearchProduct[] | ✅ | Recommended products |
| reason | string | ✅ | Why these are recommended |
| sourceProductId | string | ❌ | For "similar" recommendations |
| confidence | number | ✅ | 0-1 recommendation confidence |

### 5.3 Relationships

```
UserPreference 1───────n SearchHistory (embedded)
      │
      └────────n BrowseHistory (embedded)

SearchResult 1───────n AISearchProduct

Recommendation n───────n AISearchProduct

ExtractedIntent 1───────1 SearchResult
```

### 5.4 Database Schema Changes

**No database changes required.** This is a headless storefront:
- Product data comes from Saleor GraphQL API
- User preferences stored in browser cookies/session
- All AI data is ephemeral (in-memory or API responses)

### 5.5 Data Migration Strategy

Not applicable - no persistent data store.

**Cookie Migration (if preferences format changes):**
```typescript
// Version cookie preferences for forward compatibility
interface PreferenceCookie {
  version: 1;
  data: UserPreference;
}
```

---

## 6. API Design

### 6.1 Endpoints Table

| Method | Path | Description | Request | Response |
|--------|------|-------------|---------|----------|
| GET | `/api/search` | AI-powered product search | `AISearchRequest` | `AISearchResponse` |
| GET | `/api/recommendations/similar` | Find similar products | `SimilarRequest` | `RecommendationResponse` |
| GET | `/api/recommendations/homepage` | Homepage recommendations | `HomepageRecsRequest` | `RecommendationResponse` |
| GET | `/api/recommendations/pdp` | PDP recommendations | `PDPRecsRequest` | `PDPRecommendationResponse` |
| POST | `/api/preferences` | Update user preferences | `PreferenceUpdate` | `PreferenceResponse` |
| DELETE | `/api/preferences` | Clear user preferences | - | `{ ok: true }` |
| GET | `/api/preferences` | Get current preferences | - | `UserPreference` |

### 6.2 Request/Response Examples

#### AI Search Request/Response

**Request: `GET /api/search?q=flowy+dress+for+outdoor+summer+wedding&channel=default-channel&limit=20`**

```typescript
// Query parameters
interface AISearchRequest {
  q: string;           // Natural language query (required)
  channel: string;     // Sales channel (required)
  limit?: number;      // Results per page (default: 20, max: 50)
  cursor?: string;     // Pagination cursor
  direction?: "forward" | "backward";
}
```

**Response:**

```typescript
interface AISearchResponse {
  ok: true;
  data: {
    // Intent extraction results
    intent: {
      rawQuery: string;
      occasion: "summer wedding";
      style: "flowy, semi-formal";
      category: "dresses";
      attributes: {
        formality: ["semi-formal", "casual-elegant"];
        season: ["summer"];
        setting: ["outdoor"];
      };
      confidence: 0.92;
    };
    
    // Why we interpreted the query this way
    intentExplanation: "Looking for summer wedding attire that's comfortable for outdoor settings";
    
    // Suggested refinements
    suggestedRefinements: [
      "Show me more options in blue",
      "Something more formal",
      "Under $150"
    ];
    
    // Search results
    products: [
      {
        id: "UHJvZHVjdDox",
        name: "Flowing Chiffon Midi Dress",
        slug: "flowing-chiffon-midi-dress",
        thumbnailUrl: "https://...",
        thumbnailAlt: "Light blue flowing dress",
        price: 89.99,
        currency: "USD",
        categoryName: "Dresses",
        relevanceScore: 0.95,
        matchReason: "Flowy chiffon fabric perfect for outdoor summer events",
        matchedAttributes: ["flowy", "summer", "semi-formal"]
      },
      // ... more products
    ];
    
    // Pagination
    pagination: {
      totalCount: 38;
      hasNextPage: true;
      hasPreviousPage: false;
      nextCursor: "Y3Vyc29yOnYyOjE5";
    };
    
    // Performance metrics
    queryTimeMs: 847;
  };
}
```

#### Similar Products Request/Response

**Request: `GET /api/recommendations/similar?productId=UHJvZHVjdDox&channel=default-channel&limit=6`**

```typescript
interface SimilarRequest {
  productId: string;   // Source product ID (required)
  channel: string;     // Sales channel (required)
  limit?: number;      // Max results (default: 6)
  priceVariant?: "lower" | "similar" | "any";  // Price filtering
}
```

**Response:**

```typescript
interface RecommendationResponse {
  ok: true;
  data: {
    type: "similar";
    reason: "Products with similar style and aesthetic";
    sourceProduct: {
      id: "UHJvZHVjdDox";
      name: "Flowing Chiffon Midi Dress";
    };
    products: AISearchProduct[];
    confidence: 0.88;
  };
}
```

#### Homepage Recommendations Request/Response

**Request: `GET /api/recommendations/homepage?channel=default-channel`**

```typescript
interface HomepageRecsRequest {
  channel: string;     // Sales channel (required)
  // User context from cookies automatically included
}
```

**Response:**

```typescript
interface HomepageRecommendationResponse {
  ok: true;
  data: {
    sections: [
      {
        type: "based_on_history";
        title: "Based on Your Style";
        reason: "Recommended because you viewed similar items";
        products: AISearchProduct[];
        confidence: 0.85;
      },
      {
        type: "trending";
        title: "Trending Now";
        reason: "Popular with shoppers like you";
        products: AISearchProduct[];
        confidence: 0.78;
      },
      {
        type: "new_arrivals";
        title: "New Arrivals You Might Like";
        reason: "New products matching your preferences";
        products: AISearchProduct[];
        confidence: 0.72;
      }
    ];
  };
}
```

#### PDP Recommendations Request/Response

**Request: `GET /api/recommendations/pdp?productId=UHJvZHVjdDox&channel=default-channel`**

```typescript
interface PDPRecsRequest {
  productId: string;   // Current product ID (required)
  channel: string;     // Sales channel (required)
}
```

**Response:**

```typescript
interface PDPRecommendationResponse {
  ok: true;
  data: {
    frequentlyBoughtTogether: {
      type: "frequently_bought_together";
      title: "Frequently Bought Together";
      reason: "Customers who bought this also bought";
      products: AISearchProduct[];
      bundlePrice?: number;
      bundleSavings?: number;
    };
    
    completeTheLook: {
      type: "complete_the_look";
      title: "Complete the Look";
      reason: "Style recommendations to complement this item";
      products: AISearchProduct[];
    };
    
    similarItems: {
      type: "similar";
      title: "Similar Items";
      reason: "You might also like";
      products: AISearchProduct[];
    };
    
    similarTasteBought: {
      type: "similar_taste";
      title: "Customers with Similar Taste Bought";
      reason: "Based on shoppers with similar browsing patterns";
      products: AISearchProduct[];
      confidence: 0.82;
    };
  };
}
```

### 6.3 Error Response Format (per Constitution)

All API errors follow the constitution's `GraphQLResult` pattern:

```typescript
interface APIErrorResponse {
  ok: false;
  error: {
    type: "validation" | "ai_service" | "upstream" | "rate_limit";
    message: string;
    code: string;
    isRetryable: boolean;
    details?: Record<string, unknown>;
  };
}

// Example error responses
{
  ok: false,
  error: {
    type: "validation",
    message: "Search query is required",
    code: "MISSING_QUERY",
    isRetryable: false
  }
}

{
  ok: false,
  error: {
    type: "ai_service",
    message: "AI service temporarily unavailable, falling back to standard search",
    code: "AI_FALLBACK",
    isRetryable: true,
    details: { fallbackUsed: true }
  }
}

{
  ok: false,
  error: {
    type: "rate_limit",
    message: "Too many requests, please try again later",
    code: "RATE_LIMITED",
    isRetryable: true,
    details: { retryAfterMs: 1000 }
  }
}
```

---

## 7. UI Components

### 7.1 Component Hierarchy

```
src/ui/components/
├── ai-search/
│   ├── ai-search-results.tsx      # Main search results with AI features
│   ├── intent-explanation.tsx     # "Why we picked these" banner
│   ├── refinement-chips.tsx       # Suggested refinement buttons
│   ├── relevance-badge.tsx        # Product relevance indicator
│   └── search-empty-state.tsx     # AI-enhanced empty state
│
├── recommendations/
│   ├── recommendation-section.tsx  # Generic recommendation container
│   ├── homepage-recommendations.tsx # Homepage recommendation grid
│   ├── pdp-recommendations.tsx     # PDP recommendation sections
│   ├── frequently-bought.tsx       # "Frequently bought together" bundle
│   ├── complete-the-look.tsx       # Style recommendations
│   ├── similar-products.tsx        # Find similar products
│   └── recommendation-card.tsx     # Individual product card with reason
│
├── preferences/
│   ├── preference-manager.tsx      # User preference settings
│   └── preference-banner.tsx       # Transparency banner
│
└── search-input/
    └── ai-search-input.tsx         # Enhanced search input with suggestions
```

### 7.2 Component Details Table

| Component | Type | Props | State | Dependencies |
|-----------|------|-------|-------|--------------|
| `AISearchResults` | Server | `products`, `intent`, `channel` | None | `SearchResultCard`, `IntentExplanation` |
| `IntentExplanation` | Server | `intent`, `explanation` | None | `Badge` |
| `RefinementChips` | Client | `suggestions`, `onSelect` | selected | `Button` |
| `RelevanceBadge` | Server | `score`, `reason` | None | `Badge`, `Tooltip` |
| `RecommendationSection` | Server | `title`, `products`, `reason`, `type` | None | `RecommendationCard` |
| `HomepageRecommendations` | Server | `channel`, `userId?` | None | `RecommendationSection` |
| `PDPRecommendations` | Server | `productId`, `channel` | None | `FrequentlyBought`, `SimilarProducts` |
| `FrequentlyBought` | Server | `products`, `bundlePrice?` | None | `RecommendationCard`, `Button` |
| `SimilarProducts` | Client | `productId`, `channel` | loading | `RecommendationCard` |
| `PreferenceManager` | Client | `preferences` | formState | `Switch`, `Button` |
| `AISearchInput` | Client | `onSearch`, `placeholder` | query, suggestions | `Input`, `Popover` |

### 7.3 State Management Approach

**Server Components (default):**
- All recommendation sections
- Search results display
- Intent explanation

**Client Components (explicit `"use client"`):**
- `AISearchInput` - Manages input state and suggestions
- `RefinementChips` - Handles selection state
- `SimilarProducts` - Lazy loading on "Find Similar" click
- `PreferenceManager` - Form state for preference updates

**State Patterns:**
```typescript
// URL state for search (enables sharing/bookmarking)
const searchParams = useSearchParams();
const query = searchParams.get("q");

// Local state for UI interactions
const [selectedRefinement, setSelectedRefinement] = useState<string | null>(null);

// Cookie state for preferences (via server action)
async function updatePreference(key: string, value: boolean) {
  "use server";
  cookies().set("user_preferences", JSON.stringify({ ...current, [key]: value }));
}
```

### 7.4 Mockup References

#### Search Results with AI Enhancements

```
┌──────────────────────────────────────────────────────────────────┐
│  🔍 flowy dress for outdoor summer wedding                    [×]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 💡 Looking for summer wedding attire that's comfortable    │  │
│  │    for outdoor settings                                    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Refine: [More formal] [In blue] [Under $100] [Show more...]    │
│                                                                  │
│  38 products found                                               │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   [Image]   │  │   [Image]   │  │   [Image]   │              │
│  │             │  │             │  │             │              │
│  │ ────────────│  │ ────────────│  │ ────────────│              │
│  │ Dresses     │  │ Dresses     │  │ Dresses     │              │
│  │ Flowing     │  │ Chiffon     │  │ Garden      │              │
│  │ Chiffon     │  │ Wrap Dress  │  │ Party       │              │
│  │ Midi Dress  │  │             │  │ Dress       │              │
│  │ $89.99      │  │ $129.99     │  │ $74.99      │              │
│  │ ⭐ 95% match │  │ ⭐ 91% match │  │ ⭐ 88% match │              │
│  │ "Perfect for│  │ "Elegant    │  │ "Light      │              │
│  │  outdoor    │  │  and        │  │  fabric     │              │
│  │  events"    │  │  flowy"     │  │  ideal for  │              │
│  │             │  │             │  │  summer"    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### PDP Recommendations Layout

```
┌──────────────────────────────────────────────────────────────────┐
│                      [Product Image]                             │
│                      Flowing Chiffon Midi Dress                  │
│                      $89.99                                       │
│                      [Add to Cart]                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Frequently Bought Together                                      │
│  ────────────────────────────────────────────────────────────    │
│  ┌─────────┐  +  ┌─────────┐  +  ┌─────────┐  =  $149.97        │
│  │ [Dress] │     │ [Sandal]│     │[Clutch] │     Save $19.00    │
│  │ $89.99  │     │ $39.99  │     │ $39.99  │     [Add All]      │
│  └─────────┘     └─────────┘     └─────────┘                    │
│                                                                  │
│  Complete the Look                                               │
│  ────────────────────────────────────────────────────────────    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │[Jewelry]│  │ [Bag]   │  │ [Shoes] │  │ [Wrap]  │            │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │
│                                                                  │
│  Similar Items                               [Find Similar →]    │
│  ────────────────────────────────────────────────────────────    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │[Similar]│  │[Similar]│  │[Similar]│  │[Similar]│            │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 8. Azure Infrastructure

### 8.1 Azure Services Table

| Service | Purpose | SKU | Estimated Cost |
|---------|---------|-----|----------------|
| **Azure OpenAI** | Intent extraction, relevance scoring | Standard (gpt-4o) | ~$0.005/1K tokens |
| **Azure API Management** | Rate limiting, API gateway (optional) | Consumption | Pay-per-call |
| **Azure Monitor** | Logging and metrics | - | Included |
| **Application Insights** | Performance monitoring | - | ~$2.30/GB |
| **Azure Key Vault** | API key management | Standard | ~$0.03/10K ops |

### 8.2 Infrastructure Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Azure Subscription                          │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Resource Group: rg-storefront-ai         │   │
│  │                                                             │   │
│  │  ┌─────────────────┐    ┌─────────────────────────────┐    │   │
│  │  │  Azure OpenAI   │    │     Azure Key Vault         │    │   │
│  │  │  ─────────────  │    │     ─────────────────       │    │   │
│  │  │  Deployment:    │    │     Secrets:                │    │   │
│  │  │  - gpt-4o       │◄───│     - OPENAI_API_KEY        │    │   │
│  │  │  - text-embed-3 │    │     - SALEOR_APP_TOKEN      │    │   │
│  │  │                 │    │                             │    │   │
│  │  │  Endpoint:      │    └─────────────────────────────┘    │   │
│  │  │  *.openai.azure │                                       │   │
│  │  │  .com           │                                       │   │
│  │  └────────┬────────┘                                       │   │
│  │           │                                                │   │
│  │           │ HTTPS                                          │   │
│  │           │                                                │   │
│  │  ┌────────▼────────┐    ┌─────────────────────────────┐   │   │
│  │  │   Application   │    │     Azure Monitor           │   │   │
│  │  │   Insights      │◄───│     ─────────────           │   │   │
│  │  │   ─────────────  │    │     - Logs                  │   │   │
│  │  │   - Traces      │    │     - Metrics               │   │   │
│  │  │   - Dependencies│    │     - Alerts                │   │   │
│  │  │   - Performance │    │                             │   │   │
│  │  └─────────────────┘    └─────────────────────────────┘   │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Next.js Application                             │
│                     (Vercel / Any Host)                             │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.3 Bicep Modules to Create

| Module | File | Resources |
|--------|------|-----------|
| Main | `infra/main.bicep` | Resource group, module orchestration |
| OpenAI | `infra/modules/openai.bicep` | Azure OpenAI account, deployments |
| KeyVault | `infra/modules/keyvault.bicep` | Key Vault, secrets |
| Monitoring | `infra/modules/monitoring.bicep` | App Insights, Log Analytics |

**Sample Bicep Structure:**

```bicep
// infra/main.bicep
targetScope = 'subscription'

param location string = 'eastus2'
param environmentName string = 'dev'

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-storefront-ai-${environmentName}'
  location: location
}

module openai 'modules/openai.bicep' = {
  scope: rg
  name: 'openai'
  params: {
    location: location
    environmentName: environmentName
  }
}

module keyvault 'modules/keyvault.bicep' = {
  scope: rg
  name: 'keyvault'
  params: {
    location: location
    openaiKey: openai.outputs.apiKey
  }
}
```

### 8.4 Environment Configuration Table

| Environment | Azure OpenAI Endpoint | Model | TPM Limit | Purpose |
|-------------|----------------------|-------|-----------|---------|
| Development | `dev-*.openai.azure.com` | gpt-4o-mini | 10K | Local dev |
| Staging | `stg-*.openai.azure.com` | gpt-4o | 30K | QA testing |
| Production | `prd-*.openai.azure.com` | gpt-4o | 100K | Live traffic |

**Environment Variables per Environment:**

```env
# .env.development
AZURE_OPENAI_ENDPOINT=https://storefront-ai-dev.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# .env.production
AZURE_OPENAI_ENDPOINT=https://storefront-ai-prd.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

---

## 9. Implementation Phases

### Phase 1: Project Setup (Week 1)

- [ ] Create feature branch `feature/ai-search`
- [ ] Add Azure OpenAI SDK to `package.json`
- [ ] Configure environment variables in `.env.local`
- [ ] Set up Azure OpenAI resource (dev environment)
- [ ] Create `src/lib/ai/` directory structure
- [ ] Create `src/lib/recommendations/` directory structure
- [ ] Add Vitest configuration for new modules
- [ ] Create initial type definitions in `src/lib/search/types.ts`
- [ ] Set up error boundary for AI features

### Phase 2: Data Layer (Week 2)

- [ ] Implement `IntentExtractor` class
  - [ ] Azure OpenAI client initialization
  - [ ] Prompt engineering for intent extraction
  - [ ] Response parsing and validation
  - [ ] Fallback handling for low confidence
- [ ] Implement `UserPreferenceService`
  - [ ] Cookie read/write utilities
  - [ ] Preference schema validation
  - [ ] History tracking (browse, search)
- [ ] Create GraphQL queries for expanded product data
  - [ ] `ProductsWithAttributes.graphql`
  - [ ] Run `pnpm run generate`
- [ ] Write unit tests for data layer (target: 80% coverage)

### Phase 3: Business Logic (Week 3)

- [ ] Implement `RelevanceScorer` class
  - [ ] Product-to-intent matching algorithm
  - [ ] Score calculation (0-1 scale)
  - [ ] Match reason generation
- [ ] Implement `RecommendationEngine` class
  - [ ] "Similar products" logic
  - [ ] "Frequently bought together" logic
  - [ ] "Based on history" logic
  - [ ] Confidence scoring
- [ ] Implement AI search provider (`ai-provider.ts`)
  - [ ] Orchestrate intent → query → fetch → rank flow
  - [ ] Implement caching for repeated queries
  - [ ] Add fallback to standard search
- [ ] Write integration tests for business logic

### Phase 4: API Layer (Week 4)

- [ ] Create `/api/search` route handler
  - [ ] Request validation
  - [ ] AI search orchestration
  - [ ] Error handling and fallback
  - [ ] Response formatting
- [ ] Create `/api/recommendations/similar` route
- [ ] Create `/api/recommendations/homepage` route
- [ ] Create `/api/recommendations/pdp` route
- [ ] Create `/api/preferences` routes (GET, POST, DELETE)
- [ ] Add rate limiting middleware
- [ ] Write API integration tests

### Phase 5: UI Layer (Week 5-6)

- [ ] Create `AISearchResults` component
  - [ ] Relevance badge display
  - [ ] Match reason tooltips
- [ ] Create `IntentExplanation` component
- [ ] Create `RefinementChips` component
- [ ] Create `RecommendationSection` component
- [ ] Create `HomepageRecommendations` component
- [ ] Create `PDPRecommendations` component
  - [ ] `FrequentlyBought` sub-component
  - [ ] `CompleteTheLook` sub-component
  - [ ] `SimilarProducts` sub-component
- [ ] Create `PreferenceManager` component
- [ ] Update search page to use AI search
- [ ] Add Suspense boundaries for all async components
- [ ] Mobile responsive testing
- [ ] Write component tests

### Phase 6: Infrastructure (Week 7)

- [ ] Create Bicep modules
  - [ ] `infra/main.bicep`
  - [ ] `infra/modules/openai.bicep`
  - [ ] `infra/modules/keyvault.bicep`
  - [ ] `infra/modules/monitoring.bicep`
- [ ] Deploy staging environment
- [ ] Configure Application Insights
- [ ] Set up alerts for AI service errors
- [ ] Load testing with realistic queries
- [ ] Performance optimization
- [ ] Security review

### Phase 7: Documentation & Polish (Week 8)

- [ ] Write `README.md` for AI search module
- [ ] Write `INTEGRATION.md` for migration guide
- [ ] Add JSDoc comments to all public APIs
- [ ] Create runbook for common issues
- [ ] Final QA testing
- [ ] Performance benchmarking
- [ ] Code review and cleanup
- [ ] Merge to main branch

---

## 10. File Structure

### 10.1 Complete Directory Tree

```
src/
├── app/
│   ├── [channel]/
│   │   └── (main)/
│   │       ├── search/
│   │       │   └── page.tsx                    # Updated: Uses AI search
│   │       └── products/
│   │           └── [slug]/
│   │               └── page.tsx                # Updated: Add PDP recs
│   └── api/
│       ├── search/
│       │   └── route.ts                        # NEW: AI search endpoint
│       ├── recommendations/
│       │   ├── similar/
│       │   │   └── route.ts                    # NEW: Similar products
│       │   ├── homepage/
│       │   │   └── route.ts                    # NEW: Homepage recs
│       │   └── pdp/
│       │       └── route.ts                    # NEW: PDP recs
│       └── preferences/
│           └── route.ts                        # NEW: User preferences
│
├── graphql/
│   ├── ProductsWithAttributes.graphql          # NEW: Extended product query
│   └── ... (existing queries)
│
├── lib/
│   ├── ai/                                     # NEW: AI service layer
│   │   ├── index.ts                            # Exports
│   │   ├── types.ts                            # AI-specific types
│   │   ├── client.ts                           # Azure OpenAI client
│   │   ├── intent-extractor.ts                 # Intent extraction
│   │   ├── relevance-scorer.ts                 # Product scoring
│   │   ├── prompts/                            # Prompt templates
│   │   │   ├── intent-extraction.ts
│   │   │   └── relevance-scoring.ts
│   │   └── __tests__/
│   │       ├── intent-extractor.test.ts
│   │       └── relevance-scorer.test.ts
│   │
│   ├── recommendations/                        # NEW: Recommendation engine
│   │   ├── index.ts                            # Exports
│   │   ├── types.ts                            # Recommendation types
│   │   ├── engine.ts                           # Main recommendation logic
│   │   ├── strategies/                         # Recommendation strategies
│   │   │   ├── similar.ts
│   │   │   ├── frequently-bought.ts
│   │   │   ├── based-on-history.ts
│   │   │   └── complete-the-look.ts
│   │   └── __tests__/
│   │       └── engine.test.ts
│   │
│   ├── search/
│   │   ├── index.ts                            # Updated: Export AI provider
│   │   ├── types.ts                            # Updated: AI extensions
│   │   ├── saleor-provider.ts                  # Existing
│   │   ├── ai-provider.ts                      # NEW: AI search implementation
│   │   └── __tests__/
│   │       └── ai-provider.test.ts             # NEW
│   │
│   └── user/                                   # NEW: User services
│       ├── index.ts
│       ├── preferences.ts                      # Preference management
│       └── __tests__/
│           └── preferences.test.ts
│
├── ui/components/
│   ├── ai-search/                              # NEW: AI search components
│   │   ├── index.ts
│   │   ├── ai-search-results.tsx
│   │   ├── intent-explanation.tsx
│   │   ├── refinement-chips.tsx
│   │   ├── relevance-badge.tsx
│   │   ├── search-empty-state.tsx
│   │   └── __tests__/
│   │       └── ai-search-results.test.tsx
│   │
│   ├── recommendations/                        # NEW: Recommendation components
│   │   ├── index.ts
│   │   ├── recommendation-section.tsx
│   │   ├── homepage-recommendations.tsx
│   │   ├── pdp-recommendations.tsx
│   │   ├── frequently-bought.tsx
│   │   ├── complete-the-look.tsx
│   │   ├── similar-products.tsx
│   │   ├── recommendation-card.tsx
│   │   └── __tests__/
│   │       └── recommendation-section.test.tsx
│   │
│   ├── preferences/                            # NEW: Preference components
│   │   ├── preference-manager.tsx
│   │   └── preference-banner.tsx
│   │
│   └── search-input/
│       └── ai-search-input.tsx                 # NEW: Enhanced search input
│
└── config/
    └── ai.ts                                   # NEW: AI configuration

infra/                                          # NEW: Infrastructure as code
├── main.bicep
├── main.bicepparam
└── modules/
    ├── openai.bicep
    ├── keyvault.bicep
    └── monitoring.bicep

docs/
├── implementation-plan.md                      # This document
├── README.md                                   # NEW: AI feature documentation
└── INTEGRATION.md                              # NEW: Migration guide
```

### 10.2 Key Files Table

| File | Purpose | Priority |
|------|---------|----------|
| `src/lib/ai/client.ts` | Azure OpenAI client wrapper | P0 |
| `src/lib/ai/intent-extractor.ts` | Parse natural language to structured intent | P0 |
| `src/lib/ai/relevance-scorer.ts` | Score products against intent | P0 |
| `src/lib/search/ai-provider.ts` | Main AI search implementation | P0 |
| `src/lib/search/types.ts` | Extended types with AI fields | P0 |
| `src/lib/recommendations/engine.ts` | Recommendation orchestration | P1 |
| `src/app/api/search/route.ts` | AI search API endpoint | P0 |
| `src/ui/components/ai-search/ai-search-results.tsx` | Results with explanations | P1 |
| `src/ui/components/recommendations/pdp-recommendations.tsx` | PDP recommendations | P1 |
| `src/lib/user/preferences.ts` | User preference management | P1 |
| `infra/main.bicep` | Azure infrastructure definition | P1 |
| `docs/INTEGRATION.md` | Migration documentation | P2 |

---

## 11. Testing Strategy

### 11.1 Test Categories Table

| Category | Tools | Coverage Target | Location |
|----------|-------|-----------------|----------|
| Unit Tests | Vitest | 80% | `**/__tests__/*.test.ts` |
| Integration Tests | Vitest | 70% | `**/__tests__/*.integration.test.ts` |
| Component Tests | Vitest + React Testing Library | 75% | `**/__tests__/*.test.tsx` |
| API Tests | Vitest | 90% | `src/app/api/**/*.test.ts` |
| E2E Tests | Playwright (future) | Critical paths | `e2e/` |

### 11.2 Test Files to Create

| Test File | Tests | Priority |
|-----------|-------|----------|
| `src/lib/ai/__tests__/client.test.ts` | Azure OpenAI client initialization, error handling | P0 |
| `src/lib/ai/__tests__/intent-extractor.test.ts` | Intent parsing, confidence scoring, edge cases | P0 |
| `src/lib/ai/__tests__/relevance-scorer.test.ts` | Scoring algorithm, match reason generation | P0 |
| `src/lib/search/__tests__/ai-provider.test.ts` | Full search flow, fallback behavior | P0 |
| `src/lib/search/__tests__/ai-provider.integration.test.ts` | Real API calls (with mocked OpenAI) | P1 |
| `src/lib/recommendations/__tests__/engine.test.ts` | Recommendation strategies | P1 |
| `src/lib/recommendations/__tests__/strategies/*.test.ts` | Individual strategy tests | P1 |
| `src/lib/user/__tests__/preferences.test.ts` | Cookie read/write, validation | P1 |
| `src/ui/components/ai-search/__tests__/ai-search-results.test.tsx` | Rendering, accessibility | P1 |
| `src/ui/components/recommendations/__tests__/pdp-recommendations.test.tsx` | Section rendering | P2 |
| `src/app/api/search/__tests__/route.test.ts` | API request/response handling | P0 |
| `src/app/api/recommendations/__tests__/*.test.ts` | Recommendation API endpoints | P1 |

### 11.3 Mocking Strategy

#### Azure OpenAI Mocking

```typescript
// src/lib/ai/__mocks__/client.ts
import { vi } from "vitest";

export const mockOpenAIClient = {
  chat: {
    completions: {
      create: vi.fn(),
    },
  },
};

export const createMockIntentResponse = (intent: Partial<ExtractedIntent>) => ({
  choices: [
    {
      message: {
        content: JSON.stringify({
          occasion: intent.occasion ?? null,
          style: intent.style ?? null,
          category: intent.category ?? null,
          priceRange: intent.priceRange ?? null,
          attributes: intent.attributes ?? {},
          confidence: intent.confidence ?? 0.85,
        }),
      },
    },
  ],
});

// Usage in tests
vi.mock("@/lib/ai/client", () => ({
  getOpenAIClient: () => mockOpenAIClient,
}));

mockOpenAIClient.chat.completions.create.mockResolvedValue(
  createMockIntentResponse({
    occasion: "summer wedding",
    style: "flowy",
    category: "dresses",
    confidence: 0.92,
  })
);
```

#### Saleor GraphQL Mocking

```typescript
// src/lib/search/__tests__/__fixtures__/products.ts
export const mockSearchProducts: AISearchProduct[] = [
  {
    id: "UHJvZHVjdDox",
    name: "Flowing Chiffon Midi Dress",
    slug: "flowing-chiffon-midi-dress",
    thumbnailUrl: "https://example.com/dress1.jpg",
    thumbnailAlt: "Light blue flowing dress",
    price: 89.99,
    currency: "USD",
    categoryName: "Dresses",
  },
  // ... more mock products
];

// Usage
vi.mock("@/lib/graphql", () => ({
  executePublicGraphQL: vi.fn().mockResolvedValue({
    ok: true,
    data: {
      products: {
        edges: mockSearchProducts.map((p) => ({ node: p })),
        totalCount: mockSearchProducts.length,
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    },
  }),
}));
```

#### Cookie/Preference Mocking

```typescript
// Mock next/headers cookies
vi.mock("next/headers", () => ({
  cookies: () => ({
    get: vi.fn((name: string) => {
      if (name === "user_preferences") {
        return { value: JSON.stringify(mockPreferences) };
      }
      return undefined;
    }),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));
```

### 11.4 Test Data Approach

**Fixtures Organization:**

```
src/
├── lib/
│   ├── ai/__tests__/__fixtures__/
│   │   ├── intents.ts           # Sample extracted intents
│   │   ├── queries.ts           # Natural language query examples
│   │   └── openai-responses.ts  # Mock OpenAI API responses
│   │
│   ├── search/__tests__/__fixtures__/
│   │   ├── products.ts          # Sample products for search
│   │   └── search-results.ts    # Complete search results
│   │
│   └── recommendations/__tests__/__fixtures__/
│       ├── similar-products.ts  # Similar product sets
│       └── purchase-history.ts  # Mock user history
```

**Test Query Examples:**

```typescript
// src/lib/ai/__tests__/__fixtures__/queries.ts
export const testQueries = {
  // Happy path - clear intent
  summerWedding: {
    query: "flowy dress for outdoor summer wedding",
    expectedIntent: {
      occasion: "summer wedding",
      style: "flowy, semi-formal",
      category: "dresses",
      confidence: 0.9,
    },
  },
  
  // Gift buying scenario
  giftForTeenager: {
    query: "birthday gift for 16-year-old daughter who loves art and K-pop",
    expectedIntent: {
      recipient: "teenage daughter",
      interests: ["art", "K-pop"],
      occasion: "birthday",
      confidence: 0.85,
    },
  },
  
  // Technical requirements
  laptopBag: {
    query: "laptop bag for 15.6 inch laptop with TSA-friendly design",
    expectedIntent: {
      category: "bags",
      attributes: {
        laptopSize: ["15.6 inch"],
        features: ["TSA-friendly"],
      },
      confidence: 0.88,
    },
  },
  
  // Ambiguous query - should trigger fallback
  ambiguous: {
    query: "something nice",
    expectedIntent: {
      confidence: 0.3, // Low confidence triggers fallback
    },
  },
  
  // Edge case - empty/nonsense
  nonsense: {
    query: "asdfghjkl",
    expectedIntent: {
      confidence: 0.1,
    },
  },
};
```

### 11.5 Test Commands

```bash
# Run all tests in watch mode
pnpm test

# Run tests once (CI mode)
pnpm run test:run

# Run specific test file
pnpm test src/lib/ai/__tests__/intent-extractor.test.ts

# Run tests with coverage
pnpm test --coverage

# Run only AI-related tests
pnpm test --grep "AI|intent|relevance"

# Run integration tests
pnpm test --grep "integration"
```

---

## 12. Documentation Deliverables

### 12.1 Required Documents Table

| Document | Location | Purpose | Owner |
|----------|----------|---------|-------|
| Implementation Plan | `docs/implementation-plan.md` | This document | Architect |
| AI Search README | `docs/ai-search/README.md` | Feature documentation | Dev Lead |
| Integration Guide | `docs/ai-search/INTEGRATION.md` | Migration instructions | Dev Lead |
| API Reference | `docs/ai-search/API.md` | Endpoint documentation | Dev |
| Runbook | `docs/ai-search/RUNBOOK.md` | Operational procedures | DevOps |
| Architecture Decision Record | `docs/adr/001-ai-search-architecture.md` | Design decisions | Architect |

### 12.2 README.md Outline

```markdown
# AI-Powered Product Search & Recommendations

## Overview
Brief description of the AI search feature and its capabilities.

## Features
- Natural language search
- Intent extraction and understanding  
- Relevance scoring with explanations
- Personalized recommendations
- "Find Similar" functionality

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9.4+
- Azure OpenAI access

### Environment Setup
```env
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_DEPLOYMENT=gpt-4o
```

### Running Locally
```bash
pnpm install
pnpm run dev
```

## Architecture
High-level architecture diagram and component overview.

## Configuration
Environment variables and configuration options.

## API Reference
Link to detailed API documentation.

## Testing
How to run tests, coverage requirements.

## Monitoring & Observability
Logging, metrics, and alerting.

## Troubleshooting
Common issues and solutions.

## Contributing
Guidelines for contributing to the feature.
```

### 12.3 INTEGRATION.md Outline

```markdown
# AI Search Integration Guide

## Migration Overview
Steps to integrate AI search into an existing Saleor storefront.

## Prerequisites
- Existing Saleor storefront codebase
- Azure subscription with OpenAI access
- Familiarity with Next.js App Router

## Step-by-Step Integration

### 1. Install Dependencies
```bash
pnpm add openai @azure/identity
```

### 2. Configure Environment Variables
Required environment variables for AI services.

### 3. Add AI Search Provider
How to add the AI provider alongside existing search.

### 4. Update Search Page
Modifications needed for the search page component.

### 5. Add Recommendation Components
Where and how to add recommendation widgets.

### 6. Configure User Preferences
Setting up preference tracking and management.

### 7. Deploy Infrastructure
Using the provided Bicep templates.

## Feature Flags
How to gradually roll out AI features.

## Fallback Behavior
How the system degrades gracefully.

## Performance Considerations
Caching, rate limiting, and optimization tips.

## Security Considerations
API key management, data privacy.

## Customization
Extending prompts, adding new recommendation strategies.

## Support
Where to get help and report issues.
```

---

## 13. Risks & Mitigations

### 13.1 Risks Table

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R1 | Azure OpenAI service unavailable | Low | High | Implement automatic fallback to standard Saleor search; cache recent successful results |
| R2 | AI response latency exceeds 2s target | Medium | Medium | Use smaller model (gpt-4o-mini) for dev; implement streaming responses; add caching layer |
| R3 | Intent extraction returns poor results | Medium | High | Extensive prompt engineering; confidence thresholds; A/B testing with user feedback |
| R4 | Cost overruns from OpenAI API usage | Medium | Medium | Implement rate limiting; cache frequent queries; monitor token usage; set budget alerts |
| R5 | Privacy concerns with user preference tracking | Low | High | GDPR-compliant consent; clear privacy controls; data minimization |
| R6 | Search results don't meet user expectations | Medium | High | Relevance feedback mechanism; continuous prompt refinement; user research |
| R7 | Integration conflicts with existing codebase | Low | Medium | Feature flag rollout; comprehensive testing; incremental deployment |
| R8 | Performance degradation on mobile | Medium | Medium | Mobile-specific optimizations; lazy loading; reduced payload sizes |

### 13.2 Open Questions Table

| ID | Question | Owner | Due Date | Resolution |
|----|----------|-------|----------|------------|
| Q1 | Which Azure region for OpenAI deployment? | DevOps | Week 1 | TBD - needs latency testing |
| Q2 | Should we use embeddings for semantic search? | Architect | Week 2 | TBD - depends on product catalog size |
| Q3 | How long to retain user preference data? | Legal | Week 1 | TBD - needs privacy review |
| Q4 | What is the acceptable false positive rate for recommendations? | Product | Week 3 | TBD - needs user research |
| Q5 | Should "Find Similar" use visual similarity or attribute matching? | Product | Week 2 | TBD - A/B test both approaches |
| Q6 | Rate limit per user for AI-powered searches? | Architect | Week 1 | Propose: 60/minute standard, 10/minute for complex |

### 13.3 Assumptions List

| ID | Assumption | Validated | Notes |
|----|------------|-----------|-------|
| A1 | Azure OpenAI gpt-4o model is available in target region | ❌ | Verify during infrastructure setup |
| A2 | Saleor product data includes sufficient attributes for matching | ❌ | Need to audit current catalog |
| A3 | Users will trust AI-generated recommendations | ❌ | Plan user research validation |
| A4 | 2-second response time is achievable with current architecture | ❌ | Requires load testing |
| A5 | Cookie-based preferences are sufficient (no server-side storage) | ✅ | Per constitution guidelines |
| A6 | Existing UI components can be extended for AI features | ✅ | Verified design token compatibility |
| A7 | Team has Azure OpenAI experience | ❌ | May need training/ramp-up time |

### 13.4 Dependencies Table

| ID | Dependency | Type | Status | Owner | Risk if Delayed |
|----|------------|------|--------|-------|-----------------|
| D1 | Azure OpenAI resource provisioning | Infrastructure | Not Started | DevOps | Blocks all AI development |
| D2 | Saleor API access for expanded product attributes | External | Available | Backend | Limits recommendation quality |
| D3 | Design approval for new UI components | Design | Not Started | Design | Delays UI implementation |
| D4 | Privacy policy update for preference tracking | Legal | Not Started | Legal | Blocks preference features |
| D5 | Budget approval for Azure OpenAI costs | Business | Not Started | PM | Blocks production deployment |
| D6 | Load testing environment | Infrastructure | Available | DevOps | Delays performance validation |

---

## 14. Approval Checklist

### 14.1 Requirements Coverage Checklist

| Requirement | Covered in Plan | Section Reference |
|-------------|-----------------|-------------------|
| Natural language search | ✅ | §6 API Design, §7 UI |
| Intent extraction | ✅ | §4 Architecture, §5 Data Model |
| Relevance scoring | ✅ | §4 Architecture, §6 API |
| Search result explanations | ✅ | §6 API, §7 UI Mockups |
| Query refinements | ✅ | §6 API, §7 UI |
| Find Similar | ✅ | §6 API, §7 UI |
| Homepage recommendations | ✅ | §6 API, §7 UI |
| PDP recommendations | ✅ | §6 API, §7 UI |
| Frequently Bought Together | ✅ | §6 API, §7 UI |
| User preference management | ✅ | §5 Data Model, §6 API |
| Fallback to standard search | ✅ | §4 Architecture, §13 Risks |
| Response time < 2s | ✅ | §2 NFR, §13 Risks |
| Zero-result rate < 1% | ✅ | §2 NFR |

### 14.2 Constitution Compliance Checklist

| Requirement | Compliant | Notes |
|-------------|-----------|-------|
| TypeScript strict mode | ✅ | All new code |
| Server Components by default | ✅ | §7 Component Details |
| Result pattern for errors | ✅ | §6 Error Response Format |
| `@/` path alias | ✅ | §10 File Structure |
| Design tokens | ✅ | §7 UI Components |
| Co-located tests | ✅ | §10 File Structure |
| GraphQL codegen workflow | ✅ | §9 Phase 2 |
| SearchProduct interface | ✅ | Extended per §5 |
| Suspense boundaries | ✅ | §7, §9 Phase 5 |
| pnpm package manager | ✅ | §9 Phase 1 |

### 14.3 Azure Readiness Checklist

| Item | Status | Owner |
|------|--------|-------|
| Azure subscription identified | ⬜ Pending | DevOps |
| Resource group naming convention agreed | ⬜ Pending | DevOps |
| Azure OpenAI quota requested | ⬜ Pending | DevOps |
| Key Vault access policies defined | ⬜ Pending | Security |
| Monitoring and alerting requirements defined | ✅ Complete | §8 Infrastructure |
| Cost estimates reviewed | ⬜ Pending | PM |
| Bicep templates reviewed | ⬜ Pending | DevOps |

### 14.4 Risk Assessment Checklist

| Item | Complete |
|------|----------|
| All P0 risks have mitigations | ✅ |
| Fallback strategy documented | ✅ |
| Performance requirements achievable | ⬜ Needs validation |
| Security considerations addressed | ✅ |
| Privacy requirements identified | ✅ |
| Dependencies identified and tracked | ✅ |

### 14.5 Approval Signatures

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | ⬜ Pending |
| Technical Lead | | | ⬜ Pending |
| Architect | | | ⬜ Pending |
| Security Review | | | ⬜ Pending |
| DevOps Lead | | | ⬜ Pending |

---

## Next Steps

After this plan is approved:

1. **Run `/gen-poc`** to begin implementation based on this plan
2. **Address open questions** (§13.2) before starting dependent phases
3. **Obtain approvals** from all stakeholders (§14.5)
4. **Provision Azure resources** (§8) in development environment
5. **Schedule kickoff meeting** to align team on implementation phases

---

*Implementation plan complete. Generated February 5, 2026.*
