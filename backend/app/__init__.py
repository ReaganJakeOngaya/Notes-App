from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager
from datetime import timedelta
from config import Config
import os

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    app.config.update(
        SESSION_COOKIE_SECURE=False, 
        SESSION_COOKIE_SAMESITE='Lax',
        SESSION_COOKIE_HTTPONLY=True,
        PERMANENT_SESSION_LIFETIME=timedelta(hours=1)
    )    
    
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit
    
    # In your app initialization code
    UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads')
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Create if it doesn't exist
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    
    print(f"Upload folder: {UPLOAD_FOLDER}")
    print(f"Exists: {os.path.exists(UPLOAD_FOLDER)}")
    print(f"Writable: {os.access(UPLOAD_FOLDER, os.W_OK)}")
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    
    # Import models here to avoid circular imports
    from app.models import User
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Move the before_first_request inside create_app
    @app.before_first_request
    def create_tables():
        with app.app_context():
            db.create_all()
    
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "https://your-render-app-url.onrender.com"], 
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "expose_headers": ["Content-Type"],
            "supports_credentials": True,
            "max_age": 3600
        },
        r"/auth/*": {
            "origins": ["http://localhost:5173", "https://your-render-app-url.onrender.com"],
            "methods": ["POST", "OPTIONS"],
            "allow_headers": ["Content-Type"],
            "supports_credentials": True
        }
    })    
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.notes import notes_bp
    from app.routes.users import users_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(notes_bp, url_prefix='/api/notes')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)