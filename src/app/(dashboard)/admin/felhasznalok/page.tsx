"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner"
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSession } from "next-auth/react";


export default function FelhasznalokPage() {
    const { status } = useSession();
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<{ id: number; username: string; name: string; email: string; permission: string; suspended: boolean; balance?: number }[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<keyof User>("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
    const [balance, setBalance] = useState(0);
    const [newBalance, setNewBalance] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in")
        } else if (status === "authenticated") {
            const fetchUsers = async () => {
                try {
                    setIsLoading(true);
                    const response = await axios.get<{ id: number; username: string; name: string; email: string; permission: string; suspended: boolean; balance?: number }[]>('/api/users');
                    setUsers(response.data);
                    toast('Adminisztrátor', {
                        description: "Sikeresen betöltődött az felhasználói lista!",
                    });
                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                    toast('Adminisztrátor', {
                        description: "Hibatörtént a felhasználók betöltésekor!",
                    });
                }
            };
            fetchUsers();
        }
        
    }, [status, router]);

    const handleSort = (field: keyof User) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    interface User {
        id: number;
        username: string;
        name: string;
        email: string;
        permission: string;
        suspended: boolean;
        balance?: number;
    }

    interface SuspendResponse {
        success: boolean;
        message: string;
    }

    const handleSuspend = async (userId: number): Promise<void> => {
        try {
            const response = await axios.post<SuspendResponse>(`/api/users/${userId}/suspend`);
            setUsers(prevUsers => prevUsers.map(user =>
                user.id === userId ? { ...user, suspended: !user.suspended } : user
            ));
            toast('Adminisztrátor', {
                description: "Felhasználó státusza sikeresen módosítva!",
            });
        } catch (error) {
            toast('Adminisztrátor', {
                description: "Hiba történt a felhasználó felfüggesztésénél!",
            });
        }
    };

    interface BalanceResponse {
        data: number;
    }

    interface SelectedUser {
        id: number;
        username: string;
        name: string;
        email: string;
        permission: string;
        suspended: boolean;
        balance?: number;
    }

    const handleBalance = async (user: SelectedUser): Promise<void> => {
        try {
            console.log(user)
            const balance_response = await axios.get<number>(`/api/users/${user.id}/balance`);
            setBalance(balance_response.data);
            setSelectedUser(user);
            setIsBalanceDialogOpen(true);
        } catch (error) { }
    };

    const handleBalanceUpdate = async () => {
        try {
            console.log(newBalance)
            if (selectedUser) {
                await axios.put(`/api/users/${selectedUser.id}/balance`, { money: newBalance });
            }
            if (selectedUser) {
                setUsers(prevUsers => prevUsers.map(user =>
                    user.id === selectedUser.id ? { ...user, balance: Number(newBalance) } : user
                ));
            }
            setIsBalanceDialogOpen(false);
            toast('Adminisztrátor', {
                description: "Sikeresen módosítottad a felhasználó egyenlegét!",
            });
        } catch (error) {
            toast('Adminisztrátor', {
                description: "Hiba történt a felhasználó egyenelegének módosításánál!",
            });
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.id?.toString().includes(searchTerm) ||
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.permission?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const aValue = typeof a[sortField] === "string" ? a[sortField].toLowerCase() : a[sortField]?.toString() ?? "";
        const bValue = typeof b[sortField] === "string" ? b[sortField].toLowerCase() : b[sortField]?.toString() ?? "";
        if (sortDirection === "asc") {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });

    if (isLoading) {
        return <DashboardLayout>
            <div className="p-6 space-y-6 bg-slate-900 text-foreground min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        </DashboardLayout>
    }

    return (
        <DashboardLayout>
            <div className="p-6 min-h-screen bg-gradient-to-b dark:from-slate-900 dark:to-slate-800 from-slate-100 to-slate-200">
            <div className="mb-6">
                <Input
                    placeholder="Keresés..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm border dark:border-slate-600 border-slate-300 dark:bg-slate-800/50 bg-white dark:text-white text-slate-900 dark:placeholder:text-slate-400 placeholder:text-slate-500 dark:focus:border-slate-500 focus:border-slate-400 dark:focus:ring-slate-500 focus:ring-slate-400"
                />
            </div>

            <div className="rounded-lg border dark:border-slate-700 border-slate-300 overflow-hidden">
                <Table className="dark:bg-slate-800/30 bg-white">
                    <TableHeader>
                        <TableRow className="border-b dark:border-slate-700 border-slate-200 dark:hover:bg-slate-800/50 hover:bg-slate-50">
                            <TableHead
                                onClick={() => handleSort("id")}
                                className="cursor-pointer dark:hover:bg-slate-700/50 hover:bg-slate-100 dark:text-slate-200 text-slate-900 font-semibold py-4"
                            >
                                ID{" "}
                                {sortField === "id" && (
                                    <span className="text-blue-400 ml-1">
                                        {sortDirection === "asc" ? "↑" : "↓"}
                                    </span>
                                )}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("username")}
                                className="cursor-pointer dark:hover:bg-slate-700/50 hover:bg-slate-100 dark:text-slate-200 text-slate-900 font-semibold py-4"
                            >
                                Felhasználónév{" "}
                                {sortField === "username" && (
                                    <span className="text-blue-400 ml-1">
                                        {sortDirection === "asc" ? "↑" : "↓"}
                                    </span>
                                )}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("name")}
                                className="cursor-pointer dark:hover:bg-slate-700/50 hover:bg-slate-100 dark:text-slate-200 text-slate-900 font-semibold py-4"
                            >
                                Név{" "}
                                {sortField === "name" && (
                                    <span className="text-blue-400 ml-1">
                                        {sortDirection === "asc" ? "↑" : "↓"}
                                    </span>
                                )}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("email")}
                                className="cursor-pointer dark:hover:bg-slate-700/50 hover:bg-slate-100 dark:text-slate-200 text-slate-900 font-semibold py-4"
                            >
                                Email{" "}
                                {sortField === "email" && (
                                    <span className="text-blue-400 ml-1">
                                        {sortDirection === "asc" ? "↑" : "↓"}
                                    </span>
                                )}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("permission")}
                                className="cursor-pointer dark:hover:bg-slate-700/50 hover:bg-slate-100 dark:text-slate-200 text-slate-900 font-semibold py-4"
                            >
                                Szerepkör{" "}
                                {sortField === "permission" && (
                                    <span className="text-blue-400 ml-1">
                                        {sortDirection === "asc" ? "↑" : "↓"}
                                    </span>
                                )}
                            </TableHead>
                            <TableHead className="dark:text-slate-200 text-slate-900 font-semibold py-4">
                                Műveletek
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedUsers.map((user) => (
                            <TableRow
                                key={user.id}
                                className="border-b dark:border-slate-700 border-slate-200 dark:hover:bg-slate-700/30 hover:bg-slate-50 transition-colors"
                            >
                                <TableCell className="dark:text-slate-300 text-slate-900 py-3">
                                    {user.id}
                                </TableCell>
                                <TableCell className="dark:text-slate-300 text-slate-900 py-3">
                                    {user.username}
                                </TableCell>
                                <TableCell className="dark:text-slate-300 text-slate-900 py-3">
                                    {user.name}
                                </TableCell>
                                <TableCell className="dark:text-slate-300 text-slate-900 py-3">
                                    {user.email}
                                </TableCell>
                                <TableCell className="dark:text-slate-300 text-slate-900 py-3 capitalize">
                                    {user.permission}
                                </TableCell>
                                <TableCell className="py-3 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            router.push(`/admin/felhasznalok/${user.id}`)
                                        }
                                        className="text-blue-400 border-blue-400 dark:hover:bg-blue-400/10 hover:bg-blue-400/5 transition-colors"
                                    >
                                        Megtekintés
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSuspend(user.id)}
                                        className="text-yellow-400 border-yellow-400 dark:hover:bg-yellow-400/10 hover:bg-yellow-400/5 transition-colors"
                                    >
                                        {user.suspended ? 'Feloldás' : 'Felfüggesztés'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleBalance(user)}
                                        className="text-green-400 border-green-400 dark:hover:bg-green-400/10 hover:bg-green-400/5 transition-colors"
                                    >
                                        Egyenleg
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Egyenleg módosítása</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Jelenlegi egyenleg:</p>
                            <p className="text-lg font-semibold">{balance} Ft</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-2">Új egyenleg:</p>
                            <Input
                                type="number"
                                value={newBalance}
                                onChange={(e) => setNewBalance(e.target.value)}
                                placeholder="Adja meg az új egyenleget..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBalanceDialogOpen(false)}>
                            Mégse
                        </Button>
                        <Button onClick={handleBalanceUpdate}>
                            Mentés
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
         </DashboardLayout>
    );
}
