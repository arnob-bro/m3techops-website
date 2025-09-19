INSERT INTO payslips (
    company_name, company_address, reference, payment_month, 
    employee_name, designation, employee_id, pay_date, 
    earnings, deductions, net_pay, 
    payment_mode, account_holder, bank_name, bank_branch, account_number, 
    bkash_transaction, authorized_by, payee, logo, logo_url, note, status, created_at, updated_at
) VALUES
-- Payslip 1
('m³ techOps Ltd.', '123, ABC Street, Dhaka, Bangladesh', 'REF-2025-001', 'August 2025',
 'Abdul Rahman', 'Software Engineer', 'EMP001', '2025-08-31',
 80000.00, 5000.00, 75000.00,
 'Bank Transfer', 'Abdul Rahman', 'Dutch-Bangla Bank', 'Banani Branch', '1234567890',
 NULL, 'Sumaiya Ahmed', 'Abdul Rahman', NULL, 'https://example.com/logo.png', 'August Salary', 'Paid',
 '2025-08-31 09:30:00', '2025-08-31 09:30:00'),

-- Payslip 2
('m³ techOps Ltd.', '123, ABC Street, Dhaka, Bangladesh', 'REF-2025-002', 'September 2025',
 'Fatema Khatun', 'UI/UX Designer', 'EMP002', '2025-09-05',
 65000.00, 3000.00, 62000.00,
 'Bkash', 'Fatema Khatun', NULL, NULL, NULL,
 'TXN123456789', 'Sumaiya Ahmed', 'Fatema Khatun', NULL, 'https://example.com/logo.png', 'September Salary', 'Paid',
 '2025-09-05 11:15:00', '2025-09-05 11:15:00'),

-- Payslip 3
('m³ techOps Ltd.', '123, ABC Street, Dhaka, Bangladesh', 'REF-2025-003', 'September 2025',
 'Rafiq Hasan', 'Backend Developer', 'EMP003', '2025-09-12',
 70000.00, 4000.00, 66000.00,
 'Cash', 'Rafiq Hasan', NULL, NULL, NULL,
 NULL, 'Sumaiya Ahmed', 'Rafiq Hasan', NULL, 'https://example.com/logo.png', 'September Salary', 'Pending',
 '2025-09-12 15:45:00', '2025-09-12 15:45:00'),

-- Payslip 4
('m³ techOps Ltd.', '123, ABC Street, Dhaka, Bangladesh', 'REF-2025-004', 'July 2025',
 'Sharmin Akter', 'Project Manager', 'EMP004', '2025-07-30',
 95000.00, 7000.00, 88000.00,
 'Bank Transfer', 'Sharmin Akter', 'BRAC Bank', 'Gulshan Branch', '9988776655',
 NULL, 'Sumaiya Ahmed', 'Sharmin Akter', NULL, 'https://example.com/logo.png', 'July Salary', 'Paid',
 '2025-07-30 10:05:00', '2025-07-30 10:05:00');
