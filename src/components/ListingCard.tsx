import { emojiFor, priceLabel, timeAgo, type ListingWithCollege } from "@/lib/campus";

export function ListingCard({ listing }: { listing: ListingWithCollege }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className="text-2xl" aria-hidden>
          {emojiFor(listing.category)}
        </span>
        <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
          {priceLabel(listing)}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug text-foreground">{listing.title}</h3>
      {listing.condition && (
        <p className="mt-1 text-sm text-muted-foreground">{listing.condition}</p>
      )}
      <p className="mt-3 text-sm font-medium text-primary">{listing.colleges?.name}</p>
      {listing.location && (
        <p className="text-sm text-muted-foreground">{listing.location}</p>
      )}
      <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-muted-foreground">
        <span>
          {listing.seller_name}
          {listing.seller_detail ? ` · ${listing.seller_detail}` : ""}
        </span>
        <span>{timeAgo(listing.created_at)}</span>
      </div>
    </article>
  );
}
