-- Seed data for development
INSERT OR IGNORE INTO records (id, record_date, title, content, location, mood, weather) VALUES
  ('rec_001', '2025-12-15', NULL, '在南京的一天，整理了工作桌面，感觉生活需要一些仪式感。', '江苏省南京市', 'calm', 'cloudy'),
  ('rec_002', '2025-12-09', NULL, '今天吃了Five Guys的汉堡，薯条和洋葱圈都很好吃。', '江苏省南京市', 'happy', 'sunny'),
  ('rec_003', '2025-12-01', NULL, '冬天的南京，傍晚的天空特别好看。粉紫色的晚霞铺满了天际。', '江苏省南京市', 'peaceful', 'clear');

INSERT OR IGNORE INTO photos (id, record_id, file_name, sort_order) VALUES
  ('photo_001', 'rec_001', 'desk-setup.jpg', 0),
  ('photo_002', 'rec_002', 'burger-meal.jpg', 0),
  ('photo_003', 'rec_003', 'sunset-sky.jpg', 0);
