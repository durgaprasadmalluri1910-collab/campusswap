import { supabase } from "@/integrations/supabase/client";

export const CATEGORIES = [
  { name: "Books", emoji: "📚" },
  { name: "Electronics", emoji: "💻" },
  { name: "Hostel", emoji: "🛏️" },
  { name: "Cycles", emoji: "🚲" },
  { name: "Sports", emoji: "🏏" },
  { name: "Clothing", emoji: "👕" },
  { name: "Art & Design", emoji: "🎨" },
  { name: "Free Items", emoji: "🎁" },
] as const;

export const emojiFor = (category: string) =>
  CATEGORIES.find((c) => c.name === category)?.emoji ?? "📦";

export type College = {
  id: string;
  name: string;
  city: string | null;
};

export type Listing = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  condition: string | null;
  deal_type: string;
  price: number | null;
  college_id: string;
  location: string | null;
  seller_name: string;
  seller_detail: string | null;
  contact: string | null;
  created_at: string;
};

export type ListingWithCollege = Listing & { colleges: { name: string } | null };

export const collegesQuery = {
  queryKey: ["colleges"],
  queryFn: async (): Promise<College[]> => {
    const { data, error } = await supabase
      .from("colleges")
      .select("id, name, city")
      .order("name");
    if (error) throw error;
    return data ?? [];
  },
};

export const listingsQuery = {
  queryKey: ["listings"],
  queryFn: async (): Promise<ListingWithCollege[]> => {
    const { data, error } = await supabase
      .from("listings")
      .select("*, colleges(name)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ListingWithCollege[];
  },
};

export function priceLabel(listing: Pick<Listing, "deal_type" | "price">) {
  if (listing.deal_type === "free") return "Free";
  if (listing.deal_type === "swap") return "Swap only";
  if (listing.price == null) return "Ask seller";
  return `₹${Number(listing.price).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}
