-- - Complainant submits form → creates record in complainants + complaints.
-- - Barangay official sees complaints for their barangay (WHERE complaints.barangay_id = users.barangay_id).
-- - City admin sees all complaints (no filter).
-- - Superadmin can manage users, roles, and barangays.
-- - Barangay captain can assign complaints to kagawads (updates assigned_official_id).


-- ==============================
-- Roles — defines user permissions
-- ==============================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, 
        -- e.g., 'superadmin', 'city_admin', 'barangay_captain', 'kagawad'
    description TEXT 
)

-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    barangay_id INTEGER REFERENCES barangays(id), --> changes in: fetching data for view official
    position VARCHAR(100),
    role_id INTEGER REFERENCES roles(id), --> changes in: fetching data for authorization
    user_password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refresh_token VARCHAR(255),
    token_version BIGINT DEFAULT 0
);

-- User Info table
CREATE TABLE user_info (
    info_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    contact_number VARCHAR(20),
    sex VARCHAR(10),
    birthdate DATE,
    purok VARCHAR(100),
    street VARCHAR(150),
	profile_picture VARCHAR(250)
);


-- ==============================
-- Barangays — list of barangays
-- ==============================
CREATE TABLE IF NOT EXISTS barangays (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- ==============================
-- Complainants — citizens (no login)
-- ==============================
CREATE TABLE IF NOT EXISTS complainants (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    sex VARCHAR(10),
    age INTEGER,
    contact_number VARCHAR(20),
    email VARCHAR(120),
    barangay_id INTEGER REFERENCES barangays(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==============================
-- Complaints — filed by complainants
-- ==============================
CREATE TABLE IF NOT EXISTS complaints (
    id SERIAL PRIMARY KEY,
    complaint_code VARCHAR(20) UNIQUE,
    title VARCHAR(200) NOT NULL,
    case_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    full_address TEXT NOT NULL,
    specific_location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    complainant_id INTEGER REFERENCES complainants(id),
    barangay_id INTEGER REFERENCES barangays(id),
    assigned_official_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==============================
-- (OPNTIONAL) Complaint History — track status changes
-- ==============================
CREATE TABLE IF NOT EXISTS complaint_history (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER REFERENCES complaints(id),
    updated_by INTEGER REFERENCES users(id),
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    notes TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
