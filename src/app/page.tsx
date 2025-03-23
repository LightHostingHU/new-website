"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Server, DollarSign, Activity, Cloud, Shield, PiggyBank } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react"
import axios from "axios";
import News from "@/components/news";
import { useRouter } from 'next/navigation'

export default function Home() {
  const {data: session, status} = useSession();
  const router = useRouter();
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.push('/sign-in')
    }
  }, [status, router])
  
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/balance", {
          method: "GET",
        });
        const data = await response.json();
        setBalance(data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchBalance();
  }, [balance]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-slate-900  text-foreground min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">VPS Hosting Dashboard</h1>
          <Button>Új szolgáltatás vásárlása</Button>
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
          {/* <Card className="bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Biztonsági áttekintés</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Minden rendszer védett és naprakész.</p>
              <Button variant="outline" size="sm">
                Biztonsági jelentés <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Backup státusz</CardTitle>
              <Cloud className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Utolsó sikeres backup: 2023.07.10 02:00</p>
              <Button variant="outline" size="sm">
                Backup kezelése <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle>Támogatás</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Kérdése van? Segítünk!</p>
              <Button variant="outline" size="sm">
                Kapcsolatfelvétel <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card> */}
        </div>

        <Card className="bg-slate-800">
          <News />
        </Card>
      </div>
    </DashboardLayout>
  )
}
