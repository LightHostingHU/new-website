"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

import ServiceHeader from './components/ServiceHeader';
import ServiceInfo from './components/ServiceInfo';
import ServerDetails from './components/ServerDetails';
import SubscriptionInfo from './components/SubscriptionInfo';
import ResourceMonitor from './components/ResourceMonitor';
import ActionButtons from './components/ActionButtons';
import RestartDialog from './components/RestartDialog';
import ConfigDialog from './components/ConfigDialog';

import useServiceData from './hooks/useServiceData';
import { ServiceExtensionDialog } from './components/ServiceExtensionDialog';
import { ServiceCancelDialog } from './components/ServiceCancelDialog';

export default function ServiceDetails() {
  const {
    service,
    error,
    isLoading,
    ips,
    fetchInitialServiceData
  } = useServiceData();

  const [isRestartDialogOpen, setIsRestartDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isExtensionServiceDialogOpen, setIsExtensionServiceDialogOpen] = useState(false);

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
            onClick={(e) => fetchInitialServiceData()}
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
        <ServiceHeader service={service} />

        {/* Tartalom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bal oldali oszlop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            <ServiceInfo service={service} ips={ips} />
            <ServerDetails service={service} />
          </motion.div>

          {/* Jobb oldali oszlop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            <SubscriptionInfo service={service} />
            <ResourceMonitor service={service} />
          </motion.div>
        </div>

        {/* Műveletek */}
        <ActionButtons
          service={service}
          onRestartClick={() => setIsRestartDialogOpen(true)}
          onConfigClick={() => setIsConfigDialogOpen(true)}
          onExtensionServiceClick={() => setIsExtensionServiceDialogOpen(true)}
          onCancelServiceClick={() => setIsExtensionServiceDialogOpen(true)}
        />

        {/* Dialógusok */}
        <RestartDialog
          service={service}
          isOpen={isRestartDialogOpen}
          onOpenChange={setIsRestartDialogOpen}
        />

        <ConfigDialog
          service={service}
          isOpen={isConfigDialogOpen}
          onOpenChange={setIsConfigDialogOpen}
          onSuccess={fetchInitialServiceData}
        />

        <ServiceExtensionDialog
          serviceId={String(service.id)}
          isOpen={isExtensionServiceDialogOpen}
          onClose={() => setIsExtensionServiceDialogOpen(false)}
          price={service.price}
        />

        <ServiceCancelDialog
          serviceId={String(service.id)}
          isOpen={isExtensionServiceDialogOpen}
          onClose={() => setIsExtensionServiceDialogOpen(false)}
          price={service.price}
        />
      </div>
    </DashboardLayout>
  );
}
