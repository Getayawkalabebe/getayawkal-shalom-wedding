CREATE TABLE IF NOT EXISTS rsvps (
 request_id text PRIMARY KEY,
 name text NOT NULL,
 phone text NOT NULL,
 attendance text NOT NULL CHECK (attendance IN ('yes','no')),
 guests integer NOT NULL,
 side text NOT NULL CHECK (side IN ('groom','bride','both')),
 message text NOT NULL DEFAULT '',
 updated_at timestamptz NOT NULL DEFAULT NOW(),
 CHECK ((attendance='yes' AND guests BETWEEN 1 AND 6) OR (attendance='no' AND guests=0))
);

-- Atomic per-client submission limits, shared by all function instances.
CREATE TABLE IF NOT EXISTS rsvp_rate_limits (
 client_hash text PRIMARY KEY,
 window_start timestamptz NOT NULL,
 attempts integer NOT NULL
);
