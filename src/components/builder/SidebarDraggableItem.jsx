import { useDraggable } from '@dnd-kit/core';

export default function SidebarDraggableItem({ id, type, label }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${id}`,
    data: {
      type: 'sidebar-item',
      componentType: type,
      label
    }
  });

  return (
    <div 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      className={`component-item ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
    >
      {label}
    </div>
  );
}
