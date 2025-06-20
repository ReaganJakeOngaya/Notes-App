from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.services.note_service import NoteService
import logging
from datetime import datetime
from app import db

notes_bp = Blueprint('notes', __name__)
note_service = NoteService()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@notes_bp.route('/')
def home():
    return "Welcome to the Notes API", 200

@notes_bp.route('', methods=['GET'])
@login_required
def get_notes():
    try:
        logger.info(f"Getting notes for user {current_user.id} at {datetime.utcnow()}")
        category = request.args.get('category', 'all')
        search = request.args.get('search', '')
        
        if category not in ['all', 'personal', 'work', 'ideas', 'favorites']:
            return jsonify({"error": "Invalid category"}), 400
            
        notes = note_service.get_user_notes(current_user.id, category, search)
        return jsonify(notes), 200
        
    except Exception as e:
        logger.error(f"Error getting notes: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@notes_bp.route('/<int:note_id>', methods=['GET'])
@login_required
def get_note(note_id):
    try:
        logger.info(f"Getting note {note_id} for user {current_user.id}")
        note = note_service.get_single_note(current_user.id, note_id)
        if note is None:
            return jsonify({"error": "Note not found"}), 404
        return jsonify(note), 200
    except Exception as e:
        logger.error(f"Error getting note: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@notes_bp.route('', methods=['POST'])
@login_required
def create_note():
    try:
        data = request.get_json()
        logger.info(f"Creating note for user {current_user.id}")
        
        if not data or not data.get('title'):
            return jsonify({"error": "Title is required"}), 400
            
        result = note_service.create_note(current_user.id, data)
        return jsonify(result), 201
    except Exception as e:
        logger.error(f"Error creating note: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@notes_bp.route('/<int:note_id>', methods=['PUT'])
@login_required
def update_note(note_id):
    try:
        data = request.get_json()
        logger.info(f"Updating note {note_id} for user {current_user.id}")
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        result = note_service.update_note(current_user.id, note_id, data)
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error updating note: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@notes_bp.route('/<int:note_id>', methods=['DELETE'])
@login_required
def delete_note(note_id):
    try:
        logger.info(f"Deleting note {note_id} for user {current_user.id}")
        result = note_service.delete_note(current_user.id, note_id)
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error deleting note: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@notes_bp.route('/<int:note_id>/share', methods=['POST'])
@login_required
def share_note(note_id):
    try:
        data = request.get_json()
        logger.info(f"Sharing note {note_id} for user {current_user.id}")
        
        if not data or not data.get('email'):
            return jsonify({"error": "Email is required"}), 400
            
        result = note_service.share_note(
            current_user.id, 
            note_id, 
            data['email'], 
            data.get('permission', 'view')
        )
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error sharing note: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@notes_bp.route('/shared', methods=['GET'])
@login_required
def get_shared_notes():
    try:
        logger.info(f"Getting shared notes for user {current_user.id}")
        notes = note_service.get_shared_notes(current_user.id)
        return jsonify(notes), 200
    except Exception as e:
        logger.error(f"Error getting shared notes: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@notes_bp.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'https://notes-app-r4yj.vercel.app')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@notes_bp.before_request
@login_required
def before_request():
    try:
        # Verify database connection
        db.session.execute('SELECT 1')
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Database connection failed'}), 500
    logger.info(f"Request from user {current_user.id} at {datetime.utcnow()}")
    return None

