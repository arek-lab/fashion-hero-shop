"use client";

import { useState, useEffect } from "react";
import type { Product, ProductCategory, ShoeType, ShoeMaterial } from "@/types";

const STORAGE_KEY = "fashionhero_seller_products";

export interface ProductDraft {
  name: string;
  price: number;
  originalPrice?: number;
  category: "men" | "women" | "unisex";
  productCategory: ProductCategory;
  type: ShoeType;
  material: ShoeMaterial;
  description: string;
  features: string;
  materials: string;
  care: string;
  sizes: string;
  colorName: string;
  colorHex: string;
  badge: "new" | "new-color" | "bestseller" | "sale" | "";
}

function load(sellerEmail: string): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const store = JSON.parse(raw) as Record<string, Product[]>;
    return store[sellerEmail] ?? [];
  } catch {
    return [];
  }
}

function save(sellerEmail: string, products: Product[]) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const store = raw ? (JSON.parse(raw) as Record<string, Product[]>) : {};
    store[sellerEmail] = products;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}

export function useSellerProducts(sellerEmail: string) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(load(sellerEmail));
  }, [sellerEmail]);

  function addProduct(draft: ProductDraft) {
    const id = "seller-" + Date.now();
    const slug = draft.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const collections = [
      "all",
      draft.category === "men" ? "mens" : draft.category === "women" ? "womens" : null,
      "new-arrivals",
    ].filter((c): c is string => Boolean(c));

    const product: Product = {
      id,
      slug,
      name: draft.name,
      category: draft.category,
      productCategory: draft.productCategory,
      type: draft.type,
      material: draft.material,
      price: draft.price,
      originalPrice: draft.originalPrice || undefined,
      badge: draft.badge || undefined,
      description: draft.description,
      features: draft.features.split(",").map((s) => s.trim()).filter(Boolean),
      materials: draft.materials,
      care: draft.care,
      sizes: draft.sizes.split(",").map((s) => Number(s.trim())).filter((n) => !isNaN(n) && n > 0),
      colors: [{ name: draft.colorName, hex: draft.colorHex, image: "" }],
      collections,
      images: [],
      rating: 0,
      reviewCount: 0,
      tags: [],
      sellerId: sellerEmail,
    };

    const next = [product, ...products];
    setProducts(next);
    save(sellerEmail, next);
  }

  function removeProduct(id: string) {
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    save(sellerEmail, next);
  }

  return { products, addProduct, removeProduct };
}
