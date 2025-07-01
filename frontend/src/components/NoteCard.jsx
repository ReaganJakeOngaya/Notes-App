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
    return <div className="p-4 bg-red-100/80 text-red-700 rounded-lg backdrop-blur-sm">Error: Note data missing</div>;
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
    work: 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/80 dark:text-blue-200',
    personal: 'bg-green-100/80 text-green-800 dark:bg-green-900/80 dark:text-green-200',
    ideas: 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/80 dark:text-yellow-200',
    favorites: 'bg-pink-100/80 text-pink-800 dark:bg-pink-900/80 dark:text-pink-200'
  };

  return (
    <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden transition-all duration-200 border border-white/30 dark:border-gray-700/50 ${
      isExpanded ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''
    }`}>
      <div className="p-4 border-b border-white/30 dark:border-gray-700/50">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{note.title || 'Untitled Note'}</h3>
          <div className="flex space-x-2">
            <button 
              className={`p-2 rounded-full transition-all ${note.favorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'}`}
              onClick={() => onFavoriteToggle(note.id, note.favorite)}
              title={note.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <i className="fas fa-star"></i>
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full transition-all"
              onClick={() => onEdit(note)}
              title="Edit"
            >
              <i className="fas fa-pen-to-square"></i>
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full transition-all"
              onClick={() => setShowShareModal(true)}
              title="Share"
            >
              <i className="fas fa-share-nodes"></i>
            </button>
            <button 
              className="p-2 text-red-400 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400 rounded-full transition-all"
              onClick={() => removeNote(note.id)}
              title="Delete"
            >
              <i className="fas fa-trash-can"></i>
            </button>
            {!isExpanded ? (
              <button 
                className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full transition-all"
                onClick={() => onExpand(note.id)}
                title="View"
              >
                <i className="fas fa-expand"></i>
              </button>
            ) : (
              <button 
                className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full transition-all"
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
        className={`p-4 ${isExpanded ? '' : 'max-h-32 overflow-hidden'} bg-white/50 dark:bg-gray-700/50`}
        dangerouslySetInnerHTML={{ __html: note.content }} 
      />
      
      <div className="p-4 border-t border-white/30 dark:border-gray-700/50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryColors[note.category || 'personal']} backdrop-blur-sm`}>
            {getCategoryIcon(note.category || 'personal')} {note.category || 'personal'}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(note.modified_at)}
          </span>
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 text-xs rounded backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl w-full max-w-md border border-white/30 dark:border-gray-700/50">
            <div className="flex justify-between items-center p-4 border-b border-white/30 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Share Note</h3>
              <button 
                className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full transition-all"
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
                <div className="mb-4 p-3 bg-red-100/80 dark:bg-red-900/80 text-red-700 dark:text-red-200 rounded-lg backdrop-blur-sm">
                  {shareError}
                </div>
              )}
              {shareSuccess && (
                <div className="mb-4 p-3 bg-green-100/80 dark:bg-green-900/80 text-green-700 dark:text-green-200 rounded-lg backdrop-blur-sm">
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
                  className="w-full px-3 py-2 border border-white/30 dark:border-gray-700/50 rounded-lg bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Permission</label>
                <select
                  value={sharePermission}
                  onChange={(e) => setSharePermission(e.target.value)}
                  disabled={isSharing}
                  className="w-full px-3 py-2 border border-white/30 dark:border-gray-700/50 rounded-lg bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30"
                >
                  <option value="view">View Only</option>
                  <option value="edit">Can Edit</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-white/30 dark:border-gray-700/50 space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200/80 hover:bg-gray-300/80 dark:bg-gray-700/80 dark:hover:bg-gray-600/80 text-gray-800 dark:text-white rounded-lg backdrop-blur-sm transition-all"
                onClick={() => {
                  setShowShareModal(false);
                  setShareError(null);
                }}
                disabled={isSharing}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-indigo-600/90 hover:bg-indigo-700/90 text-white rounded-lg disabled:opacity-70 backdrop-blur-sm transition-all"
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