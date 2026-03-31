import { useState } from 'react';
import { Sparkles, X, ArrowRight, Loader2 } from 'lucide-react';
import './Modal.css';

export default function AIAssistantModal({ isOpen, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    // Simulate API delay
    setTimeout(() => {
      setIsGenerating(false);
      onClose();
      // In a real app, this would redirect to Builder with the generated site
    }, 2500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content ai-modal">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="modal-header">
          <div className="ai-icon-wrapper">
            <Sparkles size={24} className="ai-icon" />
          </div>
          <h2>Generate with AI</h2>
          <p>Describe your business, and we'll build a complete website for you in seconds.</p>
        </div>

        <div className="modal-body">
          <textarea 
            className="ai-prompt-input"
            rows="4" 
            placeholder="e.g. A modern coffee shop in Seattle that also sells freshly roasted beans online..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
          ></textarea>
        </div>

        <div className="modal-footer">
          <button 
            className="btn-ai-generate" 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
          >
            {isGenerating ? (
              <><Loader2 size={16} className="spin" /> Generating Site...</>
            ) : (
              <>Generate Website <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
