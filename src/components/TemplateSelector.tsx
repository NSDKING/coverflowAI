import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const TEMPLATES = [
  { id: 'modern', name: 'Modern Blue', preview: 'bg-blue-600' },
  { id: 'minimal', name: 'Minimalist Black', preview: 'bg-slate-900' },
  { id: 'creative', name: 'Creative Purple', preview: 'bg-purple-600' },
];

export default function TemplateSelector({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {TEMPLATES.map((t) => (
        <Card 
          key={t.id}
          onClick={() => onSelect(t.id)}
          className="group cursor-pointer overflow-hidden border-2 hover:border-blue-600 transition-all rounded-2xl shadow-sm hover:shadow-xl"
        >
          <div className={`h-40 ${t.preview} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-md border border-white/30 text-white font-bold">
              Aperçu {t.name}
            </div>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="font-bold text-slate-700">{t.name}</span>
            <CheckCircle2 className="text-slate-200 group-hover:text-blue-600 transition-colors" />
          </div>
        </Card>
      ))}
    </div>
  );
}