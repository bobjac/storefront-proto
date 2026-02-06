/**
 * Frequently Bought Together component.
 * Shows products commonly purchased together with bundle pricing.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import type { Recommendation } from "@/lib/recommendations/types";

interface FrequentlyBoughtProps {
  /** Recommendation with bundle info */
  recommendation: Recommendation & {
    bundlePrice?: number;
    bundleSavings?: number;
  };
  /** Channel for product links */
  channel: string;
}

/**
 * Display frequently bought together products with bundle option.
 */
export function FrequentlyBought({
  recommendation,
  channel,
}: FrequentlyBoughtProps) {
  const { title, reason, products, bundlePrice, bundleSavings } = recommendation;
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(products.map((p) => p.id))
  );

  if (products.length === 0) {
    return null;
  }

  const toggleProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectedPrice = products
    .filter((p) => selectedProducts.has(p.id))
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{reason}</p>
      </div>

      {/* Products row */}
      <div className="flex flex-wrap items-center gap-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4">
            {/* Plus sign between products */}
            {index > 0 && (
              <span className="text-2xl font-light text-muted-foreground">+</span>
            )}

            {/* Product card */}
            <div
              className={`
                relative cursor-pointer overflow-hidden rounded-lg border-2 transition-colors
                ${
                  selectedProducts.has(product.id)
                    ? "border-primary"
                    : "border-border hover:border-muted-foreground"
                }
              `}
              onClick={() => toggleProduct(product.id)}
            >
              {/* Checkbox indicator */}
              <div
                className={`
                  absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded
                  ${
                    selectedProducts.has(product.id)
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background"
                  }
                `}
              >
                {selectedProducts.has(product.id) && (
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              {/* Product image */}
              <div className="h-24 w-24 overflow-hidden bg-muted">
                {product.thumbnailUrl ? (
                  <img
                    src={product.thumbnailUrl}
                    alt={product.thumbnailAlt || product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="p-2 text-center">
                <p className="text-xs font-medium line-clamp-1">{product.name}</p>
                <p className="text-sm font-semibold">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Equals and total */}
        <div className="flex items-center gap-4">
          <span className="text-2xl font-light text-muted-foreground">=</span>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              ${selectedPrice.toFixed(2)}
            </p>
            {bundleSavings && bundleSavings > 0 && selectedProducts.size === products.length && (
              <p className="text-sm text-green-600">
                Save ${bundleSavings.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart button */}
      <div className="mt-6">
        <button
          className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          disabled={selectedProducts.size === 0}
        >
          Add {selectedProducts.size} {selectedProducts.size === 1 ? "Item" : "Items"} to Cart
        </button>
      </div>
    </section>
  );
}

export default FrequentlyBought;
