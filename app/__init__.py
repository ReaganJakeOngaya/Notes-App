from datetime import timedelta
from flask import Flask, send_from_directory, request, make_response, jsonify, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager
from config import Config
import os
import logging

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    # Session configuration
    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_SAMESITE='None',
        SESSION_COOKIE_HTTPONLY=True,
        PERMANENT_SESSION_LIFETIME=timedelta(days=30),
        MAX_CONTENT_LENGTH=16 * 1024 * 1024  # 16MB limit
    )
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    
    # User loader
    from app.models import User
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Upload folder setup
    upload_folder = os.path.join(app.root_path, 'static', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    app.config['UPLOAD_FOLDER'] = upload_folder
    
    # Static files route
    @app.route('/static/<path:filename>')
    def static_files(filename):
        return send_from_directory(os.path.join(app.root_path, 'static'), filename)
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        try:
            db.session.execute('SELECT 1')
            return jsonify({'status': 'healthy'}), 200
        except Exception as e:
            logger.error(f"Database health check failed: {str(e)}")
            return jsonify({'status': 'unhealthy', 'error': str(e)}), 500
    
    # CORS configuration
    CORS(app, resources={
        r"/api/*": {
            "origins": ["https://notes-app-r4yj.vercel.app", "http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "expose_headers": ["Content-Type"],
            "supports_credentials": True,
            "max_age": 86400  # 1 day
        },
        r"/auth/*": {
            "origins": ["https://notes-app-r4yj.vercel.app", "http://localhost:3000"],
            "methods": ["POST", "OPTIONS"],
            "allow_headers": ["Content-Type"],
            "supports_credentials": True
        },
        r"/static/*": {
            "origins": ["*"],
            "methods": ["GET"]
        }
    })

    # Database connection management
    @app.before_request
    def check_db_connection():
        try:
            db.session.execute('SELECT 1')
        except Exception as e:
            logger.error(f"Database connection failed: {str(e)}")
            db.session.rollback()
            try:
                # Try to reconnect
                db.session.remove()
                db.get_engine(app).dispose()
                db.create_scoped_session()
                logger.info("Database reconnected successfully")
            except Exception as e:
                logger.error(f"Database reconnection failed: {str(e)}")
                return jsonify({'error': 'Database connection failed'}), 500

    # Security headers
    @app.after_request
    def add_security_headers(response):
        # CORS headers
        response.headers.add('Access-Control-Allow-Origin', 'https://notes-app-r4yj.vercel.app')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
        
        # CSP headers
        csp = (
            "default-src 'self' https://notes-app-20no.onrender.com; "
            "connect-src 'self' https://notes-app-20no.onrender.com; "
            "style-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; "
            "style-src-elem 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; "
            "font-src 'self' https://cdnjs.cloudflare.com data:; "
            "img-src 'self' data: https:; "
            "script-src 'self' 'unsafe-inline'"
        )
        response.headers['Content-Security-Policy'] = csp
        return response
   
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
    