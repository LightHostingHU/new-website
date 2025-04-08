
"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { extendService } from "@/lib/actions/service";
import { useState } from "react";

interface ServiceExtensionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    serviceId: string;
    price: number;
}

export function ServiceExtensionDialog({
    isOpen,
    onClose,
    serviceId,
    price,
}: ServiceExtensionDialogProps) {
    const [isPending, setIsPending] = useState(false);

    const handleExtend = async () => {
        try {
            setIsPending(true);

            const response = await fetch('/api/service/extend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ serviceId: Number(serviceId), price: price }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Hiba történt a szolgáltatás meghosszabbítása közben");
                return;
            }
            onClose();

            toast.success("A szolgáltatás sikeresen meghosszabbítva");
        } catch (error) {
            toast("A szolgáltatás hosszabbítása sikertelen");
        } finally {
            setIsPending(false);
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Szolgáltatás hosszabbítása</DialogTitle>
                    <DialogDescription>
                        A szolgáltatás hosszabbításának díja {price} Ft. Biztosan
                        szeretné meghosszabbítani?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isPending}>
                        Mégsem
                    </Button>
                    <Button onClick={handleExtend} disabled={isPending}>
                        Hosszabbítás
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
