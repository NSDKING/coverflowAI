// components/EditableText.tsx
import { useState, useEffect } from "react";

interface Props {
  value: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  className?: string;
}

export default function EditableText({ value, onSave, multiline, className }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => { setTempValue(value); }, [value]);

  if (isEditing) {
    return multiline ? (
      <textarea
        autoFocus
        className={`w-full bg-blue-50 border-2 border-blue-400 rounded outline-none p-1 ${className}`}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(tempValue); }}
      />
    ) : (
      <input
        autoFocus
        className={`w-full bg-blue-50 border-2 border-blue-400 rounded outline-none p-1 ${className}`}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(tempValue); }}
        onKeyDown={(e) => { if (e.key === 'Enter') { setIsEditing(false); onSave(tempValue); } }}
      />
    );
  }

  return (
    <span 
      onDoubleClick={() => setIsEditing(true)}
      className={`cursor-edit hover:bg-blue-50/50 hover:ring-2 hover:ring-blue-200 rounded transition-all ${className}`}
      title="Double-cliquez pour éditer"
    >
      {value || <span className="text-slate-300 italic">Vide...</span>}
    </span>
  );
}