export function getCategoryIcon(category) {
    const icons = {
      work: <i className="fas fa-briefcase"></i>,
      personal: <i className="fas fa-user"></i>,
      ideas: <i className="fas fa-lightbulb"></i>,
      favorites: <i className="fas fa-star"></i>
    };
    
    return icons[category] || <i className="fas fa-sticky-note"></i>;
  }
  
  export function getCategoryColor(category) {
    const colors = {
      work: 'var(--category-work)',
      personal: 'var(--category-personal)',
      ideas: 'var(--category-ideas)',
      favorites: 'var(--category-favorites)'
    };
    
    return colors[category] || 'var(--primary-color)';
  }
  
  export function getCategoryName(category) {
    const names = {
      work: 'Work',
      personal: 'Personal',
      ideas: 'Ideas',
      favorites: 'Favorites'
    };
    
    return names[category] || 'Note';
  }