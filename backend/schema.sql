-- - Complainant submits form → creates record in complainants + complaints.
-- - Barangay official sees complaints for their barangay (WHERE complaints.barangay_id = users.barangay_id).
-- - City admin sees all complaints (no filter).
-- - Superadmin can manage users, roles, and barangays.
-- - Barangay captain can assign complaints to kagawads (updates assigned_official_id).



-- roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL CHECK (
        name IN (
            'super_admin',
            'city_admin',
            'brgy_cap',
            'brgy_off',
            'on_hold'
        )
    ),
    description TEXT
);

-- barangays
CREATE TABLE IF NOT EXISTS barangays (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- users (admin type users only)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    barangay_id INTEGER REFERENCES barangays(id) ON DELETE SET NULL,
    position VARCHAR(100),
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    user_password TEXT NOT NULL,
<<<<<<< HEAD
    profile_picture VARCHAR(250),
    sex VARCHAR(10),
    birthdate DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
=======
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- user info (for future edit implementation)
CREATE TABLE IF NOT EXISTS user_info (
    info_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    contact_number VARCHAR(20),
    sex VARCHAR(10) CHECK (sex IN ('Male', 'Female', 'Other')),
    birthdate DATE,
    purok VARCHAR(100),
    street VARCHAR(150),
    profile_picture VARCHAR(250)
);

-- complainants
CREATE TABLE IF NOT EXISTS complainants (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(80),
    last_name VARCHAR(80),
    sex VARCHAR(10),
    age INTEGER,
    contact_number VARCHAR(20),
    email VARCHAR(120),
    barangay_id INTEGER REFERENCES barangays(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- complaints
CREATE TABLE IF NOT EXISTS complaints (
    id SERIAL PRIMARY KEY,
    complaint_code VARCHAR(20) UNIQUE,
    title VARCHAR(200) NOT NULL,
    case_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    full_address TEXT NOT NULL,
    specific_location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (
        status IN ('Pending', 'In-Progress', 'Resolved')
    ),
    priority VARCHAR(20) DEFAULT 'Moderate CHECK (
        priority IN ('Low', 'Moderate', 'Urgent')
    ),
    complainant_id INTEGER REFERENCES complainants(id) ON DELETE SET NULL,
    barangay_id INTEGER REFERENCES barangays(id) ON DELETE SET NULL,
    assigned_official_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_barangay ON users(barangay_id);
CREATE INDEX IF NOT EXISTS idx_user_info_user ON user_info(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_barangay ON complaints(barangay_id);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned_official ON complaints(assigned_official_id);
CREATE INDEX IF NOT EXISTS idx_complaints_complainant ON complaints(complainant_id);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complainants_barangay ON complainants(barangay_id);

-- populate roles
INSERT INTO roles (name, description) VALUES
    ('super_admin', 'Super Administrator'),
    ('city_admin', 'City Administrator'),
    ('brgy_cap', 'Barangay Captain'),
    ('brgy_off', 'Barangay Official'),
    ('on_hold', 'Account on hold')
ON CONFLICT (name) DO NOTHING;
