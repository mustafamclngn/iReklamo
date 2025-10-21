from datetime import datetime
from app.extensions import db

class User(db.Model):
    """User model for authentication and user management"""

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with complaints
    complaints = db.relationship('Complaint', backref='author', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

class Complaint(db.Model):
    """Complaint model for storing user complaints/reports"""

    __tablename__ = 'complaints'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, in_progress, resolved, rejected
    priority = db.Column(db.String(20), default='medium')  # low, medium, high, urgent
    location = db.Column(db.String(255))  # Optional location of the complaint
    image_url = db.Column(db.String(500))  # Optional image evidence
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Complaint {self.title}>'
