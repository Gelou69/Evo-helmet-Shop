-- SQL schema for Supabase tables (provided by user)

-- products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name character varying NOT NULL,
  description text NULL,
  price numeric NOT NULL,
  stock_quantity smallint NOT NULL DEFAULT 1,
  image_path character varying NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  color character varying NULL,
  CONSTRAINT products_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity smallint NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  size character varying NOT NULL DEFAULT 'M'::character varying,
  color character varying NOT NULL DEFAULT 'Black'::character varying,
  CONSTRAINT cart_items_pkey PRIMARY KEY (user_id, product_id, size),
  CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE,
  CONSTRAINT cart_items_quantity_check CHECK ((quantity >= 1))
) TABLESPACE pg_default;

-- trigger placeholder for cart_items (expects function set_updated_at_cart to exist in DB)
-- Note: create the function set_updated_at_cart() in your DB; this trigger will call it on update.
CREATE TRIGGER IF NOT EXISTS handle_updated_at_cart
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_cart();

-- profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  updated_at timestamp with time zone NULL DEFAULT now(),
  username text NULL,
  full_name text NULL,
  age integer NULL,
  phone text NULL,
  address text NULL,
  is_admin boolean DEFAULT false,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_username_key UNIQUE (username),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT username_length CHECK ((char_length(username) >= 3))
) TABLESPACE pg_default;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles USING btree (username) TABLESPACE pg_default;

-- trigger placeholder for profiles (expects function set_updated_at to exist in DB)
CREATE TRIGGER IF NOT EXISTS handle_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- order_items table (duplicated in original input — included once here)
CREATE TABLE IF NOT EXISTS public.order_items (
  order_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity smallint NOT NULL,
  price_at_purchase numeric NOT NULL,
  product_size character varying NOT NULL,
  image_path character varying NULL,
  product_color character varying NULL,
  CONSTRAINT order_items_pkey PRIMARY KEY (order_id, product_id, product_size),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
) TABLESPACE pg_default;

-- Note: This file creates table definitions only. Make sure required functions (set_updated_at, set_updated_at_cart)
-- and referenced tables (auth.users, orders) exist in your database. Run this against your Supabase DB using the SQL editor
-- or via a migration pipeline.
