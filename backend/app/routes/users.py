from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import User
from app import db
import json

users_bp = Blueprint('users', __name__)

@users_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    return jsonify({
        'id': current_user.id,
        'username': current_user.username,
        'email': current_user.email,
        'avatar': current_user.avatar,
        'provider': current_user.provider
    })

@users_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    data = request.get_json()
    
    if 'username' in data:
        current_user.username = data['username']
    if 'email' in data:
        current_user.email = data['email']
    if 'avatar' in data:
        current_user.avatar = data['avatar']
    
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'}), 200