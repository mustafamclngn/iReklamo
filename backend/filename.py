# backend/generate_acc.py

import os
import random
import psycopg2
from werkzeug.security import generate_password_hash
from psycopg2.extras import execute_values

DATABASE_URL = "postgresql://postgres:eliabado123@localhost:5432/ireklamo"


first_names = [
    "Juan", "Maria", "Jose", "Ana", "Paolo", "Luis", "Rica", "Jessa", "Marco", "Carla"
]

last_names = [
    "Dela Cruz", "Reyes", "Santos", "Garcia", "Lopez", "Mendoza", "Torres", "Cruz", "Navarro", "Ramos"
]

barangays = ["Palao", "Santiago"]

def generate_user(first_name, last_name, barangay, role):
    user_name = f"{first_name.lower()}{last_name.lower()}{random.randint(1,99)}"
    email = f"{user_name}@ireklamo.com"
    password = generate_password_hash("role123")
    
    # position depends on role
    position = "Barangay Captain" if role == "brgy_cap" else "Barangay Official"
    
    return (user_name, email, first_name, last_name, barangay, role, position, password)

def generate_user_info(user_id):
    contact_number = f"09{random.randint(100000000,999999999)}"
    sex = random.choice(["Male", "Female"])
    birthdate = f"19{random.randint(70, 99)}-{random.randint(1,12):02}-{random.randint(1,28):02}"
    purok = f"Purok {random.randint(1,10)}"
    street = f"{random.randint(1,200)} Main Street"
    profile_picture = "/storage/profile_pictures/default.png"
    return (user_id, contact_number, sex, birthdate, purok, street, profile_picture)

def populate_initial_data():
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    users_to_insert = []
    user_info_to_insert = []

    # --- SUPER ADMIN ---
    users_to_insert.append(("superadmin", "superadmin@ireklamo.com", "Super", "Admin", None, "super_admin", None, generate_password_hash("super123")))

    # --- CITY ADMIN ---
    users_to_insert.append(("cityadmin", "cityadmin@ireklamo.com", "City", "Admin", None, "city_admin", None, generate_password_hash("city123")))

    # --- BARANGAY CAPTAINS + OFFICIALS ---
    for barangay in barangays:
        # 1 barangay captain
        fn = random.choice(first_names)
        ln = random.choice(last_names)
        users_to_insert.append(generate_user(fn, ln, barangay, "brgy_cap"))
        
        # 10 barangay officials
        for _ in range(10):
            fn = random.choice(first_names)
            ln = random.choice(last_names)
            users_to_insert.append(generate_user(fn, ln, barangay, "brgy_off"))
    
    insert_users_query = """
    INSERT INTO users (user_name, email, first_name, last_name, barangay, role, position, user_password)
    VALUES %s
    RETURNING user_id, role;
    """
    
    execute_values(cursor, insert_users_query, users_to_insert)
    inserted_rows = cursor.fetchall()

    # only generate user_info for users who are not admin roles
    for user_id, role in inserted_rows:
        if role not in ("super_admin", "city_admin"):
            user_info_to_insert.append(generate_user_info(user_id))
    
    insert_info_query = """
    INSERT INTO user_info (user_id, contact_number, sex, birthdate, purok, street, profile_picture)
    VALUES %s
    """
    execute_values(cursor, insert_info_query, user_info_to_insert)
    
    conn.commit()
    cursor.close()
    conn.close()
    print("Accounts generated successfully!")

if __name__ == "__main__":
    populate_initial_data()