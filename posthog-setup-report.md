# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the ELON admin dashboard. Client-side tracking was added via `instrumentation-client.ts` (Next.js 15.3+ initialization pattern), a reverse proxy was configured in `next.config.ts` to route events through `/ingest`, and a server-side PostHog client was created at `lib/posthog-server.ts`. Fourteen events were instrumented across seven files covering the full CRUD lifecycle for sellers, sales, promotions, users, and categories, plus WhatsApp outreach and dashboard refresh actions. Environment variables are stored in `.env.local` and referenced via `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event Name | Description | File |
|---|---|---|
| `seller_created` | Admin successfully creates a new seller account in the system. | `app/sellers/page.tsx` |
| `seller_updated` | Admin successfully updates an existing seller's information. | `app/sellers/page.tsx` |
| `seller_deleted` | Admin deletes a seller from the platform. | `app/sellers/page.tsx` |
| `seller_whatsapp_opened` | Admin opens the WhatsApp dialog to send seller credentials or info. | `components/sellers/sellers-table.tsx` |
| `sale_created` | Admin creates a new sale/promotion and assigns it to a seller. | `components/sales/sales-content.tsx` |
| `sale_updated` | Admin updates an existing sale's details such as price or expiry. | `components/sales/sales-content.tsx` |
| `sale_deleted` | Admin deletes a sale/promotion from the platform. | `components/sales/sales-content.tsx` |
| `user_created` | Admin registers a new buyer/user in the system. | `app/users/page.tsx` |
| `user_updated` | Admin updates an existing user's profile information. | `app/users/page.tsx` |
| `user_deleted` | Admin removes a user from the platform. | `app/users/page.tsx` |
| `category_created` | Admin adds a new product category to the system. | `app/categories/page.tsx` |
| `category_updated` | Admin renames or edits an existing product category. | `app/categories/page.tsx` |
| `category_deleted` | Admin deletes a product category from the system. | `app/categories/page.tsx` |
| `dashboard_refreshed` | Admin manually triggers a refresh of the dashboard statistics. | `app/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on admin activity, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/480631/dashboard/1743773)
- [Seller Management Activity](https://us.posthog.com/project/480631/insights/HCDnngKy)
- [Sales & Promotions Created](https://us.posthog.com/project/480631/insights/i09dkL6R)
- [Total Admin Actions This Month](https://us.posthog.com/project/480631/insights/KloNzj7M)
- [User Management Activity](https://us.posthog.com/project/480631/insights/1IHdEk9F)
- [WhatsApp Outreach vs Seller Growth](https://us.posthog.com/project/480631/insights/3EkTW9vF)

## Verify before merging

- [ ] Run `pnpm install` to install `posthog-js` and `posthog-node` — package installation was blocked in this session and the entries were written to `package.json` manually.
- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
