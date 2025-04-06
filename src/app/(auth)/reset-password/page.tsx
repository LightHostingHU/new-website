'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isValidToken, setIsValidToken] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setError('Érvénytelen visszaállítási link')
                toast.error('Érvénytelen visszaállítási link')
                return
            }

            try {
                const response = await fetch(`/api/validate-reset-token?token=${token}`)
                const data = await response.json()

                if (response.ok) {
                    setIsValidToken(true)
                    setError('')
                } else {
                    setError(data.error || 'Érvénytelen vagy lejárt visszaállítási link')
                    toast.error(data.error || 'Érvénytelen vagy lejárt visszaállítási link')
                }
            } catch (err) {
                setError('Token ellenőrzése sikertelen')
                toast.error('Token ellenőrzése sikertelen')
            }
        }

        validateToken()
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('A jelszavak nem egyeznek')
            toast.error('A jelszavak nem egyeznek')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            })

            const data = await response.json()
            if (response.ok) {
                toast.success(data.message)
                setTimeout(() => router.push('/sign-in'), 2000)
            } else {
                setError(data.error || 'Jelszó visszaállítása sikertelen')
                toast.error(data.error || 'Jelszó visszaállítása sikertelen')
            }
        } catch (err) {
            setError('Jelszó visszaállítása sikertelen')
            toast.error('Jelszó visszaállítása sikertelen')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isValidToken) {
        return (
            <div className="container relative flex-col items-center justify-center self-center pt-24">
                <Card className="mx-auto w-full max-w-lg">
                    <CardContent className="p-6">
                        {error ? (
                            <div>
                                <div className="flex h-full w-full flex-col justify-center rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
                                    <p className="font-bold mb-1">Hiba!</p>
                                    <p>{error}</p>
                                </div>
                                <Button variant="link" className="w-full mt-4" asChild>
                                    <Link href="/forgot-password">Új visszaállítási link kérése</Link>
                                </Button>
                            </div>
                        ) : (
                            'Token ellenőrzése...'
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container relative flex-col items-center justify-center self-center pt-24">
            <Card className="mx-auto w-full max-w-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Jelszó visszaállítása</CardTitle>
                    <CardDescription className="text-center">
                        Kérjük, adja meg az új jelszavát
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                            <p className="font-bold">Hiba!</p>
                            <p>{error}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Új jelszó</Label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Jelszó megerősítése</Label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Folyamatban...' : 'Jelszó visszaállítása'}
                        </Button>
                        <Button variant="link" className="w-full" asChild>
                            <Link href="/forgot-password">Új visszaállítási link kérése</Link>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
};

const ResetPasswordWrapper = () => (
    <Suspense fallback={<div className="container relative flex-col items-center justify-center self-center pt-24">
        <Card className="mx-auto w-full max-w-lg">
            <CardContent className="p-6">
                Token ellenőrzése...
            </CardContent>
        </Card>
    </div>}>
        <ResetPasswordPage />
    </Suspense>
)

export default ResetPasswordWrapper