import React, { useState, useContext } from 'react';
import { NotesContext } from '../context/NotesContext';

const NoteEditor = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState(note?.category || 'personal');
  const [tags, setTags] = useState(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const { addNote, editNote } = useContext(NotesContext);

  const handleSave = () => {
    const noteData = { title, content, category, tags };
    if (note) {
      editNote(note.id, noteData).then(onSave);
    } else {
      addNote(noteData).then(onSave);
    }
  };

  const handleTagKeyDown = (e) => {
    if (['Enter', ','].includes(e.key)) {
      e.preventDefault();
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{note ? 'Edit Note' : 'Create New Note'}</h2>
          <button className="close-btn" onClick={onCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..." 
              maxLength="100"
            />
          </div>
          <div className="form-group">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="ideas">Ideas</option>
            </select>
          </div>
          <div className="form-group">
            <div className="editor-toolbar">
              <button type="button" title="Bold">
                <i className="fas fa-bold"></i>
              </button>
              <button type="button" title="Italic">
                <i className="fas fa-italic"></i>
              </button>
              <button type="button" title="Underline">
                <i className="fas fa-underline"></i>
              </button>
              <div className="divider"></div>
              <button type="button" title="Bullet List">
                <i className="fas fa-list-ul"></i>
              </button>
              <button type="button" title="Numbered List">
                <i className="fas fa-list-ol"></i>
              </button>
            </div>
            <div 
              className="editor" 
              contentEditable="true"
              dangerouslySetInnerHTML={{ __html: content }}
              onInput={(e) => setContent(e.target.innerHTML)}
              placeholder="Start writing your note..."
            ></div>
          </div>
          <div className="form-group">
            <div className="tag-input">
              <div className="tags">
                {tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button onClick={() => removeTag(tag)}>&times;</button>
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tags..."
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            <i className="fas fa-save"></i>
            {note ? 'Update Note' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;