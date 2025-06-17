from werkzeug.security import generate_password_hash
from app.models import User
from app import db
from flask import jsonify
from flask_login import login_user

class AuthService:
    def register_user(self, data):
        try:
            if User.query.filter_by(email=data['email']).first():
                return {'error': 'Email already registered'}, 400
    
            user = User(
                username=data['username'],
                email=data['email'],
                provider='email'
            )
            user.set_password(data['password'])
    
            db.session.add(user)
            db.session.commit()
    
            login_user(user)
            return {
                'message': 'User registered successfully',
                'user': user.to_dict(),
                'token': user.get_auth_token()
            }, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

    def login_user(self, data):
        user = User.query.filter_by(email=data['email']).first()
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        login_user(user)
        return jsonify({'message': 'Logged in successfully'}), 200