"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cpu, HardDrive, Server, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

type ServiceInfo = {
    "CPU mag": number
    "Szerver ram": number
    "Szerver tárhely": number
    [key: string]: any
}

type Service = {
    id: number
    service_id: number
    type: string
    status: string
    more_info: string
}

type ServiceList = {
    id: number
    name: string
}

export function Services() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [services, setServices] = useState<Service[]>([])
    const [servicesList, setServicesList] = useState<ServiceList[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { theme } = useTheme()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in")
        }
        if (status === "authenticated") {
            const fetchData = async () => {
                try {
                    setIsLoading(true)
                    setError(null)

                    const [servicesResponse, servicesListResponse] = await Promise.all([
                        fetch("/api/services", {
                            method: "GET",
                        }),
                        fetch("/api/services/list", {
                            method: "GET",
                        }),
                    ])

                    if (!servicesResponse.ok || !servicesListResponse.ok) {
                        throw new Error("Hiba történt az adatok betöltése közben")
                    }

                    const servicesData = await servicesResponse.json()
                    const servicesListData = await servicesListResponse.json()

                    setServices(servicesData)
                    setServicesList(servicesListData)
                } catch (error) {
                    setError(error instanceof Error ? error.message : "Ismeretlen hiba történt")
                } finally {
                    setIsLoading(false)
                }
            }

            fetchData()
        }
    }, [status, router])

    const getServiceName = (serviceId: number) => {
        const service = servicesList.find((s) => s.id === serviceId)
        return service ? service.name : "Ismeretlen szolgáltatás"
    }

    const getServiceInfo = (infoString: string): ServiceInfo => {
        try {
            return JSON.parse(infoString) as ServiceInfo
        } catch {
            return {
                "CPU mag": 0,
                "Szerver ram": 0,
                "Szerver tárhely": 0,
            }
        }
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "active":
                return "success"
            case "inactive":
                return "secondary"
            default:
                return "outline"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "active":
                return "Aktív"
            case "inactive":
                return "Inaktív"
            default:
                return status
        }
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
                <div className="flex items-center gap-2 text-destructive mb-4">
                    <AlertCircle className="h-6 w-6" />
                    <h2 className="text-xl font-semibold">Hiba történt</h2>
                </div>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={() => window.location.reload()}>Újrapróbálkozás</Button>
            </div>
        )
    }

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${theme === "dark"
                    ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
                    : "bg-gradient-to-b from-blue-50 via-white to-blue-50"
                }`}
        >
            <div className="container mx-auto py-16 px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-300">
                        Szolgáltatások
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Kezelje és tekintse át az összes aktív szolgáltatását egy helyen
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="overflow-hidden border border-border">
                                <CardHeader className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-6 w-32" />
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </div>
                                    <Skeleton className="h-4 w-48" />
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    {[1, 2, 3].map((j) => (
                                        <Skeleton key={j} className="h-12 w-full rounded-lg" />
                                    ))}
                                </CardContent>
                                <CardFooter className="flex justify-between py-4 px-6">
                                    <Skeleton className="h-10 w-24 rounded-md" />
                                    <Skeleton className="h-10 w-24 rounded-md" />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => {
                                const serviceInfo = service.more_info ? getServiceInfo(service.more_info) : null

                                return (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1,
                                            ease: [0.25, 0.1, 0.25, 1.0],
                                        }}
                                        whileHover={{ y: -5 }}
                                        className="h-full"
                                    >
                                        <Card className="h-full overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                                            <CardHeader className="bg-gray-50/80 dark:bg-slate-700/60 backdrop-blur-sm">
                                                <div className="flex items-center justify-between mb-1">
                                                    <CardTitle className="flex items-center gap-2 text-xl">
                                                        <Server className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                                        {service.type === "vps" ? `VPS-${service.service_id}` : `Service-${service.id}`}
                                                    </CardTitle>
                                                    <Badge
                                                        variant={getStatusVariant(service.status) as any}
                                                        className={`${service.status === "active" ? "animate-pulse bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
                                                    >
                                                        {getStatusText(service.status)}
                                                    </Badge>
                                                </div>
                                                <CardDescription className="text-gray-600 dark:text-blue-300/80 font-medium">
                                                    {getServiceName(service.service_id)}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-4">
                                                <div className="space-y-3">
                                                    <motion.div
                                                        whileHover={{ x: 5 }}
                                                        className="flex items-center p-3 rounded-lg bg-gray-50/80 dark:bg-slate-700/40 hover:bg-blue-50 dark:hover:bg-slate-700/60 transition-colors group"
                                                    >
                                                        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors mr-3">
                                                            <Cpu className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                                                        </div>
                                                        <span className="text-gray-700 dark:text-gray-200">
                                                            {service.type === "vps" ? (
                                                            `CPU: ${serviceInfo ? serviceInfo["cpu"] : "N/A"} mag`
                                                            ) : (
                                                            `CPU: ${serviceInfo ? serviceInfo["cpu"] : "N/A"}%`
                                                            )}
                                                        </span>
                                                    </motion.div>

                                                    <motion.div
                                                        whileHover={{ x: 5 }}
                                                        className="flex items-center p-3 rounded-lg bg-gray-50/80 dark:bg-slate-700/40 hover:bg-blue-50 dark:hover:bg-slate-700/60 transition-colors group"
                                                    >
                                                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-800/30 transition-colors mr-3">
                                                            <HardDrive className="h-5 w-5 text-green-500 dark:text-green-400" />
                                                        </div>
                                                        <span className="text-gray-700 dark:text-gray-200">
                                                            RAM: {serviceInfo ? (serviceInfo["ram"] / 1024).toFixed(1) : "N/A"} GB
                                                        </span>
                                                    </motion.div>

                                                    <motion.div
                                                        whileHover={{ x: 5 }}
                                                        className="flex items-center p-3 rounded-lg bg-gray-50/80 dark:bg-slate-700/40 hover:bg-blue-50 dark:hover:bg-slate-700/60 transition-colors group"
                                                    >
                                                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors mr-3">
                                                            <HardDrive className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                                        </div>
                                                        <span className="text-gray-700 dark:text-gray-200">
                                                            Tárhely: {serviceInfo ? serviceInfo["disk"] : "N/A"} GB
                                                        </span>
                                                    </motion.div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="bg-gray-50/80 dark:bg-slate-700/60 flex justify-between py-4 px-6 mt-auto">
                                                <Link href={`/szolgaltatasok/${service.id}`}>
                                                    <Button
                                                        variant="outline"
                                                        className="border-blue-200 dark:border-blue-900/50 hover:bg-blue-500 hover:text-white dark:hover:text-white transition-colors"
                                                    >
                                                        Részletek
                                                    </Button>
                                                </Link>
                                                <Link href={`/services/${service.id}/manage`}>
                                                    <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all">
                                                        Kezelés
                                                    </Button>
                                                </Link>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </AnimatePresence>
                )}

                {!isLoading && services.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                            <Server className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Nincsenek szolgáltatások</h3>
                        <p className="text-muted-foreground mb-6">Jelenleg nincsenek aktív szolgáltatásai</p>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                            <Link href={"/rendeles"}>Szolgáltatás Vásárlás</Link>
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

