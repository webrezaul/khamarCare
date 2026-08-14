# Database Information

Based on the project dependencies, this application utilizes two types of databases:

## 1. Supabase (PostgreSQL)
The app uses `@supabase/supabase-js`, indicating that **Supabase** is the primary backend database. Supabase is an open-source Firebase alternative that provides a fully managed PostgreSQL database.

## 2. IndexedDB (via Dexie.js)
The app includes `dexie` and `dexie-react-hooks`. **Dexie.js** is a minimalist wrapper for IndexedDB. This means the application uses a local, in-browser database, likely for offline support, local caching, or client-side state management.
