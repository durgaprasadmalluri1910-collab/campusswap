import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { CATEGORIES, collegesQuery, listingsQuery } from "@/lib/campus";
import { ListingCard } from "@/components/ListingCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusSwap — buy, sell and swap on your campus" },
      {
        name: "description",
        content:
          "A student marketplace where every listing shows the campus and block, so you always know how far the pickup is.",
      },
      { property: "og:title", content: "CampusSwap — your campus marketplace" },
      {
        property: "og:description",
        content: "Buy, sell, swap and give away things without leaving your campus.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const colleges = useQuery(collegesQuery);
  const listings = useQuery(listingsQuery);
  const recent = (listings.data ?? []).slice(0, 6);

  const counts = new Map<string, number>();
  for (const l of listings.data ?? []) {
    const key = l.colleges?.name ?? "";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return (
    <div>
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            Students only · {colleges.data?.length ?? 0} campuses live
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Your campus. Your marketplace.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Buy, sell, swap and give away things without leaving your campus. Every listing shows
            the campus and block, so you always know how far the pickup is.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/marketplace"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explore marketplace
            </Link>
            <Link
              to="/add"
              className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              Add an item
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-foreground">Campuses on CampusSwap</h2>
          <Link to="/colleges" className="text-sm font-semibold text-primary hover:underline">
            Add your college
          </Link>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(colleges.data ?? []).map((c) => (
            <li key={c.id} className="rounded-xl border border-border bg-card p-4">
              <p className="font-medium text-foreground">{c.name}</p>
              <p className="text-sm text-muted-foreground">
                {counts.get(c.name) ?? 0} listing{(counts.get(c.name) ?? 0) === 1 ? "" : "s"}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-12">
        <h2 className="text-xl font-semibold text-foreground">Browse categories</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to="/marketplace"
              search={{ category: c.name }}
              className="rounded-xl border border-border bg-card px-4 py-5 text-center transition-colors hover:bg-accent"
            >
              <span className="text-2xl" aria-hidden>
                {c.emoji}
              </span>
              <p className="mt-2 text-sm font-medium text-foreground">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Recently added</h2>
          <Link to="/marketplace" className="text-sm font-semibold text-primary hover:underline">
            See everything
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>
    </div>
  );
}
