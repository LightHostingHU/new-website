"use client"
import { Sidebar } from "@/components/header/sidebar"
import { Header } from "@/components/header/header"
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen">
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 right-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 z-40 lg:static lg:z-auto transition-transform duration-300 ease-in-out lg:transition-none w-64 shrink-0`}>
                <Sidebar />
            </div>

            {/* Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-slate-900 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
