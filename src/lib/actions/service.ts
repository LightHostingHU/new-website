import { db } from "@/lib/db";
import { toast } from "sonner";

/**
 * Extends the expiration date of a service
 * @param serviceId The ID of the service to extend
 * @param months The number of months to extend the service by
 * @returns A promise that resolves to a boolean indicating success or failure
 */
export async function extendService(serviceId: number, months: number): Promise<boolean> {
    try {
        const service = await db.service.findUnique({
            where: {
                id: serviceId
            }
        });

        if (!service) {
            toast.error("A szolgáltatás nem található");
            return false;
        }

        const currentExpireDate = new Date(service.expire_date);
        const newExpireDate = new Date(currentExpireDate);
        newExpireDate.setMonth(newExpireDate.getMonth() + months);

        await db.service.update({
            where: {
                id: serviceId
            },
            data: {
                expire_date: newExpireDate
            }
        });

        toast.success(`A szolgáltatás sikeresen meghosszabbítva ${months} hónappal`);
        return true;
    } catch (error) {
        console.error("Error extending service:", error);
        toast.error("Hiba történt a szolgáltatás meghosszabbítása közben");
        return false;
    }
}
