'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Script from 'next/script'
import { Button } from './ui/button'

export default function AppleSignIn() {
  const [isReady, setIsReady] = useState(false)
  const supabase = createClient()

  const handleAppleSignIn = async () => {
    // Vérification de sécurité pour éviter l'erreur "undefined"
    if (typeof window === 'undefined' || !window.AppleID) {
      console.error("Le SDK Apple n'est pas encore chargé")
      return
    }

    try {
      const data = await window.AppleID.auth.signIn()
      
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: data.id_token,
      })

      if (error) throw error
      window.location.href = '/'
    } catch (error) {
      console.error('Échec Apple:', error)
    }
  }

  return (
    <>
      <Script 
        src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/auth/js/v1/appleid.auth.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.AppleID.auth.init({
            clientId: 'com.tonnom.coverflow.sid', // <--- VÉRIFIE BIEN CECI
            scope: 'name email',
            redirectURI: `${window.location.origin}/auth/callback`,
            usePopup: true
          })
          setIsReady(true)
        }}
      />
      
      <Button 
        onClick={handleAppleSignIn}
        disabled={!isReady} // Désactivé tant que le script n'est pas là
        type="button" 
        className="w-full h-12 bg-black text-white hover:bg-zinc-900 gap-3 rounded-lg"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 384 512">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
        </svg>
        {isReady ? 'Continuer avec Apple' : 'Chargement...'}
      </Button>
    </>
  )
}