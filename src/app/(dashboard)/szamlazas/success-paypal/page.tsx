"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

const SuccessPage = () => {
    const router = useRouter();
    const searchPrams = useSearchParams();
    const orderID = searchPrams.get("token");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        if (!orderID || updated) return;

        const handlePayPalSuccess = async () => {
            try {
                const response = await fetch("/api/capture-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderID }),
                });

                const data = await response.json();
                
            } catch (error) {
                console.error("PayPal Capture Error:", error);
                setError("Payment verification failed.");
            }
        };

        handlePayPalSuccess();
    }, [orderID, updated]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.push('/szamlazas')
        }, 5000)

        return () => clearTimeout(timeout)
    }, [router])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h1 className="mt-4 text-3xl font-bold">Sikeres fizetés!</h1>
                <p className="mt-2 text-gray-600">
                    Köszönjük a vásárlást. Átirányítjuk a számlázási oldalra...
                </p>
            </div>
        </div>
    )
};


const SuccessPageWrapper = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <SuccessPage />
    </Suspense>
);

export default SuccessPageWrapper;