import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from 'next/link'
import AppleSignIn from "@/components/AppleSignIn"

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50 px-4">
      <Link href="/" className="mb-8 text-2xl font-bold text-blue-600 tracking-tighter">
        CoverFlow<span className="text-slate-400">.ai</span>
      </Link>
      
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center italic">Connexion</CardTitle>
          <CardDescription className="text-center">
            Identifiez-vous instantanément pour sauvegarder vos documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          
          {/* Section Apple Unique */}
          <div className="space-y-4">
            <AppleSignIn />
          </div>

          {searchParams.error && (
            <p className="mt-4 p-3 text-sm font-medium text-red-500 bg-red-50 rounded-lg text-center">
              {searchParams.error}
            </p>
          )}

        </CardContent>
      </Card>
      
      <p className="mt-8 text-xs text-slate-400 max-w-xs text-center leading-relaxed">
        En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
      </p>
    </div>
  )
}