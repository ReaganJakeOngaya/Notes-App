import React, { useContext, useState } from 'react'; 
import { NotesContext } from '../context/NotesContext';
import { formatDate } from '../utils/dateUtils';
import { getCategoryIcon } from '../utils/categoryUtils';
import '../css/NoteCard.css';

const NoteCard = ({ note, onEdit, onFavoriteToggle }) => {
  const { removeNote, shareNoteWithUser } = useContext(NotesContext);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('view');
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!note) {
    return <div className="note-card error">Error: Note data missing</div>;
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

  return (
    <div className="note-card">
      <div className="note-header">
        <h3 className="note-title">{note.title || 'Untitled Note'}</h3>
        <div className="note-actions">
          <button 
            className={`action-btn ${note.favorite ? 'favorited' : ''}`}
            onClick={() => onFavoriteToggle(note.id, note.favorite)}
            title={note.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className="fa-solid fa-star"></i>
          </button>
          <button className="action-btn" onClick={() => onEdit(note)} title="Edit">
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
          <button className="action-btn" onClick={() => setShowShareModal(true)} title="Share">
            <i className="fa-solid fa-share-nodes"></i>
          </button>
          <button className="action-btn danger" onClick={() => removeNote(note.id)} title="Delete">
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
      
      {note.content && (
        <div className="note-content" dangerouslySetInnerHTML={{ __html: note.content }} />
      )}
      
      <div className="note-footer">
        <div className="note-meta">
          <span className={`category-badge category-${note.category || 'personal'}`}>
            {getCategoryIcon(note.category || 'personal')} {note.category || 'personal'}
          </span>
          <span className="note-date">{formatDate(note.modified_at)}</span>
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="note-tags">
            {note.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {showShareModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Share Note</h3>
              <button className="close-btn" onClick={() => {
                setShowShareModal(false);
                setShareError(null);
                setShareSuccess(false);
              }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              {shareError && <div className="error-message">{shareError}</div>}
              {shareSuccess && (
                <div className="success-message">
                  Note shared successfully!
                </div>
              )}
              <div className="form-group">
                <label>Recipient Email</label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="user@example.com"
                  disabled={isSharing}
                />
              </div>
              <div className="form-group">
                <label>Permission</label>
                <select
                  value={sharePermission}
                  onChange={(e) => setSharePermission(e.target.value)}
                  disabled={isSharing}
                >
                  <option value="view">View Only</option>
                  <option value="edit">Can Edit</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowShareModal(false);
                  setShareError(null);
                }}
                disabled={isSharing}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleShare}
                disabled={isSharing || !shareEmail.trim()}
              >
                {isSharing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Sharing...
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