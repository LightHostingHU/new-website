import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface ConfigOption {
    label: string;
    price: number;
    min?: number;
    max?: number;
    step?: number;
    default?: number;
    suffix?: string;
    options?: string[];
    placeholder?: string;
}

interface ServiceData {
    id: number;
    service_name: string;
    type: string;
    price: number;
    more_info: {
        cpu: number;
        memory: number;
        storage: number;
    };
}

export default function useConfigOptions(service: ServiceData | null, onSuccess?: () => void) {
    const [configOptions, setConfigOptions] = useState<ConfigOption[]>([]);
    const [other, setOther] = useState<any>(null);
    const [configFormData, setConfigFormData] = useState<{ [key: string]: any }>({});
    const [originalConfig, setOriginalConfig] = useState<{ [key: string]: any }>({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchConfigOptions = useCallback(async () => {
        if (!service) return;

        try {
            const response = await axios.get(`/api/services/config-options?name=${service.service_name}`);
            if (response.status === 200) {
                const data = response.data as { formattedOptions: ConfigOption[] }[];
                const dataOther = response.data as { other: any }[];

                setConfigOptions(data[0].formattedOptions);
                setOther(dataOther[0].other);

                const initialFormData: { [key: string]: any } = {};
                let filteredOptions = data[0].formattedOptions.filter((option: ConfigOption) => {
                    return ["CPU mag", "Szerver ram", "Szerver tárhely", "CPU használat"].includes(option.label);
                });

                if (service.type === 'vps') {
                    filteredOptions = filteredOptions.filter(option => option.label !== "Szerver tárhely");
                }

                filteredOptions.forEach((option: ConfigOption) => {
                    initialFormData[option.label] = option.default || option.min;
                });

                console.log('Initial Form Data:', initialFormData);
                setConfigOptions(filteredOptions);
                setConfigFormData(initialFormData);
            }
        } catch (error) {
            console.error("Hiba a konfigurációs lehetőségek betöltésekor:", error);
            toast.error("Nem sikerült betölteni a konfigurációs lehetőségeket");
        }
    }, [service]);

    const loadCurrentConfig = useCallback(() => {
        if (!service || !configOptions.length) return;

        const newFormData: { [key: string]: any } = {};

        // RAM beállítása
        const ramOption = configOptions.find(opt => opt.label === "Szerver ram");
        if (ramOption) {
            const memoryValue = service.more_info.memory;
            newFormData["Szerver ram"] = memoryValue > 1024 ? memoryValue : memoryValue * 1024;
        }

        // Tárhely beállítása
        if (service.type !== 'vps') {
            const storageOption = configOptions.find(opt => opt.label === "Szerver tárhely");
            if (storageOption) {
                const storageValue = service.more_info.storage;
                newFormData["Szerver tárhely"] = storageValue > 1024 ? storageValue : storageValue * 1024;
            }
        }

        const cpuOption = configOptions.find(opt => opt.label === "CPU mag");
        if (cpuOption) {
            newFormData["CPU mag"] = service.more_info.cpu || cpuOption.default || cpuOption.min;
        }

        if (service.type === 'game') {
            const cpuUsageOption = configOptions.find(opt => opt.label === "CPU használat");
            if (cpuUsageOption) {
                newFormData["CPU használat"] = service.more_info.cpu || cpuUsageOption.default || cpuUsageOption.min;
            }
        }

        setConfigFormData(newFormData);
        setOriginalConfig({ ...newFormData });
        calculateTotalPrice(newFormData);
    }, [service, configOptions]);

    const calculateTotalPrice = useCallback((formData: { [key: string]: any }) => {
        if (!configOptions.length || !service) return;

        let price = service.price || 0;

        configOptions.forEach(option => {
            if (option.options) return; // Az opciók listája nem befolyásolja az árat

            const currentValue = formData[option.label] || 0;
            const defaultValue = option.default || 0;

            // Csak a default-tól való eltérést számoljuk
            if (currentValue > defaultValue) {
                const units = currentValue - defaultValue;
                const additionalPrice = (units / (option.step || 1)) * option.price;
                price += additionalPrice;
            }
        });

        setTotalPrice(price);
    }, [configOptions, service]);

    const handleConfigChange = (label: string, value: any) => {
        const newFormData = { ...configFormData, [label]: value };
        setConfigFormData(newFormData);
        calculateTotalPrice(newFormData);
    };

    const updateServiceConfiguration = async () => {
        if (!service) return;

        try {
            setIsUpdating(true);

            const response = await axios.post(`/api/services/${service.id}/update-config`, {
                configData: configFormData,
                type: service.type,
                storage_uuid: other.storage_uuid,
                originalConfig: originalConfig,
            });

            if (response.status !== 200) {
                throw new Error('Hiba történt a konfiguráció módosítása közben');
            }

            toast.success('A konfiguráció módosítása sikeres volt');

            if (onSuccess) {
                onSuccess();
            }

            return true;
        } catch (error) {
            toast.error('Hiba történt a konfiguráció módosítása közben');
            console.error(error);
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        if (service?.type) {
            fetchConfigOptions();
        }
    }, [service?.type, fetchConfigOptions]);

    useEffect(() => {
        if (service && configOptions.length > 0) {
            loadCurrentConfig();
        }
    }, [service, configOptions, loadCurrentConfig]);

    return {
        configOptions,
        configFormData,
        originalConfig,
        totalPrice,
        isUpdating,
        handleConfigChange,
        updateServiceConfiguration,
        fetchConfigOptions,
        loadCurrentConfig
    };
}