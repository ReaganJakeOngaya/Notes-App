import json
from datetime import datetime
from functools import wraps
from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def to_json(data):
    """Convert data to JSON with datetime support"""
    return json.dumps(data, default=json_serial)

def validate_email(email):
    """Basic email validation"""
    return '@' in email and '.' in email.split('@')[-1]

def hash_password(password):
    """Generate password hash"""
    return generate_password_hash(password)

def check_password(password_hash, password):
    """Check password against hash"""
    return check_password_hash(password_hash, password)

def token_required(f):
    """Decorator to verify JWT tokens"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
            
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
            
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
            
        return f(current_user, *args, **kwargs)
        
    return decorated

def admin_required(f):
    """Decorator to verify admin privileges"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
            
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
            
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            
            if not current_user.is_admin:
                return jsonify({'message': 'Admin privileges required!'}), 403
                
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
            
        return f(current_user, *args, **kwargs)
        
    return decorated