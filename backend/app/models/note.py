from datetime import datetime
from app.extensions.db import db

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    tags = db.Column(db.Text)  # JSON serialized
    category = db.Column(db.String(50), nullable=False, default='general')
    favorite = db.Column(db.Boolean, nullable=False, default=False)
    is_shared = db.Column(db.Boolean, nullable=False, default=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "tags": self.tags,
            "category": self.category,
            "favorite": self.favorite,
            "is_shared": self.is_shared,
            "created_at": self.created_at.isoformat()
        }
