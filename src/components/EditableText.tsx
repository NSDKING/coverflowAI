import { useState, useEffect, useRef } from "react";

interface Props {
  value: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  className?: string;
}

export default function EditableText({ value, onSave, multiline, className }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  
  // Update local state if external data changes
  useEffect(() => { setTempValue(value); }, [value]);

  // Common styles to prevent jumping
  // We use border-transparent in display mode so the 2px border space is always there.
  const sharedStyles = `
    w-full transition-all duration-200 rounded
    ${className} 
    border-2 p-1 
    leading-inherit font-inherit text-inherit
  `;

  if (isEditing) {
    const editStyles = `${sharedStyles} bg-blue-50 border-blue-400 outline-none shadow-inner`;
    
    return multiline ? (
      <textarea
        autoFocus
        rows={3}
        className={`${editStyles} block resize-none`}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(tempValue); }}
      />
    ) : (
      <input
        autoFocus
        className={editStyles}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(tempValue); }}
        onKeyDown={(e) => { 
          if (e.key === 'Enter') { 
            setIsEditing(false); 
            onSave(tempValue); 
          } 
        }}
      />
    );
  }

  return (
    <span 
      onDoubleClick={() => setIsEditing(true)}
      className={`
        ${sharedStyles}
        inline-block
        cursor-text
        border-transparent 
        hover:bg-blue-50/50 hover:border-blue-200 
      `}
      title="Double-cliquez pour éditer"
    >
      {value || <span className="opacity-40 italic">Vide...</span>}
    </span>
  );
}