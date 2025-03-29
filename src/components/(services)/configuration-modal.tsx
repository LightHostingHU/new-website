"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { toast } from "sonner";

interface Coupon {
    code: string;
    discount: number;
    is_active: number;
}

const calculatePrice = async (options: ServiceOption[], config: Record<string, number>, coupon: Coupon | null) => {
    let total = options.reduce((total, option) => {
        if (option.price) {
            const value = config[option.label] ?? option.min;
            const price = option.price;
            const min = option.min;
            const step = option.step;

            if (value === min) {
                return total + price;
            } else {
                const steps = (value - min!) / step!;
                return total + price + (steps * price);
            }
        }
        return total;
    }, 0);

    if (coupon) {
        const discount = (coupon.discount / 100) * total;
        total = total - discount;
    }
    return Math.round(total);
};

interface ServiceOption {
    label: string;
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
    placeholder?: string;
    category?: string;
    suffix?: string;
    price?: number;
    default?: number;
}

interface ServiceOther {
    variables?: Record<string, string | number>;
}

interface Service {
    id: string;
    name: string;
    type: string;
    options: ServiceOption[];
    other: ServiceOther | ServiceOther[]; 
}

interface CategorizedOptions {
    [key: string]: ServiceOption[];
}

export function ConfigurationModal({ service, isOpen, onClose }: { service: Service; isOpen: boolean; onClose: () => void }) {
    const { data: session, status } = useSession()
    const router = useRouter()   
    const [config, setConfig] = useState<Record<string, number | string>>({});
    const [other, setOther] = useState<Record<string, string>>({});
    const [price, setPrice] = useState<number>(0);
    const [couponInput, setCouponInput] = useState<string>("");
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [couponApplied, setCouponApplied] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, boolean> | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/sign-in');
        } 
    }, [status, session, router]);

    useEffect(() => {
        // Az options objektumot inicializáljuk
        const initialConfig: Record<string, number | string> = {};
        service.options.forEach((option) => {
            initialConfig[option.label] = option.min ?? 0;
        });

        setConfig(initialConfig);

        // Az other objektumot is inicializáljuk
        const initialOther: Record<string, string> = {};
        if (Array.isArray(service.other) && service.other.length > 0) {
            const firstOther = service.other[0]; // Az első elemet használjuk

            Object.entries(firstOther).forEach(([key, value]) => {
                if (typeof value === "object" && value !== null && key !== "variables") {
                    initialOther[key] = String(value);
                } else {
                    initialOther[key] = value;
                }
            });
        }
        setOther(initialOther);    
    }, [service]);

    useEffect(() => {
        const updatePrice = async () => {
            const newPrice = await calculatePrice(service.options, config as Record<string, number>, coupon);
            setPrice(newPrice);
        };
        updatePrice();
    }, [config, service.options, coupon]);

    const handleConfigChange = (label: string, value: number | string) => {
        setConfig((prev) => ({ ...prev, [label]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: Record<string, boolean> = {};
        Object.keys(categorizedOptions).forEach((category) => {
            categorizedOptions[category].forEach((option) => {
                if (option.options && !config[option.label]) {
                    newErrors[option.label] = true;
                }
            });
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error("Tölts ki minden kötelező mezőt!");
            return;
        }
        

        try {
            const response = await fetch(`/api/order/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price: price,
                    serviceName: service.name,
                    serviceId: service.id,
                    serviceType: service.type,
                    config: config,
                    other: other,
                    username: session?.user?.username,
                })
            });

            if (coupon) {
                const referalBonus = 1 + ((coupon.discount / 100) * 0.6);
                try {
                    const response = await axios.post(`/api/users/add-balance`, {
                        code: coupon.code,
                        amount: referalBonus,
                    });
                } catch (error) {
                    toast.error('Hiba történt a kupon érvényesítése során');
                    return;
                }

            }

            const responseData = await response.json();
            if (responseData.success) {
                toast.success("Sikeres vásárlás!");
            } else {
                console.error("Hiba történt a konfiguráció elküldésekor", responseData);
            }
        } catch (error) {
            setToastMessage('Hiba történt a konfiguráció elküldésekor');
        }
        onClose();
    };

    const handleApplyCoupon = async () => {
        try {
            const response = await axios.get<{ coupon: Coupon }>(`${process.env.NEXT_PUBLIC_API_URL}/coupons/validate/${couponInput}`);
            if (response.data.coupon.is_active === 1) {
                setCoupon(response.data.coupon);
                setCouponApplied(true);
            } else {
                setCoupon(null);
                setCouponApplied(false);
            }
        } catch (error) {
            setToastMessage('Érvénytelen kupon!');
            setCoupon(null);
            setCouponApplied(false);
        }
    };

    const categorizeOptions = (options: ServiceOption[]): CategorizedOptions => {
        const categories: CategorizedOptions = {};
        options.forEach((option) => {
            const category = option.category || "Általános";
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(option);
        });
        return categories;
    };

    const categorizedOptions = categorizeOptions(service.options);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{service.name} Konfiguráció</DialogTitle>
                    <DialogDescription>Állítsa be a szerver paramétereit igényei szerint.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-4">
                        {Object.keys(categorizedOptions).map((category) => (
                            <div key={category}>
                                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                                <div className="space-y-4">
                                    {categorizedOptions[category].map((option, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                                            <Label htmlFor={option.label} className="text-right">
                                                {option.label}
                                            </Label>
                                            {option.options ? (
                                                <Select
                                                    value={config[option.label]?.toString() || ""}
                                                    onValueChange={(value) => handleConfigChange(option.label, value)}
                                                >
                                                    <SelectTrigger className={`col-span-1 md:col-span-3 ${errors && errors[option.label] ? "border-red-500" : ""}`}>
                                                        <SelectValue placeholder={option.placeholder || `Válasszon ${option.label}`} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {option.options.map((opt: string, i: number) => (
                                                            <SelectItem key={i} value={opt}>
                                                                {opt}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                
                                            ) : option.min !== undefined && option.max !== undefined ? (
                                                <div className="col-span-1 md:col-span-3">
                                                    <Slider
                                                        min={option.min}
                                                        max={option.max}
                                                        step={option.step}
                                                        value={[config[option.label] as number ?? option.default ?? option.min]}
                                                        onValueChange={([value]) => handleConfigChange(option.label, value)}
                                                    />
                                                    <div className="mt-1 text-center">
                                                        {config[option.label] ?? option.default ?? option.min} {option.suffix}
                                                    </div>
                                                </div>
                                            ) : (
                                                <Input
                                                    id={option.label}
                                                    value={config[option.label]?.toString()}
                                                    onChange={(e) => handleConfigChange(option.label, e.target.value)}
                                                    className="col-span-1 md:col-span-3"
                                                    placeholder={option.placeholder}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 flex-grow">
                                    <Label htmlFor="coupon" className="text-right">Kuponkód</Label>
                                    <Input
                                        id="coupon"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        className="col-span-1 md:col-span-3"
                                        placeholder="Írja be a kuponkódot"
                                    />
                                </div>
                                <Button type="button" onClick={handleApplyCoupon}>Alkalmaz</Button>
                            </div>
                            {couponApplied && <p className="text-green-500">Kuponkód alkalmazva!</p>}
                            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                                <Label className="text-right font-bold">Végösszeg:</Label>
                                <div className="col-span-1 md:col-span-3 text-xl font-bold text-primary">{price.toLocaleString()} Ft / hó</div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Megrendelés</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
