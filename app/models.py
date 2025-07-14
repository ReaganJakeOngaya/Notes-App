from datetime import datetime
from flask import current_app
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous.url_safe import URLSafeTimedSerializer as Serializer

from . import db

# ==========================
# User Model
# ==========================
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(200))
    avatar = db.Column(db.String(500))  # URL to profile image
    bio = db.Column(db.Text)
    provider = db.Column(db.String(200))  # 'google', 'apple', 'email'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    notes = db.relationship('Note', backref='author', lazy='dynamic')
    shared_notes = db.relationship('SharedNote', backref='recipient', lazy='dynamic')

    # Flask-Login requirements
    def get_id(self):
        return str(self.id)

    @property
    def is_active(self):
        return True

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    # Auth token (useful if needed for passwordless/sessionless systems)
    def get_auth_token(self, expires_in=3600):
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps({'user_id': self.id, 'exp': datetime.utcnow().timestamp() + expires_in})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token, max_age=3600)
            return User.query.get(data['user_id'])
        except Exception as e:
            current_app.logger.warning(f"Token verification failed: {str(e)}")
            return None

    # Password handling
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # User statistics methods
    def get_notes_count(self):
        return self.notes.count()
    
    def get_favorites_count(self):
        return self.notes.filter(Note.favorite == True).count()
    
    def get_shared_notes_count(self):
        return self.shared_notes.count()
    
    def get_notes_by_category(self):
        from sqlalchemy import func
        return db.session.query(Note.category, func.count(Note.id)).filter_by(user_id=self.id).group_by(Note.category).all()
    
    # Convert user to JSON/dict
    def to_dict(self, include_stats=False):
        user_dict = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'avatar': self.avatar,
            'bio': self.bio,
            'provider': self.provider,
        }
        
        if include_stats:
            user_dict.update({
                'noteCount': self.get_notes_count(),
                'favoriteCount': self.get_favorites_count(),
                'sharedCount': self.get_shared_notes_count(),
                'categoryStats': dict(self.get_notes_by_category())
            })
        
        return user_dict


# ==========================
# Note Model
# ==========================
class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), default='personal')
    tags = db.Column(db.Text)  # JSON string format: '["tag1", "tag2"]'
    favorite = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    modified_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Shared notes
    shares = db.relationship('SharedNote', backref='note', lazy='dynamic')


# ==========================
# SharedNote Model
# ==========================
class SharedNote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    note_id = db.Column(db.Integer, db.ForeignKey('note.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    permission = db.Column(db.String(10), default='view')  # 'view' or 'edit'
    shared_at = db.Column(db.DateTime, default=datetime.utcnow)


# ==========================
# Note Revision Model
# ==========================
class NoteRevision(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    note_id = db.Column(db.Integer, db.ForeignKey('note.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=True)
    revision_number = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to note
    note = db.relationship('Note', backref='revisions', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'noteId': self.note_id,
            'title': self.title,
            'content': self.content,
            'revisionNumber': self.revision_number,
            'createdAt': self.created_at.isoformat()
        }


# ==========================
# Note Template Model
# ==========================
class NoteTemplate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    template_content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), default='personal')
    is_premium = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'templateContent': self.template_content,
            'category': self.category,
            'isPremium': self.is_premium,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }
