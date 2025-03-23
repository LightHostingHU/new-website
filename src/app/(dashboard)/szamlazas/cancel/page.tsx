
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/szamlazas");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold text-red-600">
        A fizetés megszakítva!
      </h1>
      <p className="text-gray-600">
        Átirányítás a számlázás oldalra 5 másodperc múlva...
      </p>
    </div>
  );
}
