import { useState } from 'react';
import { Save } from 'lucide-react';
import './Settings.css';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('branding');

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1 style={{fontSize: '1.75rem', fontWeight: 600, margin: '0 0 8px 0'}}>Settings</h1>
          <p style={{color: 'var(--text-secondary)', margin: 0}}>Manage your platform preferences and integrations.</p>
        </div>
        <button className="btn-primary" style={{backgroundColor: 'var(--blue-primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 'var(--radius-md)', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="settings-content">
        <div className="settings-tabs">
          <button className={`tab-btn ${activeTab === 'branding' ? 'active' : ''}`} onClick={() => setActiveTab('branding')}>Branding</button>
          <button className={`tab-btn ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}>SEO Defaults</button>
          <button className={`tab-btn ${activeTab === 'integrations' ? 'active' : ''}`} onClick={() => setActiveTab('integrations')}>Integrations</button>
        </div>

        <div className="settings-panel">
          {activeTab === 'branding' && (
            <div className="form-section">
              <h3>Brand Identity</h3>
              <div className="form-group">
                <label>Platform Name</label>
                <input type="text" defaultValue="BuildFlow" />
              </div>
              <div className="form-group">
                <label>Logo</label>
                <div className="upload-area">Click to upload or drag and drop</div>
              </div>
              <div className="form-group">
                <label>Primary Brand Color</label>
                <input type="color" defaultValue="#3b82f6" className="color-input" />
              </div>
            </div>
          )}
          
          {activeTab === 'seo' && (
            <div className="form-section">
              <h3>Default SEO Meta</h3>
              <div className="form-group">
                <label>Default Title Suffix</label>
                <input type="text" defaultValue=" | Built with BuildFlow" />
              </div>
              <div className="form-group">
                <label>Default Description</label>
                <textarea rows="4" defaultValue="A modern website built with BuildFlow platform."></textarea>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="form-section">
              <h3>Connected Services</h3>
              <div className="integration-card">
                <div className="integration-info">
                  <h4>Google Analytics</h4>
                  <p>Track visitor behavior and metrics</p>
                </div>
                <button className="btn-connect">Connect</button>
              </div>
              <div className="integration-card">
                <div className="integration-info">
                  <h4>Mailchimp</h4>
                  <p>Sync newsletter subscribers</p>
                </div>
                <button className="btn-connect connected">Connected</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
