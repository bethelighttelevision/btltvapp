export interface Show {
  id: string;
  title: string;
  category: ShowCategory;
  description: string;
  thumbnail: string;
  host_name?: string;
  episode_count: number;
  youtube_playlist_id?: string;
}

export type ShowCategory =
  | 'All'
  | 'Talk Shows'
  | 'Devotional'
  | 'Drama'
  | 'Documentary'
  | 'Social Issues'
  | 'Health'
  | 'Education'
  | 'News'
  | 'Kids'
  | 'Promos';

export interface Episode {
  id: string;
  show_id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtube_video_id: string;
  duration: string;
  published_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor_name: string;
  lesson_count: number;
  enrollment_count: number;
  progress?: number;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content_text: string;
  video_url?: string;
  order: number;
  completed: boolean;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

export interface BibleBook {
  id: number;
  name: string;
  name_urdu: string;
  testament: 'old' | 'new';
  chapters: number;
  audio_urls: { [chapter: number]: string };
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  country?: string;
}
