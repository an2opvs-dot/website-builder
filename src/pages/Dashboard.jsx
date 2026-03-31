import { useState } from 'react';
import AnalyticsCards from '../components/dashboard/AnalyticsCards';
import SiteList from '../components/dashboard/SiteList';
import AIAssistantModal from '../components/modals/AIAssistantModal';
import { Sparkles, Plus } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header-title">
        <h1 style={{fontSize: '1.75rem', fontWeight: 600, margin: 0}}>Overview</h1>
        <div style={{display: 'flex', gap: '12px'}}>
          <button 
            className="btn-create-site ai-btn" 
            onClick={() => setIsAIModalOpen(true)}
            style={{background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', gap: '8px'}}
          >
            <Sparkles size={16} /> Generate with AI
          </button>
          <button className="btn-create-site" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Plus size={16} /> Blank Site
          </button>
        </div>
      </div>
      
      <div style={{marginTop: '32px'}}>
        <AnalyticsCards />
      </div>
      
      <div style={{marginTop: '48px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
          <h2 style={{fontSize: '1.25rem', fontWeight: 600, margin: 0}}>Your Websites</h2>
        </div>
        <SiteList />
      </div>

      <AIAssistantModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
      />
    </div>
  );
}
