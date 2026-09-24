import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { collegesQuery } from "@/lib/campus";

export const Route = createFileRoute("/colleges")({
  head: () => ({
    meta: [
      { title: "Colleges — CampusSwap" },
      {
        name: "description",
        content: "See every campus on CampusSwap and add yours so students can start trading.",
      },
      { property: "og:title", content: "Colleges on CampusSwap" },
      {
        property: "og:description",
        content: "Add your college and open the marketplace for your campus.",
      },
    ],
  }),
  component: Colleges,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter the college name").max(120),
  city: z.string().trim().max(80).nullable(),
});

const field =
  "mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-ring";

function Colleges() {
  const colleges = useQuery(collegesQuery);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      const fd = new FormData(form);
      const parsed = schema.parse({
        name: String(fd.get("name") ?? ""),
        city: String(fd.get("city") ?? "") || null,
      });
      const { error } = await supabase.from("colleges").insert(parsed);
      if (error) throw error;
      form.reset();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["colleges"] });
      toast.success("College added");
    },
    onError: (error: unknown) => {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0]?.message ?? "Please check the form");
      } else if (
        typeof error === "object" &&
        error !== null &&
        String((error as { code?: string }).code) === "23505"
      ) {
        toast.error("That college is already listed");
      } else {
        toast.error("Could not add the college. Please try again.");
      }
    },
  });

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-3xl font-bold text-foreground">Colleges</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Don't see your campus? Add it and start posting items right away.
      </p>

      <form
        className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(e.currentTarget);
        }}
      >
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="name">
            College name
          </label>
          <input id="name" name="name" required maxLength={120} className={field} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="city">
            City
          </label>
          <input id="city" name="city" maxLength={80} className={field} />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending ? "Adding…" : "Add college"}
        </button>
      </form>

      <h2 className="mt-10 text-lg font-semibold text-foreground">
        {colleges.data?.length ?? 0} campuses live
      </h2>
      <ul className="mt-4 space-y-2">
        {(colleges.data ?? []).map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
          >
            <span className="font-medium text-foreground">{c.name}</span>
            <span className="text-sm text-muted-foreground">{c.city ?? ""}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
