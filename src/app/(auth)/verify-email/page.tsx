"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "sonner";

function VerifyEmailPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error("Hiányzó token.");
      router.push("/");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/verify-email?token=${token}`);
        const data = await res.json();

        if (res.status !== 200) {
          toast.error(data.message || "Érvénytelen token");
        } else {
          toast.success(data.message || "Sikeres email megerősítés!");
          router.push("/");
        }
      } catch (err) {
        toast.error("Hiba történt az ellenőrzés során");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen">
      {loading ? <p>Email megerősítés folyamatban...</p> : <p>Átirányítás...</p>}
    </div>
  );
}


export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
