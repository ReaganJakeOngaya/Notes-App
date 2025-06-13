from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

app = Flask(__name__)

# Configure SQLAlchemy with SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the Notes model
class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), default='personal')
    tags = db.Column(db.Text)  # Store as JSON string
    favorite = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    modified_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "category": self.category,
            "tags": json.loads(self.tags) if self.tags else [],
            "favorite": self.favorite,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "modified_at": self.modified_at.isoformat() if self.modified_at else None
        }

# Create the database and tables
with app.app_context():
    db.create_all()
    
    # Add some sample data if database is empty
    if Note.query.count() == 0:
        sample_notes = [
            Note(
                title="Welcome to NoteFlow",
                content="This is your first note! You can <strong>format text</strong>, add <em>emphasis</em>, and organize your thoughts.",
                category="personal",
                tags=json.dumps(["welcome", "first-note"]),
                favorite=False
            ),
            Note(
                title="Project Meeting Notes",
                content="Discussed Q1 objectives and team assignments. Need to follow up on budget approval.",
                category="work",
                tags=json.dumps(["meeting", "project", "q1"]),
                favorite=True
            ),
            Note(
                title="App Development Ideas",
                content="<ul><li>Add dark mode toggle</li><li>Implement search functionality</li><li>Add export options</li></ul>",
                category="ideas",
                tags=json.dumps(["development", "features", "todo"]),
                favorite=False
            )
        ]
        
        for note in sample_notes:
            db.session.add(note)
        db.session.commit()

# Home route to serve the HTML page
@app.route('/')
def index():
    return render_template('index.html')

# API endpoint to get all notes
@app.route('/api/notes', methods=['GET'])
def get_notes():
    notes = Note.query.order_by(Note.created_at.desc()).all()
    return jsonify([note.to_dict() for note in notes])

# API endpoint to get a specific note by ID
@app.route('/api/notes/<int:note_id>', methods=['GET'])
def get_note(note_id):
    note = Note.query.get_or_404(note_id)
    return jsonify(note.to_dict())

# API endpoint to create a new note
@app.route('/api/notes', methods=['POST'])
def create_note():
    data = request.get_json()
    
    if not data or not data.get('title'):
        return jsonify({"error": "Title is required"}), 400
    
    new_note = Note(
        title=data['title'],
        content=data.get('content', ''),
        category=data.get('category', 'personal'),
        tags=json.dumps(data.get('tags', [])),
        favorite=data.get('favorite', False)
    )
    
    db.session.add(new_note)
    db.session.commit()
    return jsonify(new_note.to_dict()), 201

# API endpoint to update a note by ID
@app.route('/api/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    note = Note.query.get_or_404(note_id)
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Update fields if provided
    if 'title' in data:
        note.title = data['title']
    if 'content' in data:
        note.content = data['content']
    if 'category' in data:
        note.category = data['category']
    if 'tags' in data:
        note.tags = json.dumps(data['tags'])
    if 'favorite' in data:
        note.favorite = data['favorite']
    
    # Update modified_at timestamp
    note.modified_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify(note.to_dict())

# API endpoint to delete a note by ID
@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    note = Note.query.get_or_404(note_id)
    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted successfully"}), 200

# API endpoint to toggle favorite status
@app.route('/api/notes/<int:note_id>/favorite', methods=['POST'])
def toggle_favorite(note_id):
    note = Note.query.get_or_404(note_id)
    note.favorite = not note.favorite
    note.modified_at = datetime.utcnow()
    db.session.commit()
    return jsonify(note.to_dict())

# API endpoint to duplicate a note
@app.route('/api/notes/<int:note_id>/duplicate', methods=['POST'])
def duplicate_note(note_id):
    original_note = Note.query.get_or_404(note_id)
    
    new_note = Note(
        title=f"{original_note.title} (Copy)",
        content=original_note.content,
        category=original_note.category,
        tags=original_note.tags,
        favorite=False  # New duplicated notes are not favorited by default
    )
    
    db.session.add(new_note)
    db.session.commit()
    return jsonify(new_note.to_dict()), 201

# API endpoint to search notes
@app.route('/api/notes/search', methods=['GET'])
def search_notes():
    query = request.args.get('q', '').lower()
    category = request.args.get('category', 'all')
    
    if not query:
        return jsonify([])
    
    notes_query = Note.query
    
    # Filter by category if specified
    if category != 'all':
        if category == 'favorites':
            notes_query = notes_query.filter(Note.favorite == True)
        else:
            notes_query = notes_query.filter(Note.category == category)
    
    # Search in title, content, and tags
    notes = notes_query.all()
    matching_notes = []
    
    for note in notes:
        note_dict = note.to_dict()
        tags_text = ' '.join(note_dict['tags']).lower()
        
        if (query in note.title.lower() or 
            query in note.content.lower() or 
            query in tags_text):
            matching_notes.append(note_dict)
    
    return jsonify(matching_notes)

# API endpoint to get notes by category
@app.route('/api/notes/category/<category>', methods=['GET'])
def get_notes_by_category(category):
    if category == 'all':
        notes = Note.query.order_by(Note.created_at.desc()).all()
    elif category == 'favorites':
        notes = Note.query.filter(Note.favorite == True).order_by(Note.created_at.desc()).all()
    else:
        notes = Note.query.filter(Note.category == category).order_by(Note.created_at.desc()).all()
    
    return jsonify([note.to_dict() for note in notes])

# API endpoint to get category counts
@app.route('/api/notes/stats', methods=['GET'])
def get_notes_stats():
    total_notes = Note.query.count()
    favorites_count = Note.query.filter(Note.favorite == True).count()
    work_count = Note.query.filter(Note.category == 'work').count()
    personal_count = Note.query.filter(Note.category == 'personal').count()
    ideas_count = Note.query.filter(Note.category == 'ideas').count()
    
    return jsonify({
        'total': total_notes,
        'favorites': favorites_count,
        'work': work_count,
        'personal': personal_count,
        'ideas': ideas_count
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad request"}), 400

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)