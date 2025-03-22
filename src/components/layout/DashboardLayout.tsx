import { Sidebar } from "@/components/header/sidebar"
import { Header } from "@/components/header/header"
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-slate-800">{children}</main>
            </div>
        </div>
    )
}

