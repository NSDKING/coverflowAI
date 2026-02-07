import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ClientGenerator from "@/components/ClientGenerator"; // Ton wrapper créé précédemment

export default async function Home() {
  // On récupère le client (qui peut être null maintenant)
  const supabase = await createClient();
  
  let user = null;
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-blue-600">
          CoverFlow<span className="text-slate-400">.ai</span>
        </div>
        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 hidden md:inline">{user.email}</span>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Mon Espace</Link>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" asChild>
              <Link href="/login">Connexion</Link>
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
            Générez des lettres de motivation personnalisées en quelques secondes avec l'IA.
          </p>
        </div>

        <section id="generate" className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2rem] blur-2xl opacity-50 -z-10" />
          {/* Ce composant contient le dynamic import avec ssr: false */}
          <ClientGenerator />
        </section>

        {/* Message d'alerte si Supabase est déconnecté (visible uniquement en dev ou via logs) */}
        {!supabase && (
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-center text-sm">
            Note : Le système de sauvegarde est actuellement en maintenance (clés API absentes).
          </div>
        )}
      </main>

      <footer className="py-12 border-t text-center text-slate-400 text-sm">
        © 2026 CoverFlow.ai
      </footer>
    </div>
  );
}