import { Search, Filter, MonitorPlay, Check } from 'lucide-react';
import { useState } from 'react';
import './ThemeSelector.css';

export default function ThemeSelector() {
  const [activeTheme, setActiveTheme] = useState(1);
  
  const themes = [
    { id: 1, name: 'SaaS Nova', category: 'Technology', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', price: 'Free' },
    { id: 2, name: 'Creative Portfolio', category: 'Portfolio', image: 'https://images.unsplash.com/photo-1481481600465-d0114c2ad2f8?auto=format&fit=crop&q=80&w=800', price: 'Free' },
    { id: 3, name: 'E-commerce Pro', category: 'Store', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', price: '$49' },
    { id: 4, name: 'Local Business', category: 'Business', image: 'https://images.unsplash.com/photo-1542841791-1925b02a2bf8?auto=format&fit=crop&q=80&w=800', price: 'Free' },
    { id: 5, name: 'Minimal Blog', category: 'Blog', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800', price: 'Free' },
    { id: 6, name: 'Agency Landing', category: 'Agency', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800', price: '$29' },
  ];

  return (
    <div className="themes-page">
      <div className="themes-header">
        <div>
          <h1 style={{fontSize: '1.75rem', fontWeight: 600, margin: '0 0 8px 0'}}>Theme Library</h1>
          <p style={{color: 'var(--text-secondary)', margin: 0}}>Start your next project with a beautiful foundation.</p>
        </div>
        <div className="themes-actions">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search templates..." />
          </div>
          <button className="btn-filter">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="themes-grid">
        {themes.map(theme => (
          <div key={theme.id} className={`theme-card ${activeTheme === theme.id ? 'active' : ''}`}>
            <div className="theme-preview" style={{backgroundImage: `url(${theme.image})`}}>
              <div className="theme-overlay">
                <button className="preview-btn"><MonitorPlay size={16} /> Preview</button>
                <button className="apply-btn" onClick={() => setActiveTheme(theme.id)}>
                  {activeTheme === theme.id ? <><Check size={16} /> Applied</> : 'Use Theme'}
                </button>
              </div>
            </div>
            <div className="theme-info">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 className="theme-name">{theme.name}</h3>
                <span className="theme-price">{theme.price}</span>
              </div>
              <span className="theme-category">{theme.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
