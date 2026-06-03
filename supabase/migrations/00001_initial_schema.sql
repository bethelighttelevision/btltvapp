-- BTL TV Mobile App - Initial Database Schema
-- Run this in Supabase Dashboard SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Shows table
CREATE TABLE IF NOT EXISTS public.shows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  host_name TEXT,
  episode_count INTEGER DEFAULT 0,
  youtube_playlist_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;

-- Episodes table
CREATE TABLE IF NOT EXISTS public.episodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  show_id UUID REFERENCES public.shows(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  youtube_video_id TEXT NOT NULL,
  duration TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- Courses table (Bible School)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  instructor_name TEXT,
  lesson_count INTEGER DEFAULT 0,
  enrollment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_text TEXT,
  video_url TEXT,
  lesson_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- User progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  quiz_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, content_type, content_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Shows: public read, admin write
CREATE POLICY "Shows public read" ON public.shows FOR SELECT USING (true);

-- Episodes: public read
CREATE POLICY "Episodes public read" ON public.episodes FOR SELECT USING (true);

-- Courses: public read
CREATE POLICY "Courses public read" ON public.courses FOR SELECT USING (true);

-- Lessons: public read
CREATE POLICY "Lessons public read" ON public.lessons FOR SELECT USING (true);

-- User progress: users can read/update own progress
CREATE POLICY "Users view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Bookmarks: users can read/manage own bookmarks
CREATE POLICY "Users view own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Seed data: Insert shows
INSERT INTO public.shows (title, category, description, thumbnail, episode_count) VALUES
('Debate', 'Talk Shows', 'Engaging discussions on faith and society.', '/images/programs/debate.webp', 2),
('Connection', 'Talk Shows', 'Connecting faith with everyday life.', '/images/programs/connection.webp', 21),
('295C', 'Social Issues', 'Addressing critical social and legal issues.', '/images/programs/295c.webp', 63),
('Meri Aawaz Suno', 'Talk Shows', 'A platform for voices that need to be heard.', '/images/programs/meri-awaz-suno.webp', 646),
('Bol K Lab Azad Hain Tere', 'Talk Shows', 'Freedom of expression through faith-based dialogue.', '/images/programs/bol-k-lub-azad-hai-tere.webp', 42),
('Ora et Labora', 'Documentary', 'Pray and work — faith in action.', '/images/programs/ora-et-labora.webp', 18),
('Ochtend met Jezus | Predikant Douwe Wijmenga', 'Devotional', 'Morning devotional with Pastor Douwe Wijmenga.', '/images/programs/morning-with-jesus-predikant-douwe-wijmenga.webp', 47),
('Masihi Zindagi', 'Devotional', 'Christian living guidance and inspiration.', '/images/programs/masihi-zindagi.webp', 11),
('Yesu Sang Sawera | Pastor Munawar Virk', 'Devotional', 'Morning with Jesus devotional.', '/images/programs/yesu-sang-sawera-pastor-munawar-virk.webp', 7),
('Daagh', 'Drama', 'A compelling drama series.', '/images/programs/daag.webp', 13),
('Bandhan', 'Drama', 'Bonds of love and faith.', '/images/programs/bandhan.webp', 15),
('Aap Ki Sehat', 'Health', 'Your health — physical and spiritual well-being.', '/images/programs/aap-ki-sehat.webp', 29),
('Aao Chalein', 'Documentary', 'Let us journey together.', '/images/programs/aao-chalein.webp', 225),
('Career Guide', 'Education', 'Guidance for career and professional growth.', '/images/programs/career-guide.webp', 9),
('BTL TV News & Updates', 'News', 'Latest news and updates from BTL TV.', '/images/programs/news.webp', 4),
('Urdu Bible', 'Devotional', 'The Holy Bible in Urdu.', '/images/programs/urdu-bible.webp', 80);

-- Seed data: Bible School courses
INSERT INTO public.courses (title, description, instructor_name, lesson_count) VALUES
('Understanding the Bible', 'A comprehensive introduction to the Holy Scriptures', 'Pastor Munawar Virk', 12),
('Life of Jesus Christ', 'Walk through the Gospels and discover Jesus', 'Pastor Sarfaraz Rehmat', 8),
('Christian Living', 'Practical guidance for daily faith', 'Bishop Emmanuel Aftab', 10);
