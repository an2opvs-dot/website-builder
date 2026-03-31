import { MoreVertical, ExternalLink, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SiteList.css';

export default function SiteList() {
  const navigate = useNavigate();
  
  const sites = [
    { id: 1, name: 'Acme Corp', url: 'acmecorp.com', status: 'Published', lastEdited: '2h ago', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
    { id: 2, name: 'Portfolio 2024', url: 'johndoe.design', status: 'Draft', lastEdited: '1d ago', thumbnail: 'https://images.unsplash.com/photo-1542841791-1925b02a2bf8?auto=format&fit=crop&q=80&w=800' },
    { id: 3, name: 'SaaS Landing Page', url: 'buildflow.io', status: 'Published', lastEdited: '3d ago', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="site-grid">
      {sites.map((site) => (
        <div key={site.id} className="site-card">
          <div className="site-thumbnail" style={{backgroundImage: `url(${site.thumbnail})`}}>
            <div className="site-overlay">
              <button className="overlay-btn" onClick={() => navigate(`/builder/${site.id}`)}>
                <Edit3 size={16} /> Edit Site
              </button>
            </div>
          </div>
          <div className="site-info">
            <div className="site-header">
              <h3 className="site-name">{site.name}</h3>
              <button className="site-menu-btn"><MoreVertical size={16} /></button>
            </div>
            <a href={`https://${site.url}`} className="site-url">
              {site.url} <ExternalLink size={12} />
            </a>
            <div className="site-meta">
              <span className={`site-status ${site.status.toLowerCase()}`}>{site.status}</span>
              <span className="site-date">Edited {site.lastEdited}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
