-- Insert Roles
INSERT INTO roles (name) VALUES
  ('admin'),
  ('manager'),
  ('editor'),
  ('support'),
  ('user');

-- Insert Permissions
INSERT INTO permissions (code, description) VALUES
  ('CREATE_USER', 'Ability to create new users'),
  ('DELETE_USER', 'Ability to delete users'),
  ('UPDATE_USER', 'Ability to update user details'),
  ('VIEW_USER', 'Ability to view user profiles'),
  ('MANAGE_ROLES', 'Ability to assign and manage roles'),
  ('VIEW_REPORTS', 'Access to view system reports'),
  ('EXPORT_DATA', 'Permission to export data'),
  ('IMPORT_DATA', 'Permission to import data'),
  ('RESET_PASSWORD', 'Ability to reset user passwords'),
  ('ACCESS_SUPPORT_TICKETS', 'Ability to view and manage support tickets');

-- Assign Role ↔ Permissions
-- Admin gets everything
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Manager: manage users, view reports, export/import
INSERT INTO role_permissions (role_id, permission_id) VALUES
  (2, 1), -- CREATE_USER
  (2, 3), -- UPDATE_USER
  (2, 4), -- VIEW_USER
  (2, 6), -- VIEW_REPORTS
  (2, 7), -- EXPORT_DATA
  (2, 8); -- IMPORT_DATA

-- Editor: update & view users
INSERT INTO role_permissions (role_id, permission_id) VALUES
  (3, 3), -- UPDATE_USER
  (3, 4); -- VIEW_USER

-- Support: view users + support tickets + reset passwords
INSERT INTO role_permissions (role_id, permission_id) VALUES
  (4, 4),  -- VIEW_USER
  (4, 9),  -- RESET_PASSWORD
  (4, 10); -- ACCESS_SUPPORT_TICKETS

-- User: can only view own profile
INSERT INTO role_permissions (role_id, permission_id) VALUES
  (5, 4); -- VIEW_USER
