// Notes storage (in production, this would be connected to your backend)
let notes = [];
let currentFilter = 'all';
let currentView = 'grid';
let editingNoteId = null;
let currentSort = 'newest';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadNotes();
    initializeTheme();
});

// Load notes from backend
async function loadNotes() {
    try {
        const response = await fetch('/api/notes');
        notes = await response.json();
        renderNotes();
        updateCategoryCounts();
    } catch (error) {
        // Fallback to demo data if backend not available
        loadDemoData();
    }
}

// Demo data for testing
function loadDemoData() {
    notes = [
        {
            id: 1,
            title: "Welcome to NoteFlow",
            content: "This is your first note! You can <strong>format text</strong>, add <em>emphasis</em>, and organize your thoughts.",
            category: "personal",
            tags: ["welcome", "first-note"],
            favorite: false,
            created_at: new Date().toISOString(),
            modified_at: new Date().toISOString()
        },
        {
            id: 2,
            title: "Project Meeting Notes",
            content: "Discussed Q1 objectives and team assignments. Need to follow up on budget approval.",
            category: "work",
            tags: ["meeting", "project", "q1"],
            favorite: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            modified_at: new Date(Date.now() - 86400000).toISOString()
        }
    ];
    renderNotes();
    updateCategoryCounts();
}

// Render notes
function renderNotes() {
    const notesList = document.getElementById('notes-list');
    const emptyState = document.getElementById('empty-state');
    
    let filteredNotes = filterNotes();
    filteredNotes = sortNotesArray(filteredNotes);
    
    if (filteredNotes.length === 0) {
        notesList.style.display = 'none';
        emptyState.style.display = 'flex';
        updateNotesCount(0);
        return;
    }
    
    notesList.style.display = 'grid';
    emptyState.style.display = 'none';
    notesList.className = `notes-${currentView}`;
    
    notesList.innerHTML = filteredNotes.map(note => `
        <div class="note-card" data-note-id="${note.id}">
            <div class="note-header">
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <div class="note-actions">
                    <button class="action-btn ${note.favorite ? 'favorited' : ''}" onclick="toggleFavorite(${note.id})" title="Toggle Favorite">
                        <i class="fas fa-star"></i>
                    </button>
                    <div class="dropdown">
                        <button class="action-btn dropdown-toggle" onclick="toggleDropdown(${note.id})">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                        <div class="dropdown-menu" id="dropdown-${note.id}">
                            <button onclick="editNote(${note.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button onclick="duplicateNote(${note.id})">
                                <i class="fas fa-copy"></i> Duplicate
                            </button>
                            <button onclick="exportNote(${note.id})">
                                <i class="fas fa-download"></i> Export
                            </button>
                            <hr>
                            <button onclick="deleteNote(${note.id})" class="danger">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="note-content">
                ${truncateContent(note.content, 150)}
            </div>
            <div class="note-footer">
                <div class="note-meta">
                    <span class="category-badge category-${note.category}">
                        ${getCategoryIcon(note.category)} ${note.category}
                    </span>
                    <span class="note-date">${formatDate(note.modified_at)}</span>
                </div>
                <div class="note-tags">
                    ${note.tags ? note.tags.slice(0, 3).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('') : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    updateNotesCount(filteredNotes.length);
}

// Filter notes based on current filter
function filterNotes() {
    if (currentFilter === 'all') return notes;
    if (currentFilter === 'favorites') return notes.filter(note => note.favorite);
    return notes.filter(note => note.category === currentFilter);
}

// Sort notes
function sortNotesArray(notesArray) {
    switch (currentSort) {
        case 'newest':
            return notesArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        case 'oldest':
            return notesArray.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        case 'alphabetical':
            return notesArray.sort((a, b) => a.title.localeCompare(b.title));
        case 'modified':
            return notesArray.sort((a, b) => new Date(b.modified_at) - new Date(a.modified_at));
        default:
            return notesArray;
    }
}

// Search notes
function searchNotes() {
    const query = document.getElementById('search-input').value.toLowerCase();
    if (!query) {
        renderNotes();
        return;
    }
    
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(query)))
    );
    
    const notesList = document.getElementById('notes-list');
    const emptyState = document.getElementById('empty-state');
    
    if (filteredNotes.length === 0) {
        notesList.style.display = 'none';
        emptyState.style.display = 'flex';
        emptyState.querySelector('h3').textContent = 'No notes found';
        emptyState.querySelector('p').textContent = `No notes match "${query}"`;
        return;
    }
    
    // Render filtered notes similar to renderNotes()
    notesList.innerHTML = filteredNotes.map(note => `
        <div class="note-card">
            <div class="note-header">
                <h3 class="note-title">${highlightSearch(escapeHtml(note.title), query)}</h3>
                <div class="note-actions">
                    <button class="action-btn ${note.favorite ? 'favorited' : ''}" onclick="toggleFavorite(${note.id})">
                        <i class="fas fa-star"></i>
                    </button>
                </div>
            </div>
            <div class="note-content">
                ${highlightSearch(truncateContent(note.content, 150), query)}
            </div>
            <div class="note-footer">
                <div class="note-meta">
                    <span class="category-badge category-${note.category}">
                        ${getCategoryIcon(note.category)} ${note.category}
                    </span>
                    <span class="note-date">${formatDate(note.modified_at)}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    updateNotesCount(filteredNotes.length);
}

// Show new note modal
function showNewNoteModal() {
    editingNoteId = null;
    document.getElementById('modal-title').textContent = 'Create New Note';
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').innerHTML = '';
    document.getElementById('note-category').value = 'personal';
    document.getElementById('note-tags').innerHTML = '';
    document.getElementById('save-btn').innerHTML = '<i class="fas fa-save"></i> Save Note';
    document.getElementById('note-modal').style.display = 'flex';
    document.getElementById('note-title').focus();
}

// Edit note
function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    editingNoteId = id;
    document.getElementById('modal-title').textContent = 'Edit Note';
    document.getElementById('note-title').value = note.title;
    document.getElementById('note-content').innerHTML = note.content;
    document.getElementById('note-category').value = note.category;
    document.getElementById('save-btn').innerHTML = '<i class="fas fa-save"></i> Update Note';
    
    // Populate tags
    const tagsContainer = document.getElementById('note-tags');
    tagsContainer.innerHTML = note.tags ? note.tags.map(tag => 
        `<span class="tag">${escapeHtml(tag)}<button onclick="removeTag('${tag}')">&times;</button></span>`
    ).join('') : '';
    
    document.getElementById('note-modal').style.display = 'flex';
    closeAllDropdowns();
}

// Save note
async function saveNote() {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').innerHTML.trim();
    const category = document.getElementById('note-category').value;
    
    if (!title || !content) {
        showToast('Please fill in both title and content', 'error');
        return;
    }
    
    const tags = Array.from(document.querySelectorAll('#note-tags .tag'))
        .map(tag => tag.textContent.replace('×', '').trim());
    
    const noteData = {
        title,
        content,
        category,
        tags,
        modified_at: new Date().toISOString()
    };
    
    try {
        if (editingNoteId) {
            // Update existing note
            const response = await fetch(`/api/notes/${editingNoteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData)
            });
            
            if (response.ok) {
                const index = notes.findIndex(n => n.id === editingNoteId);
                notes[index] = { ...notes[index], ...noteData };
                showToast('Note updated successfully!', 'success');
            }
        } else {
            // Create new note
            noteData.created_at = new Date().toISOString();
            noteData.favorite = false;
            
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData)
            });
            
            if (response.ok) {
                const newNote = await response.json();
                notes.unshift(newNote);
                showToast('Note created successfully!', 'success');
            }
        }
        
        closeNoteModal();
        renderNotes();
        updateCategoryCounts();
    } catch (error) {
        // Fallback for demo - add to local array
        if (editingNoteId) {
            const index = notes.findIndex(n => n.id === editingNoteId);
            notes[index] = { ...notes[index], ...noteData };
            showToast('Note updated!', 'success');
        } else {
            const newNote = {
                id: Date.now(),
                ...noteData,
                created_at: new Date().toISOString(),
                favorite: false
            };
            notes.unshift(newNote);
            showToast('Note created!', 'success');
        }
        
        closeNoteModal();
        renderNotes();
        updateCategoryCounts();
    }
}

// Delete note
async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
        const response = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        if (response.ok) {
            notes = notes.filter(note => note.id !== id);
            showToast('Note deleted successfully!', 'success');
        }
    } catch (error) {
        // Fallback for demo
        notes = notes.filter(note => note.id !== id);
        showToast('Note deleted!', 'success');
    }
    
    renderNotes();
    updateCategoryCounts();
    closeAllDropdowns();
}

// Toggle favorite
async function toggleFavorite(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    note.favorite = !note.favorite;
    
    try {
        await fetch(`/api/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorite: note.favorite })
        });
    } catch (error) {
        // Fallback handled by local update
    }
    
    renderNotes();
    updateCategoryCounts();
    showToast(note.favorite ? 'Added to favorites!' : 'Removed from favorites!', 'success');
}

// Duplicate note
function duplicateNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    const duplicatedNote = {
        ...note,
        id: Date.now(),
        title: `${note.title} (Copy)`,
        created_at: new Date().toISOString(),
        modified_at: new Date().toISOString(),
        favorite: false
    };
    
    notes.unshift(duplicatedNote);
    renderNotes();
    updateCategoryCounts();
    showToast('Note duplicated!', 'success');
    closeAllDropdowns();
}

// Export note
function exportNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    const content = `# ${note.title}\n\n${note.content.replace(/<[^>]*>/g, '')}\n\nCategory: ${note.category}\nTags: ${note.tags ? note.tags.join(', ') : 'None'}\nCreated: ${formatDate(note.created_at)}`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Note exported!', 'success');
    closeAllDropdowns();
}

// Filter by category
function filterByCategory(category) {
    currentFilter = category;
    
    // Update active category
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Update view title
    const titles = {
        all: 'All Notes',
        favorites: 'Favorite Notes',
        work: 'Work Notes',
        personal: 'Personal Notes',
        ideas: 'Ideas'
    };
    document.getElementById('current-view-title').textContent = titles[category];
    
    renderNotes();
}

// Toggle view (grid/list)
function toggleView(view) {
    currentView = view;
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    renderNotes();
}

// Sort notes
function sortNotes() {
    currentSort = document.getElementById('sort-select').value;
    renderNotes();
}

// Format text in editor
function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('note-content').focus();
}

// Handle tag input
function handleTagInput(event) {
    if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        const tagInput = event.target;
        const tag = tagInput.value.trim();
        
        if (tag && !document.querySelector(`#note-tags .tag[data-tag="${tag}"]`)) {
            const tagsContainer = document.getElementById('note-tags');
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.setAttribute('data-tag', tag);
            tagElement.innerHTML = `${escapeHtml(tag)}<button onclick="removeTag('${tag}')">&times;</button>`;
            tagsContainer.appendChild(tagElement);
            tagInput.value = '';
        }
    }
}

// Remove tag
function removeTag(tag) {
    const tagElement = document.querySelector(`#note-tags .tag[data-tag="${tag}"]`);
    if (tagElement) {
        tagElement.remove();
    }
}

// Close modal
function closeNoteModal() {
    document.getElementById('note-modal').style.display = 'none';
}

function closeModal(event) {
    if (event.target === event.currentTarget) {
        closeNoteModal();
    }
}

// Toggle dropdown
function toggleDropdown(id) {
    closeAllDropdowns();
    const dropdown = document.getElementById(`dropdown-${id}`);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
    });
}

// Theme toggle
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        document.getElementById('theme-icon').className = 'fas fa-moon';
        storeValue('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        document.getElementById('theme-icon').className = 'fas fa-sun';
        storeValue('theme', 'dark');
    }
}

function initializeTheme() {
    const savedTheme = getValue('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-icon').className = 'fas fa-sun';
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Update category counts
function updateCategoryCounts() {
    document.getElementById('all-count').textContent = notes.length;
    document.getElementById('favorites-count').textContent = notes.filter(n => n.favorite).length;
    document.getElementById('work-count').textContent = notes.filter(n => n.category === 'work').length;
    document.getElementById('personal-count').textContent = notes.filter(n => n.category === 'personal').length;
    document.getElementById('ideas-count').textContent = notes.filter(n => n.category === 'ideas').length;
}

function updateNotesCount(count) {
    document.getElementById('notes-count').textContent = `${count} ${count === 1 ? 'note' : 'notes'}`;
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function truncateContent(content, maxLength) {
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
}

function getCategoryIcon(category) {
    const icons = {
        work: '<i class="fas fa-briefcase"></i>',
        personal: '<i class="fas fa-user"></i>',
        ideas: '<i class="fas fa-lightbulb"></i>'
    };
    return icons[category] || '<i class="fas fa-sticky-note"></i>';
}

function highlightSearch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\        function truncateContent(content, maxLength) {
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) +');
}

// Simple storage utilities (replace with actual storage in production)
function storeValue(key, value) {
    // In production, use localStorage or send to backend
    // localStorage.setItem(key, value);
}

function getValue(key) {
    // In production, use localStorage or fetch from backend
    // return localStorage.getItem(key);
    return null;
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown')) {
        closeAllDropdowns();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
            case 'n':
                event.preventDefault();
                showNewNoteModal();
                break;
            case 'f':
                event.preventDefault();
                document.getElementById('search-input').focus();
                break;
            case 's':
                if (document.getElementById('note-modal').style.display === 'flex') {
                    event.preventDefault();
                    saveNote();
                }
                break;
        }
    }
    
    if (event.key === 'Escape') {
        closeNoteModal();
        closeAllDropdowns();
    }
});