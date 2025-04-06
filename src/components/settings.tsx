"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { signIn, useSession } from "next-auth/react"
import { error } from "console"
import Image from "next/image"

export function Settings() {
    const session = useSession()
    const [userData, setUserData] = useState<{
        firstname: string;
        lastname: string;
        email: string;
        avatar?: string;
        profilePicture?: any;
        discordConnected?: boolean;
        discordUsername?: string;
        
    }>({
        firstname: "",
        lastname: "",
        email: "",
        avatar: "",
        discordConnected: false
    })
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [discordConnected, setDiscordConnected] = useState(false);
    const [discordData, setDiscordData] = useState<{ username?: string } | null>(null);

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const [profileResponse, pictureResponse] = await Promise.all([
                axios.get<{ firstname: string; lastname: string; email: string; phone: string; discordConnected: boolean }>('/api/user/profile'),
                axios.get<{ avatar: string }>('/api/user/profile-picture')
            ])

            setUserData({
                ...profileResponse.data,
                profilePicture: pictureResponse.data.avatar
            })

        } catch (error) {
            toast.error('Hiba a felhasználó adatainak betöltése során!')
        }
    }

    const handleProfileUpdate = async () => {
        try {
            await axios.put('/api/user/profile', userData)
            toast.success('Sikeresen frissítetted az adataidat!')
            await fetchUserData()
        } catch (error) {
            toast.error('Hiba a frissítés során!')
        }
    }

    const handlePasswordChange = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('A jelszavak nem egyeznek!')
            return
        }
        try {
            await axios.put('/api/user/password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
                confirmPassword: passwords.confirmPassword
            })
            toast.success('Sikeresen módosítottad a jelszavad!')
            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            })
        } catch (error) {
            toast.error('Hiba a módosítás során!')
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('profileImage', file)

        try {
            const response = await axios.post<{ profilePicture: string }>('/api/user/profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setUserData({ ...userData, profilePicture: response.data.profilePicture })
            toast.success('Profilkép sikeresen feltöltve!')
            await fetchUserData()
            e.target.value = ''
        } catch (error) {
            toast.error('Hiba a profilkép feltöltése során!')
            e.target.value = ''
        }
    }
    

    useEffect(() => {
        const checkDiscordConnection = async () => { 
            try {
                const response = await fetch('/api/discord/data'); 
                const data = await response.json();

                if (data.discordConnected) {
                    setDiscordConnected(true);
                    toast.success('Sikeresen összekapcsoltad a Discord fiókod!')
                    setDiscordData(data.decodedToken);
                } else {
                    setDiscordConnected(false);
                }
            } catch (error) {
            }
        };

        checkDiscordConnection();
    }, []);

    const handleDiscordConnection = () => {
        if (!discordConnected) {
            window.location.href = '/api/discord'; 
        } else if (discordConnected) {
            fetch('/api/discord/disconnect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if (response.ok) {
                    toast.success('Sikeresen leválasztottad a Discord fiókod!')
                    setDiscordConnected(false);
                }
            })
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-purple-600">Beállítások</h1>
                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                        <TabsTrigger value="profile" className="rounded-md px-6 transition-all">Profil</TabsTrigger>
                        <TabsTrigger value="security" className="rounded-md px-6 transition-all">Biztonság</TabsTrigger>
                        <TabsTrigger value="connections" className="rounded-md px-6 transition-all">Kapcsolatok</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 shadow-xl">
                            <CardHeader className="space-y-2">
                                <CardTitle className="text-2xl font-bold">Profil beállítások</CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400">Frissítse személyes adatait</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="profilePicture" className="text-sm font-medium">Profilkép</Label>
                                    <div className="flex items-center gap-4">
                                        {userData.profilePicture ? (
                                            <div className="flex items-center gap-4">
                                                <Image
                                                    width={80}
                                                    height={80}
                                                    src={userData.profilePicture}
                                                    alt="Profile"
                                                    className="w-20 h-20 rounded-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
                                                <span className="text-slate-500">Nincs kép</span>
                                            </div>
                                        )}
                                        <Input
                                            id="profilePicture"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="h-11 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-medium">Keresztnév</Label>
                                    <Input
                                        id="firstName"
                                        value={userData.firstname}
                                        onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
                                        className="h-11 rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-medium">Vezetéknév</Label>
                                    <Input
                                        id="lastName"
                                        value={userData.lastname}
                                        onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
                                        className="h-11 rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">E-mail cím</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        className="h-11 rounded-lg"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleProfileUpdate}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg transition-all duration-300"
                                >
                                    Mentés
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="security">
                        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 shadow-xl">
                            <CardHeader className="space-y-2">
                                <CardTitle className="text-2xl font-bold">Biztonsági beállítások</CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400">Kezelje fiókja biztonsági beállításait</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password" className="text-sm font-medium">Jelenlegi jelszó</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        className="h-11 rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password" className="text-sm font-medium">Új jelszó</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        className="h-11 rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password" className="text-sm font-medium">Új jelszó megerősítése</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        className="h-11 rounded-lg"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handlePasswordChange}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg transition-all duration-300"
                                >
                                    Jelszó módosítása
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="connections">
                        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 shadow-xl">
                            <CardHeader className="space-y-2">
                                <CardTitle className="text-2xl font-bold">Kapcsolatok</CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400">Kapcsold össze fiókjaidat</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Discord fiók</Label>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {discordConnected
                                                ? `Összekapcsolva: ${discordData?.username || 'N/A'}`
                                                : 'Nincs összekapcsolva'}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleDiscordConnection}
                                        className={`px-8 py-2 rounded-lg transition-all duration-300 ${discordConnected
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-[#5865F2] hover:bg-[#4752C4] text-white'
                                            }`}
                                    >
                                        {discordConnected ? 'Leválasztás' : 'Összekapcsolás'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}