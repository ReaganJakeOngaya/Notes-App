from flask import jsonify 
from app.models import Note, SharedNote, User
from app import db
import json
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class NoteService:
    def get_user_notes(self, user_id, category='all', search=''):
        try:
            query = Note.query.filter_by(user_id=user_id)
            
            if category != 'all':
                if category == 'favorites':
                    query = query.filter(Note.favorite == True)
                elif category in ['personal', 'work', 'ideas']:
                    query = query.filter(Note.category == category)
                else:
                    return jsonify({'error': 'Invalid category'}), 400
            
            if search:
                query = query.filter(
                    (Note.title.ilike(f'%{search}%')) | 
                    (Note.content.ilike(f'%{search}%'))
                )
            
            notes = query.order_by(Note.modified_at.desc()).all()
            return jsonify([self._note_to_dict(note) for note in notes])
        
        except Exception as e:
            logger.error(f"Error getting user notes: {str(e)}", exc_info=True)
            return jsonify({'error': 'Failed to fetch notes'}), 500
    
    def get_single_note(self, user_id, note_id):
        try:
            note = Note.query.filter_by(id=note_id, user_id=user_id).first()
            if not note:
                shared_note = SharedNote.query.filter_by(note_id=note_id, user_id=user_id).first()
                if not shared_note:
                    return jsonify({'error': 'Note not found or access denied'}), 404
                note = shared_note.note
            
            return jsonify(self._note_to_dict(note))
        
        except Exception as e:
            logger.error(f"Error getting single note: {str(e)}")
            return jsonify({'error': 'Failed to fetch note'}), 500
    
    def create_note(self, user_id, data):
        if not data or not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400
    
        try:
            # Validate and sanitize input
            title = str(data['title']).strip()[:100]
            content = str(data.get('content', ''))[:10000]
            category = data.get('category', 'personal')
            if category not in ['personal', 'work', 'ideas']:
                category = 'personal'
            
            tags = data.get('tags', [])
            if not isinstance(tags, list):
                tags = []
            tags = [str(tag).strip()[:20] for tag in tags][:5]  # Limit to 5 tags
            
            note = Note(
                title=title,
                content=content,
                category=category,
                tags=json.dumps(tags),
                favorite=bool(data.get('favorite', False)),
                user_id=user_id
            )
        
            db.session.add(note)
            db.session.commit()
            return jsonify(self._note_to_dict(note)), 201
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating note: {str(e)}")
            return jsonify({'error': 'Failed to create note'}), 500
    
    def update_note(self, user_id, note_id, data):
        try:
            note = Note.query.filter_by(id=note_id, user_id=user_id).first()
            if not note:
                return jsonify({'error': 'Note not found'}), 404
            
            if 'title' in data:
                note.title = str(data['title']).strip()[:100]
            if 'content' in data:
                note.content = str(data['content'])[:10000]
            if 'category' in data and data['category'] in ['personal', 'work', 'ideas']:
                note.category = data['category']
            if 'tags' in data:
                tags = data['tags'] if isinstance(data['tags'], list) else []
                note.tags = json.dumps([str(tag).strip()[:20] for tag in tags][:5])
            if 'favorite' in data:
                note.favorite = bool(data['favorite'])
            
            note.modified_at = datetime.utcnow()
            db.session.commit()
            return jsonify(self._note_to_dict(note))
        
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating note: {str(e)}")
            return jsonify({'error': 'Failed to update note'}), 500
    
    def delete_note(self, user_id, note_id):
        try:
            note = Note.query.filter_by(id=note_id, user_id=user_id).first()
            if not note:
                return jsonify({'error': 'Note not found'}), 404
            
            db.session.delete(note)
            db.session.commit()
            return jsonify({'message': 'Note deleted successfully'}), 200
        
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error deleting note: {str(e)}")
            return jsonify({'error': 'Failed to delete note'}), 500
    
    def share_note(self, user_id, note_id, recipient_email, permission):
        try:
            note = Note.query.filter_by(id=note_id, user_id=user_id).first()
            if not note:
                return jsonify({'error': 'Note not found'}), 404
            
            recipient = User.query.filter_by(email=recipient_email).first()
            if not recipient:
                return jsonify({'error': 'Recipient not found'}), 404
            
            if permission not in ['view', 'edit']:
                permission = 'view'
            
            shared_note = SharedNote(
                note_id=note_id,
                user_id=recipient.id,
                permission=permission
            )
            
            db.session.add(shared_note)
            db.session.commit()
            return jsonify({'message': 'Note shared successfully'}), 200
        
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error sharing note: {str(e)}")
            return jsonify({'error': 'Failed to share note'}), 500
    
    def get_shared_notes(self, user_id):
        try:
            shared_notes = (
                db.session.query(Note)
                .join(SharedNote, Note.id == SharedNote.note_id)
                .filter(SharedNote.user_id == user_id)
                .all()
            )
            return jsonify([self._note_to_dict(note) for note in shared_notes])
        except Exception as e:
            logger.error(f"Error getting shared notes: {str(e)}", exc_info=True)
            return jsonify({'error': 'Failed to fetch shared notes'}), 500
    
    def _note_to_dict(self, note):
        try:
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
        except Exception as e:
            logger.error(f"Error converting note to dict: {str(e)}")
            return {
                'id': note.id,
                'title': note.title,
                'content': note.content,
                'category': note.category,
                'tags': [],
                'favorite': note.favorite,
                'created_at': note.created_at.isoformat(),
                'modified_at': note.modified_at.isoformat(),
                'author': None
            }