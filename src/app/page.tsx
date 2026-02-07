import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ClientGenerator from "@/components/ClientGenerator"; // On importe le wrapper

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-blue-600">
          CoverFlow<span className="text-slate-400">.ai</span>
        </div>
        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{user.email}</span>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Historique</Link>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
            Arrêtez d'écrire, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              décrochez des entretiens.
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Téléchargez votre CV, collez l'offre d'emploi et choisissez votre style. 
            CoverFlow utilise l'IA pour personnaliser votre candidature en quelques secondes.
          </p>
        </div>

        <section id="generate" className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2rem] blur-2xl opacity-50 -z-10" />
          {/* Utilisation du wrapper client ici */}
          <ClientGenerator />
        </section>

        <div className="grid md:grid-cols-3 gap-8 mt-32 text-center">
          <FeatureCard 
            icon="⚡" title="Résultats Instantanés" 
            desc="Générez des lettres professionnelles en moins de 10 secondes." 
          />
          <FeatureCard 
            icon="🎯" title="Optimisé ATS" 
            desc="Identifie automatiquement les mots-clés de l'offre d'emploi." 
          />
          <FeatureCard 
            icon="🔒" title="Sécurisé avec Supabase" 
            desc="Votre CV et vos données sont cryptés et privés." 
          />
        </div>
      </main>

      <footer className="py-12 border-t text-center text-slate-400 text-sm">
        © 2026 CoverFlow. Tous droits réservés. Propulsé par Next.js & Supabase.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-6 space-y-2">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  );
}