from flask import Blueprint, request, jsonify, redirect, url_for
from flask_login import login_user, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
from app.services.auth_service import AuthService
from app import db

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    return auth_service.register_user(data)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return auth_service.login_user(data)

@auth_bp.route('/logout')
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/google')
def google_login():
    # Implement Google OAuth flow
    pass

@auth_bp.route('/google/callback')
def google_callback():
    # Handle Google OAuth callback
    pass