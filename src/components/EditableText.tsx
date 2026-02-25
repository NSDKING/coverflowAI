'use client';

import React, { useState } from 'react';

interface Props {
  value: string;
  onSave: (v: string) => void;
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties; // Added to fix the TS error
}

export default function EditableText({ value, onSave, multiline, className, style }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    onSave(tempValue);
  };

  if (isEditing) {
    return multiline ? (
      <textarea
        className={`w-full bg-blue-50 border border-blue-200 rounded p-1 outline-none focus:ring-1 focus:ring-blue-400 ${className}`}
        value={tempValue}
        autoFocus
        style={style}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
      />
    ) : (
      <input
        className={`w-full bg-blue-50 border border-blue-200 rounded px-1 outline-none focus:ring-1 focus:ring-blue-400 ${className}`}
        value={tempValue}
        autoFocus
        style={style}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      style={style}
      className={`cursor-text hover:bg-slate-100 rounded transition-colors px-0.5 ${className}`}
    >
      {value || (multiline ? 'Cliquez pour ajouter du texte...' : 'Saisir...')}
    </span>
  );
}