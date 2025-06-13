import React, { useContext } from 'react';
import { NotesContext } from '../context/NotesContext';
import NoteCard from './NoteCard';
import { formatDate } from '../utils/dateUtils';

const SharedNotes = () => {
  const { sharedNotes } = useContext(NotesContext);

  return (
    <div className="shared-notes-container">
      <div className="main-header">
        <h1>Shared with Me</h1>
        <span className="notes-count">{sharedNotes.length} notes</span>
      </div>

      {sharedNotes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-share-alt"></i>
          </div>
          <h3>No shared notes yet</h3>
          <p>Notes shared with you will appear here</p>
        </div>
      ) : (
        <div className="notes-grid">
          {sharedNotes.map(note => (
            <div key={note.id} className="note-card shared">
              <div className="note-header">
                <h3 className="note-title">{note.title}</h3>
                <div className="note-author">
                  Shared by: {note.author || 'Unknown'}
                </div>
              </div>
              
              <div className="note-content" dangerouslySetInnerHTML={{ __html: note.content }} />
              
              <div className="note-footer">
                <div className="note-meta">
                  <span className={`category-badge category-${note.category}`}>
                    {getCategoryIcon(note.category)} {note.category}
                  </span>
                  <span className="note-date">
                    Shared on {formatDate(note.shared_at || note.modified_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedNotes;