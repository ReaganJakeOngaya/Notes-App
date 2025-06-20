import React, { useState, useContext, useRef, useEffect } from 'react';
import { NotesContext } from '../context/NotesContext';
import '../css/NoteEditor.css';

const NoteEditor = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState(note?.category || 'personal');
  const [tags, setTags] = useState(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const { addNote, editNote } = useContext(NotesContext);
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleEditorChange = (e) => {
    setContent(e.target.innerHTML);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    const noteData = { 
      title: title.trim(),
      content,
      category,
      tags,
      favorite: note?.favorite || false
    };

    try {
      if (note) {
        await editNote(note.id, noteData);
      } else {
        await addNote(noteData);
      }
      onSave();
    } catch (err) {
      console.error('Error saving note:', err);
      setError(err.message || 'Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTagKeyDown = (e) => {
    if (['Enter', ','].includes(e.key)) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Rich text editor commands
  const execCommand = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current.focus();
  };

  return (
    <div className="modal-overlay">
      <div className="modal fullscreen-editor">
        <div className="modal-header">
          <h2>{note ? 'Edit Note' : 'Create New Note'}</h2>
          <button className="close-btn" onClick={onCancel}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..." 
              maxLength="100"
              required
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
              <button type="button" title="Bold" onClick={() => execCommand('bold')}>
                <i className="fa-solid fa-bold"></i>
              </button>
              <button type="button" title="Italic" onClick={() => execCommand('italic')}>
                <i className="fa-solid fa-italic"></i>
              </button>
              <button type="button" title="Underline" onClick={() => execCommand('underline')}>
                <i className="fa-solid fa-underline"></i>
              </button>
              <div className="divider"></div>
              <button type="button" title="Bullet List" onClick={() => execCommand('insertUnorderedList')}>
                <i className="fa-solid fa-list-ul"></i>
              </button>
              <button type="button" title="Numbered List" onClick={() => execCommand('insertOrderedList')}>
                <i className="fa-solid fa-list-ol"></i>
              </button>
            </div>
            <div 
              ref={editorRef}
              className="editor" 
              contentEditable="true"
              onInput={handleEditorChange}
              onBlur={handleEditorChange}
              placeholder="Start writing your note..."
              suppressContentEditableWarning={true}
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
                placeholder="Add tags (press Enter to add)"
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
          >
            {isSaving ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Saving...
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk"></i>
                {note ? 'Update Note' : 'Save Note'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;