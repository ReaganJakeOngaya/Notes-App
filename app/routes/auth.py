from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
from app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/')
def home():
    return "Welcome to the Auth API", 200

@auth_bp.route('/login', methods=['OPTIONS'])
def login_options():
    return jsonify({}), 200

@auth_bp.route('/register', methods=['OPTIONS'])
def register_options():
    return jsonify({}), 200

@auth_bp.route('/logout', methods=['OPTIONS'])
def logout_options():
    return jsonify({}), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
    
        user = User(
            username=data['username'],
            email=data['email'],
            provider='email'
        )
        user.set_password(data['password'])
    
        db.session.add(user)
        db.session.commit()
        
        login_user(user)
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict(),
            'token': user.get_auth_token()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):
        login_user(user)
        return jsonify({
            'message': 'Logged in successfully',
            'user': user.to_dict(),
            'token': user.get_auth_token() 
        })
    return jsonify({'error': 'Invalid email or password'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200 