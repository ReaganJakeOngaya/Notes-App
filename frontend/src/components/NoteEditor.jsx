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
    personal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    work: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    ideas: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${inline ? '' : 'w-full max-w-3xl mx-auto'}`}>
      {!inline && (
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button 
            className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full"
            onClick={onCancel}
            aria-label="Close editor"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      <div className="p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-lg">
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="ideas">Ideas</option>
          </select>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button 
              type="button" 
              title="Bold" 
              onClick={() => execCommand('bold')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <i className="fas fa-bold"></i>
            </button>
            <button 
              type="button" 
              title="Italic" 
              onClick={() => execCommand('italic')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <i className="fas fa-italic"></i>
            </button>
            <button 
              type="button" 
              title="Underline" 
              onClick={() => execCommand('underline')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <i className="fas fa-underline"></i>
            </button>
            <div className="w-px bg-gray-300 dark:bg-gray-600 my-2"></div>
            <button 
              type="button" 
              title="Bullet List" 
              onClick={() => execCommand('insertUnorderedList')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <i className="fas fa-list-ul"></i>
            </button>
            <button 
              type="button" 
              title="Numbered List" 
              onClick={() => execCommand('insertOrderedList')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <i className="fas fa-list-ol"></i>
            </button>
          </div>
          <div 
            ref={editorRef}
            className="min-h-[200px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            contentEditable="true"
            onInput={handleEditorChange}
            onBlur={handleEditorChange}
            placeholder="Start writing your note..."
            suppressContentEditableWarning={true}
          ></div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
            {tags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded-full"
              >
                {tag}
                <button 
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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
      
      <div className={`flex ${inline ? 'justify-end' : 'justify-between'} p-4 border-t border-gray-200 dark:border-gray-700`}>
        {!inline && (
          <button 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        )}
        <button 
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-70 flex items-center"
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