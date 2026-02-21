# toolkit_prod_estimator

## Project Overview
Internal tool for production employees at an art supply company. Workers assemble products weekly from orders. The tool lets them:
1. Log completed orders (product, quantity, time taken)
2. Manage personal piece rates (override company defaults)
3. Get time and pay estimates for upcoming orders based on personal history

## Pay Structure
- Pay by piece: `quantity × piece_rate`
- Floor: `hours × $17.00`
- Actual pay: `max(piece_earnings, time_earnings)`
- Speed is incentivized — faster completion = higher effective hourly rate

## Tech Stack
- **Framework**: Next.js 15 (App Router), TypeScript
- **Database/Auth**: Supabase (hosted at `asmemkjsykheatkmfgmi.supabase.co`)
- **Styling**: Tailwind CSS, shadcn/ui components
- **Auth**: Cookie-based sessions via `@supabase/ssr`, middleware in `proxy.ts`

## Database Tables
- `product_defaults` — company seed data, no user_id, RLS disabled, managed via Supabase dashboard
- `products` — per-user piece rates, seeded from `product_defaults` on signup via trigger
- `orders` — completed order history, includes `piece_rate_used` snapshot for historical accuracy

## Key Architectural Patterns
- Server components fetch data, pass as props to client components for interactivity
- Client components use browser Supabase client (`lib/supabase/client.ts`)
- Server components use server Supabase client (`lib/supabase/server.ts`)
- After mutations: `router.refresh()` re-runs server components, `onSuccess()` callback closes modals
- Route group `(dashboard)` shares layout across authenticated pages

## File Structure
```
app/
  (dashboard)/
    layout.tsx          # shared nav/layout for authenticated pages
    products/page.tsx   # server component, fetches and passes to ProductsList
    orders/page.tsx     # order history (WIP)
  auth/                 # login, signup, confirm, forgot-password, update-password
components/
  products-list.tsx     # client component, table with edit/delete/add via dialog
  product-form.tsx      # shared form for create and update (product prop = edit mode)
lib/supabase/
  server.ts             # server-side Supabase client (cookie-based)
  client.ts             # browser-side Supabase client
proxy.ts                # middleware — refreshes session on every request
database.types.ts       # generated types — regenerate with:
                        # supabase gen types typescript --project-id asmemkjsykheatkmfgmi > database.types.ts
```

## Supabase Notes
- Trigger `on_new_user_insert_default_piece_rates` fires on `auth.users` INSERT
- Trigger function uses `SECURITY DEFINER` and `SET search_path = ''`
- Function copies all rows from `product_defaults` into `products` with `NEW.id` as `user_id`
- RLS enabled on `products` and `orders` — policies enforce `auth.uid() = user_id`

## What's Built
- Full auth flow (login, signup, email verification, password reset)
- Products page: view, add, edit, delete piece rates
- Orders page: basic data display (WIP)

## What's Next
- Orders page: form to log completed orders
- Estimator: given upcoming order quantities, calculate estimated time and pay
- Estimation accuracy display: "based on X orders"
