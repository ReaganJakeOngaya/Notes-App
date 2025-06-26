import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotesContext } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import { formatDate } from '../utils/dateUtils';
import '../css/SharedNotes.css';

const getCategoryIcon = (category) => {
  const icons = {
    personal: 'fas fa-user',
    work: 'fas fa-briefcase',
    ideas: 'fas fa-lightbulb',
    favorites: 'fas fa-star',
    default: 'fas fa-file-alt'
  };
  return <i className={icons[category] || icons.default}></i>;
};

const SharedNotes = () => {
  const { sharedNotes, markNoteAsRead } = useContext(NotesContext);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleNoteClick = (noteId) => {
    markNoteAsRead(noteId);
  };

  return (
    <div className="shared-notes-container">
      <div className="main-header">
        <div className="header-content">
          <button className="back-btn" onClick={handleBackToHome}>
            <i className="fas fa-arrow-left"></i>
            <span>Back to Notes</span>
          </button>
          
          <div className="header-info">
            <h1 className="page-title">
              <i className="fas fa-share-alt header-icon"></i>
              Shared with Me
            </h1>
            <div className="notes-count-badge">
              <i className="fas fa-file-alt"></i>
              <span>{sharedNotes.length} {sharedNotes.length === 1 ? 'note' : 'notes'}</span>
            </div>
          </div>
        </div>
        
        <div className="header-gradient"></div>
      </div>

      <div className="content-area">
        {sharedNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <div className="empty-icon-container">
                <i className="fas fa-share-alt empty-icon"></i>
                <div className="icon-pulse"></div>
              </div>
            </div>
            <div className="empty-content">
              <h3 className="empty-title">No shared notes yet</h3>
              <p className="empty-description">
                Notes that others share with you will appear here.<br/>
                Start collaborating to see shared content!
              </p>
              <div className="empty-actions">
                <button className="btn-primary" onClick={handleBackToHome}>
                  <i className="fas fa-home"></i>
                  Go to My Notes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="notes-grid">
            {sharedNotes.map(note => (
              <div 
                key={note.id} 
                className={`shared-note-card ${!note.read ? 'unread' : ''}`}
                onClick={() => handleNoteClick(note.id)}
              >
                {!note.read && <div className="unread-indicator"></div>}
                
                <div className="shared-indicator">
                  <i className="fas fa-share-alt"></i>
                </div>
                
                <div className="note-header">
                  <h3 className="note-title">{note.title}</h3>
                  <div className="note-author">
                    <i className="fas fa-user-circle"></i>
                    <span>Shared by: {note.author || 'Unknown'}</span>
                  </div>
                </div>
                
                <div className="note-content" dangerouslySetInnerHTML={{ __html: note.content }} />
                
                <div className="note-footer">
                  <div className="note-meta">
                    <span className={`category-badge category-${note.category}`}>
                      {getCategoryIcon(note.category)} {note.category}
                    </span>
                    <span className="note-date">
                      <i className="fas fa-calendar-alt"></i>
                      Shared : {formatDate(note.shared_at || note.modified_at)}
                    </span>
                  </div>
                </div>
                
                <div className="card-hover-overlay"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedNotes;