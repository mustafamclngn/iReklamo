-- Database schema for iReklamo
-- Run this file to create tables for raw SQL implementation

-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
<<<<<<< HEAD
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20),
=======
	first_name VARCHAR(100),
	last_name VARCHAR(100),
>>>>>>> 53e81b75048b8f8679e63e3adae1f2a108b37098
    barangay VARCHAR(50),
    position VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
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
>>>>>>> 53e81b75048b8f8679e63e3adae1f2a108b37098
);

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    location VARCHAR(255),
    image_url VARCHAR(500),
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
