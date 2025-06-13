from werkzeug.security import generate_password_hash
from app.models import User
from app import db
from flask import jsonify
from flask_login import login_user

class AuthService:
    def register_user(self, data):
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        user = User(
            email=data['email'],
            username=data.get('username', data['email'].split('@')[0]),
            password_hash=generate_password_hash(data['password']),
            provider='email'
        )
        
        db.session.add(user)
        db.session.commit()
        
        login_user(user)
        return jsonify({'message': 'User registered successfully'}), 201

    def login_user(self, data):
        user = User.query.filter_by(email=data['email']).first()
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        login_user(user)
        return jsonify({'message': 'Logged in successfully'}), 200