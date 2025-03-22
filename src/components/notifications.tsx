import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Info, CheckCircle, AlertTriangle } from "lucide-react"

const notifications = [
    {
        id: 1,
        title: "Rendszerkarbantartás",
        message: "Tervezett karbantartás 2023.07.15-én, 02:00 és 04:00 között.",
        type: "info",
        date: "2023-07-10",
    },
    {
        id: 2,
        title: "Új funkció elérhető",
        message: "Az automatikus biztonsági mentés funkció mostantól elérhető minden VPS-en.",
        type: "success",
        date: "2023-07-05",
    },
    {
        id: 3,
        title: "Biztonsági figyelmeztetés",
        message: "Kérjük, frissítse jelszavát a fokozott biztonság érdekében.",
        type: "warning",
        date: "2023-07-01",
    },
]

const getIcon = (type: string) => {
    switch (type) {
        case "info":
            return Info
        case "success":
            return CheckCircle
        case "warning":
            return AlertTriangle
        default:
            return Bell
    }
}
export function Notifications() {
    return (
        <div className="bg-slate-900 min-h-screen">
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">Értesítések</h1>
                <div className="space-y-4">
                    {notifications.map((notification) => {
                        const Icon = getIcon(notification.type)
                        return (
                            <Card key={notification.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Icon
                                                className={`h-5 w-5 ${notification.type === "info" ? "text-blue-500" : notification.type === "success" ? "text-green-500" : "text-yellow-500"}`}
                                            />
                                            <CardTitle>{notification.title}</CardTitle>
                                        </div>
                                        <Badge
                                            variant={
                                                notification.type === "info"
                                                    ? "default"
                                                    : notification.type === "success"
                                                    ? "secondary"
                                                    : "destructive"
                                            }
                                        >
                                            {notification.type === "info"
                                                ? "Információ"
                                                : notification.type === "success"
                                                    ? "Siker"
                                                    : "Figyelmeztetés"}
                                        </Badge>
                                    </div>
                                    <CardDescription>{notification.date}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>{notification.message}</p>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline">Megjelölés olvasottként</Button>
                                    <Button>Részletek</Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

