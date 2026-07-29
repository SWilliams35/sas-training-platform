# Setup Guide - SAS Team Training Platform

## Database Setup (Supabase)

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Click "Start your project" 
3. Create new project: name `sas-training-platform`
4. Save your database password
5. Wait for project to initialize

### Step 2: Create Tables

In Supabase dashboard → SQL Editor → Create new query → paste this:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Modules table
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('Not Started', 'In Progress', 'Completed')),
  progress_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Insert 30 modules
INSERT INTO modules (module_id, title, category, order_index) VALUES
('DESC-1', 'DESC Operator Basics', 'DESC Operator', 1),
('DESC-2', 'DESC Role Overview', 'DESC Operator', 2),
('DESC-3', 'DESC Systems Training', 'DESC Operator', 3),
('DESC-4', 'DESC Operations', 'DESC Operator', 4),
('DESC-5', 'DESC Advanced Topics', 'DESC Operator', 5),
('DESC-6', 'DESC Incident Response', 'DESC Operator', 6),
('DESC-7', 'DESC Escalations', 'DESC Operator', 7),
('DESC-8', 'DESC Reporting', 'DESC Operator', 8),
('SOP-1', 'SOP Overview', 'SOP Training', 9),
('SOP-2', 'SOP Procedures 1', 'SOP Training', 10),
('SOP-3', 'SOP Procedures 2', 'SOP Training', 11),
('SOP-4', 'SOP Access Control', 'SOP Training', 12),
('SOP-5', 'SOP Incident Handling', 'SOP Training', 13),
('SOP-6', 'SOP Documentation', 'SOP Training', 14),
('SOP-7', 'SOP Best Practices', 'SOP Training', 15),
('SOP-8', 'SOP Advanced', 'SOP Training', 16),
('SAFE-1', 'Physical Security Basics', 'Safety Training', 17),
('SAFE-2', 'Building Access', 'Safety Training', 18),
('SAFE-3', 'Emergency Procedures', 'Safety Training', 19),
('SAFE-4', 'Fire Safety', 'Safety Training', 20),
('SAFE-5', 'Active Threats', 'Safety Training', 21),
('SAFE-6', 'Evacuation Procedures', 'Safety Training', 22),
('SAFE-7', 'Medical Response', 'Safety Training', 23),
('SAFE-8', 'Badge Management', 'Safety Training', 24),
('SAFE-9', 'Lock Down Procedures', 'Safety Training', 25),
('SAFE-10', 'First Aid', 'Safety Training', 26),
('SAFE-11', 'Communication Protocols', 'Safety Training', 27),
('SAFE-12', 'Security Awareness', 'Safety Training', 28),
('SAFE-13', 'Vendor Management', 'Safety Training', 29),
('SAFE-14', 'Compliance Certification', 'Safety Training', 30);
```

### Step 3: Get Your Keys
- Settings → API
- Copy:
  - `Project URL`
  - `anon key` (public key)
  - `service_role key` (secret key)
- Save these in a notepad

---

## What You Now Have

✅ PostgreSQL database  
✅ 30 modules pre-loaded  
✅ 3 API keys ready  

**Next:** Follow DEPLOYMENT.md
