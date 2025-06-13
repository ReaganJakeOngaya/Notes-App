from datetime import datetime
from app import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    avatar = db.Column(db.String(200))
    provider = db.Column(db.String(50))  # 'google', 'apple', 'email'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    notes = db.relationship('Note', backref='author', lazy='dynamic')
    shared_notes = db.relationship('SharedNote', backref='recipient', lazy='dynamic')

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), default='personal')
    tags = db.Column(db.Text)  # JSON string
    favorite = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    modified_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    shares = db.relationship('SharedNote', backref='note', lazy='dynamic')

class SharedNote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    note_id = db.Column(db.Integer, db.ForeignKey('note.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    permission = db.Column(db.String(10), default='view')  # 'view' or 'edit'
    shared_at = db.Column(db.DateTime, default=datetime.utcnow)