from datetime import datetime
from app import db


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
