"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Calendar, Download, Plus, Wallet, Bitcoin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useRouter, useSearchParams } from "next/navigation"
import showToast from "../Toast"
import { useSession } from "next-auth/react"

const invoices = [
    { id: 1, date: "2023-06-01", amount: 15000, status: "Fizetve" },
    { id: 2, date: "2023-07-01", amount: 18000, status: "Folyamatban" },
    { id: 3, date: "2023-08-01", amount: 18000, status: "Függőben" },
]

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
    throw new Error("Stripe publishable key is not defined in environment variables.");
}
const stripPromise = loadStripe(stripeKey);

export function Szamlazas() {
    const { status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [balance, setBalance] = useState(0)
    const [amount, setAmount] = useState("")
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ type?: "success" | "danger" | "warning"; text: string } | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in");
        }
        if (status === "authenticated") {
            const fetchBalance = async () => {
                try {
                    setIsLoading(true);
                    const response = await fetch("/api/balance", {
                        method: "GET",
                    });
                    const data = await response.json();
                    setBalance(data.balance);
                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(true);
                }
            };
            fetchBalance();
        }
    }, [status, balance]);

    const handleDialogOpen = () => {
        if (Number(amount) < 175) {
            showToast({
                message: "A minimum feltöltési összeg 175 Ft!",
                type: "warning",
                onClose: () => setToastMessage(null)
            });
            return;
        }
        setDialogOpen(true);
    };

    const handleStripeCheckout = async () => {
        try {
            if (Number(amount) < 175) {
                showToast({
                    message: "A minimum feltöltési összeg 175 Ft!",
                    type: "warning",
                    onClose: () => setToastMessage(null)
                });
                return;
            }
            const stripe = await stripPromise;
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: Number(amount) }),
            })
            const session = await response.json()
            if (stripe) {
                await stripe.redirectToCheckout({
                    sessionId: session.id,
                });

            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const handlePayPalCheckout = async () => {
        try {
            const response = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });

            const data = await response.json();
            if (!data.id) throw new Error("Failed to create PayPal order");

            window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.id}`;
        } catch (error) {
            console.error("PayPal Checkout Error:", error);
        }
    };

    const formatNumber = (num: number | undefined) => {
        if (typeof num !== "number" || isNaN(num)) {
            console.error("formatNumber received invalid value:", num);
            return "0";
        }
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    if (isLoading) {
        return <div className="p-6 space-y-6 bg-slate-900 text-foreground min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    }
    
    return (
        <div className="bg-slate-900 min-h-screen">
            <div className="container mx-auto py-10 px-4">
                <h1 className="text-4xl font-bold mb-8 text-primary">Számlázás</h1>
                <div className="grid gap-8 md:grid-cols-2">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="space-y-2">
                            <CardTitle className="text-2xl text-primary">Egyenleg feltöltés</CardTitle>
                            <CardDescription className="text-slate-400">Tölts fel pénzt a számládra (minimum 175 Ft)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Input
                                    type="number"
                                    placeholder="Összeg (Ft)"
                                    value={amount}
                                    min="175"
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="bg-slate-900 border-slate-700"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleDialogOpen} className="bg-primary hover:bg-primary/90">
                                <Plus className="mr-2 h-4 w-4" />
                                Feltöltés
                            </Button>
                        </CardFooter>

                        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger />
                            <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-primary/20">
                                <DialogHeader>
                                    <h3 className="text-2xl font-bold text-primary mb-4">Válassza ki a fizetési módot</h3>
                                    <p className="text-lg text-primary/80">Fizetendő összeg: {formatNumber(Number(amount))} Ft</p>
                                </DialogHeader>
                                <div className="grid grid-cols-1 gap-4 py-6">
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center space-x-3 h-14 text-lg"
                                        onClick={() => {
                                            handleStripeCheckout();
                                            setDialogOpen(false);
                                        }}
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        <span>Bankkártya</span>
                                    </Button>
                                    <Button
                                        className="bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-3 h-14 text-lg"
                                        onClick={() => {
                                            handlePayPalCheckout();
                                            setDialogOpen(false);
                                        }}
                                    >
                                        <Wallet className="w-6 h-6" />
                                        <span>PayPal</span>
                                    </Button>
                                </div>
                                <DialogFooter className="space-x-4 pt-4 border-t border-primary/20">
                                    <Button
                                        variant="outline"
                                        className="hover:bg-red-600/20 transition-colors"
                                        onClick={() => setDialogOpen(false)}
                                    >
                                        Mégse
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="space-y-3">
                            <CardTitle className="text-2xl text-primary">Számlázási összesítő</CardTitle>
                            <CardDescription className="text-slate-400 text-lg">Az elmúlt 3 hónap</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="flex items-center space-x-4">
                                <div className="text-5xl font-bold text-primary">{formatNumber(balance)} Ft</div>
                                <div className="text-slate-400 text-sm">Teljes összeg</div>
                            </div>
                        </CardContent>
                    </Card>                </div>

                <h2 className="text-3xl font-bold mt-12 mb-6 text-primary">Számlák</h2>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-2xl text-primary">Számlák története</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {invoices.map((invoice) => (
                                <div key={invoice.id} className="flex items-center justify-between p-5 border border-slate-700 rounded-lg hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <Calendar className="h-6 w-6 text-primary" />
                                        <div>
                                            <p className="font-medium text-lg text-slate-200">{invoice.date}</p>
                                            <p className="text-sm text-slate-400">Számla #{invoice.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="text-right">
                                            <p className="font-medium text-lg text-primary">{formatNumber(invoice.amount)} Ft</p>
                                            <Badge variant={invoice.status === "Fizetve" ? "default" : "secondary"} className="mt-1">{invoice.status}</Badge>
                                        </div>
                                        <Button variant="ghost" size="icon" className="hover:bg-slate-700">
                                            <Download className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}