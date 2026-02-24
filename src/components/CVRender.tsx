'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Sparkles, Trash2, Layout, ZoomIn } from 'lucide-react';
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
  
  const [layoutMode, setLayoutMode] = useState<'normal' | 'tight' | 'extra-tight'>('normal');
  const [scale, setScale] = useState(1);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 1. Define Layout Constants
  const layoutVars = useMemo(() => ({
    'normal': { gap: '2rem', padding: '3rem', itemGap: '1rem' },
    'tight': { gap: '1.2rem', padding: '2rem', itemGap: '0.6rem' },
    'extra-tight': { gap: '0.6rem', padding: '1.2rem', itemGap: '0.3rem' }
  }[layoutMode]), [layoutMode]);

  // 2. Logic: Auto-Squeeze with Hysteresis (Prevents Jitter)
  useEffect(() => {
    const adjustLayout = () => {
      if (isAdjusting.current) return;
      const content = contentRef.current;
      if (!content) return;

      const A4_HEIGHT_PX = 1122;
      const SHRINK_THRESHOLD = A4_HEIGHT_PX + 5; 
      const GROW_THRESHOLD = A4_HEIGHT_PX - 100; // Only grow back if there's significant room

      isAdjusting.current = true;
      let currentHeight = content.scrollHeight;

      // SHRINK LOGIC
      if (currentHeight > SHRINK_THRESHOLD) {
        if (layoutMode === 'normal') setLayoutMode('tight');
        else if (layoutMode === 'tight') setLayoutMode('extra-tight');
        else if (layoutMode === 'extra-tight' && scale === 1) {
          const finalScale = A4_HEIGHT_PX / currentHeight;
          setScale(Math.max(finalScale, 0.85));
        }
      } 
      // GROW LOGIC (Lazy expansion to prevent loops)
      else if (currentHeight < GROW_THRESHOLD) {
        if (scale < 1) setScale(1);
        else if (layoutMode === 'extra-tight') setLayoutMode('tight');
        else if (layoutMode === 'tight') setLayoutMode('normal');
      }

      setTimeout(() => { isAdjusting.current = false; }, 150);
    };

    const observer = new ResizeObserver(() => requestAnimationFrame(adjustLayout));
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [data, templateId, layoutMode, scale]);

  // 3. AI Fit to Page Function
  const fitToPageWithAI = async () => {
    setIsAiLoading(true);
    try {
      // Replace with your actual Supabase / AI endpoint
      const response = await fetch('/api/ai/fit-to-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData: data }),
      });
      const optimizedData = await response.json();
      if (onChange) onChange(optimizedData);
    } catch (error) {
      console.error("AI adjustment failed", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // 4. Data Handlers passed to Templates
  const handleUpdate = (path: string, newValue: any) => {
    if (!onChange) return;
    const newData = JSON.parse(JSON.stringify(data));
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = newValue;
    onChange(newData);
  };

  const removeItem = (path: string, index: number) => {
    if (!onChange) return;
    const newData = JSON.parse(JSON.stringify(data));
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    const targetArray = current[keys[keys.length - 1]];
    if (Array.isArray(targetArray)) {
      targetArray.splice(index, 1);
      onChange(newData);
    }
  };

  const formattedData = {
    ...data,
    handleUpdate,
    removeItem,
    EditableText
  };

  const renderTemplate = () => {
    const templates = {
      modern: Professional,
      professional: Professional,
      'prime-ats': PrimeAts,
      minimal: MinimalAts,
      classic: Classic,
    };
    const SelectedTemplate = templates[templateId as keyof typeof templates] || Professional;
    return <SelectedTemplate data={formattedData} />;
  };

  return (
    <div className="flex flex-col items-center py-10 bg-slate-100 min-h-screen">
      
      {/* 5. TOP TOOLBAR */}
      <div className="mb-8 flex items-center gap-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-200">
        <button 
          onClick={fitToPageWithAI}
          disabled={isAiLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
        >
          <Sparkles size={18} className={isAiLoading ? "animate-spin" : ""} />
          {isAiLoading ? "Analyse en cours..." : "Ajuster par IA (1 Page)"}
        </button>
        
        <div className="h-6 w-[1px] bg-slate-200 mx-2" />
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-bold px-3 py-1.5 bg-slate-50 rounded-lg">
            <Layout size={14} />
            <span>Mode: {layoutMode}</span>
          </div>
          {scale < 1 && (
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-100 animate-in fade-in zoom-in">
              <ZoomIn size={14} />
              <span>Zoom: {Math.round(scale * 100)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* 6. CV CANVAS */}
      <div 
        className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-700 ease-in-out"
        style={{
          width: '210mm',
          height: '297mm',
          position: 'relative',
          ...({
            '--cv-padding': layoutVars.padding,
            '--cv-gap': layoutVars.gap,
            '--cv-item-gap': layoutVars.itemGap,
          } as any)
        }}
      >
        <div 
          ref={contentRef}
          className="origin-top transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
          style={{ transform: `scale(${scale})`, width: '100%' }}
        >
          {renderTemplate()}
        </div>
      </div>

      <p className="mt-6 text-slate-400 text-[11px] font-medium uppercase tracking-widest">
        A4 Format • Auto-fit active
      </p>
    </div>
  );
}