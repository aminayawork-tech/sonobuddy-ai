-- Scan history: stores AI analysis results only — no images, no patient PHI.
-- What's saved: protocol, findings text, measurements, confidence, alert level, timestamp.
-- What's never saved: the ultrasound image, patient name, MRN, DOB, or any machine overlay data.

create table if not exists scan_history (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references profiles(id) on delete cascade,
  created_at      timestamptz not null default now(),
  protocol_id     text        not null,
  protocol_name   text        not null,
  protocol_icon   text,
  alert_level     text        not null default 'none',
  confidence      integer,
  image_quality   text,
  summary         text,
  findings        jsonb       not null default '[]',
  measurements    jsonb       not null default '[]',
  labels          jsonb       not null default '[]',
  recommendations jsonb       not null default '[]'
);

alter table scan_history enable row level security;

create policy "users own their scan history"
  on scan_history
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index scan_history_user_created on scan_history (user_id, created_at desc);
