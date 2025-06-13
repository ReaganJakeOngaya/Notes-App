from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Note, SharedNote
from app.services.note_service import NoteService
import json

notes_bp = Blueprint('notes', __name__)
note_service = NoteService()

@notes_bp.route('/', methods=['GET'])
@login_required
def get_notes():
    category = request.args.get('category', 'all')
    search = request.args.get('search', '')
    return note_service.get_user_notes(current_user.id, category, search)

@notes_bp.route('/<int:note_id>', methods=['GET'])
@login_required
def get_note(note_id):
    return note_service.get_single_note(current_user.id, note_id)

@notes_bp.route('/', methods=['POST'])
@login_required
def create_note():
    data = request.get_json()
    return note_service.create_note(current_user.id, data)

@notes_bp.route('/<int:note_id>', methods=['PUT'])
@login_required
def update_note(note_id):
    data = request.get_json()
    return note_service.update_note(current_user.id, note_id, data)

@notes_bp.route('/<int:note_id>', methods=['DELETE'])
@login_required
def delete_note(note_id):
    return note_service.delete_note(current_user.id, note_id)

@notes_bp.route('/<int:note_id>/share', methods=['POST'])
@login_required
def share_note(note_id):
    data = request.get_json()
    return note_service.share_note(current_user.id, note_id, data['email'], data['permission'])

@notes_bp.route('/shared', methods=['GET'])
@login_required
def get_shared_notes():
    return note_service.get_shared_notes(current_user.id)