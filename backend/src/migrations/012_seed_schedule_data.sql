-- EMP001 John Doe → mixed remote hours
INSERT INTO scheduler_slots (employee_id, start_time, end_time, title, description) VALUES
('EMP001', '2025-09-29T08:00:00', '2025-09-29T13:00:00', 'Remote Work', 'Morning coding session'),
('EMP001', '2025-09-30T14:00:00', '2025-09-30T19:00:00', 'Remote Work', 'Afternoon project work'),
('EMP001', '2025-10-01T10:00:00', '2025-10-01T15:00:00', 'Remote Work', 'Feature development'),
('EMP001', '2025-10-02T16:00:00', '2025-10-02T21:00:00', 'Remote Work', 'Evening bug fixes');

-- EMP002 Sarah Johnson → prefers late shifts
INSERT INTO scheduler_slots (employee_id, start_time, end_time, title, description) VALUES
('EMP002', '2025-09-29T17:00:00', '2025-09-29T22:00:00', 'Remote Work', 'Evening product planning'),
('EMP002', '2025-09-30T11:00:00', '2025-09-30T16:00:00', 'Remote Work', 'Midday meetings + planning'),
('EMP002', '2025-10-01T09:00:00', '2025-10-01T14:00:00', 'Remote Work', 'Morning review'),
('EMP002', '2025-10-02T13:00:00', '2025-10-02T18:00:00', 'Remote Work', 'Afternoon strategy work');

-- EMP003 Michael Chen → scattered flexible hours
INSERT INTO scheduler_slots (employee_id, start_time, end_time, title, description) VALUES
('EMP003', '2025-09-29T07:00:00', '2025-09-29T12:00:00', 'Remote Work', 'Early UX testing'),
('EMP003', '2025-09-30T15:00:00', '2025-09-30T20:00:00', 'Remote Work', 'Evening design sprint'),
('EMP003', '2025-10-01T12:00:00', '2025-10-01T17:00:00', 'Remote Work', 'Afternoon collaboration'),
('EMP003', '2025-10-02T08:00:00', '2025-10-02T13:00:00', 'Remote Work', 'Morning prototype review');
