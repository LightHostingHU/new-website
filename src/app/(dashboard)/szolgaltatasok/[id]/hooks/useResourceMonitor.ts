import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface ResourceUsage {
    cpu: number;
    memory: number;
    disk: number;
    isLoading: boolean;
    error?: string;
}

interface ServiceData {
    server_id: string;
    type: string;
    more_info: {
        memory: number;
        storage: number;
    };
}

export default function useResourceMonitor(service: ServiceData | null) {
    const [resourceUsage, setResourceUsage] = useState<ResourceUsage>({
        cpu: 0,
        memory: 0,
        disk: 0,
        isLoading: true
    });

    const fetchResources = useCallback(async (serverId: string) => {
        if (!service) return;

        if (service.type === "game") {
            try {
                setResourceUsage(prev => ({ ...prev, isLoading: true, error: undefined }));

                const resource = await fetch(`/api/pterodactyl/servers/${serverId}/resources`);

                if (!resource.ok) {
                    throw new Error(`HTTP error! status: ${resource.status}`);
                }

                const data = await resource.json();

                if (!data?.attributes?.resources) {
                    throw new Error('Invalid data structure from API');
                }

                const newUsage = {
                    cpu: data.attributes.resources.cpu_absolute,
                    memory: data.attributes.resources.memory_bytes / (1024 * 1024 * 1024),
                    disk: data.attributes.resources.disk_bytes / (1024 * 1024 * 1024),
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
        } else if (service.type === "vps") {
            try {
                setResourceUsage(prev => ({ ...prev, isLoading: true, error: undefined }));

                // console.log("SZERVER ID 71", serverId)
                const res = await axios.get(`/api/virtualizor/servers/${serverId}/resources`);

                if (res.status !== 200) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const resData = res.data as {
                    data: {
                        data: {
                            [id: string]: {
                                used_cpu: string;
                                used_ram: string;
                                used_disk: number;
                            };
                        };
                    };
                };

                const usage = resData.data.data[serverId];

                const newUsage = {
                    cpu: Number(usage.used_cpu) || 0,
                    memory: (Number(usage.used_ram) / 1024) || 0,
                    disk: usage.used_disk || 0,
                    isLoading: false,
                    error: undefined
                };

                setResourceUsage(newUsage);
                return newUsage;

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                setResourceUsage(prev => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage
                }));
                throw error;
            }
        }
    }, [service]);

    const startMonitoring = useCallback(() => {
        if (!service?.server_id) return;

        fetchResources(service.server_id);

        const intervalId = setInterval(async () => {
            try {
                await fetchResources(service.server_id);
            } catch (error) {
                console.error("Monitoring error:", error);
            }
        }, 30000);

        return () => clearInterval(intervalId);
    }, [service?.server_id, fetchResources]);

    useEffect(() => {
        if (service) {
            return startMonitoring();
        }
    }, [service, startMonitoring]);

    const calculateUsagePercent = (usedGB: number, totalGB: number) => {
        return (usedGB / totalGB) * 100;
    };

    const memoryUsagePercent = service && resourceUsage ? calculateUsagePercent(
        resourceUsage.memory || 0,
        (service.more_info.memory )
    ) : 0;

    const diskUsagePercent = service && resourceUsage ? calculateUsagePercent(
        resourceUsage.disk || 0,
        (service.more_info.storage) || 1
    ) : 0;

    return {
        resourceUsage,
        memoryUsagePercent,
        diskUsagePercent,
        fetchResources
    };
}


