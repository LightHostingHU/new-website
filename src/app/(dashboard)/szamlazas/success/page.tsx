
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/szamlazas')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold">Sikeres fizetés!</h1>
        <p className="mt-2 text-gray-600">
          Köszönjük a vásárlást. Átirányítjuk a számlázási oldalra...
        </p>
      </div>
    </div>
  )
}
