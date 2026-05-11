"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Influencer Meetup", "Fashion Show", "Styling Session"] as const;
type Category = (typeof CATEGORIES)[number];

interface Event {
  id: number;
  title: string;
  category: Exclude<Category, "All">;
  date: string;
  location: string;
  description: string;
  image: string;
  spots: string;
}

const events: Event[] = [
  {
    id: 1,
    title: "Style Icons Summit",
    category: "Influencer Meetup",
    date: "June 14, 2026",
    location: "Warsaw, Centrum",
    description:
      "An exclusive gathering of fashion influencers sharing trends, collab stories, and what's next for streetwear. Network with the faces behind the feeds.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=60",
    spots: "Limited spots",
  },
  {
    id: 2,
    title: "Autumn Collection Preview",
    category: "Fashion Show",
    date: "July 3, 2026",
    location: "Kraków, Stare Miasto",
    description:
      "Be the first to see the upcoming autumn collections from emerging Polish designers and established names on the FashionHero marketplace.",
    image:
      "https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=1200&auto=format&fit=crop&q=60",
    spots: "Open registration",
  },
  {
    id: 3,
    title: "Editorial Styling Workshop",
    category: "Styling Session",
    date: "July 19, 2026",
    location: "Wrocław, Strzegomska",
    description:
      "Work hands-on with a professional editorial stylist. Learn how to build outfits for different body types, occasions, and aesthetics using real wardrobe pieces.",
    image:
      "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=1200&auto=format&fit=crop&q=60",
    spots: "12 spots left",
  },
  {
    id: 4,
    title: "FashionHero Grand Showcase",
    category: "Fashion Show",
    date: "August 9, 2026",
    location: "Warsaw, Pałac Kultury",
    description:
      "Our flagship seasonal event. 30+ sellers, live runway presentations, pop-up shopping, and special guest appearances from the fashion world.",
    image:
      "https://plus.unsplash.com/premium_photo-1695575576052-7c271876b075?w=1200&auto=format&fit=crop&q=60",
    spots: "Open registration",
  },
  {
    id: 5,
    title: "Accessories & Details Lab",
    category: "Styling Session",
    date: "August 23, 2026",
    location: "Gdańsk, Młode Miasto",
    description:
      "A deep dive into the art of accessorizing. Scarves, bags, jewelry, and shoes — how small details define a complete look. Led by FashionHero's top stylists.",
    image:
      "https://images.unsplash.com/photo-1557777586-f6682739fcf3?w=1200&auto=format&fit=crop&q=60",
    spots: "8 spots left",
  },
  {
    id: 6,
    title: "Influencer Meet & Greet",
    category: "Influencer Meetup",
    date: "September 6, 2026",
    location: "Poznań, Stary Browar",
    description:
      "Meet your favourite Polish fashion creators in person. Q&A sessions, photo opportunities, and exclusive behind-the-scenes content for attendees.",
    image:
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1200&auto=format&fit=crop&q=60",
    spots: "50 spots left",
  },
];

function EventCard({ event }: { event: Event }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 flex flex-col hover:shadow-md transition-shadow duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <span className="absolute top-3 left-3 bg-charcoal text-white text-[10px] font-semibold uppercase tracking-[0.8px] px-2.5 py-1 rounded-full">
          {event.category}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-charcoal mb-3 leading-snug">{event.title}</h3>
        <div className="flex flex-col gap-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-[12px] text-warm-gray">
            <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-warm-gray">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>
        <p className="text-sm text-warm-gray leading-relaxed line-clamp-2 flex-1 mb-4">
          {event.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-black/5">
          <span className="text-[11px] font-medium text-charcoal/50 uppercase tracking-[0.5px]">
            {event.spots}
          </span>
          <button className="text-[12px] font-semibold text-charcoal underline underline-offset-2 hover:opacity-60 transition-opacity">
            RSVP →
          </button>
        </div>
      </div>
    </article>
  );
}

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered =
    activeCategory === "All"
      ? events
      : events.filter((e) => e.category === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[360px] overflow-hidden bg-charcoal">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=40')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <p className="text-[11px] font-medium uppercase tracking-[1px] mb-4 text-white/60">
            FASHION HERO
          </p>
          <h1 className="text-4xl md:text-5xl font-light leading-tight max-w-2xl">
            Meet the people
            <br />
            shaping fashion.
          </h1>
          <p className="mt-4 text-sm text-white/60 max-w-md">
            Influencer meetups, stylist workshops, and runway shows — all in one place.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="sticky top-14 z-40 bg-white border-b border-black/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex-shrink-0 px-4 py-3.5 text-[12px] font-medium uppercase tracking-[0.5px] border-b-2 transition-colors",
                  activeCategory === cat
                    ? "border-charcoal text-charcoal"
                    : "border-transparent text-warm-gray hover:text-charcoal"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Event cards */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-[11px] font-medium uppercase tracking-[1px] text-warm-gray mb-8">
          {filtered.length} {filtered.length === 1 ? "EVENT" : "EVENTS"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-warm-gray text-sm">
            No events in this category yet. Check back soon.
          </div>
        )}
      </section>
    </div>
  );
}
