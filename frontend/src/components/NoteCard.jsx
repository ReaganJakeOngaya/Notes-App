import React, { useContext } from 'react';
import { NotesContext } from '../context/NotesContext';
import { formatDate } from '../utils/dateUtils';
import { getCategoryIcon } from '../utils/categoryUtils';

const NoteCard = ({ note, onEdit, onFavoriteToggle }) => {
  const { removeNote, shareNoteWithUser } = useContext(NotesContext);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('view');

  const handleShare = () => {
    shareNoteWithUser(note.id, shareEmail, sharePermission);
    setShowShareModal(false);
  };

  return (
    <div className="note-card">
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          <button 
            className={`action-btn ${note.favorite ? 'favorited' : ''}`}
            onClick={() => onFavoriteToggle(note.id, note.favorite)}
            title={note.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className="fas fa-star"></i>
          </button>
          <button className="action-btn" onClick={() => onEdit(note)} title="Edit">
            <i className="fas fa-edit"></i>
          </button>
          <button className="action-btn" onClick={() => setShowShareModal(true)} title="Share">
            <i className="fas fa-share-alt"></i>
          </button>
          <button className="action-btn danger" onClick={() => removeNote(note.id)} title="Delete">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <div className="note-content" dangerouslySetInnerHTML={{ __html: note.content }} />
      
      <div className="note-footer">
        <div className="note-meta">
          <span className={`category-badge category-${note.category}`}>
            {getCategoryIcon(note.category)} {note.category}
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
              <button className="close-btn" onClick={() => setShowShareModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Recipient Email</label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <div className="form-group">
                <label>Permission</label>
                <select
                  value={sharePermission}
                  onChange={(e) => setSharePermission(e.target.value)}
                >
                  <option value="view">View Only</option>
                  <option value="edit">Can Edit</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowShareModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleShare}>
                Share Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
