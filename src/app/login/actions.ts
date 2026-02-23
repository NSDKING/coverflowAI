'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  if (!supabase) {
    redirect('/login?error=Erreur de connexion')
  }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=Erreur de connexion')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  if (!supabase) {
    redirect('/login?error=Erreur de connexion')
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    console.error("Signup Error Details:", error.message)

    // 🔥 Detect if user already exists
    if (error.message.toLowerCase().includes("already")) {
      redirect('/login?error=Vous avez déjà un compte. Connectez-vous.')
    }

    // Default fallback error
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Vérifiez vos e-mails')
}
