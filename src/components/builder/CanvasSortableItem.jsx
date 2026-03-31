import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripHorizontal } from 'lucide-react';

export default function CanvasSortableItem({ id, node, isSelected, onSelect, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    data: {
      type: 'canvas-item',
      node
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
    margin: '16px 0',
    border: isDragging ? '2px dashed var(--blue-primary)' : (isSelected ? '2px solid var(--blue-primary)' : '2px solid transparent'),
    backgroundColor: node.content?.bgColor || 'var(--bg-primary)',
    borderRadius: '8px',
    cursor: 'pointer'
  };

  const content = node.content || {};

  const renderComponent = () => {
    switch(node.type) {
      case 'hero':
        return (
          <div style={{padding: '60px 20px', textAlign: 'center', borderRadius: '8px'}}>
            <h1 style={{fontSize: '2.5rem', marginBottom: '16px'}}>{content.title}</h1>
            <p style={{color: '#666', maxWidth: '600px', margin: '0 auto'}}>{content.subtitle}</p>
          </div>
        );
      case 'features':
        return (
          <div style={{padding: '40px 20px', borderRadius: '8px', border: '1px solid #eee'}}>
            <h2 style={{textAlign: 'center', marginBottom: '24px'}}>{content.title}</h2>
            <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
              <div style={{width: '30%', height: '100px', background: '#f1f3f5', borderRadius: '4px'}}></div>
              <div style={{width: '30%', height: '100px', background: '#f1f3f5', borderRadius: '4px'}}></div>
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div style={{padding: '40px 20px', borderRadius: '8px'}}>
            <h2 style={{textAlign: 'center', marginBottom: '24px'}}>{content.title}</h2>
            <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
              <div style={{width: '250px', height: '300px', background: 'white', borderRadius: '8px', border: '1px solid #eee'}}></div>
              <div style={{width: '250px', height: '320px', background: 'var(--blue-primary)', borderRadius: '8px', marginTop: '-10px'}}></div>
            </div>
          </div>
        );
      case 'footer':
        return (
          <div style={{padding: '40px 20px', color: 'white', borderRadius: '8px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div>{content.brandName || 'Brand Logo'}</div>
              <div style={{display: 'flex', gap: '16px'}}><span>Home</span><span>Terms</span></div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div style={{padding: '40px 20px', borderRadius: '8px', border: '1px solid #eee'}}>
            <h2 style={{textAlign: 'center', marginBottom: '16px'}}>{content.title}</h2>
            <div style={{maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <input type="text" placeholder="Name" style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}} readOnly />
              <input type="email" placeholder="Email" style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}} readOnly />
              <button style={{padding: '10px', background: 'var(--blue-primary)', color: 'white', border: 'none', borderRadius: '4px'}}>{content.btnText || 'Submit'}</button>
            </div>
          </div>
        );
      default:
        return <div style={{padding: '20px', borderRadius: '4px'}}>{node.label || 'Unknown'} Component</div>;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="canvas-item-wrapper group" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* Drag handle */}
      {isSelected && (
        <div 
          {...attributes} 
          {...listeners} 
          className="drag-handle-overlay"
          style={{position: 'absolute', top: '-16px', left: '-16px', background: 'var(--blue-primary)', borderRadius: '4px', padding: '4px', cursor: 'grab', zIndex: 10, display: 'flex', boxShadow: 'var(--shadow-md)'}}
        >
          <GripHorizontal size={16} color="white" />
        </div>
      )}
      
      {renderComponent()}
      
      {isSelected && (
        <button 
          className="delete-node-btn"
          onClick={(e) => { e.stopPropagation(); onRemove(id); }}
          style={{position: 'absolute', top: '-16px', right: '-16px', background: '#ef4444', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer', color: 'white', zIndex: 10, display: 'flex', boxShadow: 'var(--shadow-md)'}}
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
