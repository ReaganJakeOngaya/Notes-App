from datetime import datetime
from app.extensions.db import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100), nullable=False, default='Username')
    photo_url = db.Column(db.String(500), nullable=True)

    notes = db.relationship('Note', backref='author', lazy=True)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_json(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "photo_url": self.photo_url
        }
