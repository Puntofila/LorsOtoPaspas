# LORS OTO PASPAS production setup

## Required services

- PostgreSQL database
- Vercel Blob store
- NextAuth secret and production URL
- Google OAuth credentials when Google sign-in is enabled
- Google Places or Business Profile credentials when review sync is enabled

## First deployment

1. Create an empty PostgreSQL database and set `DATABASE_URL`.
2. Run `npm run db:migrate -- --name working-system`.
3. Run `npm run db:seed` to create branches, product options and the complete vehicle catalog.
4. Change all seeded demo passwords or remove the demo accounts before launch.
5. Set `BLOB_READ_WRITE_TOKEN`, `NEXTAUTH_URL` and `NEXTAUTH_SECRET`.
6. Run `npm run build`, then `npm start`.

Existing SQLite data must be exported before switching production traffic. Import users and orders into
PostgreSQL, map the legacy `ADMIN` role to `DIRECTOR`, then run the seed command to populate reference data.

## Backups

Run a daily managed PostgreSQL backup. Before schema deployments, also create a manual `pg_dump` snapshot.
Vercel Blob files are referenced by URL from orders and must not be deleted while an order is retained.
