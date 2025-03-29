"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Server, PiggyBank, Newspaper, Clock } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link";

const announcements = [
  {
    id: 1,
    title: "Tisztelt Ügyfeleink",
    timestamp: "Közzétéve múlt csütörtökön 19:13-kor",
    content:
      "Az ügyfél-szolgáltatói kapcsolat számunkra fontos, emiatt szükségesnek érezzük ezen bejegyzés publikálását! A jelenlegi ügyfélkapunk fejlesztése LEÁLL, ezen ügyfélkapu fejlesztője kilépett csapatunkból.",
    author: {
      name: "Kovács János",
      avatar: "/logo/logo.png?height=40&width=40",
    },
  },
  {
    id: 2,
    title: "Rendszerkarbantartás",
    timestamp: "Közzétéve múlt pénteken 15:30-kor",
    content:
      "A kód használhatatlansága miatt NEM fejlesszük tovább, a használhatatlanság alatt sajnos több tényező van, és nem, megvan a forráskód, csak sajnos egyátalán nem biztonságos!",
    author: {
      name: "Nagy Éva",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 3,
    title: "Fejlesztési Hírek",
    timestamp: "Közzétéve tegnap 10:45-kor",
    content:
      "Emiatt az ügyfélkapu teljes körűen ÚJRAÍRÁSRA kerül, az összes feldobott/bedobott ötletekkel, és hibajavításokkal, addig jelenlegi ügyfélkapunk 0-24 elérhető.",
    author: {
      name: "Szabó Péter",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export default function Home() {
  const { data: session, status } = useSession(); 
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchBalance = async () => {
        try {
          const response = await fetch("/api/balance", {
            method: "GET",
          });
          const data = await response.json();
          setBalance(data.balance);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      };
      fetchBalance();
    }
  }, [status]);

  const formatNumber = (num: number | undefined) => {
    if (typeof num !== "number" || isNaN(num)) {
      console.error("formatNumber received invalid value:", num);
      return "0";
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6 bg-slate-900 text-foreground min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-slate-900  text-foreground min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">VPS Hosting Dashboard</h1>
            <Link href="/rendeles">
          <Button>
              Új szolgáltatás rendelés
          </Button>
             </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800 hover:bg-slate-800/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Egyenleg</CardTitle>
              <PiggyBank className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(balance)} Ft</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 hover:bg-slate-800/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktív VPS-ek</CardTitle>
              <Server className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 hover:bg-slate-800/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Összes Felhasználók száma</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-green-500 mr-1">↑</span>1 az előző hónaphoz képest
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 hover:bg-slate-800/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Összes megvásárolt szolgáltatások</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-green-500 mr-1">↑</span>1 az előző hónaphoz képest
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        </div>

        <Card className="bg-slate-800 p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Legfrissebb hírek</CardTitle>
            <Newspaper className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className="group transform transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="flex gap-6 items-start rounded-xl p-6 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 shadow-lg transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-500/30">
                    <div className="relative shrink-0">
                      <img
                        src={announcement.author.avatar || "/placeholder.svg"}
                        alt={announcement.author.name}
                        className="w-12 h-12 rounded-full object-cover border-3 border-slate-700 transition-all duration-300 group-hover:border-blue-500"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 ring-2 ring-slate-800 animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="border-b border-slate-700/50 pb-4">
                        <div className="flex justify-between items-center gap-4">
                          <h2 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                            {announcement.title}
                          </h2>
                          <time className="flex items-center text-sm text-slate-400 bg-slate-800/60 px-3 py-1 rounded-full">
                            <Clock className="h-3.5 w-3.5 mr-2" />
                            {announcement.timestamp}
                          </time>
                        </div>
                        <p className="text-sm text-slate-400 mt-2 font-medium">{announcement.author.name}</p>
                      </div>
                      <div>
                        <p className="text-slate-300 leading-relaxed">{announcement.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>      
      </div>
    </DashboardLayout>
  )
}
