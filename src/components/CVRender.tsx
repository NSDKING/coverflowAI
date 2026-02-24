'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
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
  const isAdjusting = useRef(false); // Prevents feedback loops
  
  const [layoutMode, setLayoutMode] = useState<'normal' | 'tight' | 'extra-tight'>('normal');
  const [scale, setScale] = useState(1);

  // 1. Move the layout variables into a memo to prevent object creation on every render
  const layoutVars = useMemo(() => ({
    'normal': { gap: '1.5rem', padding: '3rem', itemGap: '1rem' },
    'tight': { gap: '1rem', padding: '2rem', itemGap: '0.5rem' },
    'extra-tight': { gap: '0.5rem', padding: '1.5rem', itemGap: '0.25rem' }
  }[layoutMode]), [layoutMode]);

  useEffect(() => {
    const adjustLayout = () => {
      // If we are already in the middle of an adjustment, skip to avoid loops
      if (isAdjusting.current) return;
      
      const content = contentRef.current;
      if (!content) return;

      const A4_HEIGHT_PX = 1122;
      const BUFFER = 5; // Ignore tiny overflows

      isAdjusting.current = true;

      // We measure the current height without resetting to 'normal' first.
      // We only reset if the content is significantly too small.
      let currentHeight = content.scrollHeight;

      if (currentHeight > A4_HEIGHT_PX + BUFFER) {
        if (layoutMode === 'normal') {
          setLayoutMode('tight');
        } else if (layoutMode === 'tight') {
          setLayoutMode('extra-tight');
        } else if (layoutMode === 'extra-tight' && scale === 1) {
          const finalScale = A4_HEIGHT_PX / currentHeight;
          setScale(Math.max(finalScale, 0.85));
        }
      } else if (currentHeight < A4_HEIGHT_PX - 100) {
        // Only expand back if we have massive room, to prevent "vibration"
        if (scale < 1) {
          setScale(1);
        } else if (layoutMode === 'extra-tight') {
          setLayoutMode('tight');
        } else if (layoutMode === 'tight') {
          setLayoutMode('normal');
        }
      }

      // Short delay before allowing the next adjustment
      setTimeout(() => {
        isAdjusting.current = false;
      }, 100);
    };

    // Use a small debounce for the ResizeObserver
    const observer = new ResizeObserver(() => {
        requestAnimationFrame(adjustLayout);
    });

    if (contentRef.current) observer.observe(contentRef.current);
    
    return () => observer.disconnect();
  }, [data, templateId, layoutMode, scale]); // Logic now reacts to state shifts safely

  const handleUpdate = (path: string, newValue: any) => {
    if (!onChange) return;
    const newData = JSON.parse(JSON.stringify(data));
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      const accessKey = isNaN(Number(keys[i])) ? keys[i] : Number(keys[i]);
      current = current[accessKey];
    }
    current[isNaN(Number(keys[keys.length - 1])) ? keys[keys.length - 1] : Number(keys[keys.length - 1])] = newValue;
    onChange(newData);
  };

  const formattedData = {
    ...data,
    handleUpdate,
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
      <div 
        className="bg-white shadow-2xl border border-slate-200 transition-all duration-500 ease-in-out"
        style={{
          width: '210mm',
          height: '297mm',
          margin: '0 auto',
          position: 'relative',
          // Dynamic variables
          ...({
            '--cv-padding': layoutVars.padding,
            '--cv-gap': layoutVars.gap,
            '--cv-item-gap': layoutVars.itemGap,
          } as any)
        }}
      >
        <div 
          ref={contentRef}
          className="origin-top transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `scale(${scale})`,
            width: '100%',
          }}
        >
          {renderTemplate()}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-6 flex gap-3">
         <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider bg-white px-4 py-2 rounded-full border shadow-sm">
            <span className={`w-2 h-2 rounded-full ${layoutMode !== 'normal' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            Mode: {layoutMode}
         </div>
         {scale < 1 && (
            <div className="flex items-center gap-2 text-amber-700 text-[10px] font-bold uppercase tracking-wider bg-amber-50 px-4 py-2 rounded-full border border-amber-200 shadow-sm">
                Compression: {Math.round((1 - scale) * 100)}%
            </div>
         )}
      </div>
    </div>
  );
}