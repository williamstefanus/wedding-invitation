-- Insert Event Types
INSERT INTO public.event_types (id, slug, name, description, total_tables, rsvp_edit_deadline_at, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'wedding', 'Wedding Celebration', 'The holy matrimony and reception dinner of William & Aziel', 50, '2026-09-23 23:59:59+00', true),
  ('22222222-2222-2222-2222-222222222222', 'sangjit', 'Sangjit Ceremony', 'The traditional engagement ceremony', 10, '2026-07-23 23:59:59+00', true)
ON CONFLICT (id) DO NOTHING;

-- Insert Event Sessions (Wedding)
INSERT INTO public.event_sessions (id, event_type_id, slug, name, date, start_time, end_time, venue_name, address, google_maps_url, is_rsvp_option, sort_order)
VALUES
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', 'holy-matrimony', 'Holy Matrimony', '2026-10-23', '11:00:00', '12:00:00', 'IFGF Bandung Citylink', 'Festival Citylink Mall Lantai 3A', 'https://maps.app.goo.gl/example1', true, 1),
  ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', 'reception', 'Reception Dinner', '2026-10-23', '18:00:00', '20:00:00', 'Royal Dynasty Restaurant', 'Jl. Sudirman No.232A, 3rd Floor', 'https://maps.app.goo.gl/example2', true, 2)
ON CONFLICT (id) DO NOTHING;

-- Insert Guest
INSERT INTO public.guests (id, name, phone, owner, category, notes)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'John & Jane Doe', '+6281234567890', 'William', 'Friends', 'VIP Guest')
ON CONFLICT (id) DO NOTHING;

-- Insert Invitation
INSERT INTO public.invitations (id, guest_id, event_type_id, invitation_code, max_pax)
VALUES
  ('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'JOHNDOE26', 2)
ON CONFLICT (id) DO NOTHING;
