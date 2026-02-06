# Saleor Storefront Technical Constitution

> Generated: February 5, 2026
> Source Repository: saleor/storefront
> Purpose: Enable external development of migration-compatible features
> **Scope:** Feature-specific for "AI-Powered Product Search & Recommendations"

---

## Table of Contents

1. [Project Identity](#1-project-identity)
2. [Technology Stack](#2-technology-stack)
3. [Dependencies](#3-dependencies)
4. [Database & Data Layer](#4-database--data-layer)
5. [API & Integration Patterns](#5-api--integration-patterns)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Infrastructure](#7-infrastructure)
8. [Coding Patterns & Conventions](#8-coding-patterns--conventions)
9. [Testing Strategy](#9-testing-strategy)
10. [CI/CD & DevOps](#10-cicd--devops)
11. [Configuration Management](#11-configuration-management)
12. [Sample Code Patterns](#12-sample-code-patterns)
13. [Migration Contract](#13-migration-contract)
14. [Interface Definitions](#14-interface-definitions)
15. [Enum Definitions](#15-enum-definitions)
16. [Model & DTO Definitions](#16-model--dto-definitions)
17. [Base Class Contracts](#17-base-class-contracts)
18. [Quick Reference](#18-quick-reference)

---

## 1. Project Identity

### 1.1 Project Name and Purpose

**Saleor Storefront** is a production-ready e-commerce storefront built on Next.js that consumes the Saleor GraphQL API. It provides a fast, modern shopping experience with server-side rendering, caching, and progressive enhancement.

### 1.2 Business Domain and Context

- **Domain:** E-commerce / Retail
- **API Backend:** Saleor GraphQL API (headless commerce platform)
- **Multi-channel:** Supports multiple sales channels with different currencies, pricing, and product availability
- **Target Feature:** AI-powered natural language search and personalized product recommendations

### 1.3 Target Users/Consumers

- Shoppers seeking products via natural language queries
- Gift buyers needing guidance-based recommendations  
- Returning customers expecting personalized suggestions
- Mobile users requiring fast, conversational search

### 1.4 Key Features Related to AI Search

| Feature | Current State | AI Enhancement |
|---------|--------------|----------------|
| Product Search | Keyword-based via Saleor API | Natural language understanding |
| Search Results | Simple list with sorting | Relevance scoring with explanations |
| Recommendations | None | Personalized suggestions on PDP/homepage |
| Filtering | Server-side category/price | Intent-based smart filters |

### 1.5 Repository Structure Overview

```
src/
├── app/                    # Next.js App Router pages
│   ├── [channel]/          # Channel-scoped routes
│   │   └── (main)/         # Main layout group
│   │       └── search/     # 🎯 SEARCH PAGE - Primary integration point
│   └── api/                # API routes
├── graphql/                # GraphQL queries (.graphql files)
├── gql/                    # AUTO-GENERATED types (never edit)
├── lib/
│   ├── search/             # 🎯 SEARCH ABSTRACTION - Extend for AI
│   │   ├── index.ts        # Exports searchProducts function
│   │   ├── types.ts        # SearchProduct, SearchResult types
│   │   └── saleor-provider.ts # Current Saleor implementation
│   ├── graphql.ts          # GraphQL execution utilities
│   └── seo/                # SEO utilities
├── ui/components/
│   ├── search-results.tsx  # 🎯 Search results renderer
│   ├── product-list.tsx    # Product grid component
│   ├── plp/                # Product listing page components
│   └── ui/                 # Base UI primitives (Button, Badge, etc.)
├── config/
│   └── locale.ts           # Formatting utilities
└── styles/
    └── brand.css           # CSS custom properties (design tokens)
```

---

## 2. Technology Stack

### 2.1 Languages

| Language | Version | Configuration |
|----------|---------|---------------|
| TypeScript | 5.3.3 | Strict mode enabled |
| JavaScript | ES2022 | Via TypeScript target |

**TypeScript Configuration Highlights:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "moduleResolution": "node",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 2.2 Frameworks & Runtimes

| Framework | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.2 | React framework with App Router |
| React | 19.1.2 | UI library |
| Node.js | >=20 <21 | Runtime (see engines in package.json) |

**Next.js Features Used:**
- **App Router** with file-based routing
- **Server Components** (default for all components)
- **Cache Components** (Partial Prerendering) via `cacheComponents: true`
- **Server Actions** for mutations
- **Suspense boundaries** for streaming

### 2.3 Build Tools

| Tool | Purpose | Command |
|------|---------|---------|
| pnpm | Package manager | `pnpm install` |
| Next.js CLI | Build/Dev | `pnpm run build` / `pnpm run dev` |
| GraphQL Codegen | Type generation | `pnpm run generate` |
| Vitest | Testing | `pnpm test` |

---

## 3. Dependencies

### 3.1 Third-Party Libraries (Feature-Relevant)

#### Core Dependencies

| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `next` | 16.1.2 | React framework | MIT |
| `react` | ^19.1.2 | UI library | MIT |
| `graphql-tag` | 2.12.6 | GraphQL parsing | MIT |
| `urql` | 4.0.6 | GraphQL client (checkout only) | MIT |

#### UI Components

| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `@radix-ui/react-dialog` | 1.1.15 | Modal dialogs | MIT |
| `@radix-ui/react-dropdown-menu` | 2.1.16 | Dropdown menus | MIT |
| `lucide-react` | 0.358.0 | Icons | ISC |
| `clsx` | 2.1.0 | Class name utility | MIT |
| `tailwind-merge` | 3.4.0 | Tailwind class deduplication | MIT |

#### Image Handling

| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `embla-carousel-react` | 8.6.0 | Image carousels | MIT |
| `sharp` | 0.33.2 | Image processing | Apache-2.0 |

### 3.2 Packages for AI Integration (Recommended)

These are NOT in the current codebase. Feature implementation should add:

| Package | Purpose | Notes |
|---------|---------|-------|
| OpenAI SDK or Azure OpenAI | LLM for intent parsing | Configure API key server-side |
| Vector DB client | Semantic search | Optional: Pinecone, Weaviate, Milvus |

---

## 4. Database & Data Layer

### 4.1 Database Technology

This storefront is **headless** — it does NOT have its own database. All data comes from:

- **Saleor GraphQL API** — Product catalog, pricing, inventory, user data
- **Browser Storage** — Cart state (via cookies/localStorage)
- **Session Cookies** — Authentication tokens

### 4.2 Data Access Pattern

```
┌─────────────────┐         ┌──────────────────┐
│  Next.js Server │ ──────► │ Saleor GraphQL   │
│  (Server Comp.) │◄─────── │ API              │
└─────────────────┘         └──────────────────┘
         │
         ▼
┌─────────────────┐
│ AI Service      │  ◄── NEW: For semantic search/recommendations
│ (Azure OpenAI)  │
└─────────────────┘
```

### 4.3 Schema Documentation (Saleor Entities)

#### Entity: Product

```
Description: A sellable item in the catalog
Key Fields:
  - id: ID! - Global Saleor ID
  - name: String! - Product name
  - slug: String! - URL-safe identifier
  - description: JSONString - EditorJS-formatted content
  - category: Category - Single category relationship
  - pricing: ProductPricingInfo - Price range with discounts
  - variants: [ProductVariant!]! - Purchasable variants
  - attributes: [SelectedAttribute!]! - Product-level attributes
  - thumbnail(size, format): Image - Optimized thumbnail
  - media: [ProductMedia!]! - All product images
```

#### Entity: ProductVariant

```
Description: A specific purchasable configuration (size/color combo)
Key Fields:
  - id: ID! - Variant ID (used for cart operations)
  - name: String! - Variant name
  - sku: String - Stock keeping unit
  - pricing: VariantPricingInfo - Variant-specific pricing
  - attributes: [SelectedAttribute!]! - Variant attributes (size, color)
  - quantityAvailable: Int - Stock level
```

#### Entity: Category

```
Description: Product category for navigation
Key Fields:
  - id: ID!
  - name: String!
  - slug: String!
  - level: Int! - Hierarchy level (0 = root)
  - parent: Category - Parent category
  - children: [Category!]! - Child categories
```

---

## 5. API & Integration Patterns

### 5.1 API Style

- **GraphQL** — All Saleor API communication
- **No REST** — Storefront doesn't expose REST endpoints
- **Server-side execution** — GraphQL runs in Server Components

### 5.2 GraphQL Execution Pattern

Two explicit functions ensure auth clarity:

```typescript
import { executePublicGraphQL, executeAuthenticatedGraphQL } from "@/lib/graphql";

// Public data (products, categories, search)
const result = await executePublicGraphQL(ProductDetailsDocument, {
  variables: { slug: "blue-shirt", channel: "default-channel" },
  revalidate: 300, // Cache for 5 minutes
});

// User data (requires session cookies)
const result = await executeAuthenticatedGraphQL(CurrentUserDocument, {
  cache: "no-cache",
});
```

### 5.3 Result Type Pattern

All GraphQL functions return a **Result type** (not exceptions):

```typescript
type GraphQLResult<T> = 
  | { ok: true; data: T }
  | { ok: false; error: GraphQLError };

// Usage
const result = await executePublicGraphQL(SearchProductsDocument, { variables });
if (!result.ok) {
  console.error(result.error.message);
  return <ErrorState />;
}
const { products } = result.data;
```

### 5.4 Search API Contract

The search module in `src/lib/search/` is designed for provider swapping:

```typescript
// Current: Saleor native search
// Future: AI-enhanced search

export async function searchProducts(options: SearchOptions): Promise<SearchResult> {
  // Implementation details hidden
}
```

---

## 6. Authentication & Authorization

### 6.1 Authentication Mechanism

- **Saleor Auth SDK** (`@saleor/auth-sdk`)
- **JWT tokens** stored in HTTP-only cookies
- **Automatic refresh** via auth client

### 6.2 Server-Side Auth

```typescript
// src/lib/auth/server.ts
import { getServerAuthClient } from "@/lib/auth/server";

const authClient = await getServerAuthClient();
const response = await authClient.fetchWithAuth(url, init);
```

### 6.3 Mocking Auth for Feature Development

For isolated development without Saleor backend:

```typescript
// Mock the auth module
vi.mock("@/lib/auth/server", () => ({
  getServerAuthClient: () => ({
    fetchWithAuth: (url, init) => fetch(url, init),
  }),
}));
```

### 6.4 Permission Model

- **Public queries:** Products, categories, search — no auth required
- **User queries:** Order history, addresses — requires valid session
- **Checkout mutations:** Add to cart, payment — requires session cookies

---

## 7. Infrastructure

### 7.1 Cloud/Hosting

| Service | Purpose |
|---------|---------|
| **Saleor Cloud** | GraphQL API backend |
| **Any Next.js host** | Storefront (Vercel, Netlify, Docker) |
| **Azure OpenAI** | Recommended for AI features |

### 7.2 Environment Strategy

```
Development  →  Local Next.js + Saleor Cloud sandbox
Staging      →  Preview deployment + Saleor staging
Production   →  Production host + Saleor production
```

### 7.3 Required Environment Variables

```env
# REQUIRED
NEXT_PUBLIC_SALEOR_API_URL=https://your-instance.saleor.cloud/graphql/
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel

# OPTIONAL
NEXT_PUBLIC_STOREFRONT_URL=https://your-storefront.com
REVALIDATE_SECRET=your-secret-for-cache-invalidation

# FOR AI FEATURES (NEW)
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_DEPLOYMENT=gpt-4o
```

---

## 8. Coding Patterns & Conventions

### 8.1 Architecture Patterns

- **Server Components by default** — Only add `"use client"` when needed
- **Feature-based organization** — Components grouped by feature, not layer
- **Swappable providers** — Search module designed for easy replacement

### 8.2 File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | kebab-case | `search-results.tsx` |
| Utilities | kebab-case | `filter-utils.ts` |
| GraphQL queries | PascalCase | `SearchProducts.graphql` |
| Types | PascalCase | `SearchProduct` |
| Test files | `.test.ts` suffix | `filter-utils.test.ts` |

### 8.3 Component Patterns

**Server Component (default):**
```tsx
// No directive needed — this is a Server Component
export async function SearchResults({ query }: { query: string }) {
  const result = await searchProducts({ query, channel: "default" });
  return <ul>{result.products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

**Client Component (explicit):**
```tsx
"use client";

import { useState } from "react";

export function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSearch(value)}
    />
  );
}
```

### 8.4 Error Handling

**Result pattern (preferred):**
```typescript
const result = await executePublicGraphQL(Document, { variables });
if (!result.ok) {
  // Handle error explicitly
  return { products: [], error: result.error.message };
}
return { products: result.data.products };
```

### 8.5 Import Path Aliases

```typescript
// Use @ alias for src/
import { searchProducts } from "@/lib/search";
import { Button } from "@/ui/components/ui/button";
import type { SearchProduct } from "@/lib/search/types";
```

---

## 9. Testing Strategy

### 9.1 Test Framework

| Tool | Version | Purpose |
|------|---------|---------|
| Vitest | 4.0.17 | Unit/integration testing |
| Node environment | - | Default test environment |

**Configuration (`vitest.config.ts`):**
```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,           // No need for explicit imports
    environment: "node",     // Server-side testing
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 9.2 Test File Organization

```
src/
├── ui/components/
│   ├── plp/
│   │   ├── filter-utils.ts
│   │   ├── filter-utils.test.ts    ← Co-located test
│   │   └── __fixtures__/           ← Test fixtures
│   │       └── products.ts
```

### 9.3 Test Patterns

**Mocking Server-Only Modules:**
```typescript
import { describe, it, expect, vi } from "vitest";

// Mock server-only imports FIRST
vi.mock("@/lib/graphql", () => ({
  executePublicGraphQL: vi.fn(),
}));

// Then import the module under test
import { searchProducts } from "./search-provider";
```

**Testing Pure Functions:**
```typescript
describe("buildFilterVariables", () => {
  it("returns undefined when no filters provided", () => {
    expect(buildFilterVariables({})).toBeUndefined();
  });

  it("builds category filter from IDs", () => {
    const result = buildFilterVariables({ categoryIds: ["cat-1", "cat-2"] });
    expect(result).toEqual({ categories: ["cat-1", "cat-2"] });
  });
});
```

**Testing with Fixtures:**
```typescript
import { sampleProducts } from "./__fixtures__/products";

describe("extractCategoryOptions", () => {
  it("extracts unique categories with counts", () => {
    const result = extractCategoryOptions(sampleProducts);
    expect(result).toHaveLength(4);
    expect(result.find(c => c.slug === "t-shirts")?.count).toBe(2);
  });
});
```

### 9.4 Test Commands

```bash
pnpm test          # Watch mode
pnpm run test:run  # Single run (CI)
```

---

## 10. CI/CD & DevOps

### 10.1 Quality Gates

| Check | Command | When |
|-------|---------|------|
| Type check | `pnpm exec tsc --noEmit` | Pre-commit, CI |
| Lint | `pnpm run lint` | Pre-commit, CI |
| Build | `pnpm run build` | CI |
| Test | `pnpm run test:run` | CI |

### 10.2 GraphQL Type Generation

**CRITICAL:** After modifying ANY `.graphql` file:

```bash
# Storefront queries (src/graphql/)
pnpm run generate

# Checkout queries (src/checkout/graphql/)
pnpm run generate:checkout

# Both at once
pnpm run generate:all
```

### 10.3 Pre-commit Hooks

The project uses Husky + lint-staged:

```bash
# Runs automatically on commit
pnpm run lint:fix
```

---

## 11. Configuration Management

### 11.1 Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_SALEOR_API_URL` | ✅ Yes | - | Saleor GraphQL endpoint |
| `NEXT_PUBLIC_DEFAULT_CHANNEL` | ✅ Yes | - | Default sales channel slug |
| `NEXT_PUBLIC_STOREFRONT_URL` | No | - | Canonical URL for SEO |
| `REVALIDATE_SECRET` | No | - | Cache invalidation secret |
| `SALEOR_APP_TOKEN` | No | - | Server-side channels query |

### 11.2 Configuration Files

| File | Purpose |
|------|---------|
| `src/config/locale.ts` | Locale, currency formatting |
| `src/app/config.ts` | Products per page, default channel |
| `src/styles/brand.css` | Design tokens (CSS variables) |
| `tailwind.config.cjs` | Tailwind theme configuration |

### 11.3 Design Tokens (CSS Variables)

```css
:root {
  /* Backgrounds */
  --background: oklch(0.98 0.005 90);
  --card: oklch(1 0 0);
  --muted: oklch(0.94 0.003 90);
  
  /* Text Colors */
  --foreground: oklch(0.12 0 0);
  --muted-foreground: oklch(0.45 0 0);
  
  /* Primary (CTA) */
  --primary: oklch(0.12 0 0);
  --primary-foreground: oklch(0.98 0 0);
  
  /* Borders & Radius */
  --border: oklch(0.9 0.003 90);
  --radius: 0.5rem;
}
```

---

## 12. Sample Code Patterns

### 12.1 Search Provider Implementation

This is the pattern for implementing search. **Extend this for AI search:**

```typescript
// src/lib/search/saleor-provider.ts

import { executePublicGraphQL } from "@/lib/graphql";
import { SearchProductsDocument, OrderDirection, ProductOrderField } from "@/gql/graphql";
import type { SearchProduct, SearchResult, SearchPagination } from "./types";
import { localeConfig } from "@/config/locale";

interface SearchOptions {
  query: string;
  channel: string;
  limit?: number;
  cursor?: string;
  direction?: "forward" | "backward";
  sortBy?: "relevance" | "price-asc" | "price-desc" | "name" | "newest";
}

/**
 * Search products using Saleor's GraphQL API.
 * Replace this implementation for AI-powered search.
 */
export async function searchProducts(options: SearchOptions): Promise<SearchResult> {
  const { 
    query, 
    channel, 
    limit = 20, 
    cursor, 
    direction = "forward", 
    sortBy = "relevance" 
  } = options;

  const { field, order } = mapSortToSaleor(sortBy);
  const isBackward = direction === "backward" && cursor;

  const result = await executePublicGraphQL(SearchProductsDocument, {
    variables: {
      search: query,
      channel,
      sortBy: field,
      sortDirection: order,
      first: isBackward ? undefined : limit,
      after: isBackward ? undefined : cursor,
      last: isBackward ? limit : undefined,
      before: isBackward ? cursor : undefined,
    },
    revalidate: 60,
  });

  if (!result.ok || !result.data.products) {
    return { products: [], pagination: { totalCount: 0 } };
  }

  const products = result.data.products;

  // Transform to common SearchProduct format
  const searchProducts: SearchProduct[] = products.edges.map(({ node }) => ({
    id: node.id,
    name: node.name,
    slug: node.slug,
    thumbnailUrl: node.thumbnail?.url,
    thumbnailAlt: node.thumbnail?.alt,
    price: node.pricing?.priceRange?.start?.gross.amount ?? 0,
    currency: node.pricing?.priceRange?.start?.gross.currency ?? localeConfig.fallbackCurrency,
    categoryName: node.category?.name,
  }));

  const pagination: SearchPagination = {
    totalCount: products.totalCount ?? 0,
    hasNextPage: products.pageInfo.hasNextPage,
    hasPreviousPage: products.pageInfo.hasPreviousPage,
    nextCursor: products.pageInfo.endCursor ?? undefined,
    prevCursor: products.pageInfo.startCursor ?? undefined,
  };

  return { products: searchProducts, pagination };
}

function mapSortToSaleor(sortBy: SearchOptions["sortBy"]): {
  field: ProductOrderField;
  order: OrderDirection;
} {
  switch (sortBy) {
    case "price-asc":
      return { field: ProductOrderField.MinimalPrice, order: OrderDirection.Asc };
    case "price-desc":
      return { field: ProductOrderField.MinimalPrice, order: OrderDirection.Desc };
    case "name":
      return { field: ProductOrderField.Name, order: OrderDirection.Asc };
    case "newest":
      return { field: ProductOrderField.Date, order: OrderDirection.Desc };
    case "relevance":
    default:
      return { field: ProductOrderField.Rating, order: OrderDirection.Desc };
  }
}
```

### 12.2 Search Results Component

```typescript
// src/ui/components/search-results.tsx

import Link from "next/link";
import Image from "next/image";
import type { SearchProduct } from "@/lib/search";
import { localeConfig } from "@/config/locale";

interface SearchResultsProps {
  products: SearchProduct[];
  channel: string;
}

/**
 * Renders search results from any search provider.
 * Uses the common SearchProduct type for provider independence.
 */
export function SearchResults({ products, channel }: SearchResultsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <ul role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <li key={product.id}>
          <SearchResultCard product={product} channel={channel} priority={index < 2} />
        </li>
      ))}
    </ul>
  );
}

function SearchResultCard({
  product,
  channel,
  priority,
}: {
  product: SearchProduct;
  channel: string;
  priority?: boolean;
}) {
  const formattedPrice = new Intl.NumberFormat(localeConfig.default, {
    style: "currency",
    currency: product.currency,
  }).format(product.price);

  return (
    <Link
      href={`/${channel}/products/${product.slug}`}
      className="hover:border-foreground/20 group block overflow-hidden rounded-lg border border-border bg-card transition-colors"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.thumbnailAlt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        {product.categoryName && (
          <p className="mb-1 text-xs text-muted-foreground">{product.categoryName}</p>
        )}
        <h3 className="font-medium leading-tight text-foreground group-hover:underline">
          {product.name}
        </h3>
        <p className="mt-2 font-semibold text-foreground">{formattedPrice}</p>
      </div>
    </Link>
  );
}
```

### 12.3 Search Page (Server Component)

```typescript
// src/app/[channel]/(main)/search/page.tsx

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { searchProducts } from "@/lib/search";
import { SearchResults } from "@/ui/components/search-results";
import { Pagination } from "@/ui/components/pagination";

export const metadata = {
  title: "Search products · Saleor Storefront",
  description: "Search products in Saleor Storefront",
};

type SearchParams = {
  query?: string | string[];
  cursor?: string | string[];
  direction?: string | string[];
  sort?: string | string[];
};

/**
 * Search page with Cache Components.
 * Static shell renders immediately, search results stream in.
 */
export default function Page(props: {
  searchParams: Promise<SearchParams>;
  params: Promise<{ channel: string }>;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<SearchSkeleton />}>
        <SearchContent searchParams={props.searchParams} params={props.params} />
      </Suspense>
    </section>
  );
}

async function SearchContent({
  searchParams: searchParamsPromise,
  params: paramsPromise,
}: {
  searchParams: Promise<SearchParams>;
  params: Promise<{ channel: string }>;
}) {
  const [searchParams, params] = await Promise.all([searchParamsPromise, paramsPromise]);

  const queryParam = searchParams.query;
  if (!queryParam) {
    notFound();
  }

  const query = Array.isArray(queryParam) ? queryParam.find(v => v.length > 0) : queryParam;
  if (!query) {
    notFound();
  }

  const cursor = Array.isArray(searchParams.cursor) 
    ? searchParams.cursor[0] 
    : searchParams.cursor;
  const direction = searchParams.direction === "backward" ? "backward" : "forward";

  const result = await searchProducts({
    query,
    channel: params.channel,
    limit: 20,
    cursor,
    direction,
  });

  const { products, pagination } = result;

  if (pagination.totalCount === 0) {
    return <EmptyState query={query} channel={params.channel} />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Results for "{query}"</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {pagination.totalCount} {pagination.totalCount === 1 ? "product" : "products"} found
        </p>
      </div>

      <SearchResults products={products} channel={params.channel} />

      {(pagination.hasNextPage || pagination.hasPreviousPage) && (
        <Pagination
          pageInfo={{
            hasNextPage: pagination.hasNextPage ?? false,
            hasPreviousPage: pagination.hasPreviousPage ?? false,
            startCursor: pagination.prevCursor,
            endCursor: pagination.nextCursor,
          }}
        />
      )}
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="animate-skeleton-delayed opacity-0">
      <div className="mb-8">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-lg border border-border bg-card">
            <div className="aspect-square bg-muted" />
            <div className="p-4">
              <div className="mb-1 h-3 w-16 rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="mt-2 h-4 w-20 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ query, channel }: { query: string; channel: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-2xl font-semibold">No results for "{query}"</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Try a different term or browse our categories.
      </p>
    </div>
  );
}
```

---

## 13. Migration Contract

### 13.1 What Must Match Exactly

| Element | Requirement |
|---------|-------------|
| **Search function signature** | `searchProducts(options: SearchOptions): Promise<SearchResult>` |
| **SearchProduct type** | All fields in Section 14 interface |
| **Component file locations** | `src/lib/search/`, `src/ui/components/` |
| **Tailwind class conventions** | Use design tokens (`bg-card`, `text-foreground`, etc.) |
| **Result pattern** | Return `{ ok, data }` or `{ ok: false, error }` |
| **GraphQL type generation** | Run `pnpm run generate` after `.graphql` changes |

### 13.2 What Will Be Replaced During Migration

| Element | Replacement |
|---------|-------------|
| **AI service client** | Customer's Azure OpenAI configuration |
| **Vector database client** | Customer's vector DB (if used) |
| **Environment variables** | Customer's API keys and endpoints |
| **Test fixtures** | Customer's product data |

### 13.3 What Can Differ

- AI prompt engineering and model selection
- Recommendation algorithm logic
- Additional AI-specific UI components (as long as they use design tokens)
- Server Actions for AI operations

### 13.4 Required Interfaces to Implement

| Interface | Location | Purpose |
|-----------|----------|---------|
| `SearchProduct` | Section 14 | Search result item |
| `SearchResult` | Section 14 | Search response container |
| `SearchPagination` | Section 14 | Pagination info |

### 13.5 Extension Points for AI Features

```typescript
// src/lib/search/ai-provider.ts (NEW FILE)
import type { SearchProduct, SearchResult } from "./types";

interface AISearchOptions {
  naturalLanguageQuery: string;  // User's conversational input
  channel: string;
  limit?: number;
  userContext?: {
    browseHistory?: string[];    // Recent product IDs
    purchaseHistory?: string[];  // Past purchases
  };
}

interface AISearchResult extends SearchResult {
  // AI-specific additions
  intentExplanation?: string;     // "Looking for summer wedding attire"
  suggestedRefinements?: string[]; // "More formal", "In blue"
  products: AISearchProduct[];
}

interface AISearchProduct extends SearchProduct {
  // AI-specific additions
  relevanceScore?: number;        // 0-1 confidence
  matchReason?: string;           // "Matches 'outdoor wedding' context"
}

export async function aiSearchProducts(options: AISearchOptions): Promise<AISearchResult> {
  // Your AI implementation here
}
```

---

## 14. Interface Definitions

### SearchProduct

```typescript
/**
 * Minimal product type for rendering search results.
 * Transform your search engine's response to this format for the UI.
 */
export interface SearchProduct {
  /** Saleor product ID (base64 encoded) */
  id: string;
  
  /** Display name of the product */
  name: string;
  
  /** URL-safe slug for routing */
  slug: string;
  
  /** Thumbnail image URL (optimized) */
  thumbnailUrl?: string | null;
  
  /** Alt text for thumbnail */
  thumbnailAlt?: string | null;
  
  /** Starting price amount (number, not formatted) */
  price: number;
  
  /** ISO 4217 currency code (e.g., "USD", "EUR") */
  currency: string;
  
  /** Category name for display */
  categoryName?: string | null;
  
  /** Optional: for highlighting matched text */
  highlights?: {
    name?: string;
    description?: string;
  };
  
  /** Optional: search relevance score (0-1) */
  score?: number;
  
  /** Pass-through for provider-specific data */
  _raw?: unknown;
}
```

### SearchPagination

```typescript
/**
 * Basic pagination info that most providers can supply.
 */
export interface SearchPagination {
  /** Total matching results */
  totalCount: number;
  
  /** Current page (1-indexed) */
  page?: number;
  
  /** Total pages */
  totalPages?: number;
  
  /** For cursor-based pagination */
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  nextCursor?: string;
  prevCursor?: string;
}
```

### SearchFacet

```typescript
/**
 * Facet/filter option returned by search.
 */
export interface SearchFacet {
  /** Field name (e.g., "category", "color", "price") */
  field: string;
  
  /** Available values with counts */
  values: Array<{
    value: string;
    count: number;
    selected?: boolean;
  }>;
}
```

### SearchResult

```typescript
/**
 * Search result container.
 */
export interface SearchResult<T = SearchProduct> {
  /** Matched products */
  products: T[];
  
  /** Pagination information */
  pagination: SearchPagination;
  
  /** Facets/filters if provider supports them */
  facets?: SearchFacet[];
  
  /** Query timing in milliseconds */
  queryTimeMs?: number;
  
  /** Provider-specific metadata */
  meta?: Record<string, unknown>;
}
```

### GraphQLResult

```typescript
/**
 * Result type for all GraphQL operations.
 */
export interface GraphQLSuccess<T> {
  ok: true;
  data: T;
}

export interface GraphQLFailure {
  ok: false;
  error: GraphQLError;
}

export type GraphQLResult<T> = GraphQLSuccess<T> | GraphQLFailure;

export interface GraphQLError {
  type: "network" | "http" | "graphql" | "validation";
  message: string;
  statusCode?: number;
  isRetryable: boolean;
  cause?: unknown;
  validationErrors?: ReadonlyArray<{
    field?: string | null;
    message: string;
    code?: string | null;
  }>;
}
```

### ButtonProps

```typescript
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline-solid" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}
```

### BadgeProps

```typescript
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline-solid";
}
```

---

## 15. Enum Definitions

### ProductOrderField

```typescript
/**
 * Saleor product sorting fields.
 * AUTO-GENERATED - Do not edit. These come from Saleor API schema.
 */
export enum ProductOrderField {
  /** Sort by collection order (when in collection context) */
  Collection = "COLLECTION",
  
  /** Sort by creation date */
  Date = "DATE",
  
  /** Sort by last modification date */
  LastModified = "LAST_MODIFIED",
  
  /** Sort by last modified at (alias) */
  LastModifiedAt = "LAST_MODIFIED_AT",
  
  /** Sort by minimum variant price */
  MinimalPrice = "MINIMAL_PRICE",
  
  /** Sort by product name */
  Name = "NAME",
  
  /** Sort by price (alias for MinimalPrice) */
  Price = "PRICE",
  
  /** Sort by publication date */
  PublicationDate = "PUBLICATION_DATE",
  
  /** Sort by published date (alias) */
  Published = "PUBLISHED",
  
  /** Sort by published at (alias) */
  PublishedAt = "PUBLISHED_AT",
  
  /** Sort by product ranking/rating */
  Rank = "RANK",
  
  /** Sort by rating */
  Rating = "RATING",
  
  /** Sort by product type */
  Type = "TYPE",
}
```

### OrderDirection

```typescript
/**
 * Sort order direction.
 */
export enum OrderDirection {
  /** Ascending order (A-Z, 0-9, oldest first) */
  Asc = "ASC",
  
  /** Descending order (Z-A, 9-0, newest first) */
  Desc = "DESC",
}
```

### SortOption (Custom - for UI)

```typescript
/**
 * UI-friendly sort options for the search/filter interface.
 */
export type SortOption = 
  | "featured"    // Default/relevance (no server sort)
  | "newest"      // DATE DESC
  | "price_asc"   // PRICE ASC
  | "price_desc"  // PRICE DESC
  | "bestselling" // RATING DESC
  | "relevance";  // For AI search results
```

### GraphQLErrorType

```typescript
/**
 * Error categories for GraphQL operations.
 * Ordered by occurrence in the request lifecycle.
 */
export type GraphQLErrorType = 
  | "network"     // Failed to reach server
  | "http"        // Server responded with error status
  | "graphql"     // Query/mutation syntax errors
  | "validation"; // Saleor domain errors
```

### ButtonVariant

```typescript
/**
 * Button style variants matching the design system.
 */
export type ButtonVariant = 
  | "default"       // Primary CTA - dark bg, light text
  | "secondary"     // Secondary - light bg, dark text
  | "outline-solid" // Bordered - transparent bg with border
  | "ghost"         // Minimal - no bg until hover
  | "destructive";  // Danger - red bg
```

### BadgeVariant

```typescript
/**
 * Badge style variants.
 */
export type BadgeVariant = 
  | "default"       // Primary badge
  | "secondary"     // Muted badge
  | "destructive"   // Error/sale badge
  | "outline-solid"; // Bordered badge
```

---

## 16. Model & DTO Definitions

### ProductListItemFragment

```typescript
/**
 * Product data for list/grid views.
 * Matches GraphQL fragment: ProductListItem
 */
export interface ProductListItemFragment {
  id: string;
  name: string;
  slug: string;
  created: string;  // ISO 8601 datetime
  
  pricing: {
    priceRange: {
      start: {
        gross: { amount: number; currency: string };
      } | null;
      stop: {
        gross: { amount: number; currency: string };
      } | null;
    } | null;
    priceRangeUndiscounted: {
      start: {
        gross: { amount: number; currency: string };
      } | null;
      stop: {
        gross: { amount: number; currency: string };
      } | null;
    } | null;
  } | null;
  
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  
  thumbnail: {
    url: string;
    alt: string | null;
  } | null;
  
  variants: Array<{
    id: string;
    selectionAttributes: Array<{
      attribute: {
        slug: string;
        name: string;
      };
      values: Array<{
        name: string | null;
        value: string | null;
      }>;
    }>;
  }> | null;
}
```

### ProductDetailsFragment

```typescript
/**
 * Full product data for detail page.
 * Matches GraphQL query: ProductDetails
 */
export interface ProductDetailsFragment {
  id: string;
  name: string;
  slug: string;
  description: string | null;  // JSONString (EditorJS format)
  seoTitle: string | null;
  seoDescription: string | null;
  
  thumbnail: {
    url: string;
    alt: string | null;
  } | null;
  
  media: Array<{
    url: string;
    alt: string | null;
    type: "IMAGE" | "VIDEO";
  }>;
  
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  
  attributes: Array<{
    values: Array<{ name: string | null }>;
    attribute: {
      name: string;
      slug: string;
    };
  }>;
  
  variants: VariantDetailsFragment[];
  
  pricing: {
    priceRange: {
      start: {
        gross: { amount: number; currency: string };
      } | null;
      stop: {
        gross: { amount: number; currency: string };
      } | null;
    } | null;
  } | null;
}
```

### VariantDetailsFragment

```typescript
/**
 * Product variant details.
 * Used in product detail page and cart.
 */
export interface VariantDetailsFragment {
  id: string;
  name: string;
  sku: string | null;
  
  quantityAvailable: number | null;
  quantityLimitPerCustomer: number | null;
  
  pricing: {
    price: {
      gross: { amount: number; currency: string };
    } | null;
    priceUndiscounted: {
      gross: { amount: number; currency: string };
    } | null;
  } | null;
  
  attributes: Array<{
    attribute: {
      slug: string;
      name: string;
    };
    values: Array<{
      name: string | null;
      value: string | null;
    }>;
  }>;
  
  media: Array<{
    url: string;
    alt: string | null;
  }> | null;
}
```

### CategoryOption (Filter UI)

```typescript
/**
 * Category option for filter dropdowns.
 */
export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  count: number;  // Products in this category
}
```

### ColorOption (Filter UI)

```typescript
/**
 * Color option for filter UI.
 */
export interface ColorOption {
  name: string;
  hex?: string;  // CSS color code
  count: number; // Products with this color
}
```

### SizeOption (Filter UI)

```typescript
/**
 * Size option for filter UI.
 */
export interface SizeOption {
  name: string;  // "S", "M", "L", "10", "32x30"
  count: number; // Products with this size
}
```

### ActiveFilter (Filter UI State)

```typescript
/**
 * Active filter for display in filter bar.
 */
export interface ActiveFilter {
  key: "color" | "size" | "price" | "category";
  label: string;  // Display label
  value: string;  // Filter value
}
```

### PriceRange (Filter)

```typescript
/**
 * Price range option for filtering.
 */
export interface PriceRangeOption {
  label: string;  // "Under $50", "$50 - $100"
  value: string;  // "0-50", "50-100", "200-" (open-ended)
  count: number;
}
```

---

## 17. Base Class Contracts

This storefront uses **functional components and functions** rather than class-based inheritance. However, there are key **utility functions and patterns** that serve as base contracts:

### GraphQL Execution Functions

```typescript
/**
 * Execute a GraphQL query for public data (no user authentication).
 *
 * Use this for:
 * - Product queries (listings, details, search)
 * - Category/collection queries
 * - Menu queries
 * - Any public storefront data
 *
 * @param operation - Typed document from codegen
 * @param options - Variables, cache settings
 * @returns Result type - check `result.ok` before accessing `result.data`
 */
export async function executePublicGraphQL<Result, Variables>(
  operation: TypedDocumentString<Result, Variables>,
  options: {
    variables?: Variables;
    headers?: HeadersInit;
    cache?: RequestCache;
    revalidate?: number;
  },
): Promise<GraphQLResult<Result>>;

/**
 * Execute a GraphQL query/mutation with user authentication.
 *
 * Use this for:
 * - CurrentUser queries (me, orders, addresses)
 * - Checkout mutations (add to cart, update lines)
 * - Any query that returns user-specific data
 */
export async function executeAuthenticatedGraphQL<Result, Variables>(
  operation: TypedDocumentString<Result, Variables>,
  options: {
    variables?: Variables;
    headers?: HeadersInit;
    cache?: RequestCache;
    revalidate?: number;
  },
): Promise<GraphQLResult<Result>>;
```

### Utility Function: cn (Class Name Merger)

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with clsx and tailwind-merge.
 * Properly deduplicates and resolves Tailwind conflicts.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-primary", className)
 * // Properly handles: cn("p-4", "p-2") → "p-2"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### Utility Function: formatPrice

```typescript
import { localeConfig } from "@/config/locale";

/**
 * Format a price with the configured locale.
 *
 * @param amount - Numeric amount
 * @param currency - ISO 4217 currency code
 * @returns Formatted string like "$29.99" or "€25,00"
 */
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat(localeConfig.default, {
    style: "currency",
    currency: currency,
  }).format(amount);
}
```

### Utility Function: formatMoneyRange

```typescript
/**
 * Format a price range for display.
 * Handles same start/stop, missing values.
 *
 * @returns "$29.99" or "$29.99 - $59.99"
 */
export function formatMoneyRange(
  range: {
    start?: { amount: number; currency: string } | null;
    stop?: { amount: number; currency: string } | null;
  } | null,
): string | undefined;
```

### Search Provider Pattern

```typescript
/**
 * Search provider interface (implicit contract).
 * Any search provider must export a function matching this signature
 * from `src/lib/search/index.ts`.
 */

interface SearchProviderContract {
  /**
   * Search for products.
   *
   * @param options - Search parameters
   * @returns Promise resolving to SearchResult
   */
  searchProducts(options: {
    query: string;
    channel: string;
    limit?: number;
    cursor?: string;
    direction?: "forward" | "backward";
    sortBy?: "relevance" | "price-asc" | "price-desc" | "name" | "newest";
  }): Promise<SearchResult>;
}
```

### React Component Pattern

```typescript
/**
 * Standard Server Component pattern.
 * Data fetching happens in the component, not in parent.
 */
interface ServerComponentPattern<Props> {
  (props: Props): Promise<JSX.Element>;
}

/**
 * Standard Client Component pattern.
 * Must start with "use client" directive.
 */
interface ClientComponentPattern<Props> {
  (props: Props): JSX.Element;
}

// Example: Suspense boundary pattern
function PageWithSuspense() {
  return (
    <Suspense fallback={<Skeleton />}>
      <AsyncContent />
    </Suspense>
  );
}

async function AsyncContent() {
  const data = await fetchData();  // Suspends here
  return <Display data={data} />;
}
```

---

## 18. Quick Reference

### Technology Versions

| Component | Version |
|-----------|---------|
| TypeScript | 5.3.3 |
| Next.js | 16.1.2 |
| React | ^19.1.2 |
| Node.js | >=20 <21 |
| pnpm | >=9.4.0 |
| Vitest | 4.0.17 |
| Tailwind CSS | 3.4.19 |

### Critical Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Component files | kebab-case | `search-results.tsx` |
| Component functions | PascalCase | `SearchResults` |
| Utility files | kebab-case | `filter-utils.ts` |
| Utility functions | camelCase | `formatPrice` |
| GraphQL files | PascalCase | `SearchProducts.graphql` |
| Type/Interface | PascalCase | `SearchProduct` |
| Test files | `.test.ts` suffix | `filter-utils.test.ts` |
| CSS variables | kebab-case | `--background` |

### Must-Follow Rules

1. **Run `pnpm run generate`** after modifying ANY `.graphql` file
2. **Server Components are default** — only add `"use client"` when needed
3. **Use Result pattern** for GraphQL — check `result.ok` before accessing data
4. **Use design tokens** — `bg-card`, `text-foreground`, not hardcoded colors
5. **Use `@/` path alias** for all imports from `src/`
6. **Handle nullable fields** with optional chaining: `product.category?.name`
7. **Suspense boundaries** around async Server Components for streaming

### File Locations

| Purpose | Path |
|---------|------|
| Search abstraction | `src/lib/search/` |
| Search types | `src/lib/search/types.ts` |
| GraphQL execution | `src/lib/graphql.ts` |
| Search results UI | `src/ui/components/search-results.tsx` |
| Search page | `src/app/[channel]/(main)/search/page.tsx` |
| Design tokens | `src/styles/brand.css` |
| Locale config | `src/config/locale.ts` |
| UI primitives | `src/ui/components/ui/` |
| Test fixtures | `src/ui/components/plp/__fixtures__/` |

### Commands Cheat Sheet

```bash
# Development
pnpm run dev              # Start dev server
pnpm run build            # Production build
pnpm exec tsc --noEmit    # Type check

# GraphQL
pnpm run generate         # Regenerate types (storefront)
pnpm run generate:checkout # Regenerate types (checkout)
pnpm run generate:all     # Both

# Testing
pnpm test                 # Watch mode
pnpm run test:run         # Single run

# Linting
pnpm run lint             # Check
pnpm run lint:fix         # Fix
```

---

## AI Feature Implementation Checklist

For the AI Product Search & Recommendations feature:

- [ ] Create `src/lib/search/ai-provider.ts` implementing the search contract
- [ ] Add Azure OpenAI SDK or similar to `package.json`
- [ ] Set environment variables for AI service in `.env`
- [ ] Extend `SearchProduct` type with AI-specific fields
- [ ] Create recommendation components in `src/ui/components/`
- [ ] Add new GraphQL queries if needed (run `pnpm run generate`)
- [ ] Write tests for AI search logic
- [ ] Add Suspense boundaries for AI-powered components
- [ ] Follow design token conventions for any new UI

---

*Constitution complete with all 18 sections.*

