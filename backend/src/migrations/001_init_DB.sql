

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Roles
CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL -- 'admin', 'manager'
);

-- 2. Permissions
CREATE TABLE permissions (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT
);

-- 3. Role ↔ Permissions
CREATE TABLE role_permissions (
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 4. Users (custom ID as VARCHAR)
CREATE TABLE users (
    user_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role_id BIGINT NOT NULL REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Services
CREATE TABLE services (
    service_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_desc TEXT NOT NULL,
    key_benefits JSONB NOT NULL, -- store array of strings
    our_process JSONB NOT NULL,  -- store array of strings
    active BOOLEAN DEFAULT TRUE,
    icon VARCHAR(100),           -- optional, can store "FaCode" etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 6. Categories
CREATE TABLE categories (
    category_id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Projects (custom ID as VARCHAR)
CREATE TABLE projects (
    project_id VARCHAR(20) PRIMARY KEY, -- e.g., "PRJ001"
    title VARCHAR(150) NOT NULL,
    overview TEXT,
    case_study TEXT,
    technologies TEXT[] DEFAULT '{}',
    image_url VARCHAR(255),
    github_url VARCHAR(255),
    live_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Project ↔ Categories
CREATE TABLE project_categories (
    project_id VARCHAR(20) NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, category_id)
);



CREATE TABLE portfolio_items (
    portfolio_item_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    results TEXT NOT NULL,
    tech_stack JSONB NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 9. Inquiries
CREATE TABLE inquiries (
    inquiry_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    company VARCHAR(50),
    job_title VARCHAR(50),
    phone VARCHAR(20),
    country VARCHAR(30),
    message TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Unread','Read','Replied')) DEFAULT 'Unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Blogs
CREATE TABLE blogs (
    blog_id SERIAL PRIMARY KEY,               
    title VARCHAR(255) NOT NULL,         
    category VARCHAR(100) NOT NULL,      
    excerpt TEXT NOT NULL,               
    content TEXT NOT NULL,               
    image TEXT,                          
    date DATE DEFAULT CURRENT_DATE, 
    read_time VARCHAR(50) DEFAULT '5 min read', 
    author_name VARCHAR(100) NOT NULL,   
    author_avatar TEXT,                  
    author_role VARCHAR(100),            
    active BOOLEAN DEFAULT TRUE,         
    created_at TIMESTAMP DEFAULT NOW(),  
    updated_at TIMESTAMP DEFAULT NOW()   
);


-- 11. Testimonials
CREATE TABLE testimonials (
    testimonial_id BIGSERIAL PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    feedback TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Bookings
CREATE TABLE bookings (
    booking_id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
    service_id BIGINT REFERENCES services(service_id) ON DELETE CASCADE,
    booking_date DATE,
    status VARCHAR(20) CHECK (status IN ('Pending','Accepted','Completed','Cancelled')) DEFAULT 'Pending',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Pay Slips
CREATE TABLE pay_slips (
    payslip_id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    salary_month DATE NOT NULL, -- e.g., 2025-08-01
    basic_salary NUMERIC(10,2) NOT NULL,
    allowances NUMERIC(10,2) DEFAULT 0.00,
    deductions NUMERIC(10,2) DEFAULT 0.00,
    net_salary NUMERIC(10,2) GENERATED ALWAYS AS (basic_salary + allowances - deductions) STORED,
    status VARCHAR(20) CHECK (status IN ('Generated','Paid','Cancelled')) DEFAULT 'Generated',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Subscribers
CREATE TABLE subscribers (
    subscriber_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150),
    status VARCHAR(10) CHECK (status IN ('Active','Inactive')) DEFAULT 'Active',
    subscribed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Newsletters
CREATE TABLE newsletters (
    newsletter_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Draft', 'Sent', 'Canceled')) DEFAULT 'Draft',
    sent_date TIMESTAMP,      -- actual sent date
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL UNIQUE,  -- 'privacy', 'cookie', 'terms'
    title VARCHAR(255) NOT NULL,       -- e.g., "Privacy Policy"
    content TEXT NOT NULL,             -- full policy text (can be long)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial rows
INSERT INTO policies (type, title, content)
VALUES 
('privacy', 'Privacy Policy', 'Your privacy policy content here...'),
('cookie', 'Cookie Policy', 'Your cookie policy content here...'),
('terms', 'Terms of Service', 'Your terms of service content here...');

