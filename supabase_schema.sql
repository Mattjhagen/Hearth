-- Create tables
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name text,
  avatar text,
  location text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.gatherings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  host_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  date text NOT NULL,
  location text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.skills (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('offer', 'request')),
  title text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.gathering_attendees (
  gathering_id uuid REFERENCES public.gatherings(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (gathering_id, user_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gatherings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gathering_attendees ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, only the user can update their own
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Gatherings: anyone can read, authenticated users can create, hosts can update/delete
CREATE POLICY "Gatherings are viewable by everyone." ON public.gatherings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create gatherings." ON public.gatherings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Hosts can update their gatherings." ON public.gatherings FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Hosts can delete their gatherings." ON public.gatherings FOR DELETE USING (auth.uid() = host_id);

-- Skills: anyone can read, authenticated users can create, owners can update/delete
CREATE POLICY "Skills are viewable by everyone." ON public.skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create skills." ON public.skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Owners can update their skills." ON public.skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their skills." ON public.skills FOR DELETE USING (auth.uid() = user_id);

-- Attendees: anyone can read, users can join/leave
CREATE POLICY "Attendees are viewable by everyone." ON public.gathering_attendees FOR SELECT USING (true);
CREATE POLICY "Users can join gatherings." ON public.gathering_attendees FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY "Users can leave gatherings." ON public.gathering_attendees FOR DELETE USING (auth.uid() = user_id);
