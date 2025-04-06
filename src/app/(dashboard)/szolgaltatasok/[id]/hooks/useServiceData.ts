import { useState, useEffect, useCallback } from 'react';
import { useParams } from "next/navigation";
import axios from 'axios';

interface ServiceData {
    server_id: string;
    id: number;
    service_name: string;
    type: string;
    status: string;
    price: number;
    ip_address: string;
    pterodactyl_id?: string;
    vm_id?: string;
    buy_date: string;
    expire_date: string;
    duration: number;
    more_info: {
        cpu: number;
        memory: number;
        storage: number;
        memory_unit?: string;
        storage_unit?: string;
        os?: string;
    };
}

export default function useServiceData() {
    const params = useParams<{ id: string }>();
    const [service, setService] = useState<ServiceData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [ips, setIPs] = useState<string>('');

    const convertToGB = useCallback((value: number, unit?: string) => {
        return  value / 1024;
    }, []);

    const fetchInitialServiceData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const res = await fetch(`/api/services/${params.id}`);
            if (!res.ok) throw new Error(`Failed to fetch service: ${res.status}`);

            const data = await res.json();
            const moreInfo = JSON.parse(data.more_info);
            const server_id = data.pterodactyl_id || data.vm_id;

            const dataWithMoreInfo = {
                ...data,
                more_info: {
                    cpu: moreInfo.cpu,
                    memory: convertToGB(moreInfo.ram, moreInfo.ram_unit),
                    storage: convertToGB(moreInfo.disk, moreInfo.disk_unit),
                    memory_unit: 'GB',
                    storage_unit: 'GB',
                    os: moreInfo.os
                },
                server_id
            };

            setService(dataWithMoreInfo);
            
            if (data.type === "game") {
                const details = await fetch(`/api/pterodactyl/servers/${server_id}/details`);
                const detailsData = await details.json();
                const allocation = detailsData.attributes.relationships.allocations.data[0].attributes;
                setIPs(`${allocation.ip_alias}:${allocation.port}`);
            } else if (data.type === "vps") {
                const res = await axios.get(`/api/virtualizor/servers/${server_id}/resources`);
                const ipObject = (res.data as { data: { data2: { [key: string]: { ips: string[] } } } }).data.data2[server_id]?.ips;
                setIPs(ipObject ? Object.values(ipObject)[0] : "N/A");
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load service data';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [params.id, convertToGB]);

    useEffect(() => {
        fetchInitialServiceData();
    }, [fetchInitialServiceData]);

    return {
        service,
        error,
        isLoading,
        ips,
        fetchInitialServiceData
    };
}
