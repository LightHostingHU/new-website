"use client"

import { Home, Server, Users, CreditCard, Bell, Settings, BarChart, MessageSquare, Monitor, ShoppingCart, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const menuItems = [
    { icon: Home, label: "Áttekintés", href: "/" },
    { icon: Server, label: "Szolgáltatások", href: "/szolgaltatasok" },
    { icon: ShoppingCart, label: "Új Szolgáltatás Vásárlás", href: "/rendeles" },
    { icon: CreditCard, label: "Számlázás", href: "/szamlazas" },
    { icon: Bell, label: "Értesítések", href: "/ertesitesek" },
    { icon: Settings, label: "Beállítások", href: "/beallitasok" },
]

export function Sidebar() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const [permissions, SetPermissions] = useState(null)
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/sign-in');
        }
    }, [status, session, router]);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await fetch("/api/users/permissions");
                const data = await response.json();
                SetPermissions(data.permissions);
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        }
        fetchPermissions()
    }, [])

    return (
        <div className="flex flex-col h-full bg-slate-900 border-r border-zinc-700">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-primary mb-6">LightHosting

                </h2>
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                                pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                            )}
                        >
                            <item.icon className="h-5 w-5 mr-3" />
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    {permissions && permissions === "admin" && (
                        <div>
                            <button
                                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                                className="flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors text-muted-foreground hover:bg-muted"
                            >
                                <Users className="h-5 w-5 mr-3" />
                                Adminisztráció
                                <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${isAdminMenuOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isAdminMenuOpen && (
                                <motion.div
                                    initial={{ x: 20 }}
                                    animate={{ x: 0 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="ml-6 mt-2 space-y-2">
                                    <Link href="/admin/felhasznalok" className="block px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md">
                                        Felhasználók kezelése
                                    </Link>
                                    <Link href="/admin/beallitasok" className="block px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md">
                                        Admin beállítások
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    )}
                </nav>
            </div>
            <div className="mt-auto p-6 space-y-2 border-t border-zinc-700">
                <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open("https://discord.gg/yourserver", "_blank")}
                >
                    <MessageSquare className="h-5 w-5 mr-3" />
                    Discord
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => window.open("/vm-panel", "_blank")}>
                    <Monitor className="h-5 w-5 mr-3" />
                    VM Panel
                </Button>
            </div>
        </div>
    )
}

