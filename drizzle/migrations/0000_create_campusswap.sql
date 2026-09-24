CREATE TABLE public.colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  city text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.colleges TO anon;
GRANT SELECT, INSERT ON public.colleges TO authenticated;
GRANT ALL ON public.colleges TO service_role;

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Anyone can add colleges" ON public.colleges FOR INSERT WITH CHECK (char_length(trim(name)) BETWEEN 2 AND 120);

CREATE TABLE public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'Books',
  condition text,
  deal_type text NOT NULL DEFAULT 'sale',
  price numeric(10,2),
  college_id uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  location text,
  seller_name text NOT NULL,
  seller_detail text,
  contact text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX listings_college_idx ON public.listings(college_id);
CREATE INDEX listings_created_idx ON public.listings(created_at DESC);

GRANT SELECT, INSERT ON public.listings TO anon;
GRANT SELECT, INSERT ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listings" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Anyone can add listings" ON public.listings FOR INSERT WITH CHECK (
  char_length(trim(title)) BETWEEN 2 AND 140
  AND char_length(trim(seller_name)) BETWEEN 2 AND 80
  AND deal_type IN ('sale','free','swap')
);

INSERT INTO public.colleges (name, city) VALUES
  ('St. Xavier''s College', 'Mumbai'),
  ('Christ University', 'Bengaluru'),
  ('Delhi Technological University', 'Delhi'),
  ('Manipal Institute of Technology', 'Manipal');

INSERT INTO public.listings (title, description, category, condition, deal_type, price, college_id, location, seller_name, seller_detail)
SELECT 'Thomas'' Calculus, 14th Edition', 'Standard first-year calculus text.', 'Books', 'Good — light pencil notes', 'sale', 450, id, 'Academic Block C · Hostel A-214', 'Ananya R.', '2nd year, Civil' FROM public.colleges WHERE name = 'Delhi Technological University';

INSERT INTO public.listings (title, description, category, condition, deal_type, price, college_id, location, seller_name, seller_detail)
SELECT 'Foldable LED study lamp', 'Three brightness levels, USB powered.', 'Hostel', 'Like new', 'sale', 300, id, 'Block D — Boys Hostel · Room 118', 'Mohit K.', '3rd year, BBA' FROM public.colleges WHERE name = 'Christ University';

INSERT INTO public.listings (title, description, category, condition, deal_type, price, college_id, location, seller_name, seller_detail)
SELECT 'Firefox Cyclone 26T bicycle', 'New tyres fitted last month.', 'Cycles', 'Fair', 'sale', 3200, id, 'Block 17 — Parking Bay', 'Ishan P.', '4th year, Mechanical' FROM public.colleges WHERE name = 'Manipal Institute of Technology';

INSERT INTO public.listings (title, description, category, condition, deal_type, price, college_id, location, seller_name, seller_detail)
SELECT 'Casio FX-991EX scientific calculator', 'Barely used, with cover.', 'Electronics', 'Excellent', 'sale', 700, id, 'Library Block', 'Sara M.', '3rd year, ECE' FROM public.colleges WHERE name = 'Delhi Technological University';

INSERT INTO public.listings (title, description, category, condition, deal_type, price, college_id, location, seller_name, seller_detail)
SELECT 'Cricket kit — bat, pads, gloves', 'Looking to swap for a badminton set.', 'Sports', 'Well used, sturdy', 'swap', NULL, id, 'Sports Complex, Block B', 'Devansh T.', '2nd year, BCom' FROM public.colleges WHERE name = 'St. Xavier''s College';

INSERT INTO public.listings (title, description, category, condition, deal_type, price, college_id, location, seller_name, seller_detail)
SELECT 'Drafting board + instrument box', 'Giving away, first come first served.', 'Art & Design', 'Used, fully working', 'free', NULL, id, 'Block 9 — Design Studio · Studio 2', 'Rhea D.', '4th year, Architecture' FROM public.colleges WHERE name = 'Manipal Institute of Technology';