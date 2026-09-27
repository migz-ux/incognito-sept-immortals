# INCOGNITO SEPT IMMORTALS

A responsive, single-page clan hub for Car Parking Multiplayer. It includes an overview, leadership roster, account giveaway board, montages, gallery, and upcoming car meets.

## Run the site

The site uses Vite and the Supabase client. Install dependencies with `npm install`, configure the public Supabase URL and publishable key in `.env`, then run `npm run dev`. Open the local URL printed by Vite. Do not open `index.html` directly when testing Supabase features.

## Connect shared media storage

In the Supabase project configured in `.env`, run [`supabase/storage-setup.sql`](supabase/storage-setup.sql) in the SQL Editor. It creates the public `media` bucket with a 50 MB per-file limit and list/upload policies for approved video, audio, image, and document types. Montages, Gallery uploads, and member portraits are stored under separate folders and are available to visitors from the same public bucket.

Uploads are intentionally anonymous, as requested. The page hides upload controls from non-admin local profiles, but that is only a user-interface restriction; anyone can bypass it and upload an allowed file. Public uploads can consume project storage quota. The setup grants no public delete or update policy, so uploaded objects cannot be removed from the site controls.

Only use a Supabase publishable key in the browser. Never add a secret/service-role key to `.env` variables exposed to Vite, frontend code, or GitHub Pages. The service-role key previously present in the local VS Code launch configuration should be rotated in Supabase.

## Supabase Edge Function

[`supabase/functions/verify-session/index.ts`](supabase/functions/verify-session/index.ts) is an authenticated Edge Function that validates a Supabase user JWT and returns the caller's user ID. It uses Supabase's `@supabase/server` npm import directly, so no Node package install is needed. Edge Function runtime variables are injected by Supabase; keep the secret key out of the Vite `.env` and GitHub Pages variables.

Install the Supabase CLI, then run `supabase login`, `supabase link --project-ref slvtxezmnzdjkqhtwqcd`, and `supabase functions deploy verify-session`. For local function testing, put the local-only server values in an ignored `.env.local` and run `supabase functions serve verify-session --env-file .env.local`. Do not commit `.env.local` or paste the secret key into chat.

The current website login is browser-local, not Supabase Auth. This function accepts Supabase Auth access tokens, so it will not authenticate the existing local profiles until the frontend is migrated to Supabase Auth.

## Customize

- Replace `Owner name`, `Co-owner name`, and `Admin name` in `index.html` with the clan's actual member names.
- Update the schedule in both the overview calendar and the Car Meets section. Times are labeled UTC.
- Replace the montage and gallery placeholder tiles with the clan's real media when available.
- Update the giveaway status and announcement when giveaway details are confirmed. The current board does not collect entries or display account credentials.

Navigation between sections works locally in the page. Applicants can use **Check Application** with their CPM ID to see whether an admin has replied. Admins can use **Applications** to review forms and save replies.

Applications and replies are stored in browser `localStorage` only. A real shared admin inbox, authentication, and cross-device applicant access require a backend or hosted form service.

Profiles, applications, giveaway settings, and member roles are still saved in browser `localStorage`; only montage and gallery files are shared through Supabase.

## Publish at `www.incognitoseptimmortals.com`

The site is prepared for GitHub Pages, but it is not live yet because this workspace is not connected to a GitHub repository. The workflow in `.github/workflows/pages.yml` builds and publishes the Vite `dist` folder.

1. Create a GitHub repository and upload the project files, including `CNAME`.
1. In **Settings → Secrets and variables → Actions → Variables**, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` using the public values from the selected Supabase project.
1. Enable GitHub Pages with **GitHub Actions** as the source. Set `www.incognitoseptimmortals.com` as the custom domain.
1. At your DNS provider, add a `CNAME` record for host `www` pointing to the GitHub Pages hostname shown in the repository's Pages settings.
1. After DNS propagates, enable **Enforce HTTPS** in the repository's Pages settings.

DNS changes can take up to 24 hours to propagate. Configure the custom domain in GitHub before adding its DNS record. To redirect the apex domain to `www`, configure that redirect with your DNS provider.
