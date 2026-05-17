"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSellerAuth } from "@/components/seller-auth-provider";
import { useSellerProducts } from "@/hooks/use-seller-products";
import { AddProductModal } from "@/components/add-product-modal";
import { CompetitorAnalysisModal } from "@/components/competitor-analysis-modal";
import type { Product } from "@/types";

const mockRecentOrders = [
  { id: "ORD-5521", customer: "Anna K.", date: "May 14, 2026", amount: 320, status: "Processing" },
  { id: "ORD-5518", customer: "Piotr M.", date: "May 13, 2026", amount: 215, status: "Shipped" },
  { id: "ORD-5510", customer: "Marta J.", date: "May 12, 2026", amount: 490, status: "Delivered" },
  { id: "ORD-5504", customer: "Tomasz W.", date: "May 11, 2026", amount: 175, status: "Delivered" },
  { id: "ORD-5498", customer: "Kasia B.", date: "May 10, 2026", amount: 640, status: "Delivered" },
];

const statusColor: Record<string, string> = {
  Processing: "text-amber-600",
  Shipped: "text-blue-600",
  Delivered: "text-green-700",
};

const stats = [
  { label: "Total Revenue", value: "48 320 zł" },
  { label: "Active Listings", value: "24" },
  { label: "Orders This Month", value: "87" },
  { label: "Rating", value: "4.7 / 5" },
];

function ProductRow({ product, onRemove }: { product: Product; onRemove: () => void }) {
  const color = product.colors[0];
  return (
    <tr className="border-b border-black/5">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0 border border-black/10"
            style={{ backgroundColor: color?.hex ?? "#ccc" }}
          />
          <span className="text-[13px] font-medium text-charcoal">{product.name}</span>
        </div>
      </td>
      <td className="py-3 pr-4">
        <span className="text-[10px] uppercase tracking-[0.6px] bg-charcoal/10 text-charcoal/70 px-1.5 py-0.5 rounded-full">
          {product.productCategory}
        </span>
      </td>
      <td className="py-3 pr-4 text-[13px] text-charcoal">{product.price} zł</td>
      <td className="py-3 pr-4">
        {product.badge && (
          <span className="text-[10px] uppercase tracking-[0.6px] bg-charcoal text-white px-1.5 py-0.5 rounded-full">
            {product.badge}
          </span>
        )}
      </td>
      <td className="py-3">
        <button
          onClick={onRemove}
          className="text-[11px] uppercase tracking-[0.5px] text-warm-gray hover:text-red-600 transition-colors"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}

export default function SellerDashboardPage() {
  const { seller, logout } = useSellerAuth();
  const router = useRouter();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCompetitor, setShowCompetitor] = useState(false);
  const { products: myProducts, addProduct, removeProduct } = useSellerProducts(
    seller?.email ?? ""
  );

  useEffect(() => {
    if (!seller) router.push("/seller/login");
  }, [seller, router]);

  if (!seller) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Store header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-light text-charcoal mb-1">{seller.storeName}</h1>
          <p className="text-[13px] text-warm-gray flex items-center gap-2">
            {seller.email}
            <span className="bg-charcoal/10 text-charcoal text-[10px] uppercase tracking-[0.6px] px-2 py-0.5 rounded-full">
              {seller.plan}
            </span>
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="btn-cta-outline text-[12px]"
        >
          SIGN OUT
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-5 border border-black/5">
            <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-light text-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <section className="mb-10">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-4 pb-2 border-b border-black/10">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-black/10">
                {["Order ID", "Customer", "Date", "Amount", "Status"].map((col) => (
                  <th key={col} className="text-left text-[11px] uppercase tracking-[0.6px] text-warm-gray pb-2 pr-4 font-medium">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockRecentOrders.map((order) => (
                <tr key={order.id} className="border-b border-black/5">
                  <td className="py-3 pr-4 font-medium text-charcoal">{order.id}</td>
                  <td className="py-3 pr-4 text-charcoal/80">{order.customer}</td>
                  <td className="py-3 pr-4 text-warm-gray">{order.date}</td>
                  <td className="py-3 pr-4 text-charcoal">{order.amount} zł</td>
                  <td className={`py-3 font-medium ${statusColor[order.status] ?? "text-charcoal"}`}>
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* My Products */}
      <section className="mb-10">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-4 pb-2 border-b border-black/10 flex items-center justify-between">
          My Products
          <span className="text-warm-gray font-normal normal-case tracking-normal text-[11px]">
            {myProducts.length} listing{myProducts.length !== 1 ? "s" : ""}
          </span>
        </h2>
        {myProducts.length === 0 ? (
          <p className="text-[13px] text-warm-gray py-4">
            No products yet. Use &ldquo;Add Product&rdquo; below to create your first listing.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-black/10">
                  {["Product", "Category", "Price", "Badge", ""].map((col, i) => (
                    <th
                      key={i}
                      className="text-left text-[11px] uppercase tracking-[0.6px] text-warm-gray pb-2 pr-4 font-medium"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onRemove={() => removeProduct(product.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-4 pb-2 border-b border-black/10">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            className="btn-cta-outline text-[12px]"
            onClick={() => setShowAddProduct(true)}
          >
            ADD PRODUCT
          </button>
          <Link href="/collections/all" className="btn-cta-outline text-[12px] flex items-center">
            VIEW STORE
          </Link>
          <button className="btn-cta-outline text-[12px]">MANAGE INVENTORY</button>
        </div>
      </section>

      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onAdd={(draft) => {
            addProduct(draft);
            setShowAddProduct(false);
          }}
          onOpenCompetitor={() => setShowCompetitor(true)}
        />
      )}

      {showCompetitor && (
        <CompetitorAnalysisModal
          onClose={() => setShowCompetitor(false)}
          sellerEmail={seller.email}
        />
      )}
    </div>
  );
}
