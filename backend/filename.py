# backend/generate_acc.py

import os
import random
import psycopg2
from werkzeug.security import generate_password_hash
from psycopg2.extras import execute_values

DATABASE_URL = "postgresql://postgres:eliabado123@localhost:5432/ireklamo2"


first_names = [
    "Juan", "Maria", "Jose", "Ana", "Paolo", "Luis", "Rica", "Jessa", "Marco", "Carla"
]

last_names = [
    "Dela Cruz", "Reyes", "Santos", "Garcia", "Lopez", "Mendoza", "Torres", "Cruz", "Navarro", "Ramos"
]

barangays = ["Palao", "Santiago"]

def generate_user(first_name, last_name, barangay_id, role):
    user_name = f"{first_name.lower()}{last_name.lower()}{random.randint(1,99)}"
    email = f"{user_name}@ireklamo.com"
    password = generate_password_hash("role123")
    
    # position depends on role
    position = "Barangay Captain" if role == "brgy_cap" else "Barangay Official"
    
    return (user_name, email, first_name, last_name, barangay_id, role, position, password)

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

    # Fetch role IDs
    cursor.execute("SELECT name, id FROM roles;")
    role_map = {name: id for name, id in cursor.fetchall()}

    # Fetch barangay IDs
    cursor.execute("SELECT name, id FROM barangays;")
    barangay_map = {name: id for name, id in cursor.fetchall()}

    users_to_insert = []
    user_info_to_insert = []

    # --- SUPER ADMIN ---
    users_to_insert.append((
        "superadmin", "superadmin@ireklamo.com", "Super", "Admin",
        None,  # barangay_id
        role_map["super_admin"],
        None,  # position
        generate_password_hash("super123")
    ))

    # --- CITY ADMIN ---
    users_to_insert.append((
        "cityadmin", "cityadmin@ireklamo.com", "City", "Admin",
        None,
        role_map["city_admin"],
        None,
        generate_password_hash("city123")
    ))

    # --- BARANGAY CAPTAINS + OFFICIALS ---
    for barangay in barangays:
        barangay_id = barangay_map.get(barangay)

        # 1 Barangay Captain
        fn = random.choice(first_names)
        ln = random.choice(last_names)
        users_to_insert.append((
            f"{fn.lower()}{ln.lower()}{random.randint(1,99)}",
            f"{fn.lower()}{ln.lower()}{random.randint(1,99)}@ireklamo.com",
            fn, ln,
            barangay_id,
            role_map["brgy_cap"],
            "Barangay Captain",
            generate_password_hash("role123")
        ))

        # 10 Barangay Officials
        for _ in range(10):
            fn = random.choice(first_names)
            ln = random.choice(last_names)
            users_to_insert.append((
                f"{fn.lower()}{ln.lower()}{random.randint(1,99)}",
                f"{fn.lower()}{ln.lower()}{random.randint(1,99)}@ireklamo.com",
                fn, ln,
                barangay_id,
                role_map["brgy_off"],
                "Barangay Official",
                generate_password_hash("role123")
            ))

    insert_users_query = """
    INSERT INTO users (user_name, email, first_name, last_name, barangay_id, role_id, position, user_password)
    VALUES %s
    RETURNING user_id, role_id;
    """

    execute_values(cursor, insert_users_query, users_to_insert)
    inserted_rows = cursor.fetchall()

    # Generate user_info for non-admins only
    for user_id, role_id in inserted_rows:
        if role_id not in (role_map["super_admin"], role_map["city_admin"]):
            user_info_to_insert.append(generate_user_info(user_id))

    insert_info_query = """
    INSERT INTO users (user_name, email, first_name, last_name, barangay_id, role_id, position, user_password)
    VALUES %s
    ON CONFLICT (email) DO NOTHING
    RETURNING user_id, role_id;
    """

    execute_values(cursor, insert_info_query, user_info_to_insert)

    conn.commit()
    cursor.close()
    conn.close()
    print("Accounts generated successfully!")


if __name__ == "__main__":
    populate_initial_data()