from flask import Blueprint, request, jsonify, redirect, url_for, current_app
import jwt
import datetime
from authlib.integrations.flask_client import OAuth
from flask_login import login_user, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
from app.services.auth_service import AuthService
from app import db

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()

oauth = OAuth(current_app)

# Configure Google OAuth
# google = oauth.register(
#     name='google',
#     client_id=current_app.config['GOOGLE_CLIENT_ID'],
#     client_secret=current_app.config['GOOGLE_CLIENT_SECRET'],
#     access_token_url='https://accounts.google.com/o/oauth2/token',
#     access_token_params=None,
#     authorize_url='https://accounts.google.com/o/oauth2/auth',
#     authorize_params=None,
#     api_base_url='https://www.googleapis.com/oauth2/v1/',
#     client_kwargs={'scope': 'openid email profile'},
#     server_metadata_url='https://accounts.google.com/.well-known/openid-configuration'
# )

# # Configure Apple OAuth
# apple = oauth.register(
#     name='apple',
#     client_id=current_app.config['APPLE_CLIENT_ID'],
#     client_secret=generate_apple_client_secret(),  # You'll need to implement this
#     access_token_url='https://appleid.apple.com/auth/token',
#     authorize_url='https://appleid.apple.com/auth/authorize',
#     api_base_url='https://appleid.apple.com/',
#     client_kwargs={
#         'scope': 'email name',
#         'response_type': 'code',
#         'response_mode': 'form_post'
#     }
# )

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

@auth_bp.route('/logout')
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

# @auth_bp.route('/google')
# def google_login():
#     redirect_uri = url_for('auth.google_callback', _external=True)
#     return google.authorize_redirect(redirect_uri)

# @auth_bp.route('/google/callback')
# def google_callback():
#     try:
#         token = google.authorize_access_token()
#         userinfo = google.get('userinfo').json()
        
#         # Find or create user
#         user = User.query.filter_by(email=userinfo['email']).first()
        
#         if not user:
#             user = User(
#                 username=userinfo.get('name', userinfo['email'].split('@')[0]),
#                 email=userinfo['email'],
#                 provider='google',
#                 avatar=userinfo.get('picture')
#             )
#             db.session.add(user)
#             db.session.commit()
        
#         login_user(user)
        
#         return jsonify({
#             'message': 'Logged in with Google successfully',
#             'user': user.to_dict(),
#             'token': user.get_auth_token()
#         })
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    
# def generate_apple_client_secret():
#     # Generate Apple client secret JWT
#     now = datetime.datetime.utcnow()
#     payload = {
#         'iss': current_app.config['APPLE_TEAM_ID'],
#         'iat': now,
#         'exp': now + datetime.timedelta(hours=1),
#         'aud': 'https://appleid.apple.com',
#         'sub': current_app.config['APPLE_CLIENT_ID']
#     }
    
#     with open(current_app.config['APPLE_PRIVATE_KEY_PATH'], 'r') as key_file:
#         private_key = key_file.read()
    
#     return jwt.encode(
#         payload,
#         private_key,
#         algorithm='ES256',
#         headers={'kid': current_app.config['APPLE_KEY_ID']}
#     )

# @auth_bp.route('/apple')
# def apple_login():
#     redirect_uri = url_for('auth.apple_callback', _external=True)
#     return apple.authorize_redirect(redirect_uri)

# @auth_bp.route('/apple/callback')
# def apple_callback():
#     try:
#         token = apple.authorize_access_token()
#         id_token = token.get('id_token')
        
#         # Decode the Apple ID token
#         decoded = jwt.decode(id_token, options={"verify_signature": False})
        
#         # Apple may not return email in subsequent logins
#         email = decoded.get('email')
#         if not email:
#             # You'll need to store the email from the first login
#             # or use the 'sub' (subject) as a unique identifier
#             pass
            
#         # Find or create user
#         user = User.query.filter_by(email=email).first()
        
#         if not user:
#             user = User(
#                 username=email.split('@')[0],
#                 email=email,
#                 provider='apple'
#             )
#             db.session.add(user)
#             db.session.commit()
        
#         login_user(user)
        
#         return jsonify({
#             'message': 'Logged in with Apple successfully',
#             'user': user.to_dict(),
#             'token': user.get_auth_token()
#         })
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500    