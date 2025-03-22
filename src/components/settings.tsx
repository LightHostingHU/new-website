import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Settings() {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-purple-600">Beállítások</h1>
                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                        <TabsTrigger value="profile" className="rounded-md px-6 transition-all">Profil</TabsTrigger>
                        <TabsTrigger value="notifications" className="rounded-md px-6 transition-all">Értesítések</TabsTrigger>
                        <TabsTrigger value="security" className="rounded-md px-6 transition-all">Biztonság</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 shadow-xl">
                            <CardHeader className="space-y-2">
                                <CardTitle className="text-2xl font-bold">Profil beállítások</CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400">Frissítse személyes adatait</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium">Név</Label>
                                    <Input id="name" defaultValue="Kovács János" className="h-11 rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">E-mail cím</Label>
                                    <Input id="email" type="email" defaultValue="kovacs.janos@example.com" className="h-11 rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium">Telefonszám</Label>
                                    <Input id="phone" type="tel" defaultValue="+36 30 123 4567" className="h-11 rounded-lg" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg transition-all duration-300">
                                    Mentés
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="notifications">
                        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 shadow-xl">
                            <CardHeader className="space-y-2">
                                <CardTitle className="text-2xl font-bold">Értesítési beállítások</CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400">Állítsa be, milyen értesítéseket szeretne kapni</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <Label htmlFor="email-notifications" className="font-medium">E-mail értesítések</Label>
                                    <Switch id="email-notifications" className="data-[state=checked]:bg-purple-600" />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <Label htmlFor="sms-notifications" className="font-medium">SMS értesítések</Label>
                                    <Switch id="sms-notifications" className="data-[state=checked]:bg-purple-600" />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <Label htmlFor="marketing-notifications" className="font-medium">Marketing értesítések</Label>
                                    <Switch id="marketing-notifications" className="data-[state=checked]:bg-purple-600" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg transition-all duration-300">
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
                                    <Input id="current-password" type="password" className="h-11 rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password" className="text-sm font-medium">Új jelszó</Label>
                                    <Input id="new-password" type="password" className="h-11 rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password" className="text-sm font-medium">Új jelszó megerősítése</Label>
                                    <Input id="confirm-password" type="password" className="h-11 rounded-lg" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg transition-all duration-300">
                                    Jelszó módosítása
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}