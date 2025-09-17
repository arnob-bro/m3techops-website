-- INSERT INTO users (user_id, email, password_hash, role)
-- VALUES
--   ('U001', 'alice@example.com', crypt('123456', gen_salt('bf')), 'employee'),
--   ('U002', 'bob@example.com', crypt('123456', gen_salt('bf')), 'employee'),
--   ('U003', 'charlie@example.com', crypt('123456', gen_salt('bf')), 'employee'),
--   ('U004', 'diana@example.com', crypt('123456', gen_salt('bf')), 'employee'),
--   ('U005', 'ethan@example.com', crypt('123456', gen_salt('bf')), 'employee'),
--   ('U006', 'fiona@example.com', crypt('123456', gen_salt('bf')), 'employee'),
--   ('U007', 'george@example.com', crypt('123456', gen_salt('bf')), 'employee'),
--   ('U008', 'hannah@example.com', crypt('123456', gen_salt('bf')), 'employee'),
--   ('U009', 'ian@example.com', crypt('123456', gen_salt('bf')), 'employee'),
--   ('U010', 'julia@example.com', crypt('123456', gen_salt('bf')), 'employee');
INSERT INTO users (user_id, email, password_hash, role) VALUES
('EMP001', 'john.doe@example.com', crypt('123456', gen_salt('bf')), 'employee'),
('EMP002', 'sarah.johnson@example.com', crypt('123456', gen_salt('bf')), 'employee'),
('EMP003', 'michael.chen@example.com', crypt('123456', gen_salt('bf')), 'employee'),
('EMP004', 'emma.williams@example.com', crypt('123456', gen_salt('bf')), 'employee'),
('EMP005', 'david.kim@example.com', crypt('123456', gen_salt('bf')), 'employee'),
('EMP006', 'olivia.brown@example.com', crypt('123456', gen_salt('bf')), 'employee'),
('EMP007', 'james.davis@example.com', crypt('123456', gen_salt('bf')), 'employee'),
('EMP008', 'sophia.martinez@example.com', crypt('123456', gen_salt('bf')), 'employee'),
('EMP009', 'william.lee@example.com', crypt('123456', gen_salt('bf')), 'employee'),
('EMP010', 'isabella.taylor@example.com', crypt('123456', gen_salt('bf')), 'employee'),
('EMP011', 'alexander.wilson@example.com', crypt('123456', gen_salt('bf')), 'employee'),
('EMP012', 'mia.anderson@example.com', crypt('123456', gen_salt('bf')), 'employee');
