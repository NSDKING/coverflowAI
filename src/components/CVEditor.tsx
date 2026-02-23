import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Edit3, User, Briefcase, GraduationCap, Cpu, Plus, Trash2 } from "lucide-react";

export default function CVEditor({ data, onChange }: { data: any, onChange: (newData: any) => void }) {
  
  // Fonction pour mettre à jour les champs simples
  const updateInfo = (section: string, field: string, value: string) => {
    const newData = { ...data };
    if (section === 'root') {
        newData[field] = value;
    } else {
        newData[section][field] = value;
    }
    onChange(newData);
  };

  return (
    <div className="space-y-6 h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
      <h2 className="text-2xl font-black flex items-center gap-2">
        <Edit3 className="text-blue-600" /> Personnalisation
      </h2>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {/* INFOS PERSONNELLES */}
        <AccordionItem value="personal" className="border rounded-2xl px-6 bg-white shadow-sm">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 font-bold text-slate-700">
              <User size={18} className="text-blue-500" /> Informations
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Nom Complet</label>
                <Input 
                  value={data.personalInfo.fullName} 
                  onChange={(e) => updateInfo('personalInfo', 'fullName', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Poste Visé</label>
                <Input 
                  value={data.personalInfo.jobTitle} 
                  onChange={(e) => updateInfo('personalInfo', 'jobTitle', e.target.value)} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Email</label>
              <Input 
                value={data.personalInfo.email} 
                onChange={(e) => updateInfo('personalInfo', 'email', e.target.value)} 
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* EXPÉRIENCES */}
        <AccordionItem value="exp" className="border rounded-2xl px-6 bg-white shadow-sm">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 font-bold text-slate-700">
              <Briefcase size={18} className="text-blue-500" /> Expériences
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2 pb-6">
            {data.experiences.map((exp: any, index: number) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-100">
                <Input 
                  placeholder="Entreprise"
                  value={exp.company} 
                  onChange={(e) => {
                    const newExp = [...data.experiences];
                    newExp[index].company = e.target.value;
                    onChange({ ...data, experiences: newExp });
                  }} 
                />
                <Textarea 
                  placeholder="Description (une ligne par puce)"
                  value={exp.description.join('\n')}
                  onChange={(e) => {
                    const newExp = [...data.experiences];
                    newExp[index].description = e.target.value.split('\n');
                    onChange({ ...data, experiences: newExp });
                  }}
                />
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* COMPÉTENCES */}
        <AccordionItem value="skills" className="border rounded-2xl px-6 bg-white shadow-sm">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 font-bold text-slate-700">
              <Cpu size={18} className="text-blue-500" /> Compétences
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6">
            <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Séparez par des virgules</label>
            <Input 
              value={data.skills.join(', ')} 
              onChange={(e) => onChange({ ...data, skills: e.target.value.split(',').map(s => s.trim()) })} 
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
