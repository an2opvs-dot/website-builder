import { useState } from 'react';
import { Sparkles, X, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './Modal.css';

export default function AIAssistantModal({ isOpen, onClose, onGenerate }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    const apiKey = localStorage.getItem('gemini_api_key');
    
    if (!apiKey) {
      setError('Please set your Gemini API Key in the Settings page first.');
      return;
    }

    if (!prompt) return;
    
    setIsGenerating(true);
    setError('');

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `
        You are an expert website designer for a drag-and-drop website builder. 
        Your task is to generate a website layout based on a user's business description.
        
        The layout should be an array of "nodes". Each node must have a "type" and a "content" object.
        Supported types: "hero", "features", "pricing", "contact", "footer".
        
        Example Schema for nodes:
        - hero: { title, subtitle, bgColor }
        - features: { title, bgColor }
        - pricing: { title, bgColor }
        - contact: { title, btnText, bgColor }
        - footer: { brandName, bgColor }

        Rules:
        1. Return ONLY a valid JSON array of these nodes. 
        2. Do not include any markdown formatting like \`\`\`json.
        3. Ensure colors are modern and professional (e.g. #ffffff, #f8f9fa, #f1f3f5).
        4. Create a cohesive structure: usually starts with a hero and ends with a footer.
        5. Write catchy, relevant copy based on the user's description.
      `;

      const result = await model.generateContent([systemPrompt, `User Business Description: ${prompt}`]);
      const responseText = result.response.text();
      
      // Clean the response in case the model included markdown blocks
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        const layout = JSON.parse(cleanedJson);
        onGenerate(layout);
        onClose();
        setPrompt('');
      } catch (parseErr) {
        console.error("AI returned invalid JSON:", responseText);
        setError("The AI returned a malformed layout. Please try a different description.");
      }
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError(err.message || "Failed to connect to AI. Check your API key or connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ai-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="modal-header">
          <div className="ai-icon-wrapper">
            <Sparkles size={24} className="ai-icon" />
          </div>
          <h2>AI Website Generator</h2>
          <p>Describe your vision, and our AI will assemble your layout and original content.</p>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-banner" style={{display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '16px', border: '1px solid #fee2e2'}}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px'}}>Business Description</label>
          <textarea 
            className="ai-prompt-input"
            rows="5" 
            placeholder="e.g. A high-end sustainable fashion brand focused on artisanal organic cotton clothing for urban professionals."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            style={{width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', resize: 'vertical'}}
          ></textarea>
        </div>

        <div className="modal-footer">
          <button 
            className="btn-ai-generate" 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            style={{width: '100%', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: 'white', border: 'none', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)', transition: 'transform 0.2s', opacity: (isGenerating || !prompt) ? 0.7 : 1}}
          >
            {isGenerating ? (
              <><Loader2 size={20} className="spin" /> Building Your Site...</>
            ) : (
              <>Construct Website <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
