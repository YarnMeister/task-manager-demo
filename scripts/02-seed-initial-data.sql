-- Insert initial tabs
INSERT INTO tabs (name, color) VALUES 
  ('Work', '#3B82F6'),
  ('Personal', '#10B981'),
  ('RTSE', '#F59E0B')
ON CONFLICT DO NOTHING;

-- Get tab IDs for categories
WITH tab_ids AS (
  SELECT id, name FROM tabs WHERE name IN ('Work', 'Personal', 'RTSE')
)
-- Insert initial categories
INSERT INTO categories (name, tab_id, color) 
SELECT 'Ad hoc', t.id, '#3B82F6' FROM tab_ids t WHERE t.name = 'Work'
UNION ALL
SELECT 'Connectors / API Pilot project', t.id, '#8B5CF6' FROM tab_ids t WHERE t.name = 'Work'
UNION ALL
SELECT 'Customer First / Program', t.id, '#EC4899' FROM tab_ids t WHERE t.name = 'Work'
UNION ALL
SELECT 'REA general', t.id, '#06B6D4' FROM tab_ids t WHERE t.name = 'Work'
UNION ALL
SELECT 'Emails/Online', t.id, '#10B981' FROM tab_ids t WHERE t.name = 'Personal'
UNION ALL
SELECT 'Weekend jobs', t.id, '#10B981' FROM tab_ids t WHERE t.name = 'Personal'
UNION ALL
SELECT 'Home improvement', t.id, '#06B6D4' FROM tab_ids t WHERE t.name = 'Personal'
UNION ALL
SELECT 'Shopping', t.id, '#8B5CF6' FROM tab_ids t WHERE t.name = 'Personal'
UNION ALL
SELECT 'Research', t.id, '#3B82F6' FROM tab_ids t WHERE t.name = 'Personal'
UNION ALL
SELECT 'Ad hoc', t.id, '#EC4899' FROM tab_ids t WHERE t.name = 'Personal'
UNION ALL
SELECT 'Xero improvements', t.id, '#F59E0B' FROM tab_ids t WHERE t.name = 'RTSE'
UNION ALL
SELECT 'Katana improvements', t.id, '#F59E0B' FROM tab_ids t WHERE t.name = 'RTSE'
UNION ALL
SELECT 'Pipedrive improvements', t.id, '#F59E0B' FROM tab_ids t WHERE t.name = 'RTSE'
UNION ALL
SELECT 'Board meeting tasks', t.id, '#EF4444' FROM tab_ids t WHERE t.name = 'RTSE'
UNION ALL
SELECT 'General', t.id, '#8B5CF6' FROM tab_ids t WHERE t.name = 'RTSE'
UNION ALL
SELECT 'Research', t.id, '#EC4899' FROM tab_ids t WHERE t.name = 'RTSE'
ON CONFLICT DO NOTHING;
