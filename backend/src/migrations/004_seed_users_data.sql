INSERT INTO users (user_id, name, email, password_hash, phone, role_id)
VALUES
  ('U001', 'Alice Johnson', 'alice@example.com', crypt('123456', gen_salt('bf')), '01710000001', 1),
  ('U002', 'Bob Smith', 'bob@example.com', crypt('123456', gen_salt('bf')), '01710000002', 2),
  ('U003', 'Charlie Brown', 'charlie@example.com', crypt('123456', gen_salt('bf')), '01710000003', 3),
  ('U004', 'Diana Prince', 'diana@example.com', crypt('123456', gen_salt('bf')), '01710000004', 4),
  ('U005', 'Ethan Hunt', 'ethan@example.com', crypt('123456', gen_salt('bf')), '01710000005', 5),
  ('U006', 'Fiona Gallagher', 'fiona@example.com', crypt('123456', gen_salt('bf')), '01710000006', 2),
  ('U007', 'George Miller', 'george@example.com', crypt('123456', gen_salt('bf')), '01710000007', 3),
  ('U008', 'Hannah Davis', 'hannah@example.com', crypt('123456', gen_salt('bf')), '01710000008', 4),
  ('U009', 'Ian Wright', 'ian@example.com', crypt('123456', gen_salt('bf')), '01710000009', 5),
  ('U010', 'Julia Roberts', 'julia@example.com', crypt('123456', gen_salt('bf')), '01710000010', 1);
