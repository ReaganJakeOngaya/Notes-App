from flask import jsonify
from app.models import NoteTemplate
from app import db
import logging

logger = logging.getLogger(__name__)

class NoteTemplateService:
    def get_templates(self, is_premium=False):
        try:
            query = NoteTemplate.query
            if is_premium:
                query = query.filter_by(is_premium=True)
            templates = query.all()
            return jsonify([template.to_dict() for template in templates])
        except Exception as e:
            logger.error(f"Error fetching note templates: {str(e)}", exc_info=True)
            return jsonify({'error': 'Failed to fetch note templates'}), 500

    def create_template(self, data):
        try:
            if not data or not data.get('name') or not data.get('template_content'):
                return jsonify({'error': 'Name and template content are required'}), 400

            template = NoteTemplate(
                name=data['name'],
                description=data.get('description', ''),
                template_content=data['template_content'],
                category=data.get('category', 'personal'),
                is_premium=bool(data.get('is_premium', False))
            )

            db.session.add(template)
            db.session.commit()
            return jsonify(template.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating note template: {str(e)}", exc_info=True)
            return jsonify({'error': 'Failed to create note template'}), 500

    def update_template(self, template_id, data):
        try:
            template = NoteTemplate.query.get(template_id)
            if not template:
                return jsonify({'error': 'Template not found'}), 404

            if 'name' in data:
                template.name = data['name']
            if 'description' in data:
                template.description = data['description']
            if 'template_content' in data:
                template.template_content = data['template_content']
            if 'category' in data:
                template.category = data['category']
            if 'is_premium' in data:
                template.is_premium = bool(data['is_premium'])

            db.session.commit()
            return jsonify(template.to_dict())
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating note template: {str(e)}", exc_info=True)
            return jsonify({'error': 'Failed to update note template'}), 500

    def delete_template(self, template_id):
        try:
            template = NoteTemplate.query.get(template_id)
            if not template:
                return jsonify({'error': 'Template not found'}), 404

            db.session.delete(template)
            db.session.commit()
            return jsonify({'message': 'Template deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error deleting note template: {str(e)}", exc_info=True)
            return jsonify({'error': 'Failed to delete note template'}), 500
