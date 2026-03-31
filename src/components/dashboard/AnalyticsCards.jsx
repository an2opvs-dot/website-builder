import { Users, MousePointerClick, BarChart3, TrendingUp } from 'lucide-react';
import './AnalyticsCards.css';

export default function AnalyticsCards() {
  const stats = [
    { label: 'Total Visitors', value: '124,563', change: '+14%', icon: Users, positive: true },
    { label: 'Page Views', value: '412,892', change: '+21%', icon: MousePointerClick, positive: true },
    { label: 'Conversion Rate', value: '3.2%', change: '-0.4%', icon: BarChart3, positive: false },
    { label: 'Active Sites', value: '12', change: '+2', icon: TrendingUp, positive: true },
  ];

  return (
    <div className="analytics-grid">
      {stats.map((stat, idx) => (
        <div key={idx} className="analytics-card">
          <div className="card-header">
            <span className="card-label">{stat.label}</span>
            <div className="card-icon"><stat.icon size={18} /></div>
          </div>
          <div className="card-body">
            <span className="card-value">{stat.value}</span>
            <span className={`card-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
