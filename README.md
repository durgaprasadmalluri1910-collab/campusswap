# CampusSwap

A campus marketplace where students can post items for sale, give things away for free, or offer swaps — and anyone can add their college to the directory. No sign-in required.

**Live site:** https://college-crib-collaborate.lovable.app

## Features

- **Marketplace** — browse listings by category (books, electronics, hostel essentials, and more) and filter by college
- **Add item** — post a listing with title, description, condition, deal type (sale / free / swap), price, and contact details
- **Colleges** — a directory of campuses anyone can add to

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19, TanStack Router, TanStack Query)
- Tailwind CSS v4 + shadcn/ui
- Lovable Cloud (Supabase) for data — `colleges` and `listings` tables with open read/insert access

## Development

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

Database schema lives in `drizzle/migrations/0000_create_campusswap.sql`.
