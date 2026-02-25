import React, { useState } from 'react';
import { PlusCircle, Type, Heading, Palette } from 'lucide-react';

interface AddBlockProps {
  onAdd: (type: 'header' | 'text', color: string) => void;
}

const COLORS = [
  { name: 'Default', hex: 'inherit' },
  { name: 'Blue', hex: '#1d4ed8' },
  { name: 'Slate', hex: '#475569' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Rose', hex: '#e11d48' },
];

export default function AddBlock({ onAdd }: AddBlockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('inherit');

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-2 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 group mt-4 mb-4"
      >
        <PlusCircle size={16} className="group-hover:scale-110 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Ajouter un élément personnalisé</span>
      </button>
    );
  }

  return (
    <div className="p-4 border-2 border-blue-100 bg-blue-50/20 rounded-xl animate-in fade-in zoom-in duration-200">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-blue-900 uppercase tracking-tighter">Personnalisation</span>
          <button onClick={() => setIsOpen(false)} className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase">Annuler</button>
        </div>

        <div className="flex gap-4">
          {/* Pick Type */}
          <button 
            onClick={() => onAdd('header', selectedColor)}
            className="flex-1 bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-500 flex flex-col items-center gap-1 shadow-sm transition-all"
          >
            <Heading size={18} className="text-blue-600" />
            <span className="text-[10px] font-bold uppercase">Titre</span>
          </button>

          <button 
            onClick={() => onAdd('text', selectedColor)}
            className="flex-1 bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-500 flex flex-col items-center gap-1 shadow-sm transition-all"
          >
            <Type size={18} className="text-slate-600" />
            <span className="text-[10px] font-bold uppercase">Texte</span>
          </button>
        </div>

        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <Palette size={12} className="text-slate-400" />
          <div className="flex gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setSelectedColor(c.hex)}
                className={`w-4 h-4 rounded-full border ${selectedColor === c.hex ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                style={{ backgroundColor: c.hex === 'inherit' ? '#e2e8f0' : c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}