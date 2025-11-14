import React, { useState, useContext, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotesContext } from '../context/NotesContext';
import { 
  Save, X, Bold, Italic, Underline, 
  List, ListOrdered, Tag, Sparkles,
  Folder, Loader2
} from 'lucide-react';

const NoteEditor = ({ note, onSave, onCancel, inline = false }) => {
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

  const execCommand = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current.focus();
  };

  const categories = [
    { value: 'personal', label: 'Personal', color: '#0066FF' },
    { value: 'work', label: 'Work', color: '#00CC88' },
    { value: 'ideas', label: 'Ideas', color: '#FFAA00' },
    { value: 'study', label: 'Study', color: '#FF4444' }
  ];

  const getCategoryColor = (cat) => {
    return categories.find(c => c.value === cat)?.color || '#0066FF';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`editor-container ${inline ? 'inline-editor' : 'modal-editor'}`}
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        color: '#FFFFFF',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Header */}
      {!inline && (
        <motion.div 
          className="editor-header"
          style={{
            padding: '1.5rem 1.5rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={20} color="#0066FF" />
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.25rem', 
              fontWeight: 600,
              background: 'linear-gradient(90deg, #FFFFFF, #0066FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {note ? 'Edit Note' : 'Create New Note'}
            </h2>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </motion.button>
        </motion.div>
      )}
      
      {/* Body */}
      <div className="editor-body" style={{ padding: '1.5rem' }}>
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid rgba(255, 68, 68, 0.3)',
                color: '#FF4444',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..." 
            maxLength="100"
            required
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              color: '#FFFFFF',
              fontSize: '1.125rem',
              fontWeight: 600,
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = '#0066FF';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          />
        </div>

        {/* Category Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat.value)}
                style={{
                  background: category === cat.value 
                    ? `${cat.color}20` 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${category === cat.value ? cat.color : 'rgba(255, 255, 255, 0.1)'}`,
                  color: category === cat.value ? cat.color : 'rgba(255, 255, 255, 0.7)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.3s ease'
                }}
              >
                <Folder size={14} />
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Rich Text Editor */}
        <div style={{ marginBottom: '1.5rem' }}>
          {/* Toolbar */}
          <motion.div 
            className="editor-toolbar"
            style={{
              display: 'flex',
              gap: '0.25rem',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: 'none',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px'
            }}
          >
            {[
              { cmd: 'bold', icon: Bold, title: 'Bold' },
              { cmd: 'italic', icon: Italic, title: 'Italic' },
              { cmd: 'underline', icon: Underline, title: 'Underline' },
              { cmd: 'insertUnorderedList', icon: List, title: 'Bullet List' },
              { cmd: 'insertOrderedList', icon: ListOrdered, title: 'Numbered List' }
            ].map(({ cmd, icon: Icon, title }) => (
              <motion.button
                key={cmd}
                type="button"
                title={title}
                onClick={() => execCommand(cmd)}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 102, 255, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={16} />
              </motion.button>
            ))}
          </motion.div>

          {/* Editor */}
          <div 
            ref={editorRef}
            className="editor" 
            contentEditable="true"
            onInput={handleEditorChange}
            onBlur={handleEditorChange}
            placeholder="Start writing your note..."
            suppressContentEditableWarning={true}
            style={{
              minHeight: '200px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderTop: 'none',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
              padding: '1rem',
              color: '#FFFFFF',
              outline: 'none',
              fontSize: '0.95rem',
              lineHeight: '1.6'
            }}
          />
        </div>

        {/* Tags Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '0.5rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.875rem'
          }}>
            <Tag size={16} />
            <span>Tags</span>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '0.75rem',
            minHeight: '3rem'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {tags.map(tag => (
                <motion.span 
                  key={tag} 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="tag"
                  style={{
                    background: 'rgba(0, 102, 255, 0.2)',
                    border: '1px solid rgba(0, 102, 255, 0.3)',
                    color: '#0066FF',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {tag}
                  <motion.button 
                    onClick={() => removeTag(tag)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      lineHeight: 1
                    }}
                  >
                    &times;
                  </motion.button>
                </motion.span>
              ))}
            </div>
            <input 
              type="text" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tags (press Enter to add)"
              style={{
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                outline: 'none',
                width: '100%',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="editor-footer" style={{
        padding: '1rem 1.5rem 1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem'
      }}>
        {!inline && (
          <motion.button 
            className="btn btn-secondary" 
            onClick={onCancel} 
            disabled={isSaving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
          >
            Cancel
          </motion.button>
        )}
        <motion.button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={isSaving || !title.trim()}
          whileHover={{ scale: isSaving || !title.trim() ? 1 : 1.05 }}
          whileTap={{ scale: isSaving || !title.trim() ? 1 : 0.95 }}
          style={{
            background: isSaving || !title.trim() 
              ? 'rgba(0, 102, 255, 0.3)' 
              : 'linear-gradient(135deg, #0066FF, #0044CC)',
            border: 'none',
            color: '#FFFFFF',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: isSaving || !title.trim() ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: !isSaving && title.trim() ? '0 4px 20px rgba(0, 102, 255, 0.4)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={16} />
              </motion.div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              {note ? 'Update Note' : 'Save Note'}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NoteEditor;