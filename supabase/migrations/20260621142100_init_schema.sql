-- 00000000000000_init_schema.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. ENUMS
-- ==========================================
CREATE TYPE public.guest_category AS ENUM ('Relatives', 'Friends', 'Church');
CREATE TYPE public.guest_owner AS ENUM ('William', 'Aziel');
CREATE TYPE public.attendance_status AS ENUM ('attending', 'not_attending');

-- ==========================================
-- 2. TABLES
-- ==========================================

-- 2.1 Event Types
CREATE TABLE public.event_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    total_tables INTEGER DEFAULT 0,
    rsvp_edit_deadline_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.2 Event Sessions
CREATE TABLE public.event_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type_id UUID NOT NULL REFERENCES public.event_types(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    date DATE,
    start_time TIME,
    end_time TIME,
    venue_name TEXT,
    address TEXT,
    google_maps_url TEXT,
    is_rsvp_option BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(event_type_id, slug)
);

-- 2.3 Guests
CREATE TABLE public.guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT,
    owner public.guest_owner,
    category public.guest_category,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.4 Invitations
CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    event_type_id UUID NOT NULL REFERENCES public.event_types(id) ON DELETE CASCADE,
    invitation_code TEXT UNIQUE NOT NULL,
    max_pax INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(guest_id, event_type_id)
);

-- 2.5 RSVPs
CREATE TABLE public.rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    attendance_status public.attendance_status NOT NULL,
    confirmed_pax INTEGER DEFAULT 0 NOT NULL,
    wish_message TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(invitation_id)
);

-- 2.6 RSVP Selected Sessions
CREATE TABLE public.rsvp_selected_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rsvp_id UUID NOT NULL REFERENCES public.rsvps(id) ON DELETE CASCADE,
    event_session_id UUID NOT NULL REFERENCES public.event_sessions(id) ON DELETE CASCADE,
    UNIQUE(rsvp_id, event_session_id)
);

-- 2.7 Seating Tables
CREATE TABLE public.seating_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type_id UUID NOT NULL REFERENCES public.event_types(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    position_x INTEGER,
    position_y INTEGER,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(event_type_id, table_name)
);

-- 2.8 Seating Assignments
CREATE TABLE public.seating_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    seating_table_id UUID NOT NULL REFERENCES public.seating_tables(id) ON DELETE CASCADE,
    assigned_pax INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(invitation_id)
);

-- 2.9 Gallery Images
CREATE TABLE public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type_id UUID NOT NULL REFERENCES public.event_types(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.10 Settings
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. TRIGGERS (Auto-update updated_at)
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_updated_at_event_types BEFORE UPDATE ON public.event_types FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_event_sessions BEFORE UPDATE ON public.event_sessions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_guests BEFORE UPDATE ON public.guests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_invitations BEFORE UPDATE ON public.invitations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_rsvps BEFORE UPDATE ON public.rsvps FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_seating_tables BEFORE UPDATE ON public.seating_tables FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_seating_assignments BEFORE UPDATE ON public.seating_assignments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_gallery_images BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_settings BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ==========================================
-- 4. SEED DATA
-- ==========================================

DO $$
DECLARE
    wedding_id UUID := uuid_generate_v4();
    sangjit_id UUID := uuid_generate_v4();
    i INT;
BEGIN
    -- Insert Event Types
    INSERT INTO public.event_types (id, slug, name, description, total_tables)
    VALUES 
        (wedding_id, 'wedding', 'Wedding', 'Holy Matrimony and Reception Dinner', 23),
        (sangjit_id, 'sangjit', 'Sangjit', 'Sangjit Ceremony', 40);

    -- Insert Event Sessions for Wedding
    INSERT INTO public.event_sessions (event_type_id, slug, name, is_rsvp_option, sort_order)
    VALUES 
        (wedding_id, 'holy-matrimony', 'Holy Matrimony', true, 1),
        (wedding_id, 'reception-dinner', 'Reception Dinner', true, 2);

    -- Insert Seating Tables for Wedding (23 tables)
    FOR i IN 1..23 LOOP
        INSERT INTO public.seating_tables (event_type_id, table_name, capacity, sort_order)
        VALUES (wedding_id, 'Table ' || i, 10, i);
    END LOOP;

    -- Insert Seating Tables for Sangjit (40 tables)
    FOR i IN 1..40 LOOP
        INSERT INTO public.seating_tables (event_type_id, table_name, capacity, sort_order)
        VALUES (sangjit_id, 'Table ' || i, 10, i);
    END LOOP;
END $$;
