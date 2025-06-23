from datetime import timedelta
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
    CORS(app, resources={
        r"/api/*": {
            "origins": ["https://notes-app-r4yj.vercel.app"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "expose_headers": ["Content-Type", "Set-Cookie"],
            "supports_credentials": True,
            "max_age": 86400
        },
        r"/auth/*": {
            "origins": ["https://notes-app-r4yj.vercel.app"],
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

    @app.after_request
    def add_security_headers(response):
        # Let Flask-CORS handle CORS headers
        csp = (
            "default-src 'self' https://notes-app-20no.onrender.com https://cdnjs.cloudflare.com;"
            "connect-src 'self' https://notes-app-20no.onrender.com https://notes-app-r4yj.vercel.app;"
            "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;"
            "style-src-elem 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;"
            "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data: blob:;"
            "img-src 'self' data: https: blob:;"
            "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;"
            "frame-src 'self' https://accounts.google.com https://appleid.apple.com"
        )
        response.headers['Content-Security-Policy'] = csp
        return response

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

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(notes_bp, url_prefix='/api/notes')
    app.register_blueprint(users_bp, url_prefix='/api/users')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)


    # # CORS Configuration
    # CORS(app, resources={
    #     r"/api/*": {
    #         "origins": ["https://notes-app-r4yj.vercel.app"],
    #         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    #         "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
    #         "expose_headers": ["Content-Type", "Set-Cookie"],
    #         "supports_credentials": True,
    #         "max_age": 86400
    #     },
    #     r"/auth/*": {
    #         "origins": ["https://notes-app-r4yj.vercel.app"],
    #         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    #         "allow_headers": ["Content-Type", "Authorization"],
    #         "expose_headers": ["Content-Type", "Set-Cookie"],
    #         "supports_credentials": True,
    #         "max_age": 86400
    #     },
    #     r"/static/*": {
    #         "origins": ["*"],
    #         "methods": ["GET"]
    #     }
    # })

   