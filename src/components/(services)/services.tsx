"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cpu, HardDrive, Wifi, Server } from "lucide-react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export function Services() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in");
        }
        if (status === "authenticated") {
            const fetchServices = async () => {
                try {
                    setIsLoading(true);
                    const response = await fetch("/api/services", {
                        method: "GET",
                    });
                    const data = await response.json();
                    setServices(data);
                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                }
            };

            fetchServices();
        }
    }, [status, router]);

    if (isLoading) {
        return (
            <div className="p-6 space-y-6 bg-background text-foreground min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    return (
        <div className={`${theme === 'dark' ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-gray-100 to-white'} min-h-screen  transition-colors duration-300`}>
            <div className="container mx-auto py-16">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold mb-8 text-center text-blue-500 dark:text-blue-400"
                >
                    Szolgáltatások
                </motion.h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden backdrop-blur-sm bg-white dark:bg-slate-800 border-border hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1">
                                <CardHeader className="bg-gray-50 dark:bg-slate-700/60 backdrop-blur-sm">
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Server className="h-5 w-5 text-blue-400" />
                                            {service.type === "vps" ? `VPS-${service.service_id}` : `Service-${service.id}`}
                                        </div>
                                        <Badge variant={service.status === "active" ? "default" : "secondary"} className="animate-pulse">
                                            {service.status === "active" ? "Aktív" : "Inaktív"}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 dark:text-blue-300">Szolgáltatás: {service.type}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-slate-700/60 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                            <Cpu className="mr-3 h-5 w-5 text-purple-400" />
                                            <span className="text-gray-700 dark:text-gray-200">CPU: {service.more_info ? JSON.parse(service.more_info)["CPU mag"] : "N/A"} mag</span>
                                        </div>
                                        <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-slate-700/60 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                            <HardDrive className="mr-3 h-5 w-5 text-green-400" />
                                            <span className="text-gray-700 dark:text-gray-200">RAM: {service.more_info ? (JSON.parse(service.more_info)["Szerver ram"] / 1024).toFixed(1) : "N/A"} GB</span>
                                        </div>
                                        <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-slate-700/60 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                            <HardDrive className="mr-3 h-5 w-5 text-blue-400" />
                                            <span className="text-gray-700 dark:text-gray-200">Tárhely: {service.more_info ? JSON.parse(service.more_info)["Szerver tárhely"] : "N/A"} GB</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-gray-50 dark:bg-slate-700/60 flex justify-between py-4 px-6">
                                    <Button variant="outline" className="hover:bg-blue-500 hover:text-white dark:hover:text-white transition-colors">
                                        Részletek
                                    </Button>
                                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                                        Kezelés
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
