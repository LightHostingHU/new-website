"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Server, PiggyBank, Newspaper, Clock } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  user: {
    name: string;
    avatar: string;
  };
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceNumber, setServiceNumber] = useState(0);
  const [userStats, setUserStats] = useState<{ count: number; growth: number, date: string }[]>([]);
  const [news, setNews] = useState<{ id: string; title: string; description: string; createdAt: string; user: { avatar: string; name: string } }[]>([]);
  const [admin, setAdmin] = useState({ name: "", avatar: "" });
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchBalance = async () => {
        try {
          const response = await fetch("/api/balance", { method: "GET" });
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

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchServiceNumber = async () => {
        try {
          const response = await fetch("/api/services/service-number", { method: "GET" });
          const data = await response.json();
          setServiceNumber(data.count);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      };
      fetchServiceNumber();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchUserStats = async () => {
        try {
          const response = await fetch("/api/users/stats", { method: "GET" });
          const data = await response.json();
          if (data.status === 'success') {
            setUserStats(data.data);
          }
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      };
      fetchUserStats();
    }
  }, [status]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/news');
        const data = response.data as NewsItem[];
        setNews(data);
        console.log(data);
      } catch (error) {
        console.error('Hiba a hírek lekérésekor:', error);
      }
    };

    fetchNews();
  }, [status]);

  const latestStatCustomer = userStats.length > 0 ? userStats[userStats.length - 1] : { count: 0, change: 0 };
  const previousStatCustomer = userStats.length > 1 ? userStats[userStats.length - 2] : { count: 0, change: 0 };

  const growthCustomer = latestStatCustomer.count - previousStatCustomer.count;
  const growthDirectionCustomer = growthCustomer >= 0 ? "↑" : "↓";
  const growthClassCustomer = growthCustomer >= 0 ? "text-green-500" : "text-red-500";

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
      <div className="p-6 space-y-6 bg-slate-900 text-foreground min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 hover:bg-slate-800/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Egyenleg</CardTitle>
              <PiggyBank className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(balance)} Ft</div>
            </CardContent>
          </Card>
          {/* <Card className="bg-slate-800 hover:bg-slate-800/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktív VPS-ek</CardTitle>
              <Server className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{serviceNumber}</div>
            </CardContent>
          </Card> */}
          <Card className="bg-slate-800 hover:bg-slate-800/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Összes Felhasználók száma</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestStatCustomer.count}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className={`${growthClassCustomer} mr-1`}>
                  {growthDirectionCustomer}
                </span>
                {Math.abs(growthCustomer)} az előző hónaphoz képest
              </p>
            </CardContent>
          </Card>
          {/* <Card className="bg-slate-800 hover:bg-slate-800/80 transition-colors">
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
          </Card> */}
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
              {news.length > 0 ? (
                news.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="group transform transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="flex gap-6 items-start rounded-xl p-6 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 shadow-lg transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-500/30">
                      <div className="relative shrink-0 w-[60px] h-[60px]">
                        <Image
                          src={announcement.user.avatar}
                          alt={announcement.user.name}
                          className="rounded-full object-cover"
                          fill
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <div className="flex justify-between items-start">
                          <span className="text-lg font-semibold text-white">
                            {announcement.title}
                          </span>
                          <p className="text-muted-foreground text-sm whitespace-nowrap ml-4">
                            {new Date(announcement.createdAt).toLocaleDateString('hu-HU', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="mt-2 text-sm text-slate-300">
                          {announcement.description}
                        </div>
                        <div className="mt-2 text-xs text-blue-400">
                          Közzétette: {announcement.user.name}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  Nincsenek elérhető hírek
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
