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
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ServiceCancelDialogProps {
    isOpen: boolean;
    onClose: () => void;
    serviceId: string;
    price: number;
}

export function ServiceCancelDialog({
    isOpen,
    onClose,
    serviceId,
    price,
}: ServiceCancelDialogProps) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleCancel = async () => {
        try {
            setIsPending(true);

            const response = await fetch('/api/service/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ serviceId: Number(serviceId) }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Hiba történt a szolgáltatás lemondása közben");
                return;
            }
            
            toast.success(data.message || "A szolgáltatás sikeresen lemondva");
            onClose();

            if (response.ok){
                router.push('/szolgaltatasok');
            }
        } catch (error) {
            toast.error("A szolgáltatás lemondása sikertelen");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Szolgáltatás lemondása</DialogTitle>
                    <DialogDescription>
                        Biztosan le szeretné mondani a szolgáltatást? A lemondással
                        {price > 0 ? ` ${price} Ft` : ""} visszatérítésre is lehetőség lehet.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isPending}>
                        Mégsem
                    </Button>
                    <Button onClick={handleCancel} disabled={isPending}>
                        Lemondás
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
