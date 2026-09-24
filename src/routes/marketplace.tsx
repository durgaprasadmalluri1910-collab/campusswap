import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { CATEGORIES, collegesQuery, listingsQuery } from "@/lib/campus";
import { ListingCard } from "@/components/ListingCard";

type Search = { category?: string | undefined; college?: string | undefined };

export const Route = createFileRoute("/marketplace")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    college: typeof search["college"] === "string" ? search["college"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Marketplace — CampusSwap" },
      {
        name: "description",
        content: "Every item students are selling, swapping or giving away, filtered by campus.",
      },
      { property: "og:title", content: "Marketplace — CampusSwap" },
      {
        property: "og:description",
        content: "Browse student listings by campus and category.",
      },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const { category, college } = Route.useSearch();
  const navigate = useNavigate({ from: "/marketplace" });
  const colleges = useQuery(collegesQuery);
  const listings = useQuery(listingsQuery);

  const items = (listings.data ?? []).filter(
    (l) => (!category || l.category === category) && (!college || l.college_id === college),
  );

  const setSearch = (next: Search) =>
    navigate({ search: (prev: Search) => ({ ...prev, ...next }) });

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} item{items.length === 1 ? "" : "s"} available right now.
          </p>
        </div>
        <Link
          to="/add"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Add an item
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSearch({ category: undefined })}
          className={`rounded-full border px-4 py-1.5 text-sm ${
            category
              ? "border-border bg-card text-foreground"
              : "border-primary bg-primary text-primary-foreground"
          }`}
        >
          All categories
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.name}
            onClick={() => setSearch({ category: c.name })}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              category === c.name
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-accent"
            }`}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-foreground" htmlFor="college-filter">
          Campus
        </label>
        <select
          id="college-filter"
          value={college ?? ""}
          onChange={(e) => setSearch({ college: e.target.value || undefined })}
          className="mt-1 block w-full max-w-sm rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="">All campuses</option>
          {(colleges.data ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {listings.isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading listings…</p>
      ) : items.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">
          Nothing here yet.{" "}
          <Link to="/add" className="font-semibold text-primary hover:underline">
            Be the first to add an item.
          </Link>
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
