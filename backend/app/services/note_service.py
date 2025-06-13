from app.models import Note, SharedNote, User
from app import db
import json
from datetime import datetime

class NoteService:
    def get_user_notes(self, user_id, category='all', search=''):
        query = Note.query.filter_by(user_id=user_id)
        
        if category != 'all':
            if category == 'favorites':
                query = query.filter(Note.favorite == True)
            else:
                query = query.filter(Note.category == category)
        
        if search:
            query = query.filter(
                (Note.title.ilike(f'%{search}%')) | 
                (Note.content.ilike(f'%{search}%'))
            )
        
        notes = query.order_by(Note.modified_at.desc()).all()
        return jsonify([self._note_to_dict(note) for note in notes])
    
    def get_single_note(self, user_id, note_id):
        note = Note.query.filter_by(id=note_id, user_id=user_id).first()
        if not note:
            shared_note = SharedNote.query.filter_by(note_id=note_id, user_id=user_id).first()
            if not shared_note:
                return jsonify({'error': 'Note not found or access denied'}), 404
            note = shared_note.note
        
        return jsonify(self._note_to_dict(note))
    
    def create_note(self, user_id, data):
        if not data or not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400
        
        note = Note(
            title=data['title'],
            content=data.get('content', ''),
            category=data.get('category', 'personal'),
            tags=json.dumps(data.get('tags', [])),
            favorite=data.get('favorite', False),
            user_id=user_id
        )
        
        db.session.add(note)
        db.session.commit()
        return jsonify(self._note_to_dict(note)), 201
    
    def update_note(self, user_id, note_id, data):
        note = Note.query.filter_by(id=note_id, user_id=user_id).first()
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        
        if 'title' in data:
            note.title = data['title']
        if 'content' in data:
            note.content = data['content']
        if 'category' in data:
            note.category = data['category']
        if 'tags' in data:
            note.tags = json.dumps(data['tags'])
        if 'favorite' in data:
            note.favorite = data['favorite']
        
        note.modified_at = datetime.utcnow()
        db.session.commit()
        return jsonify(self._note_to_dict(note))
    
    def delete_note(self, user_id, note_id):
        note = Note.query.filter_by(id=note_id, user_id=user_id).first()
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        
        db.session.delete(note)
        db.session.commit()
        return jsonify({'message': 'Note deleted successfully'}), 200
    
    def share_note(self, user_id, note_id, recipient_email, permission):
        note = Note.query.filter_by(id=note_id, user_id=user_id).first()
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        
        recipient = User.query.filter_by(email=recipient_email).first()
        if not recipient:
            return jsonify({'error': 'Recipient not found'}), 404
        
        shared_note = SharedNote(
            note_id=note_id,
            user_id=recipient.id,
            permission=permission
        )
        
        db.session.add(shared_note)
        db.session.commit()
        return jsonify({'message': 'Note shared successfully'}), 200
    
    def get_shared_notes(self, user_id):
        shared_notes = SharedNote.query.filter_by(user_id=user_id).all()
        return jsonify([self._note_to_dict(shared.note) for shared in shared_notes])
    
    def _note_to_dict(self, note):
        return {
            'id': note.id,
            'title': note.title,
            'content': note.content,
            'category': note.category,
            'tags': json.loads(note.tags) if note.tags else [],
            'favorite': note.favorite,
            'created_at': note.created_at.isoformat(),
            'modified_at': note.modified_at.isoformat(),
            'author': note.author.username if note.author else None
        }