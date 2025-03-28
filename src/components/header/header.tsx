"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Header() {
    const router = useRouter();
    const [avatar, setAvatar] = useState<string | null>(null);
    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await fetch("/api/user/profile-picture");
                const data = await response.json();

                console.log(response)
                if (data.avatar) {
                    setAvatar(data.avatar);
                }
            } catch (error) {
                console.error("Error fetching avatar:", error);
            }
        };

        fetchAvatar();
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white dark:border-zinc-700 dark:bg-slate-900/95 backdrop-blur px-4">
            <div className="container flex justify-end h-16 items-center">
                <div className="flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Avatar>
                                    <AvatarImage src={avatar || "/placeholder-avatar.jpg"} alt="Avatar" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Fiókom</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profil</DropdownMenuItem>
                            <DropdownMenuItem>Beállítások</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut({ redirect: true, callbackUrl: "/sign-in" })}>Kijelentkezés</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
