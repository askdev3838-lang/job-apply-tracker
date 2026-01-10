-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    company_location TEXT NOT NULL,
    company_industry TEXT NOT NULL,
    company_salary_range TEXT,
    position TEXT NOT NULL,
    skills TEXT[],
    application_date TEXT NOT NULL,
    cover_letter TEXT,
    salary_expectation TEXT,
    job_posting_url TEXT,
    job_posting_content TEXT,
    source TEXT NOT NULL,
    work_type TEXT NOT NULL CHECK (work_type IN ('remote', 'hybrid', 'onsite')),
    notes TEXT,
    contacts JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries by user
CREATE INDEX IF NOT EXISTS applications_user_id_idx ON public.applications(user_id);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only see their own applications
CREATE POLICY "Users can view own applications" ON public.applications
    FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policy: Users can insert their own applications
CREATE POLICY "Users can insert own applications" ON public.applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can update their own applications
CREATE POLICY "Users can update own applications" ON public.applications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policy: Users can delete their own applications
CREATE POLICY "Users can delete own applications" ON public.applications
    FOR DELETE USING (auth.uid() = user_id);

-- Optional: Create user_settings table for per-user settings
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    hide_rejected BOOLEAN DEFAULT FALSE,
    custom_sources TEXT[] DEFAULT '{}',
    custom_industries TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_settings
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);
