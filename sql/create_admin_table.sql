-- Admin table + profiles is_admin migration for Supabase
-- Run these statements in the Supabase SQL editor (or via psql/migrations).

-- 1) Add an is_admin column to profiles (safe if already exists)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- 2) Create a dedicated admins table (optional, useful if you want audit/roles separate from profiles)
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text NULL
) TABLESPACE pg_default;

-- 3) Convenience: give an existing profile admin privileges by setting is_admin = true
-- Replace the WHERE clause with the condition matching the account you want to promote (email/username/id)
-- Example by username:
-- UPDATE public.profiles SET is_admin = true WHERE username = 'admin_username';

-- Example by profile id:
-- UPDATE public.profiles SET is_admin = true WHERE id = 'PUT-EXISTING-UUID-HERE';

-- 4) Optionally insert into admins table (keeps a separate record)
-- INSERT INTO public.admins (profile_id, role, notes) VALUES ('PUT-EXISTING-UUID-HERE', 'superadmin', 'Created via migration');

-- 5) Helpful query to find profiles linked to auth.users and their email (Supabase):
-- SELECT p.id, p.username, u.email, p.is_admin FROM public.profiles p
-- JOIN auth.users u ON u.id = p.id;

-- Notes:
-- - If your Supabase project relies on email matching for admin config (e.g., VITE_ADMIN_EMAIL), set that in your environment.
-- - Choose either the simple boolean flag (`is_admin` on `profiles`) OR the separate `admins` table approach. Both can coexist: use `is_admin` for fast checks and `admins` for audit/roles.
-- - Run the UPDATE statement after identifying the user to promote, or insert into `admins` table as needed.
