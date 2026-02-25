'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Sparkles, Layout, ZoomIn, Type, MinusCircle, PlusCircle, Maximize } from 'lucide-react';
import { CVData } from '@/utils/types';
import EditableText from './EditableText';

// Import templates
import PrimeAts from './templates/PrimeAts';
import MinimalAts from './templates/MinimalAts';
import Classic from './templates/Classic';
import Professional from './templates/Professional';

interface Props {
  data: CVData;
  templateId: string;
  profileImage?: string | null;
  onChange?: (newData: CVData) => void;
}

export default function CVRenderer({ data, templateId, profileImage, onChange }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const isAdjusting = useRef(false);
  
  // 1. Scaling States
  const [layoutMode, setLayoutMode] = useState<'normal' | 'tight' | 'extra-tight'>('normal');
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'small' | 'tiny'>('normal');
  const [internalScale, setInternalScale] = useState(1); // Fits content to A4
  const [previewScale, setPreviewScale] = useState(0.75); // Fits A4 to your Screen
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 2. Define Layout Variables
  const layoutVars = useMemo(() => {
    const modes = {
      'normal': { gap: '2rem', padding: '3rem', itemGap: '1rem' },
      'tight': { gap: '1rem', padding: '1.8rem', itemGap: '0.5rem' },
      'extra-tight': { gap: '0.4rem', padding: '1rem', itemGap: '0.2rem' }
    };
    const fonts = {
      'normal': '14px',
      'small': '13px',
      'tiny': '12px'
    };
    return { ...modes[layoutMode], fontBase: fonts[fontSizeMode] };
  }, [layoutMode, fontSizeMode]);

  // 3. Logic: The "Squeeze Ladder" (Content -> A4)
  useEffect(() => {
    const adjustLayout = () => {
      if (isAdjusting.current) return;
      const content = contentRef.current;
      if (!content) return;

      const A4_HEIGHT_PX = 1122; // Height of A4 at 96 DPI
      const SHRINK_THRESHOLD = A4_HEIGHT_PX + 2; 
      const GROW_THRESHOLD = A4_HEIGHT_PX - 80;

      isAdjusting.current = true;
      let currentHeight = content.scrollHeight;

      if (currentHeight > SHRINK_THRESHOLD) {
        if (layoutMode === 'normal') setLayoutMode('tight');
        else if (layoutMode === 'tight') setLayoutMode('extra-tight');
        else if (fontSizeMode === 'normal') setFontSizeMode('small');
        else if (fontSizeMode === 'small') setFontSizeMode('tiny');
        else if (internalScale === 1) {
          setInternalScale(Math.max(A4_HEIGHT_PX / currentHeight, 0.80));
        }
      } 
      else if (currentHeight < GROW_THRESHOLD) {
        if (internalScale < 1) setInternalScale(1);
        else if (fontSizeMode === 'tiny') setFontSizeMode('small');
        else if (fontSizeMode === 'small') setFontSizeMode('normal');
        else if (layoutMode === 'extra-tight') setLayoutMode('tight');
        else if (layoutMode === 'tight') setLayoutMode('normal');
      }

      setTimeout(() => { isAdjusting.current = false; }, 100);
    };

    const observer = new ResizeObserver(() => requestAnimationFrame(adjustLayout));
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [data, layoutMode, fontSizeMode, internalScale]);

  // 4. Viewport Helper: Fit A4 to Screen
  const autoFitToWindow = () => {
    const availableHeight = window.innerHeight - 250; // Padding for header/UI
    const a4HeightPx = 1122;
    setPreviewScale(Math.min(availableHeight / a4HeightPx, 1));
  };

  useEffect(() => {
    autoFitToWindow();
    window.addEventListener('resize', autoFitToWindow);
    return () => window.removeEventListener('resize', autoFitToWindow);
  }, []);

  // 5. Shared Handlers
  const handleUpdate = (path: string, newValue: any) => {
    if (!onChange) return;
    const newData = JSON.parse(JSON.stringify(data));
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) { current = current[keys[i]]; }
    current[keys[keys.length - 1]] = newValue;
    onChange(newData);
  };

  const removeItem = (path: string, index: number) => {
    if (!onChange) return;
    const newData = JSON.parse(JSON.stringify(data));
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) { current = current[keys[i]]; }
    const targetArray = current[keys[keys.length - 1]];
    if (Array.isArray(targetArray)) {
      targetArray.splice(index, 1);
      onChange(newData);
    }
  };

  const formattedData = { ...data, handleUpdate, removeItem, EditableText };

  const renderTemplate = () => {
    const templates = {
      'prime-ats': PrimeAts,
      minimal: MinimalAts,
      classic: Classic,
      professional: Professional,
    };
    const SelectedTemplate = templates[templateId as keyof typeof templates] || Professional;
    return <SelectedTemplate data={formattedData} />;
  };

  return (
    <div className="flex flex-col items-center py-10 bg-slate-100 min-h-screen overflow-x-hidden">
      
      {/* TOOLBAR */}
      <div className="mb-8 flex items-center gap-4 sticky top-5 z-50 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-2xl border border-white/50">
        <button 
          onClick={() => {/* AI Logic */}}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
        >
          <Sparkles size={16} /> Ajuster 1 Page
        </button>

        <div className="h-6 w-[1px] bg-slate-200" />

        {/* View Zoom Controls */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
          <button onClick={() => setPreviewScale(s => Math.max(s - 0.1, 0.3))} className="p-1 hover:bg-white rounded"><MinusCircle size={18}/></button>
          <span className="text-xs font-mono font-bold w-10 text-center">{Math.round(previewScale * 100)}%</span>
          <button onClick={() => setPreviewScale(s => Math.min(s + 0.1, 1.2))} className="p-1 hover:bg-white rounded"><PlusCircle size={18}/></button>
          <button onClick={autoFitToWindow} className="ml-1 p-1 hover:bg-white rounded text-blue-600" title="Ajuster à l'écran">
            <Maximize size={16} />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          <Layout size={12}/> {layoutMode} 
          <Type size={12} className="ml-2"/> {fontSizeMode}
        </div>
      </div>

      {/* CV CANVAS */}
      <div 
        className="transition-transform duration-500 ease-out shadow-[0_30px_60px_rgba(0,0,0,0.15)] bg-white"
        style={{
          transform: `scale(${previewScale})`,
          transformOrigin: 'top center',
          width: '210mm',
          height: '297mm',
          marginBottom: `calc(297mm * ${previewScale - 1} + 50px)`, // Fixes the white space gap below
          // CSS Variables for Template inheritance
          ...({
            '--cv-padding': layoutVars.padding,
            '--cv-gap': layoutVars.gap,
            '--cv-item-gap': layoutVars.itemGap,
            '--cv-font-base': layoutVars.fontBase,
          } as any)
        }}
      >
        <div 
          ref={contentRef}
          className="origin-top"
          style={{ 
            transform: `scale(${internalScale})`, 
            width: '100%',
            fontSize: 'var(--cv-font-base)'
          }}
        >
          {renderTemplate()}
        </div>
      </div>

      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        Standard A4 Format • Logiciel de Rendu v3.0
      </p>
    </div>
  );
}