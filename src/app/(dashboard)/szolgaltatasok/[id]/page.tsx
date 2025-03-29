"use client"
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Server,
  Cpu,
  HardDrive,
  MemoryStickIcon as Memory,
  Calendar,
  CreditCard,
  Clock,
  RefreshCw,
  Edit,
  XCircle,
  ArrowRight,
  Wifi,
  AlertCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';

interface ServiceData {
  id: number;
  type: string;
  status: string;
  price: number;
  ip_address: string;
  pterodactyl_id: string;
  buy_date: string;
  expire_date: string;
  duration: number;
  more_info: {
    cpu: number;
    memory: number;
    storage: number;
    memory_unit?: string;
    storage_unit?: string;
  };
}

interface ResourceUsage {
  cpu: number;
  memory: number;
  disk: number;
  isLoading: boolean;
  error?: string;
}

export default function ServiceDetails() {
  const params = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resourceUsage, setResourceUsage] = useState<ResourceUsage>({
    cpu: 0,
    memory: 0,
    disk: 0,
    isLoading: true
  });
  const [isRestartDialogOpen, setIsRestartDialogOpen] = useState(false); // Modal állapot


  const convertToGB = useCallback((value: number, unit?: string) => {
    return unit === 'MB' ? value / 1024 : value;
  }, []);

  const fetchResources = useCallback(async (serverId: string) => {
    try {
      setResourceUsage(prev => ({ ...prev, isLoading: true, error: undefined }));

      const res = await fetch(`/api/pterodactyl/servers/${serverId}/resources`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!data?.attributes?.resources) {
        throw new Error('Invalid data structure from API');
      }

      // Minden érték GB-ben tárolva
      const newUsage = {
        cpu: data.attributes.resources.cpu_absolute,
        memory: data.attributes.resources.memory_bytes / (1024 * 1024 * 1024), // GB
        disk: data.attributes.resources.disk_bytes / (1024 * 1024 * 1024),     // GB
        isLoading: false,
        error: undefined
      };

      setResourceUsage(newUsage);
      return newUsage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setResourceUsage(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw err;
    }
  }, []);

  // Szolgáltatás adatok betöltése
  const fetchServiceData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`/api/services/${params.id}`);
      if (!res.ok) throw new Error(`Failed to fetch service: ${res.status}`);

      const data = await res.json();
      const moreInfo = JSON.parse(data.more_info);

      const dataWithMoreInfo = {
        ...data,
        more_info: {
          cpu: moreInfo.cpu,
          memory: convertToGB(moreInfo.ram, moreInfo.ram_unit), // Mindig GB-ben
          storage: convertToGB(moreInfo.disk, moreInfo.disk_unit), // Mindig GB-ben
          memory_unit: 'GB',
          storage_unit: 'GB'
        },
        pterodactyl_id: data.pterodactyl_id || data.server_id
      };

      setService(dataWithMoreInfo);
      await fetchResources(dataWithMoreInfo.pterodactyl_id);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load service data';
      setError(errorMessage);
      console.error('Error fetching service:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [params.id, fetchResources, convertToGB]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const init = async () => {
      await fetchServiceData();

      intervalId = setInterval(async () => {
        if (service?.pterodactyl_id) {
          await fetchResources(service.pterodactyl_id);
        }
      }, 30000);
    };

    init();

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchServiceData, fetchResources, service?.pterodactyl_id]);

  const calculateUsagePercent = (usedGB: number, totalGB: number) => {
    return (usedGB / totalGB) * 100;
  };

  const memoryUsagePercent = service && resourceUsage ? calculateUsagePercent(
    resourceUsage.memory || 0,
    (service.more_info.memory /1024)
  ) : 0;

  const diskUsagePercent = service && resourceUsage ? calculateUsagePercent(
    resourceUsage.disk || 0,
    (service.more_info.storage /1024) || 1
  ) : 0;
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      default: return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    }
  };


  const restartServer = async () => {
    try {
      if (service?.type === "game"){
        const res = await fetch(`/api/services/${service?.pterodactyl_id}/restart`, {
          method: 'POST',
        });
        if (!res.ok) {
          throw new Error("Hiba történt a szerver újraindítása közben");
        }

        toast.success('A szerver újraindítása megkezdődött');
        setIsRestartDialogOpen(false);
      } else if (service?.type === "vps"){
        
      }

      

      
    } catch (error) {
      toast.error('Hiba történt a szerver újraindítása közben'); 
      setIsRestartDialogOpen(false);
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
          <div className="flex items-center gap-2 text-red-500 mb-4">
            <AlertCircle className="h-8 w-8" />
            <h2 className="text-2xl font-semibold">Hiba történt</h2>
          </div>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button
            onClick={fetchServiceData}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Újrapróbálkozás
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading || !service) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Fejléc */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b dark:border-gray-700 pb-6 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
              <span>Szolgáltatások</span>
              <ChevronRight className="h-4 w-4" />
              <span>Részletek</span>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
              {service.type.toUpperCase()} Szolgáltatás
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              <p className="text-gray-500 dark:text-gray-400">Azonosító: #{service.id}</p>
              <p className="text-gray-500 dark:text-gray-400">Pterodactyl ID: {service.pterodactyl_id}</p>
            </div>
          </div>

          <Badge className={`px-4 py-1.5 text-sm font-medium rounded-full ${getStatusColor(service.status)} border`}>
            <span className="relative flex h-2 w-2 mr-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${service.status === "active" ? "bg-green-400" :
                  service.status === "pending" ? "bg-yellow-400" : "bg-red-400"
                } opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${service.status === "active" ? "bg-green-500" :
                  service.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                }`} />
            </span>
            {service.status === "active" ? "Aktív" : service.status === "pending" ? "Függőben" : "Inaktív"}
          </Badge>
        </motion.div>

        {/* Tartalom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bal oldali oszlop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Szolgáltatás adatai */}
            <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">Szolgáltatás adatai</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <InfoRow
                  icon={<Server className="h-4 w-4 text-blue-600" />}
                  label="Típus"
                  value={service.type}
                  iconBg="bg-blue-100 dark:bg-blue-900/30"
                />
                <InfoRow
                  icon={<CreditCard className="h-4 w-4 text-green-600" />}
                  label="Ár"
                  value={`${service.price.toLocaleString("hu-HU")} Ft/hó`}
                  iconBg="bg-green-100 dark:bg-green-900/30"
                />
                <InfoRow
                  icon={<Wifi className="h-4 w-4 text-purple-600" />}
                  label="IP cím"
                  value={service.ip_address}
                  iconBg="bg-purple-100 dark:bg-purple-900/30"
                />
              </CardContent>
            </Card>

            {/* Szerver részletek */}
            <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-indigo-500" />
                  <CardTitle className="text-lg">Szerver részletek</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <InfoRow
                  icon={<Cpu className="h-4 w-4 text-indigo-600" />}
                  label="CPU"
                  value={`${service.more_info.cpu} ${service.type === "game" ? "%" : "db"}`}
                  iconBg="bg-indigo-100 dark:bg-indigo-900/30"
                />
                <InfoRow
                  icon={<Memory className="h-4 w-4 text-blue-600" />}
                  label="RAM"
                  value={`${service.more_info.memory.toFixed(1)} MB`}
                  iconBg="bg-blue-100 dark:bg-blue-900/30"
                />
                <InfoRow
                  icon={<HardDrive className="h-4 w-4 text-teal-600" />}
                  label="Tárhely"
                  value={`${service.more_info.storage.toFixed(1)} MB`}
                  iconBg="bg-teal-100 dark:bg-teal-900/30"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Jobb oldali oszlop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Előfizetés adatai */}
            <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-lg">Előfizetés adatai</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <InfoRow
                  icon={<Calendar className="h-4 w-4 text-orange-600" />}
                  label="Kezdés dátuma"
                  value={new Date(service.buy_date).toLocaleDateString('hu-HU')}
                  iconBg="bg-orange-100 dark:bg-orange-900/30"
                />
                <InfoRow
                  icon={<CreditCard className="h-4 w-4 text-red-600" />}
                  label="Következő fizetés"
                  value={new Date(service.expire_date).toLocaleDateString('hu-HU')}
                  iconBg="bg-red-100 dark:bg-red-900/30"
                />
                <InfoRow
                  icon={<Clock className="h-4 w-4 text-amber-600" />}
                  label="Időtartam"
                  value={`${service.duration} hónap`}
                  iconBg="bg-amber-100 dark:bg-amber-900/30"
                />
              </CardContent>
            </Card>

            {/* Szerver monitoring */}
            <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-emerald-500" />
                  <CardTitle className="text-lg">Szerver monitoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {resourceUsage.isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                ) : resourceUsage.error ? (
                  <div className="text-center py-4 text-red-500">
                    <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                    <p>Hiba az erőforrás adatok betöltésekor</p>
                    <p className="text-sm text-muted-foreground mt-1">{resourceUsage.error}</p>
                    <Button
                      onClick={() => service?.pterodactyl_id && fetchResources(service.pterodactyl_id)}
                      className="mt-3"
                      variant="outline"
                    >
                      Újrapróbálkozás
                    </Button>
                  </div>
                ) : (
                  <>
                    <ResourceUsageRow
                      icon={<Cpu className="h-4 w-4 text-indigo-500" />}
                      label="CPU használat"
                      value={resourceUsage.cpu}
                      unit="%"
                      usagePercent={resourceUsage.cpu || 0}
                    />
                    <ResourceUsageRow
                      icon={<Memory className="h-4 w-4 text-blue-500" />}
                      label="RAM használat"
                      value={resourceUsage.memory.toFixed(1)}
                      unit="GB"
                      total={service.more_info.memory / 1024}
                      totalUnit="GB"
                      usagePercent={memoryUsagePercent || 0}
                    />
                    <ResourceUsageRow
                      icon={<HardDrive className="h-4 w-4 text-teal-500" />}
                      label="Tárhely használat"
                      value={resourceUsage.disk.toFixed(1)}
                      unit="GB"
                      total={service.more_info.storage / 1024}
                      totalUnit="GB"
                      usagePercent={diskUsagePercent || 0}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Műveletek */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Műveletek</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionButton
              icon={<RefreshCw className="mr-2 h-5 w-5 group-hover:rotate-180" />}
              label="Szerver újraindítása"
              tooltip="A szerver újraindítása kb. 1-2 percet vesz igénybe"
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => setIsRestartDialogOpen(true)}
            />
            <ActionButton
              icon={<ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1" />}
              label="Szolgáltatás hosszabbítása"
              tooltip="Hosszabbítsa meg előfizetését kedvezményes áron"
              className="bg-green-500 hover:bg-green-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionButton
              icon={<Edit className="mr-2 h-5 w-5 group-hover:scale-110" />}
              label="Konfiguráció módosítása"
              tooltip="Módosítsa a szerver erőforrásait igény szerint"
              variant="outline"
              className="border-yellow-200 hover:bg-yellow-500"
            />
            <ActionButton
              icon={<XCircle className="mr-2 h-5 w-5 group-hover:rotate-90" />}
              label="Szolgáltatás lemondása"
              tooltip="Figyelem: A lemondás végleges művelet!"
              variant="outline"
              className="border-red-200 hover:bg-red-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <a href="https://panel.hostinger.hu" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="w-full py-6 border-blue-200 hover:bg-blue-500 transition-all group"
              >
                <ExternalLink className="mr-2 h-5 w-5 group-hover:translate-x-1" />
                Kezelőfelület megnyitása
              </Button>
            </a>
          </div>
        </motion.div>

        <Dialog open={isRestartDialogOpen} onOpenChange={setIsRestartDialogOpen}>
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>
              <h2 className="text-lg font-bold">Biztosan újraindítod a szervert?</h2>
            </DialogHeader>
            <p>A szerver újraindítása kb. 1-2 percet vesz igénybe. Biztosan szeretnéd folytatni?</p>
            <DialogFooter>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsRestartDialogOpen(false)}
              >
                Mégse
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={restartServer}
              >
                Újraindítás
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

const InfoRow = ({ icon, label, value, iconBg }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg: string;
}) => (
  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 flex items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
    </div>
    <span className="font-medium text-gray-800 dark:text-white">{value}</span>
  </div>
);

const ResourceUsageRow = ({
  icon,
  label,
  value,
  unit,
  total,
  totalUnit,
  usagePercent
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  total?: number;
  totalUnit?: string;
  usagePercent: number;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
      </div>
      <span className={`font-medium ${usagePercent > 80 ? "text-red-500" :
          usagePercent > 50 ? "text-yellow-500" : "text-green-500"
        }`}>
        {value} {unit}
        {total !== undefined && (
          <span className="text-muted-foreground ml-1">
            / {total.toFixed(1)} {totalUnit} ({usagePercent.toFixed(1)}%)
          </span>
        )}
      </span>
    </div>
    <Progress
      value={usagePercent}
      className={`h-2 bg-gray-100 dark:bg-gray-700 ${getUsageColor(usagePercent)}`}
    />
  </div>
);

const ActionButton = ({ icon, label, tooltip, variant = 'default', className = '', onClick }: {
  icon: React.ReactNode;
  label: string;
  tooltip: string;
  variant?: 'default' | 'outline';
  className?: string;
  onClick?: () => void;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          className={`w-full py-6 ${className} transition-all group`}
          onClick={onClick}
        >
          {icon}
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);function getUsageColor(usagePercent: number) {
  if (usagePercent < 50) return "bg-green-500";
  if (usagePercent < 80) return "bg-yellow-500";
  return "bg-red-500";
}