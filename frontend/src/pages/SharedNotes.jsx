import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotesContext } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import { formatDate } from '../utils/dateUtils';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white pb-16 pt-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg mr-4"
              onClick={handleBackToHome}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              <span>Back to Notes</span>
            </button>
            
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                <i className="fas fa-share-alt mr-3"></i>
                Shared with Me
              </h1>
              <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full mt-2">
                <i className="fas fa-file-alt mr-2"></i>
                <span>{sharedNotes.length} {sharedNotes.length === 1 ? 'note' : 'notes'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        {sharedNotes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="w-32 h-32 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <i className="fas fa-share-alt text-indigo-600 dark:text-indigo-300 text-4xl"></i>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-700 animate-ping opacity-20"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No shared notes yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Notes that others share with you will appear here.<br/>
              Start collaborating to see shared content!
            </p>
            <button 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center mx-auto"
              onClick={handleBackToHome}
            >
              <i className="fas fa-home mr-2"></i>
              Go to My Notes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
            {sharedNotes.map(note => (
              <div 
                key={note.id} 
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative transition-transform hover:scale-[1.02] cursor-pointer ${!note.read ? 'ring-2 ring-indigo-500' : ''}`}
                onClick={() => handleNoteClick(note.id)}
              >
                {!note.read && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
                
                <div className="absolute top-2 left-2 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <i className="fas fa-share-alt text-indigo-600 dark:text-indigo-300"></i>
                </div>
                
                <div className="p-4 pt-12">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{note.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <i className="fas fa-user-circle mr-1"></i>
                      <span>Shared by: {note.author || 'Unknown'}</span>
                    </div>
                  </div>
                  
                  <div 
                    className="prose dark:prose-invert max-h-32 overflow-hidden mb-4"
                    dangerouslySetInnerHTML={{ __html: note.content }} 
                  />
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      note.category === 'work' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      note.category === 'personal' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      <i className={`fas ${
                        note.category === 'work' ? 'fa-briefcase' :
                        note.category === 'personal' ? 'fa-user' : 'fa-lightbulb'
                      } mr-1`}></i>
                      {note.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      <i className="fas fa-calendar-alt mr-1"></i>
                      {formatDate(note.shared_at || note.modified_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedNotes;