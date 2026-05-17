"use client";

import { useState, useEffect, useRef } from "react";
import { CloseIcon } from "./icons";
import type { ProductDraft } from "@/hooks/use-seller-products";

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (draft: ProductDraft) => void;
}

const EMPTY: ProductDraft = {
  name: "",
  price: 0,
  originalPrice: undefined,
  category: "unisex",
  productCategory: "shoes",
  type: "runner",
  material: "mesh",
  description: "",
  features: "",
  materials: "",
  care: "",
  sizes: "",
  colorName: "",
  colorHex: "#000000",
  badge: "",
};

const inputClass =
  "w-full border border-black/15 rounded px-3 py-2.5 text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors";
const labelClass =
  "block text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-1.5";
const sectionClass =
  "text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-3 pb-2 border-b border-black/10";

export function AddProductModal({ onClose, onAdd }: AddProductModalProps) {
  const [form, setForm] = useState<ProductDraft>(EMPTY);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function set<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Product name is required.");
    if (!form.price || form.price <= 0) return setError("Enter a valid price.");
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.sizes.trim()) return setError("Enter at least one size.");
    if (!form.colorName.trim()) return setError("Color name is required.");
    if (!form.colorHex.trim()) return setError("Color hex is required.");
    onAdd(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl outline-none"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-black/10">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.8px] text-charcoal">
            Add New Product
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-warm-gray hover:text-charcoal transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
          {/* Basic Info */}
          <div>
            <p className={sectionClass}>Basic Info</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Product Name *</label>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Cloud Runner Pro"
                />
              </div>
              <div>
                <label className={labelClass}>Badge</label>
                <select
                  className={inputClass}
                  value={form.badge}
                  onChange={(e) => set("badge", e.target.value as ProductDraft["badge"])}
                >
                  <option value="">None</option>
                  <option value="new">New</option>
                  <option value="new-color">New Color</option>
                  <option value="bestseller">Bestseller</option>
                  <option value="sale">Sale</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <p className={sectionClass}>Pricing</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price (zł) *</label>
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  value={form.price || ""}
                  onChange={(e) => set("price", Number(e.target.value))}
                  placeholder="399"
                />
              </div>
              <div>
                <label className={labelClass}>Original Price (zł)</label>
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  value={form.originalPrice ?? ""}
                  onChange={(e) =>
                    set("originalPrice", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="499 (optional)"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <p className={sectionClass}>Category & Type</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Gender *</label>
                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value as ProductDraft["category"])}
                >
                  <option value="unisex">Unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Product Category *</label>
                <select
                  className={inputClass}
                  value={form.productCategory}
                  onChange={(e) =>
                    set("productCategory", e.target.value as ProductDraft["productCategory"])
                  }
                >
                  <option value="shoes">Shoes</option>
                  <option value="socks">Socks</option>
                  <option value="apparel">Apparel</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Type *</label>
                <select
                  className={inputClass}
                  value={form.type}
                  onChange={(e) => set("type", e.target.value as ProductDraft["type"])}
                >
                  {["runner","walker","slip-on","trainer","flat","hiker","slide","loafer","sock","tee","hoodie","pant","jacket","cardigan","bag","beanie","cap","insole"].map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Material *</label>
                <select
                  className={inputClass}
                  value={form.material}
                  onChange={(e) => set("material", e.target.value as ProductDraft["material"])}
                >
                  <option value="mesh">Mesh</option>
                  <option value="wool">Wool</option>
                  <option value="tree-fiber">Tree Fiber</option>
                  <option value="knit">Knit</option>
                  <option value="leather">Leather</option>
                </select>
              </div>
            </div>
          </div>

          {/* Color */}
          <div>
            <p className={sectionClass}>Color</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Color Name *</label>
                <input
                  className={inputClass}
                  value={form.colorName}
                  onChange={(e) => set("colorName", e.target.value)}
                  placeholder="e.g. Forest Green"
                />
              </div>
              <div>
                <label className={labelClass}>Hex Color *</label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border border-black/10 flex-shrink-0"
                    style={{ backgroundColor: form.colorHex }}
                  />
                  <input
                    className={inputClass}
                    value={form.colorHex}
                    onChange={(e) => set("colorHex", e.target.value)}
                    placeholder="#3d5a3d"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <p className={sectionClass}>Sizes</p>
            <label className={labelClass}>Sizes (comma-separated) *</label>
            <input
              className={inputClass}
              value={form.sizes}
              onChange={(e) => set("sizes", e.target.value)}
              placeholder="36, 37, 38, 39, 40, 41, 42"
            />
          </div>

          {/* Details */}
          <div>
            <p className={sectionClass}>Description & Details</p>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  rows={3}
                  className={inputClass + " resize-none"}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe your product..."
                />
              </div>
              <div>
                <label className={labelClass}>Features (comma-separated)</label>
                <input
                  className={inputClass}
                  value={form.features}
                  onChange={(e) => set("features", e.target.value)}
                  placeholder="Breathable, Lightweight, Machine washable"
                />
              </div>
              <div>
                <label className={labelClass}>Materials</label>
                <input
                  className={inputClass}
                  value={form.materials}
                  onChange={(e) => set("materials", e.target.value)}
                  placeholder="Upper: 100% natural wool..."
                />
              </div>
              <div>
                <label className={labelClass}>Care Instructions</label>
                <input
                  className={inputClass}
                  value={form.care}
                  onChange={(e) => set("care", e.target.value)}
                  placeholder="Machine wash cold, air dry"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-600 text-[13px]">{error}</p>}

          <button type="submit" className="btn-cta w-full text-[12px]">
            ADD PRODUCT
          </button>
        </form>
      </div>
    </div>
  );
}
