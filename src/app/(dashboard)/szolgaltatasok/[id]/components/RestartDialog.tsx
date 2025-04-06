import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface RestartDialogProps {
    service: {
        type: string;
        pterodactyl_id?: string;
        vm_id?: string;
    };
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RestartDialog({ service, isOpen, onOpenChange }: RestartDialogProps) {
    const [isRestarting, setIsRestarting] = useState(false);

    const restartServer = async () => {
        try {
            setIsRestarting(true);

            if (service?.type === "game") {
                const res = await fetch(`/api/services/${service?.pterodactyl_id}/restart`, {
                    method: 'POST',
                });

                if (!res.ok) {
                    throw new Error("Hiba történt a szerver újraindítása közben");
                }
            } else if (service?.type === "vps") {
                const res = await fetch(`/api/virtualizor/servers/${service?.vm_id}/restart`, {
                    method: 'POST',
                });

                if (!res.ok) {
                    throw new Error("Hiba történt a szerver újraindítása közben");
                }
            }

            toast.success('A szerver újraindítása megkezdődött');
            onOpenChange(false);
        } catch (error) {
            toast.error('Hiba történt a szerver újraindítása közben');
        } finally {
            setIsRestarting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Biztosan újraindítod a szervert?</DialogTitle>
                    <DialogDescription>
                        A szerver újraindítása kb. 1-2 percet vesz igénybe. Biztosan szeretnéd folytatni?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isRestarting}
                    >
                        Mégse
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={restartServer}
                        disabled={isRestarting}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        {isRestarting ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Újraindítás...
                            </>
                        ) : (
                            'Újraindítás'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
