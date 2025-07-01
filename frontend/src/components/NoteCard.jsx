import React, { useContext, useState } from 'react'; 
import { NotesContext } from '../context/NotesContext';
import { formatDate } from '../utils/dateUtils';
import { getCategoryIcon } from '../utils/categoryUtils';

const NoteCard = ({ note, onEdit, onFavoriteToggle, isExpanded, onExpand }) => {
  const { removeNote, shareNoteWithUser } = useContext(NotesContext);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('view');
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!note) {
    return <div className="p-4 bg-red-100 text-red-700 rounded-lg">Error: Note data missing</div>;
  }

  const handleShare = async () => {
    if (!shareEmail.trim()) {
      setShareError('Email is required');
      return;
    }

    setIsSharing(true);
    setShareError(null);
    setShareSuccess(false);

    try {
      await shareNoteWithUser(note.id, shareEmail, sharePermission);
      setShareSuccess(true);
      setTimeout(() => {
        setShowShareModal(false);
        setShareSuccess(false);
        setShareEmail('');
      }, 1500);
    } catch (err) {
      console.error('Error sharing note:', err);
      setShareError(err.message || 'Failed to share note');
    } finally {
      setIsSharing(false);
    }
  };

  const categoryColors = {
    work: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    personal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    ideas: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    favorites: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 ${isExpanded ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{note.title || 'Untitled Note'}</h3>
          <div className="flex space-x-2">
            <button 
              className={`p-2 rounded-full ${note.favorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'}`}
              onClick={() => onFavoriteToggle(note.id, note.favorite)}
              title={note.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <i className="fas fa-star"></i>
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full"
              onClick={() => onEdit(note)}
              title="Edit"
            >
              <i className="fas fa-pen-to-square"></i>
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full"
              onClick={() => setShowShareModal(true)}
              title="Share"
            >
              <i className="fas fa-share-nodes"></i>
            </button>
            <button 
              className="p-2 text-red-400 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400 rounded-full"
              onClick={() => removeNote(note.id)}
              title="Delete"
            >
              <i className="fas fa-trash-can"></i>
            </button>
            {!isExpanded ? (
              <button 
                className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full"
                onClick={() => onExpand(note.id)}
                title="View"
              >
                <i className="fas fa-expand"></i>
              </button>
            ) : (
              <button 
                className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full"
                onClick={() => onExpand(null)}
                title="Collapse"
              >
                <i className="fas fa-compress"></i>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div 
        className={`p-4 ${isExpanded ? '' : 'max-h-32 overflow-hidden'}`}
        dangerouslySetInnerHTML={{ __html: note.content }} 
      />
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryColors[note.category || 'personal']}`}>
            {getCategoryIcon(note.category || 'personal')} {note.category || 'personal'}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(note.modified_at)}
          </span>
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Share Note</h3>
              <button 
                className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full"
                onClick={() => {
                  setShowShareModal(false);
                  setShareError(null);
                  setShareSuccess(false);
                }}
              >
                <i className="fas fa-xmark"></i>
              </button>
            </div>
            <div className="p-4">
              {shareError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-lg">
                  {shareError}
                </div>
              )}
              {shareSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-lg">
                  Note shared successfully!
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="user@example.com"
                  disabled={isSharing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Permission</label>
                <select
                  value={sharePermission}
                  onChange={(e) => setSharePermission(e.target.value)}
                  disabled={isSharing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="view">View Only</option>
                  <option value="edit">Can Edit</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700 space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg"
                onClick={() => {
                  setShowShareModal(false);
                  setShareError(null);
                }}
                disabled={isSharing}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-70"
                onClick={handleShare}
                disabled={isSharing || !shareEmail.trim()}
              >
                {isSharing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Sharing...
                  </>
                ) : (
                  'Share Note'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;