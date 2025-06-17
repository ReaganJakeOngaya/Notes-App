from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from app.models import User
from app import db
import os
from werkzeug.utils import secure_filename

users_bp = Blueprint('users', __name__)


# Allowed extensions for image uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@users_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    return jsonify({
        'id': current_user.id,
        'username': current_user.username,
        'email': current_user.email,
        'avatar': current_user.avatar,
        'bio': current_user.bio,
        'provider': current_user.provider
    })


@users_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    try:
        # Debug: Print incoming request data
        print("Request form data:", request.form)
        print("Request files:", request.files)

        # Extract form data
        data = request.form  # ImmutableMultiDict
        files = request.files

        # Update user fields
        if 'username' in data:
            current_user.username = data['username']
        if 'email' in data:
            current_user.email = data['email']
        if 'bio' in data:
            current_user.bio = data['bio']

        # Handle file upload (existing working code)
        if 'avatar' in files:
            file = files['avatar']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"user_{current_user.id}_{file.filename}")
                upload_folder = current_app.config['UPLOAD_FOLDER']
                file_path = os.path.join(upload_folder, filename)
                file.save(file_path)
                current_user.avatar = f"/static/uploads/{filename}"

        # Commit changes to database
        db.session.commit()

        # Debug: Print updated user data
        print("Updated user bio:", current_user.bio)
        return jsonify(current_user.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        print("Error updating profile:", str(e))
        return jsonify({"error": str(e)}), 500
    
@users_bp.route('/test_upload', methods=['POST'])
def test_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'message': 'File uploaded successfully'}), 200
    return jsonify({'error': 'File not allowed'}), 400

@users_bp.route('/check_uploads', methods=['GET'])
def check_uploads():
    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
    
    exists = os.path.exists(upload_folder)
    writable = os.access(upload_folder, os.W_OK) if exists else False
    
    return jsonify({
        'directory': upload_folder,
        'exists': exists,
        'writable': writable
    })