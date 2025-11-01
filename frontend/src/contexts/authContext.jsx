import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist));
    }, [persist]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;

from flask import jsonify, make_response
import jwt
import datetime
from config import SECRET_KEY  # or your environment-based secret
from app.functions.Update import Update

def login_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    selector = Select()
    user = (
        selector
        .table("users")
        .search(tag="email", key=email)
        .execute()
        .retDict()
    )

    if not user:
        return jsonify({"message": "Invalid email or password"}), 401

    # (Validate password here — hash compare, etc.)

    # 🔹 Fetch current token_version
    token_version = user.get("token_version", 0)

    # 🔹 Generate Access Token (expires in 2 hours)
    access_token = jwt.encode({
        "user_id": user["user_id"],
        "user_role": user["user_role"],
        "token_version": token_version,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, SECRET_KEY, algorithm="HS256")

    # 🔹 Generate Refresh Token (expires in 7 days)
    refresh_token = jwt.encode({
        "user_id": user["user_id"],
        "token_version": token_version,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, SECRET_KEY, algorithm="HS256")

    # 🔹 Store refresh token in DB
    updater = Update()
    updater.table("users").set({"refresh_token": refresh_token}).where("user_id", user["user_id"]).execute()

    # 🔹 Send tokens
    response = make_response(jsonify({
        "access_token": access_token,
        "user_role": user["user_role"],
        "user_name": user["user_name"]
    }))

    response.set_cookie(
        "jwt",
        refresh_token,
        httponly=True,
        samesite="None",
        secure=True,
        max_age=7 * 24 * 60 * 60  # 7 days
    )

    return response
