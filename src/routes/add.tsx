import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, collegesQuery } from "@/lib/campus";

export const Route = createFileRoute("/add")({
  head: () => ({
    meta: [
      { title: "Add an item — CampusSwap" },
      {
        name: "description",
        content: "Post something you want to sell, swap or give away on your campus.",
      },
      { property: "og:title", content: "Add an item — CampusSwap" },
      {
        property: "og:description",
        content: "List a book, cycle, gadget or hostel item for students on your campus.",
      },
    ],
  }),
  component: AddItem,
});

const schema = z.object({
  title: z.string().trim().min(2, "Give your item a title").max(140),
  description: z.string().trim().max(1000).nullable(),
  category: z.string().min(1),
  condition: z.string().trim().max(120).nullable(),
  deal_type: z.enum(["sale", "free", "swap"]),
  price: z.number().nonnegative().max(1_000_000).nullable(),
  college_id: z.string().uuid("Pick your college"),
  location: z.string().trim().max(160).nullable(),
  seller_name: z.string().trim().min(2, "Add your name").max(80),
  seller_detail: z.string().trim().max(80).nullable(),
  contact: z.string().trim().max(120).nullable(),
});

const field =
  "mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-ring";

function AddItem() {
  const colleges = useQuery(collegesQuery);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dealType, setDealType] = useState("sale");

  const mutation = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      const fd = new FormData(form);
      const priceRaw = String(fd.get("price") ?? "").trim();
      const parsed = schema.parse({
        title: String(fd.get("title") ?? ""),
        description: String(fd.get("description") ?? "") || null,
        category: String(fd.get("category") ?? "Books"),
        condition: String(fd.get("condition") ?? "") || null,
        deal_type: String(fd.get("deal_type") ?? "sale"),
        price: fd.get("deal_type") === "sale" && priceRaw ? Number(priceRaw) : null,
        college_id: String(fd.get("college_id") ?? ""),
        location: String(fd.get("location") ?? "") || null,
        seller_name: String(fd.get("seller_name") ?? ""),
        seller_detail: String(fd.get("seller_detail") ?? "") || null,
        contact: String(fd.get("contact") ?? "") || null,
      });
      const { error } = await supabase.from("listings").insert(parsed);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Your item is live on the marketplace");
      navigate({ to: "/marketplace" });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof z.ZodError
          ? (error.issues[0]?.message ?? "Please check the form")
          : "Could not post the item. Please try again.";
      toast.error(message);
    },
  });

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-3xl font-bold text-foreground">Add an item</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Anyone can post. Add enough detail so buyers know where to pick it up.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(e.currentTarget);
        }}
      >
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="title">
            What are you listing?
          </label>
          <input id="title" name="title" required maxLength={140} className={field} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="category">
              Category
            </label>
            <select id="category" name="category" className={field} defaultValue="Books">
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="deal_type">
              Sell, swap or give away
            </label>
            <select
              id="deal_type"
              name="deal_type"
              className={field}
              value={dealType}
              onChange={(e) => setDealType(e.target.value)}
            >
              <option value="sale">Sell for a price</option>
              <option value="swap">Swap only</option>
              <option value="free">Give away free</option>
            </select>
          </div>
        </div>

        {dealType === "sale" && (
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="price">
              Price (₹)
            </label>
            <input id="price" name="price" type="number" min="0" step="1" className={field} />
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="college_id">
            College
          </label>
          <select id="college_id" name="college_id" required className={field} defaultValue="">
            <option value="" disabled>
              Choose your college
            </option>
            {(colleges.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            College missing?{" "}
            <a href="/colleges" className="font-semibold text-primary hover:underline">
              Add it here
            </a>
            .
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="condition">
              Condition
            </label>
            <input
              id="condition"
              name="condition"
              maxLength={120}
              placeholder="Like new"
              className={field}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="location">
              Pickup spot
            </label>
            <input
              id="location"
              name="location"
              maxLength={160}
              placeholder="Block D — Hostel · Room 118"
              className={field}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="description">
            Details
          </label>
          <textarea id="description" name="description" rows={4} maxLength={1000} className={field} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="seller_name">
              Your name
            </label>
            <input id="seller_name" name="seller_name" required maxLength={80} className={field} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="seller_detail">
              Year & course
            </label>
            <input
              id="seller_detail"
              name="seller_detail"
              maxLength={80}
              placeholder="2nd year, Civil"
              className={field}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="contact">
            How should buyers reach you?
          </label>
          <input
            id="contact"
            name="contact"
            maxLength={120}
            placeholder="Phone or email"
            className={field}
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending ? "Posting…" : "Post item"}
        </button>
      </form>
    </div>
  );
}
