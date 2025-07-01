import React, { useState, useContext, useRef, useEffect } from 'react';
import { NotesContext } from '../context/NotesContext';

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

  const categoryColors = {
    personal: 'bg-green-100/80 text-green-800 dark:bg-green-900/80 dark:text-green-200',
    work: 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/80 dark:text-blue-200',
    ideas: 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/80 dark:text-yellow-200'
  };

  return (
    <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-white/30 dark:border-gray-700/50 ${
      inline ? '' : 'w-full max-w-3xl mx-auto'
    }`}>
      {!inline && (
        <div className="flex justify-between items-center p-4 border-b border-white/30 dark:border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button 
            className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full transition-all"
            onClick={onCancel}
            aria-label="Close editor"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      <div className="p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-100/80 dark:bg-red-900/80 text-red-700 dark:text-red-200 rounded-lg backdrop-blur-sm">
            {error}
          </div>
        )}

        <div>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..." 
            maxLength="100"
            className="w-full px-3 py-2 border border-white/30 dark:border-gray-700/50 rounded-lg bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30"
            required
          />
        </div>

        <div>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-white/30 dark:border-gray-700/50 rounded-lg bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30"
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="ideas">Ideas</option>
          </select>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 p-2 bg-white/50 dark:bg-gray-700/50 rounded-lg backdrop-blur-sm">
            <button 
              type="button" 
              title="Bold" 
              onClick={() => execCommand('bold')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-600/70 rounded transition-all"
            >
              <i className="fas fa-bold"></i>
            </button>
            <button 
              type="button" 
              title="Italic" 
              onClick={() => execCommand('italic')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-600/70 rounded transition-all"
            >
              <i className="fas fa-italic"></i>
            </button>
            <button 
              type="button" 
              title="Underline" 
              onClick={() => execCommand('underline')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-600/70 rounded transition-all"
            >
              <i className="fas fa-underline"></i>
            </button>
            <div className="w-px bg-white/30 dark:bg-gray-600/70 my-2"></div>
            <button 
              type="button" 
              title="Bullet List" 
              onClick={() => execCommand('insertUnorderedList')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-600/70 rounded transition-all"
            >
              <i className="fas fa-list-ul"></i>
            </button>
            <button 
              type="button" 
              title="Numbered List" 
              onClick={() => execCommand('insertOrderedList')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-600/70 rounded transition-all"
            >
              <i className="fas fa-list-ol"></i>
            </button>
          </div>
          <div 
            ref={editorRef}
            className="min-h-[200px] p-3 border border-white/30 dark:border-gray-700/50 rounded-lg bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            contentEditable="true"
            onInput={handleEditorChange}
            onBlur={handleEditorChange}
            placeholder="Start writing your note..."
            suppressContentEditableWarning={true}
          ></div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 p-2 border border-white/30 dark:border-gray-700/50 rounded-lg bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm">
            {tags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 py-1 bg-white/50 dark:bg-gray-600/70 text-gray-800 dark:text-gray-200 text-sm rounded-full backdrop-blur-sm"
              >
                {tag}
                <button 
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                  aria-label={`Remove tag ${tag}`}
                >
                  &times;
                </button>
              </span>
            ))}
            <input 
              type="text" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tags (press Enter to add)"
              className="flex-1 min-w-[100px] px-2 py-1 bg-transparent border-none focus:outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>
      </div>
      
      <div className={`flex ${inline ? 'justify-end' : 'justify-between'} p-4 border-t border-white/30 dark:border-gray-700/50`}>
        {!inline && (
          <button 
            className="px-4 py-2 bg-gray-200/80 hover:bg-gray-300/80 dark:bg-gray-700/80 dark:hover:bg-gray-600/80 text-gray-800 dark:text-white rounded-lg backdrop-blur-sm transition-all"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        )}
        <button 
          className="px-4 py-2 bg-indigo-600/90 hover:bg-indigo-700/90 text-white rounded-lg disabled:opacity-70 flex items-center backdrop-blur-sm transition-all"
          onClick={handleSave}
          disabled={isSaving || !title.trim()}
        >
          {isSaving ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Saving...
            </>
          ) : (
            <>
              <i className="fas fa-save mr-2"></i>
              {note ? 'Update Note' : 'Save Note'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;