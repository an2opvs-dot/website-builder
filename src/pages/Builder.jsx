import { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  arrayMove, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

import { ArrowLeft, Monitor, Smartphone, Play, Globe, Plus, GripVertical, MoreVertical, LayoutTemplate, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublishModal from '../components/modals/PublishModal';
import AIAssistantModal from '../components/modals/AIAssistantModal';
import SidebarDraggableItem from '../components/builder/SidebarDraggableItem';
import CanvasSortableItem from '../components/builder/CanvasSortableItem';
import './Builder.css';

function DroppableCanvasArea({ children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
  });
  
  return (
    <div 
      ref={setNodeRef} 
      className="canvas-content" 
      style={{
        minHeight: '100%', 
        padding: '24px',
        backgroundColor: isOver ? 'var(--bg-tertiary)' : 'transparent',
        transition: 'background-color 0.2s ease',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={(e) => {
        // Deselect if clicking empty canvas
        if (e.target.className.includes('canvas-content') || e.target.className.includes('canvas-frame')) {
            document.dispatchEvent(new CustomEvent('deselect-node'));
        }
      }}
    >
      {children}
    </div>
  );
}

const defaultContent = {
  hero: { title: 'Welcome to Our Platform', subtitle: 'A descriptive catchy subtitle goes here.', bgColor: '#f8f9fa' },
  features: { title: 'Features', bgColor: '#ffffff' },
  pricing: { title: 'Simple Pricing', bgColor: '#f8f9fa' },
  footer: { brandName: 'Brand Logo', bgColor: '#111111' },
  contact: { title: 'Contact Us', btnText: 'Submit', bgColor: '#ffffff' }
};

export default function Builder() {
  const navigate = useNavigate();
  const [device, setDevice] = useState('desktop');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [leftTab, setLeftTab] = useState('components');

  const pages = [
    { id: 1, name: 'Home', isHome: true },
    { id: 2, name: 'About Us' },
    { id: 3, name: 'Contact' },
  ];

  // Drag and Drop State
  const [pagesData, setPagesData] = useState({
    1: [{ id: 'hero-1', type: 'hero', content: { ...defaultContent.hero } }]
  });
  const [activePageId, setActivePageId] = useState(1);
  const canvasNodes = pagesData[activePageId] || [];

  const updateCurrentPageNodes = (nodesOrFn) => {
    setPagesData(prev => ({
      ...prev,
      [activePageId]: typeof nodesOrFn === 'function' ? nodesOrFn(prev[activePageId] || []) : nodesOrFn
    }));
  };

  const [activeSidebarComponent, setActiveSidebarComponent] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const selectedNode = canvasNodes.find(n => n.id === selectedNodeId);

  // Listen to deselect event from canvas
  useEffect(() => {
    const handleDeselect = () => setSelectedNodeId(null);
    document.addEventListener('deselect-node', handleDeselect);
    return () => document.removeEventListener('deselect-node', handleDeselect);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    if (active.data.current?.type === 'sidebar-item') {
      setActiveSidebarComponent(active.data.current);
    }
  };

  const handleDragEnd = (event) => {
    setActiveSidebarComponent(null);
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.type === 'sidebar-item') {
      if (over.id === 'canvas-droppable' || canvasNodes.find(n => n.id === over.id)) {
        const cType = active.data.current.componentType;
        const newNode = {
          id: `node-${Date.now()}`,
          type: cType,
          content: { ...(defaultContent[cType] || {}) }
        };
        
        const overIndex = canvasNodes.findIndex(n => n.id === over.id);
        if (overIndex >= 0) {
          const newNodes = [...canvasNodes];
          newNodes.splice(overIndex + 1, 0, newNode);
          updateCurrentPageNodes(newNodes);
        } else {
          updateCurrentPageNodes([...canvasNodes, newNode]);
        }
        setSelectedNodeId(newNode.id);
      }
      return;
    }

    if (active.data.current?.type === 'canvas-item') {
      if (active.id !== over.id) {
        updateCurrentPageNodes((items) => {
          const oldIndex = items.findIndex(n => n.id === active.id);
          const newIndex = items.findIndex(n => n.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  };

  const handleRemoveNode = (id) => {
    updateCurrentPageNodes(nodes => nodes.filter(n => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const updateNodeContent = (key, value) => {
    if (!selectedNodeId) return;
    updateCurrentPageNodes(nodes => nodes.map(n => {
      if (n.id === selectedNodeId) {
        return { ...n, content: { ...n.content, [key]: value } };
      }
      return n;
    }));
  };

  const handleAIGenerate = (generatedNodes) => {
    // Basic validation
    if (!Array.isArray(generatedNodes)) return;
    
    // Assign IDs if missing
    const nodesWithIds = generatedNodes.map((node, index) => ({
        ...node,
        id: node.id || `ai-node-${Date.now()}-${index}`
    }));

    updateCurrentPageNodes(nodesWithIds);
    setIsAIModalOpen(false);
  };

  const sidebarComponents = [
    { id: 'comp-1', type: 'hero', label: 'Hero Section' },
    { id: 'comp-2', type: 'features', label: 'Features Grid' },
    { id: 'comp-3', type: 'pricing', label: 'Pricing Table' },
    { id: 'comp-4', type: 'contact', label: 'Contact Form' },
    { id: 'comp-5', type: 'footer', label: 'Footer' },
  ];

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="builder-layout" onClick={(e) => {
        if(e.target.className === 'builder-layout') {
          setSelectedNodeId(null);
        }
      }}>
        {/* Top Navigation */}
        <header className="builder-header">
          <div className="builder-header-left">
            <button className="icon-btn" onClick={() => navigate('/')}>
              <ArrowLeft size={18} />
            </button>
            <span className="builder-site-name">My Awesome Site</span>
          </div>
          
          <div className="builder-header-center">
            <div className="device-toggle">
              <button 
                className={`device-btn ${device === 'desktop' ? 'active' : ''}`}
                onClick={() => setDevice('desktop')}
              >
                <Monitor size={16} />
              </button>
              <button 
                className={`device-btn ${device === 'mobile' ? 'active' : ''}`}
                onClick={() => setDevice('mobile')}
              >
                <Smartphone size={16} />
              </button>
            </div>
          </div>
          
          <div className="builder-header-right">
            <button className="btn-ai-sparkle" onClick={() => setIsAIModalOpen(true)} style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', marginRight: '12px', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.25)'}}>
              <Sparkles size={16} /> AI Build
            </button>
            <button className="btn-secondary">
              <Play size={16} /> Preview
            </button>
            <button className="btn-primary" onClick={() => setIsPublishModalOpen(true)}>
              <Globe size={16} /> Export / Publish
            </button>
          </div>
        </header>
        
        {/* Main Workspace */}
        <div className="builder-workspace">
          {/* Left Panel */}
          <aside className="builder-sidebar-left">
            <div className="sidebar-tab-header">
              <button 
                className={`panel-tab ${leftTab === 'components' ? 'active' : ''}`}
                onClick={() => setLeftTab('components')}
              >
                <LayoutTemplate size={16} /> Add 
              </button>
              <button 
                className={`panel-tab ${leftTab === 'pages' ? 'active' : ''}`}
                onClick={() => setLeftTab('pages')}
              >
                <FileText size={16} /> Pages
              </button>
            </div>

            {leftTab === 'components' && (
              <div className="components-list">
                {sidebarComponents.map(comp => (
                  <SidebarDraggableItem 
                    key={comp.id} 
                    id={comp.id} 
                    type={comp.type} 
                    label={comp.label} 
                  />
                ))}
              </div>
            )}

            {leftTab === 'pages' && (
              <div className="pages-list">
                <button className="btn-add-page">
                  <Plus size={16} /> Add New Page
                </button>
                <div className="pages-container">
                  {pages.map(page => (
                    <div 
                      key={page.id} 
                      className="page-item" 
                      onClick={() => { setActivePageId(page.id); setSelectedNodeId(null); }}
                      style={{ borderColor: activePageId === page.id ? 'var(--blue-primary)' : 'var(--border-color)', borderWidth: activePageId === page.id ? '2px' : '1px' }}
                    >
                      <div className="page-item-left">
                        <GripVertical size={14} className="drag-handle" />
                        <span className="page-name">{page.name}</span>
                        {page.isHome && <span className="badge-home">Home</span>}
                      </div>
                      <button className="page-menu-btn"><MoreVertical size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
          
          {/* Center Canvas */}
          <main className={`builder-canvas ${device}`}>
            <div className="canvas-frame">
              <DroppableCanvasArea>
                {canvasNodes.length === 0 ? (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '2px dashed var(--border-color)', borderRadius: '8px', margin: '32px' }}>
                    Drag and drop components from the left panel to start building.
                  </div>
                ) : (
                  <SortableContext items={canvasNodes.map(n => n.id)} strategy={verticalListSortingStrategy}>
                    {canvasNodes.map((node) => (
                      <CanvasSortableItem 
                        key={node.id} 
                        id={node.id} 
                        node={node} 
                        isSelected={selectedNodeId === node.id}
                        onSelect={() => setSelectedNodeId(node.id)}
                        onRemove={handleRemoveNode}
                      />
                    ))}
                  </SortableContext>
                )}
              </DroppableCanvasArea>
            </div>
          </main>
          
          {/* Right Panel */}
          <aside className="builder-sidebar-right">
            <div className="sidebar-tab-header">
              <h3 style={{margin: 0, paddingLeft: '16px', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)'}}>Properties</h3>
            </div>
            <div className="properties-panel">
              {!selectedNode ? (
                <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '40px'}}>
                  Select a component on the canvas to edit its properties.
                </div>
              ) : (
                <>
                  <div style={{marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)'}}>
                    <strong style={{textTransform: 'capitalize'}}>{selectedNode.type} Settings</strong>
                  </div>

                  <div className="property-group">
                    <label>Background Color</label>
                    <input 
                      type="color" 
                      value={selectedNode.content.bgColor || '#ffffff'} 
                      onChange={(e) => updateNodeContent('bgColor', e.target.value)}
                      className="color-picker" 
                    />
                  </div>

                  {selectedNode.content.title !== undefined && (
                    <div className="property-group">
                      <label>Title</label>
                      <input 
                        type="text" 
                        value={selectedNode.content.title}
                        onChange={(e) => updateNodeContent('title', e.target.value)}
                        style={{padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)'}}
                      />
                    </div>
                  )}

                  {selectedNode.content.subtitle !== undefined && (
                    <div className="property-group">
                      <label>Subtitle</label>
                      <textarea 
                        rows="3"
                        value={selectedNode.content.subtitle}
                        onChange={(e) => updateNodeContent('subtitle', e.target.value)}
                        style={{padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical'}}
                      />
                    </div>
                  )}

                  {selectedNode.content.btnText !== undefined && (
                    <div className="property-group">
                      <label>Button Text</label>
                      <input 
                        type="text" 
                        value={selectedNode.content.btnText}
                        onChange={(e) => updateNodeContent('btnText', e.target.value)}
                        style={{padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)'}}
                      />
                    </div>
                  )}
                  
                  {selectedNode.content.brandName !== undefined && (
                    <div className="property-group">
                      <label>Brand Name</label>
                      <input 
                        type="text" 
                        value={selectedNode.content.brandName}
                        onChange={(e) => updateNodeContent('brandName', e.target.value)}
                        style={{padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)'}}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>

        <DragOverlay>
          {activeSidebarComponent ? (
            <div className="component-item" style={{ opacity: 0.9, backgroundColor: 'var(--bg-primary)', borderColor: 'var(--blue-primary)', boxShadow: 'var(--shadow-lg)' }}>
              {activeSidebarComponent.label}
            </div>
          ) : null}
        </DragOverlay>

        <PublishModal 
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          pagesData={pagesData}
          pages={pages}
        />

        <AIAssistantModal 
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onGenerate={handleAIGenerate}
        />
      </div>
    </DndContext>
  );
}
