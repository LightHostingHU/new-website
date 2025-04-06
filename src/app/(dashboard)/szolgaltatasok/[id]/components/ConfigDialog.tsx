import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import useConfigOptions from '../hooks/useConfigOptions';

interface ConfigDialogProps {
    service: {
        id: number;
        type: string;
        price: number;
        more_info: {
            cpu: number;
            memory: number;
            storage: number;
            os?: string;
        };
    };
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function ConfigDialog({ service, isOpen, onOpenChange, onSuccess }: ConfigDialogProps) {
    const {
        configOptions,
        configFormData,
        totalPrice,
        isUpdating,
        handleConfigChange,
        updateServiceConfiguration
    } = useConfigOptions(service, () => {
        onOpenChange(false);
        if (onSuccess) onSuccess();
    });

    console.log("Config Options:", configOptions);
    console.log("Config Form Data:", configFormData);

    const handleSave = async () => {
        const success = await updateServiceConfiguration();
        if (success) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger />
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Konfiguráció módosítása</DialogTitle>
                    <DialogDescription>
                        Módosítsa a szerver erőforrásait az igényeinek megfelelően. A módosítás után a szerver újraindul.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {configOptions.map((option, index) => (
                        <div key={index} className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor={option.label} className="text-right">
                                {option.label}
                            </label>
                            <div className="col-span-3">
                                {option.options ? (
                                    <select
                                        id={option.label}
                                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                                        value={configFormData[option.label] || ''}
                                        onChange={(e) => handleConfigChange(option.label, e.target.value)}
                                    >
                                        {option.options.map((opt, i) => (
                                            <option key={i} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <>
                                        <input
                                            id={option.label}
                                            type="number"
                                            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                                            value={configFormData[option.label] || option.default || option.min}
                                            onChange={(e) => handleConfigChange(option.label, parseInt(e.target.value) || option.min)}
                                            min={option.min}
                                            max={option.max}
                                            step={option.step}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {option.min} - {option.max} {option.suffix} (lépésköz: {option.step})
                                            {option.price > 0 && ` - ${option.price} Ft/${option.step} ${option.suffix}`}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Becsült havi díj:</span>
                            <span className="text-lg font-bold text-green-600">{totalPrice.toLocaleString('hu-HU')} Ft</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            A tényleges díj a kiválasztott konfigurációtól függ. A módosítás a következő számlázási ciklusban lép életbe.
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
                        Mégse
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        {isUpdating ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Feldolgozás...
                            </>
                        ) : (
                            'Mentés'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
