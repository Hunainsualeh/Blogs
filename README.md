# Global Insights Daily

An editorial magazine built with Next.js 16 (App Router, Cache Components), React 19 and Tailwind CSS 4. It has a public magazine, a contributor submission workflow, an editor admin area and an AdSense-ready advertising layer.

## Running locally

```
npm install
cp .env.example .env.local
npm run dev
```

Set `ADMIN_PASSWORD` (at least 12 characters) in `.env.local` to enable `/admin`. Without it the admin area stays switched off.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used in metadata, sitemap and structured data |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTRIBUTOR_EMAIL` | Default contact addresses, editable later in Admin, Settings |
| `ADMIN_PASSWORD` | Admin sign in password, at least 12 characters |
| `ADMIN_SESSION_SECRET` | Optional secret used to sign admin session cookies |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Persistent storage on serverless hosts such as Vercel |
| `DATA_DIR` | Folder for file storage when Redis is not configured (default `.data`) |
| `ADSENSE_ALLOW_TEST` | Set to `true` to load ads with the AdSense test flag outside production |

## Storage

Admin-managed content (articles, categories, settings, submissions, view counts and uploaded images) is stored through `lib/storage.ts`.

* With Upstash Redis variables set it uses the Redis REST API. Use this on Vercel.
* Otherwise it writes JSON files and uploads to `DATA_DIR`. Use this locally or on a server with a persistent disk. Serverless file systems are erased between deployments, so content saved there is lost.

The sample articles in `data/seeds` are placeholders. Hide them in Admin, Settings once real content is published.

## Admin area

`/admin` provides article creation, editing, publish, unpublish, scheduling, featured and popular ranking, category management, submission review, and advertising settings. Approving a contributor submission only creates a draft. An editor must publish it.

## Advertising

Ads are controlled in Admin, Advertising. Ads load only in production (`NODE_ENV=production` and, on Vercel, `VERCEL_ENV=production`). A placement renders nothing unless advertising is enabled, a valid publisher ID is saved and the placement has a slot ID. `/ads.txt` is generated from the saved publisher ID.

See `docs/OWNER-CHECKLIST.md` for items the site owner must verify before applying to AdSense.
