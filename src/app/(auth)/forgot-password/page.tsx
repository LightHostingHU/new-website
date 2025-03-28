'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()
            if (response.ok) {
                toast.success(data.message)
            } else {
                toast.error(data.error || 'Valami hiba történt')
            }
        } catch (error) {
            toast.error('Nem sikerült elküldeni a visszaállítási linket')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <a href="#" className="flex flex-row items-center justify-center text-center mb-8 text-3xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                <img className="w-12 h-12 mr-3 transform hover:scale-110 transition-transform duration-300" src="/logo/logo.png" alt="logó" />
                LightHosting
            </a>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm border border-white/10 shadow-xl backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-2xl">
                <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-800 dark:text-white">
                    Elfelejtett jelszó?
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                    Ne aggódj! Add meg az email címed és küldünk egy visszaállítási útmutatót.
                </p>

                <div className="mt-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-800 dark:text-gray-200">
                                Email cím
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:placeholder:text-gray-400 sm:text-sm transition-all duration-200"
                                    placeholder="Add meg az email címed"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Küldés...
                                    </span>
                                ) : (
                                    'Visszaállítási link küldése'
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        <Link 
                            href="/auth/login" 
                            className="font-semibold leading-6 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                            ← Vissza a bejelentkezéshez
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
