from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.services.note_template_service import NoteTemplateService

note_template_bp = Blueprint('note_template', __name__)
note_template_service = NoteTemplateService()

@note_template_bp.route('/', methods=['GET'])
@login_required
def get_note_templates():
    is_premium = request.args.get('is_premium', 'false').lower() in ['true', '1', 'yes']
    return note_template_service.get_templates(is_premium=is_premium)

@note_template_bp.route('/', methods=['POST'])
@login_required
def create_note_template():
    data = request.get_json()
    return note_template_service.create_template(data)

@note_template_bp.route('/<int:template_id>', methods=['PUT'])
@login_required
def update_note_template(template_id):
    data = request.get_json()
    return note_template_service.update_template(template_id, data)

@note_template_bp.route('/<int:template_id>', methods=['DELETE'])
@login_required
def delete_note_template(template_id):
    return note_template_service.delete_template(template_id)
