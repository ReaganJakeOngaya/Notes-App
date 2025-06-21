import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///noteflow.db')
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,          # Check connection health before using
        'pool_recycle': 300,            # Recycle connections after 300 seconds
        'pool_timeout': 30,             # Wait 30 seconds for a connection
        'max_overflow': 20,             # Allow 20 overflow connections
        'pool_size': 10,                # Maintain 10 connections in pool
        'connect_args': {
            'connect_timeout': 10       # Wait 10 seconds for connection
        }
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # OAuth configuration
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    OAUTH_REDIRECT_URI = os.getenv('OAUTH_REDIRECT_URI', 'http://localhost:5000/auth/google/callback')
    
    # Apple OAuth configuration
    APPLE_CLIENT_ID = os.getenv('APPLE_CLIENT_ID')
    APPLE_TEAM_ID = os.getenv('APPLE_TEAM_ID')
    APPLE_KEY_ID = os.getenv('APPLE_KEY_ID')
    APPLE_PRIVATE_KEY_PATH = os.getenv('APPLE_PRIVATE_KEY_PATH', 'path/to/your/apple_private_key.p8')