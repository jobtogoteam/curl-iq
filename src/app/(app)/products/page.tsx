"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShoppingBag, RefreshCw } from "lucide-react";
import { smooth, snappy, useMotion } from "@/lib/motion";
import type { ProductRecommendation } from "@/db/schema";

const CATEGORIES = [
  { key: "all",        label: "All" },
  { key: "shampoo",    label: "Shampoo" },
  { key: "conditioner",label: "Conditioner" },
  { key: "leave-in",   label: "Leave-in" },
  { key: "curl-cream", label: "Curl Cream" },
  { key: "gel",        label: "Gel" },
  { key: "oil",        label: "Oil" },
  { key: "mask",       label: "Mask" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const { shouldReduce } = useMotion();

  function loadProducts() {
    setLoading(true);
    setError(false);
    fetch("/api/products")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { setProducts(data.products ?? []); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }

  useEffect(() => { loadProducts(); }, []);

  const availableCategories = CATEGORIES.filter(
    (c) => c.key === "all" || products.some((p) => p.category === c.key)
  );

  const filtered = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="px-5 pt-14 pb-6" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="mb-7"
      >
        <h1
          className="font-display"
          style={{ fontSize: "34px", fontWeight: 500, color: "var(--text-primary)" }}
        >
          Recommended
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
          {products.length > 0 ? `${products.length} products matched` : "Based on your latest scan"}
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-52 rounded-2xl skeleton"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 pt-16 text-center">
          <p className="text-[15px] font-medium" style={{ color: "var(--text-primary)" }}>
            Couldn't load recommendations
          </p>
          <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
            Check your connection and try again.
          </p>
          <button
            onClick={loadProducts}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold"
            style={{ background: "var(--primary)", color: "white" }}
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No recommendations yet"
          description="Take a scan to get personalised product recommendations for your curl type."
          cta={{ label: "Take a scan", href: "/scan" }}
        />
      ) : (
        <>
          {/* Category filter */}
          {availableCategories.length > 2 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide -mx-5 px-5">
              {availableCategories.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-all"
                  style={
                    activeCategory === key
                      ? {
                          background: "var(--primary)",
                          color: "white",
                          border: "1px solid var(--primary)",
                          boxShadow: "0 2px 12px var(--primary-glow)",
                        }
                      : {
                          background: "var(--surface-2)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border)",
                        }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Products */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={shouldReduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={shouldReduce ? { duration: 0 } : snappy}
              className="grid grid-cols-2 gap-3"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={shouldReduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={shouldReduce ? { duration: 0 } : { delay: i * 0.06, ...smooth }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
