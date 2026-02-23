import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ClientGenerator from "@/components/ClientGenerator";
import { 
  FileText, 
  Target, 
  UserCircle, 
  CheckCircle2, 
  Sparkles, 
  Zap,
  ArrowRight
} from "lucide-react";
import { link } from "fs";

export default async function Home() {
  const supabase = await createClient();
  
  let user = null;
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  }

  const features = [
    {
      title: "CV Builder Intelligent",
      desc: "Transformez votre expérience en CV design optimisé pour l'impression.",
      icon: <FileText className="text-blue-600" />,
      color: "bg-blue-50",
      link: "/generate"
    },
    {
      title: "Score d'Analyse ATS",
      desc: "Vérifiez si votre CV passe les filtres des recruteurs avant d'envoyer.",
      icon: <Target className="text-indigo-600" />,
      color: "bg-indigo-50",
      link: "/analyze"
    },
    {
      title: "Photo Pro AI",
      desc: "Transformez un simple selfie en portrait professionnel haute qualité.",
      icon: <UserCircle className="text-purple-600" />,
      color: "bg-purple-50",
      link: "/photo"
    }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white text-slate-900">
      {/* NAVIGATION */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-tighter text-blue-600 flex items-center gap-2">
          <Sparkles className="fill-blue-600" size={24} />
          CoverFlow<span className="text-slate-400">.ai</span>
        </div>
        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 hidden md:inline font-medium">{user.email}</span>
              <Button className="rounded-full shadow-lg hover:shadow-blue-200 transition-all" asChild>
                <Link href="/dashboard">Mon Espace</Link>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" className="rounded-full font-semibold" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        {/* HERO SECTION */}
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100 animate-fade-in">
            <Zap size={16} /> Nouveau : Générateur de Photo Pro intégré
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 leading-[0.9]">
            Propulsez votre <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
              carrière avec l'IA.
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Lettres de motivation, CV designs et portraits professionnels. <br className="hidden md:block" />
            Tout ce qu'il vous faut pour décrocher votre futur job en 30 secondes.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
             <Button size="lg" className="rounded-full px-8 h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200">
               Commencer gratuitement
             </Button>
             <Link href="#features" className="text-slate-500 font-semibold flex items-center gap-2 hover:text-slate-800 transition-colors">
               Voir les fonctionnalités <ArrowRight size={18} />
             </Link>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mb-24">
          {features.map((f, i) => (
            <Link key={i} href={f.link} className="group">
              <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </Link>

          ))}
        </div>

        {/* MAIN TOOL SECTION */}
        <section id="generate" className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-[3rem] blur-3xl opacity-30 -z-10" />
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[3rem] shadow-2xl p-2">
            <ClientGenerator />
          </div>
        </section>

        {/* SOCIAL PROOF / BENEFITS */}
        <div className="mt-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-black leading-tight">
              Pensé pour être <br /> 
              <span className="text-blue-600">ATS-Friendly.</span>
            </h2>
            <p className="text-slate-600 text-lg">
              Nos templates ne sont pas seulement beaux. Ils sont structurés pour être lus par les algorithmes de recrutement les plus utilisés (Workday, Taleo, Greenhouse).
            </p>
            <ul className="space-y-4 font-semibold">
              <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500" /> Structure de données JSON sémantique</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500" /> Analyse de mots-clés en temps réel</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500" /> Export PDF propre et sélectionnable</li>
            </ul>
          </div>
          <div className="bg-slate-100 rounded-[2.5rem] aspect-square flex items-center justify-center p-8 overflow-hidden">
             {/* Ici, on pourrait mettre un visuel de ton template ModernTemplate */}
             <div className="w-full h-full bg-white shadow-2xl rounded-xl p-6 rotate-3 border border-slate-200">
                <div className="w-20 h-2 bg-blue-600 rounded-full mb-4" />
                <div className="space-y-3">
                  <div className="w-full h-2 bg-slate-100 rounded-full" />
                  <div className="w-[80%] h-2 bg-slate-100 rounded-full" />
                  <div className="w-full h-2 bg-slate-100 rounded-full" />
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="h-20 bg-slate-50 rounded-lg border border-dashed border-slate-200" />
                  <div className="h-20 bg-slate-50 rounded-lg border border-dashed border-slate-200" />
                </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t text-center text-slate-400 text-sm font-medium">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-4">
          <div>© 2026 CoverFlow.ai — Propulsé par l'IA</div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-blue-600 transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">CGU</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}