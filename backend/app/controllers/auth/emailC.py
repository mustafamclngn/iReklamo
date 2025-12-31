import datetime
from flask import current_app, jsonify, render_template
from flask_mail import Message

# ========================== 
# USER DETAILS
# ==========
def email_details(username, email, random_pwd):
    mail = current_app.extensions.get('mail')

    try:
        message = Message(
            subject='Your iReklamo Account',
            sender=('iReklamo Support', 'noreply@ireklamo.ph'),
            recipients=[email],
        )

        html_body = render_template(
            "official_details_email.html",
            username=username,
            password=random_pwd,
            action_url="http://localhost:5000/auth/login",
            header_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjW6pVUr11OhfYa_pKjC2GEzO3wK4az40l5g&s",
            year=datetime.datetime.now().year
        )

        message.html = html_body
        mail.send(message)

    except Exception as mail_err:
        return jsonify({
        "error": str(mail_err),
    }), 500


# ========================== 
# FORGOT PASSWORD
# ==========
def email_newpwd(username, email, reset_link):
    
    mail = current_app.extensions.get('mail')

    try:
        message = Message(  
            subject='Your iReklamo Account',
            sender=('iReklamo Support', 'noreply@ireklamo.ph'),
            recipients=[email],
        )

        html_body = render_template(
            "forgot_password.html",
            username=username,
            action_url=reset_link,
            header_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjW6pVUr11OhfYa_pKjC2GEzO3wK4az40l5g&s",
            year=datetime.datetime.now().year
        )

        message.html = html_body
        mail.send(message)

    except Exception as mail_err:
        return jsonify({
        "error": str(mail_err),
    }), 500
