 'use client'

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { Chrome } from "lucide-react"
import { login, signup } from "./actions"

export default function LoginPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()

  const error = searchParams.get("error")
  const message = searchParams.get("message")

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50 px-4">
      <Link href="/" className="mb-8 text-2xl font-bold text-blue-600 tracking-tighter">
        CoverFlow<span className="text-slate-400">.ai</span>
      </Link>

      <Card className="w-full max-w-md shadow-xl border-0 bg-white">
        <CardHeader className="space-y-1 px-6 pt-8">
          <CardTitle className="text-2xl font-bold text-center italic">
            Connexion
          </CardTitle>
          <CardDescription className="text-center text-sm text-slate-600">
            Entre tes identifiants ou utilise Google pour continuer.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8 pt-4 space-y-4">

          {/* 🔴 Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {/* 🟢 Success Message */}
          {message && (
            <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md border border-green-200">
              {message}
            </div>
          )}

          {/* Email & Password Form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nom@exemple.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                formAction={login}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Se connecter
              </Button>

              <Button
                formAction={signup}
                variant="outline"
                className="w-full"
              >
                S'inscrire
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Ou</span>
            </div>
          </div>

          {/* Google OAuth */}
          <Button
            onClick={signInWithGoogle}
            variant="outline"
            className="flex items-center justify-center w-full gap-3 border-slate-200 hover:bg-slate-50"
          >
            <Chrome className="h-5 w-5 text-blue-600" />
            Continuer avec Google
          </Button>
        </CardContent>
      </Card>

      <p className="mt-8 text-xs text-slate-400 max-w-xs text-center leading-relaxed">
        En te connectant, tu acceptes nos conditions d'utilisation et notre politique de confidentialité.
      </p>
    </div>
  )
}
