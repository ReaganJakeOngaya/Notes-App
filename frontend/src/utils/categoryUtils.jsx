import React from 'react';
export const getCategoryIcon = (category) => {
  switch (category) {
    case 'work':
      return <i className="fas fa-briefcase"></i>;
    case 'personal':
      return <i className="fas fa-user"></i>;
    case 'ideas':
      return <i className="fas fa-lightbulb"></i>;
    default:
      return <i className="fas fa-sticky-note"></i>;
  }
};
  
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