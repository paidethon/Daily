-- Records table
CREATE TABLE IF NOT EXISTS records (
  id TEXT PRIMARY KEY,
  record_date TEXT NOT NULL,
  title TEXT,
  content TEXT,
  location TEXT,
  mood TEXT,
  weather TEXT,
  tags TEXT DEFAULT '[]',
  is_draft INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT DEFAULT 'image/jpeg',
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  thumbnail_data TEXT,
  medium_data TEXT,
  original_data TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (record_id) REFERENCES records(id) ON DELETE CASCADE
);

-- Albums table
CREATE TABLE IF NOT EXISTS albums (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'monthly',
  title TEXT NOT NULL,
  cover_photo_id TEXT,
  start_date TEXT,
  end_date TEXT,
  item_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#C4A265',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_records_date ON records(record_date);
CREATE INDEX IF NOT EXISTS idx_photos_record ON photos(record_id);
