interface User {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    permission: string;
    services: Service[];
    history: HistoryItem[];
    coupons: Coupon[];
}

interface Service {
    name: string;
    status: string;
}

interface HistoryItem {
    date: string;
    action: string;
}

interface Coupon {
    id: string;
    code: string;
    discount: string;
    expiry_date: string;
}

"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSession } from "next-auth/react";

export default function UserPage() {
    const { status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const [showBanModal, setShowBanModal] = useState(false);
    const [banReason, setBanReason] = useState("");
    const [user, setUser] = useState<User>({
        firstname: "",
        lastname: "",
        email: "",
        username: "",
        permission: "",
        services: [],
        history: [],
        coupons: []
    });

    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discount: "",
        expiryDate: "",
        isActive: true
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in")
        } else if (status === "authenticated") {
            const fetchUser = async () => {
                try {
                    setIsLoading(true);
                    const response = await axios.get(`/api/users/${id}`);
                    const data = (response.data as User[])[0];

                    setUser({
                        firstname: data.firstname || "",
                        lastname: data.lastname || "",
                        email: data.email || "",
                        username: data.username || "",
                        permission: data.permission || "",
                        services: data.services || [],
                        history: data.history || [],
                        coupons: data.coupons || []
                    });

                    const couponsResponse = await axios.get(`/api/users/${id}/coupons`);
                    const servicesResponse = await axios.get(`/api/users/${id}/services`);
                    
                    setUser(prev => ({
                        ...prev,
                        coupons: Array.isArray(couponsResponse.data) ? couponsResponse.data as Coupon[] : [],
                        services: Array.isArray(servicesResponse.data) ? servicesResponse.data as Service[] : []
                    }));

                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                    toast.error("Hiba!", {
                        description: "Nem sikerült betölteni a felhasználó adatait",
                    });
                }
            };
            fetchUser();
        }
    }, [id, status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/users/${id}`, user);

            if (!response.data) throw new Error("Hiba történt a mentés során");
            toast.success("Siker!", {
                description: "Sikeres mentés!",
            });
        } catch (error) {
            toast.error("Hiba!", {
                description: "Nem sikerült menteni a változtatásokat",
            });
        }
    };

    const handleBan = async () => {
        try {
            await axios.post(`/api/users/${id}/ban`, { reason: banReason });
            toast.success("Siker!", {
                description: "A felhasználó sikeresen ki lett tiltva!",
            });
            setShowBanModal(false);
        } catch (error) {
            toast.error("Hiba!", {
                description: "Nem sikerült kitiltani a felhasználót",
            });
        }
    };

    const handleAddCoupon = async () => {
        try {
            const response = await axios.post(`/api/users/${id}/coupons`, newCoupon);
            setUser({
                ...user,
                coupons: [...user.coupons, response.data as Coupon]
            });
            setNewCoupon({
                code: "",
                discount: "",
                expiryDate: "",
                isActive: true
            });
            toast.success("Siker!", {
                description: "Kupon sikeresen hozzáadva!",
            });
        } catch (error) {
            toast.error("Hiba!", {
                description: "Nem sikerült hozzáadni a kupont",
            });
        }
    };

    const handleDeleteCoupon = async (couponId: string) => {
        try {
            await axios.delete(`/api/users/${id}/coupons/${couponId}`);
            setUser({
                ...user,
                coupons: user.coupons.filter(coupon => coupon.id !== couponId)
            });
            toast.success("Siker!", {
                description: "Kupon sikeresen törölve!",
            });
        } catch (error) {
            toast.error("Hiba!", {
                description: "Nem sikerült törölni a kupont",
            });
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="p-6 space-y-6 bg-slate-900 text-foreground min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
                <Toaster />
                <Dialog open={showBanModal} onOpenChange={setShowBanModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Felhasználó kitiltása</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="banReason">Kitiltás indoka</Label>
                            <Input
                                id="banReason"
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                placeholder="Add meg a kitiltás indokát..."
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowBanModal(false)}>Mégsem</Button>
                            <Button variant="destructive" onClick={handleBan}>Kitiltás</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Felhasználó szerkesztése</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Felhasználó Adatai</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="username">Felhasználónév</Label>
                                    <Input
                                        id="username"
                                        value={user.username}
                                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="name">Vezetéknév</Label>
                                    <Input
                                        id="name"
                                        value={user.firstname}
                                        onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="name">Keresztnév</Label>
                                    <Input
                                        id="name"
                                        value={user.lastname}
                                        onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="role">Szerepkör</Label>
                                    <Input
                                        id="role"
                                        value={user.permission}
                                        onChange={(e) => setUser({ ...user, permission: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <Button type="submit">Mentés</Button>
                                    <Button type="button" variant="destructive" onClick={() => setShowBanModal(true)}>
                                        Felhasználó kitiltása
                                    </Button>
                                </div>
                            </form>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Kuponok</h2>
                                <div className="bg-slate-800 p-4 rounded-lg mb-4">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="couponCode">Kupon kód</Label>
                                            <Input
                                                id="couponCode"
                                                value={newCoupon.code}
                                                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="discount">Kedvezmény (%)</Label>
                                            <Input
                                                id="discount"
                                                type="number"
                                                value={newCoupon.discount}
                                                onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="expiryDate">Lejárati dátum</Label>
                                            <Input
                                                id="expiryDate"
                                                type="date"
                                                value={newCoupon.expiryDate}
                                                onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                                            />
                                        </div>
                                        <Button onClick={handleAddCoupon}>Kupon hozzáadása</Button>
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-lg">
                                    {user.coupons.length > 0 ? (
                                        <ul className="space-y-2">
                                            {user.coupons.map((coupon, index) => {
                                                const expiryDate = new Date(coupon.expiry_date);
                                                return (
                                                    <li key={index} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg hover:bg-slate-700/70 transition-colors">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-emerald-400">{coupon.code}</span>
                                                                <span className="text-sm text-slate-400">
                                                                    Lejár: {expiryDate.toLocaleDateString("hu-HU")}
                                                                </span>
                                                            </div>
                                                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md">
                                                                {coupon.discount}% kedvezmény
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteCoupon(coupon.id)}
                                                            className="hover:bg-red-600/80"
                                                        >
                                                            Törlés
                                                        </Button>
                                                    </li>);
                                            })}                                    </ul>
                                    ) : (
                                        <p>Nincsenek kuponok</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-4">Szolgáltatások</h2>
                                <div className="bg-slate-800 p-4 rounded-lg">
                                    {user.services.length > 0 ? (
                                        <ul className="space-y-2">
                                            {user.services.map((service, index) => (
                                                <li key={index} className="flex justify-between items-center">
                                                    <span>{service.name}</span>
                                                    <span>{service.status}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Nincsenek aktív szolgáltatások</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-4">Előzmények</h2>
                                <div className="bg-slate-800 p-4 rounded-lg">
                                    {user.history.length > 0 ? (
                                        <ul className="space-y-2">
                                            {user.history.map((item, index) => (
                                                <li key={index} className="border-b border-slate-700 pb-2">
                                                    <div className="text-sm text-slate-400">{new Date(item.date).toLocaleDateString()}</div>
                                                    <div>{item.action}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Nincs előzmény</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>


    );
}
