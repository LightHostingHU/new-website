'use client'
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const {data: session, status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.push('/sign-in')
    }
  }, [status, router])
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1>Dashboard</h1>
      </div>
    </DashboardLayout>
  )
}
