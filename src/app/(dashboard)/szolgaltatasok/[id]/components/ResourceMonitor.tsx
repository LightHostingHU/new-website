import { Cpu, MemoryStickIcon as Memory, HardDrive, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getUsageColor } from '../utils/helpers';
import useResourceMonitor from '../hooks/useResourceMonitor';

interface ResourceUsageRowProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit: string;
    total?: number;
    totalUnit?: string;
    usagePercent: number;
}

const ResourceUsageRow = ({
    icon,
    label,
    value,
    unit,
    total,
    totalUnit,
    usagePercent
}: ResourceUsageRowProps) => (

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

interface ResourceMonitorProps {
    service: {
        server_id: string;
        type: string;
        more_info: {
            memory: number;
            storage: number;
        };
    };
}

export default function ResourceMonitor({ service }: ResourceMonitorProps) {
    console.log("ResourceMonitor component rendered with service:", service);
    const { resourceUsage, memoryUsagePercent, diskUsagePercent, fetchResources } = useResourceMonitor(service);

    return (
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
                            onClick={() => service?.server_id && fetchResources(service.server_id)}
                            className="mt-3"
                            variant="outline"
                        >
                            Újrapróbálkozás
                        </Button>
                    </div>
                ) : (
                    <CardContent>
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
                            total={service.more_info.memory}
                            totalUnit="GB"
                            usagePercent={memoryUsagePercent || 0}
                        />
                        <ResourceUsageRow
                            icon={<HardDrive className="h-4 w-4 text-teal-500" />}
                            label="Tárhely használat"
                            value={resourceUsage.disk.toFixed(1)}
                            unit="GB"
                            total={service.more_info.storage}
                            totalUnit="GB"
                            usagePercent={diskUsagePercent || 0}
                        />
                    </CardContent>
                )}
            </CardContent>
        </Card>
    );
}
