"use client";

import { useState, useEffect, useRef } from "react";
import { Lock, Check } from "lucide-react";
import { CloseIcon } from "./icons";

interface CompetitorAnalysisModalProps {
  onClose: () => void;
  sellerEmail: string;
}

type Plan = "basic" | "pro" | "profit";

const plans = [
  {
    id: "basic" as Plan,
    name: "Basic",
    price: "19,99 zł",
    features: ["Średnia cena w kategorii", "5 kategorii", "Tygodniowy raport"],
  },
  {
    id: "pro" as Plan,
    name: "Pro",
    price: "49,99 zł",
    features: ["20 kategorii", "Trendy cenowe", "Alerty cenowe", "Analiza historyczna"],
  },
  {
    id: "profit" as Plan,
    name: "Profit",
    price: "99,99 zł",
    features: ["Nieograniczone kategorie", "Priorytetowe wsparcie", "Dostęp API", "Team access"],
  },
];

const competitors = [
  { seller: "UrbanEdge", product: "Cloud Mesh Runner", price: "379 zł", diff: "+8%", positive: false },
  { seller: "EcoThreads", product: "Wool Walker Pro", price: "329 zł", diff: "−6%", positive: true },
  { seller: "StyleLab", product: "Street Trainer", price: "419 zł", diff: "+19%", positive: false },
  { seller: "NordStyle", product: "City Slip-On", price: "299 zł", diff: "−14%", positive: true },
];

const bars = [
  { label: "200–250", height: 20, active: false },
  { label: "251–300", height: 35, active: false },
  { label: "301–350", height: 78, active: true },
  { label: "351–400", height: 55, active: false },
  { label: "401–450", height: 40, active: false },
  { label: "451–500", height: 22, active: false },
  { label: "501–550", height: 12, active: false },
  { label: "551+", height: 8, active: false },
];

function FakeAnalytics() {
  return (
    <div className="p-6 space-y-6 select-none">
      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Śr. cena rynkowa", value: "349 zł" },
          { label: "Twoja cena vs rynek", value: "−12%" },
          { label: "Śledzonych konkurentów", value: "47" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-lg p-4 border border-black/5 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.7px] text-warm-gray mb-1">
              {kpi.label}
            </p>
            <p className="text-xl font-light text-charcoal">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-3">
          Rozkład cen w kategorii
        </p>
        <div className="flex items-end gap-2 h-24">
          {bars.map((bar) => (
            <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-sm transition-all ${bar.active ? "bg-charcoal" : "bg-charcoal/20"}`}
                style={{ height: `${bar.height}%` }}
              />
              <span className="text-[8px] text-warm-gray leading-none text-center whitespace-nowrap">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-warm-gray mt-1">Liczba produktów</p>
      </div>

      {/* Competitors table */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-3">
          Porównanie z konkurencją
        </p>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-black/10">
              {["Sprzedawca", "Produkt", "Cena", "Różnica"].map((col) => (
                <th key={col} className="text-left text-[10px] uppercase tracking-[0.6px] text-warm-gray pb-1.5 pr-3 font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {competitors.map((row) => (
              <tr key={row.seller} className="border-b border-black/5">
                <td className="py-2 pr-3 font-medium text-charcoal">{row.seller}</td>
                <td className="py-2 pr-3 text-charcoal/70">{row.product}</td>
                <td className="py-2 pr-3 text-charcoal">{row.price}</td>
                <td className={`py-2 font-medium text-[11px] ${row.positive ? "text-green-700" : "text-amber-600"}`}>
                  {row.diff}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trend bar */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-2">
          Trend cenowy (ostatnie 90 dni)
        </p>
        <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-green-200 via-amber-200 to-green-300">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-charcoal border-2 border-white shadow"
            style={{ left: "62%" }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[9px] text-warm-gray">
          <span>3 mies. temu</span>
          <span>dziś</span>
          <span>prognoza</span>
        </div>
      </div>
    </div>
  );
}

export function CompetitorAnalysisModal({ onClose, sellerEmail }: CompetitorAnalysisModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan>("pro");
  const [submitted, setSubmitted] = useState(false);
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const raw = localStorage.getItem("fashionhero_waitlist");
      const list = raw ? JSON.parse(raw) : [];
      list.push({ email: sellerEmail, plan: selectedPlan, date: new Date().toISOString() });
      localStorage.setItem("fashionhero_waitlist", JSON.stringify(list));
    } catch {
      // ignore
    }
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative bg-[#f7f5f2] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl outline-none flex flex-col"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 bg-white flex-shrink-0">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.8px] text-charcoal">
            Analiza cen konkurencji
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-warm-gray hover:text-charcoal transition-colors"
            aria-label="Zamknij"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body — analytics blurred behind overlay */}
        <div className="relative flex-1 overflow-y-auto">
          {/* Layer 1: Fake analytics (blurred) */}
          <div className="blur-sm pointer-events-none" aria-hidden="true">
            <FakeAnalytics />
          </div>

          {/* Layer 2: Waitlist overlay */}
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm overflow-y-auto">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-charcoal/10 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-charcoal" />
              </div>

              <h3 className="text-[18px] font-light text-charcoal mb-1">
                Analiza cen konkurencji
              </h3>
              <p className="text-[13px] text-warm-gray mb-6 max-w-md">
                Bądź pierwszym, który zyska dostęp do inteligentnej analizy rynku i wyprzedź konkurencję.
              </p>

              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-700" />
                  </div>
                  <p className="text-[15px] font-medium text-charcoal">Dziękujemy!</p>
                  <p className="text-[13px] text-warm-gray">Zapisaliśmy Cię na listę oczekujących.</p>
                  <p className="text-[12px] text-charcoal/60 mt-1">
                    Plan: <span className="font-medium capitalize">{selectedPlan}</span> · {sellerEmail}
                  </p>
                  <p className="text-[12px] text-warm-gray mt-1">Odezwiemy się wkrótce.</p>
                  <button onClick={onClose} className="btn-cta-outline text-[12px] mt-4">
                    ZAMKNIJ
                  </button>
                </div>
              ) : (
                <>
                  {/* Pricing cards */}
                  <div className="grid grid-cols-3 gap-3 w-full mb-6">
                    {plans.map((plan) => {
                      const isSelected = selectedPlan === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`rounded-lg border-2 p-4 text-left transition-all ${
                            isSelected
                              ? "border-charcoal bg-white shadow-sm"
                              : "border-black/10 bg-white/60 hover:border-black/30"
                          }`}
                        >
                          <p className="text-[10px] font-medium uppercase tracking-[0.8px] text-warm-gray mb-1">
                            {plan.name}
                          </p>
                          <p className="text-[18px] font-light text-charcoal leading-none mb-0.5">
                            {plan.price}
                          </p>
                          <p className="text-[10px] text-warm-gray mb-3">/mies.</p>
                          <ul className="space-y-1.5">
                            {plan.features.map((f) => (
                              <li key={f} className="flex items-start gap-1.5">
                                <Check className="w-3 h-3 text-charcoal mt-0.5 flex-shrink-0" />
                                <span className="text-[11px] text-charcoal/80 text-left">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </button>
                      );
                    })}
                  </div>

                  {/* Signup form */}
                  <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
                    <p className="text-[12px] text-warm-gray">
                      Zarejestrujemy Cię jako:{" "}
                      <span className="font-medium text-charcoal">{sellerEmail}</span>
                    </p>
                    <button type="submit" className="btn-cta w-full text-[12px]">
                      ZAPISZ SIĘ NA WCZEŚNIEJSZY DOSTĘP
                    </button>
                    <p className="text-[11px] text-warm-gray">
                      Bez zobowiązań. Powiadomimy Cię przy uruchomieniu.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
