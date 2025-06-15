import React, { useState, useRef, useEffect } from 'react';
import {  useAuth  } from '../context/AuthContext';
import '../css/UserProfile.css';

const UserProfile = ({ onClose }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    bio: user?.bio || ''
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const bioEditorRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (bioEditorRef.current) {
      bioEditorRef.current.innerHTML = formData.bio;
    }
  }, [formData.bio]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBioChange = () => {
    if (bioEditorRef.current) {
      setFormData({
        ...formData,
        bio: bioEditorRef.current.innerHTML
      });
    }
  };

  const handleFormatting = (command, value = null) => {
    document.execCommand(command, false, value);
    bioEditorRef.current.focus();
    handleBioChange();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('username', formData.username);
      form.append('email', formData.email);
      form.append('bio', formData.bio);
    
    // Only append file if it exists
      if (fileInputRef.current.files[0]) {
        form.append('avatar', fileInputRef.current.files[0]);
      }

      console.log('FormData contents:'); // Debug log
    // Log FormData contents (for debugging)
      for (let [key, value] of form.entries()) {
        console.log(key, value);
      }

      await updateProfile(form);
      onClose();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Profile Picture</label>
              <div className="avatar-upload">
                <div className="avatar-preview">
                  <img src={avatarPreview || '/default-avatar.png'} alt="Avatar Preview" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => fileInputRef.current.click()}
                >
                  Choose Image
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Bio</label>
              <div className="editor-toolbar">
                <button 
                  type="button" 
                  title="Bold"
                  onClick={() => handleFormatting('bold')}
                >
                  <i className="fa-solid fa-bold"></i>
                </button>
                <button 
                  type="button" 
                  title="Italic"
                  onClick={() => handleFormatting('italic')}
                >
                  <i className="fa-solid fa-italic"></i>
                </button>
                <button 
                  type="button" 
                  title="Underline"
                  onClick={() => handleFormatting('underline')}
                >
                  <i className="fa-solid fa-underline"></i>
                </button>
                <div className="divider"></div>
                <button 
                  type="button" 
                  title="Bullet List"
                  onClick={() => handleFormatting('insertUnorderedList')}
                >
                  <i className="fa-solid fa-list-ul"></i>
                </button>
                <button 
                  type="button" 
                  title="Numbered List"
                  onClick={() => handleFormatting('insertOrderedList')}
                >
                  <i className="fa-solid fa-list-ol"></i>
                </button>
                <div className="divider"></div>
                <button 
                  type="button" 
                  title="Link"
                  onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url) handleFormatting('createLink', url);
                  }}
                >
                  <i className="fa-solid fa-link"></i>
                </button>
              </div>
              <div 
                ref={bioEditorRef}
                className="editor bio-editor" 
                contentEditable="true"
                onInput={handleBioChange}
                onBlur={handleBioChange}
                placeholder="Tell us about yourself..."
                style={{ minHeight: '120px' }}
              ></div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Saving...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;