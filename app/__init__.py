from datetime import timedelta
from urllib import response
from flask import Flask, send_from_directory, request, make_response, jsonify, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager
from config import Config
from sqlalchemy import text
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
    logging.getLogger('flask_cors').level = logging.DEBUG

    # Session configuration
    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_SAMESITE='None',
        SESSION_COOKIE_HTTPONLY=True,
        PERMANENT_SESSION_LIFETIME=timedelta(days=30),
        MAX_CONTENT_LENGTH=16 * 1024 * 1024,
        SESSION_COOKIE_DOMAIN=None
    )

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    from app.models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({'error': 'Unauthorized'}), 401

    # Static file uploads
    upload_folder = os.path.join(app.root_path, 'static', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    app.config['UPLOAD_FOLDER'] = upload_folder

    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to Notes App API. Use /api/ endpoints."}), 200

    @app.route('/static/<path:filename>')
    def static_files(filename):
        return send_from_directory(os.path.join(app.root_path, 'static'), filename)

    @app.route('/api/health')
    def health_check():
        try:
            db.session.execute(text('SELECT 1'))
            return jsonify({'status': 'healthy'}), 200
        except Exception as e:
            logger.error(f"Database health check failed: {str(e)}")
            return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

    # CORS Configuration
    allowed_origins = [
        "https://notes-app-seven-ecru.vercel.app",
        "https://notes-app-mnvs.vercel.app",
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative dev port
        "http://localhost:5000",  # Flask dev server
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5000"
    ]
    
    CORS(app, resources={
        r"/api/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "expose_headers": ["Content-Type", "Set-Cookie"],
            "supports_credentials": True,
            "max_age": 86400
        },
        r"/auth/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Set-Cookie"],
            "supports_credentials": True,
            "max_age": 86400
        },
        r"/static/*": {
            "origins": ["*"],
            "methods": ["GET", "HEAD", "OPTIONS"],
            "supports_credentials": False
        }
    })
    # Add explicit OPTIONS handler for preflight requests and security headers
    @app.after_request
    def after_request(response):
       response.headers.add('Access-Control-Allow-Credentials', 'true')
    
       # Handle preflight requests
       if request.method == 'OPTIONS':
           response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
           response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    
       # Add CSP headers - very permissive for development
       import os
       is_production = os.getenv('FLASK_ENV') == 'production'
       
       if is_production:
           # Strict CSP for production
           csp = (
               "default-src 'self' https://notes-app-20no.onrender.com https://cdnjs.cloudflare.com;"
               "connect-src 'self' https://notes-app-20no.onrender.com https://notes-app-seven-ecru.vercel.app https://notes-app-mnvs.vercel.app https://accounts.google.com https://appleid.apple.com;"
               "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;"
               "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;"
               "img-src 'self' data: https: blob:;"
               "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;"
               "frame-src 'self' https://accounts.google.com https://appleid.apple.com"
           )
       else:
           # Permissive CSP for development
           csp = (
               "default-src 'self' * http://* https://*;"
               "connect-src 'self' * http://* https://* ws: wss:;"
               "style-src 'self' 'unsafe-inline' * http://* https://*;"
               "font-src 'self' * http://* https://*;"
               "img-src 'self' * data: blob: http://* https://*;"
               "script-src 'self' 'unsafe-inline' * http://* https://*;"
               "frame-src 'self' * http://* https://*"
           )
       
       response.headers['Content-Security-Policy'] = csp
       return response

    @app.before_request
    def before_request_hooks():
        logger.info(f"Incoming request: {request.method} {request.path}")
        try:
            db.session.execute(text('SELECT 1'))
        except Exception as e:
            current_app.logger.error(f"Database connection failed: {str(e)}")
            return jsonify({'error': 'Database connection failed', 'detail': str(e)}), 500

    @app.route('/api/debug-db')
    def debug_db():
        try:
            result = db.session.execute(text("SELECT NOW()")).fetchone()
            return {"status": "connected", "time": str(result[0])}, 200
        except Exception as e:
            return {"error": str(e)}, 500

    @app.errorhandler(500)
    def handle_server_error(e):
        response = jsonify({
            'error': 'Internal server error',
            'message': str(e)
        })
        return response, 500

    @app.teardown_request
    def teardown_request(exception=None):
        if exception:
            db.session.rollback()
        db.session.remove()

    # Register Blueprints
    from app.routes.auth import auth_bp
    from app.routes.notes import notes_bp
    from app.routes.users import users_bp
    from app.routes.note_templates import note_template_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(notes_bp, url_prefix='/api/notes')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(note_template_bp, url_prefix='/api/templates')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
   